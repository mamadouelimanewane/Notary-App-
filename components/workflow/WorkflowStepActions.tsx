"use client";

import { useState } from "react";
import { WorkflowStep } from "@/lib/workflow-engine";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Play, Pause } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface WorkflowStepActionsProps {
    step: WorkflowStep;
    canComplete: boolean;
    canStart: boolean;
    onComplete: (stepId: string, notes?: string) => Promise<void>;
    onStart: (stepId: string) => Promise<void>;
}

export function WorkflowStepActions({
    step,
    canComplete,
    canStart,
    onComplete,
    onStart,
}: WorkflowStepActionsProps) {
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleComplete = async () => {
        setIsLoading(true);
        try {
            await onComplete(step.id, notes);
            toast({
                title: "Étape complétée",
                description: `L'étape "${step.name}" a été marquée comme complétée.`,
            });
            setNotes("");
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de compléter l'étape.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleStart = async () => {
        setIsLoading(true);
        try {
            await onStart(step.id);
            toast({
                title: "Étape démarrée",
                description: `L'étape "${step.name}" a été démarrée.`,
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de démarrer l'étape.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (step.status === 'completed') {
        return (
            <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Cette étape est complétée</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (step.status === 'blocked') {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-red-700">
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">
                            Cette étape est bloquée en attente des dépendances
                        </span>
                    </div>
                    {step.dependencies && step.dependencies.length > 0 && (
                        <p className="text-sm text-red-600 mt-2">
                            Dépendances: {step.dependencies.join(", ")}
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Actions disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {step.status === 'pending' && canStart && (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Cette étape est prête à être démarrée.
                        </p>
                        <Button
                            onClick={handleStart}
                            disabled={isLoading}
                            className="w-full"
                            variant="outline"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Démarrer cette étape
                        </Button>
                    </div>
                )}

                {step.status === 'in_progress' && canComplete && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (optionnel)</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Ajoutez des notes sur cette étape..."
                                rows={3}
                            />
                        </div>
                        <Button
                            onClick={handleComplete}
                            disabled={isLoading}
                            className="w-full"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Marquer comme complété
                        </Button>
                    </div>
                )}

                {!canStart && !canComplete && step.status !== 'completed' && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                        Vous n'avez pas les permissions pour agir sur cette étape.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
