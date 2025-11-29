'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, Printer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from '@/lib/format';
import { ActTemplate } from '@/lib/taxation/types';
import { SimulationResult } from '@/lib/taxation/engine';

export default function SimulationPageClient() {
    const [templates, setTemplates] = useState<ActTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/taxation/templates')
            .then(res => res.json())
            .then(data => setTemplates(data))
            .catch(err => console.error(err));
    }, []);

    const handleSimulate = async () => {
        if (!selectedTemplateId || !amount) {
            toast({ title: "Attention", description: "Veuillez sélectionner un modèle et saisir un montant.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/taxation/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templateId: selectedTemplateId, amount })
            });

            if (!res.ok) throw new Error('Simulation failed');
            const data = await res.json();
            setResult(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Erreur lors de la simulation.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Paramètres de la Simulation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Type d'Acte</Label>
                            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir un modèle..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Valeur de l'Acte / Prix de Vente</Label>
                            <Input
                                type="number"
                                value={amount || ''}
                                onChange={e => setAmount(parseFloat(e.target.value))}
                                placeholder="ex: 50000000"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSimulate} disabled={loading} className="w-full md:w-auto">
                        {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Calculator className="h-4 w-4 mr-2" />}
                        Calculer les Frais
                    </Button>
                </CardContent>
            </Card>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Résultat Détaillé</h2>
                        <Button variant="outline" onClick={() => window.print()}>
                            <Printer className="h-4 w-4 mr-2" /> Imprimer
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Summary Card */}
                        <Card className="bg-slate-900 text-white border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Total à Payer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-green-400">
                                    {formatCurrency(result.grandTotal)}
                                </div>
                                <p className="text-slate-400 mt-2">Dont TVA et Taxes incluses</p>
                            </CardContent>
                        </Card>

                        {/* Breakdown by Section */}
                        <div className="space-y-4">
                            {result.sections.map((section, idx) => (
                                <Card key={idx}>
                                    <CardHeader className="py-3 bg-gray-50 border-b">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-base">{section.label}</CardTitle>
                                            <span className="font-bold">{formatCurrency(section.items.reduce((acc, item) => acc + item.totalWithTax, 0))}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <table className="w-full text-sm">
                                            <tbody>
                                                {section.items.map((item, i) => (
                                                    <React.Fragment key={i}>
                                                        <tr className="border-b last:border-0">
                                                            <td className="p-3 pl-6">{item.label}</td>
                                                            <td className="p-3 text-right font-medium">{formatCurrency(item.baseAmount)}</td>
                                                        </tr>
                                                        {item.taxes.map((tax, t) => (
                                                            <tr key={`${i}-${t}`} className="bg-gray-50/50 text-xs text-gray-500">
                                                                <td className="p-1 pl-8 flex items-center gap-1">
                                                                    <span>↳ {tax.label}</span>
                                                                </td>
                                                                <td className="p-1 text-right">{formatCurrency(tax.amount)}</td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </table>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
