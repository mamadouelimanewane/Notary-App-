import {
    NotificationChannel,
    MultiChannelNotification,
    NotificationTemplate,
    NotificationConfig,
    NotificationLog
} from '@/types/notifications';

/**
 * Service de notifications multi-canal
 * Gère l'envoi de notifications par Email, SMS, WhatsApp et Push
 */
export class NotificationService {
    private config: NotificationConfig;

    constructor(config: NotificationConfig) {
        this.config = config;
    }

    /**
     * Envoie une notification sur tous les canaux spécifiés
     */
    async send(notification: MultiChannelNotification): Promise<NotificationLog[]> {
        const logs: NotificationLog[] = [];

        for (const channel of notification.channels) {
            try {
                const log = await this.sendToChannel(notification, channel);
                logs.push(log);
            } catch (error) {
                logs.push({
                    id: this.generateId(),
                    notificationId: notification.id,
                    channel,
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                });
            }
        }

        return logs;
    }

    /**
     * Envoie une notification sur un canal spécifique
     */
    private async sendToChannel(
        notification: MultiChannelNotification,
        channel: NotificationChannel
    ): Promise<NotificationLog> {
        const log: NotificationLog = {
            id: this.generateId(),
            notificationId: notification.id,
            channel,
            status: 'pending',
            timestamp: new Date().toISOString()
        };

        try {
            switch (channel) {
                case 'email':
                    await this.sendEmail(notification);
                    break;
                case 'sms':
                    await this.sendSMS(notification);
                    break;
                case 'whatsapp':
                    await this.sendWhatsApp(notification);
                    break;
                case 'push':
                    await this.sendPush(notification);
                    break;
                case 'in-app':
                    await this.sendInApp(notification);
                    break;
            }

            log.status = 'sent';
        } catch (error) {
            log.status = 'failed';
            log.error = error instanceof Error ? error.message : 'Unknown error';
        }

        return log;
    }

    /**
     * Envoie un email
     */
    private async sendEmail(notification: MultiChannelNotification): Promise<void> {
        if (!this.config.email.enabled) {
            throw new Error('Email notifications are disabled');
        }

        // TODO: Implémenter l'envoi réel via SMTP/SendGrid/Mailgun
        console.log('📧 Sending email:', {
            to: notification.recipientId,
            subject: notification.subject,
            message: notification.message
        });

        // Simulation
        await this.delay(500);
    }

    /**
     * Envoie un SMS
     */
    private async sendSMS(notification: MultiChannelNotification): Promise<void> {
        if (!this.config.sms.enabled) {
            throw new Error('SMS notifications are disabled');
        }

        // TODO: Implémenter l'envoi réel via Twilio/Vonage/Africa's Talking
        console.log('📱 Sending SMS:', {
            to: notification.recipientId,
            message: notification.message
        });

        // Simulation
        await this.delay(500);
    }

    /**
     * Envoie un message WhatsApp
     */
    private async sendWhatsApp(notification: MultiChannelNotification): Promise<void> {
        if (!this.config.whatsapp.enabled) {
            throw new Error('WhatsApp notifications are disabled');
        }

        // TODO: Implémenter l'envoi réel via WhatsApp Business API
        console.log('💬 Sending WhatsApp:', {
            to: notification.recipientId,
            message: notification.message
        });

        // Simulation
        await this.delay(500);
    }

    /**
     * Envoie une notification push
     */
    private async sendPush(notification: MultiChannelNotification): Promise<void> {
        if (!this.config.push.enabled) {
            throw new Error('Push notifications are disabled');
        }

        // TODO: Implémenter l'envoi réel via Firebase/OneSignal
        console.log('🔔 Sending push notification:', {
            to: notification.recipientId,
            title: notification.subject,
            message: notification.message
        });

        // Simulation
        await this.delay(500);
    }

    /**
     * Envoie une notification in-app
     */
    private async sendInApp(notification: MultiChannelNotification): Promise<void> {
        // TODO: Sauvegarder dans la base de données
        console.log('📬 Sending in-app notification:', {
            to: notification.recipientId,
            message: notification.message
        });

        // Simulation
        await this.delay(100);
    }

