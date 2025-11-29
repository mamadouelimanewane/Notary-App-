"use client";

import { useState, useEffect } from "react";
import { BankAccountList } from "@/components/treasury/BankAccountList";
import { NewBankAccountModal } from "@/components/treasury/NewBankAccountModal";
import { BankAccount } from "@/types/treasury";

export default function BankAccountsPage() {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAccounts = async () => {
        try {
            const response = await fetch('/api/treasury/bank-accounts');
            if (response.ok) {
                const data = await response.json();
                setAccounts(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Comptes Bancaires</h1>
                    <p className="text-muted-foreground">Gestion des comptes de l'étude (Office & Clients)</p>
                </div>
                <NewBankAccountModal onAccountAdded={loadAccounts} />
            </div>

            <BankAccountList accounts={accounts} />
        </div>
    );
}
