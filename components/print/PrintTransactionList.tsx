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
}

interface Dossier {
    id: string;
    ref: string;
    title: string;
}

interface PrintTransactionListProps {
    transactions: Transaction[];
    statistics: {
        balance: number;
        totalCredit: number;
        totalDebit: number;
    };
    filters?: {
        types?: string[];
        reconciled?: string[];
        dateRange?: { start: string; end: string };
        searchQuery?: string;
    };
    dossiers: Dossier[];
}

export default function PrintTransactionList({ transactions, statistics, filters, dossiers }: PrintTransactionListProps) {
    const hasFilters = filters && (
        (filters.types && filters.types.length > 0) ||
        (filters.reconciled && filters.reconciled.length > 0) ||
        (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) ||
        (filters.searchQuery && filters.searchQuery.length > 0)
    );

    const getDossierRef = (dossierId: string) => {
        const dossier = dossiers.find(d => d.id === dossierId);
        return dossier ? dossier.ref : "Inconnu";
    };

    return (
        <div className="print-container p-8">
            <PrintHeader
                title="Journal Comptable"
                subtitle={`${transactions.length} transaction${transactions.length > 1 ? 's' : ''}`}
            />

            {/* Statistics Summary */}
            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded grid grid-cols-3 gap-4">
                <div>
                    <p className="text-xs text-slate-600 font-semibold">Solde Global</p>
                    <p className={`text-lg font-bold ${statistics.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(statistics.balance)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-600 font-semibold">Total Crédit</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(statistics.totalCredit)}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-600 font-semibold">Total Débit</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(statistics.totalDebit)}</p>
                </div>
            </div>

            {/* Filtres appliqués */}
            {hasFilters && (
                <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded">
                    <h3 className="text-sm font-semibold mb-2">Filtres appliqués :</h3>
                    <div className="text-xs text-slate-600">
                        {filters.searchQuery && (
                            <p>• Recherche : {filters.searchQuery}</p>
                        )}
                        {filters.types && filters.types.length > 0 && (
                            <p>• Type : {filters.types.join(', ')}</p>
                        )}
                        {filters.reconciled && filters.reconciled.length > 0 && (
                            <p>• Rapprochement : {filters.reconciled.map(r => r === 'true' ? 'Rapproché' : 'Non rapproché').join(', ')}</p>
                        )}
                        {filters.dateRange && (filters.dateRange.start || filters.dateRange.end) && (
                            <p>• Période : {filters.dateRange.start || '...'} - {filters.dateRange.end || '...'}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Tableau des transactions */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-slate-900">
                        <th className="text-left py-2 px-2 font-semibold text-sm">Date</th>
                        <th className="text-left py-2 px-2 font-semibold text-sm">Description</th>
                        <th className="text-left py-2 px-2 font-semibold text-sm">Dossier</th>
                        <th className="text-center py-2 px-2 font-semibold text-sm">Type</th>
                        <th className="text-right py-2 px-2 font-semibold text-sm">Montant</th>
                        <th className="text-center py-2 px-2 font-semibold text-sm">Rapp.</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr
                            key={transaction.id}
                            className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                        >
                            <td className="py-2 px-2 text-sm">{formatDate(transaction.date)}</td>
                            <td className="py-2 px-2 text-sm">{transaction.description}</td>
                            <td className="py-2 px-2 text-sm">{getDossierRef(transaction.dossierId)}</td>
                            <td className="py-2 px-2 text-sm text-center">
                                {transaction.type === 'CREDIT' ? 'C' : 'D'}
                            </td>
                            <td className={`py-2 px-2 text-sm text-right font-medium ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {formatCurrency(transaction.amount)}
                            </td>
                            <td className="py-2 px-2 text-sm text-center">
                                {transaction.reconciled ? '✓' : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-slate-300">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold">Total transactions : {transactions.length}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">Solde final : <span className={statistics.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(statistics.balance)}
                        </span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
