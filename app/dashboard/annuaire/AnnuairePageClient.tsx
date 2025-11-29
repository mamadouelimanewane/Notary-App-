"use client";

import { Phone, Mail, User, Building2, MapPin, Search, Users } from "lucide-react";
import { useState, useMemo } from "react";
import { HeroSection, StatsCard, ModernSearchBar, FilterPills, ModernPageLayout, FilterOption } from "@/components/modern";
import { Card, CardContent } from "@/components/ui/card";

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
    contactPerson?: string;
}

interface UserType {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
}

interface AnnuairePageClientProps {
    clients: Client[];
    users: UserType[];
}

export default function AnnuairePageClient({ clients, users }: AnnuairePageClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("ALL");

    // Combiner les données
    const contacts = useMemo(() => {
        const clientContacts = clients.map(c => ({
            id: c.id,
            type: c.type === 'ENTREPRISE' ? 'ENTREPRISE' : 'CLIENT',
            name: c.type === 'ENTREPRISE' && c.companyName ? c.companyName : `${c.firstName} ${c.lastName}`,
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            phone: c.phone,
            address: c.address,
            city: c.city,
            zipCode: c.zipCode,
            companyName: c.companyName,
            contactPerson: c.contactPerson
        }));

        const userContacts = users.map(u => ({
            id: u.id,
            type: 'COLLABORATEUR',
            name: `${u.firstName} ${u.lastName}`,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            phone: u.phone || 'Non renseigné',
            role: u.role,
            address: '',
            city: '',
            zipCode: ''
        }));

        return [...clientContacts, ...userContacts];
    }, [clients, users]);

    // Stats
    const stats = useMemo(() => ({
        total: contacts.length,
        clients: contacts.filter(c => c.type === 'CLIENT').length,
        entreprises: contacts.filter(c => c.type === 'ENTREPRISE').length,
        collaborateurs: contacts.filter(c => c.type === 'COLLABORATEUR').length
    }), [contacts]);

    // Filtres
    const typeFilters: FilterOption[] = [
        { id: 'ALL', label: 'Tous', icon: Users, count: stats.total },
        { id: 'CLIENT', label: 'Clients', icon: User, count: stats.clients, gradient: 'from-green-500 to-emerald-500' },
        { id: 'ENTREPRISE', label: 'Entreprises', icon: Building2, count: stats.entreprises, gradient: 'from-blue-500 to-cyan-500' },
        { id: 'COLLABORATEUR', label: 'Collaborateurs', icon: Users, count: stats.collaborateurs, gradient: 'from-purple-500 to-pink-500' }
    ];

    // Filtrage
    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => {
            const matchesSearch = searchQuery === '' ||
                contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.phone.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = selectedType === 'ALL' || contact.type === selectedType;

            return matchesSearch && matchesType;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [contacts, searchQuery, selectedType]);

    // Grouper par lettre
    const groupedContacts = useMemo(() => {
        const groups: Record<string, typeof filteredContacts> = {};
        filteredContacts.forEach(contact => {
            const firstLetter = contact.name[0].toUpperCase();
            if (!groups[firstLetter]) {
                groups[firstLetter] = [];
            }
            groups[firstLetter].push(contact);
        });
        return groups;
    }, [filteredContacts]);

    const getContactGradient = (type: string) => {
        switch (type) {
            case 'CLIENT': return 'from-green-500 to-emerald-500';
            case 'ENTREPRISE': return 'from-blue-500 to-cyan-500';
            case 'COLLABORATEUR': return 'from-purple-500 to-pink-500';
            default: return 'from-gray-500 to-slate-500';
        }
    };

    const getContactIcon = (type: string) => {
        switch (type) {
            case 'CLIENT': return User;
            case 'ENTREPRISE': return Building2;
            case 'COLLABORATEUR': return Users;
            default: return User;
        }
    };

    return (
        <ModernPageLayout>
            {/* Hero Section */}
            <HeroSection
                title="Annuaire Téléphonique"
                description="Répertoire complet des clients, entreprises et collaborateurs"
                icon={Phone}
                stats={[
                    { label: 'Total', value: stats.total },
                    { label: 'Collaborateurs', value: stats.collaborateurs }
                ]}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Contacts"
                    value={stats.total}
                    icon={Phone}
                    gradient="from-blue-500 to-cyan-500"
                    description="Dans l'annuaire"
                />
                <StatsCard
                    title="Clients"
                    value={stats.clients}
                    icon={User}
                    gradient="from-green-500 to-emerald-500"
                    description="Particuliers"
                />
                <StatsCard
                    title="Entreprises"
                    value={stats.entreprises}
                    icon={Building2}
                    gradient="from-blue-500 to-cyan-500"
                    description="Professionnels"
                />
                <StatsCard
                    title="Collaborateurs"
                    value={stats.collaborateurs}
                    icon={Users}
                    gradient="from-purple-500 to-pink-500"
                    description="Équipe interne"
                />
            </div>

            {/* Search and Filters */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                    {/* Search Bar */}
                    <ModernSearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Rechercher par nom, email ou téléphone..."
                    />

                    {/* Type Filters */}
                    <div>
                        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Type de contact</h3>
                        <FilterPills
                            options={typeFilters}
                            selected={selectedType}
                            onSelect={setSelectedType}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground font-medium">
                            {filteredContacts.length} contact{filteredContacts.length > 1 ? 's' : ''} trouvé{filteredContacts.length > 1 ? 's' : ''}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results - Grouped by Letter */}
            {Object.keys(groupedContacts).length === 0 ? (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-16">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4">
                                <Phone className="h-16 w-16 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Aucun contact trouvé</h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                Essayez de modifier vos critères de recherche.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    {Object.keys(groupedContacts).sort().map(letter => (
                        <div key={letter}>
                            {/* Letter Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <span className="text-xl font-bold text-white">{letter}</span>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    {letter}
                                </h2>
                                <span className="text-sm text-muted-foreground">
                                    ({groupedContacts[letter].length})
                                </span>
                            </div>

                            {/* Contacts Grid */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {groupedContacts[letter].map(contact => {
                                    const gradient = getContactGradient(contact.type);
                                    const Icon = getContactIcon(contact.type);

                                    return (
                                        <div
                                            key={contact.id}
                                            className="group relative border-2 border-gray-200 hover:border-blue-300 rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white hover:-translate-y-2 overflow-hidden"
                                        >
                                            {/* Gradient overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                                            <div className="relative z-10">
                                                {/* Header */}
                                                <div className="flex items-start gap-4 mb-3">
                                                    <div className={`p-3 bg-gradient-to-br ${gradient} bg-opacity-10 rounded-xl group-hover:scale-110 transition-transform`}>
                                                        <Icon className="h-6 w-6 text-blue-700" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-base mb-1 text-blue-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                            {contact.name}
                                                        </h3>
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} bg-opacity-10 text-blue-700`}>
                                                            {contact.type === 'COLLABORATEUR' ? (contact as any).role : contact.type}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Contact Info */}
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                                        <a href={`tel:${contact.phone}`} className="font-medium hover:text-blue-600 transition-colors">
                                                            {contact.phone}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                                        <a href={`mailto:${contact.email}`} className="truncate text-muted-foreground hover:text-blue-600 transition-colors">
                                                            {contact.email}
                                                        </a>
                                                    </div>
                                                    {contact.city && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                                            <span className="text-muted-foreground">{contact.city}</span>
                                                        </div>
                                                    )}
                                                    {contact.contactPerson && (
                                                        <div className="text-xs text-muted-foreground">
                                                            Contact: {contact.contactPerson}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ModernPageLayout>
    );
}
