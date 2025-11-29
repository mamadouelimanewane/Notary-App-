"use client";

import { useState, useEffect } from "react";
import { CashTransactionList } from "@/components/treasury/CashTransactionList";
import { NewCashTransactionModal } from "@/components/treasury/NewCashTransactionModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

export default function CashPage() {
    const [data, setData] = useState<{ transactions: any[], stats: any } | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const response = await fetch('/api/treasury/cash');
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;
    if (!data) return <div className="p-8 text-center">Erreur de chargement</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Livre de Caisse</h1>
                    <p className="text-muted-foreground">Gestion des espèces et petite caisse</p>
                </div>
                <NewCashTransactionModal onTransactionAdded={loadData} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solde Caisse</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.stats.totalCash)}</div>
                        <p className="text-xs text-muted-foreground">Disponible en espèces</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entrées (Mois)</CardTitle>
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">+{formatCurrency(data.stats.monthlyInflow)}</div>
                        <p className="text-xs text-muted-foreground">Encaissements ce mois</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sorties (Mois)</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">-{formatCurrency(data.stats.monthlyOutflow)}</div>
                        <p className="text-xs text-muted-foreground">Décaissements ce mois</p>
                    </CardContent>
                </Card>
            </div>

            <CashTransactionList transactions={data.transactions} />
        </div>
    );
}
