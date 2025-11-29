import { db } from "@/lib/db";
import DossiersPageClient from "./DossiersPageClient";

// Désactiver le cache en dev, activer en production
export const dynamic = 'auto';

export default function DossiersPage() {
    const dossiers = db.dossiers;
    const clients = db.clients;
    const users = db.users;

    return (
        <DossiersPageClient
            initialDossiers={dossiers}
            clients={clients}
            users={users}
        />
    );
}
