"use client";

import { useState, useEffect } from "react";
import { TransferList } from "@/components/treasury/TransferList";
import { NewTransferModal } from "@/components/treasury/NewTransferModal";
import { FundTransfer, BankAccount, TransferStatus } from "@/types/treasury";
import { toast } from "@/components/ui/use-toast";

export default function TransfersPage() {
    const [transfers, setTransfers] = useState<FundTransfer[]>([]);
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [transfersRes, accountsRes] = await Promise.all([
                fetch('/api/treasury/transfers'),
                fetch('/api/treasury/bank-accounts')
            ]);

            if (transfersRes.ok && accountsRes.ok) {
                const transfersData = await transfersRes.json();
                const accountsData = await accountsRes.json();
                setTransfers(transfersData);
                setAccounts(accountsData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: TransferStatus) => {
        try {
            const response = await fetch('/api/treasury/transfers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            toast({
                title: "Statut mis à jour",
                description: `Le virement a été ${status === 'EXECUTED' ? 'exécuté' : 'mis à jour'}.`
            });

            loadData(); // Reload to get updated balances
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.message || "Impossible de mettre à jour le virement.",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Virements & Chèques</h1>
                    <p className="text-muted-foreground">Gestion des transferts entre comptes avec validation</p>
                </div>
                <NewTransferModal accounts={accounts} onTransferCreated={loadData} />
            </div>

            <TransferList
                transfers={transfers}
                accounts={accounts}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
}
