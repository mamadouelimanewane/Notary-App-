"use client";

import { useState } from "react";
import { Glasses, MapPin, Maximize2, PlayCircle, Home, Info, Share2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VRPage() {
    const [activeProperty, setActiveProperty] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const properties = [
        {
            id: 1,
            title: "Villa Prestige Corniche",
            location: "Dakar, Corniche Ouest",
            price: "850,000,000 FCFA",
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
            status: "En vente"
        },
        {
            id: 2,
            title: "Appartement Vue Mer",
            location: "Plateau, Dakar",
            price: "250,000,000 FCFA",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
            status: "Sous compromis"
        },
        {
            id: 3,
            title: "Terrain Almadies",
            location: "Almadies, Dakar",
            price: "1,200,000,000 FCFA",
            image: "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=1600&auto=format&fit=crop",
            status: "Nouveau"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Glasses className="h-8 w-8 text-purple-500" />
                        Visites Immersives VR/AR
                    </h1>
                    <p className="mt-2 text-slate-400">
                        Faites visiter vos biens à distance grâce à la technologie de jumeaux numériques.
                    </p>
                </div>
                <button className="rounded-full bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/20">
                    + Nouvelle Visite 3D
                </button>
            </div>

            {/* Main VR Viewer Area */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 h-[600px]">
                {/* Viewer */}
                <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 group">
                    {isPlaying ? (
                        <div className="relative h-full w-full">
                            <iframe
                                src="https://my.matterport.com/show/?m=SxQL3iGyoDo&play=1"
                                className="h-full w-full border-0"
                                allow="xr-spatial-tracking"
                                allowFullScreen
                                referrerPolicy="no-referrer"
                            ></iframe>
                            <button
                                onClick={() => setIsPlaying(false)}
                                className="absolute top-4 left-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 backdrop-blur-md"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <img
                                src={properties[activeProperty].image}
                                alt="VR View"
                                className="h-full w-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                            />

                            {/* Overlay UI */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    onClick={() => setIsPlaying(true)}
                                    className="transform transition-transform hover:scale-110 group-hover:scale-100 scale-90"
                                >
                                    <div className="rounded-full bg-white/10 p-4 backdrop-blur-md border border-white/30 hover:bg-white/20">
                                        <PlayCircle className="h-16 w-16 text-white" />
                                    </div>
                                    <p className="mt-4 text-center font-bold text-white drop-shadow-md">Lancer la Visite 3D</p>
                                </button>
                            </div>

                            {/* AR Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 rounded-full bg-purple-500/80 backdrop-blur-md text-xs font-bold border border-purple-400/30">
                                    Compatible AR
                                </span>
                            </div>
                        </>
                    )}

                    {/* Controls (Only visible when not playing) */}
                    {!isPlaying && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <div className="flex items-end justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{properties[activeProperty].title}</h2>
                                    <p className="flex items-center text-slate-300">
                                        <MapPin className="mr-1 h-4 w-4" /> {properties[activeProperty].location}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                                        <Share2 className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                                        <Info className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                                        <Maximize2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Playlist / List */}
                <div className="space-y-4 overflow-y-auto pr-2">
                    {properties.map((prop, index) => (
                        <div
                            key={prop.id}
                            onClick={() => setActiveProperty(index)}
                            className={cn(
                                "cursor-pointer rounded-xl p-4 transition-all border",
                                activeProperty === index
                                    ? "bg-slate-800 border-purple-500 shadow-lg shadow-purple-900/20"
                                    : "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                            )}
                        >
                            <div className="flex gap-4">
                                <img src={prop.image} alt={prop.title} className="h-20 w-20 rounded-lg object-cover" />
                                <div>
                                    <h3 className="font-semibold text-white">{prop.title}</h3>
                                    <p className="text-sm text-slate-400">{prop.location}</p>
                                    <p className="mt-2 font-bold text-purple-400">{prop.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Placeholder */}
                    <div className="rounded-xl border-2 border-dashed border-slate-700 p-8 text-center hover:border-slate-600 hover:bg-slate-800/30 transition-colors cursor-pointer">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800">
                            <Home className="h-5 w-5 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-400">Ajouter un bien</p>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                <FeatureCard
                    title="Jumeau Numérique"
                    desc="Reconstruction 3D fidèle au millimètre près via LiDAR."
                    icon="🏗️"
                />
                <FeatureCard
                    title="Home Staging Virtuel"
                    desc="Meublez et décorez les pièces vides en un clic avec l'IA."
                    icon="🛋️"
                />
                <FeatureCard
                    title="Visite Guidée Live"
                    desc="Synchronisez votre écran avec celui du client pour une visite commentée."
                    icon="🎥"
                />
            </div>
        </div>
    );
}

function FeatureCard({ title, desc, icon }: any) {
    return (
        <div className="rounded-xl bg-slate-800/50 p-6 border border-slate-700 hover:bg-slate-800 transition-colors">
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    )
}
