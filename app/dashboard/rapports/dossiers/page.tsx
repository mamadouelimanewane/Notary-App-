'use client';

import { useState, useEffect } from "react";
import { ArrowLeft, FolderOpen, FolderCheck, FolderClock } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/reports/StatCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function RapportsDossiersPage() {
    const [dossiers, setDossiers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dossiers')
            .then(r => r.json())
            .then(data => setDossiers(data.dossiers || []))
            .catch(() => setDossiers([]))
            .finally(() => setLoading(false));
    }, []);

    const stats = {
        total: dossiers.length,
        enCours: dossiers.filter(d => d.status === 'EN_COURS').length,
        termine: dossiers.filter(d => d.status === 'TERMINE').length,
        archive: dossiers.filter(d => d.status === 'ARCHIVE').length,
    };

    const chartData = [
        { name: 'En cours', value: stats.enCours },
        { name: 'Terminé', value: stats.termine },
        { name: 'Archivé', value: stats.archive },
    ];

    const COLORS = ['#f59e0b', '#10b981', '#8b5cf6'];

    if (loading) {
        return <div className="text-center py-12">Chargement...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/rapports" className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">📁 Statistiques Dossiers</h1>
                    <p className="text-muted-foreground mt-1">Analyse par statut et catégorie</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard title="Total Dossiers" value={stats.total} icon={FolderOpen} color="blue" />
                <StatCard title="En cours" value={stats.enCours} icon={FolderClock} color="orange" />
                <StatCard title="Terminés" value={stats.termine} icon={FolderCheck} color="green" />
                <StatCard title="Archivés" value={stats.archive} icon={FolderCheck} color="purple" />
            </div>

            <div className="rounded-xl border bg-white p-6">
                <h3 className="font-semibold mb-4">Répartition par statut</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${entry.value}`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
