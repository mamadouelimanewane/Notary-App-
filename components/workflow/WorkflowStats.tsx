"use client";

import { WorkflowInstance } from "@/types/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertCircle, Calendar, TrendingUp } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

interface WorkflowStatsProps {
    workflow: WorkflowInstance;
}

export function WorkflowStats({ workflow }: WorkflowStatsProps) {
    const totalSteps = workflow.steps.length;
    const completedSteps = workflow.steps.filter(s => s.status === 'COMPLETED').length;
    const inProgressSteps = workflow.steps.filter(s => s.status === 'IN_PROGRESS').length;
    const pendingSteps = workflow.steps.filter(s => s.status === 'PENDING').length;
    // blockedSteps is not available in WorkflowInstance, assuming 0 or adding logic if needed
    const blockedSteps = 0;

    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    // estimatedTotalDuration is not available in WorkflowInstance
    const estimatedTotalDuration = 0;

    const daysElapsed = differenceInDays(new Date(), new Date(workflow.createdAt));
    // estimatedCompletionDate is not available in WorkflowInstance
    const daysRemaining = null;

    const stats = [
        {
            title: "Étapes complétées",
            value: completedSteps,
            total: totalSteps,
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "En cours",
            value: inProgressSteps,
            icon: Clock,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "En attente",
            value: pendingSteps,
            icon: AlertCircle,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Vue d'ensemble</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Progression globale</span>
                            <span className="text-muted-foreground">
                                {completedSteps} / {totalSteps} étapes
                            </span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-1">
                            {progress.toFixed(1)}% complété
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Démarré le</span>
                            </div>
                            <p className="font-medium">
                                {format(new Date(workflow.createdAt), "d MMMM yyyy", { locale: fr })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Il y a {daysElapsed} jour{daysElapsed > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stat.value}
                                        {stat.total && (
                                            <span className="text-sm text-muted-foreground ml-1">
                                                / {stat.total}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Status Badge */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Statut du workflow</p>
                            <p className="text-lg font-semibold capitalize">
                                {workflow.status === 'IN_PROGRESS' && '🟡 En cours'}
                                {workflow.status === 'COMPLETED' && '🟢 Terminé'}
                                {workflow.status === 'PAUSED' && '🟠 En pause'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
