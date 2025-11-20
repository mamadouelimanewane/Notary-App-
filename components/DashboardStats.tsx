import { Users, FolderOpen, FileCheck, Activity } from "lucide-react";

interface StatsProps {
    stats: {
        clients: number;
        dossiers: number;
        dossiersEnCours: number;
        actesSignes: number;
    };
}

export function DashboardStats({ stats }: StatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Total Clients</h3>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{stats.clients}</div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Dossiers</h3>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{stats.dossiers}</div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">En Cours</h3>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{stats.dossiersEnCours}</div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Actes Signés</h3>
                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{stats.actesSignes}</div>
            </div>
        </div>
    );
}
