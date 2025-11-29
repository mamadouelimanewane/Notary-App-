"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { BankAccount } from "@/types/treasury";

interface NewTransferModalProps {
    accounts: BankAccount[];
    onTransferCreated: () => void;
}

export function NewTransferModal({ accounts, onTransferCreated }: NewTransferModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [solvencyCheck, setSolvencyCheck] = useState<{ solvent: boolean; message?: string } | null>(null);
    const [formData, setFormData] = useState({
        fromAccountId: "",
        toAccountId: "",
        amount: "",
        description: "",
        reference: "",
        date: new Date().toISOString().split('T')[0]
    });

    // Check solvency when amount or from account changes
    useEffect(() => {
        if (formData.fromAccountId && formData.amount && parseFloat(formData.amount) > 0) {
            checkSolvency();
        } else {
            setSolvencyCheck(null);
        }
    }, [formData.fromAccountId, formData.amount]);

    const checkSolvency = async () => {
        try {
            const response = await fetch('/api/treasury/check-solvency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountId: formData.fromAccountId,
                    amount: parseFloat(formData.amount)
                })
            });
            const result = await response.json();
            setSolvencyCheck(result);
        } catch (error) {
            console.error('Solvency check failed:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!solvencyCheck?.solvent) {
            toast({
                title: "Provision insuffisante",
                description: solvencyCheck?.message || "Le solde du compte est insuffisant.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/treasury/transfers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
                    currency: accounts.find(a => a.id === formData.fromAccountId)?.currency || 'XOF'
                })
            });

            if (!response.ok) throw new Error('Erreur lors de la création');

            toast({
                title: "Virement créé",
                description: "Le virement a été enregistré en brouillon."
            });
            setOpen(false);
            onTransferCreated();
            // Reset form
            setFormData({
                fromAccountId: "",
                toAccountId: "",
                amount: "",
                description: "",
                reference: "",
                date: new Date().toISOString().split('T')[0]
            });
            setSolvencyCheck(null);
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de créer le virement.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Virement
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Créer un Virement</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Compte Débiteur</Label>
                            <Select
                                value={formData.fromAccountId}
                                onValueChange={(v) => setFormData({ ...formData, fromAccountId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.map(acc => (
                                        <SelectItem key={acc.id} value={acc.id}>
                                            {acc.name} ({acc.balance.toLocaleString()} {acc.currency})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Compte Créditeur</Label>
                            <Select
                                value={formData.toAccountId}
                                onValueChange={(v) => setFormData({ ...formData, toAccountId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.filter(a => a.id !== formData.fromAccountId).map(acc => (
                                        <SelectItem key={acc.id} value={acc.id}>
                                            {acc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Montant (FCFA)</Label>
                        <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                        {solvencyCheck && !solvencyCheck.solvent && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                <AlertTriangle className="h-4 w-4" />
                                {solvencyCheck.message}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Motif du virement..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Référence</Label>
                        <Input
                            placeholder="Ex: VIR-001"
                            value={formData.reference}
                            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                        <Button type="submit" disabled={loading || (solvencyCheck && !solvencyCheck.solvent)}>
                            {loading ? "Création..." : "Créer le virement"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
