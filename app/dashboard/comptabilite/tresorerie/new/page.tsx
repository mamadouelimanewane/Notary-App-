'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Wallet, Building2, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewTreasuryMovementPage() {
    const router = useRouter();
    const [movementType, setMovementType] = useState<'BANK' | 'CASH' | 'TRANSFER'>('BANK');
    const [operationType, setOperationType] = useState<'ENCAISSEMENT' | 'DECAISSEMENT'>('ENCAISSEMENT');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/api/treasury/movements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    movementType,
                    operationType,
                    date: formData.get('date'),
                    amount: parseFloat(formData.get('amount') as string),
                    accountCode: formData.get('accountCode'),
                    accountLabel: formData.get('accountLabel'),
                    label: formData.get('label'),
                    reference: formData.get('reference'),
                    dossierId: formData.get('dossierId') || undefined,
                    // Pour les virements internes
                    from: formData.get('from'),
                    to: formData.get('to'),
                })
            });

            if (response.ok) {
                router.push('/dashboard/comptabilite/tresorerie');
            } else {
                alert('Erreur lors de l\'enregistrement');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link
                    href="/dashboard/comptabilite/tresorerie"
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Nouveau Mouvement de Trésorerie</h1>
                    <p className="text-slate-600 mt-1">Enregistrer un mouvement de banque ou de caisse</p>
                </div>
            </div>

            {/* Type Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Type de Mouvement</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            type="button"
                            onClick={() => setMovementType('BANK')}
                            className={`p-4 border-2 rounded-lg transition-all ${movementType === 'BANK'
                                    ? 'border-slate-900 bg-slate-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <Building2 className={`h-8 w-8 mx-auto mb-2 ${movementType === 'BANK' ? 'text-slate-900' : 'text-slate-400'
                                }`} />
                            <div className="text-center font-medium">Banque</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMovementType('CASH')}
                            className={`p-4 border-2 rounded-lg transition-all ${movementType === 'CASH'
                                    ? 'border-slate-900 bg-slate-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <Wallet className={`h-8 w-8 mx-auto mb-2 ${movementType === 'CASH' ? 'text-slate-900' : 'text-slate-400'
                                }`} />
                            <div className="text-center font-medium">Caisse</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMovementType('TRANSFER')}
                            className={`p-4 border-2 rounded-lg transition-all ${movementType === 'TRANSFER'
                                    ? 'border-slate-900 bg-slate-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <ArrowRightLeft className={`h-8 w-8 mx-auto mb-2 ${movementType === 'TRANSFER' ? 'text-slate-900' : 'text-slate-400'
                                }`} />
                            <div className="text-center font-medium">Virement Interne</div>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Détails du Mouvement</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Date */}
                        <div className="space-y-2">
                            <label htmlFor="date" className="text-sm font-medium">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                required
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        {movementType === 'TRANSFER' ? (
                            <>
                                {/* Virement Interne */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="from" className="text-sm font-medium">
                                            De <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="from"
                                            name="from"
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="BANK">Banque</option>
                                            <option value="CASH">Caisse</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="to" className="text-sm font-medium">
                                            Vers <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="to"
                                            name="to"
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="CASH">Caisse</option>
                                            <option value="BANK">Banque</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Encaissement / Décaissement */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Type d'Opération <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="operationType"
                                                value="ENCAISSEMENT"
                                                checked={operationType === 'ENCAISSEMENT'}
                                                onChange={(e) => setOperationType(e.target.value as any)}
                                                className="h-4 w-4"
                                            />
                                            <span>Encaissement (Entrée)</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="operationType"
                                                value="DECAISSEMENT"
                                                checked={operationType === 'DECAISSEMENT'}
                                                onChange={(e) => setOperationType(e.target.value as any)}
                                                className="h-4 w-4"
                                            />
                                            <span>Décaissement (Sortie)</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Compte de contrepartie */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="accountCode" className="text-sm font-medium">
                                            Compte <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="accountCode"
                                            name="accountCode"
                                            required
                                            placeholder="Ex: 411, 401, 606"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="accountLabel" className="text-sm font-medium">
                                            Libellé du Compte <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="accountLabel"
                                            name="accountLabel"
                                            required
                                            placeholder="Ex: Clients, Fournisseurs"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Montant */}
                        <div className="space-y-2">
                            <label htmlFor="amount" className="text-sm font-medium">
                                Montant (FCFA) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                required
                                min="0"
                                step="1"
                                placeholder="0"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Libellé */}
                        <div className="space-y-2">
                            <label htmlFor="label" className="text-sm font-medium">
                                Libellé <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="label"
                                name="label"
                                required
                                placeholder="Description du mouvement"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Référence */}
                        <div className="space-y-2">
                            <label htmlFor="reference" className="text-sm font-medium">
                                Référence
                            </label>
                            <input
                                type="text"
                                id="reference"
                                name="reference"
                                placeholder="Numéro de chèque, virement, etc."
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Dossier (optionnel) */}
                        <div className="space-y-2">
                            <label htmlFor="dossierId" className="text-sm font-medium">
                                Dossier Associé (optionnel)
                            </label>
                            <input
                                type="text"
                                id="dossierId"
                                name="dossierId"
                                placeholder="ID du dossier"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
