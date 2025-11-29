'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, User, FolderOpen, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";

interface SearchResult {
    id: string;
    type: 'CLIENT' | 'DOSSIER' | 'ACTE';
    title: string;
    subtitle: string;
    description: string;
    url: string;
    date: string;
    status?: string;
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'actes' | 'dossiers' | 'clients'>('all');

    useEffect(() => {
        if (initialQuery) {
            handleSearch(initialQuery);
        }
    }, [initialQuery]);

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            // Update URL without reloading
            const params = new URLSearchParams(searchParams);
            params.set('q', searchQuery);
            router.push(`/dashboard/recherche?${params.toString()}`);

            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${filter}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(query);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'CLIENT': return <User className="h-5 w-5 text-blue-500" />;
            case 'DOSSIER': return <FolderOpen className="h-5 w-5 text-yellow-500" />;
            case 'ACTE': return <FileText className="h-5 w-5 text-red-500" />;
            default: return <Search className="h-5 w-5" />;
        }
    };

    const getStatusColor = (status?: string) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        switch (status) {
            case 'OUVERT': case 'VALIDE': return 'bg-green-100 text-green-800';
            case 'CLOTURE': case 'SIGNE': return 'bg-blue-100 text-blue-800';
            case 'ARCHIVE': return 'bg-gray-100 text-gray-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl font-bold font-serif text-primary">Recherche Documentaire</h1>
                <p className="text-muted-foreground text-lg">
                    Recherchez dans tous vos dossiers, actes et clients archivés ou actifs.
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-12 h-14 text-lg rounded-full shadow-sm border-2 focus-visible:ring-offset-2"
                        placeholder="Mots-clés, référence, nom..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <Button
                        className="absolute right-2 rounded-full px-6"
                        onClick={() => handleSearch(query)}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Rechercher'}
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                        className="rounded-full"
                    >
                        Tout
                    </Button>
                    <Button
                        variant={filter === 'actes' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('actes')}
                        className="rounded-full"
                    >
                        Actes
                    </Button>
                    <Button
                        variant={filter === 'dossiers' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('dossiers')}
                        className="rounded-full"
                    >
                        Dossiers
                    </Button>
                    <Button
                        variant={filter === 'clients' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('clients')}
                        className="rounded-full"
                    >
                        Clients
                    </Button>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">
                        Recherche en cours...
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid gap-4">
                        <div className="text-sm text-muted-foreground mb-2">
                            {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                        </div>
                        {results.map((result) => (
                            <Link href={result.url} key={result.id}>
                                <div className="group flex items-start p-4 bg-card rounded-lg border hover:shadow-md transition-all cursor-pointer">
                                    <div className="p-3 bg-muted/30 rounded-lg mr-4 group-hover:bg-primary/10 transition-colors">
                                        {getIcon(result.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary truncate">
                                                {result.title}
                                            </h3>
                                            {result.status && (
                                                <Badge variant="secondary" className={getStatusColor(result.status)}>
                                                    {result.status}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">
                                            {result.subtitle}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {result.description}
                                        </p>
                                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                            <span>Modifié le {new Date(result.date).toLocaleDateString('fr-FR')}</span>
                                            <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : query && !loading ? (
                    <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
                        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium">Aucun résultat trouvé</h3>
                        <p className="text-muted-foreground">
                            Essayez d'autres mots-clés ou vérifiez l'orthographe.
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
