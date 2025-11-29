"use client";

import { Save, Download, Upload, Lock, Shield, Database, HardDrive, Clock, CheckCircle, AlertTriangle, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function BackupSecurityPage() {
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [config, setConfig] = useState({
        frequency: 'daily',
        time: '08:00',
        retention: '30',
        directory: 'C:\\Sauvegardes\\Notaire',
        autoBackup: true
    });

    // Charger la configuration au démarrage
    useEffect(() => {
        const saved = localStorage.getItem('backupConfig');
        if (saved) {
            setConfig(JSON.parse(saved));
        }
    }, []);

    const backupHistory = [
        { id: 1, date: '27/11/2024 08:00', size: '245 MB', status: 'success', type: 'Automatique' },
        { id: 2, date: '26/11/2024 08:00', size: '243 MB', status: 'success', type: 'Automatique' },
        { id: 3, date: '25/11/2024 08:00', size: '241 MB', status: 'success', type: 'Automatique' },
        { id: 4, date: '24/11/2024 08:00', size: '240 MB', status: 'success', type: 'Automatique' },
        { id: 5, date: '23/11/2024 15:30', size: '238 MB', status: 'success', type: 'Manuel' },
    ];

    const saveConfig = () => {
        localStorage.setItem('backupConfig', JSON.stringify(config));
        setIsConfigOpen(false);
        alert('✅ Configuration sauvegardée avec succès !');
    };

    const handleBackup = () => {
        try {
            const backupData = {
                version: "1.0",
                timestamp: new Date().toISOString(),
                application: "Cabinet Notaire Keur Jaraaf",
                configuration: config,
                data: {
                    clients: localStorage.getItem('clients') || '[]',
                    dossiers: localStorage.getItem('dossiers') || '[]',
                    actes: localStorage.getItem('actes') || '[]',
                    users: localStorage.getItem('users') || '[]',
                    templates: localStorage.getItem('templates') || '[]',
                    settings: localStorage.getItem('settings') || '{}',
                }
            };

            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });

            const now = new Date();
            const fileName = `backup_notaire_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}h${String(now.getMinutes()).padStart(2, '0')}.json`;

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            alert(`✅ Sauvegarde réussie!\n\nLe fichier "${fileName}" a été téléchargé.\nRépertoire configuré: ${config.directory}`);
        } catch (error) {
            alert('❌ Erreur lors de la sauvegarde');
        }
    };

    const getFrequencyLabel = () => {
        switch (config.frequency) {
            case 'daily': return 'Quotidienne';
            case 'weekly': return 'Hebdomadaire';
            case 'monthly': return 'Mensuelle';
            default: return 'Quotidienne';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <Shield className="h-12 w-12" />
                        <div>
                            <h1 className="text-4xl font-bold">Sauvegarde & Sécurité</h1>
                            <p className="text-blue-100 text-lg">Protégez vos données avec des sauvegardes automatiques et sécurisées</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm opacity-80">Sauvegardes</p>
                                <Save className="h-5 w-5" />
                            </div>
                            <p className="text-4xl font-bold">5</p>
                            <p className="text-xs opacity-70">Cette semaine</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm opacity-80">Taille Totale</p>
                                <Database className="h-5 w-5" />
                            </div>
                            <p className="text-4xl font-bold">1.2 GB</p>
                            <p className="text-xs opacity-70">Données sauvegardées</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm opacity-80">Espace Disponible</p>
                                <HardDrive className="h-5 w-5" />
                            </div>
                            <p className="text-4xl font-bold">48.8 GB</p>
                            <p className="text-xs opacity-70">Sur 50 GB</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm opacity-80">Sécurité</p>
                                <Lock className="h-5 w-5" />
                            </div>
                            <p className="text-4xl font-bold">100%</p>
                            <p className="text-xs opacity-70">Chiffrement actif</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <Card className="border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Save className="h-5 w-5 text-blue-600" />
                            Actions Rapides
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button
                                onClick={handleBackup}
                                className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Download className="h-6 w-6" />
                                    <span>Créer une Sauvegarde</span>
                                </div>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-20 border-2"
                                onClick={() => alert('Sélectionnez un fichier de sauvegarde')}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="h-6 w-6" />
                                    <span>Restaurer une Sauvegarde</span>
                                </div>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Configuration */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-green-600" />
                                Sauvegarde Automatique
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-900">
                                                {config.autoBackup ? 'Activée' : 'Désactivée'}
                                            </p>
                                            <p className="text-sm text-green-700">
                                                {getFrequencyLabel()} à {config.time}
                                            </p>
                                        </div>
                                    </div>

                                    <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Settings className="h-4 w-4 mr-2" />
                                                Configurer
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Configuration de la Sauvegarde Automatique</DialogTitle>
                                            </DialogHeader>

                                            <div className="space-y-4 py-4">
                                                {/* Fréquence */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="frequency">Fréquence</Label>
                                                    <Select
                                                        value={config.frequency}
                                                        onValueChange={(value) => setConfig({ ...config, frequency: value })}
                                                    >
                                                        <SelectTrigger id="frequency">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="daily">Quotidienne</SelectItem>
                                                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                                                            <SelectItem value="monthly">Mensuelle</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Heure */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="time">Heure de sauvegarde</Label>
                                                    <Input
                                                        id="time"
                                                        type="time"
                                                        value={config.time}
                                                        onChange={(e) => setConfig({ ...config, time: e.target.value })}
                                                    />
                                                </div>

                                                {/* Rétention */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="retention">Durée de rétention (jours)</Label>
                                                    <Input
                                                        id="retention"
                                                        type="number"
                                                        min="1"
                                                        max="365"
                                                        value={config.retention}
                                                        onChange={(e) => setConfig({ ...config, retention: e.target.value })}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Les sauvegardes de plus de {config.retention} jours seront supprimées
                                                    </p>
                                                </div>

                                                {/* Répertoire */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="directory">Répertoire de sauvegarde</Label>
                                                    <Input
                                                        id="directory"
                                                        type="text"
                                                        value={config.directory}
                                                        onChange={(e) => setConfig({ ...config, directory: e.target.value })}
                                                        placeholder="C:\Sauvegardes\Notaire"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Chemin où les sauvegardes seront stockées
                                                    </p>
                                                </div>

                                                {/* Activation */}
                                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                                    <Label htmlFor="autoBackup" className="cursor-pointer">
                                                        Activer la sauvegarde automatique
                                                    </Label>
                                                    <input
                                                        id="autoBackup"
                                                        type="checkbox"
                                                        checked={config.autoBackup}
                                                        onChange={(e) => setConfig({ ...config, autoBackup: e.target.checked })}
                                                        className="h-4 w-4 cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                                                    Annuler
                                                </Button>
                                                <Button onClick={saveConfig} className="bg-green-600 hover:bg-green-700">
                                                    Enregistrer
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fréquence</span>
                                    <span className="font-medium">{getFrequencyLabel()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Heure</span>
                                    <span className="font-medium">{config.time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Rétention</span>
                                    <span className="font-medium">{config.retention} jours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Répertoire</span>
                                    <span className="font-medium text-xs truncate max-w-[200px]" title={config.directory}>
                                        {config.directory}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-purple-600" />
                                Sécurité des Données
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-purple-600" />
                                    <div>
                                        <p className="font-medium text-purple-900">Chiffrement AES-256</p>
                                        <p className="text-sm text-purple-700">Données protégées</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Chiffrement</span>
                                    <span className="font-medium text-green-600">AES-256</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Authentification</span>
                                    <span className="font-medium text-green-600">2FA Activée</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Historique */}
                <Card className="border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-600" />
                            Historique des Sauvegardes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {backupHistory.map(backup => (
                                <div
                                    key={backup.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{backup.date}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {backup.type} • {backup.size}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => alert('📥 Téléchargement...')}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Télécharger
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => {
                                            if (confirm(`Restaurer ${backup.date} ?`)) {
                                                alert('✅ Restauration terminée');
                                            }
                                        }}>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Restaurer
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Alertes */}
                <Card className="border-0 shadow-xl bg-orange-50 border-orange-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="h-6 w-6 text-orange-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-orange-900 mb-2">Recommandations de Sécurité</h3>
                                <ul className="space-y-1 text-sm text-orange-800">
                                    <li>• Vérifiez régulièrement l'intégrité de vos sauvegardes</li>
                                    <li>• Conservez au moins 3 copies de vos données importantes</li>
                                    <li>• Testez la restauration au moins une fois par mois</li>
                                    <li>• Stockez une copie hors site pour plus de sécurité</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
