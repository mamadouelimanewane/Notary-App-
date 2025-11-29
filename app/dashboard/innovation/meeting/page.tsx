"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Share, Settings, MoreVertical, Send, Smile, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MeetingPage() {
    const [isInMeeting, setIsInMeeting] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "Maitre Diop", text: "Bonjour à tous, merci d'être présents.", time: "10:00" },
        { sender: "Client (M. Faye)", text: "Bonjour Maître, le son est parfait.", time: "10:01" },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const participants = [
        { name: "Maitre Diop", role: "Hôte", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
        { name: "M. Faye (Client)", role: "Invité", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
        { name: "Mme Faye (Client)", role: "Invité", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
        { name: "Clerc Ndiaye", role: "Collaborateur", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
    ];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setMessages([...messages, { sender: "Moi", text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setNewMessage("");
    };

    if (!isInMeeting) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />

                <div className="z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                            Salle de Réunion Sécurisée
                        </h1>
                        <p className="text-slate-400 text-lg mb-8">
                            Plateforme de visioconférence chiffrée de bout en bout pour vos rendez-vous notariaux et collaborations internes.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Video className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Nouvelle Réunion</h3>
                                    <p className="text-sm text-slate-500">Démarrer une session instantanée</p>
                                </div>
                                <button
                                    onClick={() => setIsInMeeting(true)}
                                    className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                                >
                                    Lancer
                                </button>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Rejoindre avec un code</h3>
                                    <p className="text-sm text-slate-500">Entrez le code de la réunion</p>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Code..."
                                        className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
                                        Rejoindre
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative group">
                            {cameraOn ? (
                                <img
                                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
                                    alt="Preview"
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                    <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">MD</div>
                                </div>
                            )}

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                                <button
                                    onClick={() => setMicOn(!micOn)}
                                    className={cn(
                                        "p-3 rounded-full transition-colors",
                                        micOn ? "bg-slate-900/80 hover:bg-slate-800 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                                    )}
                                >
                                    {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                                </button>
                                <button
                                    onClick={() => setCameraOn(!cameraOn)}
                                    className={cn(
                                        "p-3 rounded-full transition-colors",
                                        cameraOn ? "bg-slate-900/80 hover:bg-slate-800 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                                    )}
                                >
                                    {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="absolute -z-10 inset-0 bg-blue-500/20 blur-3xl rounded-full transform translate-y-10" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Video Grid */}
                <div className="flex-1 p-4 grid grid-cols-2 gap-4 auto-rows-fr overflow-y-auto">
                    {participants.map((participant, index) => (
                        <div key={index} className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 group">
                            <img
                                src={participant.image}
                                alt={participant.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                                {participant.name}
                                {index === 0 && <span className="text-xs text-slate-400">(Vous)</span>}
                            </div>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-black/80 text-white">
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                            </div>
                            {/* Audio Indicator */}
                            <div className="absolute top-4 left-4 bg-blue-500/80 p-1.5 rounded-full">
                                <Mic className="h-3 w-3 text-white" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Sidebar */}
                {showChat && (
                    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold">Discussion</h3>
                            <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-white">
                                <Users className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={cn("flex flex-col", msg.sender === "Moi" ? "items-end" : "items-start")}>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-xs font-bold text-slate-300">{msg.sender}</span>
                                        <span className="text-[10px] text-slate-500">{msg.time}</span>
                                    </div>
                                    <div className={cn(
                                        "px-3 py-2 rounded-lg text-sm max-w-[85%]",
                                        msg.sender === "Moi" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-200"
                                    )}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Écrire un message..."
                                    className="w-full bg-slate-950 border border-slate-700 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-blue-500"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors">
                                    <Send className="h-3 w-3" />
                                </button>
                            </div>
                            <div className="flex gap-2 mt-2 px-2">
                                <button type="button" className="text-slate-400 hover:text-white"><Paperclip className="h-4 w-4" /></button>
                                <button type="button" className="text-slate-400 hover:text-white"><Smile className="h-4 w-4" /></button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Control Bar */}
            <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6">
                <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                    <span>10:42</span>
                    <span className="h-4 w-px bg-slate-700" />
                    <span>Dossier #2024-892 (Succession Faye)</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMicOn(!micOn)}
                        className={cn(
                            "p-3 rounded-full transition-all",
                            micOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                        )}
                    >
                        {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => setCameraOn(!cameraOn)}
                        className={cn(
                            "p-3 rounded-full transition-all",
                            cameraOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                        )}
                    >
                        {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </button>
                    <button className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all">
                        <Share className="h-5 w-5" />
                    </button>
                    <button className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all">
                        <Settings className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setIsInMeeting(false)}
                        className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all ml-2 flex items-center gap-2"
                    >
                        <PhoneOff className="h-5 w-5" />
                        <span className="hidden md:inline">Quitter</span>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className={cn(
                            "p-3 rounded-full transition-all relative",
                            showChat ? "bg-blue-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
                        )}
                    >
                        <MessageSquare className="h-5 w-5" />
                        <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-slate-900" />
                    </button>
                    <button className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all">
                        <Users className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
