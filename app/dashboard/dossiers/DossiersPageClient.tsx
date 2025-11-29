"use client";

import { useState, useMemo } from "react";
// import Link from "next/link"; // Removed to fix POST issue
import { Plus, Folder, FileText, Calendar, User, Building2, Home, Briefcase, Users, Globe, FileCheck, ArrowRight, Activity, Archive, CheckCircle } from "lucide-react";
import { Dossier, Client, User as UserType } from "@/types/db";
import { HeroSection, StatsCard, ModernSearchBar, FilterPills, ModernPageLayout, FilterOption } from "@/components/modern";
import { Card, CardContent } from "@/components/ui/card";

interface DossiersPageClientProps {
    initialDossiers: Dossier[];
    clients: Client[];
    users: UserType[];
}

// Fonction pour obtenir l'icône et la couleur selon le type d'acte
const getActeTypeStyle = (type: string) => {
    const typeUpper = type?.toUpperCase() || "";

    if (typeUpper.includes("VENTE") || typeUpper.includes("ACHAT")) {
        return { icon: Home, gradient: "from-blue-500 to-cyan-500", bgColor: "bg-gradient-to-br from-blue-50 to-cyan-100", textColor: "text-blue-700", borderColor: "border-blue-200 hover:border-blue-300" };
    }
    if (typeUpper.includes("SUCCESSION") || typeUpper.includes("HERITAGE")) {
        return { icon: Users, gradient: "from-purple-500 to-violet-500", bgColor: "bg-gradient-to-br from-purple-50 to-violet-100", textColor: "text-purple-700", borderColor: "border-purple-200 hover:border-purple-300" };
    }
    if (typeUpper.includes("DONATION") || typeUpper.includes("TESTAMENT")) {
        return { icon: FileCheck, gradient: "from-amber-500 to-orange-500", bgColor: "bg-gradient-to-br from-amber-50 to-orange-100", textColor: "text-amber-700", borderColor: "border-amber-200 hover:border-amber-300" };
    }
    if (typeUpper.includes("SOCIETE") || typeUpper.includes("COMMERCIAL")) {
        return { icon: Briefcase, gradient: "from-green-500 to-emerald-500", bgColor: "bg-gradient-to-br from-green-50 to-emerald-100", textColor: "text-emerald-700", borderColor: "border-emerald-200 hover:border-emerald-300" };
    }
    if (typeUpper.includes("INTERNATIONAL") || typeUpper.includes("APOSTILLE")) {
        return { icon: Globe, gradient: "from-indigo-500 to-blue-500", bgColor: "bg-gradient-to-br from-indigo-50 to-blue-100", textColor: "text-indigo-700", borderColor: "border-indigo-200 hover:border-indigo-300" };
    }
    if (typeUpper.includes("IMMOBILIER") || typeUpper.includes("TERRAIN")) {
        return { icon: Building2, gradient: "from-cyan-500 to-teal-500", bgColor: "bg-gradient-to-br from-cyan-50 to-teal-100", textColor: "text-cyan-700", borderColor: "border-cyan-200 hover:border-cyan-300" };
    }

    return { icon: Folder, gradient: "from-gray-500 to-slate-500", bgColor: "bg-gradient-to-br from-gray-50 to-slate-100", textColor: "text-gray-700", borderColor: "border-gray-200 hover:border-gray-300" };
};

// Fonction pour obtenir le style du statut
const getStatusStyle = (status: string) => {
    switch (status) {
        case "EN_COURS":
            return { bg: "bg-blue-500", text: "text-blue-700", badgeBg: "bg-blue-100", label: "En cours", dotColor: "bg-blue-500" };
        case "OUVERT":
            return { bg: "bg-green-500", text: "text-green-700", badgeBg: "bg-green-100", label: "Ouvert", dotColor: "bg-green-500" };
        case "CLOTURE":
            return { bg: "bg-gray-500", text: "text-gray-700", badgeBg: "bg-gray-100", label: "Clôturé", dotColor: "bg-gray-500" };
        case "ARCHIVE":
            return { bg: "bg-amber-500", text: "text-amber-700", badgeBg: "bg-amber-100", label: "Archivé", dotColor: "bg-amber-500" };
        default:
            return { bg: "bg-gray-500", text: "text-gray-700", badgeBg: "bg-gray-100", label: status, dotColor: "bg-gray-500" };
    }
};

