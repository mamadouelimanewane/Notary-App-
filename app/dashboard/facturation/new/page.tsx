'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface Acte {
    id: string;
    title: string;
    dossierId: string;
    status: string;
}

interface Dossier {
    id: string;
    ref: string;
    title: string;
}

export default function NewInvoicePage() {
    const router = useRouter();
    const [actes, setActes] = useState<Acte[]>([]);
    const [dossiers, setDossiers] = useState<Dossier[]>([]);
    const [selectedActeId, setSelectedActeId] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [actesRes, dossiersRes] = await Promise.all([
                fetch('/api/actes'),
                fetch('/api/dossiers')
            ]);

            const actesData = await actesRes.json();
            const dossiersData = await dossiersRes.json();

            // Filter actes that are signed or registered (ready for billing)
            const billableActes = actesData.filter((acte: Acte) =>
                acte.status === 'SIGNE' || acte.status === 'ENREGISTRE'
            );

            setActes(billableActes);
            setDossiers(dossiersData);
        } catch (error) {
            console.error('Error loading data:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible de charger les données',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = async () => {
        if (!selectedActeId) {
            toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner un acte',
                variant: 'destructive'
            });
            return;
        }

        setCreating(true);
        try {
            const response = await fetch('/api/billing/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ acteId: selectedActeId })
            });

            if (!response.ok) throw new Error('Failed to create invoice');

            const invoice = await response.json();

            toast({
                title: 'Facture créée',
                description: `La facture ${invoice.number} a été créée avec succès`
            });

            router.push(`/dashboard/facturation/${invoice.id}`);
        } catch (error) {
            console.error('Error creating invoice:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible de créer la facture',
                variant: 'destructive'
            });
        } finally {
            setCreating(false);
        }
    };

    const getDossierRef = (dossierId: string) => {
        const dossier = dossiers.find(d => d.id === dossierId);
        return dossier ? dossier.ref : '';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nouvelle Facture</h1>
                    <p className="text-muted-foreground">Générer une facture à partir d'un acte</p>
                </div>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Sélectionner un acte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Acte à facturer</Label>
                        <Select value={selectedActeId} onValueChange={setSelectedActeId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir un acte..." />
                            </SelectTrigger>
                            <SelectContent>
                                {actes.length === 0 ? (
                                    <div className="p-4 text-center text-muted-foreground">
                                        Aucun acte disponible pour facturation
                                    </div>
                                ) : (
                                    actes.map((acte) => (
                                        <SelectItem key={acte.id} value={acte.id}>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                <span>{acte.title}</span>
                                                <span className="text-muted-foreground text-sm">
                                                    ({getDossierRef(acte.dossierId)})
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-2">
                            Seuls les actes signés ou enregistrés peuvent être facturés
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">ℹ️ Information</h4>
                        <p className="text-sm text-blue-800">
                            La facture sera générée automatiquement avec :
                        </p>
                        <ul className="text-sm text-blue-800 list-disc list-inside mt-2 space-y-1">
                            <li>Les émoluments calculés selon le type d'acte</li>
                            <li>Les débours (frais administratifs)</li>
                            <li>Les droits d'enregistrement</li>
                            <li>La TVA applicable (18%)</li>
                        </ul>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            onClick={handleCreateInvoice}
                            disabled={!selectedActeId || creating}
                            className="flex-1"
                        >
                            {creating ? 'Création...' : 'Créer la facture'}
                        </Button>
                        <Button variant="outline" onClick={() => router.back()}>
                            Annuler
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
