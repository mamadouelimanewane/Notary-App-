'use client';

import { useState } from 'react';
import { Calculator, FileText, Download, FileArchive } from 'lucide-react';
import { calculerActeDepot, formaterMontantDepot, ActeDepotInput } from '@/lib/calculators/acte-depot';

export default function ActeDepotPage() {
    const [formData, setFormData] = useState<ActeDepotInput>({
        datePV: '2008-01-01',
        dateEnregistrement: '2008-12-31',
        nombreAnnexes: 12
    });

    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        const calculResult = calculerActeDepot(formData);
        setResult(calculResult);
    };

    const handleExportPDF = () => {
        alert('Export PDF en cours de développement');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <FileArchive className="h-8 w-8 text-slate-600" />
                    Calcul Frais - Acte de Dépôt (PV)
                </h1>
                <p className="text-muted-foreground mt-1">Calcul des frais de dépôt de procès-verbal avec pénalités</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Formulaire */}
                <div className="rounded-xl border bg-white p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Données de calcul</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Date du PV</label>
                            <input
                                type="date"
                                value={formData.datePV}
                                onChange={(e) => setFormData({ ...formData, datePV: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Date d'enregistrement</label>
                            <input
                                type="date"
                                value={formData.dateEnregistrement}
                                onChange={(e) => setFormData({ ...formData, dateEnregistrement: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Utilisé pour calculer les pénalités de retard
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Nombre d'annexes / pages</label>
                            <input
                                type="number"
                                value={formData.nombreAnnexes}
                                onChange={(e) => setFormData({ ...formData, nombreAnnexes: Number(e.target.value) })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                placeholder="12"
                            />
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full inline-flex items-center justify-center rounded-md bg-slate-800 text-white hover:bg-slate-900 h-10 px-4 font-medium"
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
                                                ? 'bg-slate-200 border border-slate-400'
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
                                    <span className={`font-mono ${ligne.isBold ? 'font-bold' : ''} ${ligne.label === 'TOTAL' ? 'text-slate-900 text-lg' : ''
                                        }`}>
                                        {formaterMontantDepot(ligne.montant)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Informations sur le barème */}
            <div className="rounded-xl border bg-slate-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ Barème - Acte de Dépôt</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <p className="font-semibold mb-2">Frais fixes :</p>
                        <ul className="space-y-1">
                            <li>• Honoraires : <strong>20 000 FCFA</strong></li>
                            <li>• TVA : <strong>18%</strong> sur honoraires</li>
                            <li>• Enregistrement : <strong>5 000 FCFA</strong></li>
                            <li>• Greffe : <strong>12 000 FCFA</strong></li>
                            <li>• Publicité : <strong>75 000 FCFA</strong></li>
                            <li>• Expéditions : <strong>50 000 FCFA</strong></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Frais variables :</p>
                        <ul className="space-y-1">
                            <li>• Annexes : Selon nombre de pages</li>
                            <li>• Pénalités : <strong>5 000 FCFA</strong> si retard {'>'} 1 mois</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-slate-200">
                    <p className="text-sm"><strong>Note :</strong> Le dépôt de pièces (PV d'AG, statuts modifiés) au rang des minutes d'un notaire est soumis à des droits fixes. Des pénalités d'enregistrement s'appliquent en cas de dépassement du délai légal.</p>
                </div>
            </div>
        </div>
    );
}
