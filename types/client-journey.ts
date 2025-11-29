// Client Onboarding Types
export type OnboardingStatus = 'PENDING' | 'DOCUMENTS_UPLOADED' | 'VERIFIED' | 'COMPLETED';

export interface ClientOnboarding {
    id: string;
    clientId: string;
    status: OnboardingStatus;
    documents: {
        idCard?: {
            front: string;
            back: string;
            verified: boolean;
        };
        proofOfAddress?: {
            file: string;
            verified: boolean;
        };
        additionalDocs?: Array<{
            name: string;
            file: string;
        }>;
    };
    extractedData?: {
        firstName: string;
        lastName: string;
        birthDate: string;
        idNumber: string;
        address: string;
    };
    createdAt: string;
    completedAt?: string;
}

// Timeline Types
export type TimelineEventType =
    | 'STATUS_CHANGE'
    | 'DOCUMENT_ADDED'
    | 'PAYMENT_RECEIVED'
    | 'APPOINTMENT_SCHEDULED'
    | 'SIGNATURE'
    | 'DOSSIER_CREATED'
    | 'ACTE_GENERATED';

export type TimelineEventStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'CANCELLED';

export interface TimelineEvent {
    id: string;
    dossierId: string;
    type: TimelineEventType;
    title: string;
    description: string;
    date: string;
    status: TimelineEventStatus;
    icon?: string;
    metadata?: Record<string, any>;
    createdBy?: string;
}

// Notification Types
export type NotificationType = 'EMAIL' | 'SMS' | 'PUSH';
export type NotificationTemplate =
    | 'DOSSIER_CREATED'
    | 'PAYMENT_RECEIVED'
    | 'APPOINTMENT_REMINDER'
    | 'SIGNATURE_READY'
    | 'STATUS_CHANGED'
    | 'DOCUMENT_REQUIRED';

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface Notification {
    id: string;
    type: NotificationType;
    recipient: string; // email or phone
    template: NotificationTemplate;
    data: Record<string, any>;
    status: NotificationStatus;
    sentAt?: string;
    createdAt: string;
    error?: string;
}
