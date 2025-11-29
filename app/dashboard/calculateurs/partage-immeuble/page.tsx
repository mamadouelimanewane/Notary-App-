'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, SplitSquareHorizontal } from 'lucide-react';
import { calculerPartageImmeuble, formaterMontantPartage, PartageImmeubleInput } from '@/lib/calculators/partage-immeuble';

export default function PartageImmeublePage() {
    const [formData, setFormData] = useState<PartageImmeubleInput>({
        valeurActifBrut: 10000000,
        valeurPassif: 0,
        soulte: 100000,
        nombreParcelles: 1,
        conservationFonciere: true
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerPartageImmeuble(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <SplitSquareHorizontal className="h-8 w-8 text-cyan-600" />
                    Calcul Frais et Honoraires - Partage d'Immeuble
                </h1>
                <p className="text-muted-foreground mt-1">Barème notarial pour partage d'immeuble avec soulte</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulaire */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Données de calcul</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Valeur Actif Brut (FCFA)</label>
                            <input
                                type="number"
                                value={formData.valeurActifBrut}
                                onChange={(e) => setFormData({ ...formData, valeurActifBrut: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="10 000 000"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Valeur Passif (FCFA)</label>
                            <input
                                type="number"
                                value={formData.valeurPassif}
                                onChange={(e) => setFormData({ ...formData, valeurPassif: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="0"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Déduit pour le calcul des droits de mutation
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Soulte (FCFA)</label>
                            <input
                                type="number"
                                value={formData.soulte}
                                onChange={(e) => setFormData({ ...formData, soulte: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="100 000"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Taxée à 15%
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Nombre de parcelles</label>
                            <input
                                type="number"
                                value={formData.nombreParcelles}
                                onChange={(e) => setFormData({ ...formData, nombreParcelles: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="1"
                                min="1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                20 000 FCFA par parcelle
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="conservation"
                                checked={formData.conservationFonciere}
                                onChange={(e) => setFormData({ ...formData, conservationFonciere: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="conservation" className="text-sm font-medium">
                                Conservation foncière (1% de Actif Brut + 7 000)
                            </label>
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-cyan-600 text-white hover:bg-cyan-700 h-10 px-4 font-medium"
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
                                                ? 'bg-cyan-100 border border-cyan-300'
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
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-cyan-700 text-lg' : ''
                                        }`}>
                                        {formaterMontantPartage(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-cyan-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - Partage d'Immeuble</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <p className="font-semibold mb-2">Tranches (sur Actif Brut) :</p>
                        <ul className="space-y-1">
                            <li>• 1 à 10 millions : <strong>4,00%</strong></li>
                            <li>• 10 à 40 millions : <strong>3,00%</strong></li>
                            <li>• 40 à 150 millions : <strong>1,50%</strong></li>
                            <li>• Plus de 150 millions : <strong>0,75%</strong></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Frais spécifiques :</p>
                        <ul className="space-y-1">
                            <li>• TVA : <strong>18%</strong> sur honoraires</li>
                            <li>• Enregistrement : <strong>1%</strong> sur Actif Brut</li>
                            <li>• Soulte : <strong>15%</strong> sur montant soulte</li>
                            <li>• Morcellement : <strong>20 000 FCFA</strong> / parcelle</li>
                            <li>• Conservation : <strong>1%</strong> (Actif Brut + 7 000)</li>
                            <li>• Divers : <strong>50 000 FCFA</strong></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-cyan-200">
                    <p className="text-sm"><strong>Note :</strong> Le partage d'immeuble met fin à l'indivision. Les droits de mutation sont calculés sur l'Actif Net (Actif Brut - Passif). Une soulte est due lorsqu'un copartageant reçoit plus que sa part, elle est taxée à 15%.</p>
                </div>
            </div>
        </div>
    );
}
