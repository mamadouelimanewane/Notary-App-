"use client";

import { ArrowDownLeft, ArrowUpRight, Edit } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { formatCurrency, formatDate } from "@/lib/format";
import SearchBar from "@/components/SearchBar";
import FilterSelect from "@/components/FilterSelect";
import SortDropdown, { SortOption } from "@/components/SortDropdown";
import PrintButton from "@/components/PrintButton";
import PrintTransactionList from "@/components/print/PrintTransactionList";

interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    description: string;
    dossierId: string;
    bankTransactionId?: string;
    reconciled: boolean;
    reconciledAt?: string;
}

interface Dossier {
    id: string;
    ref: string;
    title: string;
}

interface ComptabilitePageClientProps {
    transactions: Transaction[];
    dossiers: Dossier[];
}

export default function ComptabilitePageClient({ transactions, dossiers }: ComptabilitePageClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedReconciled, setSelectedReconciled] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    const getDossierRef = (dossierId: string) => {
        const dossier = dossiers.find((d) => d.id === dossierId);
        return dossier ? dossier.ref : "Inconnu";
    };

    const typeOptions = [
        { label: 'Crédit (Recette)', value: 'CREDIT' },
        { label: 'Débit (Dépense)', value: 'DEBIT' }
    ];

    const reconciledOptions = [
        { label: 'Rapproché', value: 'true' },
        { label: 'Non rapproché', value: 'false' }
    ];

    const sortOptions: SortOption[] = [
        { label: 'Date', field: 'date' },
        { label: 'Montant', field: 'amount' },
        { label: 'Description', field: 'description' },
        { label: 'Type', field: 'type' }
    ];

    // Filter and sort transactions
    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.description.toLowerCase().includes(query) ||
                getDossierRef(t.dossierId).toLowerCase().includes(query)
            );
        }

        // Apply type filter
        if (selectedTypes.length > 0) {
            result = result.filter(t => selectedTypes.includes(t.type));
        }

        // Apply reconciled filter
        if (selectedReconciled.length > 0) {
            result = result.filter(t => {
                const isReconciled = t.reconciled ? 'true' : 'false';
                return selectedReconciled.includes(isReconciled);
            });
        }

        // Apply date range filter
        if (dateRange.start) {
            result = result.filter(t => t.date >= dateRange.start);
        }
        if (dateRange.end) {
            result = result.filter(t => t.date <= dateRange.end);
        }

        // Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.field as keyof typeof a];
                let bVal = b[sortConfig.field as keyof typeof b];

                // Handle date sorting
                if (sortConfig.field === 'date') {
                    aVal = new Date(aVal as string).getTime();
                    bVal = new Date(bVal as string).getTime();
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [transactions, searchQuery, selectedTypes, selectedReconciled, dateRange, sortConfig, dossiers]);

    // Calculate statistics on filtered data
    const totalCredit = filteredTransactions
        .filter((t) => t.type === "CREDIT")
        .reduce((acc, t) => acc + t.amount, 0);

    const totalDebit = filteredTransactions
        .filter((t) => t.type === "DEBIT")
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalCredit - totalDebit;

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Solde Global</h3>
                    </div>
                    <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(balance)}
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Crédit</h3>
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(totalCredit)}
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Débit</h3>
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(totalDebit)}
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg border p-4 space-y-4">
                <SearchBar
                    placeholder="Rechercher par description ou dossier..."
                    onSearch={setSearchQuery}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FilterSelect
                        label="Type d'opération"
                        options={typeOptions}
                        selectedValues={selectedTypes}
                        onChange={setSelectedTypes}
                        multiSelect
                    />

                    <FilterSelect
                        label="Rapprochement"
                        options={reconciledOptions}
                        selectedValues={selectedReconciled}
                        onChange={setSelectedReconciled}
                        multiSelect
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Période</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Début"
                            />
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Fin"
                            />
                        </div>
                    </div>
                </div>

                <SortDropdown
                    options={sortOptions}
                    currentSort={sortConfig}
                    onSort={(field, direction) => setSortConfig({ field, direction })}
                />
            </div>

            {/* Results Summary and Print Button */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                    {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''} trouvée{filteredTransactions.length > 1 ? 's' : ''}
                </div>
                <PrintButton
                    label="Imprimer la liste"
                    variant="outline"
                    onBeforePrint={() => setShowPrintPreview(true)}
                />
            </div>

            {/* Print Preview (hidden on screen, visible when printing) */}
            {showPrintPreview && (
                <div className="print-container hidden" data-print="show">
                    <PrintTransactionList
                        transactions={filteredTransactions}
                        statistics={{ balance, totalCredit, totalDebit }}
                        filters={{
                            types: selectedTypes,
                            reconciled: selectedReconciled,
                            dateRange,
                            searchQuery
                        }}
                        dossiers={dossiers}
                    />
                </div>
            )}

            {/* Transactions Table */}
            <div className="rounded-md border bg-white">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dossier</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Montant</th>
                                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Rapproché</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredTransactions.map((t) => (
                                <tr key={t.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle">{formatDate(t.date)}</td>
                                    <td className="p-4 align-middle">{t.description}</td>
                                    <td className="p-4 align-middle font-medium">{getDossierRef(t.dossierId)}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${t.type === 'CREDIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className={`p-4 align-middle text-right font-bold ${t.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(t.amount)}
                                    </td>
                                    <td className="p-4 align-middle text-center">
                                        {t.reconciled ? (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">✓</span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Link
                                            href={`/dashboard/comptabilite/${t.id}`}
                                            className="text-slate-900 hover:underline inline-flex items-center"
                                        >
                                            <Edit className="mr-1 h-3 w-3" />
                                            Voir
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                                        Aucune transaction trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
