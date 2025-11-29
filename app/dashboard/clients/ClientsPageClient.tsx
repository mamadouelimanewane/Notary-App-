"use client";

import { Plus, Edit, Building2, User as UserIcon, Mail, Phone, MapPin, Briefcase, Eye, Users, TrendingUp } from "lucide-react";
// import Link from "next/link"; // Removed to fix POST issue
import { useState, useMemo } from "react";
import { HeroSection, StatsCard, ModernSearchBar, FilterPills, ModernPageLayout, FilterOption } from "@/components/modern";
import { Card, CardContent } from "@/components/ui/card";
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
    const [selectedType, setSelectedType] = useState<string>("ALL");
    const [selectedCity, setSelectedCity] = useState<string>("ALL");
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    // Statistiques
    const stats = useMemo(() => {
        const particuliers = clients.filter(c => c.type === 'PARTICULIER').length;
        const entreprises = clients.filter(c => c.type === 'ENTREPRISE').length;
        const thisMonth = clients.filter(c => {
            if (!c.createdAt) return false;
            const created = new Date(c.createdAt);
            const now = new Date();
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;

        return {
            total: clients.length,
            particuliers,
            entreprises,
            thisMonth
        };
    }, [clients]);

    // Get unique cities for filter
    const cities = useMemo(() => {
        const uniqueCities = Array.from(new Set(clients.map(c => c.city).filter(Boolean)));
        return uniqueCities.sort();
    }, [clients]);

    // Filter options
    const typeFilters: FilterOption[] = [
        { id: 'ALL', label: 'Tous', icon: Users, count: clients.length },
        { id: 'PARTICULIER', label: 'Particuliers', icon: UserIcon, count: stats.particuliers, gradient: 'from-green-500 to-emerald-500' },
        { id: 'ENTREPRISE', label: 'Entreprises', icon: Building2, count: stats.entreprises, gradient: 'from-blue-500 to-cyan-500' }
    ];

    const cityFilters: FilterOption[] = [
        { id: 'ALL', label: 'Toutes les villes', icon: MapPin, count: clients.length },
        ...cities.map(city => ({
            id: city,
            label: city,
            icon: MapPin,
            count: clients.filter(c => c.city === city).length
        }))
    ];

    // Filter clients
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
        if (selectedType !== "ALL") {
            result = result.filter(client => client.type === selectedType);
        }

        // Apply city filter
        if (selectedCity !== "ALL") {
            result = result.filter(client => client.city === selectedCity);
        }

        return result;
    }, [clients, searchQuery, selectedType, selectedCity]);

    return (
        <ModernPageLayout>
            {/* Hero Section */}
            <HeroSection
                title="Clients"
                description="Gérez votre portefeuille de clients particuliers et entreprises"
                icon={Users}
                stats={[
                    { label: 'Total', value: stats.total },
                    { label: 'Ce mois', value: stats.thisMonth }
                ]}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Clients"
                    value={stats.total}
                    icon={Users}
                    gradient="from-blue-500 to-cyan-500"
                    description="Clients enregistrés"
                    trend={{ value: "+12%", isPositive: true }}
                />
                <StatsCard
                    title="Particuliers"
                    value={stats.particuliers}
                    icon={UserIcon}
                    gradient="from-green-500 to-emerald-500"
                    description="Clients particuliers"
                />
                <StatsCard
                    title="Entreprises"
                    value={stats.entreprises}
                    icon={Building2}
                    gradient="from-purple-500 to-pink-500"
                    description="Clients entreprises"
                />
                <StatsCard
                    title="Ce Mois"
                    value={stats.thisMonth}
                    icon={TrendingUp}
                    gradient="from-orange-500 to-red-500"
                    description="Nouveaux clients"
                    trend={{ value: "+8%", isPositive: true }}
                />
            </div>

            {/* Search and Filters */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                    {/* Search Bar */}
                    <ModernSearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Rechercher par nom, email, téléphone ou société..."
                    />

                    {/* Type Filters */}
                    <div>
                        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Type de client</h3>
                        <FilterPills
                            options={typeFilters}
                            selected={selectedType}
                            onSelect={setSelectedType}
                        />
                    </div>

                    {/* City Filters */}
                    {cities.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Ville</h3>
                            <FilterPills
                                options={cityFilters.slice(0, 10)}
                                selected={selectedCity}
                                onSelect={setSelectedCity}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground font-medium">
                            {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} trouvé{filteredClients.length > 1 ? 's' : ''}
                        </div>
                        <div className="flex gap-3">
                            <PrintButton
                                label="Imprimer"
                                variant="outline"
                                onBeforePrint={() => setShowPrintPreview(true)}
                            />
                            <a
                                href="/dashboard/clients/new"
                                onClick={(e) => { e.preventDefault(); window.location.href = '/dashboard/clients/new'; }}
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-11 px-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                            >
                                <Plus className="mr-2 h-5 w-5" /> Nouveau Client
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Print Preview (hidden on screen, visible when printing) */}
            {showPrintPreview && (
                <div className="print-container hidden" data-print="show">
                    <PrintClientList
                        clients={filteredClients}
                        filters={{
                            types: selectedType !== "ALL" ? [selectedType] : [],
                            cities: selectedCity !== "ALL" ? [selectedCity] : [],
                            searchQuery
                        }}
                    />
                </div>
            )}

            {/* Results Grid */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredClients.map((client) => {
                            const isCompany = client.type === 'ENTREPRISE';
                            const displayName = isCompany && client.companyName
                                ? client.companyName
                                : `${client.firstName} ${client.lastName}`;

                            return (
                                <div
                                    key={client.id}
                                    className={`group relative border-2 rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white hover:-translate-y-2 overflow-hidden ${isCompany
                                        ? 'border-blue-200 hover:border-blue-300'
                                        : 'border-green-200 hover:border-green-300'
                                        }`}
                                >
                                    {/* Gradient overlay on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${isCompany
                                        ? 'from-blue-500 to-cyan-500'
                                        : 'from-green-500 to-emerald-500'
                                        } opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                                    <div className="relative z-10">
                                        {/* Header */}
                                        <div className="flex items-start gap-4 mb-3">
                                            <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${isCompany
                                                ? 'bg-gradient-to-br from-blue-50 to-cyan-100'
                                                : 'bg-gradient-to-br from-green-50 to-emerald-100'
                                                }`}>
                                                {isCompany ? (
                                                    <Building2 className="h-6 w-6 text-blue-700" />
                                                ) : (
                                                    <UserIcon className="h-6 w-6 text-green-700" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-bold text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 ${isCompany ? 'text-blue-700' : 'text-green-700'
                                                    }`}>
                                                    {displayName}
                                                </h3>
                                                {isCompany && client.contactPerson && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Contact: {client.contactPerson}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className="truncate text-muted-foreground">{client.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className="font-medium">{client.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className="font-medium">{client.city}</span>
                                            </div>
                                            {isCompany && client.ninea && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <span className="text-xs text-muted-foreground">NINEA: {client.ninea}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <a
                                            href={`/dashboard/clients/${client.id}`}
                                            onClick={(e) => { e.preventDefault(); window.location.href = `/dashboard/clients/${client.id}`; }}
                                            className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${isCompany
                                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>Voir le profil</span>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty State */}
                        {filteredClients.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center p-16 text-center">
                                <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4">
                                    <UserIcon className="h-16 w-16 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Aucun client trouvé</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    Essayez de modifier vos filtres ou ajoutez un nouveau client pour commencer.
                                </p>
                                <a
                                    href="/dashboard/clients/new"
                                    onClick={(e) => { e.preventDefault(); window.location.href = '/dashboard/clients/new'; }}
                                    className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-11 px-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                                >
                                    <Plus className="mr-2 h-5 w-5" /> Ajouter mon premier client
                                </a>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </ModernPageLayout>
    );
}
