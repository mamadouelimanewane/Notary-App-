import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import DossierDetailsClient from "./DossierDetailsClient";

interface PageProps {
    params: {
        id: string;
    };
}

export default function DossierDetailsPage({ params }: PageProps) {
    const dossier = db.dossiers.find((d) => d.id === params.id);

    if (!dossier) {
        notFound();
    }

    const client = db.clients.find((c) => c.id === dossier.clientId);
    const tasks = db.getTasksByDossier(dossier.id);
    const actes = db.getActesByDossier(dossier.id);
    const documents = db.getDossierDocuments(dossier.id);
    const users = db.users;
    const workflow = dossier.workflowId ? db.workflowInstances.find(w => w.id === dossier.workflowId) : undefined;

    return (
        <DossierDetailsClient
            dossier={dossier}
            client={client}
            tasks={tasks}
            actes={actes}
            documents={documents}
            users={users}
            workflow={workflow}
        />
    );
}
