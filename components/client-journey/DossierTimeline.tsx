"use client";

import { TimelineEvent, TimelineEventStatus } from "@/types/client-journey";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    CheckCircle2,
    Clock,
    FileText,
    CreditCard,
    Calendar,
    FileSignature,
    FolderPlus,
    AlertCircle,
    XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DossierTimelineProps {
    events: TimelineEvent[];
}

export function DossierTimeline({ events }: DossierTimelineProps) {
    const getIcon = (type: string) => {
        const icons: Record<string, any> = {
            DOSSIER_CREATED: FolderPlus,
            PAYMENT_RECEIVED: CreditCard,
            APPOINTMENT_SCHEDULED: Calendar,
            ACTE_GENERATED: FileText,
            SIGNATURE: FileSignature,
            STATUS_CHANGE: AlertCircle,
            DOCUMENT_ADDED: FileText
        };
        return icons[type] || Clock;
    };

    const getStatusColor = (status: TimelineEventStatus) => {
        const colors: Record<TimelineEventStatus, string> = {
            COMPLETED: 'bg-green-100 text-green-700 border-green-200',
            IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
            PENDING: 'bg-gray-100 text-gray-700 border-gray-200',
            CANCELLED: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status];
    };

    const getStatusIcon = (status: TimelineEventStatus) => {
        const icons: Record<TimelineEventStatus, any> = {
            COMPLETED: CheckCircle2,
            IN_PROGRESS: Clock,
            PENDING: Clock,
            CANCELLED: XCircle
        };
        return icons[status];
    };

    const getStatusLabel = (status: TimelineEventStatus) => {
        const labels: Record<TimelineEventStatus, string> = {
            COMPLETED: 'Terminé',
            IN_PROGRESS: 'En cours',
            PENDING: 'À venir',
            CANCELLED: 'Annulé'
        };
        return labels[status];
    };

    return (
        <div className="space-y-4">
            {events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    Aucun événement pour ce dossier
                </div>
            ) : (
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                    {events.map((event, index) => {
                        const Icon = getIcon(event.type);
                        const StatusIcon = getStatusIcon(event.status);

                        return (
                            <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
                                {/* Icon circle */}
                                <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 ${event.status === 'COMPLETED' ? 'bg-green-50 border-green-500' :
                                        event.status === 'IN_PROGRESS' ? 'bg-blue-50 border-blue-500' :
                                            event.status === 'PENDING' ? 'bg-gray-50 border-gray-300' :
                                                'bg-red-50 border-red-500'
                                    }`}>
                                    <Icon className={`h-5 w-5 ${event.status === 'COMPLETED' ? 'text-green-600' :
                                            event.status === 'IN_PROGRESS' ? 'text-blue-600' :
                                                event.status === 'PENDING' ? 'text-gray-400' :
                                                    'text-red-600'
                                        }`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <div className="flex items-start justify-between mb-1">
                                        <h4 className="font-semibold text-sm">{event.title}</h4>
                                        <Badge className={`${getStatusColor(event.status)} border`}>
                                            <StatusIcon className="mr-1 h-3 w-3" />
                                            {getStatusLabel(event.status)}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>
                                            {format(new Date(event.date), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                                        </span>
                                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                                            <span className="text-xs bg-muted px-2 py-1 rounded">
                                                {Object.entries(event.metadata).map(([key, value]) => (
                                                    <span key={key} className="mr-2">
                                                        {key}: {typeof value === 'number' ? value.toLocaleString() : value}
                                                    </span>
                                                ))}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
