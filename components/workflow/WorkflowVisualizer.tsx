"use client";

import { WorkflowStepInstance } from "@/types/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Circle, Clock } from "lucide-react";

interface WorkflowVisualizerProps {
    steps: WorkflowStepInstance[];
}

export function WorkflowVisualizer({ steps }: WorkflowVisualizerProps) {
    const getStepIcon = (step: WorkflowStepInstance) => {
        if (step.status === 'COMPLETED') {
            return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        } else if (step.status === 'IN_PROGRESS') {
            return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
        } else {
            return <Circle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStepBorderColor = (step: WorkflowStepInstance) => {
        if (step.status === 'COMPLETED') return 'border-green-500 bg-green-50';
        if (step.status === 'IN_PROGRESS') return 'border-blue-500 bg-blue-50';
        return 'border-gray-200 bg-white';
    };

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex items-center min-w-max p-4 space-x-4">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        {/* Step Node */}
                        <Card className={`w-64 flex-shrink-0 border-2 ${getStepBorderColor(step)}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline" className="text-[10px]">
                                        Étape {index + 1}
                                    </Badge>
                                    {getStepIcon(step)}
                                </div>
                                <h4 className="font-semibold text-sm line-clamp-2 mb-1" title={step.title}>
                                    {step.title}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {step.notes || "Pas de notes"}
                                </p>
                                {step.assigneeId && (
                                    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground flex items-center">
                                        <span className="font-medium mr-1">Assigné:</span> {step.assigneeId}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Arrow (if not last step) */}
                        {index < steps.length - 1 && (
                            <div className="flex-shrink-0 px-2 text-gray-300">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
