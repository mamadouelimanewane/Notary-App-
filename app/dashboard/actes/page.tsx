import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import ActesPageClient from "./ActesPageClient";

export default function ActesPage() {
    const actes = db.actes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const dossiers = db.dossiers;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Actes & Documents</h1>
            </div>

            <ActesPageClient actes={actes} dossiers={dossiers} />
        </div>
    );
}
