'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Building2, DollarSign, FileText, Clock, User } from 'lucide-react';
import FormaliteStatusBadge from '@/components/formalites/FormaliteStatusBadge';
import FormaliteTimeline from '@/components/formalites/FormaliteTimeline';
import { Formalite, FormaliteStatus, FormaliteDocument, FormaliteHistorique } from '@/types/formalite-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EnrichedFormalite extends Formalite {
    acte?: any;
    dossier?: any;
    client?: any;
    documents?: FormaliteDocument[];
    historique?: FormaliteHistorique[];
    isEnRetard?: boolean;
    joursRestants?: number | null;
}

export default function FormaliteDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [formalite, setFormalite] = useState<EnrichedFormalite | null>(null);
    const [loading, setLoading] = useState(true);
    const [changingStatus, setChangingStatus] = useState(false);

    useEffect(() => {
        loadFormalite();
    }, [params.id]);

    const loadFormalite = async () => {
        try {
            const response = await fetch(`/api/formalites/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setFormalite(data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement de la formalité:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: FormaliteStatus) => {
        if (!formalite) return;

        const commentaire = prompt('Commentaire (optionnel):');
        if (commentaire === null) return; // Annulé

        setChangingStatus(true);
        try {
            const response = await fetch(`/api/formalites/${formalite.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ statut: newStatus, commentaire })
            });

            if (response.ok) {
                loadFormalite();
            }
        } catch (error) {
            console.error('Erreur lors du changement de statut:', error);
        } finally {
            setChangingStatus(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Non définie';
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!formalite) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Formalité non trouvée</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{formalite.titre}</h1>
                        {formalite.reference && (
                            <p className="text-sm text-gray-500 mt-1">Référence: {formalite.reference}</p>
                        )}
                    </div>
                </div>
                <FormaliteStatusBadge statut={formalite.statut} />
            </div>

            {/* Alertes */}
            {formalite.isEnRetard && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                        <Clock className="w-5 h-5" />
                        <p className="font-medium">Cette formalité est en retard !</p>
                    </div>
                </div>
            )}

            {formalite.joursRestants !== null && formalite.joursRestants > 0 && formalite.joursRestants <= 7 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-orange-800">
                        <Clock className="w-5 h-5" />
                        <p className="font-medium">Échéance dans {formalite.joursRestants} jour(s)</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne principale */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Informations générales */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations Générales</h2>

                        <div className="space-y-4">
                            {formalite.description && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <p className="text-gray-900">{formalite.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <p className="text-gray-900">{formalite.type.replace(/_/g, ' ')}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                                    <p className="text-gray-900">{formalite.priorite}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {formatDate(formalite.dateCreation)}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {formatDate(formalite.dateEcheance)}
                                    </div>
                                </div>
                            </div>

                            {formalite.dateCompletee && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de complétion</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {formatDate(formalite.dateCompletee)}
                                    </div>
                                </div>
                            )}

                            {formalite.organisme && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Organisme destinataire</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                        {formalite.organisme}
                                    </div>
                                </div>
                            )}

                            {formalite.responsable && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <User className="w-4 h-4 text-gray-400" />
                                        {formalite.responsable}
                                    </div>
                                </div>
                            )}

                            {formalite.observations && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{formalite.observations}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Frais */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Frais
                        </h2>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Montant de base</span>
                                <span className="font-medium">{formatCurrency(formalite.frais.montantBase)} {formalite.frais.devise}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Taxe</span>
                                <span className="font-medium">{formatCurrency(formalite.frais.taxe)} {formalite.frais.devise}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Frais de gestion</span>
                                <span className="font-medium">{formatCurrency(formalite.frais.fraisGestion)} {formalite.frais.devise}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200 flex justify-between">
                                <span className="text-lg font-semibold text-gray-900">Total</span>
                                <span className="text-lg font-bold text-blue-600">
                                    {formatCurrency(formalite.frais.total)} {formalite.frais.devise}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Historique */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique</h2>
                        <FormaliteTimeline historique={formalite.historique || []} />
                    </div>
                </div>

                {/* Colonne latérale */}
                <div className="space-y-6">
                    {/* Actions */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>

                        <div className="space-y-2">
                            {formalite.statut === FormaliteStatus.EN_ATTENTE && (
                                <button
                                    onClick={() => handleStatusChange(FormaliteStatus.EN_COURS)}
                                    disabled={changingStatus}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Démarrer la formalité
                                </button>
                            )}

                            {formalite.statut === FormaliteStatus.EN_COURS && (
                                <button
                                    onClick={() => handleStatusChange(FormaliteStatus.COMPLETEE)}
                                    disabled={changingStatus}
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    Marquer comme complétée
                                </button>
                            )}

                            {formalite.statut !== FormaliteStatus.COMPLETEE && formalite.statut !== FormaliteStatus.ANNULEE && (
                                <button
                                    onClick={() => handleStatusChange(FormaliteStatus.REJETEE)}
                                    disabled={changingStatus}
                                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    Rejeter
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Dossier associé */}
                    {formalite.dossier && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dossier</h2>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Référence</p>
                                <p className="font-medium">{formalite.dossier.ref}</p>
                                <p className="text-sm text-gray-600 mt-3">Titre</p>
                                <p className="font-medium">{formalite.dossier.title}</p>
                                {formalite.client && (
                                    <>
                                        <p className="text-sm text-gray-600 mt-3">Client</p>
                                        <p className="font-medium">
                                            {formalite.client.firstName} {formalite.client.lastName}
                                        </p>
                                    </>
                                )}
                                <button
                                    onClick={() => router.push(`/dashboard/dossiers/${formalite.dossierId}`)}
                                    className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Voir le dossier
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Acte associé */}
                    {formalite.acte && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acte</h2>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Type</p>
                                <p className="font-medium">{formalite.acte.type}</p>
                                <p className="text-sm text-gray-600 mt-3">Titre</p>
                                <p className="font-medium">{formalite.acte.title}</p>
                                <button
                                    onClick={() => router.push(`/dashboard/actes/${formalite.acteId}`)}
                                    className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Voir l'acte
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    {formalite.documents && formalite.documents.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Documents ({formalite.documents.length})
                            </h2>
                            <div className="space-y-2">
                                {formalite.documents.map((doc) => (
                                    <div key={doc.id} className="p-3 bg-gray-50 rounded-lg">
                                        <p className="font-medium text-sm">{doc.nom}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDate(doc.dateUpload)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
