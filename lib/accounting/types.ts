// Types et interfaces pour le système comptable OHADA

/**
 * Classes de comptes OHADA (1-9)
 */
export type AccountClass = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

/**
 * Type de compte (Actif, Passif, Charge, Produit)
 */
export type AccountType = 'ACTIF' | 'PASSIF' | 'CHARGE' | 'PRODUIT' | 'RESULTAT';

/**
 * Nature d'un compte (Débiteur ou Créditeur)
 */
export type AccountNature = 'DEBIT' | 'CREDIT';

/**
 * Compte du plan comptable OHADA
 */
export interface Account {
    code: string;           // Ex: "411", "706", "521"
    label: string;          // Ex: "Clients", "Prestations de services"
    classCode: AccountClass;
    type: AccountType;
    nature: AccountNature;  // Nature habituelle du solde
    description?: string;
    parent?: string;        // Code du compte parent
    isActive: boolean;
    isSummary: boolean;     // Compte collectif (non imputable)
}

/**
 * Écriture comptable (ligne dans le journal)
 */
export interface AccountEntry {
    id: string;
    journalEntryId: string; // Référence à l'écriture globale
    accountCode: string;
    accountLabel: string;
    debit: number;
    credit: number;
    label: string;          // Libellé spécifique de la ligne
}

/**
 * Écriture au journal (regroupement de lignes)
 */
export interface JournalEntry {
    id: string;
    date: string;
    reference: string;      // Ex: "FAC-2024-001", "PAY-123"
    label: string;          // Libellé général
    transactionId?: string; // Lien avec Transaction si applicable
    dossierId?: string;     // Lien avec Dossier si applicable
    entries: AccountEntry[]; // Lignes débit/crédit
    validated: boolean;     // Écriture validée
    createdAt: string;
    createdBy: string;      // userId
}

/**
 * Type de journal comptable
 */
export type JournalType =
    | 'VENTES'        // Journal des ventes (honoraires)
    | 'ACHATS'        // Journal des achats
    | 'BANQUE'        // Journal de banque
    | 'CAISSE'        // Journal de caisse
    | 'OPERATIONS'    // Opérations diverses
    | 'NOUVEAU';      // À-nouveaux

/**
 * Configuration d'un journal
 */
export interface Journal {
    id: string;
    code: string;       // Ex: "VT", "BQ", "OD"
    label: string;
    type: JournalType;
    isActive: boolean;
}

/**
 * Ligne de balance
 */
export interface BalanceLine {
    accountCode: string;
    accountLabel: string;
    debitOpening: number;   // Solde d'ouverture débiteur
    creditOpening: number;  // Solde d'ouverture créditeur
    debitMovement: number;  // Mouvements débiteurs
    creditMovement: number; // Mouvements créditeurs
    debitClosing: number;   // Solde de clôture débiteur
    creditClosing: number;  // Solde de clôture créditeur
}

/**
 * Règle d'imputation automatique
 */
export interface AccountingRule {
    id: string;
    name: string;
    transactionType?: 'CREDIT' | 'DEBIT';
    conditions: {
        field: string;      // Ex: "type", "description"
        operator: '=' | '!=' | 'contains' | 'startsWith';
        value: string;
    }[];
    entries: {
        accountCode: string;
        side: 'DEBIT' | 'CREDIT';
        amountField: 'amount' | 'amountHT' | 'tva' | 'amountTTC';
        formula?: string;   // Ex: "amount * 0.18" pour TVA
    }[];
}

/**
 * Période comptable
 */
export interface FiscalPeriod {
    id: string;
    label: string;
    startDate: string;
    endDate: string;
    isClosed: boolean;
    closedAt?: string;
}

/**
 * Paramètres comptables du cabinet
 */
export interface AccountingSettings {
    fiscalYearStart: string;    // "01-01" ou "07-01" etc.
    tvaRate: number;             // 18 pour UEMOA
    currency: string;            // "FCFA"
    decimalPlaces: number;       // 0 ou 2
    autoImputationEnabled: boolean;
    requireValidation: boolean;  // Validation obligatoire des écritures
}
