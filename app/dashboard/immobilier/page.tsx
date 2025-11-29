"use client";

import dynamic from 'next/dynamic';
import { MOCK_PROPERTIES, Property } from '@/lib/real-estate/data';
import { useState } from 'react';
import { MapPin, Home, Building, LayoutGrid, List as ListIcon } from 'lucide-react';

// Import dynamique de la carte (SSR désactivé car Leaflet utilise window)
const PropertyMap = dynamic(() => import('@/components/real-estate/PropertyMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
            Chargement de la carte...
        </div>
    )
});

export default function RealEstatePage() {
    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [viewMode, setViewMode] = useState<'MAP' | 'LIST'>('MAP');

    const filteredProperties = selectedType === 'ALL'
        ? MOCK_PROPERTIES
        : MOCK_PROPERTIES.filter(p => p.type === selectedType);

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        Cartographie Immobilière
                    </h1>
                    <p className="text-muted-foreground">
                        Visualisez et gérez le patrimoine immobilier de l'étude.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('MAP')}
                            className={`p-2 rounded-md text-sm font-medium transition-all ${viewMode === 'MAP' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <MapPin className="w-4 h-4 mr-2 inline" />
                            Carte
                        </button>
                        <button
                            onClick={() => setViewMode('LIST')}
                            className={`p-2 rounded-md text-sm font-medium transition-all ${viewMode === 'LIST' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <ListIcon className="w-4 h-4 mr-2 inline" />
                            Liste
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['ALL', 'MAISON', 'APPARTEMENT', 'TERRAIN', 'IMMEUBLE'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${selectedType === type
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                            }`}
                    >
                        {type === 'ALL' ? 'Tout voir' : type}
                    </button>
                ))}
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Liste Latérale (toujours visible sur grand écran) */}
                <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-4">
                    {filteredProperties.map((property) => (
                        <div key={property.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                    <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                            {property.type}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${property.status === 'A_VENDRE' ? 'bg-green-500' :
                                                property.status === 'VENDU' ? 'bg-red-500' :
                                                    property.status === 'LITIGE' ? 'bg-orange-500' : 'bg-blue-500'
                                            }`}>
                                            {property.status}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-slate-900 truncate mt-1">{property.title}</h3>
                                    <p className="text-xs text-slate-500 truncate">{property.address}</p>
                                    <div className="mt-2 flex justify-between items-end">
                                        <div className="text-xs text-slate-500">
                                            {property.surface} m²
                                        </div>
                                        <div className="font-bold text-slate-900">
                                            {(property.price / 1000000).toFixed(0)} M FCFA
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carte (ou Liste étendue) */}
                <div className={`lg:col-span-2 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative ${viewMode === 'LIST' ? 'hidden lg:block' : ''}`}>
                    <PropertyMap properties={filteredProperties} />

                    {/* Légende flottante */}
                    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000] text-xs space-y-2">
                        <div className="font-semibold mb-1">Légende</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> À Vendre</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> En Gestion</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Litige</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
