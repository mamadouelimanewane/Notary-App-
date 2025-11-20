"use client";

import PrintHeader from "./PrintHeader";

interface Acte {
    id: string;
    type: string;
    category: string;
    title: string;
    createdAt: string;
    status: string;
}

interface PrintActeListProps {
    actes: Acte[];
    filters?: {
        types?: string[];
        categories?: string[];
        statuses?: string[];
        searchQuery?: string;
    };
}

export default function PrintActeList({ actes, filters }: PrintActeListProps) {
    const hasFilters = filters && (
        (filters.types && filters.types.length > 0) ||
        (filters.categories && filters.categories.length > 0) ||
        (filters.statuses && filters.statuses.length > 0) ||
        (filters.searchQuery && filters.searchQuery.length > 0)
    );

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'COMPROMIS': 'Compromis',
            'VENTE': 'Acte de Vente',
            'NOTORIETE': 'Notoriété',
            'DONATION_SIMPLE': 'Donation Simple',
            'TESTAMENT': 'Testament',
            'CONTRAT_MARIAGE': 'Contrat de Mariage',
        };
        return labels[type] || type;
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

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'BROUILLON': 'Brouillon',
            'SIGNE': 'Signé',
            'ENREGISTRE': 'Enregistré'
        };
        return labels[status] || status;
    };

    return (
        <div className="print-container p-8">
            <PrintHeader
                title="Liste des Actes"
                subtitle={`${actes.length} acte${actes.length > 1 ? 's' : ''}`}
            />

            {/* Filtres appliqués */}
            {hasFilters && (
                <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded">
                    <h3 className="text-sm font-semibold mb-2">Filtres appliqués :</h3>
                    <div className="text-xs text-slate-600">
                        {filters.searchQuery && (
                            <p>• Recherche : {filters.searchQuery}</p>
                        )}
                        {filters.types && filters.types.length > 0 && (
                            <p>• Type : {filters.types.map(t => getTypeLabel(t)).join(', ')}</p>
                        )}
                        {filters.categories && filters.categories.length > 0 && (
                            <p>• Catégorie : {filters.categories.map(c => getCategoryLabel(c)).join(', ')}</p>
                        )}
                        {filters.statuses && filters.statuses.length > 0 && (
                            <p>• Statut : {filters.statuses.map(s => getStatusLabel(s)).join(', ')}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Tableau des actes */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-slate-900">
                        <th className="text-left py-2 px-2 font-semibold text-sm">Titre</th>
                        <th className="text-left py-2 px-2 font-semibold text-sm">Type</th>
                        <th className="text-left py-2 px-2 font-semibold text-sm">Catégorie</th>
                        <th className="text-left py-2 px-2 font-semibold text-sm">Date</th>
                        <th className="text-left py-2 px-2 font-semibold text-sm">Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {actes.map((acte, index) => (
                        <tr
                            key={acte.id}
                            className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                        >
                            <td className="py-2 px-2 text-sm">{acte.title}</td>
                            <td className="py-2 px-2 text-sm">{getTypeLabel(acte.type)}</td>
                            <td className="py-2 px-2 text-sm">{getCategoryLabel(acte.category)}</td>
                            <td className="py-2 px-2 text-sm">
                                {new Date(acte.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-2 px-2 text-sm font-medium">{getStatusLabel(acte.status)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-slate-300 text-xs text-slate-600 text-center">
                <p>Total : {actes.length} acte{actes.length > 1 ? 's' : ''}</p>
            </div>
        </div>
    );
}
