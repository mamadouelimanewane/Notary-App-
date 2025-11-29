'use client';

import { useState } from 'react';
import { Calculator, FileText, Download } from 'lucide-react';
import { calculerPlusValueImmobiliere, formaterMontant, PlusValueInput } from '@/lib/calculators/plus-value-immobiliere';

export default function PlusValueCalculatorPage() {
    const [formData, setFormData] = useState<PlusValueInput>({
        prixAcquisition: 4000000,
        anneeAcquisition: 2010,
        prixVente: 196000000,
        anneeCession: new Date().getFullYear(),
        depensesTravaux: 80000000,
        typeBien: 'BAIL'
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerPlusValueImmobiliere(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Calculator className="h-8 w-8 text-blue-600" />
                    Calcul de la Taxe de Plus-Value Immobilière
                </h1>
                <p className="text-muted-foreground mt-1">Cession de bail et immeubles</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulaire */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Données de calcul</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Type de bien</label>
                            <select
                                value={formData.typeBien}
                                onChange={(e) => setFormData({ ...formData, typeBien: e.target.value as any })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                            >
                                <option value="BAIL">Cession de bail</option>
                                <option value="IMMEUBLE">Immeuble</option>
                                <option value="TERRAIN">Terrain</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Prix d'acquisition (FCFA)</label>
                                <input
                                    type="number"
                                    value={formData.prixAcquisition}
                                    onChange={(e) => setFormData({ ...formData, prixAcquisition: Number(e.target.value) })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Année d'acquisition</label>
                                <input
                                    type="number"
                                    value={formData.anneeAcquisition}
                                    onChange={(e) => setFormData({ ...formData, anneeAcquisition: Number(e.target.value) })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Dépenses pour travaux (FCFA)</label>
                            <input
                                type="number"
                                value={formData.depensesTravaux}
                                onChange={(e) => setFormData({ ...formData, depensesTravaux: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Prix de vente (FCFA)</label>
                                <input
                                    type="number"
                                    value={formData.prixVente}
                                    onChange={(e) => setFormData({ ...formData, prixVente: Number(e.target.value) })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Année de cession</label>
                                <input
                                    type="number"
                                    value={formData.anneeCession}
                                    onChange={(e) => setFormData({ ...formData, anneeCession: Number(e.target.value) })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                />
                            </div>
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
                        <h2 className="font-semibold text-lg">Résultat du calcul</h2>
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
                        <div className="space-y-3">
                            {result.details.map((detail: any, index: number) => (
                                <div
                                    key={index}
                                    className={`flex justify-between p-3 rounded ${detail.label === 'TAXE DE PLUS-VALUE'
                                        ? 'bg-red-50 border border-red-200'
                                        : detail.label.includes('Plus-value')
                                            ? 'bg-blue-50'
                                            : 'bg-slate-50'
                                        }`}
                                >
                                    <span className={`font-medium ${detail.label === 'TAXE DE PLUS-VALUE' ? 'text-red-700 uppercase' : ''
                                        }`}>
                                        {detail.label}
                                    </span>
                                    <span className={`font-bold ${detail.label === 'TAXE DE PLUS-VALUE' ? 'text-red-700 text-lg' : ''
                                        }`}>
                                        {typeof detail.valeur === 'number'
                                            ? `${formaterMontant(detail.valeur)} ${detail.label.includes('%') ? '' : 'FCFA'}`
                                            : detail.valeur}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations légales */}
            <div className="rounded-xl border bg-blue-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Informations</h3>
                <div className="space-y-2 text-sm text-slate-700">
                    <p>• <strong>Taux d'imposition</strong> : 15% au Sénégal pour les plus-values immobilières</p>
                    <p>• <strong>Taux forfaitaire</strong> : Varie selon la durée de détention (0% à 120%)</p>
                    <p>• <strong>Exonérations</strong> : Résidence principale, détention &gt; 30 ans (selon cas)</p>
                    <p>• <strong>Travaux déductibles</strong> : Travaux d'amélioration, construction, agrandissement</p>
                </div>
            </div>
        </div>
    );
}
