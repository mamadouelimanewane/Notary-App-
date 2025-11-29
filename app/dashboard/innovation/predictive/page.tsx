"use client";

import { useState } from "react";
import { BrainCircuit, AlertTriangle, CheckCircle, FileText, Search, BarChart, UploadCloud, Zap, ShieldCheck, ChevronRight, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PredictiveJusticePage() {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<null | any>(null);

    const handleAnalyze = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setResult({
                score: 85,
                riskLevel: "Faible",
                issues: [
                    { type: "warning", text: "Clause de non-concurrence trop large (Art. 12)", impact: "Moyen" },
                    { type: "success", text: "Conformité RGPD validée", impact: "Positif" },
                    { type: "danger", text: "Absence de clause résolutoire explicite", impact: "Élevé" }
                ]
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#0B1120] text-white p-8 relative overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[20%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
                        <SparklesIcon className="h-3 w-3" /> IA Juridique v2.0
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-4">
                        Justice Prédictive & Analyse
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                        Analysez vos contrats grâce à l'IA pour détecter les risques juridiques, anticiper les contentieux et sécuriser vos actes.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Input Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-3xl border border-white/5 bg-slate-900/50 shadow-2xl backdrop-blur-xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="p-8">
                                <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-3">
                                    <FileText className="h-6 w-6 text-indigo-400" />
                                    Analyse de Contrat
                                </h2>

                                <div className="rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 p-10 text-center hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group/drop">
                                    <div className="mx-auto h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 group-hover/drop:scale-110 transition-transform shadow-lg border border-white/5">
                                        <UploadCloud className="h-8 w-8 text-slate-400 group-hover/drop:text-indigo-400 transition-colors" />
                                    </div>
                                    <p className="text-base font-medium text-slate-200">
                                        Glissez-déposez votre projet d'acte ici
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">PDF, DOCX supportés (Max 25MB)</p>
                                    <button className="mt-6 rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors border border-white/5">
                                        Parcourir les fichiers
                                    </button>
                                </div>

                                <div className="mt-8 relative">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-slate-800"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-slate-900 px-4 text-sm text-slate-500 font-medium uppercase tracking-wider">Ou texte direct</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <label className="block text-sm font-medium text-slate-400 mb-3 ml-1">
                                        Collez le texte de la clause à analyser
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 p-5 text-sm text-slate-200 shadow-inner focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono leading-relaxed"
                                            rows={6}
                                            placeholder="Collez le texte juridique ici..."
                                            defaultValue="Le présent contrat est conclu pour une durée indéterminée. Chaque partie pourra y mettre fin à tout moment sans préavis ni indemnité."
                                        ></textarea>
                                        <div className="absolute bottom-4 right-4 text-xs text-slate-600">142 caractères</div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={analyzing}
                                        className="relative overflow-hidden flex items-center rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all group/btn"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                        {analyzing ? (
                                            <>
                                                <div className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                Analyse IA en cours...
                                            </>
                                        ) : (
                                            <>
                                                <BrainCircuit className="mr-2 h-5 w-5" />
                                                Lancer l'Analyse IA
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Results Section */}
                        {result && (
                            <div className="rounded-3xl border border-white/5 bg-slate-900/50 shadow-2xl backdrop-blur-xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <h3 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
                                    <ShieldCheck className="h-6 w-6 text-emerald-400" />
                                    Résultats de l'Analyse
                                </h3>
                                <div className="space-y-4">
                                    {result.issues.map((issue: any, index: number) => (
                                        <div key={index} className={cn(
                                            "flex items-start rounded-2xl p-5 border backdrop-blur-md transition-all hover:scale-[1.01]",
                                            issue.type === 'danger' ? "bg-red-500/10 border-red-500/20" :
                                                issue.type === 'warning' ? "bg-amber-500/10 border-amber-500/20" :
                                                    "bg-emerald-500/10 border-emerald-500/20"
                                        )}>
                                            <div className="mr-4 mt-1 p-2 rounded-lg bg-black/20">
                                                {issue.type === 'danger' ? <AlertTriangle className="h-5 w-5 text-red-400" /> :
                                                    issue.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-amber-400" /> :
                                                        <CheckCircle className="h-5 w-5 text-emerald-400" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={cn(
                                                    "text-base font-semibold",
                                                    issue.type === 'danger' ? "text-red-200" :
                                                        issue.type === 'warning' ? "text-amber-200" :
                                                            "text-emerald-200"
                                                )}>{issue.text}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-xs font-medium uppercase tracking-wider opacity-60 text-white">Impact:</span>
                                                    <span className={cn(
                                                        "text-xs font-bold px-2 py-0.5 rounded",
                                                        issue.type === 'danger' ? "bg-red-500/20 text-red-300" :
                                                            issue.type === 'warning' ? "bg-amber-500/20 text-amber-300" :
                                                                "bg-emerald-500/20 text-emerald-300"
                                                    )}>{issue.impact}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-8">
                        {/* Score Card */}
                        <div className="rounded-3xl border border-white/5 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Score de Sécurité</h3>

                            <div className="relative inline-flex items-center justify-center mb-6">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                                <svg className="h-40 w-40 transform -rotate-90 relative z-10">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={439.82} strokeDashoffset={439.82 - (439.82 * (result ? result.score : 0)) / 100} className={cn("text-indigo-500 transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]", !result && "text-slate-700")} strokeLinecap="round" />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-4xl font-bold text-white tracking-tight">
                                        {result ? result.score : "--"}
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium">%</span>
                                </div>
                            </div>

                            <div className={cn(
                                "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-all",
                                result ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-500 border-slate-700"
                            )}>
                                {result ? "Risque Faible" : "En attente"}
                            </div>
                        </div>

                        {/* Jurisprudence Card */}
                        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:translate-x-5 transition-transform duration-700" />

                            <div className="flex items-center space-x-3 mb-6 relative z-10">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                    <Scale className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg">Jurisprudence</h3>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="rounded-xl bg-black/20 p-4 hover:bg-black/30 cursor-pointer transition-all border border-white/5 hover:border-white/20 group/item">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-sm">Arrêt CCJA n° 124/2023</p>
                                        <ArrowRight className="h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-opacity transform -rotate-45" />
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-emerald-400 h-full w-[92%] shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                    </div>
                                    <p className="text-indigo-200 text-xs mt-2 font-medium">Similitude: 92%</p>
                                </div>

                                <div className="rounded-xl bg-black/20 p-4 hover:bg-black/30 cursor-pointer transition-all border border-white/5 hover:border-white/20 group/item">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-sm">Arrêt Cour Suprême n° 45</p>
                                        <ArrowRight className="h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-opacity transform -rotate-45" />
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-emerald-400 h-full w-[87%] shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                    </div>
                                    <p className="text-indigo-200 text-xs mt-2 font-medium">Similitude: 87%</p>
                                </div>
                            </div>

                            <button className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg relative z-10">
                                Voir toute la jurisprudence
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
    )
}
