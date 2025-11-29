"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { BankAccountType } from "@/types/treasury";
import { toast } from "@/components/ui/use-toast";

interface NewBankAccountModalProps {
    onAccountAdded: () => void;
}

export function NewBankAccountModal({ onAccountAdded }: NewBankAccountModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        bankName: "",
        accountNumber: "",
        iban: "",
        bic: "",
        currency: "XOF",
        type: "OFFICE" as BankAccountType,
        glAccount: "512100"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/treasury/bank-accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Erreur lors de la création');

            toast({
                title: "Compte créé",
                description: "Le compte bancaire a été ajouté avec succès."
            });
            setOpen(false);
            onAccountAdded();
            // Reset form
            setFormData({
                name: "",
                bankName: "",
                accountNumber: "",
                iban: "",
                bic: "",
                currency: "XOF",
                type: "OFFICE",
                glAccount: "512100"
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de créer le compte.",
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
                    Nouveau Compte
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un Compte Bancaire</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>Nom du Compte (Interne)</Label>
                        <Input
                            placeholder="Ex: Compte Principal SGBS"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Banque</Label>
                            <Input
                                placeholder="Ex: SGBS"
                                value={formData.bankName}
                                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(v: BankAccountType) => setFormData({ ...formData, type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OFFICE">Compte Office</SelectItem>
                                    <SelectItem value="CLIENT">Compte Client (CDC)</SelectItem>
                                    <SelectItem value="BLOCKED">Compte Séquestre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Numéro de Compte</Label>
                        <Input
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>IBAN</Label>
                        <Input
                            value={formData.iban}
                            onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>BIC / SWIFT</Label>
                            <Input
                                value={formData.bic}
                                onChange={(e) => setFormData({ ...formData, bic: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Compte Comptable</Label>
                            <Input
                                value={formData.glAccount}
                                onChange={(e) => setFormData({ ...formData, glAccount: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Création..." : "Créer le compte"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
