'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, XCircle } from 'lucide-react';
import { calculerDissolutionSociete, formaterMontantDissolution, DissolutionSocieteInput } from '@/lib/calculators/dissolution-societe';

export default function DissolutionSocietePage() {
    const [formData, setFormData] = useState<DissolutionSocieteInput>({
        capital: 1000000,
        nombreAnnexes: 10,
        penalites: true,
        montantPenalites: 15000
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerDissolutionSociete(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <XCircle className="h-8 w-8 text-red-600" />
                    Calcul Frais - Dissolution de Société
                </h1>
                <p className="text-muted-foreground mt-1">Barème notarial pour dissolution de société</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulaire */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Données de calcul</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Capital Social (FCFA)</label>
                            <input
                                type="number"
                                value={formData.capital}
                                onChange={(e) => setFormData({ ...formData, capital: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="1 000 000"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Nombre d'annexes</label>
                            <input
                                type="number"
                                value={formData.nombreAnnexes}
                                onChange={(e) => setFormData({ ...formData, nombreAnnexes: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="10"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                2 000 FCFA par annexe
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="penalites"
                                checked={formData.penalites}
                                onChange={(e) => setFormData({ ...formData, penalites: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="penalites" className="text-sm font-medium">
                                Appliquer des pénalités
                            </label>
                        </div>

                        {formData.penalites && (
                            <div>
                                <label className="text-sm font-medium">Montant des pénalités (FCFA)</label>
                                <input
                                    type="number"
                                    value={formData.montantPenalites}
                                    onChange={(e) => setFormData({ ...formData, montantPenalites: Number(e.target.value) })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                    placeholder="15 000"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700 h-10 px-4 font-medium"
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
                            <p>Entrez les données et cliquez sur "Calculer"</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {result.lignes.map((ligne: any, index: number) => (
                                <div
                                    key={index}
                                    className={`flex justify-between p-2 rounded ${ligne.isBold
                                            ? ligne.label === 'TOTAL'
                                                ? 'bg-red-100 border border-red-300'
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
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-red-700 text-lg' : ''
                                        }`}>
                                        {formaterMontantDissolution(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-red-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - Dissolution de Société</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <p className="font-semibold mb-2">Frais fixes :</p>
                        <ul className="space-y-1">
                            <li>• Honoraires : <strong>20 000 FCFA</strong> (Droit fixe)</li>
                            <li>• TVA : <strong>18%</strong> sur honoraires</li>
                            <li>• Enregistrement Minute : <strong>5 000 FCFA</strong></li>
                            <li>• Greffe : <strong>10 000 FCFA</strong></li>
                            <li>• Publicité : <strong>55 000 FCFA</strong></li>
                            <li>• Expéditions : <strong>50 000 FCFA</strong></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Frais variables :</p>
                        <ul className="space-y-1">
                            <li>• Annexes : <strong>2 000 FCFA</strong> / annexe</li>
                            <li>• Pénalités : Selon retard (saisie manuelle)</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-red-200">
                    <p className="text-sm"><strong>Note :</strong> La dissolution anticipée d'une société est un acte soumis à un droit fixe d'enregistrement. Des pénalités peuvent s'appliquer en cas de retard d'enregistrement.</p>
                </div>
            </div>
        </div>
    );
}
