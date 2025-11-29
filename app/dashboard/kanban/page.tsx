"use client";

import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Layout } from 'lucide-react';

export default function KanbanPage() {
    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Layout className="w-6 h-6 text-blue-600" />
                        Pilotage des Dossiers
                    </h1>
                    <p className="text-muted-foreground">
                        Vue Kanban pour suivre l'avancement des dossiers en temps réel.
                    </p>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
                <KanbanBoard />
            </div>
        </div>
    );
}
