'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, ScrollText } from 'lucide-react';
import { calculerDeclarationSuccession, formaterMontantSuccession, DeclarationSuccessionInput } from '@/lib/calculators/declaration-succession';

export default function DeclarationSuccessionPage() {
    const [formData, setFormData] = useState<DeclarationSuccessionInput>({
        valeurImmeuble: 100000000,
        resteActifSuccessoral: 190000000,
        valeurPassif: 90000000,
        droitsSuccession: 9000000,
        penalites: 90000,
        conservationFonciere: true,
        notoriete: true,
        procuration: true,
        exequatur: true
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerDeclarationSuccession(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <ScrollText className="h-8 w-8 text-amber-800" />
                    Calcul Frais - Déclaration de Succession
                </h1>
                <p className="text-muted-foreground mt-1">Barème notarial pour déclaration de succession</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulaire */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Données de calcul</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Valeur de l'Immeuble (FCFA)</label>
                            <input
                                type="number"
                                value={formData.valeurImmeuble}
                                onChange={(e) => setFormData({ ...formData, valeurImmeuble: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="100 000 000"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Reste de l'Actif Successoral (FCFA)</label>
                            <input
                                type="number"
                                value={formData.resteActifSuccessoral}
                                onChange={(e) => setFormData({ ...formData, resteActifSuccessoral: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="190 000 000"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Valeur du Passif (FCFA)</label>
                            <input
                                type="number"
                                value={formData.valeurPassif}
                                onChange={(e) => setFormData({ ...formData, valeurPassif: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="90 000 000"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Droits Succession</label>
                                <input
                                    type="number"
                                    value={formData.droitsSuccession}
                                    onChange={(e) => setFormData({ ...formData, droitsSuccession: Number(e.target.value) })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                    placeholder="9 000 000"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Pénalités</label>
                                <input
                                    type="number"
                                    value={formData.penalites}
                                    onChange={(e) => setFormData({ ...formData, penalites: Number(e.target.value) })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                    placeholder="90 000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <p className="text-sm font-medium mb-2">Options :</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="conservation"
                                    checked={formData.conservationFonciere}
                                    onChange={(e) => setFormData({ ...formData, conservationFonciere: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="conservation" className="text-sm">Conservation foncière</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="notoriete"
                                    checked={formData.notoriete}
                                    onChange={(e) => setFormData({ ...formData, notoriete: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="notoriete" className="text-sm">Notoriété (40 000)</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="procuration"
                                    checked={formData.procuration}
                                    onChange={(e) => setFormData({ ...formData, procuration: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="procuration" className="text-sm">Procuration (40 000)</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="exequatur"
                                    checked={formData.exequatur}
                                    onChange={(e) => setFormData({ ...formData, exequatur: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="exequatur" className="text-sm">Exequatur (40 000)</label>
                            </div>
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-amber-800 text-white hover:bg-amber-900 h-10 px-4 font-medium"
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
                                                ? 'bg-amber-100 border border-amber-300'
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
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-amber-900 text-lg' : ''
                                        }`}>
                                        {formaterMontantSuccession(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-amber-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - Déclaration de Succession</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <p className="font-semibold mb-2">Tranches (sur Actif Brut) :</p>
                        <ul className="space-y-1">
                            <li>• 1 à 10 millions : <strong>1,50%</strong></li>
                            <li>• 10 à 40 millions : <strong>1,00%</strong></li>
                            <li>• 40 à 150 millions : <strong>0,75%</strong></li>
                            <li>• Plus de 150 millions : <strong>0,50%</strong></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Frais annexes :</p>
                        <ul className="space-y-1">
                            <li>• TVA : <strong>18%</strong> sur honoraires</li>
                            <li>• Conservation : <strong>1%</strong> (Immeuble + 6 500)</li>
                            <li>• Notoriété, Procuration, Exequatur : <strong>40 000 FCFA</strong> chacun</li>
                            <li>• Frais généraux : <strong>50 000 FCFA</strong></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-amber-200">
                    <p className="text-sm"><strong>Note :</strong> Les honoraires sont calculés sur l'Actif Brut. Les droits de succession sont calculés par l'administration fiscale sur l'Actif Net taxable.</p>
                </div>
            </div>
        </div>
    );
}
