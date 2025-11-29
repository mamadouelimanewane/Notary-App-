"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Account } from "@/lib/accounting/types";
import { formatCurrency } from "@/lib/format";

interface Journal {
    id: string;
    code: string;
    label: string;
}

interface EntryLine {
    id: string;
    accountCode: string;
    label: string;
    debit: number;
    credit: number;
}

export default function SaisieEcritureClient({ journals, accounts }: { journals: Journal[], accounts: Account[] }) {
    const [selectedJournal, setSelectedJournal] = useState<string>(journals[0]?.id || "");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [globalLabel, setGlobalLabel] = useState("");
    const [lines, setLines] = useState<EntryLine[]>([
        { id: '1', accountCode: '', label: '', debit: 0, credit: 0 },
        { id: '2', accountCode: '', label: '', debit: 0, credit: 0 }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate totals
    const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    const balance = totalDebit - totalCredit;
    const isBalanced = Math.abs(balance) < 0.01;

    const addLine = () => {
        setLines([...lines, {
            id: Math.random().toString(36).substr(2, 9),
            accountCode: '',
            label: globalLabel,
            debit: 0,
            credit: 0
        }]);
    };

    const removeLine = (id: string) => {
        if (lines.length > 2) {
            setLines(lines.filter(l => l.id !== id));
        }
    };

    const updateLine = (id: string, field: keyof EntryLine, value: any) => {
        setLines(lines.map(line => {
            if (line.id === id) {
                return { ...line, [field]: value };
            }
            return line;
        }));
    };

    const handleSubmit = async (validated: boolean) => {
        if (!isBalanced) {
            toast({
                title: "Écriture déséquilibrée",
                description: `L'écart est de ${formatCurrency(balance)}. Veuillez équilibrer l'écriture.`,
                variant: "destructive"
            });
            return;
        }

        if (!selectedJournal || !date || !globalLabel) {
            toast({
                title: "Champs manquants",
                description: "Veuillez remplir tous les champs obligatoires (Journal, Date, Libellé).",
                variant: "destructive"
            });
            return;
        }

        // Filter out empty lines
        const validLines = lines.filter(l => l.accountCode && (l.debit > 0 || l.credit > 0));
        if (validLines.length < 2) {
            toast({
                title: "Lignes insuffisantes",
                description: "Une écriture doit comporter au moins 2 lignes valides.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/accounting/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    journalId: selectedJournal,
                    date,
                    label: globalLabel,
                    validated, // Pass validation status
                    entries: validLines.map(l => ({
                        accountCode: l.accountCode,
                        accountLabel: accounts.find(a => a.code === l.accountCode)?.label || '',
                        label: l.label || globalLabel,
                        debit: l.debit,
                        credit: l.credit
                    }))
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erreur lors de l\'enregistrement');
            }

            toast({
                title: "Écriture enregistrée",
                description: "L'écriture a été validée avec succès.",
            });

            // Reset form
            setGlobalLabel("");
            setLines([
                { id: Math.random().toString(), accountCode: '', label: '', debit: 0, credit: 0 },
                { id: Math.random().toString(), accountCode: '', label: '', debit: 0, credit: 0 }
            ]);
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Form */}
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Journal</Label>
                        <Select value={selectedJournal} onValueChange={setSelectedJournal}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un journal" />
                            </SelectTrigger>
                            <SelectContent>
                                {journals.map(j => (
                                    <SelectItem key={j.id} value={j.id}>{j.code} - {j.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Libellé général</Label>
                        <Input
                            placeholder="Ex: Facture SENELEC Janvier"
                            value={globalLabel}
                            onChange={e => {
                                setGlobalLabel(e.target.value);
                                // Update empty line labels automatically
                                setLines(lines.map(l => l.label === '' || l.label === globalLabel ? { ...l, label: e.target.value } : l));
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Lines Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                    <h3 className="font-semibold">Lignes d'écriture</h3>
                    <div className={`text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2 ${isBalanced ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isBalanced ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        {isBalanced ? "Équilibré" : `Déséquilibre: ${formatCurrency(balance)}`}
                    </div>
                </div>

                <div className="p-4">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-muted-foreground">
                                <th className="pb-2 w-[30%]">Compte</th>
                                <th className="pb-2 w-[30%]">Libellé ligne</th>
                                <th className="pb-2 w-[15%] text-right">Débit</th>
                                <th className="pb-2 w-[15%] text-right">Crédit</th>
                                <th className="pb-2 w-[10%]"></th>
                            </tr>
                        </thead>
                        <tbody className="space-y-2">
                            {lines.map((line) => (
                                <tr key={line.id} className="group">
                                    <td className="py-2 pr-2">
                                        <div className="relative">
                                            <Input
                                                list={`accounts-${line.id}`}
                                                placeholder="Numéro de compte"
                                                value={line.accountCode}
                                                onChange={e => updateLine(line.id, 'accountCode', e.target.value)}
                                                className="font-mono"
                                            />
                                            <datalist id={`accounts-${line.id}`}>
                                                {accounts.map(acc => (
                                                    <option key={acc.code} value={acc.code}>{acc.label}</option>
                                                ))}
                                            </datalist>
                                        </div>
                                    </td>
                                    <td className="py-2 pr-2">
                                        <Input
                                            value={line.label}
                                            onChange={e => updateLine(line.id, 'label', e.target.value)}
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <Input
                                            type="number"
                                            className="text-right"
                                            value={line.debit || ''}
                                            onChange={e => {
                                                const val = parseFloat(e.target.value) || 0;
                                                updateLine(line.id, 'debit', val);
                                                if (val > 0) updateLine(line.id, 'credit', 0);
                                            }}
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <Input
                                            type="number"
                                            className="text-right"
                                            value={line.credit || ''}
                                            onChange={e => {
                                                const val = parseFloat(e.target.value) || 0;
                                                updateLine(line.id, 'credit', val);
                                                if (val > 0) updateLine(line.id, 'debit', 0);
                                            }}
                                        />
                                    </td>
                                    <td className="py-2 text-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeLine(line.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t font-semibold">
                                <td colSpan={2} className="pt-4 text-right pr-4">Totaux :</td>
                                <td className="pt-4 text-right text-slate-700">{formatCurrency(totalDebit)}</td>
                                <td className="pt-4 text-right text-slate-700">{formatCurrency(totalCredit)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>

                    <Button variant="outline" size="sm" onClick={addLine} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" /> Ajouter une ligne
                    </Button>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => handleSubmit(false)} disabled={isSubmitting || totalDebit === 0}>
                    <Save className="h-4 w-4 mr-2" /> Enregistrer en Brouillard
                </Button>
                <Button onClick={() => handleSubmit(true)} disabled={!isBalanced || isSubmitting || totalDebit === 0}>
                    {isSubmitting ? "Enregistrement..." : (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" /> Valider définitivement
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
