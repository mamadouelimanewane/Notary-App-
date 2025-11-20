'use client';

import { useState } from "react";
import { Search, BookOpen, Sparkles } from "lucide-react";

export default function RechercheJuridiquePage() {
    const [query, setQuery] = useState("");
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
                body: JSON.stringify({ query }),
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

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Recherche Juridique</h1>
                <p className="text-muted-foreground mt-1">Recherchez des informations juridiques avec l'aide de l'IA</p>
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Ex: Quelle est la différence entre donation simple et donation-partage ?"
                        className="flex-1 h-12 rounded-md border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
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
                    <span>Propulsé par Gemini AI (gratuit)</span>
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
                        <h3 className="font-semibold text-lg">Réponse de l'IA</h3>
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
                        Références juridiques
                    </h3>
                    {results.map((result, index) => (
                        <div key={index} className="rounded-xl border bg-white p-4 hover:shadow-md transition-shadow">
                            <h4 className="font-medium">{result.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{result.summary}</p>
                            {result.url && (
                                <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                                    Voir sur Légifrance →
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
