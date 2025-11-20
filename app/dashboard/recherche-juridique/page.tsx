'use client';

import { useState } from "react";
import { Search, BookOpen, Sparkles, Globe } from "lucide-react";

export default function RechercheJuridiquePage() {
    const [query, setQuery] = useState("");
    const [country, setCountry] = useState<string>("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState("");

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setResults([]);
        setAiResponse("");

        try {
            // Search with AI
            const response = await fetch('/api/legal-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, country: country || undefined }),
            });

            const data = await response.json();

            if (data.aiResponse) {
                setAiResponse(data.aiResponse);
            }
            if (data.results) {
                setResults(data.results);
            }
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCountryBadge = (country: string) => {
        const badges = {
            'SENEGAL': 'bg-green-100 text-green-800',
            'FRANCE': 'bg-blue-100 text-blue-800',
            'OHADA': 'bg-purple-100 text-purple-800',
            'AUTRE_AFRIQUE': 'bg-orange-100 text-orange-800',
        };
        return badges[country as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">📚 Bible Juridique Notariale</h1>
                <p className="text-muted-foreground mt-1">Recherche juridique spécialisée Sénégal • France • OHADA</p>
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Ex: code pénal sénégal, succession, donation..."
                        className="flex-1 h-12 rounded-md border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="h-12 rounded-md border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">🌍 Tous pays</option>
                        <option value="SENEGAL">🇸🇳 Sénégal</option>
                        <option value="FRANCE">🇫🇷 France</option>
                        <option value="OHADA">🌍 OHADA</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        disabled={loading || !query.trim()}
                        className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white hover:bg-slate-800 h-12 px-6 disabled:opacity-50"
                    >
                        <Search className="h-5 w-5 mr-2" />
                        Rechercher
                    </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    <span>Propulsé par DeepSeek AI (open source gratuit)</span>
                </div>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                    <p className="mt-4 text-muted-foreground">Recherche en cours...</p>
                </div>
            )}

            {aiResponse && !loading && (
                <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-6 space-y-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">Réponse de l'IA DeepSeek</h3>
                    </div>
                    <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{aiResponse}</p>
                    </div>
                </div>
            )}

            {results.length > 0 && !loading && (
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Références juridiques ({results.length})
                    </h3>
                    {results.map((result, index) => (
                        <div key={index} className="rounded-xl border bg-white p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <h4 className="font-medium">{result.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{result.summary}</p>
                                    {result.url && (
                                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center gap-1">
                                            <Globe className="h-3 w-3" />
                                            Voir la source officielle →
                                        </a>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCountryBadge(result.country)}`}>
                                        {result.country}
                                    </span>
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                                        {result.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !aiResponse && !results.length && query && (
                <div className="text-center py-12 text-muted-foreground">
                    Aucun résultat trouvé. Essayez une autre recherche.
                </div>
            )}
        </div>
    );
}
