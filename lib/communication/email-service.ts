import { CommunicationTemplate, CommunicationLog, CommunicationChannel } from '../types';
import { db } from '../db';

export class EmailService {
    /**
     * Send a simple email
     */
    async sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
        try {
            // In production, use nodemailer
            // For now, simulate sending
            console.log('📧 EMAIL SENT:');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body: ${html.substring(0, 100)}...`);

            // Log communication
            const log: CommunicationLog = {
                id: `log-${Date.now()}`,
                channel: 'EMAIL',
                recipient: to,
                subject,
                content: html,
                status: 'SENT',
                sentAt: new Date().toISOString(),
                metadata: {},
                createdAt: new Date().toISOString()
            };

            db.addCommunicationLog(log);

            return {
                success: true,
                messageId: `msg-${Date.now()}`
            };
        } catch (error: any) {
            console.error('Error sending email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send email using a template
     */
    async sendTemplateEmail(
        templateId: string,
        to: string,
        variables: Record<string, any>
    ): Promise<{ success: boolean; messageId?: string; error?: string }> {
        try {
            const template = db.getCommunicationTemplate(templateId);
            if (!template) {
                throw new Error('Template not found');
            }

            if (template.channel !== 'EMAIL') {
                throw new Error('Template is not for email');
            }

            // Replace variables in subject and body
            let subject = template.subject || '';
            let body = template.body;

            for (const [key, value] of Object.entries(variables)) {
                const placeholder = `{{${key}}}`;
                subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
                body = body.replace(new RegExp(placeholder, 'g'), String(value));
            }

            // Send email
            const result = await this.sendEmail(to, subject, body);

            // Update log with template info
            if (result.success) {
                const logs = db.communicationLogs;
                const lastLog = logs[logs.length - 1];
                if (lastLog) {
                    db.updateCommunicationLog(lastLog.id, { templateId });
                }
            }

            return result;
        } catch (error: any) {
            console.error('Error sending template email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send bulk emails
     */
    async sendBulkEmails(
        recipients: string[],
        subject: string,
        html: string
    ): Promise<{ sent: number; failed: number; errors: string[] }> {
        const results = {
            sent: 0,
            failed: 0,
            errors: [] as string[]
        };

        for (const recipient of recipients) {
            const result = await this.sendEmail(recipient, subject, html);
            if (result.success) {
                results.sent++;
            } else {
                results.failed++;
                results.errors.push(`${recipient}: ${result.error}`);
            }
        }

        return results;
    }
}

export const emailService = new EmailService();
