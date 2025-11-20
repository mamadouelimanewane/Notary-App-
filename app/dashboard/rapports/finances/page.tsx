'use client';

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/reports/StatCard";
import ExportButton from "@/components/reports/ExportButton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { exportFinancialJournal } from "@/lib/exportUtils";
import { formatCurrency } from "@/lib/format";

export default function RapportsFinancesPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [officeName, setOfficeName] = useState('Cabinet Notaire');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [transactionsRes, settingsRes] = await Promise.all([
                fetch('/api/transactions').then(r => r.json()).catch(() => ({ transactions: [] })),
                fetch('/api/office-name').then(r => r.json()).catch(() => ({ officeName: 'Cabinet Notaire' }))
            ]);
            setTransactions(transactionsRes.transactions || []);
            setOfficeName(settingsRes.officeName);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        totalCredit: transactions.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0),
        totalDebit: transactions.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0),
        balance: 0
    };
    stats.balance = stats.totalCredit - stats.totalDebit;

    // Évolution mensuelle
    const monthlyData = transactions.reduce((acc: any, t) => {
        const month = new Date(t.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = { month, credit: 0, debit: 0 };
        }
        if (t.type === 'CREDIT') {
            acc[month].credit += t.amount;
        } else {
            acc[month].debit += t.amount;
        }
        return acc;
    }, {});

    const chartData = Object.values(monthlyData).slice(-12); // 12 derniers mois

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
                        <h1 className="text-3xl font-bold">💰 Statistiques Financières</h1>
                        <p className="text-muted-foreground mt-1">Analyse comptable et chiffre d'affaires</p>
                    </div>
                </div>
                <ExportButton
                    onExportPDF={() => exportFinancialJournal(transactions, 'pdf', officeName)}
                    onExportExcel={() => exportFinancialJournal(transactions, 'excel', officeName)}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Total Crédit"
                    value={formatCurrency(stats.totalCredit)}
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Total Débit"
                    value={formatCurrency(stats.totalDebit)}
                    icon={TrendingDown}
                    color="red"
                />
                <StatCard
                    title="Balance"
                    value={formatCurrency(stats.balance)}
                    icon={DollarSign}
                    color={stats.balance >= 0 ? 'green' : 'red'}
                />
            </div>

            <div className="rounded-xl border bg-white p-6">
                <h3 className="font-semibold mb-4">Évolution mensuelle (Crédit vs Débit)</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line type="monotone" dataKey="credit" stroke="#10b981" name="Crédit" strokeWidth={2} />
                        <Line type="monotone" dataKey="debit" stroke="#ef4444" name="Débit" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="rounded-xl border bg-white p-6">
                <h3 className="font-semibold mb-4">Dernières transactions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left py-2">Date</th>
                                <th className="text-left py-2">Description</th>
                                <th className="text-left py-2">Type</th>
                                <th className="text-right py-2">Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice(-15).reverse().map(t => (
                                <tr key={t.id} className="border-b hover:bg-slate-50">
                                    <td className="py-2">{new Date(t.date).toLocaleDateString('fr-FR')}</td>
                                    <td className="py-2">{t.description}</td>
                                    <td className="py-2">
                                        <span className={`text-xs px-2 py-1 rounded ${t.type === 'CREDIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className={`py-2 text-right font-medium ${t.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {formatCurrency(t.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
