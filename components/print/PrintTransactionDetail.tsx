"use client";

import PrintHeader from "./PrintHeader";
import { formatCurrency, formatDate } from "@/lib/format";

interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    description: string;
    dossierId: string;
    reconciled: boolean;
    reconciledAt?: string;
}

interface Dossier {
    id: string;
    ref: string;
    title: string;
}

interface PrintTransactionDetailProps {
    transaction: Transaction;
    dossier: Dossier | null;
}

export default function PrintTransactionDetail({ transaction, dossier }: PrintTransactionDetailProps) {
    return (
        <div className="print-container p-8">
            <PrintHeader
                title="Détail de l'Opération Comptable"
                subtitle={transaction.description}
            />

            {/* Transaction Information */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-slate-300">
                    Informations Générales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Date</p>
                        <p className="text-sm">{formatDate(transaction.date)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Type</p>
                        <p className="text-sm font-medium">
                            {transaction.type === 'CREDIT' ? 'Crédit (Recette)' : 'Débit (Dépense)'}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs text-slate-600 font-semibold">Description</p>
                        <p className="text-sm">{transaction.description}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Montant</p>
                        <p className={`text-lg font-bold ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {formatCurrency(transaction.amount)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Dossier Associé</p>
                        <p className="text-sm">
                            {dossier ? `${dossier.ref} - ${dossier.title}` : 'Inconnu'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Réconciliation */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-slate-300">
                    Rapprochement Bancaire
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Statut</p>
                        <p className="text-sm font-medium">
                            {transaction.reconciled ? 'Rapproché ✓' : 'Non rapproché'}
                        </p>
                    </div>
                    {transaction.reconciledAt && (
                        <div>
                            <p className="text-xs text-slate-600 font-semibold">Date de Rapprochement</p>
                            <p className="text-sm">{formatDate(transaction.reconciledAt)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Box */}
            <div className="mt-8 p-4 bg-slate-50 border border-slate-300 rounded">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-600">Opération du</p>
                        <p className="text-sm font-semibold">{formatDate(transaction.date)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-600">Montant</p>
                        <p className={`text-xl font-bold ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {formatCurrency(transaction.amount)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Signature Space */}
            <div className="mt-12 pt-6 border-t-2 border-slate-300">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-sm font-semibold mb-4">Le Comptable</p>
                        <div className="h-20 border-b border-slate-400"></div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold mb-4">Le Notaire</p>
                        <div className="h-20 border-b border-slate-400"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
