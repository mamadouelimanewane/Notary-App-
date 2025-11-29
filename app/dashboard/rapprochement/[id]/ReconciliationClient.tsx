"use client";

import { useState } from "react";
import { BankStatement, BankTransaction, Transaction } from "@/types/db";
import { reconcileTransaction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, CheckCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReconciliationClientProps {
    statement: BankStatement;
    bankTransactions: BankTransaction[];
    accountingTransactions: Transaction[];
}

export function ReconciliationClient({
    statement,
    bankTransactions: initialBankTransactions,
    accountingTransactions: initialAccountingTransactions
}: ReconciliationClientProps) {
    const [selectedBankTx, setSelectedBankTx] = useState<string | null>(null);
    const [selectedAccTx, setSelectedAccTx] = useState<string | null>(null);
    const [isReconciling, setIsReconciling] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter transactions based on reconciliation status
    const unreconciledBank = initialBankTransactions.filter(t => !t.reconciled);
    const reconciledBank = initialBankTransactions.filter(t => t.reconciled);

    // For accounting, we only receive unreconciled ones from the server usually, 
    // but let's assume we might get all or filter here.
    const unreconciledAccounting = initialAccountingTransactions.filter(t => !t.reconciled);

    const handleReconcile = async () => {
        if (!selectedBankTx || !selectedAccTx) return;

        setIsReconciling(true);
        try {
            const result = await reconcileTransaction(selectedBankTx, selectedAccTx);
            if (result.success) {
                setSelectedBankTx(null);
                setSelectedAccTx(null);
                // The page will revalidate and update the lists
            } else {
                alert("Erreur lors du rapprochement");
            }
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue");
        } finally {
            setIsReconciling(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{statement.fileName}</h2>
                    <p className="text-muted-foreground">
                        {reconciledBank.length} / {initialBankTransactions.length} transactions rapprochées
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleReconcile}
                        disabled={!selectedBankTx || !selectedAccTx || isReconciling}
                    >
                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                        {isReconciling ? "Rapprochement..." : "Rapprocher"}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="unreconciled" className="w-full">
                <TabsList>
                    <TabsTrigger value="unreconciled">À rapprocher</TabsTrigger>
                    <TabsTrigger value="reconciled">Déjà rapproché</TabsTrigger>
                </TabsList>

                <TabsContent value="unreconciled" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bank Transactions */}
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex justify-between items-center">
                                    Banque
                                    <Badge variant="secondary">{unreconciledBank.length}</Badge>
                                </CardTitle>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="h-[600px] overflow-y-auto p-0">
                                <div className="divide-y">
                                    {unreconciledBank
                                        .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.amount.toString().includes(searchTerm))
                                        .map((tx) => (
                                            <div
                                                key={tx.id}
                                                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedBankTx === tx.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                                                onClick={() => setSelectedBankTx(tx.id === selectedBankTx ? null : tx.id)}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-medium text-sm">{format(new Date(tx.date), 'dd MMM yyyy', { locale: fr })}</span>
                                                    <span className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{tx.description}</p>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Accounting Transactions */}
                        <Card className="border-l-4 border-l-purple-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex justify-between items-center">
                                    Comptabilité
                                    <Badge variant="secondary">{unreconciledAccounting.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[600px] overflow-y-auto p-0">
                                <div className="divide-y">
                                    {unreconciledAccounting.map((tx) => (
                                        <div
                                            key={tx.id}
                                            className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedAccTx === tx.id ? 'bg-purple-50 border-l-4 border-purple-600' : ''}`}
                                            onClick={() => setSelectedAccTx(tx.id === selectedAccTx ? null : tx.id)}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-medium text-sm">{format(new Date(tx.date), 'dd MMM yyyy', { locale: fr })}</span>
                                                <span className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{tx.description}</p>
                                            {tx.dossierId && (
                                                <Badge variant="outline" className="mt-2 text-xs">
                                                    Dossier: {tx.dossierId}
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="reconciled">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transactions rapprochées</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {reconciledBank.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                                        <div className="flex items-center gap-4">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <div>
                                                <p className="font-medium">{tx.description}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(tx.date), 'dd MMM yyyy', { locale: fr })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Rapproché le {tx.reconciledAt ? format(new Date(tx.reconciledAt), 'dd/MM/yyyy HH:mm') : '-'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {reconciledBank.length === 0 && (
                                    <p className="text-center text-muted-foreground py-8">Aucune transaction rapprochée pour le moment.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
