'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Printer, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from '@/lib/format';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ResultatData {
    produitsExploitation: number;
    chargesExploitation: number;
    resultatExploitation: number;
    produitsFinanciers: number;
    chargesFinancieres: number;
    resultatFinancier: number;
    rao: number;
    produitsHAO: number;
    chargesHAO: number;
    resultatHAO: number;
    impots: number;
    resultatNet: number;
}

export default function ResultatPageClient() {
    const [startDate, setStartDate] = useState<string>(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [resultat, setResultat] = useState<ResultatData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchResultat();
    }, []);

    const fetchResultat = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/accounting/reports/resultat?startDate=${startDate}&endDate=${endDate}`);
            if (!res.ok) throw new Error('Failed to fetch resultat');
            const data = await res.json();
            setResultat(data);
        } catch (error) {
            console.error(error);
            toast({ title: "Erreur", description: "Impossible de charger le compte de résultat.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        if (!resultat) return;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Compte de Résultat OHADA`, 14, 20);
        doc.setFontSize(12);
        doc.text(`Période: ${format(new Date(startDate), 'dd/MM/yyyy')} au ${format(new Date(endDate), 'dd/MM/yyyy')}`, 14, 30);

        const tableData = [
            ['PRODUITS D\'EXPLOITATION', formatCurrency(resultat.produitsExploitation)],
            ['CHARGES D\'EXPLOITATION', formatCurrency(resultat.chargesExploitation)],
            ['RÉSULTAT D\'EXPLOITATION', formatCurrency(resultat.resultatExploitation)],
            ['', ''],
            ['PRODUITS FINANCIERS', formatCurrency(resultat.produitsFinanciers)],
            ['CHARGES FINANCIÈRES', formatCurrency(resultat.chargesFinancieres)],
            ['RÉSULTAT FINANCIER', formatCurrency(resultat.resultatFinancier)],
            ['', ''],
            ['RÉSULTAT DES ACTIVITÉS ORDINAIRES (RAO)', formatCurrency(resultat.rao)],
            ['', ''],
            ['PRODUITS HAO', formatCurrency(resultat.produitsHAO)],
            ['CHARGES HAO', formatCurrency(resultat.chargesHAO)],
            ['RÉSULTAT HAO', formatCurrency(resultat.resultatHAO)],
            ['', ''],
            ['IMPÔTS SUR LE RÉSULTAT', formatCurrency(resultat.impots)],
            ['RÉSULTAT NET', formatCurrency(resultat.resultatNet)]
        ];

        autoTable(doc, {
            startY: 40,
            head: [['Rubrique', 'Montant']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            columnStyles: { 1: { halign: 'right' } },
            didParseCell: (data) => {
                const label = data.row.raw[0] as string;
                if (label.startsWith('RÉSULTAT') || label === 'PRODUITS D\'EXPLOITATION' || label === 'CHARGES D\'EXPLOITATION') {
                    data.cell.styles.fontStyle = 'bold';
                }
                if (label === 'RÉSULTAT NET') {
                    data.cell.styles.fillColor = [240, 240, 240];
                    data.cell.styles.fontSize = 10;
                }
            }
        });

        doc.save(`Compte_Resultat_${startDate}_${endDate}.pdf`);
    };

    if (!resultat && !loading) return null;

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
                    <Button onClick={fetchResultat} disabled={loading}>
                        <Search className="h-4 w-4 mr-2" /> Actualiser
                    </Button>
                </div>
                <Button onClick={handlePrint} variant="outline" disabled={!resultat}>
                    <Printer className="h-4 w-4 mr-2" /> Imprimer
                </Button>
            </div>

            {resultat && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 space-y-6">
                        {/* EXPLOITATION */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-1">Exploitation</h3>
                            <div className="flex justify-between items-center">
                                <span>Produits d'Exploitation</span>
                                <span className="font-medium text-green-600">+{formatCurrency(resultat.produitsExploitation)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Charges d'Exploitation</span>
                                <span className="font-medium text-red-600">-{formatCurrency(resultat.chargesExploitation)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 font-bold text-lg border-t">
                                <span>RÉSULTAT D'EXPLOITATION</span>
                                <span className={resultat.resultatExploitation >= 0 ? "text-green-700" : "text-red-700"}>
                                    {formatCurrency(resultat.resultatExploitation)}
                                </span>
                            </div>
                        </div>

                        {/* FINANCIER */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-1">Financier</h3>
                            <div className="flex justify-between items-center">
                                <span>Produits Financiers</span>
                                <span className="font-medium text-green-600">+{formatCurrency(resultat.produitsFinanciers)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Charges Financières</span>
                                <span className="font-medium text-red-600">-{formatCurrency(resultat.chargesFinancieres)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 font-bold border-t">
                                <span>RÉSULTAT FINANCIER</span>
                                <span className={resultat.resultatFinancier >= 0 ? "text-green-700" : "text-red-700"}>
                                    {formatCurrency(resultat.resultatFinancier)}
                                </span>
                            </div>
                        </div>

                        {/* RAO */}
                        <div className="bg-gray-50 p-4 rounded-md flex justify-between items-center font-bold">
                            <span>RÉSULTAT DES ACTIVITÉS ORDINAIRES (RAO)</span>
                            <span className={resultat.rao >= 0 ? "text-green-700" : "text-red-700"}>
                                {formatCurrency(resultat.rao)}
                            </span>
                        </div>

                        {/* HAO */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-1">Hors Activités Ordinaires (HAO)</h3>
                            <div className="flex justify-between items-center">
                                <span>Produits HAO</span>
                                <span className="font-medium text-green-600">+{formatCurrency(resultat.produitsHAO)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Charges HAO</span>
                                <span className="font-medium text-red-600">-{formatCurrency(resultat.chargesHAO)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 font-bold border-t">
                                <span>RÉSULTAT HAO</span>
                                <span className={resultat.resultatHAO >= 0 ? "text-green-700" : "text-red-700"}>
                                    {formatCurrency(resultat.resultatHAO)}
                                </span>
                            </div>
                        </div>

                        {/* IMPOTS */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <span>Impôts sur le résultat</span>
                            <span className="font-medium text-red-600">-{formatCurrency(resultat.impots)}</span>
                        </div>

                        {/* RESULTAT NET */}
                        <div className="bg-slate-900 text-white p-6 rounded-lg flex justify-between items-center text-xl font-bold shadow-md">
                            <span>RÉSULTAT NET</span>
                            <span className={resultat.resultatNet >= 0 ? "text-green-400" : "text-red-400"}>
                                {formatCurrency(resultat.resultatNet)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
