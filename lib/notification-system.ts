// Système de Notifications Automatiques
// Gestion des notifications multi-canaux (Email, SMS, Push, In-App)

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    recipientId: string;
    recipientEmail?: string;
    recipientPhone?: string;
    channels: NotificationChannel[];
    priority: NotificationPriority;
    status: NotificationStatus;
    metadata?: Record<string, any>;
    scheduledFor?: Date;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    createdAt: Date;
    expiresAt?: Date;
}

export type NotificationType =
    | 'workflow_step_assigned'
    | 'workflow_step_completed'
    | 'workflow_completed'
    | 'document_uploaded'
    | 'document_missing'
    | 'appointment_reminder'
    | 'appointment_confirmed'
    | 'signature_required'
    | 'signature_completed'
    | 'payment_due'
    | 'payment_received'
    | 'deadline_approaching'
    | 'deadline_passed'
    | 'message_received'
    | 'acte_ready'
    | 'acte_signed'
    | 'custom';

// Templates de notifications
export const NOTIFICATION_TEMPLATES: Record<NotificationType, {
    title: string;
    message: (data: any) => string;
    channels: NotificationChannel[];
    priority: NotificationPriority;
}> = {
    workflow_step_assigned: {
        title: 'Nouvelle tâche assignée',
        message: (data) => `Une nouvelle tâche "${data.stepName}" vous a été assignée pour le dossier ${data.dossierId}.`,
        channels: ['email', 'in_app', 'push'],
        priority: 'normal'
    },
    workflow_step_completed: {
        title: 'Étape complétée',
        message: (data) => `L'étape "${data.stepName}" a été complétée pour le dossier ${data.dossierId}.`,
        channels: ['in_app'],
        priority: 'low'
    },
    workflow_completed: {
        title: 'Dossier terminé',
        message: (data) => `Le dossier ${data.dossierId} (${data.acteType}) a été complété avec succès.`,
        channels: ['email', 'in_app', 'sms'],
        priority: 'high'
    },
    document_uploaded: {
        title: 'Document reçu',
        message: (data) => `Le document "${data.documentName}" a été téléchargé pour le dossier ${data.dossierId}.`,
        channels: ['in_app'],
        priority: 'low'
    },
    document_missing: {
        title: 'Document manquant',
        message: (data) => `Le document "${data.documentName}" est requis pour le dossier ${data.dossierId}. Merci de le fournir dans les plus brefs délais.`,
        channels: ['email', 'sms', 'in_app'],
        priority: 'high'
    },
    appointment_reminder: {
        title: 'Rappel de rendez-vous',
        message: (data) => `Rappel : Vous avez rendez-vous le ${data.date} à ${data.time} pour ${data.purpose}.`,
        channels: ['email', 'sms', 'push'],
        priority: 'high'
    },
    appointment_confirmed: {
        title: 'Rendez-vous confirmé',
        message: (data) => `Votre rendez-vous du ${data.date} à ${data.time} est confirmé.`,
        channels: ['email', 'sms', 'in_app'],
        priority: 'normal'
    },
    signature_required: {
        title: 'Signature requise',
        message: (data) => `Votre signature est requise pour l'acte ${data.acteType} du dossier ${data.dossierId}. Cliquez ici pour signer.`,
        channels: ['email', 'sms', 'push'],
        priority: 'urgent'
    },
    signature_completed: {
        title: 'Signature effectuée',
        message: (data) => `L'acte ${data.acteType} a été signé avec succès.`,
        channels: ['email', 'in_app'],
        priority: 'normal'
    },
    payment_due: {
        title: 'Paiement en attente',
        message: (data) => `Un paiement de ${data.amount} FCFA est attendu pour le dossier ${data.dossierId}. Échéance : ${data.dueDate}.`,
        channels: ['email', 'sms', 'in_app'],
        priority: 'high'
    },
    payment_received: {
        title: 'Paiement reçu',
        message: (data) => `Votre paiement de ${data.amount} FCFA a bien été reçu. Merci.`,
        channels: ['email', 'sms', 'in_app'],
        priority: 'normal'
    },
    deadline_approaching: {
        title: 'Échéance proche',
        message: (data) => `L'échéance pour "${data.taskName}" approche (${data.daysLeft} jours restants).`,
        channels: ['email', 'in_app', 'push'],
        priority: 'high'
    },
    deadline_passed: {
        title: 'Échéance dépassée',
        message: (data) => `URGENT : L'échéance pour "${data.taskName}" est dépassée de ${data.daysOverdue} jours.`,
        channels: ['email', 'sms', 'push'],
        priority: 'urgent'
    },
    message_received: {
        title: 'Nouveau message',
        message: (data) => `Vous avez reçu un nouveau message de ${data.senderName} concernant le dossier ${data.dossierId}.`,
        channels: ['email', 'push', 'in_app'],
        priority: 'normal'
    },
    acte_ready: {
        title: 'Acte prêt',
        message: (data) => `Votre acte ${data.acteType} est prêt. Vous pouvez venir le signer.`,
        channels: ['email', 'sms', 'in_app'],
        priority: 'high'
    },
    acte_signed: {
        title: 'Acte signé',
        message: (data) => `L'acte ${data.acteType} a été signé. Les formalités sont en cours.`,
        channels: ['email', 'in_app'],
        priority: 'normal'
    },
    custom: {
        title: 'Notification',
        message: (data) => data.message || 'Vous avez une nouvelle notification.',
        channels: ['in_app'],
        priority: 'normal'
    }
};

