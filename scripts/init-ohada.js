const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '..', 'data.json');
const ACCOUNTS_PATH = path.join(__dirname, '..', 'data', 'ohada-accounts.json');

/**
 * Script d'initialisation du plan comptable OHADA
 */
async function initializeOhadaAccounts() {
    console.log('\n🚀 Initialisation du Plan Comptable OHADA\n');

    // 1. Charger la base de données
    let db;
    try {
        const dbContent = fs.readFileSync(DB_PATH, 'utf-8');
        db = JSON.parse(dbContent);
        console.log('✅ Base de données chargée');
    } catch (error) {
        console.error('❌ Erreur lors du chargement de la base:', error.message);
        return;
    }

    // 2. Charger le plan comptable OHADA
    let ohadaData;
    try {
        const ohadaContent = fs.readFileSync(ACCOUNTS_PATH, 'utf-8');
        ohadaData = JSON.parse(ohadaContent);
        console.log(`✅ Plan comptable OHADA chargé (${ohadaData.accounts.length} comptes)`);
    } catch (error) {
        console.error('❌ Erreur lors du chargement du plan OHADA:', error.message);
        return;
    }

    // 3. Initialiser les comptes dans la base
    if (!db.accounts) {
        db.accounts = [];
    }

    // Nettoyer les comptes existants (optionnel)
    if (db.accounts.length > 0) {
        console.log(`⚠️  ${db.accounts.length} comptes existants seront remplacés`);
    }

    db.accounts = ohadaData.accounts.map(acc => ({
        ...acc,
        isActive: acc.isActive !== false
    }));

    // 4. Initialiser les journaux comptables
    if (!db.journals) {
        db.journals = [];
    }

    const defaultJournals = [
        {
            id: uuidv4(),
            code: 'VT',
            label: 'Journal des ventes',
            type: 'VENTES',
            isActive: true
        },
        {
            id: uuidv4(),
            code: 'AC',
            label: 'Journal des achats',
            type: 'ACHATS',
            isActive: true
        },
        {
            id: uuidv4(),
            code: 'BQ',
            label: 'Journal de banque',
            type: 'BANQUE',
            isActive: true
        },
        {
            id: uuidv4(),
            code: 'CA',
            label: 'Journal de caisse',
            type: 'CAISSE',
            isActive: true
        },
        {
            id: uuidv4(),
            code: 'OD',
            label: 'Opérations diverses',
            type: 'OPERATIONS',
            isActive: true
        },
        {
            id: uuidv4(),
            code: 'AN',
            label: 'À-nouveaux',
            type: 'NOUVEAU',
            isActive: true
        }
    ];

    db.journals = defaultJournals;
    console.log(`✅ ${db.journals.length} journaux comptables créés`);

    // 5. Initialiser les autres champs si nécessaire
    if (!db.journalEntries) db.journalEntries = [];
    if (!db.accountEntries) db.accountEntries = [];
    if (!db.fiscalPeriods) db.fiscalPeriods = [];

    if (!db.accountingSettings) {
        db.accountingSettings = {
            fiscalYearStart: '01-01',
            tvaRate: 18,
            currency: 'FCFA',
            decimalPlaces: 0,
            autoImputationEnabled: true,
            requireValidation: false
        };
    }

    // 6. Sauvegarder la base de données
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        console.log('✅ Base de données sauvegardée\n');
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error.message);
        return;
    }

    // 7. Afficher un résumé
    console.log('📊 RÉSUMÉ DE L\'INITIALISATION:');
    console.log(`   • Comptes OHADA  : ${db.accounts.length}`);
    console.log(`   • Journaux       : ${db.journals.length}`);
    console.log(`   • TVA configurée : ${db.accountingSettings.tvaRate}%`);
    console.log(`   • Devise         : ${db.accountingSettings.currency}`);
    console.log('');
    console.log('🎉 Plan comptable OHADA initialisé avec succès!\n');
}

// Exécution
initializeOhadaAccounts().catch(console.error);
