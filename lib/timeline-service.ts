import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import { TimelineEvent, TimelineEventType, TimelineEventStatus } from '@/types/client-journey';

export class TimelineService {
    private static instance: TimelineService;

    private constructor() { }

    public static getInstance(): TimelineService {
        if (!TimelineService.instance) {
            TimelineService.instance = new TimelineService();
        }
        return TimelineService.instance;
    }

    public addEvent(
        dossierId: string,
        type: TimelineEventType,
        title: string,
        description: string,
        status: TimelineEventStatus = 'COMPLETED',
        metadata?: Record<string, any>,
        createdBy?: string
    ): TimelineEvent {
        const event: TimelineEvent = {
            id: uuidv4(),
            dossierId,
            type,
            title,
            description,
            date: new Date().toISOString(),
            status,
            metadata,
            createdBy
        };

        db.timelineEvents.push(event);
        db.save();
        return event;
    }

    public getEventsByDossier(dossierId: string): TimelineEvent[] {
        return db.timelineEvents
            .filter(e => e.dossierId === dossierId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    public updateEventStatus(id: string, status: TimelineEventStatus): TimelineEvent | null {
        const event = db.timelineEvents.find(e => e.id === id);
        if (!event) return null;

        event.status = status;
        db.save();
        return event;
    }

    // Automatic event creators
    public onDossierCreated(dossierId: string, reference: string, createdBy: string): TimelineEvent {
        return this.addEvent(
            dossierId,
            'DOSSIER_CREATED',
            'Dossier créé',
            `Le dossier ${reference} a été créé et est en cours de traitement.`,
            'COMPLETED',
            { reference },
            createdBy
        );
    }

    public onPaymentReceived(dossierId: string, amount: number, createdBy: string): TimelineEvent {
        return this.addEvent(
            dossierId,
            'PAYMENT_RECEIVED',
            'Paiement reçu',
            `Versement de ${amount.toLocaleString()} FCFA enregistré.`,
            'COMPLETED',
            { amount },
            createdBy
        );
    }

    public onAppointmentScheduled(dossierId: string, date: string, purpose: string, createdBy: string): TimelineEvent {
        return this.addEvent(
            dossierId,
            'APPOINTMENT_SCHEDULED',
            'Rendez-vous programmé',
            `RDV fixé le ${date} pour ${purpose}.`,
            'PENDING',
            { date, purpose },
            createdBy
        );
    }

    public onActeGenerated(dossierId: string, acteType: string, createdBy: string): TimelineEvent {
        return this.addEvent(
            dossierId,
            'ACTE_GENERATED',
            'Acte généré',
            `L'acte ${acteType} a été généré et est prêt pour signature.`,
            'COMPLETED',
            { acteType },
            createdBy
        );
    }

    public onSignature(dossierId: string, acteType: string, createdBy: string): TimelineEvent {
        return this.addEvent(
            dossierId,
            'SIGNATURE',
            'Acte signé',
            `L'acte ${acteType} a été signé par toutes les parties.`,
            'COMPLETED',
            { acteType },
            createdBy
        );
    }

    public onStatusChange(dossierId: string, oldStatus: string, newStatus: string, createdBy: string): TimelineEvent {
        return this.addEvent(
            dossierId,
            'STATUS_CHANGE',
            'Changement de statut',
            `Le dossier est passé de "${oldStatus}" à "${newStatus}".`,
            'COMPLETED',
            { oldStatus, newStatus },
            createdBy
        );
    }
}
