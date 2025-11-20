import { db } from "@/lib/db";
import { Plus, Folder, FileText } from "lucide-react";
import Link from "next/link";

export default function DossiersPage() {
    const dossiers = db.dossiers;
    const clients = db.clients;

    const getClientName = (clientId: string) => {
        const client = clients.find((c) => c.id === clientId);
        return client ? `${client.firstName} ${client.lastName}` : "Inconnu";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dossiers</h1>
                <Link href="/dashboard/dossiers/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-slate-900 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Nouveau Dossier
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dossiers.map((dossier) => (
                    <div key={dossier.id} className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6 flex flex-col space-y-1.5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold leading-none tracking-tight flex items-center">
                                    <Folder className="mr-2 h-4 w-4 text-slate-500" />
                                    {dossier.ref}
                                </h3>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${dossier.status === 'EN_COURS' ? 'bg-blue-100 text-blue-800' :
                                    dossier.status === 'OUVERT' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {dossier.status}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground pt-2">{dossier.title}</p>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-sm">
                                <p className="font-medium">Client:</p>
                                <p className="text-muted-foreground">{getClientName(dossier.clientId)}</p>
                            </div>
                            <div className="text-sm mt-2">
                                <p className="font-medium">Type:</p>
                                <p className="text-muted-foreground">{dossier.type}</p>
                            </div>
                        </div>
                        <div className="p-6 pt-0 flex justify-between items-center">
                            <Link href={`/dashboard/dossiers/${dossier.id}/generate`} className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline">
                                <FileText className="inline-block mr-1 h-4 w-4" /> Générer Acte
                            </Link>
                            <Link href={`/dashboard/dossiers/${dossier.id}`} className="text-sm font-medium text-slate-900 hover:underline">
                                Ouvrir le dossier &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
                {dossiers.length === 0 && (
                    <div className="col-span-full p-12 text-center text-muted-foreground border border-dashed rounded-xl">
                        Aucun dossier trouvé.
                    </div>
                )}
            </div>
        </div>
    );
}
