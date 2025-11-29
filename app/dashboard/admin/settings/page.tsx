'use client';

import { useState, useEffect } from "react";
import { Building, Mail, Phone, FileText, Shield } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'billing' | 'security'>('general');
    const [settings, setSettings] = useState({
        officeName: '',
        address: '',
        phone: '',
        email: '',
        tvaNumber: '',
        legalMentions: '',
        documentHeader: '',
        securitySettings: {
            sessionTimeout: 3600,
            maxLoginAttempts: 5
        }
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings');
            const data = await response.json();
            if (data.settings) {
                setSettings(data.settings);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                alert('Paramètres enregistrés avec succès !');
            } else {
                const data = await response.json();
                alert(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            alert('Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                <p className="mt-4 text-muted-foreground">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">⚙️ Paramètres de l'application</h1>
                <p className="text-muted-foreground mt-1">Configuration générale de l'étude notariale</p>
            </div>

            {/* Onglets */}
            <div className="border-b">
                <nav className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`py-2 px-4 border-b-2 transition-colors ${activeTab === 'general'
                            ? 'border-slate-900 text-slate-900 font-medium'
                            : 'border-transparent text-muted-foreground hover:text-slate-900'
                            }`}
                    >
                        <Building className="inline h-4 w-4 mr-2" />
                        Général
                    </button>
                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`py-2 px-4 border-b-2 transition-colors ${activeTab === 'billing'
                            ? 'border-slate-900 text-slate-900 font-medium'
                            : 'border-transparent text-muted-foreground hover:text-slate-900'
                            }`}
                    >
                        <FileText className="inline h-4 w-4 mr-2" />
                        Facturation
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`py-2 px-4 border-b-2 transition-colors ${activeTab === 'security'
                            ? 'border-slate-900 text-slate-900 font-medium'
                            : 'border-transparent text-muted-foreground hover:text-slate-900'
                            }`}
                    >
                        <Shield className="inline h-4 w-4 mr-2" />
                        Sécurité
                    </button>
                </nav>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="rounded-xl border bg-white p-6 space-y-6">
                    {/* Onglet Général */}
                    {activeTab === 'general' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom de l'étude</label>
                                <input
                                    type="text"
                                    value={settings.officeName}
                                    onChange={(e) => setSettings({ ...settings, officeName: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Étude Notariale Dupont"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Adresse</label>
                                <input
                                    type="text"
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Avenue Léopold Sédar Senghor, Dakar"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Téléphone</label>
                                    <input
                                        type="tel"
                                        value={settings.phone}
                                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="+221 33 xxx xx xx"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">En-tête des documents</label>
                                <textarea
                                    value={settings.documentHeader || ''}
                                    onChange={(e) => setSettings({ ...settings, documentHeader: e.target.value })}
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Texte à afficher en haut des actes et factures (ex: Maître Dupont, Notaire à Dakar...)"
                                />
                                <p className="text-xs text-muted-foreground">Ce texte apparaîtra en haut de vos documents générés (PDF).</p>
                            </div>
                        </div>
                    )}

                    {/* Onglet Facturation */}
                    {activeTab === 'billing' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Numéro de TVA</label>
                                <input
                                    type="text"
                                    value={settings.tvaNumber}
                                    onChange={(e) => setSettings({ ...settings, tvaNumber: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="NIEA xxxxx"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mentions légales</label>
                                <textarea
                                    value={settings.legalMentions}
                                    onChange={(e) => setSettings({ ...settings, legalMentions: e.target.value })}
                                    rows={6}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Mentions légales à afficher sur les documents officiels..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Onglet Sécurité */}
                    {activeTab === 'security' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Durée de session (secondes)</label>
                                <input
                                    type="number"
                                    value={settings.securitySettings.sessionTimeout}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        securitySettings: {
                                            ...settings.securitySettings,
                                            sessionTimeout: parseInt(e.target.value)
                                        }
                                    })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {Math.floor(settings.securitySettings.sessionTimeout / 60)} minutes
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre max de tentatives de connexion</label>
                                <input
                                    type="number"
                                    value={settings.securitySettings.maxLoginAttempts}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        securitySettings: {
                                            ...settings.securitySettings,
                                            maxLoginAttempts: parseInt(e.target.value)
                                        }
                                    })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white hover:bg-slate-800 h-10 px-6 disabled:opacity-50"
                        >
                            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
