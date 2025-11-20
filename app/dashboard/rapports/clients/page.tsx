'use client';

import { useState, useEffect } from "react";
import { ArrowLeft, Users, UserCheck, UserX } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/reports/StatCard";
import ExportButton from "@/components/reports/ExportButton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { exportClientsList } from "@/lib/exportUtils";

export default function RapportsClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [officeName, setOfficeName] = useState('Cabinet Notaire');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [clientsRes, settingsRes] = await Promise.all([
                fetch('/api/clients').then(r => r.json()).catch(() => ({ clients: [] })),
                fetch('/api/office-name').then(r => r.json()).catch(() => ({ officeName: 'Cabinet Notaire' }))
            ]);
            setClients(clientsRes.clients || []);
            setOfficeName(settingsRes.officeName);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: clients.length,
        particuliers: clients.filter(c => c.type === 'PARTICULIER').length,
        entreprises: clients.filter(c => c.type === 'ENTREPRISE').length,
    };

    const chartData = [
        { name: 'Particuliers', value: stats.particuliers },
        { name: 'Entreprises', value: stats.entreprises },
    ];

    const COLORS = ['#3b82f6', '#8b5cf6'];

    if (loading) {
        return <div className="text-center py-12">Chargement...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/rapports" className="p-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">📊 Statistiques Clients</h1>
                        <p className="text-muted-foreground mt-1">Analyse détaillée de la clientèle</p>
                    </div>
                </div>
                <ExportButton
                    onExportPDF={() => exportClientsList(clients, 'pdf', officeName)}
                    onExportExcel={() => exportClientsList(clients, 'excel', officeName)}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Total Clients"
                    value={stats.total}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Particuliers"
                    value={stats.particuliers}
                    icon={UserCheck}
                    color="green"
                />
                <StatCard
                    title="Entreprises"
                    value={stats.entreprises}
                    icon={UserX}
                    color="purple"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border bg-white p-6">
                    <h3 className="font-semibold mb-4">Répartition par type</h3>
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

                <div className="rounded-xl border bg-white p-6">
                    <h3 className="font-semibold mb-4">Derniers clients</h3>
                    <div className="space-y-3">
                        {clients.slice(-10).reverse().map(client => (
                            <div key={client.id} className="flex items-center justify-between p-2 rounded bg-slate-50">
                                <div>
                                    <p className="font-medium text-sm">{client.firstName} {client.lastName}</p>
                                    <p className="text-xs text-muted-foreground">{client.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${client.type === 'PARTICULIER' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                    }`}>
                                    {client.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
