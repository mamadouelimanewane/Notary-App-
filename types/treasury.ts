export type BankAccountType = 'OFFICE' | 'CLIENT' | 'BLOCKED';

export interface BankAccount {
    id: string;
    name: string; // e.g., "Compte Principal", "Compte CDC"
    bankName: string;
    accountNumber: string;
    iban?: string;
    bic?: string;
    currency: string;
    balance: number;
    type: BankAccountType;
    glAccount: string; // Compte comptable associé (ex: 512100)
    isActive: boolean;
    lastReconciledAt?: string;
}

export type CashTransactionType = 'IN' | 'OUT';
export type CashTransactionCategory = 'HONORAIRES' | 'DEBOURS' | 'PROVISION' | 'RESTITUTION' | 'AUTRE';

export interface CashTransaction {
    id: string;
    date: string;
    type: CashTransactionType;
    amount: number;
    currency: string;
    description: string;
    category: CashTransactionCategory;
    reference?: string; // Numéro de reçu
    dossierId?: string; // Lien optionnel avec un dossier
    clientId?: string; // Lien optionnel avec un client
    accountingEntryId?: string; // Lien vers l'écriture comptable générée
    createdBy: string;
    createdAt: string;
}

export type TransferStatus = 'DRAFT' | 'PENDING_VALIDATION' | 'VALIDATED' | 'REJECTED' | 'EXECUTED';

export interface FundTransfer {
    id: string;
    date: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    currency: string;
    reference: string;
    description: string;
    status: TransferStatus;
    dossierId?: string; // Si le virement concerne un dossier
    createdBy: string;
    validatedBy?: string;
    executedAt?: string;
    createdAt: string;
}

export interface TreasuryStats {
    totalOfficeFunds: number;
    totalClientFunds: number;
    totalCash: number;
    monthlyInflow: number;
    monthlyOutflow: number;
}
