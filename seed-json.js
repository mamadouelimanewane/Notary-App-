const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

const seedData = {
    users: [
        {
            id: 'user-1',
            email: 'notaire@example.com',
            name: 'Maître Dupont',
            role: 'NOTAIRE'
        }
    ],
    clients: [
        {
            id: 'client-1',
            firstName: 'Jean',
            lastName: 'Martin',
            email: 'jean.martin@example.com',
            phone: '0601020304',
            address: '10 Rue de la Paix',
            city: 'Paris',
            zipCode: '75001',
            type: 'PARTICULIER'
        },
        {
            id: 'client-2',
            firstName: 'Sophie',
            lastName: 'Durand',
            email: 'sophie.durand@example.com',
            phone: '0699887766',
            address: '5 Avenue des Champs',
            city: 'Lyon',
            zipCode: '69002',
            type: 'PARTICULIER'
        }
    ],
    dossiers: [
        {
            id: 'dossier-1',
            ref: '2024-001',
            title: 'Vente Appartement Paris',
            type: 'VENTE',
            status: 'EN_COURS',
            clientId: 'client-1',
            assignedTo: 'user-1',
            createdAt: new Date().toISOString()
        },
        {
            id: 'dossier-2',
            ref: '2024-002',
            title: 'Succession Famille Bernard',
            type: 'SUCCESSION',
            status: 'OUVERT',
            clientId: 'client-2',
            assignedTo: 'user-1',
            createdAt: new Date().toISOString()
        }
    ]
};

fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2));
console.log('Database seeded successfully to', DB_PATH);
