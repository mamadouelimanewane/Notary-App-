'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, Building2 } from 'lucide-react';
import { calculerRGTCopro, formaterMontantRGT, RGTCoproInput } from '@/lib/calculators/rgt-copro';

export default function RGTCoproPage() {
    const [formData, setFormData] = useState<RGTCoproInput>({
        prix: 100000000,
        nombreTitres: 5
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerRGTCopro(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Building2 className="h-8 w-8 text-teal-600" />
                    Calcul Frais et Honoraires - RGT Copropriété
                </h1>
                <p className="text-muted-foreground mt-1">Registre Général des Titres - Copropriété</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulaire */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Données de calcul</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Prix (FCFA)</label>
                            <input
                                type="number"
                                value={formData.prix}
                                onChange={(e) => setFormData({ ...formData, prix: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="100 000 000"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Nombre de titres créés</label>
                            <input
                                type="number"
                                value={formData.nombreTitres}
                                onChange={(e) => setFormData({ ...formData, nombreTitres: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="5"
                                min="1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Coût par titre : 26 500 FCFA
                            </p>
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-teal-600 text-white hover:bg-teal-700 h-10 px-4 font-medium"
                        >
                            <Calculator className="mr-2 h-4 w-4" />
                            Calculer
                        </button>
                    </div>
                </div>

                {/* Résultats */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg">Provision sur frais et honoraires</h2>
                        {result && (
                            <button
                                onClick={handleExportPDF}
                                className="inline-flex items-center justify-center rounded-md border h-9 px-3 text-sm"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export PDF
                            </button>
                        )}
                    </div>

                    {!result ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Remplissez le formulaire et cliquez sur "Calculer"</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {result.lignes.map((ligne: any, index: number) => (
                                <div
                                    key={index}
                                    className={`flex justify-between p-2 rounded ${ligne.isBold
                                            ? ligne.label === 'TOTAL'
                                                ? 'bg-teal-100 border border-teal-300'
                                                : 'bg-slate-100 font-semibold'
                                            : 'bg-slate-50'
                                        }`}
                                >
                                    <div className="flex-1">
                                        <span className={ligne.isBold ? 'font-bold' : ''}>
                                            {ligne.label}
                                        </span>
                                        {ligne.detail && (
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                {ligne.detail}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-teal-700 text-lg' : ''
                                        }`}>
                                        {formaterMontantRGT(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-teal-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - RGT Copropriété</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <p className="font-semibold mb-2">Tranches de prix :</p>
                        <ul className="space-y-1">
                            <li>• 1 à 20 millions : <strong>2,25%</strong></li>
                            <li>• 20 à 80 millions : <strong>1,50%</strong></li>
                            <li>• 80 à 300 millions : <strong>0,75%</strong></li>
                            <li>• Plus de 300 millions : <strong>0,375%</strong></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Frais spécifiques :</p>
                        <ul className="space-y-1">
                            <li>• TVA : <strong>18%</strong> sur honoraires</li>
                            <li>• Enregistrement : <strong>5 000 FCFA</strong></li>
                            <li>• Coût par titre : <strong>26 500 FCFA</strong></li>
                            <li>• Conservation : <strong>1%</strong> (prix + titres)</li>
                            <li>• Expéditions : <strong>50 000 FCFA</strong></li>
                            <li>• Divers : <strong>50 000 FCFA</strong></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-teal-200">
                    <p className="text-sm"><strong>Note :</strong> Le RGT Copropriété concerne l'immatriculation des lots de copropriété au Registre Général des Titres. La conservation foncière est calculée sur la base du prix + le coût des titres créés (nombre de titres × 26 500 FCFA).</p>
                </div>
            </div>
        </div>
    );
}
