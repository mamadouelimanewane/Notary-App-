"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { saveActeMetadata } from "@/app/actions";
import { toast } from "@/components/ui/use-toast";

interface NewActeFormProps {
    dossiers: any[];
}

const acteTypes = [
    { value: "VENTE", label: "Acte de Vente" },
    { value: "COMPROMIS", label: "Compromis de Vente" },
    { value: "DONATION_SIMPLE", label: "Donation Simple" },
    { value: "DONATION_EPOUX", label: "Donation entre Époux" },
    { value: "DONATION_PARTAGE", label: "Donation-Partage" },
    { value: "DONATION_USUFRUIT", label: "Donation avec Réserve d'Usufruit" },
    { value: "TESTAMENT", label: "Testament" },
    { value: "NOTORIETE", label: "Acte de Notoriété" },
    { value: "PARTAGE_SUCCESSION", label: "Partage Successoral" },
    { value: "CONTRAT_MARIAGE", label: "Contrat de Mariage" },
    { value: "VENTE_IMMOBILIERE", label: "Vente Immobilière" },
    { value: "PERSONNALISE", label: "Acte Personnalisé" },
];

const categories = [
    { value: "FAMILLE", label: "Famille" },
    { value: "IMMOBILIER", label: "Immobilier" },
    { value: "AFFAIRES", label: "Affaires" },
    { value: "AUTRE", label: "Autre" },
];

export default function NewActeForm({ dossiers }: NewActeFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);
            await saveActeMetadata(formData);

            toast({
                title: "Succès",
                description: "L'acte a été créé avec succès.",
            });
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de la création de l'acte.",
                variant: "destructive",
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/actes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Créer un Nouvel Acte</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations de l'acte</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Titre de l'acte *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Ex: Vente Appartement Paris 15ème"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type d'acte *</Label>
                                <Select name="type" value={selectedType} onValueChange={setSelectedType} required>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Sélectionner un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {acteTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Catégorie *</Label>
                                <Select name="category" required>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Sélectionner une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dossierId">Dossier associé *</Label>
                                <Select name="dossierId" required>
                                    <SelectTrigger id="dossierId">
                                        <SelectValue placeholder="Sélectionner un dossier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dossiers.map((dossier) => (
                                            <SelectItem key={dossier.id} value={dossier.id}>
                                                {dossier.ref} - {dossier.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Additional metadata fields can be added here based on acte type */}
                        {selectedType === "COMPROMIS" && (
                            <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                                <h3 className="font-medium">Informations Compromis de Vente</h3>
                                <p className="text-sm text-muted-foreground">
                                    Les informations détaillées (vendeur, acheteur, bien) peuvent être ajoutées après la création
                                    ou via le formulaire de génération de document.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end gap-4">
                            <Link href="/dashboard/actes">
                                <Button type="button" variant="outline" disabled={isSubmitting}>
                                    Annuler
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Création en cours..." : "Créer l'acte"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
