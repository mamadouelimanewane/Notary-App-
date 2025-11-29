"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { CashTransactionType, CashTransactionCategory } from "@/types/treasury";
import { toast } from "@/components/ui/use-toast";

interface NewCashTransactionModalProps {
    onTransactionAdded: () => void;
}

export function NewCashTransactionModal({ onTransactionAdded }: NewCashTransactionModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "IN" as CashTransactionType,
        amount: "",
        description: "",
        category: "HONORAIRES" as CashTransactionCategory,
        reference: "",
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/treasury/cash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
                    currency: 'XOF'
                })
            });

            if (!response.ok) throw new Error('Erreur lors de la création');

            toast({
                title: "Transaction enregistrée",
                description: "Le mouvement de caisse a été ajouté avec succès."
            });
            setOpen(false);
            onTransactionAdded();
            // Reset form
            setFormData({
                type: "IN",
                amount: "",
                description: "",
                category: "HONORAIRES",
                reference: "",
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible d'enregistrer la transaction.",
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
                    Nouvelle Opération
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Mouvement de Caisse</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(v: CashTransactionType) => setFormData({ ...formData, type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IN">Entrée (Encaissement)</SelectItem>
                                    <SelectItem value="OUT">Sortie (Décaissement)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
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
                    </div>

                    <div className="space-y-2">
                        <Label>Catégorie</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(v: CashTransactionCategory) => setFormData({ ...formData, category: v })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HONORAIRES">Honoraires</SelectItem>
                                <SelectItem value="DEBOURS">Débours</SelectItem>
                                <SelectItem value="PROVISION">Provision Dossier</SelectItem>
                                <SelectItem value="RESTITUTION">Restitution Client</SelectItem>
                                <SelectItem value="AUTRE">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Motif du mouvement..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Référence (Reçu N°)</Label>
                        <Input
                            placeholder="Ex: REC-001"
                            value={formData.reference}
                            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
