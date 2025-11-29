"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DossierTimeline } from "@/components/client-journey/DossierTimeline";
import { TimelineEvent } from "@/types/client-journey";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function DossierTimelinePage() {
    const params = useParams();
    const dossierId = params.id as string;
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTimeline = async () => {
        try {
            const response = await fetch(`/api/timeline?dossierId=${dossierId}`);
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTimeline();
    }, [dossierId]);

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/dossiers`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Timeline du Dossier</h1>
                        <p className="text-muted-foreground">Historique complet des événements</p>
                    </div>
                </div>
                <Button variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer au client
                </Button>
            </div>

            <div className="bg-white rounded-lg border p-6">
                <DossierTimeline events={events} />
            </div>
        </div>
    );
}
