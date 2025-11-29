'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, Split } from 'lucide-react';
import { calculerAttributionPartage, formaterMontantAttribution, AttributionPartageInput } from '@/lib/calculators/attribution-partage';

export default function AttributionPartagePage() {
    const [formData, setFormData] = useState<AttributionPartageInput>({
        prix: 3000000,
        morcellement: true,
        nombreParcelles: 1,
        conservationFonciere: true
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerAttributionPartage(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Split className="h-8 w-8 text-blue-600" />
                    Calcul Frais - Attribution Partage
                </h1>
                <p className="text-muted-foreground mt-1">Barème notarial pour attribution partage avec morcellement</p>
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
                                placeholder="3 000 000"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="morcellement"
                                checked={formData.morcellement}
                                onChange={(e) => setFormData({ ...formData, morcellement: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="morcellement" className="text-sm font-medium">
                                Morcellement (20 000 FCFA / parcelle)
                            </label>
                        </div>

                        {formData.morcellement && (
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
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="conservation"
                                checked={formData.conservationFonciere}
                                onChange={(e) => setFormData({ ...formData, conservationFonciere: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="conservation" className="text-sm font-medium">
                                Conservation foncière (1% de prix + 6 500)
                            </label>
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 font-medium"
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
                            <p>Entrez le prix et cliquez sur "Calculer"</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {result.lignes.map((ligne: any, index: number) => (
                                <div
                                    key={index}
                                    className={`flex justify-between p-2 rounded ${ligne.isBold
                                            ? ligne.label === 'TOTAL'
                                                ? 'bg-blue-100 border border-blue-300'
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
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-blue-700 text-lg' : ''
                                        }`}>
                                        {formaterMontantAttribution(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-blue-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - Attribution Partage</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <p className="font-semibold mb-2">Tranches de prix :</p>
                        <ul className="space-y-1">
                            <li>• 1 à 20 millions : <strong>4,5%</strong></li>
                            <li>• 20 à 80 millions : <strong>3%</strong></li>
                            <li>• 80 à 300 millions : <strong>1,5%</strong></li>
                            <li>• Plus de 300 millions : <strong>0,75%</strong></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Autres frais :</p>
                        <ul className="space-y-1">
                            <li>• TVA : <strong>18%</strong> sur honoraires</li>
                            <li>• Enregistrement : <strong>5%</strong></li>
                            <li>• Conservation : <strong>1%</strong> (prix + 6 500)</li>
                            <li>• Morcellement : <strong>20 000 FCFA</strong> / parcelle</li>
                            <li>• Expéditions : <strong>50 000 FCFA</strong></li>
                            <li>• Divers : <strong>50 000 FCFA</strong></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                    <p className="text-sm"><strong>Note :</strong> L'attribution partage est un acte qui attribue à un copartageant une part divise d'un bien indivis. Elle est soumise à des droits d'enregistrement de 5%.</p>
                </div>
            </div>
        </div>
    );
}
