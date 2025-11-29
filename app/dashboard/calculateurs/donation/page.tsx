'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, Gift } from 'lucide-react';
import { calculerDonation, formaterMontantDonation, DonationInput } from '@/lib/calculators/donation';

export default function DonationPage() {
    const [formData, setFormData] = useState<DonationInput>({
        prix: 50000000000,
        typeDonation: 'ENTRE_EPOUX',
        conservationFonciere: true
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerDonation(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Gift className="h-8 w-8 text-pink-600" />
                    Calcul Frais et Honoraires - Donation
                </h1>
                <p className="text-muted-foreground mt-1">Mutation à titre gratuit entre vifs</p>
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
                                placeholder="50 000 000 000"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Type de donation</label>
                            <select
                                value={formData.typeDonation}
                                onChange={(e) => setFormData({ ...formData, typeDonation: e.target.value as any })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                            >
                                <option value="ENTRE_EPOUX">Mutation à titre gratuit entre vifs (Entre époux) - 3%</option>
                                <option value="AUTRE">Autre donation - 5%</option>
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
                                Conservation foncière (1% de prix + 6 500)
                            </label>
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-pink-600 text-white hover:bg-pink-700 h-10 px-4 font-medium"
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
                                                ? 'bg-pink-100 border border-pink-300'
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
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-pink-700 text-lg' : ''
                                        }`}>
                                        {formaterMontantDonation(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-pink-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - Donation</h3>
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
                            <li>• Enregistrement entre époux : <strong>3%</strong></li>
                            <li>• Enregistrement autre : <strong>5%</strong></li>
                            <li>• Conservation : <strong>1%</strong> (prix + 6 500)</li>
                            <li>• Expéditions : <strong>40 000 FCFA</strong></li>
                            <li>• Divers : <strong>40 000 FCFA</strong></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-pink-200">
                    <p className="text-sm"><strong>Note :</strong> La donation est une mutation à titre gratuit entre vifs. Le taux d'enregistrement est réduit à 3% pour les donations entre époux. La conservation foncière est calculée sur la base du prix + 6 500 FCFA.</p>
                </div>
            </div>
        </div>
    );
}
