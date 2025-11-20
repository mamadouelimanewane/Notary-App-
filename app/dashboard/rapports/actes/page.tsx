'use client';

import { useState, useEffect } from "react";
import { ArrowLeft, FileText, FileCheck, FileClock } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/reports/StatCard";
import ExportButton from "@/components/reports/ExportButton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportActesRegistry } from "@/lib/exportUtils";

export default function RapportsActesPage() {
    const [actes, setActes] = useState<any[]>([]);
    const [officeName, setOfficeName] = useState('Cabinet Notaire');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [actesRes, settingsRes] = await Promise.all([
                fetch('/api/actes').then(r => r.json()).catch(() => ({ actes: [] })),
                fetch('/api/office-name').then(r => r.json()).catch(() => ({ officeName: 'Cabinet Notaire' }))
            ]);
            setActes(actesRes.actes || []);
            setOfficeName(settingsRes.officeName);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: actes.length,
        brouillon: actes.filter(a => a.status === 'BROUILLON').length,
        signe: actes.filter(a => a.status === 'SIGNE').length,
        enregistre: actes.filter(a => a.status === 'ENREGISTRE').length,
    };

    // Grouper par type
    const actesParType = actes.reduce((acc: any, acte) => {
        acc[acte.type] = (acc[acte.type] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(actesParType).map(([type, count]) => ({
        type,
        count
    }));

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
                        <h1 className="text-3xl font-bold">📄 Statistiques Actes</h1>
                        <p className="text-muted-foreground mt-1">Registre et analyse des actes</p>
                    </div>
                </div>
                <ExportButton
                    onExportPDF={() => exportActesRegistry(actes, 'pdf', officeName)}
                    onExportExcel={() => exportActesRegistry(actes, 'excel', officeName)}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard
                    title="Total Actes"
                    value={stats.total}
                    icon={FileText}
                    color="blue"
                />
                <StatCard
                    title="Brouillons"
                    value={stats.brouillon}
                    icon={FileClock}
                    color="orange"
                />
                <StatCard
                    title="Signés"
                    value={stats.signe}
                    icon={FileCheck}
                    color="green"
                />
                <StatCard
                    title="Enregistrés"
                    value={stats.enregistre}
                    icon={FileCheck}
                    color="purple"
                />
            </div>

            <div className="rounded-xl border bg-white p-6">
                <h3 className="font-semibold mb-4">Actes par type</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="rounded-xl border bg-white p-6">
                <h3 className="font-semibold mb-4">Derniers actes enregistrés</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left py-2">Référence</th>
                                <th className="text-left py-2">Type</th>
                                <th className="text-left py-2">Statut</th>
                                <th className="text-left py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actes.slice(-10).reverse().map(acte => (
                                <tr key={acte.id} className="border-b hover:bg-slate-50">
                                    <td className="py-2">{acte.ref}</td>
                                    <td className="py-2">{acte.type}</td>
                                    <td className="py-2">
                                        <span className={`text-xs px-2 py-1 rounded ${acte.status === 'ENREGISTRE' ? 'bg-purple-100 text-purple-800' :
                                                acte.status === 'SIGNE' ? 'bg-green-100 text-green-800' :
                                                    'bg-orange-100 text-orange-800'
                                            }`}>
                                            {acte.status}
                                        </span>
                                    </td>
                                    <td className="py-2">{new Date(acte.createdAt).toLocaleDateString('fr-FR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
