// Types pour le Portail Client
// Interface entre le cabinet notarial et les clients

export interface ClientPortalUser {
    id: string;
    clientId: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    hashedPassword: string;
    isActive: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    preferences: ClientPortalPreferences;
}

export interface ClientPortalPreferences {
    language: 'fr' | 'wo' | 'ar' | 'en';
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
}

export interface ClientDossier {
    id: string;
    reference: string;
    acteType: string;
    acteLabel: string;
    status: DossierStatus;
    createdAt: Date;
    updatedAt: Date;
    estimatedCompletionDate?: Date;
    progress: number; // 0-100
    currentStep?: string;
    assignedNotary: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    parties: DossierParty[];
    documents: ClientDocument[];
    timeline: TimelineEvent[];
    messages: Message[];
    canUploadDocuments: boolean;
    canSign: boolean;
    requiresAction: boolean;
}

export type DossierStatus =
    | 'draft'
    | 'pending_documents'
    | 'in_review'
    | 'ready_for_signature'
    | 'signed'
    | 'completed'
    | 'cancelled';

export interface DossierParty {
    id: string;
    role: 'buyer' | 'seller' | 'donor' | 'donee' | 'testator' | 'heir' | 'associate' | 'other';
    roleLabel: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
}

export interface ClientDocument {
    id: string;
    name: string;
    type: DocumentType;
    category: string;
    size: number;
    uploadedAt: Date;
    uploadedBy: 'client' | 'notary';
    status: 'pending' | 'approved' | 'rejected' | 'requires_update';
    isRequired: boolean;
    canDownload: boolean;
    canDelete: boolean;
    url?: string;
    notes?: string;
}

export type DocumentType =
    | 'identity'
    | 'proof_of_address'
    | 'title_deed'
    | 'diagnostic'
    | 'bank_statement'
    | 'tax_document'
    | 'contract'
    | 'other';

export interface TimelineEvent {
    id: string;
    date: Date;
    type: 'created' | 'document_uploaded' | 'document_approved' | 'step_completed' | 'signed' | 'message' | 'other';
    title: string;
    description: string;
    icon?: string;
    actor?: {
        name: string;
        role: 'client' | 'notary' | 'system';
    };
}

export interface Message {
    id: string;
    dossierId: string;
    senderId: string;
    senderName: string;
    senderRole: 'client' | 'notary';
    recipientId: string;
    subject?: string;
    content: string;
    attachments?: MessageAttachment[];
    isRead: boolean;
    sentAt: Date;
    readAt?: Date;
}

export interface MessageAttachment {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
}

export interface ClientAppointment {
    id: string;
    dossierId?: string;
    title: string;
    description?: string;
    date: Date;
    duration: number; // in minutes
    location: string;
    type: 'consultation' | 'signature' | 'document_review' | 'other';
    status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
    notary: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    canReschedule: boolean;
    canCancel: boolean;
    reminderSent: boolean;
}

export interface ClientPayment {
    id: string;
    dossierId: string;
    reference: string;
    description: string;
    amount: number;
    currency: 'XOF' | 'EUR';
    status: 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
    dueDate: Date;
    paidAt?: Date;
    paymentMethod?: 'cash' | 'check' | 'bank_transfer' | 'card' | 'mobile_money';
    invoiceUrl?: string;
    receiptUrl?: string;
}

// Service du portail client
export class ClientPortalService {
    // Obtenir les dossiers d'un client
    static async getClientDossiers(clientId: string): Promise<ClientDossier[]> {
        // TODO: Implémenter la récupération depuis la base de données
        return [];
    }

    // Obtenir un dossier spécifique
    static async getDossier(dossierId: string, clientId: string): Promise<ClientDossier | null> {
        // TODO: Implémenter avec vérification des droits d'accès
        return null;
    }

    // Uploader un document
    static async uploadDocument(
        dossierId: string,
        clientId: string,
        file: File,
        category: string
    ): Promise<ClientDocument> {
        // TODO: Implémenter l'upload avec validation
        throw new Error('Not implemented');
    }

    // Télécharger un document
    static async downloadDocument(
        documentId: string,
        clientId: string
    ): Promise<Blob> {
        // TODO: Implémenter avec vérification des droits
        throw new Error('Not implemented');
    }

