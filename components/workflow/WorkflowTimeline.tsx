"use client";

import { useState } from "react";
import { WorkflowStepInstance, User } from "@/types/db";
import { CheckCircle2, Circle, Clock, AlertCircle, User as UserIcon, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { assignWorkflowStep } from "@/app/actions";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";

interface WorkflowTimelineProps {
    workflowId: string;
    steps: WorkflowStepInstance[];
    currentStepIndex: number;
    onStepComplete?: (stepId: string) => void;
    users: User[];
}

export function WorkflowTimeline({ workflowId, steps, currentStepIndex, onStepComplete, users }: WorkflowTimelineProps) {
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [isAssigning, setIsAssigning] = useState(false);

    const completedSteps = steps.filter(s => s.status === 'COMPLETED').length;
    const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;

    const handleAssignClick = (stepId: string) => {
        setSelectedStepId(stepId);
        setAssignDialogOpen(true);
    };

    const handleAssignSubmit = async () => {
        if (!selectedStepId || !selectedUserId) return;

        setIsAssigning(true);
        try {
            await assignWorkflowStep(workflowId, selectedStepId, selectedUserId);
            setAssignDialogOpen(false);
            setSelectedStepId(null);
            setSelectedUserId("");
        } catch (error) {
            console.error("Failed to assign user", error);
        } finally {
            setIsAssigning(false);
        }
    };

    const getStepIcon = (step: WorkflowStepInstance, index: number) => {
        if (step.status === 'COMPLETED') {
            return <CheckCircle2 className="w-6 h-6 text-green-600" />;
        } else if (step.status === 'IN_PROGRESS') {
            return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />;
        } else {
            return <Circle className="w-6 h-6 text-gray-400" />;
        }
    };

    const getStepColor = (step: WorkflowStepInstance, index: number) => {
        if (step.status === 'COMPLETED') return 'border-green-500 bg-green-50';
        if (step.status === 'IN_PROGRESS') return 'border-blue-500 bg-blue-50';
        return 'border-gray-300 bg-gray-50';
    };

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Progression du workflow</span>
                            <span className="text-muted-foreground">
                                {completedSteps} / {steps.length} étapes complétées
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                            {progress.toFixed(0)}% complété
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Timeline */}
            <div className="relative space-y-4">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gray-200" />

                {steps.map((step, index) => (
                    <Card
                        key={step.id}
                        className={`relative border-2 transition-all ${getStepColor(step, index)}`}
                    >
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                {/* Icon */}
                                <div className="relative z-10 flex-shrink-0">
                                    {getStepIcon(step, index)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-3">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-base">
                                                {step.title}
                                            </h4>
                                            {/* Description is not available in WorkflowStepInstance yet, using notes if available or generic text */}
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {step.notes || "Étape du workflow"}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <Badge variant="outline">
                                                {step.status === 'COMPLETED' ? 'Terminé' :
                                                    step.status === 'IN_PROGRESS' ? 'En cours' : 'En attente'}
                                            </Badge>
                                            {step.status === 'IN_PROGRESS' && onStepComplete && (
                                                <button
                                                    onClick={() => onStepComplete(step.id)}
                                                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                                                >
                                                    Terminer l'étape
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                        {step.completedBy && (
                                            <div className="flex items-center gap-1">
                                                <UserIcon className="w-3 h-3" />
                                                <span>Complété par: {step.completedBy}</span>
                                            </div>
                                        )}
                                        {step.dueDate && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>Échéance: {format(new Date(step.dueDate), "d MMMM yyyy", { locale: fr })}</span>
                                            </div>
                                        )}
                                        {step.assigneeId ? (
                                            <div className="flex items-center gap-1">
                                                <UserIcon className="w-3 h-3" />
                                                <span>Assigné à: {users.find(u => u.id === step.assigneeId)?.firstName || step.assigneeId}</span>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs px-2"
                                                onClick={() => handleAssignClick(step.id)}
                                            >
                                                <UserPlus className="w-3 h-3 mr-1" />
                                                Assigner
                                            </Button>
                                        )}
                                    </div>

                                    {/* Completion Info */}
                                    {step.status === 'COMPLETED' && step.completedAt && (
                                        <div className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
                                            ✓ Complété le {format(new Date(step.completedAt), "d MMMM yyyy à HH:mm", { locale: fr })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assigner l'étape</DialogTitle>
                        <DialogDescription>
                            Sélectionnez un collaborateur pour cette étape du workflow.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Collaborateur</Label>
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir un utilisateur" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.firstName} {user.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleAssignSubmit} disabled={!selectedUserId || isAssigning}>
                            {isAssigning ? "Assignation..." : "Assigner"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
