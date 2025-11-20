import { db } from "@/lib/db";
import GenerateForm from "./GenerateForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GeneratePage({ params }: { params: { id: string } }) {
    const dossier = db.dossiers.find((d) => d.id === params.id);

    if (!dossier) {
        return <div>Dossier non trouvé</div>;
    }

    const client = db.clients.find((c) => c.id === dossier.clientId);

    if (!client) {
        return <div>Client associé non trouvé</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/dossiers" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Générer un Acte</h1>
                    <p className="text-muted-foreground">Dossier : {dossier.title} ({dossier.ref})</p>
                </div>
            </div>

            <GenerateForm dossier={dossier} client={client} />
        </div>
    );
}
