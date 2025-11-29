import type { Account, JournalEntry, AccountEntry, Journal, FiscalPeriod, AccountingSettings } from '../lib/accounting/types';
import type { Invoice, Payment, CommunicationTemplate, CommunicationLog, AutomationRule, ClientPortalUser, ClientDocument, ClientMessage, Property, PropertyVisit, PropertyOffer } from '../lib/types';
import type { Formalite, FormaliteDocument, FormaliteHistorique } from './formalite-types';
import type { BankAccount, CashTransaction, FundTransfer } from './treasury';
import type { ClientOnboarding, TimelineEvent, Notification } from './client-journey';

import { Permission, Role } from '../lib/rbac';
import { AuditLog } from '../lib/types';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string; // Hashed with bcrypt
    role: Role;
    permissions?: Permission[];
    createdAt: string;
    lastLogin?: string;
    isActive: boolean;
    associatedNotaries?: string[]; // IDs of other notaries this user is associated with
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
    passwordChangedAt?: string;
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
    workflowId?: string;
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
    'TESTAMENT' | 'NOTORIETE' | 'PARTAGE_SUCCESSION' | 'VENTE_IMMOBILIERE' |
    'VENTE' | 'COMPROMIS' | 'VEFA' | 'HYPOTHEQUE' | 'MAINLEVEE' | 'SERVITUDE' | 'BAIL_EMPHYTEOTIQUE' | 'DEMEMBREMENT' |
    'SCI' | 'CESSION_PARTS' | 'BAIL_COMMERCIAL' | 'BAIL_PROFESSIONNEL' | 'CONVENTION_ENTREPRISE' | 'CAUTIONNEMENT' |
    'PRET' | 'PROCURATION' | 'CONSTAT' | 'CERTIFICAT_PROPRIETE' | 'INVENTAIRE' | 'PERSONNALISE';
    category: 'FAMILLE' | 'IMMOBILIER' | 'AFFAIRES' | 'AUTRE';
    title: string;
    createdAt: string;
    dossierId: string;
    status: 'BROUILLON' | 'EN_REVISION' | 'VALIDE' | 'SIGNE' | 'ENREGISTRE' | 'ARCHIVE';
    comments: {
        id: string;
        userId: string;
        userName: string;
        content: string;
        createdAt: string;
    }[];
    history: {
        id: string;
        userId: string;
        userName: string;
        action: string;
        oldStatus: string;
        newStatus: string;
        timestamp: string;
        metadata?: any;
    }[];
    blockchain: {
        blockId: string;
        previousHash: string;
        currentHash: string;
        timestamp: string;
        data: any;
        signature?: string;
    }[];
    clientAccess?: {
        token: string;
        expiresAt: string;
        status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
        lastAccessedAt?: string;
    };
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
    fileData?: string; // Base64 encoded DOCX file
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
    documentHeader?: string; // Text or HTML for document header
    securitySettings: {
        sessionTimeout: number;
        maxLoginAttempts: number;
    };
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dossierId: string;
    assignedTo?: string; // User ID
    createdAt: string;
    completedAt?: string;
}

export interface InternalNotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    read: boolean;
    createdAt: string;
    link?: string;
}

export interface DossierDocument {
    id: string;
    dossierId: string;
    name: string;
    type: string; // MIME type
    size: number;
    uploadedBy: string;
    uploadedAt: string;
    fileData?: string; // Base64 encoded content (optional for now, or use a separate storage)
}

export interface WorkflowTemplate {
    id: string;
    title: string;
    description: string;
    steps: WorkflowStepTemplate[];
}

export interface WorkflowStepTemplate {
    id: string;
    title: string;
    description: string;
    role: string;
    requiredDocuments?: string[];
    estimatedDuration?: number; // days
    automations?: WorkflowAutomation[];
}

export interface WorkflowAutomation {
    type: 'SEND_EMAIL' | 'GENERATE_DOCUMENT';
    templateId: string;
    target?: 'CLIENT' | 'ASSIGNED_USER';
}

export interface WorkflowInstance {
    id: string;
    templateId: string;
    dossierId: string;
    currentStepIndex: number;
    steps: WorkflowStepInstance[];
    status: 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
    createdAt: string;
    updatedAt: string;
}

export interface WorkflowStepInstance {
    id: string;
    templateId: string; // ID of the step template
    title: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    completedBy?: string;
    completedAt?: string;
    notes?: string;
    assigneeId?: string;
    dueDate?: string;
}

export interface DatabaseSchema {
    users: User[];
    clients: Client[];
    dossiers: Dossier[];
    dossierDocuments: DossierDocument[];
    transactions: Transaction[];
    appointments: Appointment[];
    actes: Acte[];
    templates: Template[];
    bankStatements: BankStatement[];
    bankTransactions: BankTransaction[];
    signatures: Signature[];
    settings: AppSettings[];
    tasks: Task[];
    internalNotifications: InternalNotification[];

    workflows: WorkflowTemplate[];
    workflowInstances: WorkflowInstance[];
    // OHADA Accounting
    accounts: Account[];
    journals: Journal[];
    journalEntries: JournalEntry[];
    accountEntries: AccountEntry[];
    fiscalPeriods: FiscalPeriod[];
    accountingSettings: AccountingSettings;
    // Billing
    invoices: Invoice[];
    payments: Payment[];
    // Formalités
    formalites: Formalite[];
    formaliteDocuments: FormaliteDocument[];
    formaliteHistorique: FormaliteHistorique[];
    // Treasury
    bankAccounts: BankAccount[];
    cashTransactions: CashTransaction[];
    fundTransfers: FundTransfer[];
    // Client Journey
    clientOnboardings: ClientOnboarding[];
    timelineEvents: TimelineEvent[];
    notifications: Notification[];
    // CRM & Communication
    communicationTemplates: CommunicationTemplate[];
    communicationLogs: CommunicationLog[];
    automationRules: AutomationRule[];
    // Client Portal
    clientPortalUsers: ClientPortalUser[];
    clientDocuments: ClientDocument[];
    clientMessages: ClientMessage[];
    // Real Estate
    properties: Property[];
    propertyVisits: PropertyVisit[];
    propertyOffers: PropertyOffer[];
    auditLogs: AuditLog[];
}
