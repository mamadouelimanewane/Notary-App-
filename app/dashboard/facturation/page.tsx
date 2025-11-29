'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Invoice {
    id: string;
    number: string;
    acteId: string;
    dossierId: string;
    clientId: string;
    date: string;
    dueDate: string;
    status: 'DRAFT' | 'SENT' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';
    totalEmoluments: number;
    totalDebours: number;
    totalDroits: number;
    totalTVA: number;
    totalTTC: number;
    paidAmount: number;
    remainingAmount: number;
}

export default function BillingPage() {
    const router = useRouter();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0
    });

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const response = await fetch('/api/billing/invoices');
            if (!response.ok) {
                throw new Error('Failed to fetch invoices');
            }
            const data = await response.json();

            // Ensure data is an array
            if (Array.isArray(data)) {
                setInvoices(data);

                // Calculate stats
                const total = data.reduce((sum: number, inv: Invoice) => sum + inv.totalTTC, 0);
                const paid = data.filter((inv: Invoice) => inv.status === 'PAID').reduce((sum: number, inv: Invoice) => sum + inv.totalTTC, 0);
                const pending = data.filter((inv: Invoice) => inv.status === 'SENT' || inv.status === 'DRAFT').reduce((sum: number, inv: Invoice) => sum + inv.remainingAmount, 0);
                const overdue = data.filter((inv: Invoice) => inv.status === 'OVERDUE').reduce((sum: number, inv: Invoice) => sum + inv.remainingAmount, 0);

                setStats({ total, paid, pending, overdue });
            } else {
                console.error('Invalid data format:', data);
                setInvoices([]);
            }
        } catch (error) {
            console.error('Error loading invoices:', error);
            setInvoices([]); // Ensure invoices is always an array
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: Invoice['status']) => {
        const variants: Record<Invoice['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
            DRAFT: { label: 'Brouillon', variant: 'secondary' },
            SENT: { label: 'Envoyée', variant: 'default' },
            PAID: { label: 'Payée', variant: 'default' },
            PARTIALLY_PAID: { label: 'Partiellement payée', variant: 'outline' },
            OVERDUE: { label: 'En retard', variant: 'destructive' },
            CANCELLED: { label: 'Annulée', variant: 'destructive' }
        };

        const config = variants[status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-serif text-primary">Facturation</h1>
                    <p className="text-muted-foreground">Gestion des factures et paiements</p>
                </div>
                <Button onClick={() => router.push('/dashboard/facturation/new')} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Facture
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Facturé</CardTitle>
                        <span className="text-xs font-semibold text-muted-foreground">FCFA</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payé</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.paid)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.pending)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Retard</CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdue)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Factures</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numéro</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Échéance</TableHead>
                                <TableHead>Montant TTC</TableHead>
                                <TableHead>Payé</TableHead>
                                <TableHead>Reste</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                        Aucune facture trouvée
                                    </TableCell>
                                </TableRow>
                            ) : (
                                invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.number}</TableCell>
                                        <TableCell>{new Date(invoice.date).toLocaleDateString('fr-FR')}</TableCell>
                                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</TableCell>
                                        <TableCell>{formatCurrency(invoice.totalTTC)}</TableCell>
                                        <TableCell>{formatCurrency(invoice.paidAmount)}</TableCell>
                                        <TableCell>{formatCurrency(invoice.remainingAmount)}</TableCell>
                                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.push(`/dashboard/facturation/${invoice.id}`)}
                                            >
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
