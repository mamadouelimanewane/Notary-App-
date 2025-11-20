import { db } from "@/lib/db";
import { DashboardStats } from "@/components/DashboardStats";
import { RecentDossiers } from "@/components/RecentDossiers";

export default function DashboardPage() {
    const stats = {
        clients: db.clients.length,
        dossiers: db.dossiers.length,
        dossiersEnCours: db.dossiers.filter((d) => d.status === "EN_COURS").length,
        actesSignes: 0, // Placeholder
    };

    const recentDossiers = db.dossiers
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
            <DashboardStats stats={stats} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <RecentDossiers dossiers={recentDossiers} />
                </div>
                <div className="col-span-3">
                    {/* Calendar or other widget */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6 flex flex-col space-y-1.5">
                            <h3 className="font-semibold leading-none tracking-tight">Agenda</h3>
                        </div>
                        <div className="p-6 pt-0">
                            <p className="text-sm text-muted-foreground">Aucun rendez-vous aujourd'hui.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
