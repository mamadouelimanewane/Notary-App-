"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Edit2, Trash2, Save, X, Download } from "lucide-react";
import Link from "next/link";
import { generateCompromisPDF } from "@/lib/pdf-generator";
import PrintButton from "@/components/PrintButton";
import PrintActeDetail from "@/components/print/PrintActeDetail";

interface Acte {
    id: string;
    type: string;
    category: string;
    title: string;
    createdAt: string;
    dossierId: string;
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

interface ActeDetailPageProps {
    acte: Acte;
    dossier: Dossier | null;
}

export default function ActeDetailPageClient({ acte: initialActe, dossier }: ActeDetailPageProps) {
    const router = useRouter();
    const [acte, setActe] = useState(initialActe);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialActe);
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/actes/${acte.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update acte');

            const updatedActe = await response.json();
            setActe(updatedActe);
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error('Error updating acte:', error);
            alert('Erreur lors de la mise à jour de l\'acte');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet acte ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/actes/${acte.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete acte');

            router.push('/dashboard/actes');
        } catch (error) {
            console.error('Error deleting acte:', error);
            alert('Erreur lors de la suppression de l\'acte');
        }
    };

    const handleCancel = () => {
        setFormData(acte);
        setIsEditing(false);
    };

    const handleDownload = () => {
        if (acte.type === 'COMPROMIS' && acte.metadata?.seller && acte.metadata?.buyer && acte.metadata?.property) {
            generateCompromisPDF(
                { ref: dossier?.ref || '', title: dossier?.title || '' },
                acte.metadata.buyer,
                acte.metadata.seller,
                acte.metadata.property
            );
        }
    };

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

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/actes" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">{acte.title}</h1>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${acte.status === 'SIGNE' ? 'bg-green-100 text-green-800' :
                        acte.status === 'ENREGISTRE' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {acte.status}
                    </span>
                </div>

                <div className="flex gap-2">
                    {!isEditing ? (
                        <>
                            <PrintButton
                                label="Imprimer"
                                variant="outline"
                                onBeforePrint={() => setShowPrintPreview(true)}
                            />
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <Download className="mr-2 h-4 w-4" /> Télécharger
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800"
                            >
                                <Edit2 className="mr-2 h-4 w-4" /> Modifier
                            </button>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-red-600 text-white hover:bg-red-700"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                            >
                                <Save className="mr-2 h-4 w-4" /> Enregistrer
                            </button>
                            <button
                                onClick={handleCancel}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-slate-200 text-slate-900 hover:bg-slate-300"
                            >
                                <X className="mr-2 h-4 w-4" /> Annuler
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Acte Information */}
            <div className="rounded-xl border bg-white shadow p-6 space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Informations Générales</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Titre</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        ) : (
                            <p className="text-sm">{acte.title}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Type</label>
                        <p className="text-sm">{getTypeLabel(acte.type)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Catégorie</label>
                        <p className="text-sm">{getCategoryLabel(acte.category)}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Statut</label>
                        {isEditing ? (
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="BROUILLON">Brouillon</option>
                                <option value="SIGNE">Signé</option>
                                <option value="ENREGISTRE">Enregistré</option>
                            </select>
                        ) : (
                            <p className="text-sm">{acte.status}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Date de Création</label>
                        <p className="text-sm">{new Date(acte.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Dossier Associé</label>
                        {dossier ? (
                            <Link href={`/dashboard/dossiers/${dossier.id}`} className="text-sm text-blue-600 hover:underline">
                                {dossier.ref} - {dossier.title}
                            </Link>
                        ) : (
                            <p className="text-sm">-</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Metadata (if available) */}
            {acte.metadata && Object.keys(acte.metadata).length > 0 && (
                <div className="rounded-xl border bg-white shadow p-6 space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Métadonnées</h2>

                    {acte.metadata.seller && (
                        <div className="space-y-2">
                            <h3 className="font-medium text-slate-700">Vendeur</h3>
                            <p className="text-sm">{acte.metadata.seller.firstName} {acte.metadata.seller.lastName}</p>
                            <p className="text-sm text-slate-600">{acte.metadata.seller.address}, {acte.metadata.seller.zipCode} {acte.metadata.seller.city}</p>
                        </div>
                    )}

                    {acte.metadata.buyer && (
                        <div className="space-y-2">
                            <h3 className="font-medium text-slate-700">Acheteur</h3>
                            <p className="text-sm">{acte.metadata.buyer.firstName} {acte.metadata.buyer.lastName}</p>
                            <p className="text-sm text-slate-600">{acte.metadata.buyer.address}, {acte.metadata.buyer.zipCode} {acte.metadata.buyer.city}</p>
                        </div>
                    )}

                    {acte.metadata.property && (
                        <div className="space-y-2">
                            <h3 className="font-medium text-slate-700">Propriété</h3>
                            <p className="text-sm">{acte.metadata.property.address}, {acte.metadata.property.zipCode} {acte.metadata.property.city}</p>
                            <p className="text-sm text-slate-600">{acte.metadata.property.description}</p>
                            <p className="text-sm font-medium">Prix: {acte.metadata.property.price.toLocaleString('fr-FR')} FCFA</p>
                        </div>
                    )}
                </div>
            )}

            {/* Print Preview (hidden on screen, visible when printing) */}
            {showPrintPreview && (
                <div className="print-container hidden" data-print="show">
                    <PrintActeDetail
                        acte={acte}
                        dossier={dossier}
                    />
                </div>
            )}
        </div>
    );
}
