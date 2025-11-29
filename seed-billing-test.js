// Script to create test data for billing module
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, 'data.json');

// Read existing data
let data = {};
if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

// Ensure arrays exist
if (!data.clients) data.clients = [];
if (!data.dossiers) data.dossiers = [];
if (!data.actes) data.actes = [];

// Create a test client
const testClient = {
    id: uuidv4(),
    type: 'INDIVIDUAL',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+221 77 123 45 67',
    address: '15 Avenue Léopold Sédar Senghor',
    city: 'Dakar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

// Create a test dossier
const testDossier = {
    id: uuidv4(),
    ref: 'DOS-2024-001',
    title: 'Vente Appartement Dakar',
    type: 'VENTE',
    status: 'EN_COURS',
    clientId: testClient.id,
    assignedTo: data.users && data.users[0] ? data.users[0].id : 'user-1',
    createdAt: new Date().toISOString()
};

// Create a signed acte (ready for billing)
const testActe = {
    id: uuidv4(),
    type: 'VENTE',
    category: 'IMMOBILIER',
    title: 'Acte de Vente - Appartement 3 pièces Plateau',
    createdAt: new Date().toISOString(),
    dossierId: testDossier.id,
    status: 'SIGNE', // Important: must be SIGNE or ENREGISTRE for billing
    metadata: {
        seller: {
            firstName: 'Marie',
            lastName: 'Martin',
            address: '10 Rue de la République',
            city: 'Dakar',
            zipCode: '10000'
        },
        buyer: {
            firstName: 'Jean',
            lastName: 'Dupont',
            address: '15 Avenue Léopold Sédar Senghor',
            city: 'Dakar',
            zipCode: '10000'
        },
        property: {
            address: '25 Boulevard de la République',
            city: 'Dakar',
            zipCode: '10000',
            price: 50000000, // 50 million FCFA
            description: 'Appartement 3 pièces, 85m², 2ème étage'
        }
    }
};

// Add test data
data.clients.push(testClient);
data.dossiers.push(testDossier);
data.actes.push(testActe);

// Save data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log('✅ Test data created successfully!');
console.log(`📋 Client: ${testClient.firstName} ${testClient.lastName}`);
console.log(`📁 Dossier: ${testDossier.ref} - ${testDossier.title}`);
console.log(`📄 Acte: ${testActe.title} (${testActe.status})`);
console.log('\n🎯 You can now test invoice creation at:');
console.log('   http://localhost:3000/dashboard/facturation/new');
