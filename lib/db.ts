import fs from 'fs';
import path from 'path';
import type { Account, JournalEntry, AccountEntry, Journal, FiscalPeriod, AccountingSettings } from './accounting/types';

const DB_PATH = path.join(process.cwd(), 'data.json');

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string; // Hashed with bcrypt
    role: 'ADMIN' | 'NOTAIRE' | 'CLERC' | 'ASSISTANT';
    createdAt: string;
    lastLogin?: string;
    isActive: boolean;
}

export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    type: 'PARTICULIER' | 'ENTREPRISE';
    // Champs spécifiques aux entreprises
    companyName?: string;
    ninea?: string; // Numéro d'Identification National des Entreprises et Associations (Sénégal)
    legalForm?: string; // SARL, SAS, SA, etc.
    registrationNumber?: string; // Numéro au RCCM (Registre du Commerce et du Crédit Mobilier)
    contactPerson?: string; // Personne de contact pour les entreprises
    isDeleted?: boolean;
    createdAt?: string;
}

export interface Dossier {
    id: string;
    ref: string;
    title: string;
    type: string;
    status: 'OUVERT' | 'EN_COURS' | 'CLOTURE' | 'ARCHIVE';
    clientId: string;
    assignedTo: string;
    createdAt: string;
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    description: string;
    dossierId: string;
    bankTransactionId?: string;
    reconciled: boolean;
    reconciledAt?: string;
}

export interface Appointment {
    id: string;
    title: string;
    date: string;
    duration: number;
    clientId?: string;
    dossierId?: string;
    notes?: string;
}

export interface Acte {
    id: string;
    type: 'CONTRAT_MARIAGE' | 'DONATION_SIMPLE' | 'DONATION_EPOUX' | 'DONATION_PARTAGE' | 'DONATION_USUFRUIT' |
    'TESTAMENT' | 'NOTORIETE' | 'PARTAGE_SUCCESSION' | 'PACS' | 'CONSENTEMENT_PMA' |
    'VENTE' | 'COMPROMIS' | 'VEFA' | 'HYPOTHEQUE' | 'MAINLEVEE' | 'SERVITUDE' | 'BAIL_EMPHYTEOTIQUE' | 'DEMEMBREMENT' |
    'SCI' | 'CESSION_PARTS' | 'BAIL_COMMERCIAL' | 'BAIL_PROFESSIONNEL' | 'CONVENTION_ENTREPRISE' | 'CAUTIONNEMENT' |
    'PRET' | 'PROCURATION' | 'CONSTAT' | 'CERTIFICAT_PROPRIETE' | 'INVENTAIRE' | 'PERSONNALISE';
    category: 'FAMILLE' | 'IMMOBILIER' | 'AFFAIRES' | 'AUTRE';
    title: string;
    createdAt: string;
    dossierId: string;
    status: 'BROUILLON' | 'SIGNE' | 'ENREGISTRE';
    metadata: {
        seller?: { firstName: string; lastName: string; address: string; city: string; zipCode: string };
        buyer?: { firstName: string; lastName: string; address: string; city: string; zipCode: string };
        property?: { address: string; city: string; zipCode: string; price: number; description: string };
    };
}

export interface Template {
    id: string;
    name: string;
    acteType: string;
    category: 'FAMILLE' | 'IMMOBILIER' | 'AFFAIRES' | 'AUTRE';
    content: string;
    variables: string[];
    createdAt: string;
    updatedAt: string;
    isDefault: boolean;
}

export interface BankStatement {
    id: string;
    fileName: string;
    uploadedAt: string;
    totalTransactions: number;
    reconciledCount: number;
}

export interface BankTransaction {
    id: string;
    statementId: string;
    date: string;
    description: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    accountingTransactionId?: string;
    reconciled: boolean;
    reconciledAt?: string;
}

export interface Signature {
    id: string;
    userId: string;
    signatureData: string; // Base64 encoded signature image
    createdAt: string;
    isActive: boolean;
}

export interface AppSettings {
    id: string;
    officeName: string;
    address: string;
    phone: string;
    email: string;
    tvaNumber: string;
    legalMentions: string;
    securitySettings: {
        sessionTimeout: number;
        maxLoginAttempts: number;
    };
    updatedAt: string;
}

export interface DatabaseSchema {
    users: User[];
    clients: Client[];
    dossiers: Dossier[];
    transactions: Transaction[];
    appointments: Appointment[];
    actes: Acte[];
    templates: Template[];
    bankStatements: BankStatement[];
    bankTransactions: BankTransaction[];
    signatures: Signature[];
    settings: AppSettings[];
    // OHADA Accounting
    accounts: Account[];
    journals: Journal[];
    journalEntries: JournalEntry[];
    accountEntries: AccountEntry[];
    fiscalPeriods: FiscalPeriod[];
    accountingSettings: AccountingSettings;
}

