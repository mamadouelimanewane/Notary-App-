// Types pour le système de notifications multi-canal

export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push' | 'in-app';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'read';

export interface NotificationTemplate {
    id: string;
    name: string;
    type: string; // 'appointment_reminder', 'payment_reminder', 'document_ready', etc.
    channels: NotificationChannel[];
    subject?: string; // Pour email
    message: string;
    variables: string[]; // Variables disponibles: {clientName}, {date}, etc.
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationPreference {
    userId: string;
    clientId?: string;
    channels: {
        email: boolean;
        sms: boolean;
        whatsapp: boolean;
        push: boolean;
        inApp: boolean;
    };
    types: {
        appointments: boolean;
        payments: boolean;
        documents: boolean;
        general: boolean;
    };
    quietHours?: {
        enabled: boolean;
        start: string; // "22:00"
        end: string; // "08:00"
    };
}

export interface MultiChannelNotification {
    id: string;
    templateId?: string;
    recipientId: string; // Client or User ID
    recipientType: 'client' | 'user';
    channels: NotificationChannel[];
    priority: NotificationPriority;
    type: string;
    subject?: string;
    message: string;
    data?: Record<string, any>; // Données additionnelles
    scheduledFor?: string; // Pour planification
    status: NotificationStatus;
    sentAt?: string;
    deliveredAt?: string;
    readAt?: string;
    failureReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationLog {
    id: string;
    notificationId: string;
    channel: NotificationChannel;
    status: NotificationStatus;
    provider?: string; // 'smtp', 'twilio', 'whatsapp-business', etc.
    response?: any;
    error?: string;
    timestamp: string;
}

export interface NotificationConfig {
    email: {
        enabled: boolean;
        provider: 'smtp' | 'sendgrid' | 'mailgun';
        from: string;
        fromName: string;
        smtp?: {
            host: string;
            port: number;
            secure: boolean;
            user: string;
            password: string;
        };
        apiKey?: string;
    };
    sms: {
        enabled: boolean;
        provider: 'twilio' | 'vonage' | 'africas-talking';
        from: string;
        apiKey?: string;
        apiSecret?: string;
        accountSid?: string;
    };
    whatsapp: {
        enabled: boolean;
        provider: 'twilio' | 'whatsapp-business';
        from: string;
        apiKey?: string;
        accountSid?: string;
    };
    push: {
        enabled: boolean;
        provider: 'firebase' | 'onesignal';
        apiKey?: string;
        appId?: string;
    };
}
