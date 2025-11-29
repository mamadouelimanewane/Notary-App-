'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, Building } from 'lucide-react';
import { calculerConstitutionSARLNature, formaterMontantSARLNature, ConstitutionSARLNatureInput } from '@/lib/calculators/constitution-sarl-nature';

export default function ConstitutionSARLNaturePage() {
    const [formData, setFormData] = useState<ConstitutionSARLNatureInput>({
        apportNature: 100000000,
        apportNumeraire: 150000000,
        engagementConservation: true
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerConstitutionSARLNature(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Building className="h-8 w-8 text-teal-700" />
                    Calcul Frais - Constitution S.A.R.L (Apport Nature)
                </h1>
                <p className="text-muted-foreground mt-1">Barème notarial pour constitution de SARL avec apport immobilier</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulaire */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Données de calcul</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Apport en Nature (Immeuble) (FCFA)</label>
                            <input
                                type="number"
                                value={formData.apportNature}
                                onChange={(e) => setFormData({ ...formData, apportNature: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="100 000 000"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Apport en Numéraire (FCFA)</label>
                            <input
                                type="number"
                                value={formData.apportNumeraire}
                                onChange={(e) => setFormData({ ...formData, apportNumeraire: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="150 000 000"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="engagement"
                                checked={formData.engagementConservation}
                                onChange={(e) => setFormData({ ...formData, engagementConservation: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="engagement" className="text-sm font-medium">
                                Engagement de conservation (10 ans)
                            </label>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">
                            Permet de bénéficier du taux réduit d'enregistrement de 1% sur l'apport en nature.
                        </p>

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-teal-700 text-white hover:bg-teal-800 h-10 px-4 font-medium"
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
                            <p>Entrez les apports et cliquez sur "Calculer"</p>
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
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-teal-800 text-lg' : ''
                                        }`}>
                                        {formaterMontantSARLNature(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-teal-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - Constitution S.A.R.L (Apport Nature)</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <p className="font-semibold mb-2">Honoraires (Barème Immobilier) :</p>
                        <ul className="space-y-1">
                            <li>• 0 à 20 Millions : <strong>4,50%</strong></li>
                            <li>• 20 à 80 Millions : <strong>3,00%</strong></li>
                            <li>• 80 à 300 Millions : <strong>1,50%</strong></li>
                            <li>• Plus de 300 Millions : <strong>0,75%</strong></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Frais spécifiques :</p>
                        <ul className="space-y-1">
                            <li>• Enregistrement : <strong>1%</strong> sur surplus capital {'>'} 100M</li>
                            <li>• Enregistrement Nature : <strong>1%</strong> (si conservation)</li>
                            <li>• Conservation : <strong>1%</strong> + 7 500 FCFA</li>
                            <li>• Greffe : <strong>54 500 FCFA</strong></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-teal-200">
                    <p className="text-sm"><strong>Note :</strong> En cas d'apport immobilier, les honoraires sont calculés selon le barème immobilier (plus élevé que le barème société). L'engagement de conservation du bien pendant 10 ans permet de bénéficier de droits d'enregistrement réduits.</p>
                </div>
            </div>
        </div>
    );
}
