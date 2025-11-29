'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, ArrowLeft, GripVertical, Percent, Hash, Calculator } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { ActTemplate, ActSection, CalculationItem, ScaleSegment, TaxDefinition } from '@/lib/taxation/types';
import { Account } from '@/lib/accounting/types';

export default function ActTemplatesPageClient() {
    const [templates, setTemplates] = useState<ActTemplate[]>([]);
    const [taxes, setTaxes] = useState<TaxDefinition[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Editor State
    const [currentTemplate, setCurrentTemplate] = useState<ActTemplate>({
        id: '',
        label: '',
        description: '',
        sections: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [templatesRes, taxesRes, accountsRes] = await Promise.all([
                fetch('/api/taxation/templates'),
                fetch('/api/taxation/taxes'),
                fetch('/api/accounting/accounts')
            ]);

            if (templatesRes.ok) setTemplates(await templatesRes.json());
            if (taxesRes.ok) setTaxes(await taxesRes.json());
            if (accountsRes.ok) setAccounts(await accountsRes.json());
        } catch (error) {
            console.error(error);
            toast({ title: "Erreur", description: "Impossible de charger les données.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setCurrentTemplate({
            id: '',
            label: 'Nouveau Modèle',
            description: '',
            sections: [
                {
                    id: crypto.randomUUID(),
                    label: 'Emoluments du Notaire',
                    items: []
                },
                {
                    id: crypto.randomUUID(),
                    label: 'Trésor Public',
                    items: []
                }
            ]
        });
        setIsEditing(true);
    };

    const handleEdit = (template: ActTemplate) => {
        setCurrentTemplate(JSON.parse(JSON.stringify(template))); // Deep copy
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const url = '/api/taxation/templates';
            const method = currentTemplate.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentTemplate)
            });

            if (!res.ok) throw new Error('Failed to save template');

            toast({ title: "Succès", description: "Modèle enregistré." });
            setIsEditing(false);
            fetchData();
        } catch (error) {
            toast({ title: "Erreur", description: "Erreur lors de l'enregistrement.", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce modèle ?")) return;
        try {
            await fetch(`/api/taxation/templates?id=${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de supprimer.", variant: "destructive" });
        }
    };

    // --- Editor Helpers ---

    const addSection = () => {
        setCurrentTemplate(prev => ({
            ...prev,
            sections: [...prev.sections, { id: crypto.randomUUID(), label: 'Nouvelle Section', items: [] }]
        }));
    };

    const updateSection = (sectionId: string, updates: Partial<ActSection>) => {
        setCurrentTemplate(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s)
        }));
    };

    const deleteSection = (sectionId: string) => {
        setCurrentTemplate(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== sectionId)
        }));
    };

    const addItem = (sectionId: string) => {
        const newItem: CalculationItem = {
            id: crypto.randomUUID(),
            label: 'Nouvel Élément',
            type: 'PERCENTAGE',
            value: 0,
            taxIds: [],
            isDisbursement: false
        };
        setCurrentTemplate(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
            )
        }));
    };

    const updateItem = (sectionId: string, itemId: string, updates: Partial<CalculationItem>) => {
        setCurrentTemplate(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId ? {
                    ...s,
                    items: s.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
                } : s
            )
        }));
    };

    const deleteItem = (sectionId: string, itemId: string) => {
        setCurrentTemplate(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
            )
        }));
    };

    if (isEditing) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm sticky top-4 z-10">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h2 className="text-lg font-bold">Éditeur de Modèle</h2>
                            <p className="text-xs text-gray-500">{currentTemplate.label}</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        <Save className="h-4 w-4 mr-2" /> Enregistrer
                    </Button>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nom du Modèle</Label>
                            <Input
                                value={currentTemplate.label}
                                onChange={e => setCurrentTemplate({ ...currentTemplate, label: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                                value={currentTemplate.description || ''}
                                onChange={e => setCurrentTemplate({ ...currentTemplate, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {currentTemplate.sections.map((section) => (
                        <Card key={section.id} className="border-l-4 border-l-blue-500">
                            <CardHeader className="flex flex-row items-center justify-between py-3 bg-gray-50">
                                <Input
                                    value={section.label}
                                    onChange={e => updateSection(section.id, { label: e.target.value })}
                                    className="w-1/3 font-semibold bg-transparent border-none focus:bg-white"
                                />
                                <Button variant="ghost" size="sm" onClick={() => deleteSection(section.id)} className="text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                {section.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-start p-4 bg-white border rounded-md shadow-sm">
                                        <div className="grid gap-4 flex-1">
                                            <div className="grid grid-cols-12 gap-4">
                                                <div className="col-span-4 space-y-1">
                                                    <Label className="text-xs">Libellé</Label>
                                                    <Input
                                                        value={item.label}
                                                        onChange={e => updateItem(section.id, item.id, { label: e.target.value })}
                                                        className="h-8"
                                                    />
                                                </div>
                                                <div className="col-span-3 space-y-1">
                                                    <Label className="text-xs">Type de Calcul</Label>
                                                    <Select
                                                        value={item.type}
                                                        onValueChange={(v: any) => updateItem(section.id, item.id, { type: v })}
                                                    >
                                                        <SelectTrigger className="h-8">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PERCENTAGE">Pourcentage (%)</SelectItem>
                                                            <SelectItem value="FIXED">Montant Fixe</SelectItem>
                                                            <SelectItem value="SCALE">Barème (Tranches)</SelectItem>
                                                            <SelectItem value="USER_INPUT">Saisie Manuelle</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="col-span-3 space-y-1">
                                                    <Label className="text-xs">Valeur / Taux</Label>
                                                    {item.type === 'SCALE' ? (
                                                        <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => toast({ description: "Éditeur de barème à venir..." })}>
                                                            <Calculator className="h-3 w-3 mr-2" /> Configurer Barème
                                                        </Button>
                                                    ) : (
                                                        <Input
                                                            type="number"
                                                            value={item.value || 0}
                                                            onChange={e => updateItem(section.id, item.id, { value: parseFloat(e.target.value) })}
                                                            className="h-8"
                                                            disabled={item.type === 'USER_INPUT'}
                                                        />
                                                    )}
                                                </div>
                                                <div className="col-span-2 flex items-end justify-end">
                                                    <Button variant="ghost" size="sm" onClick={() => deleteItem(section.id, item.id)} className="text-red-500 h-8 w-8 p-0">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 items-center pt-2 border-t">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`deb-${item.id}`}
                                                        checked={item.isDisbursement}
                                                        onCheckedChange={(c) => updateItem(section.id, item.id, { isDisbursement: c as boolean })}
                                                    />
                                                    <Label htmlFor={`deb-${item.id}`} className="text-xs cursor-pointer">Est un Débours</Label>
                                                </div>

                                                <div className="flex-1">
                                                    <Select
                                                        value={item.accountCode || ''}
                                                        onValueChange={v => updateItem(section.id, item.id, { accountCode: v })}
                                                    >
                                                        <SelectTrigger className="h-8 text-xs">
                                                            <SelectValue placeholder="Compte Comptable..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {accounts.map(a => (
                                                                <SelectItem key={a.code} value={a.code} className="text-xs">
                                                                    {a.code} - {a.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="flex gap-2 items-center">
                                                    <span className="text-xs font-medium text-gray-500">Taxes:</span>
                                                    {taxes.map(tax => (
                                                        <div key={tax.id} className="flex items-center space-x-1">
                                                            <Checkbox
                                                                id={`tax-${item.id}-${tax.id}`}
                                                                checked={item.taxIds?.includes(tax.id)}
                                                                onCheckedChange={(checked) => {
                                                                    const currentTaxes = item.taxIds || [];
                                                                    const newTaxes = checked
                                                                        ? [...currentTaxes, tax.id]
                                                                        : currentTaxes.filter(id => id !== tax.id);
                                                                    updateItem(section.id, item.id, { taxIds: newTaxes });
                                                                }}
                                                            />
                                                            <Label htmlFor={`tax-${item.id}-${tax.id}`} className="text-xs cursor-pointer">{tax.code}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addItem(section.id)} className="w-full border-dashed">
                                    <Plus className="h-4 w-4 mr-2" /> Ajouter un élément de calcul
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    <Button onClick={addSection} variant="outline" className="w-full py-8 border-dashed text-lg">
                        <Plus className="h-6 w-6 mr-2" /> Ajouter une Section
                    </Button>
                </div>
            </div>
        );
    }

    // List View
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Modèles d'Actes</h2>
                <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Nouveau Modèle
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleEdit(template)}>
                        <CardHeader>
                            <CardTitle className="text-lg">{template.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 mb-4">{template.description || 'Aucune description'}</p>
                            <div className="flex gap-2">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{template.sections.length} sections</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
