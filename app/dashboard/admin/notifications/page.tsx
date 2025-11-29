"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Mail, MessageSquare, Phone, Bell, Send, Settings,
    CheckCircle, XCircle, Clock, Zap, Users, FileText
} from "lucide-react";
import { notificationService } from "@/lib/notifications/multi-channel-service";

export default function NotificationsPage() {
    const [selectedChannels, setSelectedChannels] = useState<string[]>(['email']);
    const [testRecipient, setTestRecipient] = useState('');
    const [testMessage, setTestMessage] = useState('');
    const [testSubject, setTestSubject] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendResult, setSendResult] = useState<any>(null);

    const [config, setConfig] = useState({
        email: { enabled: true },
        sms: { enabled: false },
        whatsapp: { enabled: false },
        push: { enabled: false }
    });

    const channels = [
        {
            id: 'email',
            name: 'Email',
            icon: Mail,
            color: 'from-blue-500 to-cyan-500',
            description: 'Notifications par email SMTP'
        },
        {
            id: 'sms',
            name: 'SMS',
            icon: Phone,
            color: 'from-green-500 to-emerald-500',
            description: 'Messages texte via Twilio/Vonage'
        },
        {
            id: 'whatsapp',
            name: 'WhatsApp',
            icon: MessageSquare,
            color: 'from-purple-500 to-pink-500',
            description: 'Messages WhatsApp Business'
        },
        {
            id: 'push',
            name: 'Push',
            icon: Bell,
            color: 'from-orange-500 to-red-500',
            description: 'Notifications push web/mobile'
        }
    ];

    const templates = [
        {
            id: 'appointment',
            name: 'Rappel de rendez-vous',
            icon: Clock,
            type: 'appointment_reminder',
            channels: ['email', 'sms'],
            subject: 'Rappel de rendez-vous',
            message: 'Bonjour {clientName},\n\nCeci est un rappel pour votre rendez-vous le {date} à {time}.\n\nÀ bientôt !'
        },
        {
            id: 'payment',
            name: 'Rappel de paiement',
            icon: FileText,
            type: 'payment_reminder',
            channels: ['email', 'sms', 'whatsapp'],
            subject: 'Rappel de paiement',
            message: 'Bonjour {clientName},\n\nNous vous rappelons qu\'un paiement de {amount} FCFA est attendu avant le {dueDate}.'
        },
        {
            id: 'document',
            name: 'Document prêt',
            icon: CheckCircle,
            type: 'document_ready',
            channels: ['email', 'push'],
            subject: 'Document disponible',
            message: 'Bonjour {clientName},\n\nVotre document "{documentName}" est maintenant disponible dans votre espace client.'
        }
    ];

    const toggleChannel = (channelId: string) => {
        setSelectedChannels(prev =>
            prev.includes(channelId)
                ? prev.filter(c => c !== channelId)
                : [...prev, channelId]
        );
    };

    const handleSendTest = async () => {
        if (!testRecipient || !testMessage) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        setIsSending(true);
        setSendResult(null);

        try {
            const notification = {
                id: `test_${Date.now()}`,
                recipientId: testRecipient,
                recipientType: 'client' as const,
                channels: selectedChannels as any[],
                priority: 'medium' as const,
                type: 'test',
                subject: testSubject || 'Test de notification',
                message: testMessage,
                status: 'pending' as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const logs = await notificationService.send(notification);

            setSendResult({
                success: true,
                logs,
                message: `Notification envoyée sur ${logs.length} canal(aux)`
            });
        } catch (error) {
            setSendResult({
                success: false,
                message: error instanceof Error ? error.message : 'Erreur inconnue'
            });
        } finally {
            setIsSending(false);
        }
    };

    const useTemplate = (template: typeof templates[0]) => {
        setTestSubject(template.subject);
        setTestMessage(template.message);
        setSelectedChannels(template.channels);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Zap className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Notifications Multi-Canal</h1>
                            <p className="text-blue-100 text-lg mt-2">
                                Gérez et testez vos notifications Email, SMS, WhatsApp et Push
                            </p>
                        </div>
                    </div>
                </div>

                {/* Canaux disponibles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {channels.map(channel => {
                        const Icon = channel.icon;
                        const isEnabled = config[channel.id as keyof typeof config]?.enabled;

                        return (
                            <Card
                                key={channel.id}
                                className={`border-0 shadow-lg overflow-hidden ${isEnabled ? `bg-gradient-to-br ${channel.color} text-white` : 'bg-white'
                                    }`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${isEnabled ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-100'
                                            }`}>
                                            <Icon className={`h-6 w-6 ${isEnabled ? 'text-white' : 'text-gray-600'}`} />
                                        </div>
                                        <Switch
                                            checked={isEnabled}
                                            onCheckedChange={(checked) => {
                                                setConfig(prev => ({
                                                    ...prev,
                                                    [channel.id]: { enabled: checked }
                                                }));
                                            }}
                                        />
                                    </div>
                                    <h3 className={`text-xl font-bold mb-1 ${isEnabled ? 'text-white' : 'text-gray-900'}`}>
                                        {channel.name}
                                    </h3>
                                    <p className={`text-sm ${isEnabled ? 'text-white/80' : 'text-gray-600'}`}>
                                        {channel.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Test de notification */}
                    <Card className="border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Send className="h-5 w-5 text-blue-600" />
                                Tester une notification
                            </CardTitle>
                            <CardDescription>
                                Envoyez une notification de test sur les canaux sélectionnés
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Sélection des canaux */}
                            <div className="space-y-2">
                                <Label>Canaux de diffusion</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {channels.map(channel => {
                                        const Icon = channel.icon;
                                        const isSelected = selectedChannels.includes(channel.id);
                                        const isEnabled = config[channel.id as keyof typeof config]?.enabled;

                                        return (
                                            <button
                                                key={channel.id}
                                                onClick={() => isEnabled && toggleChannel(channel.id)}
                                                disabled={!isEnabled}
                                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${isSelected
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    } ${!isEnabled && 'opacity-50 cursor-not-allowed'}`}
                                            >
                                                <Icon className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                                                <span className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                                                    {channel.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Destinataire */}
                            <div className="space-y-2">
                                <Label htmlFor="recipient">Destinataire (ID ou Email)</Label>
                                <Input
                                    id="recipient"
                                    placeholder="client@example.com"
                                    value={testRecipient}
                                    onChange={(e) => setTestRecipient(e.target.value)}
                                />
                            </div>

                            {/* Sujet */}
                            <div className="space-y-2">
                                <Label htmlFor="subject">Sujet (Email uniquement)</Label>
                                <Input
                                    id="subject"
                                    placeholder="Sujet de la notification"
                                    value={testSubject}
                                    onChange={(e) => setTestSubject(e.target.value)}
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Votre message..."
                                    rows={5}
                                    value={testMessage}
                                    onChange={(e) => setTestMessage(e.target.value)}
                                />
                            </div>

                            {/* Bouton d'envoi */}
                            <Button
                                onClick={handleSendTest}
                                disabled={isSending || selectedChannels.length === 0}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                {isSending ? (
                                    <>
                                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Envoyer la notification
                                    </>
                                )}
                            </Button>

                            {/* Résultat */}
                            {sendResult && (
                                <div className={`p-4 rounded-lg border ${sendResult.success
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        {sendResult.success ? (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-600" />
                                        )}
                                        <p className={`font-medium ${sendResult.success ? 'text-green-900' : 'text-red-900'
                                            }`}>
                                            {sendResult.message}
                                        </p>
                                    </div>
                                    {sendResult.logs && (
                                        <div className="mt-2 space-y-1">
                                            {sendResult.logs.map((log: any, index: number) => (
                                                <div key={index} className="text-xs text-gray-600">
                                                    • {log.channel}: {log.status}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Templates */}
                    <Card className="border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-purple-600" />
                                Templates de notification
                            </CardTitle>
                            <CardDescription>
                                Utilisez un template prédéfini pour vos tests
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {templates.map(template => {
                                const Icon = template.icon;
                                return (
                                    <div
                                        key={template.id}
                                        className="p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                                        onClick={() => useTemplate(template)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <Icon className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{template.name}</h4>
                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                    {template.message}
                                                </p>
                                                <div className="flex gap-1 mt-2">
                                                    {template.channels.map(ch => {
                                                        const channel = channels.find(c => c.id === ch);
                                                        if (!channel) return null;
                                                        const ChannelIcon = channel.icon;
                                                        return (
                                                            <div key={ch} className="p-1 bg-gray-100 rounded">
                                                                <ChannelIcon className="h-3 w-3 text-gray-600" />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Statistiques */}
                <Card className="border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-600" />
                            Statistiques d'envoi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600 font-medium">Emails envoyés</p>
                                <p className="text-3xl font-bold text-blue-900 mt-1">0</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-600 font-medium">SMS envoyés</p>
                                <p className="text-3xl font-bold text-green-900 mt-1">0</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <p className="text-sm text-purple-600 font-medium">WhatsApp envoyés</p>
                                <p className="text-3xl font-bold text-purple-900 mt-1">0</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <p className="text-sm text-orange-600 font-medium">Push envoyés</p>
                                <p className="text-3xl font-bold text-orange-900 mt-1">0</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
