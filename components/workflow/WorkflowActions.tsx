"use client";

import { Button } from "@/components/ui/button";
import { WorkflowAction } from "@/lib/workflow";
import { Loader2 } from "lucide-react";
import * as Icons from "lucide-react";

interface WorkflowActionsProps {
    actions: WorkflowAction[];
    onAction: (actionId: string) => void;
    isLoading?: boolean;
}

export function WorkflowActions({ actions, onAction, isLoading }: WorkflowActionsProps) {
    if (actions.length === 0) return null;

    return (
        <div className="flex gap-2 flex-wrap">
            {actions.map((action) => {
                const Icon = (Icons as any)[action.icon || 'Circle'];
                return (
                    <Button
                        key={action.id}
                        variant={action.variant}
                        size="sm"
                        onClick={() => onAction(action.id)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : Icon && (
                            <Icon className="h-4 w-4 mr-2" />
                        )}
                        {action.label}
                    </Button>
                );
            })}
        </div>
    );
}
