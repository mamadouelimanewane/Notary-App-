"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Appointment, Client, Dossier } from "@/types/db";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgendaPageClientProps {
    appointments: Appointment[];
    clients: Client[];
    dossiers: Dossier[];
}

export default function AgendaPageClient({ appointments, clients, dossiers }: AgendaPageClientProps) {
    const [view, setView] = useState<'list' | 'calendar'>('list');

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

    // Group appointments by date for the list view
    const groupedAppointments = appointments.reduce((acc, apt) => {
        const dateKey = new Date(apt.date).toDateString();
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(apt);
        return acc;
    }, {} as Record<string, Appointment[]>);

    const sortedDates = Object.keys(groupedAppointments).sort((a, b) =>
        new Date(a).getTime() - new Date(b).getTime()
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight font-serif text-primary">Agenda</h1>
                <div className="flex items-center gap-2">
                    <div className="flex bg-muted rounded-lg p-1">
                        <button
                            onClick={() => setView('list')}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                view === 'list' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Liste
                        </button>
                        <button
                            onClick={() => setView('calendar')}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                view === 'calendar' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Calendrier
                        </button>
                    </div>
                    <Link
                        href="/dashboard/agenda/new"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 hover:bg-green-700 text-white h-10 px-4 py-2 shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nouveau RDV
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {appointments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-muted/10">
                            <div className="p-4 bg-muted rounded-full mb-4">
                                <Calendar className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">Aucun rendez-vous</h3>
                            <p className="text-muted-foreground mt-1 max-w-sm">
                                Votre agenda est vide pour le moment.
                            </p>
                            <Link
                                href="/dashboard/agenda/new"
                                className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white h-9 px-4 py-2"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Planifier un RDV
                            </Link>
                        </div>
                    ) : (
                        sortedDates.map((dateKey) => (
                            <div key={dateKey} className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
                                    {formatDate(dateKey)}
                                </h3>
                                <div className="space-y-3">
                                    {groupedAppointments[dateKey].map((apt) => (
                                        <div key={apt.id} className="group flex items-start space-x-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
                                            <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <span className="text-xs font-bold uppercase leading-none mb-0.5">
                                                    {formatTime(apt.date).split(':')[0]}
                                                </span>
                                                <span className="text-xs font-medium opacity-80 leading-none">
                                                    {formatTime(apt.date).split(':')[1]}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-semibold text-base truncate pr-2 group-hover:text-primary transition-colors">
                                                        {apt.title}
                                                    </h4>
                                                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                                                        {apt.duration} min
                                                    </span>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-y-1 gap-x-4">
                                                    {apt.clientId && (
                                                        <span className="flex items-center truncate">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0" />
                                                            {getClientName(apt.clientId)}
                                                        </span>
                                                    )}
                                                    {apt.dossierId && (
                                                        <span className="flex items-center truncate">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-2 flex-shrink-0" />
                                                            {getDossierRef(apt.dossierId)}
                                                        </span>
                                                    )}
                                                </div>

                                                {apt.notes && (
                                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 italic bg-muted/30 p-2 rounded-md">
                                                        "{apt.notes}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 sticky top-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif font-semibold text-lg">Aperçu</h3>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                <span className="font-medium">Aujourd'hui</span>
                                <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                                    {appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                <span className="font-medium">Demain</span>
                                <span className="bg-muted text-muted-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                                    {appointments.filter(a => {
                                        const tomorrow = new Date();
                                        tomorrow.setDate(tomorrow.getDate() + 1);
                                        return new Date(a.date).toDateString() === tomorrow.toDateString();
                                    }).length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                <span className="font-medium">Cette semaine</span>
                                <span className="bg-muted text-muted-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                                    {appointments.filter(a => {
                                        const now = new Date();
                                        const aptDate = new Date(a.date);
                                        const diffTime = Math.abs(aptDate.getTime() - now.getTime());
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        return diffDays <= 7 && aptDate >= now;
                                    }).length}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                Prochain Rendez-vous
                            </h4>
                            {appointments.length > 0 ? (
                                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                                    <div className="font-medium text-primary mb-1">
                                        {appointments[0].title}
                                    </div>
                                    <div className="text-sm text-muted-foreground mb-2">
                                        {formatDate(appointments[0].date)} à {formatTime(appointments[0].date)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Avec {getClientName(appointments[0].clientId)}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucun rendez-vous à venir.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
