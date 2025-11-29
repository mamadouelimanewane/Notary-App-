'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Book } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import type { Journal, JournalType } from '@/lib/accounting/types';

interface JournauxPageClientProps {
    initialJournals: Journal[];
}

export default function JournauxPageClient({ initialJournals }: JournauxPageClientProps) {
    const [journals, setJournals] = useState<Journal[]>(initialJournals);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);

    const [formData, setFormData] = useState({
        code: '',
        label: '',
        type: 'OPERATIONS' as JournalType
    });

    const journalTypes: { code: JournalType; label: string }[] = [
        { code: 'ACHATS', label: 'Achats' },
        { code: 'VENTES', label: 'Ventes' },
        { code: 'BANQUE', label: 'Banque' },
        { code: 'CAISSE', label: 'Caisse' },
        { code: 'OPERATIONS', label: 'Opérations Diverses' },
        { code: 'NOUVEAU', label: 'À Nouveaux' },
    ];

    const handleCreate = async () => {
        try {
            const res = await fetch('/api/accounting/journals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.status === 409) {
                toast({ title: "Erreur", description: "Ce code journal existe déjà.", variant: "destructive" });
                return;
            }

            if (!res.ok) throw new Error('Erreur création');

            const newJournal = await res.json();
            setJournals([...journals, newJournal]);
            setIsCreateOpen(false);
            setFormData({ code: '', label: '', type: 'OPERATIONS' });
            toast({ title: "Succès", description: "Journal créé avec succès." });
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de créer le journal.", variant: "destructive" });
        }
    };

    const handleUpdate = async () => {
        if (!selectedJournal) return;
        try {
            const res = await fetch('/api/accounting/journals', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedJournal.id,
                    code: formData.code,
                    label: formData.label,
                    type: formData.type
                })
            });

            if (!res.ok) throw new Error('Erreur mise à jour');

            const updatedJournal = await res.json();
            setJournals(journals.map(j => j.id === updatedJournal.id ? updatedJournal : j));
            setIsEditOpen(false);
            toast({ title: "Succès", description: "Journal mis à jour." });
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de mettre à jour le journal.", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce journal ?")) return;

        try {
            const res = await fetch(`/api/accounting/journals?id=${id}`, {
                method: 'DELETE'
            });

            if (res.status === 409) {
                toast({ title: "Impossible", description: "Ce journal contient des écritures.", variant: "destructive" });
                return;
            }

            if (!res.ok) throw new Error('Erreur suppression');

            setJournals(journals.filter(j => j.id !== id));
            toast({ title: "Succès", description: "Journal supprimé." });
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de supprimer le journal.", variant: "destructive" });
        }
    };

    const openEdit = (journal: Journal) => {
        setSelectedJournal(journal);
        setFormData({
            code: journal.code,
            label: journal.label,
            type: journal.type
        });
        setIsEditOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Journaux Comptables</h2>
                    <p className="text-sm text-gray-500">Gérez vos journaux auxiliaires</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Nouveau Journal
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {journals.map((journal) => (
                    <div key={journal.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Book className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => window.location.href = `/dashboard/comptabilite/journaux/${journal.id}`} title="Voir les écritures">
                                    <Book className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openEdit(journal)}>
                                    <Edit className="h-4 w-4 text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(journal.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{journal.label}</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                                {journal.code}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {journalTypes.find(t => t.code === journal.type)?.label || journal.type}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            {/* Placeholder for stats if needed */}
                            Statut: {journal.isActive ? 'Actif' : 'Inactif'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Dialog Création */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nouveau Journal</DialogTitle>
                        <DialogDescription>Créer un nouveau journal auxiliaire.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Code</Label>
                            <Input
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                maxLength={5}
                                placeholder="Ex: ACH"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Libellé</Label>
                            <Input
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                placeholder="Ex: Journal des Achats"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(v) => setFormData({ ...formData, type: v as JournalType })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {journalTypes.map(t => (
                                        <SelectItem key={t.code} value={t.code}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreate}>Créer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Modification */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier Journal</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Code</Label>
                            <Input
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Libellé</Label>
                            <Input
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(v) => setFormData({ ...formData, type: v as JournalType })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {journalTypes.map(t => (
                                        <SelectItem key={t.code} value={t.code}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdate}>Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
