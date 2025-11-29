"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function TestClientJourneyPage() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);

    const runTests = async () => {
        setLoading(true);
        setResults(null);

        try {
            const response = await fetch('/api/test-client-journey', {
                method: 'POST'
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const data = await response.json();
            setResults(data);

            toast({
                title: "Tests réussis !",
                description: `${data.testsRun} tests exécutés avec succès.`
            });
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.message || "Impossible d'exécuter les tests.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Test Parcours Client</h1>
                <p className="text-muted-foreground">
                    Démonstration des fonctionnalités de Timeline et Notifications
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Exécuter les Tests</CardTitle>
                    <CardDescription>
                        Ce test va créer des événements de timeline et envoyer des notifications pour le premier dossier de la base de données.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={runTests} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Tests en cours...
                            </>
                        ) : (
                            'Lancer les Tests'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {results && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Résultats des Tests
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Dossier Testé</div>
                                <div className="text-2xl font-bold">{results.dossierRef}</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Tests Exécutés</div>
                                <div className="text-2xl font-bold">{results.testsRun}</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Événements Créés</div>
                                <div className="text-2xl font-bold">{results.eventsCreated}</div>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Notifications Envoyées</div>
                                <div className="text-2xl font-bold">{results.notificationsSent}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Tests Réalisés :</h3>
                            <ul className="space-y-1">
                                {results.results.map((result: any, index: number) => (
                                    <li key={index} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        {result.test}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 border-t">
                            <Button asChild>
                                <a href={results.timelineUrl} target="_blank">
                                    Voir la Timeline Générée
                                </a>
                            </Button>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">📧 Notifications dans la Console</h4>
                            <p className="text-sm text-muted-foreground">
                                Ouvrez la console du navigateur (F12) pour voir les notifications simulées.
                                Chaque notification affiche le destinataire, le sujet et le contenu du message.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Que fait ce test ?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>✅ <strong>Création de dossier</strong> : Événement timeline + notification email</p>
                    <p>💰 <strong>Paiement reçu</strong> : Événement timeline + notification email</p>
                    <p>📅 <strong>RDV programmé</strong> : Événement timeline + notification SMS</p>
                    <p>📄 <strong>Acte généré</strong> : Événement timeline + notification email</p>
                    <p>🔄 <strong>Changement de statut</strong> : Événement timeline + notification email</p>
                    <p>✍️ <strong>Signature</strong> : Événement timeline</p>
                </CardContent>
            </Card>
        </div>
    );
}
