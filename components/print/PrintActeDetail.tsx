"use client";

import PrintHeader from "./PrintHeader";
import { formatPrintDate } from "@/lib/print-utils";

interface Acte {
    id: string;
    type: string;
    category: string;
    title: string;
    createdAt: string;
    status: 'BROUILLON' | 'SIGNE' | 'ENREGISTRE';
    metadata: {
        seller?: { firstName: string; lastName: string; address: string; city: string; zipCode: string };
        buyer?: { firstName: string; lastName: string; address: string; city: string; zipCode: string };
        property?: { address: string; city: string; zipCode: string; price: number; description: string };
    };
}

interface Dossier {
    id: string;
    ref: string;
    title: string;
}

interface PrintActeDetailProps {
    acte: Acte;
    dossier: Dossier | null;
}

export default function PrintActeDetail({ acte, dossier }: PrintActeDetailProps) {
    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'COMPROMIS': 'Compromis',
            'VENTE': 'Acte de Vente',
            'NOTORIETE': 'Notoriété',
            'DONATION_SIMPLE': 'Donation Simple',
            'TESTAMENT': 'Testament',
            'CONTRAT_MARIAGE': 'Contrat de Mariage',
        };
        return labels[type] || type;
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'FAMILLE': 'Famille',
            'IMMOBILIER': 'Immobilier',
            'AFFAIRES': 'Affaires',
            'AUTRE': 'Autre'
        };
        return labels[category] || category;
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'BROUILLON': 'Brouillon',
            'SIGNE': 'Signé',
            'ENREGISTRE': 'Enregistré'
        };
        return labels[status] || status;
    };

    return (
        <div className="print-container p-8">
            <PrintHeader
                title={acte.title}
                subtitle={getTypeLabel(acte.type)}
            />

            {/* Informations générales */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-slate-300">
                    Informations Générales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Type d'acte</p>
                        <p className="text-sm">{getTypeLabel(acte.type)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Catégorie</p>
                        <p className="text-sm">{getCategoryLabel(acte.category)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Statut</p>
                        <p className="text-sm font-medium">{getStatusLabel(acte.status)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Date de création</p>
                        <p className="text-sm">{formatPrintDate(acte.createdAt)}</p>
                    </div>
                    {dossier && (
                        <div className="col-span-2">
                            <p className="text-xs text-slate-600 font-semibold">Dossier associé</p>
                            <p className="text-sm">{dossier.ref} - {dossier.title}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Métadonnées */}
            {acte.metadata && Object.keys(acte.metadata).length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-slate-300">
                        Détails de l'Acte
                    </h3>

                    {acte.metadata.seller && (
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Vendeur</h4>
                            <div className="pl-4">
                                <p className="text-sm">
                                    {acte.metadata.seller.firstName} {acte.metadata.seller.lastName}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {acte.metadata.seller.address}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {acte.metadata.seller.zipCode} {acte.metadata.seller.city}
                                </p>
                            </div>
                        </div>
                    )}

                    {acte.metadata.buyer && (
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Acheteur</h4>
                            <div className="pl-4">
                                <p className="text-sm">
                                    {acte.metadata.buyer.firstName} {acte.metadata.buyer.lastName}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {acte.metadata.buyer.address}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {acte.metadata.buyer.zipCode} {acte.metadata.buyer.city}
                                </p>
                            </div>
                        </div>
                    )}

                    {acte.metadata.property && (
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Bien Immobilier</h4>
                            <div className="pl-4">
                                <p className="text-sm">{acte.metadata.property.address}</p>
                                <p className="text-sm text-slate-600">
                                    {acte.metadata.property.zipCode} {acte.metadata.property.city}
                                </p>
                                <p className="text-sm text-slate-600 mt-2">
                                    {acte.metadata.property.description}
                                </p>
                                <p className="text-sm font-semibold mt-2">
                                    Prix : {acte.metadata.property.price.toLocaleString('fr-FR')} FCFA
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Espace pour signatures si acte est signé */}
            {acte.status === 'SIGNE' || acte.status === 'ENREGISTRE' && (
                <div className="mt-12 pt-6 border-t-2 border-slate-300">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-sm font-semibold mb-4">Le Notaire</p>
                            <div className="h-20 border-b border-slate-400"></div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold mb-4">Le Client</p>
                            <div className="h-20 border-b border-slate-400"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
