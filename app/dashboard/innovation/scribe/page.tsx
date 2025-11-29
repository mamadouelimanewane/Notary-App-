"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Save, Copy, Share2, Wand2, FileText, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScribePage() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [duration, setDuration] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // Simulated live transcription text
    const fullText = "Compte rendu de la réunion du 29 novembre 2024 avec Monsieur et Madame Faye concernant la succession de feu Ibrahima Faye. Les parties sont d'accord sur le partage amiable des biens immobiliers situés à Mbour. Le notaire rappelle les dispositions fiscales en vigueur, notamment les droits d'enregistrement de 1%. Il est convenu que l'acte de partage sera signé le 15 décembre prochain. Madame Faye s'engage à fournir les titres fonciers originaux avant lundi. La question des comptes bancaires sera traitée dans un second temps...";

    useEffect(() => {
        let interval: any;
        if (isRecording) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
                // Simulate typing effect
                setTranscript(prev => {
                    if (prev.length < fullText.length) {
                        return fullText.slice(0, prev.length + Math.floor(Math.random() * 5) + 1);
                    }
                    return prev;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStop = () => {
        setIsRecording(false);
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Scribe IA</span>
                            <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-mono border border-pink-500/20">BETA</span>
                        </h1>
                        <p className="mt-2 text-slate-400">
                            Dictée vocale intelligente et génération automatique de comptes-rendus.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: Recorder */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden min-h-[500px] flex flex-col">

                            {/* Toolbar */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className={cn("h-3 w-3 rounded-full", isRecording ? "bg-red-500 animate-pulse" : "bg-slate-600")} />
                                    <span className="font-mono text-slate-300">{formatTime(duration)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                        <Share2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Transcript Area */}
                            <div className="flex-1 font-serif text-lg leading-relaxed text-slate-200 whitespace-pre-wrap">
                                {transcript || <span className="text-slate-600 italic">La transcription apparaîtra ici en temps réel...</span>}
                                {isRecording && <span className="inline-block w-2 h-5 bg-pink-500 ml-1 animate-blink" />}
                            </div>

                            {/* Action Bar */}
                            <div className="mt-8 flex justify-center">
                                {!isRecording ? (
                                    <button
                                        onClick={() => setIsRecording(true)}
                                        className="group relative flex items-center justify-center h-16 w-16 rounded-full bg-pink-600 hover:bg-pink-500 transition-all shadow-lg shadow-pink-900/20"
                                    >
                                        <Mic className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                                        <span className="absolute -bottom-8 text-sm font-medium text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Commencer</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleStop}
                                        className="group relative flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 border-2 border-red-500 hover:bg-red-500/10 transition-all"
                                    >
                                        <Square className="h-6 w-6 text-red-500 fill-current" />
                                        <span className="absolute -bottom-8 text-sm font-medium text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Arrêter</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: AI Insights */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Wand2 className="h-5 w-5 text-purple-400" />
                                Analyse IA
                            </h3>

                            {isProcessing ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4" />
                                    <p>Génération du résumé...</p>
                                </div>
                            ) : transcript.length > 50 ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                                        <h4 className="text-purple-400 text-sm font-bold mb-2 uppercase tracking-wider">Points Clés</h4>
                                        <ul className="space-y-2 text-sm text-slate-300">
                                            <li className="flex gap-2"><span className="text-purple-500">•</span> Accord partage amiable</li>
                                            <li className="flex gap-2"><span className="text-purple-500">•</span> Biens situés à Mbour</li>
                                            <li className="flex gap-2"><span className="text-purple-500">•</span> Droits d'enregistrement 1%</li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                        <h4 className="text-blue-400 text-sm font-bold mb-2 uppercase tracking-wider">Actions Détectées</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                                <Calendar className="h-4 w-4 text-blue-400 mt-0.5" />
                                                <span>Signature acte : 15 Décembre</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                                <FileText className="h-4 w-4 text-blue-400 mt-0.5" />
                                                <span>Récupérer titres fonciers (Mme Faye)</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-center gap-2 transition-colors">
                                        <Save className="h-4 w-4" />
                                        Enregistrer dans le dossier
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                                    <p>Parlez pour générer une analyse automatique.</p>
                                </div>
                            )}
                        </div>

                        {/* Recent Recordings */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Récents</h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors group">
                                        <div className="h-10 w-10 rounded-full bg-slate-800 group-hover:bg-pink-500/20 flex items-center justify-center transition-colors">
                                            <FileText className="h-5 w-5 text-slate-400 group-hover:text-pink-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-slate-200">Note rapide #{i}</h4>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> Il y a {i * 2}h
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
