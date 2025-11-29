'use client';

import { FormaliteStatus } from '@/types/formalite-types';

interface FormaliteStatusBadgeProps {
    statut: FormaliteStatus;
    className?: string;
}

const STATUS_CONFIG = {
    [FormaliteStatus.EN_ATTENTE]: {
        label: 'En Attente',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    [FormaliteStatus.EN_COURS]: {
        label: 'En Cours',
        className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    [FormaliteStatus.COMPLETEE]: {
        label: 'Complétée',
        className: 'bg-green-100 text-green-800 border-green-200'
    },
    [FormaliteStatus.REJETEE]: {
        label: 'Rejetée',
        className: 'bg-red-100 text-red-800 border-red-200'
    },
    [FormaliteStatus.ANNULEE]: {
        label: 'Annulée',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
    }
};

export default function FormaliteStatusBadge({ statut, className = '' }: FormaliteStatusBadgeProps) {
    const config = STATUS_CONFIG[statut];

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className} ${className}`}>
            {config.label}
        </span>
    );
}
