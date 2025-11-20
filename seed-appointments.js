const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

try {
    const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(fileContent);

    if (!data.appointments) {
        data.appointments = [];
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const newAppointments = [
        {
            id: 'apt-1',
            title: 'Signature Compromis de Vente',
            date: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
            duration: 60,
            clientId: 'client-1',
            dossierId: 'dossier-1',
            notes: 'Préparer les pièces d\'identité.'
        },
        {
            id: 'apt-2',
            title: 'Rendez-vous de renseignement',
            date: new Date(today.setHours(16, 30, 0, 0)).toISOString(),
            duration: 30,
            clientId: 'client-2',
            notes: 'Questions sur succession.'
        },
        {
            id: 'apt-3',
            title: 'Signature Acte de Notoriété',
            date: new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString(),
            duration: 45,
            clientId: 'client-1',
            dossierId: 'dossier-2',
            notes: 'Présence de tous les héritiers requise.'
        }
    ];

    data.appointments.push(...newAppointments);

    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    console.log('Appointments seeded successfully.');

} catch (error) {
    console.error('Error seeding appointments:', error);
}
