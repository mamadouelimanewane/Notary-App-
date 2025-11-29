"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Mic, Paperclip, StopCircle, FileText, FileSearch, Mail, Calendar, ArrowRight, Zap, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AssistantPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string, type?: 'text' | 'analysis' | 'draft' | 'email' | 'summary' | 'meeting' }[]>([
        { role: 'assistant', content: "Bonjour Maître. Je suis votre Notaire Virtuel Intelligent. Je peux vous aider à rédiger des actes, résumer des documents, préparer vos emails ou organiser vos réunions. Que souhaitez-vous faire ?", type: 'text' }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
        setInput("");
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            let response = "";
            let type: 'text' | 'analysis' | 'draft' | 'email' | 'summary' | 'meeting' = 'text';
            const lowerInput = textToSend.toLowerCase();

            if (lowerInput.includes("vente") || lowerInput.includes("acte")) {
                response = "Je prépare le projet d'acte de vente. J'ai intégré les clauses standard OHADA ainsi que les spécificités liées à l'origine de propriété trentenaire.";
                type = 'draft';
            } else if (lowerInput.includes("résum") || lowerInput.includes("synthèse")) {
                response = "Voici le résumé du document 'Titre Foncier 1456/DK' :\n\n• Propriétaire : Héritiers Fall\n• Superficie : 500 m²\n• Charges : Hypothèque de 10M FCFA inscrite en 2022 (Mainlevée requise)\n• Servitudes : Aucune mentionnée.";
                type = 'summary';
            } else if (lowerInput.includes("mail") || lowerInput.includes("email")) {
                response = "Voici une proposition d'email pour le client :\n\nObjet : Projet d'acte de vente - Dossier Diop/Faye\n\nCher Monsieur Diop,\n\nVeuillez trouver ci-joint le projet d'acte de vente pour relecture. Je vous invite à porter une attention particulière à la clause de jouissance différée.\n\nCordialement,\nVotre Notaire.";
                type = 'email';
            } else if (lowerInput.includes("réunion") || lowerInput.includes("préparer")) {
                response = "Pour la réunion de signature de demain, voici la check-list de préparation :\n\n1. Vérifier l'identité des parties (CNI valides)\n2. Imprimer l'état hypothécaire à jour\n3. Préparer les reçus de comptabilité\n4. Salle de réunion réservée à 10h00.";
                type = 'meeting';
            } else {
                response = "Je comprends. Je consulte ma base de données juridique pour vous apporter une réponse précise.";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response, type }]);
            setIsTyping(false);
        }, 1500);
    };

    const handleOpenEditor = () => {
        const sampleDraft = `<h1>ACTE DE VENTE IMMOBILIÈRE</h1>
<p><strong>PARDEVANT MAÎTRE {{notary.name}}</strong>, Notaire à la résidence de {{notary.city}}.</p>
<p><strong>A COMPARU :</strong></p>
<p>M. {{vendeur.firstName}} {{vendeur.lastName}}, né le {{vendeur.birthDate}}, demeurant à {{vendeur.address}}.</p>
<p>Ci-après dénommé le "VENDEUR".</p>
<p><strong>ET :</strong></p>
<p>M. {{client.firstName}} {{client.lastName}}, né le {{client.birthDate}}, demeurant à {{client.address}}.</p>
<p>Ci-après dénommé l'"ACQUÉREUR".</p>
<p><strong>OBJET :</strong></p>
<p>Le Vendeur vend à l'Acquéreur, qui accepte, l'immeuble désigné ci-après : {{bien.description}}</p>
<p><strong>PRIX :</strong></p>
<p>La présente vente est consentie et acceptée moyennant le prix principal de {{bien.price}} Francs CFA.</p>`;

        router.push(`/dashboard/templates/new?content=${encodeURIComponent(sampleDraft)}`);
    };

    const QuickAction = ({ icon: Icon, label, prompt, color }: any) => (
        <button
            onClick={() => handleSend(prompt)}
            className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-white/5 p-4 hover:bg-slate-800 hover:border-white/10 transition-all duration-300 w-full text-left"
        >
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500", color)} />
            <div className="flex items-start gap-4 relative z-10">
                <div className={cn("p-3 rounded-xl bg-slate-900/80 border border-white/5 shadow-lg group-hover:scale-110 transition-transform duration-300", color.replace('bg-', 'text-'))}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">{label}</h3>
                    <p className="text-xs text-slate-500 mt-1 group-hover:text-slate-400">Cliquez pour lancer l'assistant</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
        </button>
    );

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-[#0B1120] text-white overflow-hidden relative font-sans selection:bg-indigo-500/30">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 z-10 relative backdrop-blur-sm bg-slate-900/30">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-8 py-5 backdrop-blur-md">
                    <div className="flex items-center space-x-5">
                        <div className="relative group cursor-pointer">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 ring-1 ring-white/10">
                                <Bot className="h-6 w-6 text-indigo-400" />
                            </div>
                            <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">Notaire Virtuel IA</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                                    GPT-4o Connected
                                </span>
                                <span className="text-xs text-slate-500 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" /> En ligne
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-all">
                            <Zap className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
                    {messages.map((msg, index) => (
                        <div key={index} className={cn("flex w-full group animate-in slide-in-from-bottom-4 duration-500 fade-in", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={cn("flex max-w-[75%] items-end space-x-4", msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row")}>
                                {/* Avatar */}
                                <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full shadow-lg", msg.role === 'user' ? "bg-blue-600" : "bg-slate-800 border border-white/10")}>
                                    {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-indigo-400" />}
                                </div>

                                {/* Bubble */}
                                <div className={cn(
                                    "relative rounded-2xl px-6 py-5 shadow-xl backdrop-blur-md border",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white border-blue-500/50 rounded-br-none"
                                        : "bg-slate-800/80 text-slate-100 border-white/5 rounded-bl-none"
                                )}>
                                    <p className="text-sm leading-7 whitespace-pre-wrap font-light tracking-wide">{msg.content}</p>

                                    {/* Rich Content Cards */}
                                    {msg.type === 'draft' && (
                                        <div className="mt-5 rounded-xl bg-slate-950/50 border border-indigo-500/30 overflow-hidden group/card hover:border-indigo-500/50 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                                            <div className="bg-gradient-to-r from-indigo-500/10 to-transparent px-4 py-3 border-b border-indigo-500/20 flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-indigo-400" />
                                                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Projet d'Acte</span>
                                            </div>
                                            <div className="p-4 font-mono text-xs text-slate-400 leading-relaxed bg-slate-950/30">
                                                PARDEVANT Maître...<br />
                                                A COMPARU : M. X...<br />
                                                [...]<br />
                                                A VENDU à M. Y...
                                            </div>
                                            <div className="px-4 py-3 bg-slate-900/50 flex justify-end border-t border-white/5">
                                                <button
                                                    onClick={handleOpenEditor}
                                                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                                                >
                                                    Ouvrir l'éditeur <ArrowRight className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {msg.type === 'summary' && (
                                        <div className="mt-5 rounded-xl bg-slate-950/50 border border-amber-500/30 overflow-hidden hover:border-amber-500/50 transition-all">
                                            <div className="bg-gradient-to-r from-amber-500/10 to-transparent px-4 py-3 border-b border-amber-500/20 flex items-center gap-2">
                                                <FileSearch className="h-4 w-4 text-amber-400" />
                                                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Résumé Intelligent</span>
                                            </div>
                                            <div className="p-4 text-sm text-slate-300 leading-relaxed">
                                                Le document analyse la situation hypothécaire du TF 1456/DK. Il révèle une inscription non radiée.
                                            </div>
                                        </div>
                                    )}

                                    {msg.type === 'email' && (
                                        <div className="mt-5 rounded-xl bg-slate-950/50 border border-blue-500/30 overflow-hidden hover:border-blue-500/50 transition-all">
                                            <div className="bg-gradient-to-r from-blue-500/10 to-transparent px-4 py-3 border-b border-blue-500/20 flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-blue-400" />
                                                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Brouillon Email</span>
                                            </div>
                                            <div className="p-4 text-sm text-slate-300 italic bg-slate-950/30 border-b border-white/5">
                                                "Cher Monsieur Diop, veuillez trouver ci-joint..."
                                            </div>
                                            <div className="px-4 py-3 bg-slate-900/50 flex gap-3">
                                                <button className="flex-1 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition-colors">Copier</button>
                                                <button className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-lg shadow-blue-900/20">Envoyer</button>
                                            </div>
                                        </div>
                                    )}

                                    {msg.type === 'meeting' && (
                                        <div className="mt-5 rounded-xl bg-slate-950/50 border border-emerald-500/30 overflow-hidden hover:border-emerald-500/50 transition-all">
                                            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent px-4 py-3 border-b border-emerald-500/20 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-emerald-400" />
                                                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Préparation Réunion</span>
                                            </div>
                                            <div className="p-4">
                                                <ul className="space-y-2 text-sm text-slate-300">
                                                    <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Identité vérifiée</li>
                                                    <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> État hypothécaire à imprimer</li>
                                                    <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Salle réservée</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex w-full justify-start animate-in fade-in duration-300">
                            <div className="flex items-center space-x-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-white/10">
                                    <Bot className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div className="flex space-x-1.5 rounded-2xl bg-slate-800/80 px-6 py-5 border border-white/5 shadow-lg backdrop-blur-sm">
                                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 delay-75"></div>
                                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 delay-150"></div>
                                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 delay-300"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/90 to-transparent z-20">
                    <div className="mx-auto max-w-4xl relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative flex items-center rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
                            <button className="mr-2 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Paperclip className="h-5 w-5" />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Posez une question, demandez un acte, un email..."
                                className="flex-1 bg-transparent py-2 text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
                            />
                            <button className="ml-2 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Mic className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim()}
                                className="ml-2 rounded-xl bg-indigo-600 p-2.5 text-white shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="mt-3 text-center text-[10px] text-slate-500 tracking-wider uppercase font-medium opacity-60">
                            L'IA peut faire des erreurs. Vérifiez toujours les informations juridiques importantes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Quick Actions */}
            <div className="w-96 border-l border-white/5 bg-slate-900/50 backdrop-blur-xl p-8 hidden xl:flex flex-col z-20">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                        <Sparkles className="h-5 w-5 text-amber-400" />
                        Actions Rapides
                    </h2>
                    <p className="text-sm text-slate-400">Raccourcis intelligents pour votre productivité.</p>
                </div>

                <div className="space-y-4 flex-1">
                    <QuickAction
                        icon={FileText}
                        label="Rédiger un Acte"
                        prompt="Rédige un projet d'acte de vente immobilière pour un appartement aux Almadies."
                        color="bg-indigo-500"
                    />
                    <QuickAction
                        icon={FileSearch}
                        label="Résumer un Document"
                        prompt="Peux-tu me faire un résumé synthétique du Titre Foncier 1456/DK ci-joint ?"
                        color="bg-amber-500"
                    />
                    <QuickAction
                        icon={Mail}
                        label="Rédiger un Email"
                        prompt="Prépare un email formel pour envoyer le projet d'acte au client M. Diop."
                        color="bg-blue-500"
                    />
                    <QuickAction
                        icon={Calendar}
                        label="Préparer une Réunion"
                        prompt="Prépare la check-list pour la réunion de signature de demain matin."
                        color="bg-emerald-500"
                    />
                </div>

                <div className="mt-auto pt-8 border-t border-white/5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                        Contexte Actif
                    </h3>
                    <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-4 hover:border-white/10 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs border border-blue-500/30 group-hover:scale-110 transition-transform">
                                TF
                            </div>
                            <div>
                                <div className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">Vente Villa Almadies</div>
                                <div className="text-xs text-slate-500">Réf: 2024-0892</div>
                            </div>
                        </div>
                        <div className="space-y-2 pl-14">
                            <div className="text-xs flex justify-between items-center">
                                <span className="text-slate-500">Client</span>
                                <span className="font-medium text-slate-300">M. Ousmane Diop</span>
                            </div>
                            <div className="text-xs flex justify-between items-center">
                                <span className="text-slate-500">Statut</span>
                                <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold">En rédaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
