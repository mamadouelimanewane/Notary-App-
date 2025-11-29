'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { TaxDefinition, TaxType } from '@/lib/taxation/types';
import { Account } from '@/lib/accounting/types';

export default function TaxesPageClient() {
    const [taxes, setTaxes] = useState<TaxDefinition[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTax, setEditingTax] = useState<TaxDefinition | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<TaxDefinition>>({
        code: '',
        label: '',
        rate: 0,
        type: 'PERCENTAGE',
        accountCode: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [taxesRes, accountsRes] = await Promise.all([
                fetch('/api/taxation/taxes'),
                fetch('/api/accounting/accounts')
            ]);

            if (taxesRes.ok) setTaxes(await taxesRes.json());
            if (accountsRes.ok) setAccounts(await accountsRes.json());
        } catch (error) {
            console.error(error);
            toast({ title: "Erreur", description: "Impossible de charger les données.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (tax?: TaxDefinition) => {
        if (tax) {
            setEditingTax(tax);
            setFormData(tax);
        } else {
            setEditingTax(null);
            setFormData({
                code: '',
                label: '',
                rate: 0,
                type: 'PERCENTAGE',
                accountCode: '',
                description: ''
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const url = '/api/taxation/taxes';
            const method = editingTax ? 'PUT' : 'POST';
            const body = editingTax ? { ...formData, id: editingTax.id } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error('Failed to save tax');

            toast({ title: "Succès", description: "Taxe enregistrée avec succès." });
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            console.error(error);
            toast({ title: "Erreur", description: "Erreur lors de l'enregistrement.", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette taxe ?")) return;

        try {
            const res = await fetch(`/api/taxation/taxes?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast({ title: "Succès", description: "Taxe supprimée." });
            fetchData();
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de supprimer la taxe.", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Configuration des Taxes</h2>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" /> Nouvelle Taxe
                </Button>
            </div>

            <div className="bg-white rounded-md border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Libellé</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Taux / Montant</TableHead>
                            <TableHead>Compte Comptable</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {taxes.map((tax) => (
                            <TableRow key={tax.id}>
                                <TableCell className="font-medium">{tax.code}</TableCell>
                                <TableCell>{tax.label}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                        {tax.type === 'PERCENTAGE' ? 'Pourcentage' : tax.type === 'FIXED' ? 'Fixe' : 'Barème'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {tax.type === 'PERCENTAGE' ? `${tax.rate}%` : tax.type === 'FIXED' ? `${tax.rate} FCFA` : 'Selon Barème'}
                                </TableCell>
                                <TableCell>
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                        {tax.accountCode}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-500">
                                        {accounts.find(a => a.code === tax.accountCode)?.label}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(tax)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(tax.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {taxes.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    Aucune taxe configurée.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTax ? 'Modifier la Taxe' : 'Nouvelle Taxe'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Code (ex: TVA)</Label>
                                <Input
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="TVA"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(v: TaxType) => setFormData({ ...formData, type: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PERCENTAGE">Pourcentage (%)</SelectItem>
                                        <SelectItem value="FIXED">Montant Fixe</SelectItem>
                                        <SelectItem value="SCALE">Barème Progressif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Libellé</Label>
                            <Input
                                value={formData.label}
                                onChange={e => setFormData({ ...formData, label: e.target.value })}
                                placeholder="Taxe sur la Valeur Ajoutée"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{formData.type === 'PERCENTAGE' ? 'Taux (%)' : 'Montant'}</Label>
                            <Input
                                type="number"
                                value={formData.rate}
                                onChange={e => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Compte Comptable (Tiers ou État)</Label>
                            <Select
                                value={formData.accountCode}
                                onValueChange={v => setFormData({ ...formData, accountCode: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un compte..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts
                                        .filter(a => a.code.startsWith('44')) // Filter for State/Tax accounts
                                        .map(account => (
                                            <SelectItem key={account.code} value={account.code}>
                                                {account.code} - {account.label}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">Filtre sur les comptes de classe 44 (État et collectivités publiques)</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleSubmit}>Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
