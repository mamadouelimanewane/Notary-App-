"use client";

import { useState, useEffect } from "react";
import { Fingerprint, Lock, Unlock, ShieldCheck, FileText, Eye, Download, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BiometricSafePage() {
    const [status, setStatus] = useState<"locked" | "scanning" | "unlocked">("locked");
    const [scanProgress, setScanProgress] = useState(0);

    const handleUnlock = () => {
        setStatus("scanning");
        setScanProgress(0);
    };

    useEffect(() => {
        if (status === "scanning") {
            const interval = setInterval(() => {
                setScanProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStatus("unlocked");
                        return 100;
                    }
                    return prev + 2;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [status]);

    const secureFiles = [
        { name: "Testament_Ousmane_Diop.pdf", date: "29 Nov 2024", size: "2.4 MB", type: "Testament" },
        { name: "Contrat_Mariage_Secret.pdf", date: "15 Nov 2024", size: "1.1 MB", type: "Contrat" },
        { name: "Acte_Vente_Palais_Presid.pdf", date: "01 Nov 2024", size: "8.5 MB", type: "Acte Vente" },
        { name: "Donation_Partage_Famille_Faye.pdf", date: "20 Oct 2024", size: "3.2 MB", type: "Donation" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="z-10 w-full max-w-4xl">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 mb-4">
                        Coffre-fort Biométrique
                    </h1>
                    <p className="text-slate-400">Accès sécurisé aux documents confidentiels de l'étude.</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">

                    {status === "locked" && (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                            <div className="relative group cursor-pointer" onClick={handleUnlock}>
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all" />
                                <div className="relative bg-slate-800 p-8 rounded-full border-2 border-emerald-500/50 group-hover:border-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <Fingerprint className="h-24 w-24 text-emerald-400" />
                                </div>
                            </div>
                            <p className="mt-8 text-xl font-medium text-slate-300">Touchez pour scanner votre empreinte</p>
                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                <Lock className="h-4 w-4" />
                                <span>Chiffrement AES-256 activé</span>
                            </div>
                        </div>
                    )}

                    {status === "scanning" && (
                        <div className="flex flex-col items-center w-full max-w-md">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                                <Fingerprint className="h-32 w-32 text-emerald-400 animate-pulse" />
                                <div
                                    className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399]"
                                    style={{ top: `${scanProgress}%`, transition: 'top 0.1s linear' }}
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-emerald-400 mb-2">Identification en cours...</h2>
                            <p className="text-slate-400 mb-6">Analyse biométrique des points caractéristiques</p>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full transition-all duration-75"
                                    style={{ width: `${scanProgress}%` }}
                                />
                            </div>
                            <p className="mt-2 text-emerald-500 font-mono">{scanProgress}%</p>
                        </div>
                    )}

                    {status === "unlocked" && (
                        <div className="w-full h-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                                        <Unlock className="h-8 w-8 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Accès Autorisé</h2>
                                        <p className="text-emerald-400 text-sm flex items-center gap-1">
                                            <ShieldCheck className="h-3 w-3" /> Session sécurisée active
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStatus("locked")}
                                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                                >
                                    Verrouiller
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {secureFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-lg bg-slate-900 group-hover:bg-emerald-500/10 transition-colors">
                                                <FileText className="h-6 w-6 text-slate-400 group-hover:text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-200 group-hover:text-white">{file.name}</h3>
                                                <p className="text-xs text-slate-500">{file.type} • {file.date} • {file.size}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
                                                <Download className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex gap-3">
                                <div className="mt-1">
                                    <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin-slow" />
                                </div>
                                <div>
                                    <h4 className="text-yellow-500 font-medium text-sm">Synchronisation Blockchain</h4>
                                    <p className="text-yellow-500/70 text-xs mt-1">
                                        Chaque accès est enregistré de manière immuable sur le registre distribué du cabinet.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
