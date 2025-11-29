"use client";

import { useState, useEffect } from "react";
import {
    Shield,
    Download,
    RotateCcw,
    Trash2,
    Plus,
    FileJson,
    Loader2,
    AlertTriangle,
    CheckCircle,
    HardDrive
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Backup {
    name: string;
    size: number;
    createdAt: string;
}

export default function BackupsPage() {
    const [backups, setBackups] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchBackups();
    }, []);

    const fetchBackups = async () => {
        try {
            const res = await fetch('/api/admin/backups');
            if (!res.ok) throw new Error('Failed to fetch backups');
            const data = await res.json();
            setBackups(data);
        } catch (err) {
            setError("Impossible de charger les sauvegardes");
        } finally {
            setLoading(false);
        }
    };

    const createBackup = async () => {
        setActionLoading('create');
        setError("");
        setSuccess("");
        try {
            const res = await fetch('/api/admin/backups', { method: 'POST' });
            if (!res.ok) throw new Error('Failed to create backup');
            await fetchBackups();
            setSuccess("Sauvegarde créée avec succès");
        } catch (err) {
            setError("Erreur lors de la création de la sauvegarde");
        } finally {
            setActionLoading(null);
        }
    };

    const restoreBackup = async (filename: string) => {
        if (!confirm("ATTENTION : Cette action va remplacer toutes les données actuelles par celles de la sauvegarde. Êtes-vous sûr ?")) {
            return;
        }

        setActionLoading(filename);
        setError("");
        setSuccess("");
        try {
            const res = await fetch(`/api/admin/backups/${filename}/restore`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to restore backup');
            setSuccess("Restauration effectuée avec succès. Veuillez recharger la page.");
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            setError("Erreur lors de la restauration");
        } finally {
            setActionLoading(null);
        }
    };

    const deleteBackup = async (filename: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette sauvegarde ?")) {
            return;
        }

        setActionLoading(filename);
        try {
            const res = await fetch(`/api/admin/backups/${filename}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete backup');
            await fetchBackups();
            setSuccess("Sauvegarde supprimée");
        } catch (err) {
            setError("Erreur lors de la suppression");
        } finally {
            setActionLoading(null);
        }
    };

    const downloadBackup = (filename: string) => {
        window.open(`/api/admin/backups/${filename}`, '_blank');
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <HardDrive className="h-6 w-6 text-blue-600" />
                        Sauvegardes & Restauration
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez les instantanés de la base de données pour sécuriser vos données.
                    </p>
                </div>
                <button
                    onClick={createBackup}
                    disabled={!!actionLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {actionLoading === 'create' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                    Nouvelle Sauvegarde
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {success}
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-semibold text-slate-700">Historique des sauvegardes</h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        Chargement...
                    </div>
                ) : backups.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        Aucune sauvegarde disponible. Créez-en une maintenant.
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Nom du fichier</th>
                                <th className="px-6 py-3">Date de création</th>
                                <th className="px-6 py-3">Taille</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {backups.map((backup) => (
                                <tr key={backup.name} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                        <FileJson className="w-4 h-4 text-slate-400" />
                                        {backup.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {format(new Date(backup.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono">
                                        {formatSize(backup.size)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => downloadBackup(backup.name)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Télécharger"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => restoreBackup(backup.name)}
                                                disabled={!!actionLoading}
                                                className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                title="Restaurer"
                                            >
                                                {actionLoading === backup.name ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <RotateCcw className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => deleteBackup(backup.name)}
                                                disabled={!!actionLoading}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
