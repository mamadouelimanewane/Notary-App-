import { Account, JournalEntry, AccountEntry, Journal, FiscalPeriod, AccountingSettings } from './accounting/types';
import { Block } from './blockchain';

import { Permission, Role } from './rbac';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string; // Hashed with bcrypt
    role: Role;
    permissions?: Permission[]; // Custom permissions overriding role defaults
    createdAt: string;
    lastLogin?: string;
    isActive: boolean;
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
    passwordChangedAt?: string;
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string; // e.g., 'LOGIN', 'CREATE_USER', 'DELETE_DOSSIER'
    resourceType: string; // e.g., 'USER', 'DOSSIER'
    resourceId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: string;
}

export interface Client {
    id: string;
    type: 'INDIVIDUAL' | 'COMPANY';
    firstName?: string;
    lastName?: string;
    companyName?: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    createdAt: string;
    updatedAt: string;
    notes?: string;
}

export interface Dossier {
    id: string;
    ref: string;
    title: string;
    clientId: string;
    status: 'OUVERT' | 'EN_COURS' | 'CLOTURE' | 'ARCHIVE';
    createdAt: string;
    updatedAt: string;
    description?: string;
    workflowId?: string; // Link to the active workflow instance
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
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    completedBy?: string;
    completedAt?: string;
    notes?: string;
}

export interface Acte {
    id: string;
    dossierId: string;
    title: string;
    type: string; // 'VENTE', 'PROCURATION', etc.
    category: 'FAMILLE' | 'IMMOBILIER' | 'AFFAIRES' | 'AUTRE';
    status: 'BROUILLON' | 'EN_REVISION' | 'VALIDE' | 'SIGNE' | 'ENREGISTRE' | 'ARCHIVE';
    content: any; // Structured content based on template
    createdAt: string;
    updatedAt: string;
    history?: {
        id: string;
        userId: string;
        userName: string;
        action: string;
        oldStatus: string;
        newStatus: string;
        timestamp: string;
        metadata?: any;
    }[];
    comments?: {
        id: string;
        userId: string;
        userName: string;
        content: string;
        createdAt: string;
    }[];
    blockchain?: Block[];
    metadata?: any; // For storing specific fields like buyer, seller, property
}

export interface Template {
    id: string;
    title: string;
    type: string;
    content: string; // HTML/Markdown content with placeholders
    createdAt: string;
    updatedAt: string;
}

export interface BankStatement {
    id: string;
    fileName: string;
    uploadDate: string;
    periodStart?: string;
    periodEnd?: string;
    transactions: BankTransaction[];
    status: 'PENDING' | 'PROCESSED';
}

export interface BankTransaction {
    id: string;
    date: string;
    description: string;
    reference: string;
    amount: number; // Positive for credit, negative for debit
    type: 'CREDIT' | 'DEBIT';
    reconciled: boolean;
    reconciledWith?: {
        type: 'ACTE' | 'CLIENT' | 'EXPENSE';
        id: string;
    };
}

export interface Signature {
    id: string;
    userId: string;
    fileType: 'image/png' | 'image/jpeg';
    data: string; // Base64 encoded image data
    createdAt: string;
    updatedAt: string;
}

export interface AppSettings {
    appName: string;
    companyName: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logoUrl?: string;
    tvaRate: number;
    currency: string;
    theme: 'light' | 'dark' | 'system';
}

export interface DatabaseSchema {
    users: User[];
    clients: Client[];
    dossiers: Dossier[];
    actes: Acte[];
    templates: Template[];
    bankStatements: BankStatement[];
    signatures: Signature[];
    settings: AppSettings;
    // Accounting (OHADA)
    accounts: Account[];
    journalEntries: JournalEntry[];
    journals: Journal[];
    fiscalPeriods: FiscalPeriod[];
    accountingSettings: AccountingSettings;
    // Billing
    invoices: Invoice[];
    payments: Payment[];
}

