import { db } from "@/lib/db";
import AgendaPageClient from "./AgendaPageClient";

export default function AgendaPage() {
    // Sort appointments by date ascending
    const appointments = db.appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const clients = db.clients;
    const dossiers = db.dossiers;

    return (
        <AgendaPageClient
            appointments={appointments}
            clients={clients}
            dossiers={dossiers}
        />
    );
}
