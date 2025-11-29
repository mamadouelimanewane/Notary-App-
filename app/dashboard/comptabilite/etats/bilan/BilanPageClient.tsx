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

interface BilanData {
    actif: {
        immobilise: number;
        stocks: number;
        creances: number;
        tresorerie: number;
        total: number;
    };
    passif: {
        capitaux: number;
        dettes: number;
        tresorerie: number;
        resultat: number;
        total: number;
    };
}

export default function BilanPageClient() {
    const [startDate, setStartDate] = useState<string>(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [bilan, setBilan] = useState<BilanData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBilan();
    }, []);

    const fetchBilan = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/accounting/reports/bilan?startDate=${startDate}&endDate=${endDate}`);
            if (!res.ok) throw new Error('Failed to fetch bilan');
            const data = await res.json();
            setBilan(data);
        } catch (error) {
            console.error(error);
            toast({ title: "Erreur", description: "Impossible de charger le bilan.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        if (!bilan) return;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Bilan OHADA`, 14, 20);
        doc.setFontSize(12);
        doc.text(`Période: ${format(new Date(startDate), 'dd/MM/yyyy')} au ${format(new Date(endDate), 'dd/MM/yyyy')}`, 14, 30);

        const actifData = [
            ['ACTIF IMMOBILISÉ', formatCurrency(bilan.actif.immobilise)],
            ['ACTIF CIRCULANT', ''],
            ['  Stocks', formatCurrency(bilan.actif.stocks)],
            ['  Créances', formatCurrency(bilan.actif.creances)],
            ['TRÉSORERIE ACTIF', formatCurrency(bilan.actif.tresorerie)],
            ['TOTAL ACTIF', formatCurrency(bilan.actif.total)]
        ];

        const passifData = [
            ['CAPITAUX PROPRES', formatCurrency(bilan.passif.capitaux)],
            ['RÉSULTAT NET', formatCurrency(bilan.passif.resultat)],
            ['DETTES', formatCurrency(bilan.passif.dettes)],
            ['TRÉSORERIE PASSIF', formatCurrency(bilan.passif.tresorerie)],
            ['TOTAL PASSIF', formatCurrency(bilan.passif.total)]
        ];

        // Combine for side-by-side display in PDF is tricky with autoTable, 
        // usually we print Actif then Passif or use two tables.
        // Let's print Actif then Passif for simplicity and clarity.

        doc.text("ACTIF", 14, 40);
        autoTable(doc, {
            startY: 45,
            head: [['Rubrique', 'Montant']],
            body: actifData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            columnStyles: { 1: { halign: 'right' } },
            didParseCell: (data) => {
                if (data.row.index === actifData.length - 1 || data.row.raw[0] === 'ACTIF IMMOBILISÉ' || data.row.raw[0] === 'ACTIF CIRCULANT') {
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text("PASSIF", 14, finalY);

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Rubrique', 'Montant']],
            body: passifData,
            theme: 'grid',
            headStyles: { fillColor: [192, 57, 43] },
            columnStyles: { 1: { halign: 'right' } },
            didParseCell: (data) => {
                if (data.row.index === passifData.length - 1 || data.row.raw[0] === 'CAPITAUX PROPRES') {
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        doc.save(`Bilan_${startDate}_${endDate}.pdf`);
    };

    if (!bilan && !loading) return null;

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
                    <Button onClick={fetchBilan} disabled={loading}>
                        <Search className="h-4 w-4 mr-2" /> Actualiser
                    </Button>
                </div>
                <Button onClick={handlePrint} variant="outline" disabled={!bilan}>
                    <Printer className="h-4 w-4 mr-2" /> Imprimer
                </Button>
            </div>

            {bilan && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ACTIF */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                            <h3 className="font-bold text-blue-900">ACTIF</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="font-medium">Actif Immobilisé</span>
                                <span>{formatCurrency(bilan.actif.immobilise)}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="font-medium text-gray-900">Actif Circulant</div>
                                <div className="flex justify-between items-center pl-4 text-sm text-gray-600">
                                    <span>Stocks</span>
                                    <span>{formatCurrency(bilan.actif.stocks)}</span>
                                </div>
                                <div className="flex justify-between items-center pl-4 text-sm text-gray-600">
                                    <span>Créances</span>
                                    <span>{formatCurrency(bilan.actif.creances)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="font-medium">Trésorerie Actif</span>
                                <span>{formatCurrency(bilan.actif.tresorerie)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 font-bold text-lg text-blue-900">
                                <span>TOTAL ACTIF</span>
                                <span>{formatCurrency(bilan.actif.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* PASSIF */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                            <h3 className="font-bold text-red-900">PASSIF</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="font-medium">Capitaux Propres</span>
                                <span>{formatCurrency(bilan.passif.capitaux)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b bg-yellow-50 -mx-6 px-6">
                                <span className="font-medium">Résultat Net</span>
                                <span className={bilan.passif.resultat >= 0 ? "text-green-600" : "text-red-600"}>
                                    {formatCurrency(bilan.passif.resultat)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="font-medium">Dettes</span>
                                <span>{formatCurrency(bilan.passif.dettes)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="font-medium">Trésorerie Passif</span>
                                <span>{formatCurrency(bilan.passif.tresorerie)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 font-bold text-lg text-red-900">
                                <span>TOTAL PASSIF</span>
                                <span>{formatCurrency(bilan.passif.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