    // Envoyer un message
    static async sendMessage(
        dossierId: string,
        clientId: string,
        content: string,
        subject?: string,
        attachments?: File[]
    ): Promise<Message> {
        // TODO: Implémenter l'envoi de message
        throw new Error('Not implemented');
    }

    // Obtenir les messages
    static async getMessages(
        dossierId: string,
        clientId: string
    ): Promise<Message[]> {
        // TODO: Implémenter la récupération des messages
        return [];
    }

    // Marquer un message comme lu
    static async markMessageAsRead(
        messageId: string,
        clientId: string
    ): Promise<void> {
        // TODO: Implémenter
    }

    // Obtenir les rendez-vous
    static async getAppointments(clientId: string): Promise<ClientAppointment[]> {
        // TODO: Implémenter
        return [];
    }

    // Prendre un rendez-vous
    static async bookAppointment(
        clientId: string,
        dossierId: string | undefined,
        date: Date,
        type: ClientAppointment['type'],
        notes?: string
    ): Promise<ClientAppointment> {
        // TODO: Implémenter
        throw new Error('Not implemented');
    }

    // Annuler un rendez-vous
    static async cancelAppointment(
        appointmentId: string,
        clientId: string,
        reason?: string
    ): Promise<void> {
        // TODO: Implémenter
    }

    // Obtenir les paiements
    static async getPayments(clientId: string): Promise<ClientPayment[]> {
        // TODO: Implémenter
        return [];
    }

    // Effectuer un paiement
    static async makePayment(
        paymentId: string,
        clientId: string,
        method: ClientPayment['paymentMethod'],
        amount: number
    ): Promise<void> {
        // TODO: Implémenter avec intégration paiement
    }

    // Obtenir le profil client
    static async getClientProfile(clientId: string): Promise<ClientPortalUser | null> {
        // TODO: Implémenter
        return null;
    }

    // Mettre à jour le profil
    static async updateProfile(
        clientId: string,
        updates: Partial<ClientPortalUser>
    ): Promise<ClientPortalUser> {
        // TODO: Implémenter
        throw new Error('Not implemented');
    }

    // Changer le mot de passe
    static async changePassword(
        clientId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        // TODO: Implémenter avec vérification
    }

    // Demander une réinitialisation de mot de passe
    static async requestPasswordReset(email: string): Promise<void> {
        // TODO: Implémenter avec envoi d'email
    }

    // Vérifier l'email
    static async verifyEmail(token: string): Promise<void> {
        // TODO: Implémenter
    }

    // Vérifier le téléphone
    static async verifyPhone(clientId: string, code: string): Promise<void> {
        // TODO: Implémenter
    }
}

// Statistiques du portail client
export interface ClientPortalStats {
    totalDossiers: number;
    activeDossiers: number;
    completedDossiers: number;
    pendingDocuments: number;
    unreadMessages: number;
    upcomingAppointments: number;
    pendingPayments: number;
    totalPaid: number;
}

export class ClientPortalStatsService {
    static async getStats(clientId: string): Promise<ClientPortalStats> {
        // TODO: Implémenter le calcul des statistiques
        return {
            totalDossiers: 0,
            activeDossiers: 0,
            completedDossiers: 0,
            pendingDocuments: 0,
            unreadMessages: 0,
            upcomingAppointments: 0,
            pendingPayments: 0,
            totalPaid: 0
        };
    }
}

// Notifications temps réel pour le portail client
export class ClientPortalNotifications {
    // S'abonner aux notifications d'un dossier
    static subscribeToDossier(dossierId: string, callback: (event: any) => void): () => void {
        // TODO: Implémenter avec WebSocket ou Server-Sent Events
        return () => { }; // Fonction de désabonnement
    }

    // S'abonner aux messages
    static subscribeToMessages(clientId: string, callback: (message: Message) => void): () => void {
        // TODO: Implémenter
        return () => { };
    }

    // S'abonner aux mises à jour de statut
    static subscribeToStatusUpdates(
        dossierId: string,
        callback: (status: DossierStatus) => void
    ): () => void {
        // TODO: Implémenter
        return () => { };
    }
}
