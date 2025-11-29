import { Dossier } from "@/types/db";
import Link from "next/link";

export function RecentDossiers({ dossiers }: { dossiers: Dossier[] }) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-1.5">
                <h3 className="font-semibold leading-none tracking-tight">Dossiers Récents</h3>
                <p className="text-sm text-muted-foreground">
                    Derniers dossiers modifiés ou créés.
                </p>
            </div>
            <div className="p-6 pt-0">
                <div className="space-y-8">
                    {dossiers.map((dossier) => (
                        <div key={dossier.id} className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{dossier.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {dossier.ref} - {dossier.type}
                                </p>
                            </div>
                            <div className="ml-auto font-medium">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${dossier.status === 'EN_COURS' ? 'bg-blue-100 text-blue-800' :
                                    dossier.status === 'OUVERT' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {dossier.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {dossiers.length === 0 && (
                        <p className="text-sm text-muted-foreground">Aucun dossier récent.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
