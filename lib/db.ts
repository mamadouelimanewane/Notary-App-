import fs from 'fs';
import path from 'path';

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

    addUser(user: User) {
        this.data.users.push(user);
        this.save();
        return user;
    }

    addClient(client: Client) {
        this.data.clients.push(client);
        this.save();
        return client;
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
}

export const db = new JsonDB();
