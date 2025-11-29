"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DossierTimeline } from "@/components/client-journey/DossierTimeline";
import { TimelineEvent } from "@/types/client-journey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Lock } from "lucide-react";

export default function PublicTimelinePage() {
    const params = useParams();
    const token = params.token as string;
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [dossierRef, setDossierRef] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTimeline();
    }, [token]);

    const loadTimeline = async () => {
        try {
            const response = await fetch(`/api/public-timeline/${token}`);

            if (!response.ok) {
                if (response.status === 403) {
                    setError('Ce lien a expiré ou n\'est plus valide.');
                } else if (response.status === 404) {
                    setError('Dossier introuvable.');
                } else {
                    setError('Une erreur est survenue.');
                }
                setLoading(false);
                return;
            }

            const data = await response.json();
            setEvents(data.events);
            setDossierRef(data.dossierRef);
        } catch (error) {
            console.error(error);
            setError('Impossible de charger la timeline.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            Accès Refusé
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{error}</p>
                        <p className="text-sm text-muted-foreground mt-4">
                            Si vous pensez qu'il s'agit d'une erreur, veuillez contacter votre notaire.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">Suivi de votre Dossier</CardTitle>
                                <p className="text-muted-foreground mt-1">
                                    Référence : <span className="font-semibold">{dossierRef}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Lock className="h-4 w-4" />
                                Lien sécurisé
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Historique du Dossier
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DossierTimeline events={events} />
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>Ce lien est personnel et confidentiel. Ne le partagez pas.</p>
                    <p className="mt-1">Pour toute question, contactez votre notaire.</p>
                </div>
            </div>
        </div>
    );
}
