"use client";

import { WhatsAppSender } from '@/components/crm/WhatsAppSender';
import { Mail, MessageSquare } from 'lucide-react';

export default function CRMPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Mail className="w-6 h-6 text-blue-600" />
                    Relation Client (CRM)
                </h1>
                <p className="text-muted-foreground">
                    Gérez vos communications multicanales (Email, WhatsApp, SMS).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Module WhatsApp */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#25D366]" />
                        Envoi Rapide WhatsApp
                    </h2>
                    <WhatsAppSender defaultPhone="+221" />

                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                        <p className="font-bold mb-1">💡 Astuce Pro</p>
                        <p>
                            Utilisez WhatsApp pour les rappels de RDV et les demandes de pièces simples.
                            Le taux d'ouverture est de 98% contre 20% pour les emails.
                        </p>
                    </div>
                </div>

                {/* Historique (Mock) */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Derniers échanges</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3 pb-4 border-b border-slate-50 last:border-0">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                    MD
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">M. Diop <span className="text-xs font-normal text-slate-400">• Il y a 2h</span></p>
                                    <p className="text-xs text-slate-600 mt-1">
                                        "Bien reçu maître, je passe demain pour la signature."
                                    </p>
                                    <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                                        <MessageSquare className="w-3 h-3" /> WhatsApp
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
