"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, FileText, TrendingUp, Info, AlertCircle } from "lucide-react";
import { TypeSociete, CalculProvisionResult } from '@/lib/bareme/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Configuration des catégories et types
const CATEGORIES = [
    {
        label: "Sociétés - Constitution",
        types: [
            { value: 'SARL_NUMERAIRE', label: 'SARL - Apport en Numéraire' },
            { value: 'SARL_NATURE', label: 'SARL - Apport en Nature' },
            { value: 'SCI_NUMERAIRE', label: 'SCI - Apport en Numéraire' },
            { value: 'SCI_NATURE', label: 'SCI - Apport en Nature' },
            { value: 'SA_CA_NUMERAIRE', label: 'SA avec Conseil d\'Admin.' },
            { value: 'SA_AG_NUMERAIRE', label: 'SA avec Admin. Général' },
            { value: 'SA_NATURE', label: 'SA - Apport en Nature' },
        ]
    },
    {
        label: "Sociétés - Vie Sociale",
        types: [
            { value: 'SARL_AUGMENTATION', label: 'SARL - Augmentation Capital' },
            { value: 'SARL_AUGMENTATION_NATURE', label: 'SARL - Augmentation Nature' },
            { value: 'SCI_AUGMENTATION', label: 'SCI - Augmentation Capital' },
            { value: 'SCI_AUGMENTATION_NATURE', label: 'SCI - Augmentation Nature' },
            { value: 'SA_AUGMENTATION', label: 'SA - Augmentation Capital' },
            { value: 'DISSOLUTION', label: 'Dissolution de Société' },
            { value: 'REDUCTION_CAPITAL', label: 'Réduction de Capital' },
            { value: 'TRANSFORMATION', label: 'Transformation de Société' },
            { value: 'CESSION_PARTS_SCI', label: 'Cession de Parts SCI' },
        ]
    },
    {
        label: "Immobilier & Crédit",
        types: [
            { value: 'VENTE_1', label: 'Vente Immobilière (1%)' },
            { value: 'VENTE_ADJUDICATION', label: 'Vente par Adjudication' },
            { value: 'CREDIT_HYPOTHECAIRE', label: 'Ouverture Crédit Hypothécaire' },
            { value: 'MAINLEVEE', label: 'Mainlevée Hypothécaire' },
            { value: 'DATION_PAIEMENT', label: 'Dation en Paiement (5%)' },
            { value: 'DATION_PAIEMENT_10', label: 'Dation en Paiement (10%)' },
            { value: 'TAXE_PLUS_VALUE', label: 'Taxe Plus-Value Immobilière' },
        ]
    },
    {
        label: "Baux & Commerce",
        types: [
            { value: 'LOCATION_GERANCE', label: 'Location Gérance' },
            { value: 'BAIL_COMMERCIAL', label: 'Bail Commercial' },
            { value: 'BAIL_HABITATION', label: 'Bail d\'Habitation' },
            { value: 'CESSION_CREANCES', label: 'Cession de Créances' },
        ]
    },
    {
        label: "Famille & Partage",
        types: [
            { value: 'PARTAGE_COMMUNAUTE', label: 'Partage de Communauté' },
            { value: 'PARTAGE_INDIVIS', label: 'Partage de Biens Indivis' },
        ]
    }
];

