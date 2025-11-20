import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ClientDetailPageClient from "./ClientDetailPageClient";

export default function ClientDetailPage({ params }: { params: { id: string } }) {
    const client = db.getClient(params.id);

    if (!client) {
        redirect('/dashboard/clients');
    }

    const dossiers = db.dossiers.filter(d => d.clientId === params.id);

    return <ClientDetailPageClient client={client} dossiers={dossiers} />;
}