export default function DossiersPageClient({ initialDossiers, clients, users }: DossiersPageClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<string>("ALL");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
    const [selectedUser, setSelectedUser] = useState<string>("ALL");

    // Statistiques
    const stats = useMemo(() => {
        const enCours = initialDossiers.filter(d => d.status === 'EN_COURS').length;
        const ouverts = initialDossiers.filter(d => d.status === 'OUVERT').length;
        const clotures = initialDossiers.filter(d => d.status === 'CLOTURE').length;
        const archives = initialDossiers.filter(d => d.status === 'ARCHIVE').length;

        return {
            total: initialDossiers.length,
            enCours,
            ouverts,
            clotures,
            archives
        };
    }, [initialDossiers]);

    // Extract unique types for the filter
    const typeOptions = useMemo(() => {
        const types = new Set(initialDossiers.map((d) => d.type).filter(Boolean));
        return Array.from(types).sort();
    }, [initialDossiers]);

    const getClientName = (clientId: string) => {
        const client = clients.find((c) => c.id === clientId);
        return client ? `${client.firstName} ${client.lastName}` : "Inconnu";
    };

    const getUserName = (userId: string) => {
        const user = users.find((u) => u.id === userId);
        return user ? `${user.firstName} ${user.lastName}` : "Non assigné";
    };

    // Filter options
    const statusFilters: FilterOption[] = [
        { id: 'ALL', label: 'Tous', icon: Folder, count: initialDossiers.length },
        { id: 'EN_COURS', label: 'En cours', icon: Activity, count: stats.enCours, gradient: 'from-blue-500 to-cyan-500' },
        { id: 'OUVERT', label: 'Ouverts', icon: CheckCircle, count: stats.ouverts, gradient: 'from-green-500 to-emerald-500' },
        { id: 'CLOTURE', label: 'Clôturés', icon: CheckCircle, count: stats.clotures, gradient: 'from-gray-500 to-slate-500' },
        { id: 'ARCHIVE', label: 'Archivés', icon: Archive, count: stats.archives, gradient: 'from-amber-500 to-orange-500' }
    ];

    const typeFilters: FilterOption[] = [
        { id: 'ALL', label: 'Tous les types', icon: Folder, count: initialDossiers.length },
        ...typeOptions.map(type => {
            const style = getActeTypeStyle(type);
            return {
                id: type,
                label: type,
                icon: style.icon,
                count: initialDossiers.filter(d => d.type === type).length,
                gradient: style.gradient
            };
        })
    ];

    const userFilters: FilterOption[] = [
        { id: 'ALL', label: 'Tous les responsables', icon: User, count: initialDossiers.length },
        ...users.map(user => ({
            id: user.id,
            label: `${user.firstName} ${user.lastName}`,
            icon: User,
            count: initialDossiers.filter(d => d.assignedTo === user.id).length
        }))
    ];

    const filteredDossiers = useMemo(() => {
        return initialDossiers.filter((dossier) => {
            const matchesSearch =
                dossier.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dossier.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
                getClientName(dossier.clientId).toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = selectedType === "ALL" || dossier.type === selectedType;
            const matchesStatus = selectedStatus === "ALL" || dossier.status === selectedStatus;
            const matchesUser = selectedUser === "ALL" || dossier.assignedTo === selectedUser;

            return matchesSearch && matchesType && matchesStatus && matchesUser;
        });
    }, [initialDossiers, searchTerm, selectedType, selectedStatus, selectedUser, clients]);

    return (
        <ModernPageLayout>
            {/* Hero Section */}
            <HeroSection
                title="Dossiers"
                description="Gérez et suivez tous vos dossiers notariaux en temps réel"
                icon={Folder}
                stats={[
                    { label: 'Total', value: stats.total },
                    { label: 'En cours', value: stats.enCours }
                ]}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Dossiers"
                    value={stats.total}
                    icon={Folder}
                    gradient="from-blue-500 to-cyan-500"
                    description="Dossiers actifs"
                    trend={{ value: "+15%", isPositive: true }}
                />
                <StatsCard
                    title="En Cours"
                    value={stats.enCours}
                    icon={Activity}
                    gradient="from-purple-500 to-pink-500"
                    description="Dossiers en traitement"
                />
                <StatsCard
                    title="Clôturés"
                    value={stats.clotures}
                    icon={CheckCircle}
                    gradient="from-green-500 to-emerald-500"
                    description="Dossiers terminés"
                />
                <StatsCard
                    title="Archivés"
                    value={stats.archives}
                    icon={Archive}
                    gradient="from-orange-500 to-red-500"
                    description="Dossiers archivés"
                />
            </div>

            {/* Search and Filters */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                    {/* Search Bar */}
                    <ModernSearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Rechercher un dossier, une référence ou un client..."
                    />

                    {/* Status Filters */}
                    <div>
                        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Statut</h3>
                        <FilterPills
                            options={statusFilters}
                            selected={selectedStatus}
                            onSelect={setSelectedStatus}
                        />
                    </div>

                    {/* Type Filters */}
                    {typeOptions.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Type de dossier</h3>
                            <FilterPills
                                options={typeFilters.slice(0, 8)}
                                selected={selectedType}
                                onSelect={setSelectedType}
                            />
                        </div>
                    )}

                    {/* User Filters */}
                    {users.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Responsable</h3>
                            <FilterPills
                                options={userFilters.slice(0, 6)}
                                selected={selectedUser}
                                onSelect={setSelectedUser}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground font-medium">
                            {filteredDossiers.length} dossier{filteredDossiers.length > 1 ? 's' : ''} trouvé{filteredDossiers.length > 1 ? 's' : ''}
                        </div>
                        <a
                            href="/dashboard/dossiers/new"
                            onClick={(e) => { e.preventDefault(); window.location.href = '/dashboard/dossiers/new'; }}
                            className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-11 px-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                        >
                            <Plus className="mr-2 h-5 w-5" /> Nouveau Dossier
                        </a>
                    </div>
                </CardContent>
            </Card>

            {/* Results Grid */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredDossiers.map((dossier) => {
                            const typeStyle = getActeTypeStyle(dossier.type);
                            const statusStyle = getStatusStyle(dossier.status);
                            const Icon = typeStyle.icon;

                            return (
                                <div
                                    key={dossier.id}
                                    className={`group relative border-2 ${typeStyle.borderColor} rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white hover:-translate-y-2 overflow-hidden`}
                                >
                                    {/* Gradient overlay on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${typeStyle.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                                    <div className="relative z-10">
                                        {/* Header */}
                                        <div className="flex items-start gap-4 mb-3">
                                            <div className={`p-3 ${typeStyle.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
                                                <Icon className={`h-6 w-6 ${typeStyle.textColor}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                                                    {dossier.ref}
                                                </span>
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${statusStyle.badgeBg}`}>
                                                    <div className={`w-2 h-2 rounded-full ${statusStyle.dotColor} animate-pulse`} />
                                                    <span className={`text-xs font-semibold ${statusStyle.text}`}>
                                                        {statusStyle.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className={`font-bold text-base mb-2 ${typeStyle.textColor} group-hover:text-blue-600 transition-colors line-clamp-2`}>
                                            {dossier.title}
                                        </h3>

                                        {/* Type Badge */}
                                        <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${typeStyle.bgColor} ${typeStyle.textColor} border ${typeStyle.borderColor} mb-3`}>
                                            {dossier.type}
                                        </div>

                                        {/* Info */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className="text-xs text-muted-foreground">Client:</span>
                                                <span className="font-semibold truncate">{getClientName(dossier.clientId)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className="text-xs text-muted-foreground">Créé:</span>
                                                <span className="font-medium">
                                                    {new Date(dossier.createdAt).toLocaleDateString("fr-FR", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <a
                                                href={`/dashboard/dossiers/${dossier.id}/generate`}
                                                onClick={(e) => { e.preventDefault(); window.location.href = `/dashboard/dossiers/${dossier.id}/generate`; }}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 text-sm font-medium transition-all cursor-pointer"
                                            >
                                                <FileText className="h-4 w-4" />
                                                Générer
                                            </a>
                                            <a
                                                href={`/dashboard/dossiers/${dossier.id}`}
                                                onClick={(e) => { e.preventDefault(); window.location.href = `/dashboard/dossiers/${dossier.id}`; }}
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${typeStyle.bgColor} ${typeStyle.textColor} hover:opacity-80`}
                                            >
                                                Ouvrir
                                                <ArrowRight className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty State */}
                        {filteredDossiers.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center p-16 text-center">
                                <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4">
                                    <Folder className="h-16 w-16 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Aucun dossier trouvé</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    Essayez de modifier vos filtres ou créez un nouveau dossier pour commencer.
                                </p>
                                <a
                                    href="/dashboard/dossiers/new"
                                    onClick={(e) => { e.preventDefault(); window.location.href = '/dashboard/dossiers/new'; }}
                                    className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-11 px-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                                >
                                    <Plus className="mr-2 h-5 w-5" /> Créer mon premier dossier
                                </a>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </ModernPageLayout>
    );
}
