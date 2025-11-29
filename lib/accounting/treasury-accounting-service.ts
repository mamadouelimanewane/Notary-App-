import { db } from '../db';
import type { JournalEntry, AccountEntry } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service de gestion de la trésorerie (Banque et Caisse)
 * Gère les mouvements de trésorerie et génère les écritures comptables
 */
export class TreasuryAccountingService {
    /**
     * Enregistre un mouvement de banque (encaissement ou décaissement)
     */
    static recordBankMovement(params: {
        date: string;
        amount: number;
        type: 'ENCAISSEMENT' | 'DECAISSEMENT';
        accountCode: string;  // Compte de contrepartie (ex: 411, 401, 6xx, 7xx)
        accountLabel: string;
        label: string;
        reference?: string;
        dossierId?: string;
        bankAccount?: string; // Code du compte banque (défaut: 521)
    }): { entry: JournalEntry; entries: AccountEntry[] } {
        const journalId = uuidv4();
        const entries: AccountEntry[] = [];
        const bankAccountCode = params.bankAccount || '521';

        if (params.type === 'ENCAISSEMENT') {
            // Débit Banque
            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: bankAccountCode,
                accountLabel: 'Banques locales',
                debit: params.amount,
                credit: 0,
                label: params.label
            });

            // Crédit Compte de contrepartie
            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: params.accountCode,
                accountLabel: params.accountLabel,
                debit: 0,
                credit: params.amount,
                label: params.label
            });
        } else {
            // Débit Compte de contrepartie
            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: params.accountCode,
                accountLabel: params.accountLabel,
                debit: params.amount,
                credit: 0,
                label: params.label
            });

            // Crédit Banque
            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: bankAccountCode,
                accountLabel: 'Banques locales',
                debit: 0,
                credit: params.amount,
                label: params.label
            });
        }

        const journalEntry: JournalEntry = {
            id: journalId,
            journalId: 'BQ', // Journal de banque
            date: params.date,
            reference: params.reference || `BQ-${Date.now().toString().slice(-8)}`,
            label: params.label,
            dossierId: params.dossierId,
            entries,
            validated: false,
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            metadata: {
                type: 'BANK_MOVEMENT',
                movementType: params.type
            }
        };

        return { entry: journalEntry, entries };
    }

    /**
     * Enregistre un mouvement de caisse (encaissement ou décaissement)
     */
    static recordCashMovement(params: {
        date: string;
        amount: number;
        type: 'ENCAISSEMENT' | 'DECAISSEMENT';
        accountCode: string;
        accountLabel: string;
        label: string;
        reference?: string;
        dossierId?: string;
    }): { entry: JournalEntry; entries: AccountEntry[] } {
        const journalId = uuidv4();
        const entries: AccountEntry[] = [];

        if (params.type === 'ENCAISSEMENT') {
            // Débit Caisse
            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '57',
                accountLabel: 'Caisse',
                debit: params.amount,
                credit: 0,
                label: params.label
            });

            // Crédit Compte de contrepartie
            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: params.accountCode,
                accountLabel: params.accountLabel,
                debit: 0,
                credit: params.amount,
                label: params.label
            });
        } else {
            // Débit Compte de contrepartie
            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: params.accountCode,
                accountLabel: params.accountLabel,
                debit: params.amount,
                credit: 0,
                label: params.label
            });

            // Crédit Caisse
            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '57',
                accountLabel: 'Caisse',
                debit: 0,
                credit: params.amount,
                label: params.label
            });
        }

        const journalEntry: JournalEntry = {
            id: journalId,
            journalId: 'CA', // Journal de caisse
            date: params.date,
            reference: params.reference || `CA-${Date.now().toString().slice(-8)}`,
            label: params.label,
            dossierId: params.dossierId,
            entries,
            validated: false,
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            metadata: {
                type: 'CASH_MOVEMENT',
                movementType: params.type
            }
        };

        return { entry: journalEntry, entries };
    }

    /**
     * Enregistre un virement interne (Banque → Caisse ou Caisse → Banque)
     */
    static recordInternalTransfer(params: {
        date: string;
        amount: number;
        from: 'BANK' | 'CASH';
        to: 'BANK' | 'CASH';
        label: string;
        reference?: string;
    }): { entry: JournalEntry; entries: AccountEntry[] } {
        const journalId = uuidv4();
        const entries: AccountEntry[] = [];

        const fromAccount = params.from === 'BANK' ? { code: '521', label: 'Banques locales' } : { code: '57', label: 'Caisse' };
        const toAccount = params.to === 'BANK' ? { code: '521', label: 'Banques locales' } : { code: '57', label: 'Caisse' };

        // Débit compte destination
        entries.push({
            id: uuidv4(),
            journalEntryId: journalId,
            accountCode: toAccount.code,
            accountLabel: toAccount.label,
            debit: params.amount,
            credit: 0,
            label: params.label
        });

        // Crédit compte source
        entries.push({
            id: uuidv4(),
            journalEntryId: journalId,
            accountCode: fromAccount.code,
            accountLabel: fromAccount.label,
            debit: 0,
            credit: params.amount,
            label: params.label
        });

        const journalEntry: JournalEntry = {
            id: journalId,
            journalId: 'OD', // Opérations diverses
            date: params.date,
            reference: params.reference || `VIR-${Date.now().toString().slice(-8)}`,
            label: params.label,
            entries,
            validated: false,
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            metadata: {
                type: 'INTERNAL_TRANSFER',
                from: params.from,
                to: params.to
            }
        };

        return { entry: journalEntry, entries };
    }

    /**
     * Calcule le solde de la banque
     */
    static getBankBalance(bankAccountCode: string = '521'): number {
        const entries = db.getAccountEntries(bankAccountCode);
        return entries.reduce((sum, entry) => sum + entry.debit - entry.credit, 0);
    }

    /**
     * Calcule le solde de la caisse
     */
    static getCashBalance(): number {
        const entries = db.getAccountEntries('57');
        return entries.reduce((sum, entry) => sum + entry.debit - entry.credit, 0);
    }

    /**
     * Récupère tous les mouvements de banque sur une période
     */
    static getBankMovements(params: {
        startDate: string;
        endDate: string;
        bankAccountCode?: string;
    }): JournalEntry[] {
        const accountCode = params.bankAccountCode || '521';
        return db.journalEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            const start = new Date(params.startDate);
            const end = new Date(params.endDate);

            const hasAccountMovement = entry.entries.some(e => e.accountCode === accountCode);
            const isInPeriod = entryDate >= start && entryDate <= end;

            return hasAccountMovement && isInPeriod;
        });
    }

    /**
     * Récupère tous les mouvements de caisse sur une période
     */
    static getCashMovements(params: {
        startDate: string;
        endDate: string;
    }): JournalEntry[] {
        return db.journalEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            const start = new Date(params.startDate);
            const end = new Date(params.endDate);

            const hasCashMovement = entry.entries.some(e => e.accountCode === '57');
            const isInPeriod = entryDate >= start && entryDate <= end;

            return hasCashMovement && isInPeriod;
        });
    }

    /**
     * Génère le livre de banque
     */
    static generateBankBook(params: {
        startDate: string;
        endDate: string;
        bankAccountCode?: string;
    }) {
        const accountCode = params.bankAccountCode || '521';
        const movements = this.getBankMovements(params);

        let balance = 0;
        const lines = movements.map(entry => {
            const accountEntry = entry.entries.find(e => e.accountCode === accountCode);
            if (!accountEntry) return null;

            const movement = accountEntry.debit - accountEntry.credit;
            balance += movement;

            return {
                date: entry.date,
                reference: entry.reference,
                label: entry.label,
                debit: accountEntry.debit,
                credit: accountEntry.credit,
                balance
            };
        }).filter(Boolean);

        return {
            accountCode,
            accountLabel: 'Banques locales',
            startDate: params.startDate,
            endDate: params.endDate,
            openingBalance: 0, // TODO: Calculer depuis les périodes précédentes
            movements: lines,
            closingBalance: balance
        };
    }

    /**
     * Génère le livre de caisse
     */
    static generateCashBook(params: {
        startDate: string;
        endDate: string;
    }) {
        const movements = this.getCashMovements(params);

        let balance = 0;
        const lines = movements.map(entry => {
            const cashEntry = entry.entries.find(e => e.accountCode === '57');
            if (!cashEntry) return null;

            const movement = cashEntry.debit - cashEntry.credit;
            balance += movement;

            return {
                date: entry.date,
                reference: entry.reference,
                label: entry.label,
                debit: cashEntry.debit,
                credit: cashEntry.credit,
                balance
            };
        }).filter(Boolean);

        return {
            accountCode: '57',
            accountLabel: 'Caisse',
            startDate: params.startDate,
            endDate: params.endDate,
            openingBalance: 0, // TODO: Calculer depuis les périodes précédentes
            movements: lines,
            closingBalance: balance
        };
    }
}
