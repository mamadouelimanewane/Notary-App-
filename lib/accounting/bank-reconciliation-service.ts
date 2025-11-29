import { db } from '../db';
import type { JournalEntry } from './types';
import { v4 as uuidv4 } from 'uuid';

export interface BankStatementLine {
    id: string;
    date: string;
    reference: string;
    label: string;
    debit: number;
    credit: number;
    balance: number;
}

export interface ReconciliationMatch {
    statementLineId: string;
    journalEntryId: string;
    amount: number;
    matchType: 'EXACT' | 'PARTIAL' | 'MANUAL';
    matchedAt: string;
    matchedBy: string;
}

export interface ReconciliationSession {
    id: string;
    bankAccountCode: string;
    startDate: string;
    endDate: string;
    statementBalance: number;
    accountBalance: number;
    difference: number;
    statementLines: BankStatementLine[];
    matches: ReconciliationMatch[];
    status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    createdBy: string;
    completedAt?: string;
}

/**
 * Service de rapprochement bancaire
 * Permet de pointer les relevés bancaires avec les écritures comptables
 */
export class BankReconciliationService {
    /**
     * Crée une nouvelle session de rapprochement
     */
    static createReconciliationSession(params: {
        bankAccountCode: string;
        startDate: string;
        endDate: string;
        statementLines: Omit<BankStatementLine, 'id'>[];
        userId: string;
    }): ReconciliationSession {
        const session: ReconciliationSession = {
            id: uuidv4(),
            bankAccountCode: params.bankAccountCode,
            startDate: params.startDate,
            endDate: params.endDate,
            statementBalance: this.calculateStatementBalance(params.statementLines),
            accountBalance: this.getAccountBalance(params.bankAccountCode, params.startDate, params.endDate),
            difference: 0,
            statementLines: params.statementLines.map(line => ({
                ...line,
                id: uuidv4()
            })),
            matches: [],
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
            createdBy: params.userId
        };

        session.difference = session.statementBalance - session.accountBalance;

        return session;
    }

    /**
     * Calcule le solde du relevé bancaire
     */
    private static calculateStatementBalance(lines: Omit<BankStatementLine, 'id'>[]): number {
        return lines.reduce((sum, line) => sum + line.debit - line.credit, 0);
    }

    /**
     * Calcule le solde comptable sur une période
     */
    private static getAccountBalance(accountCode: string, startDate: string, endDate: string): number {
        const entries = db.getAccountEntries(accountCode);

        return entries
            .filter(entry => {
                const journalEntry = db.journalEntries.find(je => je.id === entry.journalEntryId);
                if (!journalEntry) return false;

                const entryDate = new Date(journalEntry.date);
                return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
            })
            .reduce((sum, entry) => sum + entry.debit - entry.credit, 0);
    }

    /**
     * Recherche automatique de correspondances
     */
    static findAutomaticMatches(
        session: ReconciliationSession,
        journalEntries: JournalEntry[]
    ): ReconciliationMatch[] {
        const matches: ReconciliationMatch[] = [];

        for (const statementLine of session.statementLines) {
            // Recherche par montant et date exacte
            const exactMatch = this.findExactMatch(statementLine, journalEntries, session.bankAccountCode);
            if (exactMatch) {
                matches.push({
                    statementLineId: statementLine.id,
                    journalEntryId: exactMatch.id,
                    amount: statementLine.debit || statementLine.credit,
                    matchType: 'EXACT',
                    matchedAt: new Date().toISOString(),
                    matchedBy: 'system'
                });
                continue;
            }

            // Recherche par référence
            const referenceMatch = this.findReferenceMatch(statementLine, journalEntries);
            if (referenceMatch) {
                matches.push({
                    statementLineId: statementLine.id,
                    journalEntryId: referenceMatch.id,
                    amount: statementLine.debit || statementLine.credit,
                    matchType: 'EXACT',
                    matchedAt: new Date().toISOString(),
                    matchedBy: 'system'
                });
            }
        }

        return matches;
    }

