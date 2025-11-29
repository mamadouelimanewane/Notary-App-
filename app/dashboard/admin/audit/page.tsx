import { getCurrentUser, requirePermission } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { Shield, Search, FileText } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AuditLogsPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    try {
        await requirePermission('VIEW_AUDIT_LOGS');
    } catch (error) {
        return (
            <div className="p-8 text-center text-red-600">
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-xl font-bold">Accès Refusé</h2>
                <p>Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
            </div>
        );
    }

    const logs = [...db.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Journal d'Audit</h1>
                    <p className="text-muted-foreground">
                        Historique des actions sensibles et de sécurité.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une action..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3">Date & Heure</th>
                            <th className="px-6 py-3">Utilisateur</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Ressource</th>
                            <th className="px-6 py-3">Détails</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    Aucun journal d'audit disponible.
                                </td>
                            </tr>
                        ) : logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleDateString()} <span className="text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {log.userName}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${log.action.includes('DELETE') ? 'bg-red-100 text-red-700' :
                                            log.action.includes('CREATE') ? 'bg-green-100 text-green-700' :
                                                log.action.includes('UPDATE') ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-700'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {log.resourceType} <span className="text-xs text-slate-400">#{log.resourceId?.substring(0, 8)}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={log.details}>
                                    {log.details || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
