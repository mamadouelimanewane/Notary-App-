"use client";

import { BankAccount } from "@/types/treasury";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CreditCard, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BankAccountListProps {
    accounts: BankAccount[];
}

export function BankAccountList({ accounts }: BankAccountListProps) {
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
                <Card key={account.id} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30">
                        <CardTitle className="text-sm font-medium">
                            {account.name}
                        </CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                <DropdownMenuItem>Historique</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold mb-1">
                            {formatCurrency(account.balance, account.currency)}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mb-4">
                            <Building2 className="mr-1 h-3 w-3" />
                            {account.bankName}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">IBAN:</span>
                                <span className="font-mono text-xs">{account.iban || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Type:</span>
                                <Badge variant={account.type === 'OFFICE' ? 'default' : 'secondary'}>
                                    {account.type === 'OFFICE' ? 'Compte Office' : 'Compte Client'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            {accounts.length === 0 && (
                <div className="col-span-full p-8 text-center border rounded-lg border-dashed text-muted-foreground">
                    Aucun compte bancaire configuré.
                </div>
            )}
        </div>
    );
}
