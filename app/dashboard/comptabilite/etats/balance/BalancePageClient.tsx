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
import { BalanceLine } from '@/lib/accounting/types';

export default function BalancePageClient() {
    const [startDate, setStartDate] = useState<string>(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [balanceLines, setBalanceLines] = useState<BalanceLine[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/accounting/reports/balance?startDate=${startDate}&endDate=${endDate}`);
            if (!res.ok) throw new Error('Failed to fetch balance');
            const data = await res.json();
            setBalanceLines(data);
        } catch (error) {
            console.error(error);
            toast({ title: "Erreur", description: "Impossible de charger la balance.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape

        doc.setFontSize(18);
        doc.text(`Balance Générale`, 14, 20);
        doc.setFontSize(12);
        doc.text(`Période: ${format(new Date(startDate), 'dd/MM/yyyy')} au ${format(new Date(endDate), 'dd/MM/yyyy')}`, 14, 30);

        const tableData = balanceLines.map(line => [
            line.accountCode,
            line.accountLabel,
            line.debitOpening ? formatCurrency(line.debitOpening) : '',
            line.creditOpening ? formatCurrency(line.creditOpening) : '',
            line.debitMovement ? formatCurrency(line.debitMovement) : '',
            line.creditMovement ? formatCurrency(line.creditMovement) : '',
            line.debitClosing ? formatCurrency(line.debitClosing) : '',
            line.creditClosing ? formatCurrency(line.creditClosing) : ''
        ]);

        // Calculate totals
        const totals = balanceLines.reduce((acc, line) => ({
            debitOpening: acc.debitOpening + line.debitOpening,
            creditOpening: acc.creditOpening + line.creditOpening,
            debitMovement: acc.debitMovement + line.debitMovement,
            creditMovement: acc.creditMovement + line.creditMovement,
            debitClosing: acc.debitClosing + line.debitClosing,
            creditClosing: acc.creditClosing + line.creditClosing
        }), { debitOpening: 0, creditOpening: 0, debitMovement: 0, creditMovement: 0, debitClosing: 0, creditClosing: 0 });

        tableData.push([
            'TOTAUX',
            '',
            formatCurrency(totals.debitOpening),
            formatCurrency(totals.creditOpening),
            formatCurrency(totals.debitMovement),
            formatCurrency(totals.creditMovement),
            formatCurrency(totals.debitClosing),
            formatCurrency(totals.creditClosing)
        ]);

        autoTable(doc, {
            startY: 40,
            head: [[
                { content: 'Compte', rowSpan: 2, styles: { valign: 'middle' } },
                { content: 'Libellé', rowSpan: 2, styles: { valign: 'middle' } },
                { content: 'Solde Ouverture', colSpan: 2, styles: { halign: 'center' } },
                { content: 'Mouvements', colSpan: 2, styles: { halign: 'center' } },
                { content: 'Solde Clôture', colSpan: 2, styles: { halign: 'center' } }
            ], [
                'Débit', 'Crédit', 'Débit', 'Crédit', 'Débit', 'Crédit'
            ]],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185], valign: 'middle', halign: 'center' },
            columnStyles: {
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right' },
                7: { halign: 'right' }
            },
            didParseCell: (data) => {
                if (data.row.index === tableData.length - 1) {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.fillColor = [240, 240, 240];
                }
            }
        });

        doc.save(`Balance_${startDate}_${endDate}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="flex gap-4 items-end">
                    <div className="space-y-2">
                        <Label>Date Début</Label>
                        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Date Fin</Label>
                        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <Button onClick={fetchBalance} disabled={loading}>
                        <Search className="h-4 w-4 mr-2" /> Actualiser
                    </Button>
                </div>
                <Button onClick={handlePrint} variant="outline">
                    <Printer className="h-4 w-4 mr-2" /> Imprimer
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th rowSpan={2} className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-r">Compte</th>
                                <th rowSpan={2} className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-r">Libellé</th>
                                <th colSpan={2} className="px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider border-b border-r">Solde Ouverture</th>
                                <th colSpan={2} className="px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider border-b border-r">Mouvements</th>
                                <th colSpan={2} className="px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider border-b">Solde Clôture</th>
                            </tr>
                            <tr>
                                <th className="px-4 py-2 text-right font-medium text-gray-500 border-r">Débit</th>
                                <th className="px-4 py-2 text-right font-medium text-gray-500 border-r">Crédit</th>
                                <th className="px-4 py-2 text-right font-medium text-gray-500 border-r">Débit</th>
                                <th className="px-4 py-2 text-right font-medium text-gray-500 border-r">Crédit</th>
                                <th className="px-4 py-2 text-right font-medium text-gray-500 border-r">Débit</th>
                                <th className="px-4 py-2 text-right font-medium text-gray-500">Crédit</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {balanceLines.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        Aucune donnée pour cette période.
                                    </td>
                                </tr>
                            ) : (
                                balanceLines.map((line) => (
                                    <tr key={line.accountCode} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 font-mono text-gray-900 border-r">{line.accountCode}</td>
                                        <td className="px-4 py-2 text-gray-900 border-r">{line.accountLabel}</td>
                                        <td className="px-4 py-2 text-right text-gray-600 border-r">{line.debitOpening ? formatCurrency(line.debitOpening) : '-'}</td>
                                        <td className="px-4 py-2 text-right text-gray-600 border-r">{line.creditOpening ? formatCurrency(line.creditOpening) : '-'}</td>
                                        <td className="px-4 py-2 text-right text-gray-600 border-r">{line.debitMovement ? formatCurrency(line.debitMovement) : '-'}</td>
                                        <td className="px-4 py-2 text-right text-gray-600 border-r">{line.creditMovement ? formatCurrency(line.creditMovement) : '-'}</td>
                                        <td className="px-4 py-2 text-right font-medium text-gray-900 border-r">{line.debitClosing ? formatCurrency(line.debitClosing) : '-'}</td>
                                        <td className="px-4 py-2 text-right font-medium text-gray-900">{line.creditClosing ? formatCurrency(line.creditClosing) : '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot className="bg-gray-100 font-semibold">
                            <tr>
                                <td colSpan={2} className="px-4 py-3 text-right border-r">TOTAUX</td>
                                <td className="px-4 py-3 text-right border-r">
                                    {formatCurrency(balanceLines.reduce((sum, l) => sum + l.debitOpening, 0))}
                                </td>
                                <td className="px-4 py-3 text-right border-r">
                                    {formatCurrency(balanceLines.reduce((sum, l) => sum + l.creditOpening, 0))}
                                </td>
                                <td className="px-4 py-3 text-right border-r">
                                    {formatCurrency(balanceLines.reduce((sum, l) => sum + l.debitMovement, 0))}
                                </td>
                                <td className="px-4 py-3 text-right border-r">
                                    {formatCurrency(balanceLines.reduce((sum, l) => sum + l.creditMovement, 0))}
                                </td>
                                <td className="px-4 py-3 text-right border-r">
                                    {formatCurrency(balanceLines.reduce((sum, l) => sum + l.debitClosing, 0))}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {formatCurrency(balanceLines.reduce((sum, l) => sum + l.creditClosing, 0))}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
