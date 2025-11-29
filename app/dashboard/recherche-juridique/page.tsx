'use client';

import { useState } from "react";
import { Search, BookOpen, Sparkles, AlertCircle, FileText } from "lucide-react";
import { LegalArticle } from "@/lib/ai/legal-data";

interface SearchResponse {
    answer: string;
    sources: LegalArticle[];
}

export default function RechercheJuridiquePage() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setResponse(null);
        setError("");

        try {
            const res = await fetch('/api/ai/legal-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            if (!res.ok) throw new Error("Erreur lors de la recherche");

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            console.error(err);
            setError("Impossible d'effectuer la recherche pour le moment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4">
                    <BookOpen className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">Recherche Juridique OHADA</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Posez vos questions en langage naturel. Notre IA analyse les Actes Uniformes pour vous répondre avec précision.
                </p>
            </div>

            {/* Barre de Recherche */}
            <div className="relative max-w-2xl mx-auto">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Ex: Quel est le capital minimum d'une SARL ? Délai de prescription commerciale ?"
                        className="w-full h-14 pl-12 pr-32 rounded-full border-2 border-slate-200 shadow-sm text-lg focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading || !query.trim()}
                        className="absolute right-2 h-10 px-6 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? '...' : 'Rechercher'}
                    </button>
                </div>
                <p className="text-xs text-center mt-2 text-slate-400">
                    <Sparkles className="inline h-3 w-3 mr-1" />
                    Recherche Sémantique & RAG (Retrieval-Augmented Generation)
                </p>
            </div>

            {/* Erreur */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </div>
            )}

            {/* Résultats */}
            {response && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Réponse IA */}
                    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 border-b border-indigo-100 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-indigo-600" />
                            <h3 className="font-semibold text-indigo-900">Réponse Synthétique</h3>
                        </div>
                        <div className="p-6 prose prose-indigo max-w-none text-slate-700 leading-relaxed">
                            {response.answer.split('\n').map((line, i) => (
                                <p key={i} className="mb-2">{line}</p>
                            ))}
                        </div>
                    </div>

                    {/* Sources */}
                    {response.sources.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-slate-500" />
                                Sources Juridiques Utilisées
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {response.sources.map((source) => (
                                    <div key={source.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-300 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold px-2 py-1 bg-slate-200 rounded text-slate-700">
                                                {source.source}
                                            </span>
                                            <span className="text-xs font-medium text-slate-500">
                                                {source.article}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-slate-900 mb-2">{source.title}</h4>
                                        <p className="text-sm text-slate-600 line-clamp-3 italic">
                                            "{source.content}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
