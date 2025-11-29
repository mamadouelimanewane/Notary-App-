import { getCurrentUser, requirePermission } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { ROLE_LABELS } from "@/lib/rbac";
import { UserPlus, Search, Edit, Trash2, Shield, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UsersPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    try {
        await requirePermission('MANAGE_USERS');
    } catch (error) {
        return (
            <div className="p-8 text-center text-red-600">
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-xl font-bold">Accès Refusé</h2>
                <p>Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
            </div>
        );
    }

    const users = db.users.filter(u => u.isActive); // Only show active users or handle deleted ones visually

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
                    <p className="text-muted-foreground">
                        Gérez les accès et les rôles des collaborateurs de l'étude.
                    </p>
                </div>
                <Link
                    href="/dashboard/admin/users/new"
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors"
                >
                    <UserPlus className="w-4 h-4" />
                    Nouvel Utilisateur
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3">Utilisateur</th>
                            <th className="px-6 py-3">Rôle</th>
                            <th className="px-6 py-3">Dernière Connexion</th>
                            <th className="px-6 py-3">Statut</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                            {user.firstName[0]}{user.lastName[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{user.firstName} {user.lastName}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'NOTAIRE' ? 'bg-blue-100 text-blue-800' :
                                                'bg-slate-100 text-slate-800'
                                        }`}>
                                        {ROLE_LABELS[user.role] || user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() + ' ' + new Date(user.lastLogin).toLocaleTimeString() : 'Jamais'}
                                </td>
                                <td className="px-6 py-4">
                                    {user.isActive ? (
                                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                                            <CheckCircle className="w-3 h-3" /> Actif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                                            <XCircle className="w-3 h-3" /> Inactif
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/dashboard/admin/users/${user.id}/edit`}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        {/* Prevent deleting yourself */}
                                        {user.id !== currentUser.id && (
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