    /**
     * Remplace les variables dans un template
     */
    replaceVariables(template: string, variables: Record<string, string>): string {
        let result = template;

        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{${key}}`, 'g');
            result = result.replace(regex, value);
        }

        return result;
    }

    /**
     * Planifie une notification pour plus tard
     */
    async schedule(notification: MultiChannelNotification, sendAt: Date): Promise<void> {
        // TODO: Implémenter avec un système de queue (Bull, BullMQ, etc.)
        console.log('📅 Scheduling notification for:', sendAt);
    }

    /**
     * Envoie une notification basée sur un template
     */
    async sendFromTemplate(
        template: NotificationTemplate,
        recipientId: string,
        recipientType: 'client' | 'user',
        variables: Record<string, string>
    ): Promise<NotificationLog[]> {
        const message = this.replaceVariables(template.message, variables);
        const subject = template.subject
            ? this.replaceVariables(template.subject, variables)
            : undefined;

        const notification: MultiChannelNotification = {
            id: this.generateId(),
            templateId: template.id,
            recipientId,
            recipientType,
            channels: template.channels,
            priority: 'medium',
            type: template.type,
            subject,
            message,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return this.send(notification);
    }

    /**
     * Envoie un rappel de rendez-vous
     */
    async sendAppointmentReminder(
        recipientId: string,
        appointmentDate: string,
        appointmentTime: string,
        clientName: string
    ): Promise<NotificationLog[]> {
        const notification: MultiChannelNotification = {
            id: this.generateId(),
            recipientId,
            recipientType: 'client',
            channels: ['email', 'sms'],
            priority: 'high',
            type: 'appointment_reminder',
            subject: 'Rappel de rendez-vous',
            message: `Bonjour ${clientName},\n\nCeci est un rappel pour votre rendez-vous le ${appointmentDate} à ${appointmentTime}.\n\nÀ bientôt !`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return this.send(notification);
    }

    /**
     * Envoie un rappel de paiement
     */
    async sendPaymentReminder(
        recipientId: string,
        amount: number,
        dueDate: string,
        clientName: string
    ): Promise<NotificationLog[]> {
        const notification: MultiChannelNotification = {
            id: this.generateId(),
            recipientId,
            recipientType: 'client',
            channels: ['email', 'sms', 'whatsapp'],
            priority: 'high',
            type: 'payment_reminder',
            subject: 'Rappel de paiement',
            message: `Bonjour ${clientName},\n\nNous vous rappelons qu'un paiement de ${amount} FCFA est attendu avant le ${dueDate}.\n\nMerci de régulariser votre situation.`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return this.send(notification);
    }

    /**
     * Notifie qu'un document est prêt
     */
    async sendDocumentReady(
        recipientId: string,
        documentName: string,
        clientName: string
    ): Promise<NotificationLog[]> {
        const notification: MultiChannelNotification = {
            id: this.generateId(),
            recipientId,
            recipientType: 'client',
            channels: ['email', 'push', 'in-app'],
            priority: 'medium',
            type: 'document_ready',
            subject: 'Document prêt',
            message: `Bonjour ${clientName},\n\nVotre document "${documentName}" est maintenant disponible.\n\nVous pouvez le consulter dans votre espace client.`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return this.send(notification);
    }

    // Utilitaires
    private generateId(): string {
        return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Configuration par défaut
export const defaultNotificationConfig: NotificationConfig = {
    email: {
        enabled: true,
        provider: 'smtp',
        from: 'noreply@notaire.sn',
        fromName: 'Cabinet Notaire Keur Jaraaf',
        smtp: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            user: '',
            password: ''
        }
    },
    sms: {
        enabled: false,
        provider: 'twilio',
        from: '+221XXXXXXXXX'
    },
    whatsapp: {
        enabled: false,
        provider: 'twilio',
        from: '+221XXXXXXXXX'
    },
    push: {
        enabled: false,
        provider: 'firebase'
    }
};

// Instance singleton
export const notificationService = new NotificationService(defaultNotificationConfig);
