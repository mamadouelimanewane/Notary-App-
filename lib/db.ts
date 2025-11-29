import fs from 'fs';
import path from 'path';
import type { Account, JournalEntry, AccountEntry, Journal, FiscalPeriod, AccountingSettings } from './accounting/types';
import type { Invoice, Payment, CommunicationTemplate, CommunicationLog, AutomationRule, ClientPortalUser, ClientDocument, ClientMessage, Property, PropertyType, PropertyStatus, PropertyVisit, PropertyOffer, AuditLog } from './types';
import type { Formalite, FormaliteDocument, FormaliteHistorique } from '../types/formalite-types';
import type { BankAccount, CashTransaction, FundTransfer } from '../types/treasury';
import type { ClientOnboarding, TimelineEvent, Notification } from '../types/client-journey';

import {
    User, Client, Dossier, Transaction, Appointment, Acte, Template, Task, InternalNotification,
    BankStatement, BankTransaction, Signature, AppSettings, DatabaseSchema, DossierDocument,
    WorkflowTemplate, WorkflowInstance
} from '../types/db';

const DB_PATH = path.join(process.cwd(), 'data.json');

const initialData: DatabaseSchema = {
    users: [],
    clients: [],
    dossiers: [],
    dossierDocuments: [],
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
        documentHeader: '',
        securitySettings: {
            sessionTimeout: 3600,
            maxLoginAttempts: 5
        },
        updatedAt: new Date().toISOString()
    }],
    tasks: [],
    internalNotifications: [],
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
    },
    // Billing
    invoices: [],
    payments: [],
    // Formalités
    formalites: [],
    formaliteDocuments: [],
    formaliteHistorique: [],
    // Treasury
    bankAccounts: [],
    cashTransactions: [],
    fundTransfers: [],
    // Client Journey
    clientOnboardings: [],
    timelineEvents: [],
    notifications: [],
    // CRM & Communication
    communicationTemplates: [],
    communicationLogs: [],
    automationRules: [],
    // Client Portal
    clientPortalUsers: [],
    clientDocuments: [],
    clientMessages: [],
    // Real Estate
    properties: [],
    propertyVisits: [],
    propertyOffers: [],
    auditLogs: [],
    workflows: [],
    workflowInstances: []
};



export class JsonDB {
    private data: DatabaseSchema;

    constructor() {
        try {
            if (!fs.existsSync(DB_PATH)) {
                fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
                this.data = initialData;
            } else {
                const loadedData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
                // Merge loaded data with initialData to ensure all fields exist
                this.data = { ...initialData, ...loadedData };
            }

            // Ensure all arrays exist (migrations)
            if (!this.data.tasks) this.data.tasks = [];
            if (!this.data.internalNotifications) this.data.internalNotifications = [];
            // OHADA Accounting
            if (!this.data.accounts) this.data.accounts = [];
            if (!this.data.journals) this.data.journals = [];
            if (!this.data.journalEntries) this.data.journalEntries = [];
            if (!this.data.accountEntries) this.data.accountEntries = [];
            if (!this.data.fiscalPeriods) this.data.fiscalPeriods = [];
            if (!this.data.accountingSettings) this.data.accountingSettings = initialData.accountingSettings;
            // Billing
            if (!this.data.invoices) this.data.invoices = [];
            if (!this.data.payments) this.data.payments = [];
            // Formalités
            if (!this.data.formalites) this.data.formalites = [];
            if (!this.data.formaliteDocuments) this.data.formaliteDocuments = [];
            if (!this.data.formaliteHistorique) this.data.formaliteHistorique = [];
            // Treasury
            if (!this.data.bankAccounts) this.data.bankAccounts = [];
            if (!this.data.cashTransactions) this.data.cashTransactions = [];
            if (!this.data.fundTransfers) this.data.fundTransfers = [];
            // Client Journey
            if (!this.data.clientOnboardings) this.data.clientOnboardings = [];
            if (!this.data.timelineEvents) this.data.timelineEvents = [];
            if (!this.data.notifications) this.data.notifications = [];
            // CRM & Communication
            if (!this.data.communicationTemplates) this.data.communicationTemplates = [];
            if (!this.data.communicationLogs) this.data.communicationLogs = [];
            if (!this.data.automationRules) this.data.automationRules = [];
            // Client Portal
            if (!this.data.clientPortalUsers) this.data.clientPortalUsers = [];
            if (!this.data.clientDocuments) this.data.clientDocuments = [];
            if (!this.data.clientMessages) this.data.clientMessages = [];
            // Real Estate
            if (!this.data.properties) this.data.properties = [];
            if (!this.data.propertyVisits) this.data.propertyVisits = [];
            if (!this.data.propertyOffers) this.data.propertyOffers = [];
            if (!this.data.auditLogs) this.data.auditLogs = [];
            if (!this.data.workflows) this.data.workflows = [];
            if (!this.data.workflowInstances) this.data.workflowInstances = [];
        } catch (error) {
            console.error('Error reading DB, resetting:', error);
            this.data = initialData;
            this.save();
        }
    }

