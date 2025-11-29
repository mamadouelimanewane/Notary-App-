import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationType, NotificationTemplate, NotificationStatus } from '@/types/client-journey';

// Optional: Import SendGrid and Twilio (only if API keys are configured)
let sendgridMail: any = null;
let twilioClient: any = null;

try {
    if (process.env.SENDGRID_API_KEY) {
        sendgridMail = require('@sendgrid/mail');
        sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const twilio = require('twilio');
        twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
} catch (error) {
    console.warn('SendGrid or Twilio not configured. Using simulated notifications.');
}

export class NotificationService {
    private static instance: NotificationService;

    private constructor() { }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    // Email/SMS Templates
    private templates: Record<NotificationTemplate, (data: any) => { subject: string; body: string }> = {
        DOSSIER_CREATED: (data) => ({
            subject: `Votre dossier ${data.reference} a été créé`,
            body: `Bonjour ${data.clientName},\n\nVotre dossier ${data.reference} a été créé avec succès.\nVous pouvez suivre son avancement en temps réel.\n\nCordialement,\nL'Étude Notariale`
        }),
        PAYMENT_RECEIVED: (data) => ({
            subject: `Paiement reçu - ${data.amount} FCFA`,
            body: `Bonjour ${data.clientName},\n\nNous avons bien reçu votre versement de ${data.amount} FCFA pour le dossier ${data.reference}.\n\nMerci pour votre confiance.\n\nCordialement,\nL'Étude Notariale`
        }),
        APPOINTMENT_REMINDER: (data) => ({
            subject: `Rappel RDV - ${data.date}`,
            body: `Bonjour ${data.clientName},\n\nRappel : Rendez-vous le ${data.date} à ${data.time} pour ${data.purpose}.\n\nÀ bientôt,\nL'Étude Notariale`
        }),
        SIGNATURE_READY: (data) => ({
            subject: `Votre acte est prêt pour signature`,
            body: `Bonjour ${data.clientName},\n\nVotre acte ${data.acteType} est prêt pour signature.\nMerci de prendre rendez-vous dans les meilleurs délais.\n\nCordialement,\nL'Étude Notariale`
        }),
        STATUS_CHANGED: (data) => ({
            subject: `Mise à jour de votre dossier ${data.reference}`,
            body: `Bonjour ${data.clientName},\n\nLe statut de votre dossier a changé : ${data.newStatus}\n\n${data.message || ''}\n\nCordialement,\nL'Étude Notariale`
        }),
        DOCUMENT_REQUIRED: (data) => ({
            subject: `Documents requis - ${data.reference}`,
            body: `Bonjour ${data.clientName},\n\nNous avons besoin des documents suivants pour votre dossier ${data.reference} :\n${data.documents.map((d: string) => `- ${d}`).join('\n')}\n\nMerci de nous les transmettre rapidement.\n\nCordialement,\nL'Étude Notariale`
        })
    };

    public async sendNotification(
        type: NotificationType,
        recipient: string,
        template: NotificationTemplate,
        data: Record<string, any>
    ): Promise<Notification> {
        const notification: Notification = {
            id: uuidv4(),
            type,
            recipient,
            template,
            data,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };

        // Add to database
        db.notifications.push(notification);
        db.save();

        // Send notification based on type
        try {
            const content = this.templates[template](data);

            if (type === 'EMAIL') {
                await this.sendEmail(recipient, content.subject, content.body);
            } else if (type === 'SMS') {
                await this.sendSMS(recipient, content.body);
            }

            notification.status = 'SENT';
            notification.sentAt = new Date().toISOString();
        } catch (error: any) {
            notification.status = 'FAILED';
            notification.error = error.message;
            console.error(`Notification failed:`, error);
        }

        db.save();
        return notification;
    }

    private async sendEmail(to: string, subject: string, body: string): Promise<void> {
        if (sendgridMail && process.env.SENDGRID_FROM_EMAIL) {
            // Real SendGrid email
            const msg = {
                to,
                from: process.env.SENDGRID_FROM_EMAIL,
                subject,
                text: body,
                html: body.replace(/\n/g, '<br>')
            };
            await sendgridMail.send(msg);
            console.log(`✅ Email sent to ${to}`);
        } else {
            // Simulated email (console log)
            console.log(`[EMAIL SIMULATION] To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body: ${body}`);
            console.log('---');
        }
    }

    private async sendSMS(to: string, body: string): Promise<void> {
        if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
            // Real Twilio SMS
            await twilioClient.messages.create({
                body,
                from: process.env.TWILIO_PHONE_NUMBER,
                to
            });
            console.log(`✅ SMS sent to ${to}`);
        } else {
            // Simulated SMS (console log)
            console.log(`[SMS SIMULATION] To: ${to}`);
            console.log(`Body: ${body}`);
            console.log('---');
        }
    }

    public getNotifications(): Notification[] {
        return db.notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    public getNotificationsByRecipient(recipient: string): Notification[] {
        return db.notifications
            .filter(n => n.recipient === recipient)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
}
