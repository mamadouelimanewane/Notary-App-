"use client";

import PrintHeader from "./PrintHeader";

interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    type: 'PARTICULIER' | 'ENTREPRISE';
    companyName?: string;
}

interface PrintClientListProps {
    clients: Client[];
    filters?: {
        types?: string[];
        cities?: string[];
        searchQuery?: string;
    };
}

export default function PrintClientList({ clients, filters }: PrintClientListProps) {
    const hasFilters = filters && (
        (filters.types && filters.types.length > 0) ||
        (filters.cities && filters.cities.length > 0) ||
        (filters.searchQuery && filters.searchQuery.length > 0)
    );

    return (
        <div className="print-container p-8">
            <PrintHeader
                title="Liste des Clients"
                subtitle={`${clients.length} client${clients.length > 1 ? 's' : ''}`}
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
                            <p>• Type : {filters.types.join(', ')}</p>
                        )}
                        {filters.cities && filters.cities.length > 0 && (
                            <p>• Ville : {filters.cities.join(', ')}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Tableau des clients */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-slate-900">
                        <th className="text-left py-2 px-2 font-semibold text-sm">Nom</th>
                        <th className="text-left py-2 px-2 font-semibold text-sm">Email</th>
                        <th className="text-left py-2 px-2 font-semibold text-sm">Téléphone</th>
                        <th className="text-left py-2 px-2 font-semibold text-sm">Ville</th>
                        <th className="text-left py-2 px-2 font-semibold text-sm">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client, index) => (
                        <tr
                            key={client.id}
                            className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                        >
                            <td className="py-2 px-2 text-sm">
                                {client.type === 'ENTREPRISE' && client.companyName
                                    ? client.companyName
                                    : `${client.firstName} ${client.lastName}`}
                            </td>
                            <td className="py-2 px-2 text-sm">{client.email}</td>
                            <td className="py-2 px-2 text-sm">{client.phone}</td>
                            <td className="py-2 px-2 text-sm">{client.city}</td>
                            <td className="py-2 px-2 text-sm">
                                {client.type === 'PARTICULIER' ? 'Particulier' : 'Entreprise'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-slate-300 text-xs text-slate-600 text-center">
                <p>Total : {clients.length} client{clients.length > 1 ? 's' : ''}</p>
            </div>
        </div>
    );
}
