import { CommunicationLog } from '../types';
import { db } from '../db';

export class SMSService {
    /**
     * Send a simple SMS
     */
    async sendSMS(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
        try {
            // In production, use Twilio
            // For now, simulate sending
            console.log('📱 SMS SENT:');
            console.log(`To: ${to}`);
            console.log(`Message: ${message}`);

            // Log communication
            const log: CommunicationLog = {
                id: `log-${Date.now()}`,
                channel: 'SMS',
                recipient: to,
                content: message,
                status: 'SENT',
                sentAt: new Date().toISOString(),
                metadata: {},
                createdAt: new Date().toISOString()
            };

            db.addCommunicationLog(log);

            return {
                success: true,
                messageId: `sms-${Date.now()}`
            };
        } catch (error: any) {
            console.error('Error sending SMS:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send SMS using a template
     */
    async sendTemplateSMS(
        templateId: string,
        to: string,
        variables: Record<string, any>
    ): Promise<{ success: boolean; messageId?: string; error?: string }> {
        try {
            const template = db.getCommunicationTemplate(templateId);
            if (!template) {
                throw new Error('Template not found');
            }

            if (template.channel !== 'SMS') {
                throw new Error('Template is not for SMS');
            }

            // Replace variables in message
            let message = template.body;
            for (const [key, value] of Object.entries(variables)) {
                const placeholder = `{{${key}}}`;
                message = message.replace(new RegExp(placeholder, 'g'), String(value));
            }

            // Send SMS
            const result = await this.sendSMS(to, message);

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
            console.error('Error sending template SMS:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send bulk SMS
     */
    async sendBulkSMS(
        recipients: string[],
        message: string
    ): Promise<{ sent: number; failed: number; errors: string[] }> {
        const results = {
            sent: 0,
            failed: 0,
            errors: [] as string[]
        };

        for (const recipient of recipients) {
            const result = await this.sendSMS(recipient, message);
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

export const smsService = new SMSService();
