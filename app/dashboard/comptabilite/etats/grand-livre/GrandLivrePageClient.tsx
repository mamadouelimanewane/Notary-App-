'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Printer, Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from '@/lib/format';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface LedgerEntry {
    id: string;
    date: string;
    reference: string;
    journalLabel: string;
    journalCode: string;
    label: string;
    debit: number;
    credit: number;
}

interface LedgerAccount {
    code: string;
    label: string;
    openingBalance: number;
    entries: LedgerEntry[];
    totalDebit: number;
    totalCredit: number;
    closingBalance: number;
}

export default function GrandLivrePageClient() {
    const [startDate, setStartDate] = useState<string>(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [fromAccount, setFromAccount] = useState<string>('');
    const [toAccount, setToAccount] = useState<string>('');
    const [ledgerData, setLedgerData] = useState<LedgerAccount[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLedger();
    }, []);

    const fetchLedger = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                startDate,
                endDate,
                ...(fromAccount && { fromAccount }),
                ...(toAccount && { toAccount })
            });
            const res = await fetch(`/api/accounting/reports/ledger?${params}`);
            if (!res.ok) throw new Error('Failed to fetch ledger');
            const data = await res.json();
            setLedgerData(data);
        } catch (error) {
            console.error(error);
            toast({ title: "Erreur", description: "Impossible de charger le grand livre.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Grand Livre Général`, 14, 20);
        doc.setFontSize(12);
        doc.text(`Période: ${format(new Date(startDate), 'dd/MM/yyyy')} au ${format(new Date(endDate), 'dd/MM/yyyy')}`, 14, 30);

        let yPos = 40;

        ledgerData.forEach((account) => {
            // Check if we need a new page
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            // Account Header
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(`${account.code} - ${account.label}`, 14, yPos);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Solde au ${format(new Date(startDate), 'dd/MM/yyyy')}: ${formatCurrency(account.openingBalance)}`, 140, yPos, { align: 'right' });

            yPos += 5;

            const tableData = account.entries.map((entry, index) => {
                // Calculate progressive balance for display if needed, but here we just list entries
                // For simplicity in PDF we might just list debit/credit
                return [
                    format(new Date(entry.date), 'dd/MM/yyyy'),
                    entry.reference,
                    entry.journalCode,
                    entry.label,
                    entry.debit ? formatCurrency(entry.debit) : '',
                    entry.credit ? formatCurrency(entry.credit) : ''
                ];
            });

            // Add totals row
            tableData.push([
                'TOTAUX', '', '', '',
                formatCurrency(account.totalDebit),
                formatCurrency(account.totalCredit)
            ]);

            // Add closing balance row
            tableData.push([
                'SOLDE CLÔTURE', '', '', '',
                account.closingBalance > 0 ? formatCurrency(account.closingBalance) : '',
                account.closingBalance < 0 ? formatCurrency(Math.abs(account.closingBalance)) : ''
            ]);

            autoTable(doc, {
                startY: yPos,
                head: [['Date', 'Réf', 'Jnl', 'Libellé', 'Débit', 'Crédit']],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
                columnStyles: {
                    4: { halign: 'right' },
                    5: { halign: 'right' }
                },
                margin: { left: 14 },
                didParseCell: (data) => {
                    // Bold for totals and closing balance
                    if (data.row.index >= tableData.length - 2) {
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            });

            // Update yPos for next account
            yPos = (doc as any).lastAutoTable.finalY + 15;
        });

        doc.save(`Grand_Livre_${startDate}_${endDate}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="space-y-2">
                        <Label>Date Début</Label>
                        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Date Fin</Label>
                        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Compte Début</Label>
                        <Input placeholder="Ex: 401" value={fromAccount} onChange={e => setFromAccount(e.target.value)} className="w-24" />
                    </div>
                    <div className="space-y-2">
                        <Label>Compte Fin</Label>
                        <Input placeholder="Ex: 512" value={toAccount} onChange={e => setToAccount(e.target.value)} className="w-24" />
                    </div>
                    <Button onClick={fetchLedger} disabled={loading}>
                        <Search className="h-4 w-4 mr-2" /> Actualiser
                    </Button>
                </div>
                <Button onClick={handlePrint} variant="outline">
                    <Printer className="h-4 w-4 mr-2" /> Imprimer
                </Button>
            </div>

            <div className="space-y-8">
                {ledgerData.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
                        Aucune donnée trouvée pour les critères sélectionnés.
                    </div>
                ) : (
                    ledgerData.map(account => (
                        <div key={account.code} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">{account.code} - {account.label}</h3>
                                <div className="text-sm text-gray-600">
                                    Solde initial : <span className={account.openingBalance < 0 ? 'text-red-600' : 'text-green-600'}>{formatCurrency(account.openingBalance)}</span>
                                </div>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-2 text-left font-medium text-gray-500">Date</th>
                                        <th className="px-6 py-2 text-left font-medium text-gray-500">Réf</th>
                                        <th className="px-6 py-2 text-left font-medium text-gray-500">Jnl</th>
                                        <th className="px-6 py-2 text-left font-medium text-gray-500">Libellé</th>
                                        <th className="px-6 py-2 text-right font-medium text-gray-500">Débit</th>
                                        <th className="px-6 py-2 text-right font-medium text-gray-500">Crédit</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {account.entries.map(entry => (
                                        <tr key={entry.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-2 text-gray-900">{format(new Date(entry.date), 'dd/MM/yyyy')}</td>
                                            <td className="px-6 py-2 text-gray-500">{entry.reference}</td>
                                            <td className="px-6 py-2 text-gray-500">{entry.journalCode}</td>
                                            <td className="px-6 py-2 text-gray-900">{entry.label}</td>
                                            <td className="px-6 py-2 text-right text-gray-900">{entry.debit ? formatCurrency(entry.debit) : '-'}</td>
                                            <td className="px-6 py-2 text-right text-gray-900">{entry.credit ? formatCurrency(entry.credit) : '-'}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 font-medium">
                                        <td colSpan={4} className="px-6 py-2 text-right">Mouvements de la période</td>
                                        <td className="px-6 py-2 text-right">{formatCurrency(account.totalDebit)}</td>
                                        <td className="px-6 py-2 text-right">{formatCurrency(account.totalCredit)}</td>
                                    </tr>
                                    <tr className="bg-gray-100 font-bold">
                                        <td colSpan={4} className="px-6 py-2 text-right">Solde de clôture</td>
                                        <td className="px-6 py-2 text-right text-green-700">{account.closingBalance > 0 ? formatCurrency(account.closingBalance) : '-'}</td>
                                        <td className="px-6 py-2 text-right text-red-700">{account.closingBalance < 0 ? formatCurrency(Math.abs(account.closingBalance)) : '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
