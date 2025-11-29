export type PropertyType = 'TERRAIN' | 'MAISON' | 'APPARTEMENT' | 'IMMEUBLE' | 'COMMERCIAL';

export interface Property {
    id: string;
    title: string;
    type: PropertyType;
    address: string;
    city: string;
    price: number;
    surface: number; // m2
    coordinates: [number, number]; // [latitude, longitude]
    dossierId?: string;
    status: 'A_VENDRE' | 'VENDU' | 'EN_GESTION' | 'LITIGE';
    imageUrl?: string;
}

export const MOCK_PROPERTIES: Property[] = [
    {
        id: 'prop_1',
        title: 'Villa Corniche Ouest',
        type: 'MAISON',
        address: 'Corniche Ouest, Fann Résidence',
        city: 'Dakar',
        price: 450000000,
        surface: 600,
        coordinates: [14.6928, -17.4730],
        status: 'A_VENDRE',
        imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'prop_2',
        title: 'Appartement Plateau',
        type: 'APPARTEMENT',
        address: 'Avenue Pompidou',
        city: 'Dakar',
        price: 120000000,
        surface: 150,
        coordinates: [14.6692, -17.4330],
        status: 'EN_GESTION',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'prop_3',
        title: 'Terrain Almadies',
        type: 'TERRAIN',
        address: 'Route des Almadies',
        city: 'Dakar',
        price: 300000000,
        surface: 400,
        coordinates: [14.7458, -17.5144],
        status: 'LITIGE',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'prop_4',
        title: 'Immeuble Cocody',
        type: 'IMMEUBLE',
        address: 'Boulevard de France',
        city: 'Abidjan',
        price: 850000000,
        surface: 1200,
        coordinates: [5.3599, -4.0083],
        status: 'A_VENDRE',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'prop_5',
        title: 'Villa Zone 4',
        type: 'MAISON',
        address: 'Rue du 7 Décembre',
        city: 'Abidjan',
        price: 350000000,
        surface: 500,
        coordinates: [5.2978, -3.9680],
        status: 'EN_GESTION',
        imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=1000&auto=format&fit=crop'
    }
];