    reload() {
        try {
            if (fs.existsSync(DB_PATH)) {
                this.data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
            }
        } catch (error) {
            console.error('Error reloading DB:', error);
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
    // Billing getters
    get invoices() { return this.data.invoices; }
    get payments() { return this.data.payments; }
    // Formalités getters
    get formalites() { return this.data.formalites; }
    get formaliteDocuments() { return this.data.formaliteDocuments; }
    get formaliteHistorique() { return this.data.formaliteHistorique; }
    // Treasury getters
    get bankAccounts() { return this.data.bankAccounts; }
    get cashTransactions() { return this.data.cashTransactions; }
    get fundTransfers() { return this.data.fundTransfers; }
    // Client Journey getters
    get clientOnboardings() { return this.data.clientOnboardings; }
    get timelineEvents() { return this.data.timelineEvents; }
    get notifications() { return this.data.notifications; }
    // CRM & Communication getters
    get communicationTemplates() { return this.data.communicationTemplates; }
    get communicationLogs() { return this.data.communicationLogs; }
    get automationRules() { return this.data.automationRules; }
    // Client Portal getters
    get clientPortalUsers() { return this.data.clientPortalUsers; }
    get clientDocuments() { return this.data.clientDocuments; }
    get clientMessages() { return this.data.clientMessages; }
    // Real Estate getters
    get properties() { return this.data.properties; }
    get propertyVisits() { return this.data.propertyVisits; }
    get propertyOffers() { return this.data.propertyOffers; }
    get auditLogs() { return this.data.auditLogs; }
    get workflows() { return this.data.workflows; }
    get workflowInstances() { return this.data.workflowInstances; }

    addAuditLog(log: AuditLog) {
        this.data.auditLogs.push(log);
        this.save();
        return log;
    }

    // Get individual entities by ID
    getUser(id: string) {
        return this.data.users.find(u => u.id === id);
    }

    getClient(id: string) {
        return this.data.clients.find(c => c.id === id);
    }

    getDossier(id: string) {
        return this.data.dossiers.find(d => d.id === id);
    }

    getActe(id: string) {
        return this.data.actes.find(a => a.id === id);
    }

    getTemplate(id: string) {
        return this.data.templates.find(t => t.id === id);
    }

    getAppointment(id: string) {
        return this.data.appointments.find(a => a.id === id);
    }

    getTransaction(id: string) {
        return this.data.transactions.find(t => t.id === id);
    }

    getSignature(id: string) {
        return this.data.signatures.find(s => s.id === id);
    }

    getArchive(id: string) {
        return this.data.archives.find(a => a.id === id);
    }

    getInvoice(id: string) {
        return this.data.invoices.find(i => i.id === id);
    }

    getPayment(id: string) {
        return this.data.payments.find(p => p.id === id);
    }

    getFormalite(id: string) {
        return this.data.formalites.find(f => f.id === id);
    }

    getProperty(id: string) {
        return this.data.properties.find(p => p.id === id);
    }

    getWorkflow(id: string) {
        return this.data.workflows.find(w => w.id === id);
    }

    getWorkflowInstance(id: string) {
        return this.data.workflowInstances.find(w => w.id === id);
    }

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
        }
    }

