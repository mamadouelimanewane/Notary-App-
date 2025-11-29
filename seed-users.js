// Seed default users with hashed passwords
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function seedUsers() {
    const dataPath = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const notairePassword = await bcrypt.hash('notaire123', 10);
    const clercPassword = await bcrypt.hash('clerc123', 10);
    const comptablePassword = await bcrypt.hash('comptable123', 10);

    const users = [
        {
            id: 'user-admin',
            firstName: 'Admin',
            lastName: 'Système',
            email: 'admin@notary.fr',
            password: adminPassword,
            role: 'ADMIN',
            createdAt: new Date().toISOString(),
            isActive: true
        },
        {
            id: 'user-notaire',
            firstName: 'Marie',
            lastName: 'Dubois',
            email: 'marie.dubois@notary.fr',
            password: notairePassword,
            role: 'NOTAIRE',
            createdAt: new Date().toISOString(),
            isActive: true
        },
        {
            id: 'user-clerc',
            firstName: 'Jean',
            lastName: 'Martin',
            email: 'jean.martin@notary.fr',
            password: clercPassword,
            role: 'CLERC',
            createdAt: new Date().toISOString(),
            isActive: true
        },
        {
            id: 'user-comptable',
            firstName: 'Pierre',
            lastName: 'Durand',
            email: 'pierre.durand@notary.fr',
            password: comptablePassword,
            role: 'COMPTABLE',
            createdAt: new Date().toISOString(),
            isActive: true
        }
    ];

    data.users = users;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('✅ Users seeded successfully!');
    console.log('📧 Credentials:');
    console.log('   Admin: admin@notary.fr / admin123');
    console.log('   Notaire: marie.dubois@notary.fr / notaire123');
    console.log('   Clerc: jean.martin@notary.fr / clerc123');
    console.log('   Comptable: pierre.durand@notary.fr / comptable123');
}

seedUsers().catch(console.error);
