'use client';

import { Archive, FolderArchive, Search } from "lucide-react";
import { useState, useMemo } from "react";
import type { Acte, Dossier } from "@/types/db";

interface ArchivesPageClientProps {
    actesArchives: Acte[];
    dossiersArchives: Dossier[];
}

export default function ArchivesPageClient({ actesArchives, dossiersArchives }: ArchivesPageClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Obtenir toutes les années disponibles
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        actesArchives.forEach(a => years.add(new Date(a.createdAt).getFullYear()));
        dossiersArchives.forEach(d => years.add(new Date(d.createdAt).getFullYear()));
        return Array.from(years).sort((a, b) => b - a);
    }, [actesArchives, dossiersArchives]);

    // Filtrer les archives
    const filteredActes = useMemo(() => {
        return actesArchives.filter(acte => {
            const year = new Date(acte.createdAt).getFullYear().toString();
            const matchesYear = selectedYear === "all" || year === selectedYear;
            const matchesCategory = selectedCategory === "all" || acte.category === selectedCategory;
            const matchesSearch = searchTerm === "" ||
                acte.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                acte.type.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesYear && matchesCategory && matchesSearch;
        });
    }, [actesArchives, selectedYear, selectedCategory, searchTerm]);

    const filteredDossiers = useMemo(() => {
        return dossiersArchives.filter(dossier => {
            const year = new Date(dossier.createdAt).getFullYear().toString();
            const matchesYear = selectedYear === "all" || year === selectedYear;
            const matchesSearch = searchTerm === "" ||
                dossier.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dossier.ref.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesYear && matchesSearch;
        });
    }, [dossiersArchives, selectedYear, searchTerm]);

    // Statistiques par catégorie
    const stats = useMemo(() => {
        const categories: Record<string, number> = {
            FAMILLE: 0,
            IMMOBILIER: 0,
            AFFAIRES: 0,
            AUTRE: 0,
        };
        filteredActes.forEach(acte => {
            if (acte.category in categories) {
                categories[acte.category]++;
            }
        });
        return categories;
    }, [filteredActes]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-serif text-primary">Archives</h1>
                    <p className="text-muted-foreground mt-1">Consultation et gestion des documents archivés</p>
                </div>
            </div>

            {/* Filtres et recherche */}
            <div className="rounded-xl border bg-card text-card-foreground p-4 shadow-sm">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Rechercher par titre, type ou référence..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">📅 Toutes les années</option>
                        {availableYears.map(year => (
                            <option key={year} value={year.toString()}>{year}</option>
                        ))}
                    </select>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">🏷️ Toutes les catégories</option>
                        <option value="FAMILLE">👨‍👩‍👧 Famille</option>
                        <option value="IMMOBILIER">🏠 Immobilier</option>
                        <option value="AFFAIRES">💼 Affaires</option>
                        <option value="AUTRE">📋 Autre</option>
                    </select>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Actes archivés</p>
                            <p className="text-3xl font-bold mt-2">{filteredActes.length}</p>
                        </div>
                        <Archive className="h-10 w-10 text-primary/50" />
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Dossiers archivés</p>
                            <p className="text-3xl font-bold mt-2">{filteredDossiers.length}</p>
                        </div>
                        <FolderArchive className="h-10 w-10 text-primary/50" />
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Répartition familiale</p>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Famille :</span>
                                <span className="font-semibold">{stats.FAMILLE}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Immobilier :</span>
                                <span className="font-semibold">{stats.IMMOBILIER}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Répartition autres</p>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Affaires :</span>
                                <span className="font-semibold">{stats.AFFAIRES}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Autre :</span>
                                <span className="font-semibold">{stats.AUTRE}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Résultats */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold font-serif text-foreground">📄 Actes archivés ({filteredActes.length})</h2>
                {filteredActes.length === 0 ? (
                    <div className="rounded-xl border bg-card text-card-foreground p-8 text-center text-muted-foreground border-dashed">
                        Aucun acte archivé trouvé
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {filteredActes.slice(0, 10).map(acte => (
                            <div key={acte.id} className="rounded-xl border bg-card text-card-foreground p-4 hover:shadow-md transition-shadow hover:border-primary/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">{acte.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {acte.type} • {new Date(acte.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary">
                                        {acte.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold font-serif text-foreground">📁 Dossiers archivés ({filteredDossiers.length})</h2>
                {filteredDossiers.length === 0 ? (
                    <div className="rounded-xl border bg-card text-card-foreground p-8 text-center text-muted-foreground border-dashed">
                        Aucun dossier archivé trouvé
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {filteredDossiers.slice(0, 10).map(dossier => (
                            <div key={dossier.id} className="rounded-xl border bg-card text-card-foreground p-4 hover:shadow-md transition-shadow hover:border-primary/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">{dossier.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Ref: {dossier.ref} • {new Date(dossier.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted text-muted-foreground">
                                        {dossier.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
