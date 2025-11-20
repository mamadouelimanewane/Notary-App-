import { db } from "@/lib/db";
import Link from "next/link";
import { Archive, FolderArchive, Plus } from "lucide-react";

export default function ArchivesPage() {
    const actesArchives = db.actes.filter(a => a.status === 'ENREGISTRE');
    const dossiersArchives = db.dossiers.filter(d => d.status === 'ARCHIVE');

    const archives = [
        {
            id: '2024',
            name: 'Archives 2024',
            year: 2024,
            actesCount: actesArchives.filter(a => new Date(a.createdAt).getFullYear() === 2024).length,
            dossiersCount: dossiersArchives.filter(d => new Date(d.createdAt).getFullYear() === 2024).length,
            isOpen: true
        },
        {
            id: '2023',
            name: 'Archives 2023',
            year: 2023,
            actesCount: actesArchives.filter(a => new Date(a.createdAt).getFullYear() === 2023).length,
            dossiersCount: dossiersArchives.filter(d => new Date(d.createdAt).getFullYear() === 2023).length,
            isOpen: false
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Archives</h1>
                    <p className="text-muted-foreground mt-1">Gestion et consultation des archives</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Actes archivés</p>
                            <p className="text-3xl font-bold mt-2">{actesArchives.length}</p>
                        </div>
                        <Archive className="h-10 w-10 text-slate-400" />
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Dossiers archivés</p>
                            <p className="text-3xl font-bold mt-2">{dossiersArchives.length}</p>
                        </div>
                        <FolderArchive className="h-10 w-10 text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Archives par année</h2>
                {archives.map(archive => (
                    <div key={archive.id} className="rounded-xl border bg-white p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Archive className="h-8 w-8 text-slate-600" />
                                <div>
                                    <h3 className="font-semibold text-lg">{archive.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {archive.actesCount} actes • {archive.dossiersCount} dossiers
                                        {archive.isOpen ? ' • Ouverte' : ' • Fermée'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                {archive.isOpen ? (
                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                                        Fermée
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
