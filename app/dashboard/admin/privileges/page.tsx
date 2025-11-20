'use client';

import { defaultPermissions, permissionLabels, Permission } from "@/lib/permissions";
import { Shield, Check, X } from "lucide-react";

export default function PrivilegesPage() {
    const getRoleBadge = (role: string) => {
        const badges = {
            'ADMIN': 'bg-red-100 text-red-800',
            'NOTAIRE': 'bg-blue-100 text-blue-800',
            'CLERC': 'bg-green-100 text-green-800',
            'ASSISTANT': 'bg-gray-100 text-gray-800',
        };
        return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const allPermissions = Object.keys(permissionLabels) as Permission[];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Shield className="h-8 w-8 text-blue-600" />
                    Gestion des privilèges
                </h1>
                <p className="text-muted-foreground mt-1">Matrice des permissions par rôle</p>
            </div>

            {/* Matrice des permissions */}
            <div className="rounded-xl border bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 sticky left-0 bg-slate-50 z-10">
                                    Permission
                                </th>
                                {defaultPermissions.map(roleData => (
                                    <th key={roleData.role} className="px-6 py-4 text-center text-sm font-semibold">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getRoleBadge(roleData.role)}`}>
                                                {roleData.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-normal">
                                                {roleData.description}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {allPermissions.map((permission, index) => (
                                <tr key={permission} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 sticky left-0 bg-inherit">
                                        {permissionLabels[permission]}
                                    </td>
                                    {defaultPermissions.map(roleData => {
                                        const hasAccess = roleData.permissions.includes(permission);
                                        return (
                                            <td key={`${roleData.role}-${permission}`} className="px-6 py-4 text-center">
                                                {hasAccess ? (
                                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                                                        <Check className="h-5 w-5 text-green-600" />
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                                                        <X className="h-5 w-5 text-red-600" />
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Légende */}
            <div className="rounded-xl border bg-blue-50 p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Informations
                </h3>
                <div className="space-y-2 text-sm text-slate-700">
                    <p>• <strong>ADMIN</strong> : Accès complet au système, incluant la gestion des utilisateurs et paramètres</p>
                    <p>• <strong>NOTAIRE</strong> : Peut gérer clients, dossiers, signer actes et gérer la comptabilité</p>
                    <p>• <strong>CLERC</strong> : Préparation des dossiers, comptabilité et rapprochement bancaire</p>
                    <p>• <strong>ASSISTANT</strong> : Consultation uniquement (dashboard, archives, recherche juridique, agenda)</p>
                </div>
            </div>

            {/* Résumé par rôle */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {defaultPermissions.map(roleData => (
                    <div key={roleData.role} className="rounded-xl border bg-white p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadge(roleData.role)}`}>
                                {roleData.label}
                            </span>
                            <span className="text-xl font-bold text-slate-900">
                                {roleData.permissions.length}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {roleData.permissions.length} permission{roleData.permissions.length > 1 ? 's' : ''} accordée{roleData.permissions.length > 1 ? 's' : ''}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
