"use client";

import { FundTransfer, TransferStatus } from "@/types/treasury";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRightLeft, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TransferListProps {
    transfers: FundTransfer[];
    accounts: any[];
    onStatusChange: (id: string, status: TransferStatus) => void;
}

export function TransferList({ transfers, accounts, onStatusChange }: TransferListProps) {
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
    };

    const getAccountName = (id: string) => {
        const account = accounts.find(a => a.id === id);
        return account?.name || 'Inconnu';
    };

    const getStatusBadge = (status: TransferStatus) => {
        const configs = {
            DRAFT: { label: 'Brouillon', className: 'bg-gray-100 text-gray-700', icon: Clock },
            PENDING_VALIDATION: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
            VALIDATED: { label: 'Validé', className: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
            REJECTED: { label: 'Rejeté', className: 'bg-red-100 text-red-700', icon: XCircle },
            EXECUTED: { label: 'Exécuté', className: 'bg-green-100 text-green-700', icon: CheckCircle2 }
        };
        const config = configs[status];
        const Icon = config.icon;
        return (
            <Badge className={`${config.className} border-0`}>
                <Icon className="mr-1 h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    return (
        <div className="rounded-md border bg-white">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-muted/50">
                        <th className="p-4 text-left font-medium">Date</th>
                        <th className="p-4 text-left font-medium">De</th>
                        <th className="p-4 text-left font-medium">Vers</th>
                        <th className="p-4 text-left font-medium">Description</th>
                        <th className="p-4 text-right font-medium">Montant</th>
                        <th className="p-4 text-center font-medium">Statut</th>
                        <th className="p-4 text-center font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                Aucun virement enregistré
                            </td>
                        </tr>
                    ) : (
                        transfers.map((transfer) => (
                            <tr key={transfer.id} className="border-b last:border-0 hover:bg-muted/50">
                                <td className="p-4">
                                    {format(new Date(transfer.date), "dd/MM/yyyy", { locale: fr })}
                                </td>
                                <td className="p-4 font-medium">{getAccountName(transfer.fromAccountId)}</td>
                                <td className="p-4 font-medium">{getAccountName(transfer.toAccountId)}</td>
                                <td className="p-4 text-muted-foreground">{transfer.description}</td>
                                <td className="p-4 text-right font-bold">
                                    {formatCurrency(transfer.amount, transfer.currency)}
                                </td>
                                <td className="p-4 text-center">
                                    {getStatusBadge(transfer.status)}
                                </td>
                                <td className="p-4 text-center">
                                    {transfer.status === 'DRAFT' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onStatusChange(transfer.id, 'PENDING_VALIDATION')}
                                        >
                                            Soumettre
                                        </Button>
                                    )}
                                    {transfer.status === 'PENDING_VALIDATION' && (
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                size="sm"
                                                onClick={() => onStatusChange(transfer.id, 'VALIDATED')}
                                            >
                                                Valider
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => onStatusChange(transfer.id, 'REJECTED')}
                                            >
                                                Rejeter
                                            </Button>
                                        </div>
                                    )}
                                    {transfer.status === 'VALIDATED' && (
                                        <Button
                                            size="sm"
                                            onClick={() => onStatusChange(transfer.id, 'EXECUTED')}
                                        >
                                            Exécuter
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
