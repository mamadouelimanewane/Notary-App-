'use client';

import { useState, useEffect } from "react";
import { User } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Trash2, UserX, UserCheck } from "lucide-react";

type UserDisplay = Omit<User, 'password'>;

export default function UsersPageClient() {
    const [users, setUsers] = useState<UserDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [roleFilter, setRoleFilter] = useState<string>('all');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();
            if (data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (id: string, currentStatus: boolean) => {
        if (!confirm(`Voulez-vous vraiment ${currentStatus ? 'désactiver' : 'activer'} cet utilisateur ?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (response.ok) {
                loadUsers();
            } else {
                const data = await response.json();
                alert(data.error || 'Erreur lors de la modification');
            }
        } catch (error) {
            alert('Erreur lors de la modification');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesStatus = filter === 'all' ||
            (filter === 'active' && user.isActive) ||
            (filter === 'inactive' && !user.isActive);
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesStatus && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        const badges = {
            'ADMIN': 'bg-red-100 text-red-800',
            'NOTAIRE': 'bg-blue-100 text-blue-800',
            'CLERC': 'bg-green-100 text-green-800',
            'ASSISTANT': 'bg-gray-100 text-gray-800',
        };
        return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-800';
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">👥 Gestion des utilisateurs</h1>
                    <p className="text-muted-foreground mt-1">Gérer les comptes et les accès</p>
                </div>
                <Link
                    href="/dashboard/admin/users/new"
                    className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white hover:bg-slate-800 h-10 px-4"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvel utilisateur
                </Link>
            </div>

            {/* Filtres */}
            <div className="flex gap-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actifs uniquement</option>
                    <option value="inactive">Inactifs uniquement</option>
                </select>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                    <option value="all">Tous les rôles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="NOTAIRE">Notaire</option>
                    <option value="CLERC">Clerc</option>
                    <option value="ASSISTANT">Assistant</option>
                </select>

                <div className="ml-auto text-sm text-muted-foreground self-center">
                    {filteredUsers.length} utilisateur(s)
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium">Nom</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Rôle</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Statut</th>
                                <th className="h-12 px-4 text  -left align-middle font-medium">Dernière connexion</th>
                                <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">{user.email}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadge(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.isActive ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-sm text-muted-foreground">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/dashboard/admin/users/${user.id}/edit`}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 border hover:bg-slate-100"
                                                title="Modifier"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => toggleUserStatus(user.id, user.isActive)}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 border hover:bg-slate-100"
                                                title={user.isActive ? 'Désactiver' : 'Activer'}
                                            >
                                                {user.isActive ? <UserX className="h-4 w-4 text-red-600" /> : <UserCheck className="h-4 w-4 text-green-600" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
