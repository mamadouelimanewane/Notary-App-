"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '@/lib/real-estate/data';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix pour les icônes Leaflet par défaut qui manquent souvent en prod
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface PropertyMapProps {
    properties: Property[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
    // Centre par défaut (Dakar)
    const defaultCenter: [number, number] = [14.6928, -17.4467];

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {properties.map((property) => (
                <Marker
                    key={property.id}
                    position={property.coordinates}
                    icon={icon}
                >
                    <Popup>
                        <div className="p-1 min-w-[200px]">
                            <div className="relative h-32 w-full mb-2 rounded overflow-hidden bg-gray-100">
                                <img
                                    src={property.imageUrl}
                                    alt={property.title}
                                    className="object-cover w-full h-full"
                                />
                                <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded text-white ${property.status === 'A_VENDRE' ? 'bg-green-500' :
                                        property.status === 'VENDU' ? 'bg-red-500' :
                                            property.status === 'LITIGE' ? 'bg-orange-500' : 'bg-blue-500'
                                    }`}>
                                    {property.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-sm mb-1">{property.title}</h3>
                            <p className="text-xs text-gray-600 mb-1">{property.address}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
                                    {property.type}
                                </span>
                                <span className="text-sm font-bold text-blue-600">
                                    {(property.price / 1000000).toFixed(0)} M FCFA
                                </span>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
