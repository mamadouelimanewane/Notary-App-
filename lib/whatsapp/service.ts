import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Numéro Sandbox Twilio par défaut

export interface WhatsAppMessage {
    to: string;
    body: string;
}

export class WhatsAppService {
    private static client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

    static async send({ to, body }: WhatsAppMessage): Promise<{ success: boolean; id?: string; error?: string }> {
        console.log(`[WhatsApp] Tentative d'envoi à ${to}: "${body}"`);

        // Mode Simulation (si pas de clés)
        if (!this.client) {
            console.warn("[WhatsApp] Clés Twilio manquantes. Mode SIMULATION.");
            await new Promise(resolve => setTimeout(resolve, 1000)); // Latence réseau
            return { success: true, id: `sim_${Date.now()}` };
        }

        try {
            // Formatage du numéro (doit être au format E.164 avec préfixe whatsapp:)
            // Ex: whatsapp:+221770000000
            const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

            const message = await this.client.messages.create({
                from: fromNumber,
                to: formattedTo,
                body: body
            });

            return { success: true, id: message.sid };
        } catch (error: any) {
            console.error("[WhatsApp] Erreur d'envoi:", error);
            return { success: false, error: error.message };
        }
    }
}
