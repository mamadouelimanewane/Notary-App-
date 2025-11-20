import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ActeDetailPageClient from "./ActeDetailPageClient";

export default function ActeDetailPage({ params }: { params: { id: string } }) {
    const acte = db.getActe(params.id);

    if (!acte) {
        redirect('/dashboard/actes');
    }

    const dossier = db.dossiers.find(d => d.id === acte.dossierId);

    return <ActeDetailPageClient acte={acte} dossier={dossier || null} />;
}