    // Treasury Methods
    addBankAccount(account: BankAccount) {
        this.data.bankAccounts.push(account);
        this.save();
        return account;
    }

    addCashTransaction(transaction: CashTransaction) {
        this.data.cashTransactions.push(transaction);
        this.save();
        return transaction;
    }

    addFundTransfer(transfer: FundTransfer) {
        this.data.fundTransfers.push(transfer);
        this.save();
        return transfer;
    }

    addBankStatement(statement: BankStatement) {
        this.data.bankStatements.push(statement);
        this.save();
        return statement;
    }

    addBankTransactions(transactions: BankTransaction[]) {
        this.data.bankTransactions.push(...transactions);
        this.save();
        return transactions;
    }

    reconcileTransactions(bankTransactionId: string, accountingTransactionId: string) {
        const bankTxIndex = this.data.bankTransactions.findIndex(t => t.id === bankTransactionId);
        const accTxIndex = this.data.transactions.findIndex(t => t.id === accountingTransactionId);

        if (bankTxIndex === -1 || accTxIndex === -1) return false;

        const now = new Date().toISOString();

        // Update Bank Transaction
        this.data.bankTransactions[bankTxIndex] = {
            ...this.data.bankTransactions[bankTxIndex],
            reconciled: true,
            reconciledAt: now,
            accountingTransactionId
        };

        // Update Accounting Transaction
        this.data.transactions[accTxIndex] = {
            ...this.data.transactions[accTxIndex],
            reconciled: true,
            reconciledAt: now,
            bankTransactionId
        };

        // Update Statement Stats
        const statementId = this.data.bankTransactions[bankTxIndex].statementId;
        const stmtIndex = this.data.bankStatements.findIndex(s => s.id === statementId);
        if (stmtIndex !== -1) {
            this.data.bankStatements[stmtIndex].reconciledCount += 1;
        }

        this.save();
        return true;
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
            this.data.clients.splice(index, 1);
            this.save();
        }
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

    deleteDossier(id: string) {
        const index = this.data.dossiers.findIndex(d => d.id === id);
        if (index !== -1) {
            this.data.dossiers.splice(index, 1);
            this.save();
        }
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

    updateAppointment(id: string, updates: Partial<Appointment>) {
        const index = this.data.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            this.data.appointments[index] = { ...this.data.appointments[index], ...updates };
            this.save();
            return this.data.appointments[index];
        }
        return null;
    }

