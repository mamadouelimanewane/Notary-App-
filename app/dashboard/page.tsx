import { db } from "@/lib/db";
import { DashboardStats } from "@/components/DashboardStats";
import { RecentDossiers } from "@/components/RecentDossiers";
import { QuickActions } from "@/components/QuickActions";
import { AdvancedAnalytics } from "@/components/AdvancedAnalytics";
import { Calendar, Sparkles } from "lucide-react";

export default function DashboardPage() {
    const stats = {
        clients: db.clients.length,
        dossiers: db.dossiers.length,
        dossiersEnCours: db.dossiers.filter((d) => d.status === "EN_COURS").length,
        actesSignes: db.actes.filter((a) => a.status === "SIGNE").length,
    };

    const recentDossiers = db.dossiers
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-8">
            {/* En-tête avec gradient élégant */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border border-primary/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <h1 className="text-4xl font-bold tracking-tight font-serif text-primary">
                                Tableau de Bord
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-lg">
                            Bienvenue, voici un aperçu de l'activité de votre étude notariale.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 backdrop-blur-sm border shadow-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium capitalize">
                            {formattedDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* Analytics Avancés */}
            <AdvancedAnalytics
                clients={db.clients}
                dossiers={db.dossiers}
                actes={db.actes}
            />

            {/* Actions Rapides */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-gradient-to-b from-primary to-purple-500 rounded-full" />
                    <h2 className="text-2xl font-bold tracking-tight font-serif text-primary">
                        Actions Rapides
                    </h2>
                </div>
                <QuickActions />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Dossiers Récents */}
                <div className="col-span-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-1 bg-gradient-to-b from-primary to-purple-500 rounded-full" />
                        <h2 className="text-2xl font-bold tracking-tight font-serif text-primary">
                            Dossiers Récents
                        </h2>
                    </div>
                    <RecentDossiers dossiers={recentDossiers} />
                </div>

                {/* Agenda / Widget */}
                <div className="col-span-3 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-1 bg-gradient-to-b from-primary to-purple-500 rounded-full" />
                        <h2 className="text-2xl font-bold tracking-tight font-serif text-primary">
                            Agenda du Jour
                        </h2>
                    </div>
                    <div className="rounded-2xl border bg-gradient-to-br from-card to-card/50 text-card-foreground shadow-lg h-full min-h-[300px] overflow-hidden">
                        <div className="p-6 flex flex-col space-y-1.5 border-b bg-gradient-to-r from-primary/5 to-purple-500/5">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-semibold leading-none tracking-tight">Rendez-vous</h3>
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-center h-48 text-center">
                            <div className="space-y-3">
                                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-full inline-block">
                                    <Calendar className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Aucun rendez-vous prévu aujourd'hui.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Profitez de cette journée pour avancer sur vos dossiers en cours.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
