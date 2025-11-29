"use client";

import { useState } from "react";
import { Link, Shield, CheckCircle, Clock, FileText, ArrowRight, Activity, Lock, Globe, Box, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlockchainPage() {
    return (
        <div className="min-h-screen bg-[#0B1120] text-white p-8 relative overflow-hidden font-sans selection:bg-emerald-500/30">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="mb-12 rounded-3xl bg-gradient-to-br from-emerald-900/50 to-slate-900/50 p-8 border border-emerald-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-1000"></div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        <div>
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 backdrop-blur-md">
                                    <Box className="h-8 w-8 text-emerald-400" />
                                </div>
                                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 via-teal-200 to-white">
                                    Notary Blockchain Network
                                </h1>
                            </div>
                            <p className="mt-2 text-emerald-100/70 text-lg max-w-2xl font-light leading-relaxed">
                                Le registre distribué souverain des notaires de l'UEMOA. Sécurisation immuable des actes et exécution automatique des Smart Contracts.
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center space-x-2 bg-emerald-950/50 px-4 py-2 rounded-full backdrop-blur-md border border-emerald-500/30 shadow-lg">
                                <div className="relative">
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                                </div>
                                <span className="text-sm font-mono text-emerald-300 tracking-wide">Bloc #892,104</span>
                            </div>
                            <div className="text-xs text-emerald-500/60 font-mono">Latence réseau: 12ms</div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-12">
                    <StatCard
                        title="Actes Sécurisés"
                        value="1,284"
                        icon={Shield}
                        trend="+12% ce mois"
                        color="text-emerald-400"
                        bg="bg-emerald-500/10 border-emerald-500/20"
                    />
                    <StatCard
                        title="Smart Contracts"
                        value="56"
                        icon={Zap}
                        trend="Actifs en temps réel"
                        color="text-blue-400"
                        bg="bg-blue-500/10 border-blue-500/20"
                    />
                    <StatCard
                        title="Tokens Immobiliers"
                        value="1.5 Md"
                        unit="FCFA"
                        icon={Globe}
                        trend="Capitalisation"
                        color="text-purple-400"
                        bg="bg-purple-500/10 border-purple-500/20"
                    />
                    <StatCard
                        title="Nœuds Validateurs"
                        value="12"
                        icon={Activity}
                        trend="100% Uptime"
                        color="text-amber-400"
                        bg="bg-amber-500/10 border-amber-500/20"
                    />
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Recent Transactions */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-3xl border border-white/5 bg-slate-900/50 shadow-2xl backdrop-blur-xl overflow-hidden">
                            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6 bg-white/5">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-emerald-400" />
                                    Flux de Transactions
                                </h2>
                                <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 group">
                                    Explorateur <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                            <div className="divide-y divide-white/5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center justify-between px-8 py-5 hover:bg-white/5 transition-colors group cursor-pointer">
                                        <div className="flex items-center space-x-5">
                                            <div className="rounded-xl bg-slate-800/50 p-3 border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">Certification Acte de Vente #{2024000 + i}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs font-mono text-slate-500 bg-slate-950/50 px-2 py-0.5 rounded border border-white/5">0x7f...3a2{i}</span>
                                                    <span className="text-xs text-slate-500">Type: <span className="text-slate-400">Proof of Existence</span></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Confirmé
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2 flex items-center justify-end gap-1">
                                                <Clock className="h-3 w-3" /> {i * 2} min
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Smart Contracts Manager */}
                        <div className="rounded-3xl border border-white/5 bg-slate-900/50 shadow-2xl backdrop-blur-xl overflow-hidden">
                            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6 bg-white/5">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-400" />
                                    Smart Contracts
                                </h2>
                                <button className="flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all shadow-lg shadow-blue-900/20">
                                    + Déployer
                                </button>
                            </div>
                            <div className="p-8 grid gap-6 md:grid-cols-2">
                                <ContractCard
                                    title="Séquestre Automatique"
                                    type="Escrow"
                                    status="Active"
                                    value="50,000,000 FCFA"
                                    parties={["M. Diop", "Mme Fall"]}
                                    color="blue"
                                />
                                <ContractCard
                                    title="Tokenisation Immeuble Plateau"
                                    type="Asset Token"
                                    status="Pending"
                                    value="1,200 Tokens"
                                    parties={["SCI Plateau", "Investisseurs"]}
                                    color="purple"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <div className="rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                            <div className="flex items-center space-x-3 mb-6 relative z-10">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <Lock className="h-5 w-5 text-emerald-400" />
                                </div>
                                <h3 className="font-bold text-lg">Sécurité du Nœud</h3>
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                        <span className="text-slate-400">Santé du réseau</span>
                                        <span className="text-emerald-400">99.9%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
                                        <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                        <span className="text-slate-400">Synchronisation</span>
                                        <span className="text-blue-400">Complète</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
                                        <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Votre nœud <span className="text-white font-mono">NODE-DK-01</span> participe activement au consensus Proof-of-Authority du réseau notarial.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/5 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <h3 className="font-bold text-xl text-white mb-3 relative z-10">Tokenisation d'Actifs</h3>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed relative z-10">
                                Transformez des biens immobiliers en tokens numériques fractionnés pour démocratiser l'investissement.
                            </p>
                            <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 relative z-10 group/btn">
                                Lancer une émission <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, unit, icon: Icon, trend, color, bg }: any) {
    return (
        <div className="rounded-3xl border border-white/5 bg-slate-900/50 p-6 shadow-xl backdrop-blur-md hover:bg-slate-800/50 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className={cn("rounded-2xl p-3.5 transition-transform group-hover:scale-110 duration-300", bg)}>
                    <Icon className={cn("h-6 w-6", color)} />
                </div>
                <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-medium text-slate-400">
                    24h
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-400">{title}</p>
                <p className="mt-1 text-3xl font-bold text-white tracking-tight">
                    {value} <span className="text-lg text-slate-500 font-normal">{unit}</span>
                </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 w-fit px-2 py-1 rounded-lg border border-emerald-500/10">
                {trend}
            </div>
        </div>
    );
}

function ContractCard({ title, type, status, value, parties, color }: any) {
    const statusColor = status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500';
    const typeColor = color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20';

    return (
        <div className="rounded-2xl border border-white/5 bg-slate-950/30 p-5 hover:border-white/10 hover:bg-slate-900/80 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("rounded-lg px-2.5 py-1 text-xs font-bold border", typeColor)}>
                    {type}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">{status}</span>
                    <span className={cn("flex h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]", statusColor)} />
                </div>
            </div>
            <h4 className="font-bold text-lg text-slate-200 group-hover:text-white transition-colors">{title}</h4>
            <p className="text-sm text-slate-500 mt-1 font-mono">{value}</p>

            <div className="mt-6 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {parties.map((party: string, i: number) => (
                        <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 ring-2 ring-slate-900 text-[10px] font-bold text-slate-300 border border-white/10">
                            {party.charAt(0)}
                        </div>
                    ))}
                </div>
                <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors">Détails</button>
            </div>
        </div>
    )
}
