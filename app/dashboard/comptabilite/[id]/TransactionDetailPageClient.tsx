"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Edit2, Trash2, Save, X, Check } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";
import PrintButton from "@/components/PrintButton";
import PrintTransactionDetail from "@/components/print/PrintTransactionDetail";

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

interface TransactionDetailPageClientProps {
    transaction: Transaction;
    dossiers: Dossier[];
}

export default function TransactionDetailPageClient({ transaction: initialTransaction, dossiers }: TransactionDetailPageClientProps) {
    const router = useRouter();
    const [transaction, setTransaction] = useState(initialTransaction);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialTransaction);
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) : value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/transactions/${transaction.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update transaction');

            const updatedTransaction = await response.json();
            setTransaction(updatedTransaction);
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert('Erreur lors de la mise à jour de la transaction');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/transactions/${transaction.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete transaction');

            router.push('/dashboard/comptabilite');
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Erreur lors de la suppression de la transaction');
        }
    };

    const handleToggleReconciled = async () => {
        const newReconciled = !transaction.reconciled;
        try {
            const response = await fetch(`/api/transactions/${transaction.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reconciled: newReconciled,
                    reconciledAt: newReconciled ? new Date().toISOString() : undefined
                }),
            });

            if (!response.ok) throw new Error('Failed to update reconciliation');

            const updatedTransaction = await response.json();
            setTransaction(updatedTransaction);
            setFormData(updatedTransaction);
            router.refresh();
        } catch (error) {
            console.error('Error updating reconciliation:', error);
            alert('Erreur lors de la mise à jour du rapprochement');
        }
    };

    const handleCancel = () => {
        setFormData(transaction);
        setIsEditing(false);
    };

    const dossier = dossiers.find(d => d.id === transaction.dossierId);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/comptabilite" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">{transaction.description}</h1>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${transaction.type === 'CREDIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {transaction.type}
                    </span>
                </div>

                <div className="flex gap-2">
                    {!isEditing ? (
                        <>
                            <PrintButton
                                label="Imprimer"
                                variant="outline"
                                onBeforePrint={() => setShowPrintPreview(true)}
                            />
                            <button
                                onClick={handleToggleReconciled}
                                className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 ${transaction.reconciled
                                        ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                <Check className="mr-2 h-4 w-4" />
                                {transaction.reconciled ? 'Marquer non rapproché' : 'Marquer rapproché'}
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800"
                            >
                                <Edit2 className="mr-2 h-4 w-4" /> Modifier
                            </button>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-red-600 text-white hover:bg-red-700"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                            >
                                <Save className="mr-2 h-4 w-4" /> Enregistrer
                            </button>
                            <button
                                onClick={handleCancel}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-slate-200 text-slate-900 hover:bg-slate-300"
                            >
                                <X className="mr-2 h-4 w-4" /> Annuler
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Transaction Information */}
            <div className="rounded-xl border bg-white shadow p-6 space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Détails de l'Opération</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Date</label>
                        {isEditing ? (
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        ) : (
                            <p className="text-sm">{formatDate(transaction.date)}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Type</label>
                        {isEditing ? (
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="CREDIT">Crédit (Recette)</option>
                                <option value="DEBIT">Débit (Dépense)</option>
                            </select>
                        ) : (
                            <p className="text-sm">{transaction.type === 'CREDIT' ? 'Crédit (Recette)' : 'Débit (Dépense)'}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    ) : (
                        <p className="text-sm">{transaction.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Montant</label>
                        {isEditing ? (
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                step="1"
                                min="0"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        ) : (
                            <p className={`text-sm font-bold ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(transaction.amount)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Dossier Associé</label>
                        {isEditing ? (
                            <select
                                name="dossierId"
                                value={formData.dossierId}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                {dossiers.map(d => (
                                    <option key={d.id} value={d.id}>{d.ref} - {d.title}</option>
                                ))}
                            </select>
                        ) : (
                            <Link href={`/dashboard/dossiers/${dossier?.id}`} className="text-sm text-blue-600 hover:underline">
                                {dossier ? `${dossier.ref} - ${dossier.title}` : 'Inconnu'}
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Statut de Rapprochement</label>
                        <p className="text-sm">
                            {transaction.reconciled ? (
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                    Rapproché
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-800">
                                    Non rapproché
                                </span>
                            )}
                        </p>
                    </div>

                    {transaction.reconciledAt && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Date de Rapprochement</label>
                            <p className="text-sm">{formatDate(transaction.reconciledAt)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Print Preview (hidden on screen, visible when printing) */}
            {showPrintPreview && (
                <div className="print-container hidden" data-print="show">
                    <PrintTransactionDetail
                        transaction={transaction}
                        dossier={dossier || null}
                    />
                </div>
            )}
        </div>
    );
}