    deleteAppointment(id: string) {
        const index = this.data.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            this.data.appointments.splice(index, 1);
            this.save();
        }
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
        }
    }

    getActesByDossier(dossierId: string) {
        return this.data.actes.filter(a => a.dossierId === dossierId);
    }

    addTemplate(template: Template) {
        this.data.templates.push(template);
        this.save();
        return template;
    }

    updateTemplate(id: string, updates: Partial<Template>) {
        const index = this.data.templates.findIndex(t => t.id === id);
        if (index !== -1) {
            this.data.templates[index] = { ...this.data.templates[index], ...updates };
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
        }
    }

    getSettings() {
        return this.data.settings[0];
    }

    // Tasks
    addTask(task: Task) {
        this.data.tasks.push(task);
        this.save();
        return task;
    }

    updateTask(task: Task) {
        const index = this.data.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
            this.data.tasks[index] = task;
            this.save();
            return task;
        }
        return null;
    }

    getTasksByDossier(dossierId: string) {
        return this.data.tasks.filter(t => t.dossierId === dossierId);
    }

    // Internal Notifications
    addInternalNotification(notification: InternalNotification) {
        this.data.internalNotifications.push(notification);
        this.save();
        return notification;
    }

    getUnreadNotifications(userId: string) {
        return this.data.internalNotifications.filter(n => n.userId === userId && !n.read);
    }

    markNotificationAsRead(id: string) {
        const notification = this.data.internalNotifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.save();
        }
        return notification;
    }

    addSignature(signature: Signature) {
        this.data.signatures.push(signature);
        this.save();
        return signature;
    }

    updateSettings(updates: Partial<AppSettings>) {
        this.data.settings[0] = { ...this.data.settings[0], ...updates, updatedAt: new Date().toISOString() };
        this.save();
        return this.data.settings[0];
    }

    // OHADA Accounting Methods
    addAccount(account: Account) {
        this.data.accounts.push(account);
        this.save();
        return account;
    }

    addJournal(journal: Journal) {
        this.data.journals.push(journal);
        this.save();
        return journal;
    }

    addJournalEntry(entry: JournalEntry) {
        this.data.journalEntries.push(entry);
        this.save();
        return entry;
    }

    addAccountEntry(entry: AccountEntry) {
        this.data.accountEntries.push(entry);
        this.save();
        return entry;
    }

    addFiscalPeriod(period: FiscalPeriod) {
        this.data.fiscalPeriods.push(period);
        this.save();
        return period;
    }

    updateAccountingSettings(settings: Partial<AccountingSettings>) {
        this.data.accountingSettings = { ...this.data.accountingSettings, ...settings };
        this.save();
        return this.data.accountingSettings;
    }

    // Billing Methods
    addInvoice(invoice: Invoice) {
        this.data.invoices.push(invoice);
        this.save();
        return invoice;
    }

    addPayment(payment: Payment) {
        this.data.payments.push(payment);
        this.save();
        return payment;
    }

    // Formalités Methods
    addFormalite(formalite: Formalite) {
        this.data.formalites.push(formalite);
        this.save();
        return formalite;
    }

    updateFormalite(id: string, updates: Partial<Formalite>) {
        const index = this.data.formalites.findIndex(f => f.id === id);
        if (index !== -1) {
            this.data.formalites[index] = { ...this.data.formalites[index], ...updates };
            this.save();
            return this.data.formalites[index];
        }
        return null;
    }

    addFormaliteDocument(document: FormaliteDocument) {
        this.data.formaliteDocuments.push(document);
        this.save();
        return document;
    }

    addFormaliteHistorique(historique: FormaliteHistorique) {
        this.data.formaliteHistorique.push(historique);
        this.save();
        return historique;
    }

    // Client Journey Methods
    addClientOnboarding(onboarding: ClientOnboarding) {
        this.data.clientOnboardings.push(onboarding);
        this.save();
        return onboarding;
    }

    updateClientOnboarding(id: string, updates: Partial<ClientOnboarding>) {
        const index = this.data.clientOnboardings.findIndex(o => o.id === id);
        if (index !== -1) {
            this.data.clientOnboardings[index] = { ...this.data.clientOnboardings[index], ...updates };
            this.save();
            return this.data.clientOnboardings[index];
        }
        return null;
    }

    addTimelineEvent(event: TimelineEvent) {
        this.data.timelineEvents.push(event);
        this.save();
        return event;
    }

    addNotification(notification: Notification) {
        this.data.notifications.push(notification);
        this.save();
        return notification;
    }

    markNotificationRead(id: string) {
        const notification = this.data.notifications.find(n => n.id === id);
        if (notification) {
            notification.isRead = true;
            this.save();
        }
        return notification;
    }

    // CRM & Communication Methods
    addCommunicationTemplate(template: CommunicationTemplate) {
        this.data.communicationTemplates.push(template);
        this.save();
        return template;
    }

    updateCommunicationTemplate(id: string, updates: Partial<CommunicationTemplate>) {
        const index = this.data.communicationTemplates.findIndex(t => t.id === id);
        if (index !== -1) {
            this.data.communicationTemplates[index] = { ...this.data.communicationTemplates[index], ...updates };
            this.save();
            return this.data.communicationTemplates[index];
        }
        return null;
    }

    deleteCommunicationTemplate(id: string) {
        const index = this.data.communicationTemplates.findIndex(t => t.id === id);
        if (index !== -1) {
            this.data.communicationTemplates.splice(index, 1);
            this.save();
        }
    }

    addCommunicationLog(log: CommunicationLog) {
        this.data.communicationLogs.push(log);
        this.save();
        return log;
    }

    addAutomationRule(rule: AutomationRule) {
        this.data.automationRules.push(rule);
        this.save();
        return rule;
    }

    updateAutomationRule(id: string, updates: Partial<AutomationRule>) {
        const index = this.data.automationRules.findIndex(r => r.id === id);
        if (index !== -1) {
            this.data.automationRules[index] = { ...this.data.automationRules[index], ...updates };
            this.save();
            return this.data.automationRules[index];
        }
        return null;
    }

    deleteAutomationRule(id: string) {
        const index = this.data.automationRules.findIndex(r => r.id === id);
        if (index !== -1) {
            this.data.automationRules.splice(index, 1);
            this.save();
        }
    }

    // Client Portal Methods
    addClientPortalUser(user: ClientPortalUser) {
        this.data.clientPortalUsers.push(user);
        this.save();
        return user;
    }

    updateClientPortalUser(id: string, updates: Partial<ClientPortalUser>) {
        const index = this.data.clientPortalUsers.findIndex(u => u.id === id);
        if (index !== -1) {
            this.data.clientPortalUsers[index] = { ...this.data.clientPortalUsers[index], ...updates };
            this.save();
            return this.data.clientPortalUsers[index];
        }
        return null;
    }

    addClientDocument(document: ClientDocument) {
        this.data.clientDocuments.push(document);
        this.save();
        return document;
    }

    addClientMessage(message: ClientMessage) {
        this.data.clientMessages.push(message);
        this.save();
        return message;
    }

    markClientMessageAsRead(id: string) {
        const message = this.data.clientMessages.find(m => m.id === id);
        if (message) {
            message.isRead = true;
            this.save();
        }
        return message;
    }

    // Real Estate Methods
    addProperty(property: Property) {
        this.data.properties.push(property);
        this.save();
        return property;
    }

    updateProperty(id: string, updates: Partial<Property>) {
        const index = this.data.properties.findIndex(p => p.id === id);
        if (index !== -1) {
            this.data.properties[index] = { ...this.data.properties[index], ...updates };
            this.save();
            return this.data.properties[index];
        }
        return null;
    }

    addPropertyVisit(visit: PropertyVisit) {
        this.data.propertyVisits.push(visit);
        this.save();
        return visit;
    }

    addPropertyOffer(offer: PropertyOffer) {
        this.data.propertyOffers.push(offer);
        this.save();
        return offer;
    }

    updatePropertyOffer(id: string, updates: Partial<PropertyOffer>) {
        const index = this.data.propertyOffers.findIndex(o => o.id === id);
        if (index !== -1) {
            this.data.propertyOffers[index] = { ...this.data.propertyOffers[index], ...updates };
            this.save();
            return this.data.propertyOffers[index];
        }
        return null;
    }

    // Workflow Methods
    addWorkflow(workflow: WorkflowTemplate) {
        this.data.workflows.push(workflow);
        this.save();
        return workflow;
    }

    addWorkflowInstance(instance: WorkflowInstance) {
        this.data.workflowInstances.push(instance);
        this.save();
        return instance;
    }

    updateWorkflowInstance(id: string, updates: Partial<WorkflowInstance>) {
        const index = this.data.workflowInstances.findIndex(w => w.id === id);
        if (index !== -1) {
            this.data.workflowInstances[index] = { ...this.data.workflowInstances[index], ...updates };
            this.save();
            return this.data.workflowInstances[index];
        }
        return null;
    }


    // Dossier Documents
    addDossierDocument(document: DossierDocument) {
        this.data.dossierDocuments.push(document);
        this.save();
        return document;
    }

    getDossierDocuments(dossierId: string) {
        return this.data.dossierDocuments.filter(d => d.dossierId === dossierId);
    }

    deleteDossierDocument(id: string) {
        const index = this.data.dossierDocuments.findIndex(d => d.id === id);
        if (index !== -1) {
            this.data.dossierDocuments.splice(index, 1);
            this.save();
        }
    }
}

export const db = new JsonDB();
