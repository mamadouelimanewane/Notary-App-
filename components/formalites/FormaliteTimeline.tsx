'use client';

import { FormaliteHistorique } from '@/types/formalite-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, FileText, CheckCircle, XCircle, Edit, Upload } from 'lucide-react';

interface FormaliteTimelineProps {
    historique: FormaliteHistorique[];
}

const ACTION_ICONS: Record<string, any> = {
    'CREATION': FileText,
    'CHANGEMENT_STATUT': CheckCircle,
    'MODIFICATION': Edit,
    'AJOUT_DOCUMENT': Upload,
    'REJET': XCircle
};

const ACTION_COLORS: Record<string, string> = {
    'CREATION': 'bg-blue-100 text-blue-600',
    'CHANGEMENT_STATUT': 'bg-green-100 text-green-600',
    'MODIFICATION': 'bg-yellow-100 text-yellow-600',
    'AJOUT_DOCUMENT': 'bg-purple-100 text-purple-600',
    'REJET': 'bg-red-100 text-red-600'
};

export default function FormaliteTimeline({ historique }: FormaliteTimelineProps) {
    if (historique.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucun historique disponible</p>
            </div>
        );
    }

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {historique.map((item, index) => {
                    const Icon = ACTION_ICONS[item.action] || Clock;
                    const colorClass = ACTION_COLORS[item.action] || 'bg-gray-100 text-gray-600';
                    const isLast = index === historique.length - 1;

                    return (
                        <li key={item.id}>
                            <div className="relative pb-8">
                                {!isLast && (
                                    <span
                                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                        aria-hidden="true"
                                    />
                                )}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${colorClass}`}>
                                            <Icon className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.action.replace(/_/g, ' ')}
                                            </p>
                                            {item.ancienStatut && item.nouveauStatut && (
                                                <p className="text-sm text-gray-500">
                                                    {item.ancienStatut} → {item.nouveauStatut}
                                                </p>
                                            )}
                                            {item.commentaire && (
                                                <p className="mt-1 text-sm text-gray-600">{item.commentaire}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-400">
                                                Par {item.effectuePar}
                                            </p>
                                        </div>
                                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                            <time dateTime={item.dateAction}>
                                                {format(new Date(item.dateAction), 'dd MMM yyyy', { locale: fr })}
                                                <br />
                                                {format(new Date(item.dateAction), 'HH:mm', { locale: fr })}
                                            </time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
