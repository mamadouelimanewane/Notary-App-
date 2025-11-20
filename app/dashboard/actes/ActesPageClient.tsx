"use client";

import { FileText, Download } from "lucide-react";
import { generateCompromisPDF } from "@/lib/pdf-generator";
import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import FilterSelect from "@/components/FilterSelect";
import SortDropdown, { SortOption } from "@/components/SortDropdown";
import PrintButton from "@/components/PrintButton";
import PrintActeList from "@/components/print/PrintActeList";

interface ActesPageClientProps {
    actes: any[];
    dossiers: any[];
}

export default function ActesPageClient({ actes, dossiers }: ActesPageClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    const getDossierRef = (dossierId: string) => {
        const dossier = dossiers.find((d) => d.id === dossierId);
        return dossier ? dossier.ref : "Inconnu";
    };

    const handleRegenerate = (acte: any) => {
        if (acte.type === 'COMPROMIS' && acte.metadata.seller && acte.metadata.buyer && acte.metadata.property) {
            const dossier = dossiers.find((d) => d.id === acte.dossierId);
            if (dossier) {
                generateCompromisPDF(
                    { ref: getDossierRef(acte.dossierId), title: dossier.title },
                    acte.metadata.buyer,
                    acte.metadata.seller,
                    acte.metadata.property
                );
            }
        }
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'COMPROMIS': 'Compromis',
            'VENTE': 'Acte de Vente',
            'NOTORIETE': 'Notoriété',
            'DONATION_SIMPLE': 'Donation Simple',
            'DONATION_EPOUX': 'Donation entre Époux',
            'DONATION_PARTAGE': 'Donation-Partage',
            'TESTAMENT': 'Testament',
            'CONTRAT_MARIAGE': 'Contrat de Mariage',
            'PACS': 'PACS',
            'AUTRE': 'Autre'
        };
        return labels[type] || type;
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'BROUILLON': 'Brouillon',
            'SIGNE': 'Signé',
            'ENREGISTRE': 'Enregistré'
        };
        return labels[status] || status;
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'FAMILLE': 'Famille',
            'IMMOBILIER': 'Immobilier',
            'AFFAIRES': 'Affaires',
            'AUTRE': 'Autre'
        };
        return labels[category] || category;
    };

    // Get unique types, categories for filters
    const typeOptions = useMemo(() => {
        const uniqueTypes = Array.from(new Set(actes.map(a => a.type)));
        return uniqueTypes.map(type => ({ label: getTypeLabel(type), value: type }));
    }, [actes]);

    const categoryOptions = [
        { label: 'Famille', value: 'FAMILLE' },
        { label: 'Immobilier', value: 'IMMOBILIER' },
        { label: 'Affaires', value: 'AFFAIRES' },
        { label: 'Autre', value: 'AUTRE' }
    ];

    const statusOptions = [
        { label: 'Brouillon', value: 'BROUILLON' },
        { label: 'Signé', value: 'SIGNE' },
        { label: 'Enregistré', value: 'ENREGISTRE' }
    ];

    const sortOptions: SortOption[] = [
        { label: 'Date', field: 'createdAt' },
        { label: 'Type', field: 'type' },
        { label: 'Statut', field: 'status' },
        { label: 'Titre', field: 'title' }
    ];

    // Filter and sort actes
    const filteredActes = useMemo(() => {
        let result = [...actes];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(acte =>
                acte.title?.toLowerCase().includes(query) ||
                getTypeLabel(acte.type).toLowerCase().includes(query) ||
                getDossierRef(acte.dossierId).toLowerCase().includes(query)
            );
        }

        // Apply type filter
        if (selectedTypes.length > 0) {
            result = result.filter(acte => selectedTypes.includes(acte.type));
        }

        // Apply category filter
        if (selectedCategories.length > 0) {
            result = result.filter(acte => selectedCategories.includes(acte.category));
        }

        // Apply status filter
        if (selectedStatuses.length > 0) {
            result = result.filter(acte => selectedStatuses.includes(acte.status));
        }

        // Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.field as keyof typeof a];
                let bVal = b[sortConfig.field as keyof typeof b];

                // Handle date sorting
                if (sortConfig.field === 'createdAt') {
                    aVal = new Date(aVal as string).getTime();
                    bVal = new Date(bVal as string).getTime();
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [actes, searchQuery, selectedTypes, selectedCategories, selectedStatuses, sortConfig]);

    return (
        <div className="space-y-6">
            {/* Filters Section */}
            <div className="bg-white rounded-lg border p-4 space-y-4">
                <SearchBar
                    placeholder="Rechercher par titre ou type d'acte..."
                    onSearch={setSearchQuery}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FilterSelect
                        label="Type d'acte"
                        options={typeOptions}
                        selectedValues={selectedTypes}
                        onChange={setSelectedTypes}
                        multiSelect
                    />

                    <FilterSelect
                        label="Catégorie"
                        options={categoryOptions}
                        selectedValues={selectedCategories}
                        onChange={setSelectedCategories}
                        multiSelect
                    />

                    <FilterSelect
                        label="Statut"
                        options={statusOptions}
                        selectedValues={selectedStatuses}
                        onChange={setSelectedStatuses}
                        multiSelect
                    />
                </div>

                <SortDropdown
                    options={sortOptions}
                    currentSort={sortConfig}
                    onSort={(field, direction) => setSortConfig({ field, direction })}
                />
            </div>

            {/* Results Summary and Print Button */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                    {filteredActes.length} acte{filteredActes.length > 1 ? 's' : ''} trouvé{filteredActes.length > 1 ? 's' : ''}
                </div>
                <PrintButton
                    label="Imprimer la liste"
                    variant="outline"
                    onBeforePrint={() => setShowPrintPreview(true)}
                />
            </div>

            {/* Print Preview (hidden on screen, visible when printing) */}
            {showPrintPreview && (
                <div className="print-container hidden" data-print="show">
                    <PrintActeList
                        actes={filteredActes}
                        filters={{
                            types: selectedTypes,
                            categories: selectedCategories,
                            statuses: selectedStatuses,
                            searchQuery
                        }}
                    />
                </div>
            )}

            {/* Actes Table */}
            <div className="rounded-md border bg-white">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Titre</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Catégorie</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredActes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                        Aucun acte trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredActes.map((acte) => (
                                    <tr key={acte.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium flex items-center">
                                            <FileText className="mr-2 h-4 w-4 text-slate-500" />
                                            {acte.title}
                                        </td>
                                        <td className="p-4 align-middle">{getTypeLabel(acte.type)}</td>
                                        <td className="p-4 align-middle">{getCategoryLabel(acte.category)}</td>
                                        <td className="p-4 align-middle">{new Date(acte.createdAt).toLocaleDateString('fr-FR')}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${acte.status === 'SIGNE' ? 'bg-green-100 text-green-800' : acte.status === 'ENREGISTRE' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {getStatusLabel(acte.status)}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <button
                                                onClick={() => handleRegenerate(acte)}
                                                className="text-slate-900 hover:underline flex items-center justify-end ml-auto"
                                            >
                                                <Download className="mr-1 h-4 w-4" /> Télécharger
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
