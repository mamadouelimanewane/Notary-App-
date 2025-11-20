import type { Transaction } from '../db';
import type { AccountEntry, JournalEntry } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Règles d'imputation automatique pour les transactions
 */
export class AccountingRules {
    /**
     * Génère les écritures comptables pour une transaction
     */
    static generateJournalEntry(
        transaction: Transaction,
        dossierId?: string
    ): { entry: JournalEntry; entries: AccountEntry[] } {
        const journalId = uuidv4();
        const entries: AccountEntry[] = [];

        // Déterminer le type d'imputation selon le type de transaction
        if (transaction.type === 'CREDIT') {
            // Honoraire reçu
            entries.push(...this.generateHonoraireEntries(transaction, journalId));
        } else {
            // Dépense
            entries.push(...this.generateDepenseEntries(transaction, journalId));
        }

        const journalEntry: JournalEntry = {
            id: journalId,
            date: transaction.date,
            reference: `TR-${transaction.id.slice(-8)}`,
            label: transaction.description,
            transactionId: transaction.id,
            dossierId,
            entries,
            validated: false,
            createdAt: new Date().toISOString(),
            createdBy: 'system'
        };

        return { entry: journalEntry, entries };
    }

    /**
     * Écritures pour un honoraire (CREDIT)
     * Hypothèse : TVA 18% (UEMOA)
     */
    private static generateHonoraireEntries(
        transaction: Transaction,
        journalId: string
    ): AccountEntry[] {
        const amountTTC = transaction.amount;
        const tvaRate = 0.18;
        const amountHT = Math.round(amountTTC / (1 + tvaRate));
        const tvaAmount = amountTTC - amountHT;

        return [
            // Débit 411 - Clients (montant TTC)
            {
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '411',
                accountLabel: 'Clients',
                debit: amountTTC,
                credit: 0,
                label: transaction.description
            },
            // Crédit 706 - Prestations de services (montant HT)
            {
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '7061',
                accountLabel: 'Honoraires d\'actes',
                debit: 0,
                credit: amountHT,
                label: transaction.description
            },
            // Crédit 443 - TVA collectée
            {
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '443',
                accountLabel: 'État - TVA facturée',
                debit: 0,
                credit: tvaAmount,
                label: 'TVA 18%'
            }
        ];
    }

    /**
     * Écritures pour une dépense (DEBIT)
     */
    private static generateDepenseEntries(
        transaction: Transaction,
        journalId: string
    ): AccountEntry[] {
        const amountTTC = transaction.amount;
        const tvaRate = 0.18;
        const amountHT = Math.round(amountTTC / (1 + tvaRate));
        const tvaAmount = amountTTC - amountHT;

        // Déterminer le compte de charge selon la description
        const chargeAccount = this.detectChargeAccount(transaction.description);

        return [
            // Débit compte de charge (montant HT)
            {
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: chargeAccount.code,
                accountLabel: chargeAccount.label,
                debit: amountHT,
                credit: 0,
                label: transaction.description
            },
            // Débit 445 - TVA déductible
            {
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '445',
                accountLabel: 'État - TVA récupérable',
                debit: tvaAmount,
                credit: 0,
                label: 'TVA 18%'
            },
            // Crédit 401 - Fournisseurs (montant TTC)
            {
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '401',
                accountLabel: 'Fournisseurs',
                debit: 0,
                credit: amountTTC,
                label: transaction.description
            }
        ];
    }

    /**
     * Génère les écritures pour un paiement client (encaissement)
     */
    static generatePaymentEntry(
        transaction: Transaction,
        paymentMethod: 'BANQUE' | 'CAISSE'
    ): { entry: JournalEntry; entries: AccountEntry[] } {
        const journalId = uuidv4();
        const accountCode = paymentMethod === 'BANQUE' ? '521' : '57';
        const accountLabel = paymentMethod === 'BANQUE' ? 'Banques locales' : 'Caisse';

        const entries: AccountEntry[] = [
            // Débit Banque ou Caisse
            {
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode,
                accountLabel,
                debit: transaction.amount,
                credit: 0,
                label: transaction.description
            },
            // Crédit 411 - Clients
            {
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '411',
                accountLabel: 'Clients',
                debit: 0,
                credit: transaction.amount,
                label: transaction.description
            }
        ];

        const journalEntry: JournalEntry = {
            id: journalId,
            date: transaction.date,
            reference: `PAY-${transaction.id.slice(-8)}`,
            label: `Paiement - ${transaction.description}`,
            transactionId: transaction.id,
            entries,
            validated: false,
            createdAt: new Date().toISOString(),
            createdBy: 'system'
        };

        return { entry: journalEntry, entries };
    }

    /**
     * Détecte le compte de charge approprié selon la description
     */
    private static detectChargeAccount(description: string): { code: string; label: string } {
        const desc = description.toLowerCase();

        // Règles de détection par mots-clés
        if (desc.includes('fourniture') || desc.includes('papier') || desc.includes('stylo')) {
            return { code: '6051', label: 'Fournitures de bureau' };
        }
        if (desc.includes('loyer') || desc.includes('location')) {
            return { code: '622', label: 'Locations et charges locatives' };
        }
        if (desc.includes('assurance')) {
            return { code: '625', label: 'Primes d\'assurances' };
        }
        if (desc.includes('honoraire') || desc.includes('avocat') || desc.includes('expert')) {
            return { code: '6324', label: 'Honoraires des professions réglementées' };
        }
        if (desc.includes('banque') || desc.includes('frais bancaire')) {
            return { code: '631', label: 'Frais bancaires' };
        }
        if (desc.includes('salaire') || desc.includes('rémunération')) {
            return { code: '661', label: 'Appointements, salaires et commissions' };
        }
        if (desc.includes('transport') || desc.includes('carburant')) {
            return { code: '611', label: 'Transports sur achats' };
        }
        if (desc.includes('entretien') || desc.includes('réparation')) {
            return { code: '624', label: 'Entretien, réparations et maintenance' };
        }

        // Par défaut : Autres achats
        return { code: '605', label: 'Autres achats' };
    }

    /**
     * Valide qu'une écriture est équilibrée (débit = crédit)
     */
    static validateBalance(entries: AccountEntry[]): { balanced: boolean; difference: number } {
        const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
        const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);
        const difference = totalDebit - totalCredit;

        return {
            balanced: Math.abs(difference) < 0.01, // Tolérance pour arrondis
            difference
        };
    }
}
