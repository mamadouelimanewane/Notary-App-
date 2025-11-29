'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, Store } from 'lucide-react';
import { calculerCessionFonds, formaterMontantFonds, CessionFondsInput } from '@/lib/calculators/cession-fonds';

export default function CessionFondsPage() {
    const [formData, setFormData] = useState<CessionFondsInput>({
        prixCession: 43000000,
        valeurFonds: 1000000,
        marchandisesNeuves: 1000000
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerCessionFonds(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Store className="h-8 w-8 text-orange-600" />
                    Calcul Frais et Honoraires - Cession de Fonds de Commerce
                </h1>
                <p className="text-muted-foreground mt-1">Barème notarial pour cession de fonds de commerce</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulaire */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Données de calcul</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Prix de cession (FCFA)</label>
                            <input
                                type="number"
                                value={formData.prixCession}
                                onChange={(e) => setFormData({ ...formData, prixCession: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="43 000 000"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Prix total de la cession
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Valeur fonds de commerce (FCFA)</label>
                            <input
                                type="number"
                                value={formData.valeurFonds}
                                onChange={(e) => setFormData({ ...formData, valeurFonds: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="1 000 000"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Enregistrement à 10%
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Marchandises neuves (FCFA)</label>
                            <input
                                type="number"
                                value={formData.marchandisesNeuves}
                                onChange={(e) => setFormData({ ...formData, marchandisesNeuves: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="1 000 000"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Enregistrement à 1%
                            </p>
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 font-medium"
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
                                                ? 'bg-orange-100 border border-orange-300'
                                                : ligne.label === 'ENREGISTREMENT'
                                                    ? 'bg-slate-100 font-semibold'
                                                    : 'bg-slate-100 font-semibold'
                                            : ligne.label.includes('Valeur fonds') || ligne.label.includes('Marchandises')
                                                ? 'bg-blue-50 ml-4'
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
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-orange-700 text-lg' : ''
                                        }`}>
                                        {formaterMontantFonds(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-orange-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - Cession de Fonds de Commerce</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <p className="font-semibold mb-2">Honoraires (sur prix de cession) :</p>
                        <ul className="space-y-1">
                            <li>• 1 à 20 millions : <strong>4,5%</strong></li>
                            <li>• 20 à 80 millions : <strong>3%</strong></li>
                            <li>• 80 à 300 millions : <strong>1,5%</strong></li>
                            <li>• Plus de 300 millions : <strong>0,75%</strong></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Frais spécifiques :</p>
                        <ul className="space-y-1">
                            <li>• TVA : <strong>18%</strong> sur honoraires</li>
                            <li>• Enregistrement fonds : <strong>10%</strong></li>
                            <li>• Enregistrement marchandises : <strong>1%</strong></li>
                            <li>• Greffe : <strong>20 000 FCFA</strong></li>
                            <li>• Publicité : <strong>75 000 FCFA</strong></li>
                            <li>• Expéditions : <strong>60 000 FCFA</strong></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-orange-200">
                    <p className="text-sm"><strong>Note :</strong> La cession de fonds de commerce nécessite une publicité légale et une déclaration modificative au greffe. Les droits d'enregistrement sont calculés séparément pour le fonds (10%) et les marchandises neuves (1%).</p>
                </div>
            </div>
        </div>
    );
}
