"use client";

import React, { useState } from 'react';
import { MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
    defaultPhone?: string;
    clientName?: string;
}

const TEMPLATES = [
    { label: "Convocation Signature", text: "Bonjour [Client], votre acte est prêt à être signé. Merci de confirmer votre disponibilité pour un RDV cette semaine. Cordialement, Maître Dupont." },
    { label: "Demande de Pièces", text: "Bonjour [Client], il nous manque encore votre CNI et justificatif de domicile pour avancer sur votre dossier. Merci de nous les envoyer rapidement." },
    { label: "Dossier Clôturé", text: "Bonjour [Client], votre dossier est désormais clôturé. Votre titre de propriété est disponible à l'étude." },
];

export function WhatsAppSender({ defaultPhone = '', clientName = '' }: Props) {
    const [phone, setPhone] = useState(defaultPhone);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

    const handleSend = async () => {
        if (!phone || !message) return;

        setLoading(true);
        setStatus('IDLE');

        try {
            const res = await fetch('/api/whatsapp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: phone, body: message }),
            });

            const data = await res.json();

            if (data.success) {
                setStatus('SUCCESS');
                setMessage('');
                setTimeout(() => setStatus('IDLE'), 3000);
            } else {
                setStatus('ERROR');
            }
        } catch (error) {
            console.error(error);
            setStatus('ERROR');
        } finally {
            setLoading(false);
        }
    };

    const applyTemplate = (text: string) => {
        const personalized = text.replace('[Client]', clientName || 'Monsieur/Madame');
        setMessage(personalized);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#25D366] px-4 py-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <h3 className="font-bold">WhatsApp Business</h3>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">API Connectée</span>
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Numéro du destinataire</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+221 77 000 00 00"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#25D366] outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#25D366] outline-none resize-none"
                        placeholder="Écrivez votre message..."
                    />
                </div>

                {/* Templates */}
                <div className="flex flex-wrap gap-2">
                    {TEMPLATES.map((t, idx) => (
                        <button
                            key={idx}
                            onClick={() => applyTemplate(t.text)}
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors"
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSend}
                    disabled={loading || !phone || !message}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : status === 'SUCCESS' ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Envoyé !
                        </>
                    ) : status === 'ERROR' ? (
                        <>
                            <AlertCircle className="w-4 h-4" />
                            Erreur
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Envoyer le message
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
