'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, Home } from 'lucide-react';
import { calculerConstitutionSCI, formaterMontantSCI, ConstitutionSCIInput } from '@/lib/calculators/constitution-sci';

export default function ConstitutionSCIPage() {
    const [formData, setFormData] = useState<ConstitutionSCIInput>({
        capital: 100000000
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerConstitutionSCI(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Home className="h-8 w-8 text-emerald-700" />
                    Calcul Frais - Constitution S.C.I
                </h1>
                <p className="text-muted-foreground mt-1">Barème notarial pour constitution de SCI avec apport en numéraires</p>
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
                                placeholder="100 000 000"
                            />
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-emerald-700 text-white hover:bg-emerald-800 h-10 px-4 font-medium"
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
                            <p>Entrez le capital et cliquez sur "Calculer"</p>
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
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-emerald-800 text-lg' : ''
                                        }`}>
                                        {formaterMontantSCI(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-emerald-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - Constitution S.C.I</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <p className="font-semibold mb-2">Tranches d'honoraires :</p>
                        <ul className="space-y-1">
                            <li>• 0 à 20 Millions : <strong>2%</strong></li>
                            <li>• 20 à 80 Millions : <strong>1,50%</strong></li>
                            <li>• 80 à 300 Millions : <strong>1%</strong></li>
                            <li>• 300 à 600 Millions : <strong>0,50%</strong></li>
                            <li>• Plus de 600 Millions : Dégressif jusqu'à 0,10%</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Autres frais :</p>
                        <ul className="space-y-1">
                            <li>• Enregistrement : <strong>25 000 FCFA</strong> (jusqu'à 100M)</li>
                            <li>• Expéditions : <strong>60 000 FCFA</strong></li>
                            <li>• Pas de frais de greffe commercial</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-emerald-200">
                    <p className="text-sm"><strong>Note :</strong> La SCI étant une société civile, elle supporte moins de frais annexes (greffe, publicité légale commerciale) que les sociétés commerciales comme la SARL.</p>
                </div>
            </div>
        </div>
    );
}
