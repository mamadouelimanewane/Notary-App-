"use client";

import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import FilterSelect from "@/components/FilterSelect";
import SortDropdown, { SortOption } from "@/components/SortDropdown";
import PrintButton from "@/components/PrintButton";
import PrintClientList from "@/components/print/PrintClientList";

interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    type: 'PARTICULIER' | 'ENTREPRISE';
    companyName?: string;
    ninea?: string;
    legalForm?: string;
    registrationNumber?: string;
    contactPerson?: string;
    isDeleted?: boolean;
    createdAt?: string;
}

interface ClientsPageClientProps {
    clients: Client[];
}

export default function ClientsPageClient({ clients }: ClientsPageClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    // Get unique cities for filter
    const cities = useMemo(() => {
        const uniqueCities = Array.from(new Set(clients.map(c => c.city).filter(Boolean)));
        return uniqueCities.map(city => ({ label: city, value: city }));
    }, [clients]);

    const typeOptions = [
        { label: 'Particulier', value: 'PARTICULIER' },
        { label: 'Entreprise', value: 'ENTREPRISE' }
    ];

    const sortOptions: SortOption[] = [
        { label: 'Nom', field: 'lastName' },
        { label: 'Email', field: 'email' },
        { label: 'Ville', field: 'city' },
        { label: 'Type', field: 'type' }
    ];

    // Filter and sort clients
    const filteredClients = useMemo(() => {
        let result = [...clients];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(client =>
                client.firstName?.toLowerCase().includes(query) ||
                client.lastName?.toLowerCase().includes(query) ||
                client.email?.toLowerCase().includes(query) ||
                client.phone?.toLowerCase().includes(query) ||
                client.companyName?.toLowerCase().includes(query)
            );
        }

        // Apply type filter
        if (selectedTypes.length > 0) {
            result = result.filter(client => selectedTypes.includes(client.type));
        }

        // Apply city filter
        if (selectedCities.length > 0) {
            result = result.filter(client => selectedCities.includes(client.city));
        }

        // Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.field as keyof typeof a] || '';
                const bVal = b[sortConfig.field as keyof typeof b] || '';

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [clients, searchQuery, selectedTypes, selectedCities, sortConfig]);

    return (
        <div className="space-y-6">
            {/* Filters Section */}
            <div className="bg-white rounded-lg border p-4 space-y-4">
                <SearchBar
                    placeholder="Rechercher par nom, email, téléphone ou société..."
                    onSearch={setSearchQuery}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FilterSelect
                        label="Type de client"
                        options={typeOptions}
                        selectedValues={selectedTypes}
                        onChange={setSelectedTypes}
                        multiSelect
                    />

                    <FilterSelect
                        label="Ville"
                        options={cities}
                        selectedValues={selectedCities}
                        onChange={setSelectedCities}
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
                    {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} trouvé{filteredClients.length > 1 ? 's' : ''}
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
                    <PrintClientList
                        clients={filteredClients}
                        filters={{
                            types: selectedTypes,
                            cities: selectedCities,
                            searchQuery
                        }}
                    />
                </div>
            )}

            {/* Clients Table */}
            <div className="rounded-md border bg-white">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Téléphone</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ville</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">
                                        {client.type === 'ENTREPRISE' && client.companyName
                                            ? client.companyName
                                            : `${client.firstName} ${client.lastName}`}
                                    </td>
                                    <td className="p-4 align-middle">{client.email}</td>
                                    <td className="p-4 align-middle">{client.phone}</td>
                                    <td className="p-4 align-middle">{client.city}</td>
                                    <td className="p-4 align-middle">
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-slate-100 text-slate-900">
                                            {client.type === 'PARTICULIER' ? 'Particulier' : 'Entreprise'}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Link
                                            href={`/dashboard/clients/${client.id}`}
                                            className="text-slate-900 hover:underline inline-flex items-center"
                                        >
                                            <Edit className="mr-1 h-3 w-3" />
                                            Voir
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredClients.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                        Aucun client trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
