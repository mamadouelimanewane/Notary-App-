"use client";

import { Users, FolderOpen, FileCheck, Activity, TrendingUp, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StatsProps {
    stats: {
        clients: number;
        dossiers: number;
        dossiersEnCours: number;
        actesSignes: number;
    };
    clients?: any[];
    dossiers?: any[];
    actes?: any[];
}

export function DashboardStats({ stats, clients = [], dossiers = [], actes = [] }: StatsProps) {
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<"clients" | "dossiers" | "dossiersEnCours" | "actes" | null>(null);

    const openDialog = (type: "clients" | "dossiers" | "dossiersEnCours" | "actes") => {
        setDialogType(type);
        setDialogOpen(true);
    };

    const handleViewItem = (path: string) => {
        setDialogOpen(false);
        setTimeout(() => {
            router.push(path);
        }, 100);
    };

    const getDialogContent = () => {
        switch (dialogType) {
            case "clients":
                return {
                    title: "Liste des Clients",
                    description: `${clients.length} client${clients.length > 1 ? 's' : ''} enregistré${clients.length > 1 ? 's' : ''}`,
                    items: clients,
                    renderItem: (client: any) => (
                        <div key={client.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100">
                            <div>
                                <div className="font-medium">{client.firstName} {client.lastName}</div>
                                <div className="text-sm text-muted-foreground">{client.email}</div>
                                <div className="text-sm text-muted-foreground">{client.phone}</div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewItem(`/dashboard/clients`)}
                            >
                                Voir
                            </Button>
                        </div>
                    ),
                    linkTo: "/dashboard/clients",
                };
            case "dossiers":
                return {
                    title: "Tous les Dossiers",
                    description: `${dossiers.length} dossier${dossiers.length > 1 ? 's' : ''} au total`,
                    items: dossiers,
                    renderItem: (dossier: any) => (
                        <div key={dossier.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100">
                            <div>
                                <div className="font-medium">{dossier.title}</div>
                                <div className="text-sm text-muted-foreground">{dossier.ref} - {dossier.type}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={dossier.status === "EN_COURS" ? "default" : "secondary"}>
                                    {dossier.status}
                                </Badge>
                                <Link href={`/dashboard/dossiers/${dossier.id}`}>
                                    <Button variant="ghost" size="sm">Voir</Button>
                                </Link>
                            </div>
                        </div>
                    ),
                    linkTo: "/dashboard/dossiers",
                };
            case "dossiersEnCours":
                const dossiersEnCours = dossiers.filter(d => d.status === "EN_COURS");
                return {
                    title: "Dossiers en Cours",
                    description: `${dossiersEnCours.length} dossier${dossiersEnCours.length > 1 ? 's' : ''} en cours de traitement`,
                    items: dossiersEnCours,
                    renderItem: (dossier: any) => (
                        <div key={dossier.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100">
                            <div>
                                <div className="font-medium">{dossier.title}</div>
                                <div className="text-sm text-muted-foreground">{dossier.ref} - {dossier.type}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge>{dossier.status}</Badge>
                                <Link href={`/dashboard/dossiers/${dossier.id}`}>
                                    <Button variant="ghost" size="sm">Voir</Button>
                                </Link>
                            </div>
                        </div>
                    ),
                    linkTo: "/dashboard/dossiers",
                };
            case "actes":
                const actesSignes = actes.filter(a => a.status === "SIGNE");
                return {
                    title: "Actes Signés",
                    description: `${actesSignes.length} acte${actesSignes.length > 1 ? 's' : ''} signé${actesSignes.length > 1 ? 's' : ''}`,
                    items: actesSignes,
                    renderItem: (acte: any) => (
                        <div key={acte.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100">
                            <div>
                                <div className="font-medium">{acte.title}</div>
                                <div className="text-sm text-muted-foreground">{acte.type} - {acte.category}</div>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(acte.createdAt).toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                            <Link href={`/dashboard/actes`}>
                                <Button variant="ghost" size="sm">Voir</Button>
                            </Link>
                        </div>
                    ),
                    linkTo: "/dashboard/actes",
                };
            default:
                return null;
        }
    };

    const dialogContent = getDialogContent();

    const statCards = [
        {
            title: "Total Clients",
            value: stats.clients,
            icon: Users,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
            iconBg: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400",
            onClick: () => openDialog("clients"),
            trend: "+12%",
            trendUp: true
        },
        {
            title: "Dossiers",
            value: stats.dossiers,
            icon: FolderOpen,
            gradient: "from-violet-500 to-purple-500",
            bgGradient: "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
            iconBg: "bg-violet-100 dark:bg-violet-900/30",
            iconColor: "text-violet-600 dark:text-violet-400",
            onClick: () => openDialog("dossiers"),
            trend: "+8%",
            trendUp: true
        },
        {
            title: "En Cours",
            value: stats.dossiersEnCours,
            icon: Activity,
            gradient: "from-amber-500 to-orange-500",
            bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
            iconBg: "bg-amber-100 dark:bg-amber-900/30",
            iconColor: "text-amber-600 dark:text-amber-400",
            onClick: () => openDialog("dossiersEnCours"),
            trend: "+5%",
            trendUp: true
        },
        {
            title: "Actes Signés",
            value: stats.actesSignes,
            icon: FileCheck,
            gradient: "from-emerald-500 to-green-500",
            bgGradient: "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
            iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            onClick: () => openDialog("actes"),
            trend: "+15%",
            trendUp: true
        },
    ];

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            onClick={card.onClick}
                            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${card.bgGradient} p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
                        >
                            {/* Barre de gradient en haut */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />

                            {/* Effet de brillance au survol */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`h-6 w-6 ${card.iconColor}`} />
                                    </div>
                                    {card.trend && (
                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${card.trendUp
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            <TrendingUp className="h-3 w-3" />
                                            {card.trend}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {card.title}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-4xl font-bold tracking-tight">
                                            {card.value}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                    <span>Voir les détails</span>
                                    <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{dialogContent?.title}</DialogTitle>
                        <DialogDescription>{dialogContent?.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                        {dialogContent?.items && dialogContent.items.length > 0 ? (
                            dialogContent.items.map(dialogContent.renderItem)
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                Aucun élément à afficher
                            </div>
                        )}
                    </div>
                    {dialogContent?.items && dialogContent.items.length > 0 && (
                        <div className="flex justify-center mt-4 pt-4 border-t">
                            <Link href={dialogContent.linkTo}>
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                    Voir tous dans la page dédiée
                                </Button>
                            </Link>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
