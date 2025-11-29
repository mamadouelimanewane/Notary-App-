'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, Building2 } from 'lucide-react';
import { calculerVente10, formaterMontantVente10, Vente10Input } from '@/lib/calculators/vente-10pct';

export default function Vente10Page() {
    const [formData, setFormData] = useState<Vente10Input>({
        prix: 6160000,
        typeMorcellement: 'OUI',
        conservationFonciere: true
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerVente10(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Building2 className="h-8 w-8 text-indigo-600" />
                    Calcul Frais et Honoraires - Vente Immobilière (10%)
                </h1>
                <p className="text-muted-foreground mt-1">Barème notarial pour vente avec enregistrement à 10% (taux standard)</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulaire */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Données de calcul</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Prix de vente (FCFA)</label>
                            <input
                                type="number"
                                value={formData.prix}
                                onChange={(e) => setFormData({ ...formData, prix: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="6 160 000"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Morcellement</label>
                            <select
                                value={formData.typeMorcellement}
                                onChange={(e) => setFormData({ ...formData, typeMorcellement: e.target.value as any })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                            >
                                <option value="OUI">OUI</option>
                                <option value="NON">NON</option>
                            </select>
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
                                Conservation foncière (1%)
                            </label>
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 font-medium"
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
                                                ? 'bg-indigo-100 border border-indigo-300'
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
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-indigo-700 text-lg' : ''
                                        }`}>
                                        {formaterMontantVente10(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-indigo-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - Vente Immobilière (10%)</h3>
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
                            <li>• Enregistrement : <strong>10%</strong> du prix</li>
                            <li>• Conservation foncière : <strong>1%</strong> du prix</li>
                            <li>• Morcellement : <strong>22 500 FCFA</strong></li>
                            <li>• Expéditions : <strong>50 000 FCFA</strong></li>
                            <li>• Frais généraux : <strong>50 000 FCFA</strong></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-indigo-200">
                    <p className="text-sm"><strong>Note :</strong> Ce barème s'applique aux ventes immobilières avec le taux d'enregistrement standard de 10%. C'est le taux le plus courant pour les transactions immobilières au Sénégal.</p>
                </div>
            </div>
        </div>
    );
}
