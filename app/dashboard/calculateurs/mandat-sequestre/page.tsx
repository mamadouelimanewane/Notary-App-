'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, Lock } from 'lucide-react';
import { calculerMandatSequestre, formaterMontantSequestre, MandatSequestreInput } from '@/lib/calculators/mandat-sequestre';

export default function MandatSequestrePage() {
    const [formData, setFormData] = useState<MandatSequestreInput>({
        montant: 10000000
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerMandatSequestre(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Lock className="h-8 w-8 text-emerald-600" />
                    Calcul Frais - Mandat du Séquestre
                </h1>
                <p className="text-muted-foreground mt-1">Barème notarial pour mandat de séquestre</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulaire */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Données de calcul</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Montant séquestré (FCFA)</label>
                            <input
                                type="number"
                                value={formData.montant}
                                onChange={(e) => setFormData({ ...formData, montant: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="10 000 000"
                            />
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 font-medium"
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
                            <p>Entrez le montant et cliquez sur "Calculer"</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {result.lignes.map((ligne: any, index: number) => (
                                <div
                                    key={index}
                                    className={`flex justify-between p-2 rounded ${ligne.isBold
                                            ? ligne.label === 'TOTAL'
                                                ? 'bg-emerald-100 border border-emerald-300'
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
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-emerald-700 text-lg' : ''
                                        }`}>
                                        {formaterMontantSequestre(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-emerald-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - Mandat du Séquestre</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <p className="font-semibold mb-2">Tranches d'honoraires :</p>
                        <ul className="space-y-1">
                            <li>• 0 à 20 millions : <strong>1,50%</strong></li>
                            <li>• 20 à 80 millions : <strong>1,00%</strong></li>
                            <li>• 80 à 300 millions : <strong>0,50%</strong></li>
                            <li>• Plus de 300 millions : <strong>0,25%</strong></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Autres frais :</p>
                        <ul className="space-y-1">
                            <li>• TVA : <strong>18%</strong> sur honoraires</li>
                            <li>• Divers : <strong>10 000 FCFA</strong></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-emerald-200">
                    <p className="text-sm"><strong>Note :</strong> Le mandat de séquestre est un acte par lequel une personne remet une chose contentieuse à un tiers qui s'oblige à la rendre après la contestation terminée.</p>
                </div>
            </div>
        </div>
    );
}
