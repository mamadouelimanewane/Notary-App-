const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

try {
    const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(fileContent);

    if (!data.transactions) {
        data.transactions = [];
    }

    const newTransactions = [
        {
            id: 'trans-1',
            date: new Date().toISOString(),
            amount: 15000,
            type: 'CREDIT',
            description: 'Virement Acquéreur (Dépôt de garantie)',
            dossierId: 'dossier-1'
        },
        {
            id: 'trans-2',
            date: new Date().toISOString(),
            amount: 450,
            type: 'DEBIT',
            description: 'Frais de dossier',
            dossierId: 'dossier-1'
        },
        {
            id: 'trans-3',
            date: new Date().toISOString(),
            amount: 1200,
            type: 'DEBIT',
            description: 'Provision sur frais',
            dossierId: 'dossier-2'
        }
    ];

    data.transactions.push(...newTransactions);

    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    console.log('Transactions seeded successfully.');

} catch (error) {
    console.error('Error seeding transactions:', error);
}
