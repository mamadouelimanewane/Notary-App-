'use client';

import { useState, useEffect } from "react";
import StatCard from "@/components/reports/StatCard";
import ExportButton from "@/components/reports/ExportButton";
import { Users, FolderOpen, FileText, TrendingUp, BarChart3 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportClientsList, exportActesRegistry, exportFinancialJournal } from "@/lib/exportUtils";
import Link from "next/link";

export default function RapportsPage() {
    const [data, setData] = useState({
        clients: [],
        dossiers: [],
        actes: [],
        transactions: []
    });
    const [officeName, setOfficeName] = useState('Cabinet Notaire');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Charger données depuis les différents modules
            const [clients, dossiers, actes, transactions, settings] = await Promise.all([
                fetch('/api/clients').then(r => r.json()).catch(() => ({ clients: [] })),
                fetch('/api/dossiers').then(r => r.json()).catch(() => ({ dossiers: [] })),
                fetch('/api/actes').then(r => r.json()).catch(() => ({ actes: [] })),
                fetch('/api/transactions').then(r => r.json()).catch(() => ({ transactions: [] })),
                fetch('/api/office-name').then(r => r.json()).catch(() => ({ officeName: 'Cabinet Notaire' }))
            ]);

            setData({
                clients: clients.clients || [],
                dossiers: dossiers.dossiers || [],
                actes: actes.actes || [],
                transactions: transactions.transactions || []
            });
            setOfficeName(settings.officeName);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calcul des statistiques
    const stats = {
        totalClients: data.clients.length,
        totalDossiers: data.dossiers.length,
        totalActes: data.actes.length,
        ca: data.transactions
            .filter((t: any) => t.type === 'CREDIT')
            .reduce((sum: number, t: any) => sum + t.amount, 0)
    };

    // Données pour graphiques
    const actesParType = data.actes.reduce((acc: any, acte: any) => {
        acc[acte.type] = (acc[acte.type] || 0) + 1;
        return acc;
    }, {});

    const actesChartData = Object.entries(actesParType).map(([type, count]) => ({
        type,
        count
    }));

    const dossiersParStatut = data.dossiers.reduce((acc: any, dossier: any) => {
        acc[dossier.status] = (acc[dossier.status] || 0) + 1;
        return acc;
    }, {});

    const dossiersChartData = Object.entries(dossiersParStatut).map(([status, count]) => ({
        status,
        count
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                <p className="mt-4 text-muted-foreground">Chargement des données...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                        Rapports & Statistiques
                    </h1>
                    <p className="text-muted-foreground mt-1">Vue d'ensemble de l'activité du cabinet</p>
                </div>
                <ExportButton
                    label="Exporter rapport global"
                    onExportPDF={() => {
                        alert('Export PDF du rapport global en cours de développement');
                    }}
                    onExportExcel={() => {
                        alert('Export Excel du rapport global en cours de développement');
                    }}
                />
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Clients"
                    value={stats.totalClients}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Dossiers"
                    value={stats.totalDossiers}
                    icon={FolderOpen}
                    color="green"
                />
                <StatCard
                    title="Actes"
                    value={stats.totalActes}
                    icon={FileText}
                    color="orange"
                />
                <StatCard
                    title="Chiffre d'affaires"
                    value={`${(stats.ca / 1000).toFixed(0)}K FCFA`}
                    icon={TrendingUp}
                    color="purple"
                />
            </div>

            {/* Navigation rapide */}
            <div className="grid gap-4 md:grid-cols-4">
                <Link href="/dashboard/rapports/clients" className="group rounded-xl border bg-white p-4 hover:shadow-lg transition-all">
                    <h3 className="font-semibold text-sm group-hover:text-blue-600">📊 Statistiques clients</h3>
                    <p className="text-xs text-muted-foreground mt-1">Détails et exports</p>
                </Link>
                <Link href="/dashboard/rapports/dossiers" className="group rounded-xl border bg-white p-4 hover:shadow-lg transition-all">
                    <h3 className="font-semibold text-sm group-hover:text-green-600">📁 Statistiques dossiers</h3>
                    <p className="text-xs text-muted-foreground mt-1">Par statut et catégorie</p>
                </Link>
                <Link href="/dashboard/rapports/actes" className="group rounded-xl border bg-white p-4 hover:shadow-lg transition-all">
                    <h3 className="font-semibold text-sm group-hover:text-orange-600">📄 Statistiques actes</h3>
                    <p className="text-xs text-muted-foreground mt-1">Registre et types</p>
                </Link>
                <Link href="/dashboard/rapports/finances" className="group rounded-xl border bg-white p-4 hover:shadow-lg transition-all">
                    <h3 className="font-semibold text-sm group-hover:text-purple-600">💰 Statistiques finances</h3>
                    <p className="text-xs text-muted-foreground mt-1">CA et comptabilité</p>
                </Link>
            </div>

            {/* Graphiques */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Actes par type */}
                <div className="rounded-xl border bg-white p-6">
                    <h3 className="font-semibold mb-4">Actes par type</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={actesChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="type" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Dossiers par statut */}
                <div className="rounded-xl border bg-white p-6">
                    <h3 className="font-semibold mb-4">Dossiers par statut</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dossiersChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => entry.status}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {dossiersChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Exports rapides */}
            <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <h3 className="font-semibold mb-4">Exports rapides</h3>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => exportClientsList(data.clients, 'excel', officeName)}
                        className="inline-flex items-center justify-center rounded-md border bg-white hover:bg-slate-50 h-9 px-4 text-sm"
                    >
                        📊 Liste clients (Excel)
                    </button>
                    <button
                        onClick={() => exportActesRegistry(data.actes, 'pdf', officeName)}
                        className="inline-flex items-center justify-center rounded-md border bg-white hover:bg-slate-50 h-9 px-4 text-sm"
                    >
                        📄 Registre actes (PDF)
                    </button>
                    <button
                        onClick={() => exportFinancialJournal(data.transactions, 'excel', officeName)}
                        className="inline-flex items-center justify-center rounded-md border bg-white hover:bg-slate-50 h-9 px-4 text-sm"
                    >
                        💰 Journal comptable (Excel)
                    </button>
                </div>
            </div>
        </div>
    );
}
