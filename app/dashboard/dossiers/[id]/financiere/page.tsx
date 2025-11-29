'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { FileText, Download, Euro, TrendingUp, TrendingDown } from 'lucide-react';

interface Invoice {
    id: string;
    number: string;
    date: string;
    status: string;
    totalTTC: number;
    paidAmount: number;
    remainingAmount: number;
}

interface Payment {
    id: string;
    date: string;
    amount: number;
    method: string;
    reference?: string;
}

interface JournalEntry {
    id: string;
    date: string;
    reference: string;
    label: string;
    entries: {
        accountCode: string;
        accountLabel: string;
        debit: number;
        credit: number;
    }[];
}

export default function DossierFinancialSheetPage() {
    const params = useParams();
    const dossierId = params.id as string;

    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFinancialData();
    }, [dossierId]);

    const loadFinancialData = async () => {
        try {
            const response = await fetch(`/api/dossiers/${dossierId}/financial-sheet`);
            const data = await response.json();
            setInvoices(data.invoices || []);
            setPayments(data.payments || []);
            setJournalEntries(data.journalEntries || []);
        } catch (error) {
            console.error('Erreur lors du chargement des données financières:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalTTC, 0);
    const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
    const balance = totalInvoiced - totalPaid;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string }> = {
            PAID: { variant: 'default', label: 'Payée' },
            PARTIALLY_PAID: { variant: 'secondary', label: 'Partiellement payée' },
            SENT: { variant: 'outline', label: 'Envoyée' },
            DRAFT: { variant: 'outline', label: 'Brouillon' },
            OVERDUE: { variant: 'destructive', label: 'En retard' },
        };
        const config = variants[status] || { variant: 'outline', label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const handleExportPDF = async () => {
        // TODO: Implement PDF export
        alert('Export PDF en cours de développement');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fiche Financière</h1>
                    <p className="text-slate-600 mt-1">Dossier #{dossierId}</p>
                </div>
                <Button onClick={handleExportPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter en PDF
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Facturé</CardTitle>
                        <FileText className="h-4 w-4 text-slate-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalInvoiced)}</div>
                        <p className="text-xs text-slate-600 mt-1">
                            {invoices.length} facture(s)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Payé</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
                        <p className="text-xs text-slate-600 mt-1">
                            {payments.length} paiement(s)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solde Restant</CardTitle>
                        <TrendingDown className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {formatCurrency(balance)}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                            {balance > 0 ? 'À encaisser' : 'Soldé'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Factures</CardTitle>
                </CardHeader>
                <CardContent>
                    {invoices.length === 0 ? (
                        <p className="text-center text-slate-600 py-8">Aucune facture pour ce dossier</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Numéro</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Montant TTC</TableHead>
                                    <TableHead className="text-right">Payé</TableHead>
                                    <TableHead className="text-right">Restant</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.number}</TableCell>
                                        <TableCell>{formatDate(invoice.date)}</TableCell>
                                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(invoice.totalTTC)}</TableCell>
                                        <TableCell className="text-right text-green-600">
                                            {formatCurrency(invoice.paidAmount)}
                                        </TableCell>
                                        <TableCell className="text-right text-orange-600">
                                            {formatCurrency(invoice.remainingAmount)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Paiements</CardTitle>
                </CardHeader>
                <CardContent>
                    {payments.length === 0 ? (
                        <p className="text-center text-slate-600 py-8">Aucun paiement enregistré</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Méthode</TableHead>
                                    <TableHead>Référence</TableHead>
                                    <TableHead className="text-right">Montant</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{formatDate(payment.date)}</TableCell>
                                        <TableCell>{payment.method}</TableCell>
                                        <TableCell className="text-slate-600">
                                            {payment.reference || '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-green-600">
                                            {formatCurrency(payment.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Journal Entries */}
            <Card>
                <CardHeader>
                    <CardTitle>Écritures Comptables</CardTitle>
                </CardHeader>
                <CardContent>
                    {journalEntries.length === 0 ? (
                        <p className="text-center text-slate-600 py-8">Aucune écriture comptable</p>
                    ) : (
                        <div className="space-y-4">
                            {journalEntries.map((entry) => (
                                <div key={entry.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <span className="font-medium">{entry.reference}</span>
                                            <span className="text-slate-600 ml-2">- {entry.label}</span>
                                        </div>
                                        <span className="text-sm text-slate-600">{formatDate(entry.date)}</span>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Compte</TableHead>
                                                <TableHead>Libellé</TableHead>
                                                <TableHead className="text-right">Débit</TableHead>
                                                <TableHead className="text-right">Crédit</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {entry.entries.map((line, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="font-mono text-sm">
                                                        {line.accountCode}
                                                    </TableCell>
                                                    <TableCell>{line.accountLabel}</TableCell>
                                                    <TableCell className="text-right">
                                                        {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
