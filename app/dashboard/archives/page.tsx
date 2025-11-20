import { db } from "@/lib/db";
import ArchivesPageClient from "./ArchivesPageClient";

export default function ArchivesPage() {
    const actesArchives = db.actes.filter(a => a.status === 'ENREGISTRE');
    const dossiersArchives = db.dossiers.filter(d => d.status === 'ARCHIVE');

    return <ArchivesPageClient actesArchives={actesArchives} dossiersArchives={dossiersArchives} />;
}