const initialData: DatabaseSchema = {
    users: [],
    clients: [],
    dossiers: [],
    transactions: [],
    appointments: [],
    actes: [],
    templates: [],
    bankStatements: [],
    bankTransactions: [],
    signatures: [],
    settings: [{
        id: 'default',
        officeName: 'Étude Notariale',
        address: '',
        phone: '',
        email: '',
        tvaNumber: '',
        legalMentions: '',
        securitySettings: {
            sessionTimeout: 3600,
            maxLoginAttempts: 5
        },
        updatedAt: new Date().toISOString()
    }],
    // OHADA Accounting
    accounts: [],
    journals: [],
    journalEntries: [],
    accountEntries: [],
    fiscalPeriods: [],
    accountingSettings: {
        fiscalYearStart: '01-01',
        tvaRate: 18,
        currency: 'FCFA',
        decimalPlaces: 0,
        autoImputationEnabled: true,
        requireValidation: false
    }
};

export class JsonDB {
    private data: DatabaseSchema;

    constructor() {
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
            this.data = initialData;
        } else {
            try {
                const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
                this.data = JSON.parse(fileContent);
                if (!this.data.transactions) this.data.transactions = [];
                if (!this.data.appointments) this.data.appointments = [];
                if (!this.data.actes) this.data.actes = [];
                if (!this.data.templates) this.data.templates = [];
                if (!this.data.bankStatements) this.data.bankStatements = [];
                if (!this.data.bankTransactions) this.data.bankTransactions = [];
                if (!this.data.signatures) this.data.signatures = [];
                if (!this.data.settings) this.data.settings = [initialData.settings[0]];
                // OHADA Accounting
                if (!this.data.accounts) this.data.accounts = [];
                if (!this.data.journals) this.data.journals = [];
                if (!this.data.journalEntries) this.data.journalEntries = [];
                if (!this.data.accountEntries) this.data.accountEntries = [];
                if (!this.data.fiscalPeriods) this.data.fiscalPeriods = [];
                if (!this.data.accountingSettings) this.data.accountingSettings = initialData.accountingSettings;
            } catch (error) {
                console.error('Error reading DB, resetting:', error);
                this.data = initialData;
                this.save();
            }
        }
    }

    private save() {
        fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
    }

    get users() { return this.data.users; }
    get clients() { return this.data.clients; }
    get dossiers() { return this.data.dossiers; }
    get transactions() { return this.data.transactions; }
    get appointments() { return this.data.appointments; }
    get actes() { return this.data.actes; }
    get templates() { return this.data.templates; }
    get bankStatements() { return this.data.bankStatements; }
    get bankTransactions() { return this.data.bankTransactions; }
    get signatures() { return this.data.signatures; }
    get settings() { return this.data.settings[0]; }
    // Accounting getters
    get accounts() { return this.data.accounts; }
    get journals() { return this.data.journals; }
    get journalEntries() { return this.data.journalEntries; }
    get accountEntries() { return this.data.accountEntries; }
    get fiscalPeriods() { return this.data.fiscalPeriods; }
    get accountingSettings() { return this.data.accountingSettings; }

    addUser(user: User) {
        this.data.users.push(user);
        this.save();
        return user;
    }

    updateUser(id: string, updates: Partial<User>) {
        const index = this.data.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.data.users[index] = { ...this.data.users[index], ...updates };
            this.save();
            return this.data.users[index];
        }
        return null;
    }

    deleteUser(id: string) {
        const index = this.data.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.data.users[index].isActive = false;
            this.save();
            return true;
        }
        return false;
    }

    getUsersByRole(role: User['role']) {
        return this.data.users.filter(u => u.role === role);
    }

    addClient(client: Client) {
        this.data.clients.push(client);
        this.save();
        return client;
    }

    updateClient(id: string, updates: Partial<Client>) {
        const index = this.data.clients.findIndex(c => c.id === id);
        if (index !== -1) {
            this.data.clients[index] = { ...this.data.clients[index], ...updates };
            this.save();
            return this.data.clients[index];
        }
        return null;
    }

    deleteClient(id: string) {
        const index = this.data.clients.findIndex(c => c.id === id);
        if (index !== -1) {
            this.data.clients[index].isDeleted = true;
            this.save();
            return true;
        }
        return false;
    }

    getClient(id: string) {
        return this.data.clients.find(c => c.id === id && !c.isDeleted);
    }

    addDossier(dossier: Dossier) {
        this.data.dossiers.push(dossier);
        this.save();
        return dossier;
    }

    updateDossier(id: string, updates: Partial<Dossier>) {
        const index = this.data.dossiers.findIndex(d => d.id === id);
        if (index !== -1) {
            this.data.dossiers[index] = { ...this.data.dossiers[index], ...updates };
            this.save();
            return this.data.dossiers[index];
        }
        return null;
    }

    addTransaction(transaction: Transaction) {
        this.data.transactions.push(transaction);
        this.save();
        return transaction;
    }

    updateTransaction(id: string, updates: Partial<Transaction>) {
        const index = this.data.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            this.data.transactions[index] = { ...this.data.transactions[index], ...updates };
            this.save();
            return this.data.transactions[index];
        }
        return null;
    }

    deleteTransaction(id: string) {
        const index = this.data.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            this.data.transactions.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    getTransaction(id: string) {
        return this.data.transactions.find(t => t.id === id);
    }

    addAppointment(appointment: Appointment) {
        this.data.appointments.push(appointment);
        this.save();
        return appointment;
    }

    addActe(acte: Acte) {
        this.data.actes.push(acte);
        this.save();
        return acte;
    }

    updateActe(id: string, updates: Partial<Acte>) {
        const index = this.data.actes.findIndex(a => a.id === id);
        if (index !== -1) {
            this.data.actes[index] = { ...this.data.actes[index], ...updates };
            this.save();
            return this.data.actes[index];
        }
        return null;
    }

    deleteActe(id: string) {
        const index = this.data.actes.findIndex(a => a.id === id);
        if (index !== -1) {
            this.data.actes.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    getActe(id: string) {
        return this.data.actes.find(a => a.id === id);
    }

    addTemplate(template: Template) {
        this.data.templates.push(template);
        this.save();
        return template;
    }

    updateTemplate(id: string, updates: Partial<Template>) {
        const index = this.data.templates.findIndex(t => t.id === id);
        if (index !== -1) {
            this.data.templates[index] = { ...this.data.templates[index], ...updates, updatedAt: new Date().toISOString() };
            this.save();
            return this.data.templates[index];
        }
        return null;
    }

    deleteTemplate(id: string) {
        const index = this.data.templates.findIndex(t => t.id === id);
        if (index !== -1) {
            this.data.templates.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    // Signature methods
    addSignature(signature: Signature) {
        this.data.signatures.push(signature);
        this.save();
        return signature;
    }

    getUserSignature(userId: string) {
        return this.data.signatures.find(s => s.userId === userId && s.isActive);
    }

    deactivateUserSignatures(userId: string) {
        this.data.signatures.forEach(sig => {
            if (sig.userId === userId && sig.isActive) {
                sig.isActive = false;
            }
        });
        this.save();
    }

    // Settings methods
    getSettings() {
        return this.data.settings[0];
    }

    updateSettings(updates: Partial<AppSettings>) {
        this.data.settings[0] = {
            ...this.data.settings[0],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        this.save();
        return this.data.settings[0];
    }

    // =====================================
    // OHADA ACCOUNTING METHODS
    // =====================================

    // Accounts
    addAccount(account: Account) {
        this.data.accounts.push(account);
        this.save();
        return account;
    }

    updateAccount(code: string, updates: Partial<Account>) {
        const index = this.data.accounts.findIndex(a => a.code === code);
        if (index !== -1) {
            this.data.accounts[index] = { ...this.data.accounts[index], ...updates };
            this.save();
            return this.data.accounts[index];
        }
        return null;
    }

    // Journals
    addJournal(journal: Journal) {
        this.data.journals.push(journal);
        this.save();
        return journal;
    }

    // Journal Entries
    addJournalEntry(journalEntry: JournalEntry) {
        this.data.journalEntries.push(journalEntry);
        // Add associated account entries
        journalEntry.entries.forEach(entry => {
            this.data.accountEntries.push(entry);
        });
        this.save();
        return journalEntry;
    }

    getJournalEntry(id: string) {
        return this.data.journalEntries.find(je => je.id === id);
    }

    updateJournalEntry(id: string, updates: Partial<JournalEntry>) {
        const index = this.data.journalEntries.findIndex(je => je.id === id);
        if (index !== -1) {
            this.data.journalEntries[index] = { ...this.data.journalEntries[index], ...updates };
            this.save();
            return this.data.journalEntries[index];
        }
        return null;
    }

    deleteJournalEntry(id: string) {
        const journalIndex = this.data.journalEntries.findIndex(je => je.id === id);
        if (journalIndex !== -1) {
            // Delete associated account entries
            this.data.accountEntries = this.data.accountEntries.filter(
                ae => ae.journalEntryId !== id
            );
            // Delete journal entry
            this.data.journalEntries.splice(journalIndex, 1);
            this.save();
            return true;
        }
        return false;
    }

    // Get entries by period
    getJournalEntriesByPeriod(startDate: string, endDate: string) {
        return this.data.journalEntries.filter(
            je => je.date >= startDate && je.date <= endDate
        );
    }

    // Get entries by account
    getEntriesByAccount(accountCode: string) {
        return this.data.accountEntries.filter(ae => ae.accountCode === accountCode);
    }

    // Fiscal Periods
    addFiscalPeriod(period: FiscalPeriod) {
        this.data.fiscalPeriods.push(period);
        this.save();
        return period;
    }

    closeFiscalPeriod(id: string) {
        const index = this.data.fiscalPeriods.findIndex(fp => fp.id === id);
        if (index !== -1) {
            this.data.fiscalPeriods[index].isClosed = true;
            this.data.fiscalPeriods[index].closedAt = new Date().toISOString();
            this.save();
            return this.data.fiscalPeriods[index];
        }
        return null;
    }

    updateAccountingSettings(updates: Partial<AccountingSettings>) {
        this.data.accountingSettings = {
            ...this.data.accountingSettings,
            ...updates
        };
        this.save();
        return this.data.accountingSettings;
    }
}

export const db = new JsonDB();
