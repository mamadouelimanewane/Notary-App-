import { db } from '../db';
import type { Invoice, Payment } from '../types';
import type { JournalEntry, AccountEntry } from './types';
import { ClientAccountService } from './client-account-service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service d'intégration entre la facturation et la comptabilité
 * Génère automatiquement les écritures comptables pour les factures et paiements
 */
export class BillingIntegrationService {
    /**
     * Génère les écritures comptables pour une facture
     * Selon le principe OHADA:
     * - Débit 411.XXXX (Client) pour le montant TTC
     * - Crédit 7061 (Honoraires) pour les émoluments HT
     * - Crédit 7062 (Débours refacturés) pour les débours
     * - Crédit 7063 (Droits refacturés) pour les droits
     * - Crédit 443 (TVA facturée) pour la TVA
     */
    static generateInvoiceEntries(invoice: Invoice): { entry: JournalEntry; entries: AccountEntry[] } {
        const journalId = uuidv4();
        const entries: AccountEntry[] = [];

        // Récupérer le compte client
        const client = db.clients.find(c => c.id === invoice.clientId);
        if (!client) throw new Error('Client not found');

        const clientAccount = ClientAccountService.getClientAccount(invoice.clientId);
        if (!clientAccount) {
            throw new Error('Client account not found. Please create client account first.');
        }

        // Débit 411.XXXX - Client (montant TTC)
        entries.push({
            id: uuidv4(),
            journalEntryId: journalId,
            accountCode: clientAccount.code,
            accountLabel: clientAccount.label,
            debit: invoice.totalTTC,
            credit: 0,
            label: `Facture ${invoice.number}`
        });

        // Crédit 7061 - Honoraires (émoluments HT)
        if (invoice.totalEmoluments > 0) {
            const emolumentsHT = invoice.lineItems
                .filter(item => item.type === 'EMOLUMENT')
                .reduce((sum, item) => sum + item.totalHT, 0);

            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '7061',
                accountLabel: 'Honoraires d\'actes',
                debit: 0,
                credit: emolumentsHT,
                label: `Facture ${invoice.number} - Émoluments`
            });
        }

        // Crédit 7062 - Débours refacturés
        if (invoice.totalDebours > 0) {
            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '7062',
                accountLabel: 'Débours refacturés',
                debit: 0,
                credit: invoice.totalDebours,
                label: `Facture ${invoice.number} - Débours`
            });
        }

        // Crédit 7063 - Droits refacturés
        if (invoice.totalDroits > 0) {
            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '7063',
                accountLabel: 'Droits refacturés',
                debit: 0,
                credit: invoice.totalDroits,
                label: `Facture ${invoice.number} - Droits`
            });
        }

        // Crédit 443 - TVA facturée
        if (invoice.totalTVA > 0) {
            entries.push({
                id: uuidv4(),
                journalEntryId: journalId,
                accountCode: '443',
                accountLabel: 'État - TVA facturée',
                debit: 0,
                credit: invoice.totalTVA,
                label: `Facture ${invoice.number} - TVA`
            });
        }

        const journalEntry: JournalEntry = {
            id: journalId,
            date: invoice.date,
            reference: invoice.number,
            label: `Facturation - ${client.companyName || `${client.firstName} ${client.lastName}`}`,
            journalId: 'VE', // Journal des ventes
            dossierId: invoice.dossierId,
            metadata: {
                invoiceId: invoice.id,
                type: 'INVOICE'
            },
            entries,
            validated: false,
            createdAt: new Date().toISOString(),
            createdBy: 'system'
        };

        return { entry: journalEntry, entries };
    }

    /**
     * Génère les écritures comptables pour un paiement
     * Selon le principe OHADA:
     * - Débit 521 (Banque) ou 57 (Caisse) pour le montant
     * - Crédit 411.XXXX (Client) pour le montant
     */
    static generatePaymentEntries(payment: Payment): { entry: JournalEntry; entries: AccountEntry[] } {
        const journalId = uuidv4();
        const entries: AccountEntry[] = [];

        // Récupérer la facture et le client
        const invoice = db.getInvoice(payment.invoiceId);
        if (!invoice) throw new Error('Invoice not found');

        const client = db.clients.find(c => c.id === invoice.clientId);
        if (!client) throw new Error('Client not found');

        const clientAccount = ClientAccountService.getClientAccount(invoice.clientId);
        if (!clientAccount) throw new Error('Client account not found');

        // Déterminer le compte de trésorerie
        let treasuryAccount: { code: string; label: string };
        switch (payment.method) {
            case 'CASH':
                treasuryAccount = { code: '57', label: 'Caisse' };
                break;
            case 'CHECK':
            case 'TRANSFER':
            case 'CARD':
                treasuryAccount = { code: '521', label: 'Banques locales' };
                break;
            default:
                treasuryAccount = { code: '521', label: 'Banques locales' };
        }

        // Débit Banque/Caisse
        entries.push({
            id: uuidv4(),
            journalEntryId: journalId,
            accountCode: treasuryAccount.code,
            accountLabel: treasuryAccount.label,
            debit: payment.amount,
            credit: 0,
            label: `Règlement ${invoice.number}${payment.reference ? ` - ${payment.reference}` : ''}`
        });

        // Crédit 411.XXXX - Client
        entries.push({
            id: uuidv4(),
            journalEntryId: journalId,
            accountCode: clientAccount.code,
            accountLabel: clientAccount.label,
            debit: 0,
            credit: payment.amount,
            label: `Règlement ${invoice.number}`
        });

        const journalEntry: JournalEntry = {
            id: journalId,
            date: payment.date,
            reference: `REG-${payment.id.slice(-8).toUpperCase()}`,
            label: `Règlement ${client.companyName || `${client.firstName} ${client.lastName}`}`,
            journalId: payment.method === 'CASH' ? 'CA' : 'BQ', // Journal de caisse ou banque
            dossierId: payment.dossierId,
            metadata: {
                paymentId: payment.id,
                invoiceId: payment.invoiceId,
                type: 'PAYMENT'
            },
            entries,
            validated: false,
            createdAt: new Date().toISOString(),
            createdBy: payment.createdBy
        };

        return { entry: journalEntry, entries };
    }

    /**
     * Enregistre une facture et génère automatiquement les écritures comptables
     */
    static async recordInvoiceWithAccounting(invoice: Invoice): Promise<{ invoice: Invoice; journalEntry: JournalEntry }> {
        // Ajouter la facture
        const savedInvoice = db.addInvoice(invoice);

        // Générer et enregistrer les écritures comptables
        const { entry, entries } = this.generateInvoiceEntries(savedInvoice);
        const savedEntry = db.addJournalEntry(entry);

        return { invoice: savedInvoice, journalEntry: savedEntry };
    }

    /**
     * Enregistre un paiement et génère automatiquement les écritures comptables
     */
    static async recordPaymentWithAccounting(payment: Payment): Promise<{ payment: Payment; journalEntry: JournalEntry }> {
        // Ajouter le paiement
        const savedPayment = db.addPayment(payment);

        // Mettre à jour le statut de la facture
        const invoice = db.getInvoice(payment.invoiceId);
        if (invoice) {
            const newPaidAmount = invoice.paidAmount + payment.amount;
            const newRemainingAmount = invoice.totalTTC - newPaidAmount;

            let newStatus: Invoice['status'] = invoice.status;
            if (newRemainingAmount <= 0) {
                newStatus = 'PAID';
            } else if (newPaidAmount > 0) {
                newStatus = 'PARTIALLY_PAID';
            }

            db.updateInvoice(invoice.id, {
                paidAmount: newPaidAmount,
                remainingAmount: newRemainingAmount,
                status: newStatus
            });
        }

        // Générer et enregistrer les écritures comptables
        const { entry, entries } = this.generatePaymentEntries(savedPayment);
        const savedEntry = db.addJournalEntry(entry);

        return { payment: savedPayment, journalEntry: savedEntry };
    }

    /**
     * Récupère toutes les écritures comptables liées à une facture
     */
    static getInvoiceEntries(invoiceId: string): JournalEntry[] {
        return db.journalEntries.filter(
            entry => entry.metadata?.invoiceId === invoiceId
        );
    }

    /**
     * Récupère toutes les écritures comptables liées à un paiement
     */
    static getPaymentEntries(paymentId: string): JournalEntry[] {
        return db.journalEntries.filter(
            entry => entry.metadata?.paymentId === paymentId
        );
    }

    /**
     * Récupère le compte de résultat d'un client
     */
    static getClientStatement(clientId: string): {
        invoices: Invoice[];
        payments: Payment[];
        balance: number;
    } {
        const invoices = db.getInvoicesByClient(clientId);
        const paymentIds = invoices.map(inv => inv.id);
        const payments = db.payments.filter(p => paymentIds.includes(p.invoiceId));

        const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalTTC, 0);
        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        const balance = totalInvoiced - totalPaid;

        return {
            invoices,
            payments,
            balance
        };
    }
}
