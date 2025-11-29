"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface LedgerEntry {
    id: string;
    date: string;
    reference: string;
    journalLabel: string;
    label: string;
    debit: number;
    credit: number;
}

interface AccountLedgerProps {
    accountCode: string;
    accountLabel: string;
}

export default function AccountLedger({ accountCode, accountLabel }: AccountLedgerProps) {
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const res = await fetch(`/api/accounting/entries?accountCode=${accountCode}`);
                if (res.ok) {
                    const data = await res.json();
                    setEntries(data);
                }
            } catch (error) {
                console.error("Failed to load ledger", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();
    }, [accountCode]);

    const calculateBalance = (index: number) => {
        let balance = 0;
        for (let i = 0; i <= index; i++) {
            balance += entries[i].debit - entries[i].credit;
        }
        return balance;
    };

    const handlePrint = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Grand Livre - Compte ${accountCode}`, 14, 20);
        doc.setFontSize(12);
        doc.text(accountLabel, 14, 30);
        doc.text(`Date d'impression : ${new Date().toLocaleDateString()}`, 14, 40);

        const tableData = entries.map((entry, index) => [
            new Date(entry.date).toLocaleDateString(),
            entry.reference,
            entry.journalLabel,
            entry.label,
            formatCurrency(entry.debit),
            formatCurrency(entry.credit),
            formatCurrency(calculateBalance(index))
        ]);

        (doc as any).autoTable({
            startY: 50,
            head: [['Date', 'Réf', 'Journal', 'Libellé', 'Débit', 'Crédit', 'Solde']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 8 },
            columnStyles: {
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right' }
            }
        });

        doc.save(`Grand_Livre_${accountCode}.pdf`);
    };

    if (loading) return <div>Chargement...</div>;

    if (entries.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">Aucune écriture pour ce compte.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" /> Imprimer
                </Button>
            </div>
            <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">Réf</th>
                            <th className="p-2 text-left">Journal</th>
                            <th className="p-2 text-left">Libellé</th>
                            <th className="p-2 text-right">Débit</th>
                            <th className="p-2 text-right">Crédit</th>
                            <th className="p-2 text-right">Solde</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => {
                            const balance = calculateBalance(index);
                            return (
                                <tr key={entry.id} className="border-b hover:bg-slate-50">
                                    <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
                                    <td className="p-2">{entry.reference}</td>
                                    <td className="p-2">{entry.journalLabel}</td>
                                    <td className="p-2">{entry.label}</td>
                                    <td className="p-2 text-right">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
                                    <td className="p-2 text-right">{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</td>
                                    <td className={`p-2 text-right font-medium ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {formatCurrency(balance)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="bg-slate-50 font-semibold">
                        <tr>
                            <td colSpan={4} className="p-2 text-right">Totaux</td>
                            <td className="p-2 text-right">{formatCurrency(entries.reduce((sum, e) => sum + e.debit, 0))}</td>
                            <td className="p-2 text-right">{formatCurrency(entries.reduce((sum, e) => sum + e.credit, 0))}</td>
                            <td className="p-2 text-right">{formatCurrency(calculateBalance(entries.length - 1))}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
