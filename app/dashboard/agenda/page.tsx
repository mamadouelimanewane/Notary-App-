import { db } from "@/lib/db";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default function AgendaPage() {
    const appointments = db.appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const clients = db.clients;
    const dossiers = db.dossiers;

    const getClientName = (clientId?: string) => {
        if (!clientId) return "N/A";
        const client = clients.find((c) => c.id === clientId);
        return client ? `${client.firstName} ${client.lastName}` : "Inconnu";
    };

    const getDossierRef = (dossierId?: string) => {
        if (!dossierId) return "";
        const dossier = dossiers.find((d) => d.id === dossierId);
        return dossier ? `(Dossier: ${dossier.ref})` : "";
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
                <Link href="/dashboard/agenda/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-slate-900 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Nouveau Rendez-vous
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    {appointments.length === 0 ? (
                        <div className="text-center p-12 border border-dashed rounded-xl text-muted-foreground">
                            Aucun rendez-vous prévu.
                        </div>
                    ) : (
                        appointments.map((apt) => (
                            <div key={apt.id} className="flex items-start space-x-4 p-4 rounded-xl border bg-card text-card-foreground shadow hover:bg-muted/50 transition-colors">
                                <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-lg text-blue-700">
                                    <span className="text-xs font-semibold uppercase">{new Date(apt.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                    <span className="text-xl font-bold">{new Date(apt.date).getDate()}</span>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-lg">{apt.title}</h3>
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                            {formatTime(apt.date)} ({apt.duration} min)
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center">
                                        <Calendar className="mr-1 h-3 w-3" /> {formatDate(apt.date)}
                                    </p>
                                    <div className="flex items-center text-sm text-slate-600 mt-2">
                                        <span className="font-medium mr-2">Client:</span> {getClientName(apt.clientId)} {getDossierRef(apt.dossierId)}
                                    </div>
                                    {apt.notes && (
                                        <p className="text-sm text-muted-foreground mt-2 italic">
                                            "{apt.notes}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-semibold mb-4">Prochains jours</h3>
                        <div className="space-y-2">
                            {/* Placeholder for a mini calendar widget or list */}
                            <div className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted cursor-pointer">
                                <span>Aujourd'hui</span>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">2</span>
                            </div>
                            <div className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted cursor-pointer">
                                <span>Demain</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">0</span>
                            </div>
                            <div className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted cursor-pointer">
                                <span>Cette semaine</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