export interface Transaction {
    id: string;
    dossierId: string;
    amount: number;
    type: 'IN' | 'OUT';
    description: string;
    date: string;
    method: 'CASH' | 'CHECK' | 'TRANSFER';
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface Appointment {
    id: string;
    dossierId?: string;
    clientId?: string;
    title: string;
    date: string;
    duration: number; // minutes
    notes?: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

// Billing Types
export type InvoiceLineItemType = 'EMOLUMENT' | 'DEBOURS' | 'DROIT' | 'TVA';

export interface InvoiceLineItem {
    id: string;
    type: InvoiceLineItemType;
    description: string;
    quantity: number;
    unitPrice: number;
    totalHT: number;
    tvaRate: number;
    totalTTC: number;
}

export interface Invoice {
    id: string;
    number: string; // Numéro de facture (ex: FAC-2024-001)
    acteId: string;
    dossierId: string;
    clientId: string;
    date: string;
    dueDate: string;
    status: 'DRAFT' | 'SENT' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';
    lineItems: InvoiceLineItem[];
    totalEmoluments: number;
    totalDebours: number;
    totalDroits: number;
    totalTVA: number;
    totalHT: number;
    totalTTC: number;
    paidAmount: number;
    remainingAmount: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    id: string;
    invoiceId: string;
    dossierId: string;
    amount: number;
    method: 'CASH' | 'CHECK' | 'TRANSFER' | 'CARD';
    reference?: string; // Numéro de chèque, référence virement
    date: string;
    notes?: string;
    createdBy: string;
    createdAt: string;
}

// Formalities Types
export type FormalityType = 'ENREGISTREMENT' | 'PUBLICATION_FONCIERE' | 'GREFFE' | 'HYPOTHEQUE' | 'AUTRE';
export type FormalityStatus = 'EN_ATTENTE' | 'DEPOSE' | 'REJETE' | 'VALIDE';

export interface Formality {
    id: string;
    acteId: string;
    dossierId: string;
    type: FormalityType;
    title: string;
    description?: string;
    status: FormalityStatus;
    depositDate?: string; // Date de dépôt
    expectedReturnDate?: string; // Date de retour prévue
    actualReturnDate?: string; // Date de retour réelle
    depositReference?: string; // Numéro de bordereau
    rejectionReason?: string; // Motif de rejet
    documents: Array<{
        id: string;
        name: string;
        uploadedAt: string;
    }>;
    notes?: string;
    assignedTo?: string; // Formaliste assigné
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

// CRM & Communication Types
export type CommunicationChannel = 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
export type CommunicationStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'READ';

export interface CommunicationTemplate {
    id: string;
    name: string;
    channel: CommunicationChannel;
    subject?: string; // Pour emails
    body: string; // Avec variables {{nom}}, {{dossier}}, etc.
    variables: string[];
    category: 'DOSSIER' | 'ACTE' | 'PAIEMENT' | 'RDV' | 'GENERAL';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CommunicationLog {
    id: string;
    templateId?: string;
    channel: CommunicationChannel;
    recipient: string; // email ou téléphone
    subject?: string;
    content: string;
    status: CommunicationStatus;
    sentAt?: string;
    deliveredAt?: string;
    readAt?: string;
    error?: string;
    metadata: {
        dossierId?: string;
        clientId?: string;
        acteId?: string;
    };
    createdAt: string;
}

export interface AutomationRule {
    id: string;
    name: string;
    trigger: 'DOSSIER_CREATED' | 'ACTE_SIGNED' | 'PAYMENT_RECEIVED' | 'STATUS_CHANGED' | 'APPOINTMENT_SCHEDULED';
    conditions?: {
        field: string;
        operator: 'equals' | 'contains' | 'greater_than';
        value: any;
    }[];
    actions: {
        type: 'SEND_EMAIL' | 'SEND_SMS' | 'CREATE_TASK' | 'UPDATE_STATUS';
        templateId?: string;
        params?: any;
    }[];
    isActive: boolean;
    createdAt: string;
}

// Client Portal Types
export interface ClientPortalUser {
    id: string;
    clientId: string;
    email: string;
    phone: string;
    passwordHash: string;
    isActive: boolean;
    lastLogin?: string;
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    createdAt: string;
}

export interface ClientDocument {
    id: string;
    clientId: string;
    dossierId?: string;
    name: string;
    type: 'ID_CARD' | 'PROOF_ADDRESS' | 'BANK_STATEMENT' | 'CONTRACT' | 'OTHER';
    fileUrl: string;
    uploadedBy: 'CLIENT' | 'NOTARY';
    uploadedAt: string;
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
}

export interface ClientMessage {
    id: string;
    dossierId: string;
    senderId: string;
    senderType: 'CLIENT' | 'NOTARY';
    content: string;
    attachments?: string[];
    readAt?: string;
    createdAt: string;
}

// Real Estate Types
export type PropertyType = 'APPARTEMENT' | 'MAISON' | 'TERRAIN' | 'COMMERCE' | 'BUREAU';
export type PropertyStatus = 'DISPONIBLE' | 'SOUS_OFFRE' | 'VENDU' | 'RETIRE';

export interface Property {
    id: string;
    ref: string;
    type: PropertyType;
    title: string;
    description: string;
    address: string;
    city: string;
    zipCode: string;
    price: number;
    surface: number;
    rooms?: number;
    bedrooms?: number;
    bathrooms?: number;
    features: string[];
    photos: {
        id: string;
        url: string;
        isPrimary: boolean;
    }[];
    documents: {
        id: string;
        name: string;
        type: 'TITLE_DEED' | 'ENERGY_CERTIFICATE' | 'PLAN' | 'OTHER';
        url: string;
    }[];
    status: PropertyStatus;
    ownerId: string;
    mandateType: 'EXCLUSIF' | 'SIMPLE';
    mandateStartDate: string;
    mandateEndDate: string;
    commission: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface PropertyVisit {
    id: string;
    propertyId: string;
    clientId: string;
    scheduledDate: string;
    duration: number;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    feedback?: string;
    interested: boolean;
    createdAt: string;
}

export interface PropertyOffer {
    id: string;
    propertyId: string;
    clientId: string;
    amount: number;
    conditions?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTER_OFFER';
    counterOfferAmount?: number;
    validUntil: string;
    createdAt: string;
}
