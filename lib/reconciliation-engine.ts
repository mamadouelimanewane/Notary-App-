// Reconciliation engine - Match bank transactions with accounting transactions

import { Transaction, BankTransaction } from './db';

export interface MatchSuggestion {
    bankTransaction: BankTransaction;
    accountingTransaction: Transaction;
    confidence: number; // 0-100
    reasons: string[];
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 */
function similarityScore(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    const len1 = s1.length;
    const len2 = s2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 100 : ((maxLen - distance) / maxLen) * 100;
}

/**
 * Check if two dates are within a certain number of days
 */
function datesAreClose(date1: string, date2: string, daysTolerance: number = 3): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= daysTolerance;
}

/**
 * Find matching suggestions for a bank transaction
 */
export function findMatchSuggestions(
    bankTx: BankTransaction,
    accountingTransactions: Transaction[]
): MatchSuggestion[] {
    const suggestions: MatchSuggestion[] = [];

    for (const acctTx of accountingTransactions) {
        // Skip already reconciled transactions
        if (acctTx.reconciled) continue;

        const reasons: string[] = [];
        let confidence = 0;

        // Check amount (exact match = high confidence)
        if (Math.abs(acctTx.amount - bankTx.amount) < 0.01) {
            confidence += 50;
            reasons.push('Montant exact');
        } else if (Math.abs(acctTx.amount - bankTx.amount) < acctTx.amount * 0.05) {
            // Within 5%
            confidence += 20;
            reasons.push('Montant proche');
        }

        // Check type (debit/credit must match)
        if (acctTx.type === bankTx.type) {
            confidence += 20;
            reasons.push('Même type');
        } else {
            continue; // Skip if types don't match
        }

        // Check date proximity
        if (datesAreClose(acctTx.date, bankTx.date, 1)) {
            confidence += 20;
            reasons.push('Date identique ou très proche');
        } else if (datesAreClose(acctTx.date, bankTx.date, 3)) {
            confidence += 10;
            reasons.push('Date proche (±3 jours)');
        }

        // Check description similarity
        const descSimilarity = similarityScore(acctTx.description, bankTx.description);
        if (descSimilarity > 70) {
            confidence += 15;
            reasons.push('Description très similaire');
        } else if (descSimilarity > 40) {
            confidence += 5;
            reasons.push('Description partiellement similaire');
        }

        // Only suggest if confidence is reasonable
        if (confidence >= 40) {
            suggestions.push({
                bankTransaction: bankTx,
                accountingTransaction: acctTx,
                confidence,
                reasons
            });
        }
    }

    // Sort by confidence (highest first)
    return suggestions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Auto-match transactions with high confidence
 */
export function autoMatch(
    bankTransactions: BankTransaction[],
    accountingTransactions: Transaction[],
    confidenceThreshold: number = 90
): Array<{ bankTx: BankTransaction; acctTx: Transaction }> {
    const matches: Array<{ bankTx: BankTransaction; acctTx: Transaction }> = [];
    const usedAcctTxIds = new Set<string>();

    for (const bankTx of bankTransactions) {
        if (bankTx.reconciled) continue;

        const suggestions = findMatchSuggestions(bankTx, accountingTransactions);

        // Only auto-match if confidence is very high and accounting transaction not already used
        if (suggestions.length > 0 && suggestions[0].confidence >= confidenceThreshold) {
            const topMatch = suggestions[0];
            if (!usedAcctTxIds.has(topMatch.accountingTransaction.id)) {
                matches.push({
                    bankTx: bankTx,
                    acctTx: topMatch.accountingTransaction
                });
                usedAcctTxIds.add(topMatch.accountingTransaction.id);
            }
        }
    }

    return matches;
}