// Gestionnaire de notifications
export class NotificationManager {
    // Créer une notification
    static createNotification(
        type: NotificationType,
        recipientId: string,
        data: any,
        options?: {
            channels?: NotificationChannel[];
            priority?: NotificationPriority;
            scheduledFor?: Date;
            expiresAt?: Date;
        }
    ): Notification {
        const template = NOTIFICATION_TEMPLATES[type];

        return {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            title: data.title || template.title,
            message: data.message || template.message(data),
            recipientId,
            recipientEmail: data.email,
            recipientPhone: data.phone,
            channels: options?.channels || template.channels,
            priority: options?.priority || template.priority,
            status: 'pending',
            metadata: data,
            scheduledFor: options?.scheduledFor,
            createdAt: new Date(),
            expiresAt: options?.expiresAt
        };
    }

    // Envoyer une notification
    static async sendNotification(notification: Notification): Promise<void> {
        // Vérifier si la notification est planifiée
        if (notification.scheduledFor && notification.scheduledFor > new Date()) {
            console.log(`Notification ${notification.id} scheduled for ${notification.scheduledFor}`);
            return;
        }

        // Envoyer sur chaque canal
        for (const channel of notification.channels) {
            try {
                await this.sendToChannel(notification, channel);
            } catch (error) {
                console.error(`Failed to send notification ${notification.id} via ${channel}:`, error);
            }
        }

        notification.status = 'sent';
        notification.sentAt = new Date();
    }

    // Envoyer sur un canal spécifique
    private static async sendToChannel(
        notification: Notification,
        channel: NotificationChannel
    ): Promise<void> {
        switch (channel) {
            case 'email':
                await this.sendEmail(notification);
                break;
            case 'sms':
                await this.sendSMS(notification);
                break;
            case 'push':
                await this.sendPush(notification);
                break;
            case 'in_app':
                await this.sendInApp(notification);
                break;
            case 'whatsapp':
                await this.sendWhatsApp(notification);
                break;
        }
    }

    // Envoyer par email
    private static async sendEmail(notification: Notification): Promise<void> {
        // TODO: Intégrer avec un service d'email (SendGrid, Mailgun, etc.)
        console.log(`📧 Email sent to ${notification.recipientEmail}:`, {
            subject: notification.title,
            body: notification.message
        });
    }

    // Envoyer par SMS
    private static async sendSMS(notification: Notification): Promise<void> {
        // TODO: Intégrer avec un service SMS (Twilio, Orange SMS API, etc.)
        console.log(`📱 SMS sent to ${notification.recipientPhone}:`, notification.message);
    }

    // Envoyer notification push
    private static async sendPush(notification: Notification): Promise<void> {
        // TODO: Intégrer avec Firebase Cloud Messaging ou OneSignal
        console.log(`🔔 Push notification sent:`, {
            title: notification.title,
            body: notification.message
        });
    }

    // Envoyer notification in-app
    private static async sendInApp(notification: Notification): Promise<void> {
        // TODO: Sauvegarder dans la base de données pour affichage dans l'app
        console.log(`💬 In-app notification created:`, {
            recipientId: notification.recipientId,
            title: notification.title,
            message: notification.message
        });
    }

    // Envoyer par WhatsApp
    private static async sendWhatsApp(notification: Notification): Promise<void> {
        // TODO: Intégrer avec WhatsApp Business API
        console.log(`💚 WhatsApp message sent to ${notification.recipientPhone}:`, notification.message);
    }

    // Marquer comme lue
    static markAsRead(notification: Notification): Notification {
        notification.status = 'read';
        notification.readAt = new Date();
        return notification;
    }

    // Marquer comme délivrée
    static markAsDelivered(notification: Notification): Notification {
        notification.status = 'delivered';
        notification.deliveredAt = new Date();
        return notification;
    }

