"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Shield, Users, Lock, Eye, CheckCircle, XCircle,
    Settings, Plus, Edit, Trash2, Search, Filter
} from "lucide-react";
import { rbacService } from "@/lib/rbac/rbac-service";
import { Role, Permission, Module } from "@/types/rbac";

export default function RBACPage() {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const roles = useMemo(() => rbacService.getAllRoles(), []);

    const modules: { id: Module; name: string; icon: string }[] = [
        { id: 'dashboard', name: 'Tableau de bord', icon: 'LayoutDashboard' },
        { id: 'clients', name: 'Clients', icon: 'Users' },
        { id: 'dossiers', name: 'Dossiers', icon: 'FolderOpen' },
        { id: 'actes', name: 'Actes', icon: 'FileText' },
        { id: 'templates', name: 'Templates', icon: 'FileCode' },
        { id: 'agenda', name: 'Agenda', icon: 'Calendar' },
        { id: 'comptabilite', name: 'Comptabilité', icon: 'Calculator' },
        { id: 'tresorerie', name: 'Trésorerie', icon: 'Wallet' },
        { id: 'facturation', name: 'Facturation', icon: 'FileText' },
        { id: 'rapports', name: 'Rapports', icon: 'BarChart3' },
        { id: 'formalites', name: 'Formalités', icon: 'FileText' },
        { id: 'archives', name: 'Archives', icon: 'Archive' },
        { id: 'recherche-juridique', name: 'Recherche Juridique', icon: 'Scale' },
        { id: 'crm', name: 'CRM', icon: 'Mail' },
        { id: 'immobilier', name: 'Immobilier', icon: 'Map' },
        { id: 'succession', name: 'Succession', icon: 'Network' },
        { id: 'admin', name: 'Administration', icon: 'Shield' },
        { id: 'settings', name: 'Paramètres', icon: 'Settings' }
    ];

    const permissions: { id: Permission; name: string; color: string }[] = [
        { id: 'read', name: 'Lire', color: 'bg-blue-100 text-blue-800' },
        { id: 'create', name: 'Créer', color: 'bg-green-100 text-green-800' },
        { id: 'update', name: 'Modifier', color: 'bg-yellow-100 text-yellow-800' },
        { id: 'delete', name: 'Supprimer', color: 'bg-red-100 text-red-800' },
        { id: 'export', name: 'Exporter', color: 'bg-purple-100 text-purple-800' },
        { id: 'import', name: 'Importer', color: 'bg-indigo-100 text-indigo-800' },
        { id: 'approve', name: 'Approuver', color: 'bg-cyan-100 text-cyan-800' },
        { id: 'sign', name: 'Signer', color: 'bg-pink-100 text-pink-800' }
    ];

    const filteredRoles = useMemo(() => {
        if (!searchQuery) return roles;
        return roles.filter(role =>
            role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            role.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [roles, searchQuery]);

    const getPermissionColor = (permId: Permission) => {
        return permissions.find(p => p.id === permId)?.color || 'bg-gray-100 text-gray-800';
    };

    const getPermissionName = (permId: Permission) => {
        return permissions.find(p => p.id === permId)?.name || permId;
    };

    const getModuleName = (moduleId: Module) => {
        return modules.find(m => m.id === moduleId)?.name || moduleId;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Shield className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Gestion des Rôles & Permissions</h1>
                            <p className="text-blue-100 text-lg mt-2">
                                Contrôle d'accès granulaire (RBAC) pour sécuriser votre application
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Shield className="h-8 w-8 opacity-80" />
                            </div>
                            <p className="text-4xl font-bold">{roles.length}</p>
                            <p className="text-sm opacity-80 mt-1">Rôles configurés</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Lock className="h-8 w-8 opacity-80" />
                            </div>
                            <p className="text-4xl font-bold">{modules.length}</p>
                            <p className="text-sm opacity-80 mt-1">Modules protégés</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Users className="h-8 w-8 opacity-80" />
                            </div>
                            <p className="text-4xl font-bold">{permissions.length}</p>
                            <p className="text-sm opacity-80 mt-1">Types de permissions</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Eye className="h-8 w-8 opacity-80" />
                            </div>
                            <p className="text-4xl font-bold">
                                {roles.filter(r => r.isSystem).length}
                            </p>
                            <p className="text-sm opacity-80 mt-1">Rôles système</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Liste des rôles */}
                    <Card className="lg:col-span-1 border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-blue-600" />
                                Rôles disponibles
                            </CardTitle>
                            <CardDescription>
                                Cliquez sur un rôle pour voir ses permissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Recherche */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un rôle..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Liste */}
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {filteredRoles.map(role => (
                                    <div
                                        key={role.id}
                                        onClick={() => setSelectedRole(role)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedRole?.id === role.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                                                    {role.isSystem && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Système
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600">{role.description}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge className={`text-xs bg-gradient-to-r ${role.color} text-white border-0`}>
                                                        Niveau {role.level}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                        {role.permissions.length} modules
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Détails du rôle sélectionné */}
                    <Card className="lg:col-span-2 border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-purple-600" />
                                    {selectedRole ? `Permissions : ${selectedRole.name}` : 'Sélectionnez un rôle'}
                                </div>
                                {selectedRole && !selectedRole.isSystem && (
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Modifier
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Supprimer
                                        </Button>
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedRole ? (
                                <div className="space-y-4">
                                    {/* Informations du rôle */}
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Niveau hiérarchique :</span>
                                                <span className="ml-2 font-medium">{selectedRole.level}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Type :</span>
                                                <span className="ml-2 font-medium">
                                                    {selectedRole.isSystem ? 'Système' : 'Personnalisé'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Matrice des permissions */}
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="bg-gray-100 p-3 border-b">
                                            <h4 className="font-semibold text-sm">Matrice des permissions</h4>
                                        </div>
                                        <div className="max-h-[500px] overflow-y-auto">
                                            {selectedRole.permissions.map((modulePerm, index) => (
                                                <div key={index} className="border-b last:border-b-0">
                                                    <div className="p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h5 className="font-medium text-gray-900">
                                                                {getModuleName(modulePerm.module)}
                                                            </h5>
                                                            <span className="text-xs text-gray-500">
                                                                {modulePerm.permissions.length} permission(s)
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {modulePerm.permissions.map(perm => (
                                                                <Badge
                                                                    key={perm}
                                                                    className={`${getPermissionColor(perm)} border-0`}
                                                                >
                                                                    {getPermissionName(perm)}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                        {modulePerm.conditions && (
                                                            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                                                                <strong>Conditions :</strong>
                                                                {modulePerm.conditions.ownOnly && ' Données personnelles uniquement'}
                                                                {modulePerm.conditions.teamOnly && ' Équipe uniquement'}
                                                                {modulePerm.conditions.requireApproval && ' Nécessite approbation'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <Shield className="h-16 w-16 text-gray-300 mb-4" />
                                    <p className="text-gray-500">
                                        Sélectionnez un rôle dans la liste pour voir ses permissions
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Légende des permissions */}
                <Card className="border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-green-600" />
                            Légende des permissions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {permissions.map(perm => (
                                <div key={perm.id} className="flex items-center gap-2">
                                    <Badge className={`${perm.color} border-0`}>
                                        {perm.name}
                                    </Badge>
                                    <span className="text-xs text-gray-600">
                                        {perm.id}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