    /**
     * Recherche une correspondance exacte (montant + date ±3 jours)
     */
    private static findExactMatch(
        statementLine: BankStatementLine,
        journalEntries: JournalEntry[],
        bankAccountCode: string
    ): JournalEntry | null {
        const lineAmount = statementLine.debit || statementLine.credit;
        const lineDate = new Date(statementLine.date);
        const isDebit = statementLine.debit > 0;

        for (const entry of journalEntries) {
            const entryDate = new Date(entry.date);
            const daysDiff = Math.abs((entryDate.getTime() - lineDate.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff > 3) continue; // Date trop éloignée

            const bankEntry = entry.entries.find(e => e.accountCode === bankAccountCode);
            if (!bankEntry) continue;

            const entryAmount = isDebit ? bankEntry.debit : bankEntry.credit;
            if (Math.abs(entryAmount - lineAmount) < 0.01) {
                return entry;
            }
        }

        return null;
    }

    /**
     * Recherche une correspondance par référence
     */
    private static findReferenceMatch(
        statementLine: BankStatementLine,
        journalEntries: JournalEntry[]
    ): JournalEntry | null {
        const reference = statementLine.reference.trim().toUpperCase();

        return journalEntries.find(entry => {
            const entryRef = entry.reference.trim().toUpperCase();
            return entryRef === reference ||
                entryRef.includes(reference) ||
                reference.includes(entryRef);
        }) || null;
    }

    /**
     * Ajoute une correspondance manuelle
     */
    static addManualMatch(
        session: ReconciliationSession,
        statementLineId: string,
        journalEntryId: string,
        userId: string
    ): ReconciliationMatch {
        const statementLine = session.statementLines.find(l => l.id === statementLineId);
        if (!statementLine) {
            throw new Error('Ligne de relevé non trouvée');
        }

        const match: ReconciliationMatch = {
            statementLineId,
            journalEntryId,
            amount: statementLine.debit || statementLine.credit,
            matchType: 'MANUAL',
            matchedAt: new Date().toISOString(),
            matchedBy: userId
        };

        session.matches.push(match);
        return match;
    }

    /**
     * Supprime une correspondance
     */
    static removeMatch(
        session: ReconciliationSession,
        statementLineId: string
    ): void {
        session.matches = session.matches.filter(m => m.statementLineId !== statementLineId);
    }

    /**
     * Récupère les lignes non rapprochées
     */
    static getUnmatchedLines(session: ReconciliationSession): {
        statementLines: BankStatementLine[];
        journalEntries: JournalEntry[];
    } {
        const matchedStatementLineIds = new Set(session.matches.map(m => m.statementLineId));
        const matchedJournalEntryIds = new Set(session.matches.map(m => m.journalEntryId));

        const unmatchedStatementLines = session.statementLines.filter(
            line => !matchedStatementLineIds.has(line.id)
        );

        const allJournalEntries = db.journalEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            const start = new Date(session.startDate);
            const end = new Date(session.endDate);

            const hasAccountMovement = entry.entries.some(e => e.accountCode === session.bankAccountCode);
            const isInPeriod = entryDate >= start && entryDate <= end;

            return hasAccountMovement && isInPeriod && !matchedJournalEntryIds.has(entry.id);
        });

        return {
            statementLines: unmatchedStatementLines,
            journalEntries: allJournalEntries
        };
    }

    /**
     * Calcule l'écart de rapprochement
     */
    static calculateReconciliationGap(session: ReconciliationSession): {
        matchedAmount: number;
        unmatchedStatementAmount: number;
        unmatchedAccountAmount: number;
        totalGap: number;
    } {
        const matchedAmount = session.matches.reduce((sum, match) => sum + match.amount, 0);

        const { statementLines, journalEntries } = this.getUnmatchedLines(session);

        const unmatchedStatementAmount = statementLines.reduce(
            (sum, line) => sum + line.debit - line.credit,
            0
        );

        const unmatchedAccountAmount = journalEntries.reduce((sum, entry) => {
            const bankEntry = entry.entries.find(e => e.accountCode === session.bankAccountCode);
            return sum + (bankEntry ? bankEntry.debit - bankEntry.credit : 0);
        }, 0);

        return {
            matchedAmount,
            unmatchedStatementAmount,
            unmatchedAccountAmount,
            totalGap: unmatchedStatementAmount - unmatchedAccountAmount
        };
    }

    /**
     * Finalise le rapprochement
     */
    static completeReconciliation(
        session: ReconciliationSession,
        userId: string
    ): ReconciliationSession {
        const gap = this.calculateReconciliationGap(session);

        if (Math.abs(gap.totalGap) > 0.01) {
            throw new Error(`Le rapprochement n'est pas équilibré. Écart: ${gap.totalGap} FCFA`);
        }

        session.status = 'COMPLETED';
        session.completedAt = new Date().toISOString();

        // Marquer les écritures comme rapprochées
        session.matches.forEach(match => {
            const entry = db.journalEntries.find(e => e.id === match.journalEntryId);
            if (entry && entry.metadata) {
                entry.metadata.reconciled = true;
                entry.metadata.reconciledAt = new Date().toISOString();
                entry.metadata.reconciledBy = userId;
            }
        });

        return session;
    }

    /**
     * Annule le rapprochement
     */
    static cancelReconciliation(
        session: ReconciliationSession
    ): ReconciliationSession {
        session.status = 'CANCELLED';

        // Démarquer les écritures
        session.matches.forEach(match => {
            const entry = db.journalEntries.find(e => e.id === match.journalEntryId);
            if (entry && entry.metadata) {
                entry.metadata.reconciled = false;
                delete entry.metadata.reconciledAt;
                delete entry.metadata.reconciledBy;
            }
        });

        return session;
    }

    /**
     * Exporte le rapprochement en CSV
     */
    static exportReconciliation(session: ReconciliationSession): string {
        const lines = [
            'Type;Date;Référence;Libellé;Débit;Crédit;Statut',
            ...session.statementLines.map(line => {
                const match = session.matches.find(m => m.statementLineId === line.id);
                const status = match ? 'Rapproché' : 'Non rapproché';
                return `Relevé;${line.date};${line.reference};${line.label};${line.debit};${line.credit};${status}`;
            })
        ];

        return lines.join('\n');
    }
}
