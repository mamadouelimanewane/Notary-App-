"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    TrendingUp, TrendingDown, Users, FolderOpen, FileText, Euro,
    Clock, AlertTriangle, CheckCircle, Calendar, Target, Zap
} from "lucide-react";
import { Client, Dossier, Acte } from "@/types/db";

interface AdvancedAnalyticsProps {
    clients: Client[];
    dossiers: Dossier[];
    actes: Acte[];
}

export function AdvancedAnalytics({ clients, dossiers, actes }: AdvancedAnalyticsProps) {
    // Calculs des KPIs
    const kpis = useMemo(() => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        // Clients
        const clientsThisMonth = clients.filter(c => {
            const date = new Date(c.createdAt);
            return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        }).length;

        const clientsLastMonth = clients.filter(c => {
            const date = new Date(c.createdAt);
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }).length;

        const clientsGrowth = clientsLastMonth > 0
            ? ((clientsThisMonth - clientsLastMonth) / clientsLastMonth * 100).toFixed(1)
            : clientsThisMonth > 0 ? 100 : 0;

        // Dossiers
        const dossiersThisMonth = dossiers.filter(d => {
            const date = new Date(d.createdAt);
            return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        }).length;

        const dossiersLastMonth = dossiers.filter(d => {
            const date = new Date(d.createdAt);
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }).length;

        const dossiersGrowth = dossiersLastMonth > 0
            ? ((dossiersThisMonth - dossiersLastMonth) / dossiersLastMonth * 100).toFixed(1)
            : dossiersThisMonth > 0 ? 100 : 0;

        // Actes signés
        const actesThisMonth = actes.filter(a => {
            if (a.status !== 'SIGNE') return false;
            const date = new Date(a.createdAt);
            return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        }).length;

        const actesLastMonth = actes.filter(a => {
            if (a.status !== 'SIGNE') return false;
            const date = new Date(a.createdAt);
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }).length;

        const actesGrowth = actesLastMonth > 0
            ? ((actesThisMonth - actesLastMonth) / actesLastMonth * 100).toFixed(1)
            : actesThisMonth > 0 ? 100 : 0;

        // Taux de conversion
        const conversionRate = clients.length > 0
            ? (dossiers.length / clients.length * 100).toFixed(1)
            : 0;

        // Délai moyen de traitement (en jours)
        const completedDossiers = dossiers.filter(d => d.status === 'CLOTURE');
        const avgProcessingTime = completedDossiers.length > 0
            ? (completedDossiers.reduce((sum, d) => {
                const start = new Date(d.createdAt);
                const end = new Date(d.updatedAt);
                return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
            }, 0) / completedDossiers.length).toFixed(0)
            : 0;

        // Dossiers en retard (plus de 30 jours en cours)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const lateDossiers = dossiers.filter(d => {
            if (d.status !== 'EN_COURS') return false;
            return new Date(d.createdAt) < thirtyDaysAgo;
        }).length;

        return {
            clientsThisMonth,
            clientsGrowth: Number(clientsGrowth),
            dossiersThisMonth,
            dossiersGrowth: Number(dossiersGrowth),
            actesThisMonth,
            actesGrowth: Number(actesGrowth),
            conversionRate: Number(conversionRate),
            avgProcessingTime: Number(avgProcessingTime),
            lateDossiers,
            totalClients: clients.length,
            totalDossiers: dossiers.length,
            totalActes: actes.filter(a => a.status === 'SIGNE').length,
        };
    }, [clients, dossiers, actes]);

    // Alertes intelligentes
    const alerts = useMemo(() => {
        const alertsList = [];

        if (kpis.lateDossiers > 0) {
            alertsList.push({
                type: 'warning',
                icon: AlertTriangle,
                title: `${kpis.lateDossiers} dossier${kpis.lateDossiers > 1 ? 's' : ''} en retard`,
                description: 'Plus de 30 jours en cours',
                action: 'Voir les dossiers'
            });
        }

        if (kpis.clientsGrowth < 0) {
            alertsList.push({
                type: 'error',
                icon: TrendingDown,
                title: 'Baisse des nouveaux clients',
                description: `${Math.abs(kpis.clientsGrowth)}% ce mois`,
                action: 'Analyser'
            });
        }

        if (kpis.avgProcessingTime > 45) {
            alertsList.push({
                type: 'warning',
                icon: Clock,
                title: 'Délai de traitement élevé',
                description: `${kpis.avgProcessingTime} jours en moyenne`,
                action: 'Optimiser'
            });
        }

        if (kpis.conversionRate < 50) {
            alertsList.push({
                type: 'info',
                icon: Target,
                title: 'Taux de conversion faible',
                description: `${kpis.conversionRate}% de clients convertis`,
                action: 'Améliorer'
            });
        }

        if (alertsList.length === 0) {
            alertsList.push({
                type: 'success',
                icon: CheckCircle,
                title: 'Tout va bien !',
                description: 'Aucune alerte à signaler',
                action: null
            });
        }

        return alertsList;
    }, [kpis]);

    const getGrowthColor = (growth: number) => {
        if (growth > 0) return 'text-green-600';
        if (growth < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getGrowthIcon = (growth: number) => {
        if (growth > 0) return TrendingUp;
        if (growth < 0) return TrendingDown;
        return null;
    };

    return (
        <div className="space-y-6">
            {/* KPIs Principaux */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Nouveaux Clients */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Users className="h-6 w-6" />
                            </div>
                            {kpis.clientsGrowth !== 0 && (() => {
                                const Icon = getGrowthIcon(kpis.clientsGrowth);
                                return Icon ? <Icon className="h-5 w-5" /> : null;
                            })()}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm opacity-90">Nouveaux Clients</p>
                            <p className="text-4xl font-bold">{kpis.clientsThisMonth}</p>
                            <p className="text-xs opacity-75">
                                {kpis.clientsGrowth > 0 ? '+' : ''}{kpis.clientsGrowth}% vs mois dernier
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Nouveaux Dossiers */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <FolderOpen className="h-6 w-6" />
                            </div>
                            {kpis.dossiersGrowth !== 0 && (() => {
                                const Icon = getGrowthIcon(kpis.dossiersGrowth);
                                return Icon ? <Icon className="h-5 w-5" /> : null;
                            })()}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm opacity-90">Nouveaux Dossiers</p>
                            <p className="text-4xl font-bold">{kpis.dossiersThisMonth}</p>
                            <p className="text-xs opacity-75">
                                {kpis.dossiersGrowth > 0 ? '+' : ''}{kpis.dossiersGrowth}% vs mois dernier
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Actes Signés */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <FileText className="h-6 w-6" />
                            </div>
                            {kpis.actesGrowth !== 0 && (() => {
                                const Icon = getGrowthIcon(kpis.actesGrowth);
                                return Icon ? <Icon className="h-5 w-5" /> : null;
                            })()}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm opacity-90">Actes Signés</p>
                            <p className="text-4xl font-bold">{kpis.actesThisMonth}</p>
                            <p className="text-xs opacity-75">
                                {kpis.actesGrowth > 0 ? '+' : ''}{kpis.actesGrowth}% vs mois dernier
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Taux de Conversion */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Target className="h-6 w-6" />
                            </div>
                            <Zap className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm opacity-90">Taux de Conversion</p>
                            <p className="text-4xl font-bold">{kpis.conversionRate}%</p>
                            <p className="text-xs opacity-75">
                                {kpis.totalDossiers} dossiers / {kpis.totalClients} clients
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* KPIs Secondaires */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Délai Moyen */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            Délai Moyen de Traitement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{kpis.avgProcessingTime}</div>
                        <p className="text-xs text-muted-foreground mt-1">jours en moyenne</p>
                    </CardContent>
                </Card>

                {/* Dossiers en Retard */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            Dossiers en Retard
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{kpis.lateDossiers}</div>
                        <p className="text-xs text-muted-foreground mt-1">plus de 30 jours</p>
                    </CardContent>
                </Card>

                {/* Total Actes */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Total Actes Signés
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{kpis.totalActes}</div>
                        <p className="text-xs text-muted-foreground mt-1">depuis le début</p>
                    </CardContent>
                </Card>
            </div>

            {/* Alertes Intelligentes */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        Alertes & Recommandations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {alerts.map((alert, index) => {
                            const Icon = alert.icon;
                            const bgColor = alert.type === 'error' ? 'bg-red-50 border-red-200' :
                                alert.type === 'warning' ? 'bg-orange-50 border-orange-200' :
                                    alert.type === 'success' ? 'bg-green-50 border-green-200' :
                                        'bg-blue-50 border-blue-200';

                            const iconColor = alert.type === 'error' ? 'text-red-600' :
                                alert.type === 'warning' ? 'text-orange-600' :
                                    alert.type === 'success' ? 'text-green-600' :
                                        'text-blue-600';

                            return (
                                <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${bgColor}`}>
                                    <div className="flex items-center gap-3">
                                        <Icon className={`h-5 w-5 ${iconColor}`} />
                                        <div>
                                            <p className="font-medium text-sm">{alert.title}</p>
                                            <p className="text-xs text-muted-foreground">{alert.description}</p>
                                        </div>
                                    </div>
                                    {alert.action && (
                                        <button className="text-xs font-medium text-primary hover:underline">
                                            {alert.action}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
