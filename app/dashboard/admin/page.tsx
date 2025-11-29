import { db } from "@/lib/db";
import Link from "next/link";
import { Users, Settings, Activity, Shield } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    // Vérifier que c'est un admin
    if (!session || session.user?.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const users = db.users;
    const activeUsers = users.filter(u => u.isActive).length;
    const inactiveUsers = users.filter(u => u.isActive === false).length;

    const usersByRole = {
        ADMIN: users.filter(u => u.role === 'ADMIN').length,
        NOTAIRE: users.filter(u => u.role === 'NOTAIRE').length,
        CLERC: users.filter(u => u.role === 'CLERC').length,
        ASSISTANT: users.filter(u => u.role === 'ASSISTANT').length,
        COMPTABLE: users.filter(u => u.role === 'COMPTABLE').length,
        SECRETAIRE: users.filter(u => u.role === 'SECRETAIRE').length,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Shield className="h-8 w-8 text-red-600" />
                    Administration
                </h1>
                <p className="text-muted-foreground mt-1">Gestion des utilisateurs et paramètres de l'application</p>
            </div>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Utilisateurs actifs</p>
                            <p className="text-3xl font-bold mt-2">{activeUsers}</p>
                        </div>
                        <Users className="h-10 w-10 text-green-500" />
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Utilisateurs inactifs</p>
                            <p className="text-3xl font-bold mt-2">{inactiveUsers}</p>
                        </div>
                        <Users className="h-10 w-10 text-gray-400" />
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Par rôle</p>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Admins :</span>
                                <span className="font-semibold">{usersByRole.ADMIN}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Notaires :</span>
                                <span className="font-semibold">{usersByRole.NOTAIRE}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Autres rôles</p>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Clercs :</span>
                                <span className="font-semibold">{usersByRole.CLERC}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Comptables :</span>
                                <span className="font-semibold">{usersByRole.COMPTABLE}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Secrétaires :</span>
                                <span className="font-semibold">{usersByRole.SECRETAIRE}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions rapides */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/dashboard/admin/users" className="group rounded-xl border bg-white p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Gérer les utilisateurs</h3>
                            <p className="text-sm text-muted-foreground mt-1">Créer, modifier, désactiver des comptes</p>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/admin/audit" className="group rounded-xl border bg-white p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                            <Activity className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Journal d'Audit</h3>
                            <p className="text-sm text-muted-foreground mt-1">Traçabilité des actions sensibles</p>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/admin/settings" className="group rounded-xl border bg-white p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                            <Settings className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Paramètres de l'application</h3>
                            <p className="text-sm text-muted-foreground mt-1">Configuration générale, facturation, sécurité</p>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/admin/backups" className="group rounded-xl border bg-white p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-cyan-100 group-hover:bg-cyan-200 transition-colors">
                            <Shield className="h-6 w-6 text-cyan-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Sauvegardes</h3>
                            <p className="text-sm text-muted-foreground mt-1">Gérer les backups et restaurations</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Utilisateurs récents */}
            <div className="rounded-xl border bg-white p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Derniers utilisateurs créés
                </h3>
                <div className="space-y-3">
                    {users.slice(-5).reverse().map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                            <div>
                                <p className="font-medium">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                    user.role === 'NOTAIRE' ? 'bg-blue-100 text-blue-800' :
                                        user.role === 'CLERC' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>{user.role}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>{user.isActive ? 'Actif' : 'Inactif'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
