'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/format';
import { ArrowUpRight, ArrowDownLeft, Activity } from 'lucide-react';

interface DashboardMetrics {
    totalActif: number;
    totalPassif: number;
    resultatNet: number;
    tresorerie: number;
}

export default function AccountingDashboardClient() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // Fetch Bilan for high-level metrics
                const today = new Date().toISOString().split('T')[0];
                const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

                const res = await fetch(`/api/accounting/reports/bilan?startDate=${startOfYear}&endDate=${today}`);
                if (!res.ok) throw new Error('Failed to fetch metrics');
                const data = await res.json();

                setMetrics({
                    totalActif: data.actif.total,
                    totalPassif: data.passif.total,
                    resultatNet: data.passif.resultat,
                    tresorerie: data.actif.tresorerie
                });
            } catch (error) {
                console.error('Error fetching dashboard metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Chargement des indicateurs...</div>;
    }

    if (!metrics) {
        return null;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold font-serif text-foreground">Indicateurs Clés (Année en cours)</h2>
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Actif</h3>
                        <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">
                        {formatCurrency(metrics.totalActif)}
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Passif</h3>
                        <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">
                        {formatCurrency(metrics.totalPassif)}
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Résultat Net</h3>
                        <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className={`text-2xl font-bold ${metrics.resultatNet >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(metrics.resultatNet)}
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Trésorerie</h3>
                        <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(metrics.tresorerie)}
                    </div>
                </div>
            </div>
        </div>
    );
}
