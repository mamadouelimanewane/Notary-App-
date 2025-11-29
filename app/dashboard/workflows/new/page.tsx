"use client";

import { useState } from "react";
import { createWorkflowTemplate } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewWorkflowPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [steps, setSteps] = useState<any[]>([{ title: "", description: "", estimatedDuration: "", automationType: "" }]);

    const addStep = () => {
        setSteps([...steps, { title: "", description: "", estimatedDuration: "", automationType: "" }]);
    };

    const removeStep = (index: number) => {
        const newSteps = [...steps];
        newSteps.splice(index, 1);
        setSteps(newSteps);
    };

    const updateStep = (index: number, field: string, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setSteps(newSteps);
    };

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            formData.append("steps", JSON.stringify(steps));
            await createWorkflowTemplate(formData);
        } catch (error) {
            console.error("Failed to create workflow template", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/workflows">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Nouveau Modèle de Workflow</h1>
                    <p className="text-muted-foreground">Définissez les étapes de votre procédure.</p>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations Générales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Titre du modèle</Label>
                            <Input id="title" name="title" placeholder="Ex: Vente Immobilière Standard" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Description de la procédure..." />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Étapes du Workflow</h2>
                        <Button type="button" onClick={addStep} variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> Ajouter une étape
                        </Button>
                    </div>

                    {steps.map((step, index) => (
                        <Card key={index}>
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Titre de l'étape</Label>
                                                <Input
                                                    value={step.title}
                                                    onChange={(e) => updateStep(index, "title", e.target.value)}
                                                    placeholder="Ex: Ouverture du dossier"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description (Optionnel)</Label>
                                                <Input
                                                    value={step.description}
                                                    onChange={(e) => updateStep(index, "description", e.target.value)}
                                                    placeholder="Détails de l'étape..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Durée estimée (jours)</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={step.estimatedDuration || ""}
                                                    onChange={(e) => updateStep(index, "estimatedDuration", e.target.value)}
                                                    placeholder="Ex: 2"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Automatisation (Optionnel)</Label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={step.automationType || ""}
                                                    onChange={(e) => updateStep(index, "automationType", e.target.value)}
                                                >
                                                    <option value="">Aucune</option>
                                                    <option value="SEND_EMAIL">Envoyer un email</option>
                                                    <option value="GENERATE_DOCUMENT">Générer un document</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => removeStep(index)}
                                        disabled={steps.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-end gap-4">
                    <Link href="/dashboard/workflows">
                        <Button variant="outline" type="button">Annuler</Button>
                    </Link>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>Enregistrement...</>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Enregistrer le modèle
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
