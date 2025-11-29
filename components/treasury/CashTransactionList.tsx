"use client";

import { useState } from "react";
import { CashTransaction, CashTransactionType } from "@/types/treasury";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowDownLeft, ArrowUpRight, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CashTransactionListProps {
    transactions: CashTransaction[];
}

export function CashTransactionList({ transactions }: CashTransactionListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<CashTransactionType | "ALL">("ALL");

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.reference?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "ALL" || t.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher une transaction..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tout</SelectItem>
                        <SelectItem value="IN">Entrées</SelectItem>
                        <SelectItem value="OUT">Sorties</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-4 text-left font-medium">Date</th>
                            <th className="p-4 text-left font-medium">Type</th>
                            <th className="p-4 text-left font-medium">Description</th>
                            <th className="p-4 text-left font-medium">Catégorie</th>
                            <th className="p-4 text-left font-medium">Référence</th>
                            <th className="p-4 text-right font-medium">Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                    Aucune transaction trouvée
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((t) => (
                                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/50">
                                    <td className="p-4">
                                        {format(new Date(t.date), "dd/MM/yyyy", { locale: fr })}
                                    </td>
                                    <td className="p-4">
                                        {t.type === 'IN' ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                                <ArrowDownLeft className="mr-1 h-3 w-3" /> Entrée
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                                                <ArrowUpRight className="mr-1 h-3 w-3" /> Sortie
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium">{t.description}</td>
                                    <td className="p-4 text-muted-foreground text-xs uppercase tracking-wider">
                                        {t.category}
                                    </td>
                                    <td className="p-4 text-muted-foreground">{t.reference || '-'}</td>
                                    <td className={`p-4 text-right font-bold ${t.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'IN' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
