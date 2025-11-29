import { db } from "@/lib/db";
import ClientsPageClient from "./ClientsPageClient";

// Désactiver le cache en dev, activer en production
export const dynamic = 'auto';

export default function ClientsPage() {
    const clients = db.clients.filter(c => !c.isDeleted);

    return <ClientsPageClient clients={clients} />;
}
