'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronRight, ChevronDown, Info, Edit, Trash2, BookOpen, Plus, Save } from 'lucide-react';
import type { Account, AccountClass } from '@/lib/accounting/types';
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
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import AccountLedger from './AccountLedger';

interface PlanComptableClientProps {
    initialAccounts: Account[];
}

export default function PlanComptableClient({ initialAccounts }: PlanComptableClientProps) {
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('ALL');
    const [expandedClasses, setExpandedClasses] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8']);

    // State for Dialogs
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLedgerOpen, setIsLedgerOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        label: '',
        classCode: '1',
        type: 'ACTIF',
        description: ''
    });

    // Classes OHADA
    const classes: { code: string; label: string; color: string }[] = [
        { code: '1', label: 'Ressources durables', color: 'bg-blue-100 text-blue-800' },
        { code: '2', label: 'Actif immobilisé', color: 'bg-indigo-100 text-indigo-800' },
        { code: '3', label: 'Stocks', color: 'bg-green-100 text-green-800' },
        { code: '4', label: 'Tiers', color: 'bg-yellow-100 text-yellow-800' },
        { code: '5', label: 'Trésorerie', color: 'bg-emerald-100 text-emerald-800' },
        { code: '6', label: 'Charges', color: 'bg-red-100 text-red-800' },
        { code: '7', label: 'Produits', color: 'bg-teal-100 text-teal-800' },
        { code: '8', label: 'Comptes spéciaux', color: 'bg-gray-100 text-gray-800' },
    ];

    // Filtrage des comptes
    const filteredAccounts = useMemo(() => {
        return accounts.filter(account => {
            const matchesSearch =
                account.code.includes(searchQuery) ||
                account.label.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesClass = selectedClass === 'ALL' || account.classCode === selectedClass;

            return matchesSearch && matchesClass;
        });
    }, [accounts, searchQuery, selectedClass]);

    // Groupement par classe pour l'affichage
    const accountsByClass = useMemo(() => {
        const grouped: Record<string, Account[]> = {};
        classes.forEach(c => grouped[c.code] = []);

        filteredAccounts.forEach(account => {
            if (grouped[account.classCode]) {
                grouped[account.classCode].push(account);
            }
        });

        // Trier les comptes par code dans chaque classe
        Object.keys(grouped).forEach(key => {
            grouped[key].sort((a, b) => a.code.localeCompare(b.code));
        });

        return grouped;
    }, [filteredAccounts, classes]);

    const toggleClass = (classCode: string) => {
        setExpandedClasses(prev =>
            prev.includes(classCode)
                ? prev.filter(c => c !== classCode)
                : [...prev, classCode]
        );
    };

    // Actions
    const handleCreate = async () => {
        try {
            const res = await fetch('/api/accounting/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Erreur lors de la création');

            const newAccount = await res.json();
            setAccounts([...accounts, newAccount]);
            setIsCreateOpen(false);
            setFormData({ code: '', label: '', classCode: '1', type: 'ACTIF', description: '' });
            toast({ title: "Compte créé", description: `Le compte ${newAccount.code} a été créé.` });
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de créer le compte.", variant: "destructive" });
        }
    };

    const handleUpdate = async () => {
        if (!selectedAccount) return;
        try {
            const res = await fetch('/api/accounting/accounts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: selectedAccount.code,
                    label: formData.label,
                    description: formData.description
                })
            });

            if (!res.ok) throw new Error('Erreur lors de la mise à jour');

            const updatedAccount = await res.json();
            setAccounts(accounts.map(a => a.code === updatedAccount.code ? updatedAccount : a));
            setIsEditOpen(false);
            toast({ title: "Compte mis à jour", description: `Le compte ${updatedAccount.code} a été modifié.` });
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de mettre à jour le compte.", variant: "destructive" });
        }
    };

    const handleDelete = async (code: string) => {
        if (!confirm(`Voulez-vous vraiment supprimer le compte ${code} ?`)) return;

        try {
            const res = await fetch(`/api/accounting/accounts?code=${code}`, {
                method: 'DELETE'
            });

            if (res.status === 409) {
                toast({ title: "Impossible", description: "Ce compte contient des écritures.", variant: "destructive" });
                return;
            }

            if (!res.ok) throw new Error('Erreur lors de la suppression');

            setAccounts(accounts.filter(a => a.code !== code));
            toast({ title: "Compte supprimé", description: `Le compte ${code} a été supprimé.` });
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de supprimer le compte.", variant: "destructive" });
        }
    };

    const openEdit = (account: Account) => {
        setSelectedAccount(account);
        setFormData({
            code: account.code,
            label: account.label,
            classCode: account.classCode,
            type: account.type,
            description: account.description || ''
        });
        setIsEditOpen(true);
    };

    const openLedger = (account: Account) => {
        setSelectedAccount(account);
        setIsLedgerOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* En-tête et Recherche */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Rechercher un compte (ex: 411, Clients)..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-gold focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button onClick={() => setIsCreateOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="h-4 w-4 mr-2" /> Nouveau Compte
                    </Button>
                </div>
            </div>

            {/* Liste des comptes */}
            <div className="space-y-6">
                {classes.map((cls) => {
                    const classAccounts = accountsByClass[cls.code] || [];
                    if (classAccounts.length === 0 && searchQuery) return null;

                    const isExpanded = expandedClasses.includes(cls.code);

                    return (
                        <div key={cls.code} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* En-tête de classe */}
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => toggleClass(cls.code)}
                            >
                                <div className="flex items-center gap-3">
                                    <button className="p-1 hover:bg-gray-200 rounded-full">
                                        {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
                                    </button>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls.color}`}>
                                        Classe {cls.code}
                                    </span>
                                    <h3 className="font-semibold text-gray-900">{cls.label}</h3>
                                    <span className="text-sm text-gray-500">({classAccounts.length} comptes)</span>
                                </div>
                            </div>

                            {/* Liste des comptes de la classe */}
                            {isExpanded && (
                                <div className="border-t border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Compte</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libellé</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Type</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Nature</th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {classAccounts.map((account) => (
                                                <tr key={account.code} className={`hover:bg-gray-50 ${account.isSummary ? 'bg-gray-50 font-medium' : ''}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                                        {account.code}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="flex flex-col">
                                                            <span>{account.label}</span>
                                                            {account.description && (
                                                                <span className="text-xs text-gray-500">{account.description}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {account.type}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${account.nature === 'DEBIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {account.nature}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => openLedger(account)} title="Grand Livre">
                                                                <BookOpen className="h-4 w-4 text-blue-600" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => openEdit(account)} title="Modifier">
                                                                <Edit className="h-4 w-4 text-gray-600" />
                                                            </Button>
                                                            {!account.isSummary && (
                                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(account.code)} title="Supprimer">
                                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Dialog Création */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nouveau Compte Comptable</DialogTitle>
                        <DialogDescription>Ajouter un compte au plan comptable OHADA.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Code</Label>
                            <Input
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
                            <Label className="text-right">Classe</Label>
                            <Select
                                value={formData.classCode}
                                onValueChange={(v) => setFormData({ ...formData, classCode: v })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.label}</SelectItem>)}
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
                        <DialogTitle>Modifier Compte {selectedAccount?.code}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Libellé</Label>
                            <Input
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Description</Label>
                            <Input
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdate}>Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Grand Livre */}
            <Dialog open={isLedgerOpen} onOpenChange={setIsLedgerOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Grand Livre - {selectedAccount?.code} {selectedAccount?.label}</DialogTitle>
                    </DialogHeader>
                    {selectedAccount && (
                        <AccountLedger accountCode={selectedAccount.code} accountLabel={selectedAccount.label} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
