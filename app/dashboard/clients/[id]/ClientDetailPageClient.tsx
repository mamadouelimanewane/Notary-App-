"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Edit2, Trash2, Save, X } from "lucide-react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import PrintClientDetail from "@/components/print/PrintClientDetail";

interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    type: 'PARTICULIER' | 'ENTREPRISE';
    companyName?: string;
    ninea?: string;
    legalForm?: string;
    registrationNumber?: string;
    contactPerson?: string;
    isDeleted?: boolean;
    createdAt?: string;
}

interface Dossier {
    id: string;
    ref: string;
    title: string;
    type: string;
    status: string;
    clientId: string;
}

interface ClientDetailPageProps {
    client: Client;
    dossiers: Dossier[];
}

export default function ClientDetailPageClient({ client: initialClient, dossiers }: ClientDetailPageProps) {
    const router = useRouter();
    const [client, setClient] = useState(initialClient);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialClient);
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/clients/${client.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update client');

            const updatedClient = await response.json();
            setClient(updatedClient);
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error('Error updating client:', error);
            alert('Erreur lors de la mise à jour du client');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/clients/${client.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete client');

            router.push('/dashboard/clients');
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Erreur lors de la suppression du client');
        }
    };

    const handleCancel = () => {
        setFormData(client);
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/clients" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {client.type === 'ENTREPRISE' && client.companyName
                            ? client.companyName
                            : `${client.firstName} ${client.lastName}`}
                    </h1>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-900">
                        {client.type === 'PARTICULIER' ? 'Particulier' : 'Entreprise'}
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

            {/* Client Information */}
            <div className="rounded-xl border bg-white shadow p-6 space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Informations Générales</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Prénom</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        ) : (
                            <p className="text-sm">{client.firstName}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Nom</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        ) : (
                            <p className="text-sm">{client.lastName}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        ) : (
                            <p className="text-sm">{client.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Téléphone</label>
                        {isEditing ? (
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        ) : (
                            <p className="text-sm">{client.phone}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Adresse</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    ) : (
                        <p className="text-sm">{client.address}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Code Postal</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        ) : (
                            <p className="text-sm">{client.zipCode}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Ville</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        ) : (
                            <p className="text-sm">{client.city}</p>
                        )}
                    </div>
                </div>

                {/* Company fields */}
                {client.type === 'ENTREPRISE' && (
                    <>
                        <h2 className="text-lg font-semibold border-b pb-2 mt-6">Informations Entreprise</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Nom de l'Entreprise</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName || ''}
                                    onChange={handleInputChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            ) : (
                                <p className="text-sm">{client.companyName || '-'}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">NINEA</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="ninea"
                                        value={formData.ninea || ''}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                ) : (
                                    <p className="text-sm">{client.ninea || '-'}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Forme Juridique</label>
                                {isEditing ? (
                                    <select
                                        name="legalForm"
                                        value={formData.legalForm || ''}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="SARL">SARL</option>
                                        <option value="SAS">SAS</option>
                                        <option value="SA">SA</option>
                                        <option value="SUARL">SUARL</option>
                                        <option value="SNC">SNC</option>
                                        <option value="GIE">GIE</option>
                                        <option value="AUTRE">Autre</option>
                                    </select>
                                ) : (
                                    <p className="text-sm">{client.legalForm || '-'}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">N° RCCM</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        value={formData.registrationNumber || ''}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                ) : (
                                    <p className="text-sm">{client.registrationNumber || '-'}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Personne de Contact</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson || ''}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                ) : (
                                    <p className="text-sm">{client.contactPerson || '-'}</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Dossiers liés */}
            <div className="rounded-xl border bg-white shadow p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Dossiers Liés</h2>
                    <Link
                        href={`/dashboard/dossiers/new?clientId=${client.id}`}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 bg-slate-900 text-white hover:bg-slate-800"
                    >
                        Nouveau Dossier
                    </Link>
                </div>

                {dossiers.length > 0 ? (
                    <div className="space-y-2">
                        {dossiers.map(dossier => (
                            <Link
                                key={dossier.id}
                                href={`/dashboard/dossiers/${dossier.id}`}
                                className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{dossier.ref} - {dossier.title}</p>
                                        <p className="text-sm text-slate-600">{dossier.type}</p>
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${dossier.status === 'OUVERT' ? 'bg-blue-100 text-blue-800' :
                                        dossier.status === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
                                            dossier.status === 'CLOTURE' ? 'bg-green-100 text-green-800' :
                                                'bg-slate-100 text-slate-800'
                                        }`}>
                                        {dossier.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-600 text-center py-4">Aucun dossier lié à ce client.</p>
                )}
            </div>

            {/* Print Preview (hidden on screen, visible when printing) */}
            {showPrintPreview && (
                <div className="print-container hidden" data-print="show">
                    <PrintClientDetail
                        client={client}
                        dossiers={dossiers}
                    />
                </div>
            )}
        </div>
    );
}