    // Planifier une notification
    static scheduleNotification(
        type: NotificationType,
        recipientId: string,
        data: any,
        scheduledFor: Date
    ): Notification {
        return this.createNotification(type, recipientId, data, { scheduledFor });
    }

    // Envoyer des rappels automatiques
    static async sendAutomaticReminders(): Promise<void> {
        // TODO: Implémenter la logique de rappels automatiques
        // - Rappels de rendez-vous (24h avant, 1h avant)
        // - Rappels d'échéances
        // - Rappels de documents manquants
        console.log('🔔 Checking for automatic reminders...');
    }
}

// Notifications spécifiques au workflow
export class WorkflowNotifications {
    // Notification d'assignation d'étape
    static notifyStepAssigned(
        userId: string,
        stepName: string,
        dossierId: string,
        dueDate?: Date
    ): Notification {
        return NotificationManager.createNotification(
            'workflow_step_assigned',
            userId,
            {
                stepName,
                dossierId,
                dueDate: dueDate?.toLocaleDateString('fr-FR')
            }
        );
    }

    // Notification de complétion d'étape
    static notifyStepCompleted(
        userId: string,
        stepName: string,
        dossierId: string
    ): Notification {
        return NotificationManager.createNotification(
            'workflow_step_completed',
            userId,
            {
                stepName,
                dossierId
            }
        );
    }

    // Notification de workflow terminé
    static notifyWorkflowCompleted(
        userId: string,
        dossierId: string,
        acteType: string
    ): Notification {
        return NotificationManager.createNotification(
            'workflow_completed',
            userId,
            {
                dossierId,
                acteType
            }
        );
    }

    // Notification d'échéance proche
    static notifyDeadlineApproaching(
        userId: string,
        taskName: string,
        daysLeft: number
    ): Notification {
        return NotificationManager.createNotification(
            'deadline_approaching',
            userId,
            {
                taskName,
                daysLeft
            },
            {
                priority: daysLeft <= 1 ? 'urgent' : 'high'
            }
        );
    }

    // Notification de document manquant
    static notifyDocumentMissing(
        userId: string,
        documentName: string,
        dossierId: string
    ): Notification {
        return NotificationManager.createNotification(
            'document_missing',
            userId,
            {
                documentName,
                dossierId
            }
        );
    }
}

// Préférences de notification par utilisateur
export interface NotificationPreferences {
    userId: string;
    channels: {
        email: boolean;
        sms: boolean;
        push: boolean;
        in_app: boolean;
        whatsapp: boolean;
    };
    frequency: {
        immediate: boolean;
        daily_digest: boolean;
        weekly_digest: boolean;
    };
    types: {
        [key in NotificationType]?: boolean;
    };
    quiet_hours: {
        enabled: boolean;
        start: string; // HH:mm
        end: string; // HH:mm
    };
}

// Gestionnaire de préférences
export class NotificationPreferencesManager {
    // Obtenir les préférences par défaut
    static getDefaultPreferences(userId: string): NotificationPreferences {
        return {
            userId,
            channels: {
                email: true,
                sms: true,
                push: true,
                in_app: true,
                whatsapp: false
            },
            frequency: {
                immediate: true,
                daily_digest: false,
                weekly_digest: false
            },
            types: {
                workflow_step_assigned: true,
                workflow_completed: true,
                document_missing: true,
                appointment_reminder: true,
                signature_required: true,
                payment_due: true,
                deadline_approaching: true,
                deadline_passed: true
            },
            quiet_hours: {
                enabled: true,
                start: '22:00',
                end: '08:00'
            }
        };
    }

    // Vérifier si une notification doit être envoyée selon les préférences
    static shouldSendNotification(
        notification: Notification,
        preferences: NotificationPreferences
    ): boolean {
        // Vérifier si le type de notification est activé
        if (preferences.types[notification.type] === false) {
            return false;
        }

        // Vérifier les heures de silence
        if (preferences.quiet_hours.enabled && this.isQuietHours(preferences.quiet_hours)) {
            // Ne pas envoyer sauf si urgent
            return notification.priority === 'urgent';
        }

        return true;
    }

    // Vérifier si on est en heures de silence
    private static isQuietHours(quietHours: NotificationPreferences['quiet_hours']): boolean {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        return currentTime >= quietHours.start || currentTime <= quietHours.end;
    }

    // Filtrer les canaux selon les préférences
    static filterChannels(
        channels: NotificationChannel[],
        preferences: NotificationPreferences
    ): NotificationChannel[] {
        return channels.filter(channel => preferences.channels[channel]);
    }
}
