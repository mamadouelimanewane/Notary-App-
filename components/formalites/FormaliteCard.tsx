'use client';

import { Formalite, FormaliteStatus, FormalitePriorite } from '@/types/formalite-types';
import FormaliteStatusBadge from './FormaliteStatusBadge';
import { Calendar, AlertCircle, CheckCircle, Clock, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FormaliteCardProps {
    formalite: Formalite & {
        isEnRetard?: boolean;
        joursRestants?: number | null;
    };
    onStatusChange?: (id: string, newStatus: FormaliteStatus) => void;
    onClick?: () => void;
}

const PRIORITE_COLORS = {
    [FormalitePriorite.BASSE]: 'text-gray-500',
    [FormalitePriorite.NORMALE]: 'text-blue-500',
    [FormalitePriorite.HAUTE]: 'text-orange-500',
    [FormalitePriorite.URGENTE]: 'text-red-500'
};

export default function FormaliteCard({ formalite, onStatusChange, onClick }: FormaliteCardProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Non définie';
        return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getEcheanceInfo = () => {
        if (!formalite.dateEcheance) return null;

        if (formalite.isEnRetard) {
            return (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">En retard</span>
                </div>
            );
        }

        if (formalite.joursRestants !== null && formalite.joursRestants <= 7) {
            return (
                <div className="flex items-center gap-1 text-orange-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{formalite.joursRestants} jour(s) restant(s)</span>
                </div>
            );
        }

        return null;
    };

    return (
        <div
            className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer ${formalite.isEnRetard ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{formalite.titre}</h3>
                        <span className={`text-xs ${PRIORITE_COLORS[formalite.priorite]}`}>
                            {formalite.priorite}
                        </span>
                    </div>
                    {formalite.reference && (
                        <p className="text-xs text-gray-500">Réf: {formalite.reference}</p>
                    )}
                </div>
                <FormaliteStatusBadge statut={formalite.statut} />
            </div>

            {/* Description */}
            {formalite.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{formalite.description}</p>
            )}

            {/* Organisme */}
            {formalite.organisme && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Building2 className="w-4 h-4" />
                    <span className="truncate">{formalite.organisme}</span>
                </div>
            )}

            {/* Dates et alertes */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Échéance: {formatDate(formalite.dateEcheance)}</span>
                </div>
                {getEcheanceInfo()}
            </div>

            {/* Frais */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                    <span className="font-medium">Frais total:</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(formalite.frais.total)} {formalite.frais.devise}
                </div>
            </div>

            {/* Actions rapides */}
            {onStatusChange && formalite.statut !== FormaliteStatus.COMPLETEE && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-2">
                        {formalite.statut === FormaliteStatus.EN_ATTENTE && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusChange(formalite.id, FormaliteStatus.EN_COURS);
                                }}
                                className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                            >
                                Démarrer
                            </button>
                        )}
                        {formalite.statut === FormaliteStatus.EN_COURS && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusChange(formalite.id, FormaliteStatus.COMPLETEE);
                                }}
                                className="flex-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                            >
                                <CheckCircle className="w-3 h-3" />
                                Marquer complétée
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
