"use client";

import { useState } from "react";
import { Map, Navigation, Building2, Home, Search, Filter, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MapPage() {
    const [activePin, setActivePin] = useState<number | null>(null);

    const properties = [
        { id: 1, x: 45, y: 30, title: "Résidence Almadies", type: "Appartement", price: "250M FCFA", status: "En vente" },
        { id: 2, x: 60, y: 50, title: "Villa Corniche", type: "Villa", price: "850M FCFA", status: "Sous offre" },
        { id: 3, x: 30, y: 60, title: "Terrain Diamniadio", type: "Terrain", price: "120M FCFA", status: "Disponible" },
        { id: 4, x: 75, y: 40, title: "Bureau Plateau", type: "Commercial", price: "450M FCFA", status: "Vendu" },
    ];

    return (
        <div className="h-[calc(100vh-2rem)] bg-slate-950 text-white flex flex-col overflow-hidden rounded-2xl border border-slate-800 relative">

            {/* Map Overlay Controls */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-4 w-80">
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl">
                    <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <Map className="h-6 w-6 text-blue-500" />
                        Carte Interactive
                    </h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une zone..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                        <button className="px-3 py-1.5 rounded-full bg-blue-600 text-xs font-medium whitespace-nowrap">Tout</button>
                        <button className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-medium whitespace-nowrap">Vente</button>
                        <button className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-medium whitespace-nowrap">Location</button>
                    </div>
                </div>

                {/* Selected Property Card */}
                {activePin && (
                    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-0 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="h-32 bg-slate-800 relative">
                            <img
                                src={`https://images.unsplash.com/photo-${activePin === 1 ? '1545324418-cc1a3fa10c00' : activePin === 2 ? '1613490493576-7fde63acd811' : '1500382017468-9049fed747ef'}?w=800&q=80`}
                                className="w-full h-full object-cover"
                                alt="Property"
                            />
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs font-bold">
                                {properties.find(p => p.id === activePin)?.status}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{properties.find(p => p.id === activePin)?.title}</h3>
                            <p className="text-slate-400 text-sm mb-3">{properties.find(p => p.id === activePin)?.type}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-blue-400 font-bold">{properties.find(p => p.id === activePin)?.price}</span>
                                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors">
                                    Voir dossier
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Map Controls Right */}
            <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                <button className="p-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors shadow-xl">
                    <Layers className="h-5 w-5 text-slate-400" />
                </button>
                <button className="p-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors shadow-xl">
                    <Navigation className="h-5 w-5 text-slate-400" />
                </button>
                <button className="p-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors shadow-xl">
                    <Filter className="h-5 w-5 text-slate-400" />
                </button>
            </div>

            {/* Map Area (Simulated) */}
            <div className="flex-1 bg-slate-900 relative overflow-hidden group">
                {/* Dark Map Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 grayscale contrast-125 group-hover:scale-105 transition-transform duration-[2s]"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop")' }}
                />

                {/* Map Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

                {/* Pins */}
                {properties.map((prop) => (
                    <div
                        key={prop.id}
                        className="absolute cursor-pointer group/pin"
                        style={{ top: `${prop.y}%`, left: `${prop.x}%` }}
                        onClick={() => setActivePin(prop.id)}
                        onMouseEnter={() => setActivePin(prop.id)}
                    >
                        <div className="relative">
                            <div className={cn(
                                "absolute -inset-4 bg-blue-500/30 rounded-full blur-xl transition-all duration-500",
                                activePin === prop.id ? "opacity-100 scale-150" : "opacity-0 group-hover/pin:opacity-50"
                            )} />
                            <div className={cn(
                                "relative h-4 w-4 rounded-full border-2 border-white shadow-lg transition-all duration-300",
                                activePin === prop.id ? "bg-blue-500 scale-125" : "bg-slate-900 hover:bg-blue-400"
                            )} />
                            {/* Label */}
                            <div className={cn(
                                "absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-slate-900 text-xs font-bold rounded whitespace-nowrap border border-slate-700 transition-all duration-300",
                                activePin === prop.id ? "opacity-100 -translate-y-1" : "opacity-0 translate-y-2 pointer-events-none"
                            )}>
                                {prop.title}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