export default function CalculProvisionPage() {
    const [typeSociete, setTypeSociete] = useState<TypeSociete>('SARL_NUMERAIRE');
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [result, setResult] = useState<CalculProvisionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const formaterMontant = (montant: number) => {
        return montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' FCFA';
    };

    const calculer = async () => {
        setLoading(true);
        setError(null);

        try {
            // Conversion des valeurs string en number
            const body: any = { type: typeSociete };
            Object.keys(formData).forEach(key => {
                const value = formData[key];
                if (value) body[key] = parseFloat(value);
            });

            const response = await fetch('/api/bareme/calcul-provision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erreur lors du calcul');
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const genererDevisPDF = () => {
        if (!result) return;

        const doc = new jsPDF();
        const date = new Date().toLocaleDateString('fr-FR');

        // En-tête
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("DEVIS ESTIMATIF DE PROVISION", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Date : ${date}`, 20, 35);
        doc.text(`Type d'acte : ${typeSociete.replace(/_/g, ' ')}`, 20, 42);

        // Tableau Honoraires
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("1. Honoraires Notariaux", 20, 60);

        const honorairesData = result.details.honorairesDetail.map(d => [
            d.tranche,
            `${d.taux}%`,
            formaterMontant(d.calcul)
        ]);

        autoTable(doc, {
            startY: 65,
            head: [['Tranche', 'Taux', 'Montant']],
            body: honorairesData,
            theme: 'striped',
            headStyles: { fillColor: [66, 139, 202] },
            foot: [['', 'Total HT', formaterMontant(result.honoraires)]],
            footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
        });

        // Tableau Taxes et Frais
        const finalY = (doc as any).lastAutoTable.finalY + 20;
        doc.text("2. Taxes et Débours", 20, finalY);

        const fraisData = [
            ['Enregistrement', formaterMontant(result.enregistrement)],
            ...Object.entries(result.fraisFixe).map(([key, value]) => [
                key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase()),
                formaterMontant(value || 0)
            ])
        ];

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Désignation', 'Montant']],
            body: fraisData,
            theme: 'striped',
            headStyles: { fillColor: [230, 126, 34] },
            foot: [['Total Frais', formaterMontant(result.totalHT - result.honoraires)]],
            footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
        });

        // Total Général
        const totalY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFillColor(245, 245, 245);
        doc.rect(120, totalY, 80, 30, 'F');
        doc.setFontSize(12);
        doc.text("TOTAL PROVISION TTC", 160, totalY + 10, { align: "center" });
        doc.setFontSize(16);
        doc.setTextColor(39, 174, 96);
        doc.text(formaterMontant(result.totalTTC), 160, totalY + 22, { align: "center" });

        // Pied de page
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("Ce document est une estimation non contractuelle.", 105, 280, { align: "center" });

        doc.save(`devis_provision_${typeSociete}_${date.replace(/\//g, '-')}.pdf`);
    };

    const renderFields = () => {
        switch (typeSociete) {
            // --- CAS SIMPLES (1 CHAMP) ---
            case 'SARL_NUMERAIRE':
            case 'SCI_NUMERAIRE':
            case 'SA_CA_NUMERAIRE':
            case 'SA_AG_NUMERAIRE':
            case 'DISSOLUTION':
            case 'TRANSFORMATION':
                return (
                    <div className="space-y-2">
                        <Label>Capital Social (FCFA)</Label>
                        <Input type="number" placeholder="Ex: 1000000" onChange={(e) => handleInputChange('capital', e.target.value)} />
                    </div>
                );
            case 'CREDIT_HYPOTHECAIRE':
            case 'CESSION_CREANCES':
            case 'MAINLEVEE':
                return (
                    <div className="space-y-2">
                        <Label>Montant (FCFA)</Label>
                        <Input type="number" placeholder="Ex: 10000000" onChange={(e) => handleInputChange('montant', e.target.value)} />
                    </div>
                );
            case 'REDUCTION_CAPITAL':
                return (
                    <div className="space-y-2">
                        <Label>Montant de la Réduction (FCFA)</Label>
                        <Input type="number" placeholder="Ex: 5000000" onChange={(e) => handleInputChange('montantReduction', e.target.value)} />
                    </div>
                );
            case 'CESSION_PARTS_SCI':
                return (
                    <div className="space-y-2">
                        <Label>Prix de Cession (FCFA)</Label>
                        <Input type="number" placeholder="Ex: 5000000" onChange={(e) => handleInputChange('prixCession', e.target.value)} />
                    </div>
                );
            case 'DATION_PAIEMENT':
            case 'DATION_PAIEMENT_10':
                return (
                    <div className="space-y-2">
                        <Label>Valeur du Bien (FCFA)</Label>
                        <Input type="number" placeholder="Ex: 25000000" onChange={(e) => handleInputChange('valeurBien', e.target.value)} />
                    </div>
                );
            case 'VENTE_1':
                return (
                    <div className="space-y-2">
                        <Label>Prix de Vente (FCFA)</Label>
                        <Input type="number" placeholder="Ex: 50000000" onChange={(e) => handleInputChange('prixVente', e.target.value)} />
                    </div>
                );
            case 'VENTE_ADJUDICATION':
                return (
                    <div className="space-y-2">
                        <Label>Prix d'Adjudication (FCFA)</Label>
                        <Input type="number" placeholder="Ex: 30000000" onChange={(e) => handleInputChange('prixAdjudication', e.target.value)} />
                    </div>
                );

            // --- AUGMENTATIONS ---
            case 'SARL_AUGMENTATION':
            case 'SCI_AUGMENTATION':
            case 'SA_AUGMENTATION':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Ancien Capital (FCFA)</Label>
                            <Input type="number" onChange={(e) => handleInputChange('ancienCapital', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Nouveau Capital (FCFA)</Label>
                            <Input type="number" onChange={(e) => handleInputChange('nouveauCapital', e.target.value)} />
                        </div>
                    </div>
                );

            // --- APPORTS EN NATURE ---
            case 'SARL_NATURE':
            case 'SCI_NATURE':
            case 'SA_NATURE':
                return (
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Capital Total (FCFA)</Label>
                            <Input type="number" onChange={(e) => handleInputChange('capitalTotal', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Apport en Nature (FCFA)</Label>
                            <Input type="number" onChange={(e) => handleInputChange('capitalNature', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Apport en Numéraire (FCFA)</Label>
                            <Input type="number" onChange={(e) => handleInputChange('capitalNumeraire', e.target.value)} />
                        </div>
                    </div>
                );

            // --- AUGMENTATIONS MIXTES ---
            case 'SARL_AUGMENTATION_NATURE':
            case 'SCI_AUGMENTATION_NATURE':
                return (
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Ancien Capital</Label>
                                <Input type="number" onChange={(e) => handleInputChange('ancienCapital', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Nouveau Capital</Label>
                                <Input type="number" onChange={(e) => handleInputChange('nouveauCapital', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Augmentation Numéraire</Label>
                                <Input type="number" onChange={(e) => handleInputChange('augmentationNumeraire', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Augmentation Nature</Label>
                                <Input type="number" onChange={(e) => handleInputChange('augmentationNature', e.target.value)} />
                            </div>
                        </div>
                    </div>
                );

            // --- BAUX & LOCATION ---
            case 'LOCATION_GERANCE':
            case 'BAIL_COMMERCIAL':
            case 'BAIL_HABITATION':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Loyer Mensuel (FCFA)</Label>
                            <Input type="number" onChange={(e) => handleInputChange('loyerMensuel', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Durée (Mois)</Label>
                            <Input type="number" onChange={(e) => handleInputChange('dureeMois', e.target.value)} />
                        </div>
                    </div>
                );

            // --- PARTAGES ---
            case 'PARTAGE_COMMUNAUTE':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Actif Net Partagé (FCFA)</Label>
                            <Input type="number" onChange={(e) => handleInputChange('prix', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Nombre de Titres Fonciers</Label>
                            <Input type="number" placeholder="Optionnel" onChange={(e) => handleInputChange('nombreTitres', e.target.value)} />
                        </div>
                    </div>
                );
            case 'PARTAGE_INDIVIS':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Montant Actif (FCFA)</Label>
                            <Input type="number" onChange={(e) => handleInputChange('montant', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Soulte (FCFA)</Label>
                            <Input type="number" placeholder="Optionnel" onChange={(e) => handleInputChange('soulte', e.target.value)} />
                        </div>
                    </div>
                );

            // --- FISCALITÉ ---
            case 'TAXE_PLUS_VALUE':
                return (
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Prix d'Acquisition (FCFA)</Label>
                                <Input type="number" onChange={(e) => handleInputChange('prixAcquisition', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Année d'Acquisition</Label>
                                <Input type="number" placeholder="Ex: 2015" onChange={(e) => handleInputChange('anneeAcquisition', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Prix de Vente (FCFA)</Label>
                                <Input type="number" onChange={(e) => handleInputChange('prixVente', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Dépenses Travaux (FCFA)</Label>
                                <Input type="number" placeholder="Optionnel" onChange={(e) => handleInputChange('depensesTravaux', e.target.value)} />
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div className="text-red-500">Formulaire non configuré pour ce type</div>;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Calculateur de Provision</h1>
                    <p className="text-muted-foreground mt-1">
                        Estimez rapidement les frais et honoraires pour vos actes notariés.
                    </p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    29 Types d'actes supportés
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Colonne Gauche : Configuration */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-t-4 border-t-blue-600 shadow-lg">
                        <CardHeader>
                            <CardTitle>Paramètres de l'acte</CardTitle>
                            <CardDescription>Sélectionnez le type d'opération</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <Label className="text-base font-semibold text-blue-900">Type d'opération</Label>
                                <Select value={typeSociete} onValueChange={(v) => {
                                    setTypeSociete(v as TypeSociete);
                                    setFormData({});
                                    setResult(null);
                                    setError(null);
                                }}>
                                    <SelectTrigger className="h-12 text-lg font-bold bg-white border-blue-300 focus:ring-blue-500 shadow-sm [&>svg]:opacity-100 [&>svg]:text-orange-600 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:stroke-[3]">
                                        <SelectValue placeholder="Choisir un type..." />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[400px]">
                                        {CATEGORIES.map((cat, idx) => (
                                            <SelectGroup key={idx}>
                                                <SelectLabel className="text-blue-600 font-bold bg-blue-50 px-2 py-1 mt-2 mb-1 rounded">
                                                    {cat.label}
                                                </SelectLabel>
                                                {cat.types.map((type) => (
                                                    <SelectItem key={type.value} value={type.value} className="py-2 cursor-pointer">
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4 border-t">
                                {renderFields()}
                            </div>

                            <Button onClick={calculer} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                                {loading ? (
                                    <span className="flex items-center">Calcul en cours...</span>
                                ) : (
                                    <span className="flex items-center">
                                        <Calculator className="mr-2 h-5 w-5" />
                                        Calculer la Provision
                                    </span>
                                )}
                            </Button>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Erreur</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Colonne Droite : Résultats */}
                <div className="lg:col-span-2">
                    {result ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* En-tête Résultat */}
                            <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-none shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-300 text-sm uppercase tracking-wider font-medium">Total Provision à Verser</p>
                                            <div className="text-4xl font-bold mt-1 text-green-400">
                                                {formaterMontant(result.totalTTC)}
                                            </div>
                                            <p className="text-gray-400 text-sm mt-1">Dont TVA : {formaterMontant(result.tva)}</p>
                                        </div>
                                        <Button variant="secondary" className="hidden sm:flex" onClick={genererDevisPDF}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Télécharger Devis
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Détail Honoraires */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                                            Honoraires Notaire
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {result.details.honorairesDetail.length > 0 ? (
                                            result.details.honorairesDetail.map((detail, index) => (
                                                <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                                    <span className="text-gray-600">{detail.tranche}</span>
                                                    <span className="font-medium">{formaterMontant(detail.calcul)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-sm text-gray-500 italic">Aucun honoraire applicable</div>
                                        )}
                                        <div className="border-t pt-2 flex justify-between items-center font-bold text-blue-700">
                                            <span>Total Honoraires HT</span>
                                            <span>{formaterMontant(result.honoraires)}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Détail Taxes & Frais */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <Info className="w-5 h-5 mr-2 text-orange-600" />
                                            Taxes & Débours
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between items-center text-sm p-2 bg-orange-50 rounded">
                                            <span className="text-gray-700">Enregistrement</span>
                                            <span className="font-medium">{formaterMontant(result.enregistrement)}</span>
                                        </div>
                                        {Object.entries(result.fraisFixe).map(([key, value]) => value !== undefined && value > 0 && (
                                            <div key={key} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                <span className="font-medium">{formaterMontant(value)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-2 flex justify-between items-center font-bold text-orange-700">
                                            <span>Total Frais</span>
                                            <span>{formaterMontant(result.totalHT - result.honoraires)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-400 border-2 border-dashed rounded-xl bg-gray-50/50">
                            <Calculator className="w-16 h-16 mb-4 opacity-20" />
                            <h3 className="text-lg font-medium text-gray-900">Prêt à calculer</h3>
                            <p className="max-w-sm mt-2">
                                Remplissez les informations à gauche et cliquez sur "Calculer" pour obtenir le détail des frais.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
