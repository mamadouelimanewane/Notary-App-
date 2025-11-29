import { db } from '../db';
import type { Acte } from '../db';
import { Invoice, InvoiceLineItem, Payment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class BillingService {
    /**
     * Generate an invoice from an acte
     * This creates line items for Emoluments, Debours, and Droits
     */
    static generateInvoiceFromActe(acte: Acte): Invoice {
        const dossier = db.dossiers.find(d => d.id === acte.dossierId);
        if (!dossier) throw new Error('Dossier not found');

        const client = db.clients.find(c => c.id === dossier.clientId);
        if (!client) throw new Error('Client not found');

        const lineItems: InvoiceLineItem[] = [];
        let totalEmoluments = 0;
        let totalDebours = 0;
        let totalDroits = 0;
        let totalTVA = 0;

        // TODO: Calculate emoluments based on acte type and value
        // For now, using placeholder values
        const emolumentItem: InvoiceLineItem = {
            id: uuidv4(),
            type: 'EMOLUMENT',
            description: `Émoluments - ${acte.title}`,
            quantity: 1,
            unitPrice: 50000, // FCFA
            totalHT: 50000,
            tvaRate: 18,
            totalTTC: 59000
        };
        lineItems.push(emolumentItem);
        totalEmoluments = emolumentItem.totalTTC;
        totalTVA += emolumentItem.totalTTC - emolumentItem.totalHT;

        // Debours (disbursements)
        const deboursItem: InvoiceLineItem = {
            id: uuidv4(),
            type: 'DEBOURS',
            description: 'Débours (frais administratifs)',
            quantity: 1,
            unitPrice: 10000,
            totalHT: 10000,
            tvaRate: 0,
            totalTTC: 10000
        };
        lineItems.push(deboursItem);
        totalDebours = deboursItem.totalTTC;

        // Droits d'enregistrement
        const droitsItem: InvoiceLineItem = {
            id: uuidv4(),
            type: 'DROIT',
            description: `Droits d'enregistrement`,
            quantity: 1,
            unitPrice: 30000,
            totalHT: 30000,
            tvaRate: 0,
            totalTTC: 30000
        };
        lineItems.push(droitsItem);
        totalDroits = droitsItem.totalTTC;

        const totalHT = lineItems.reduce((sum, item) => sum + item.totalHT, 0);
        const totalTTC = lineItems.reduce((sum, item) => sum + item.totalTTC, 0);

        const invoice: Invoice = {
            id: uuidv4(),
            number: this.generateInvoiceNumber(),
            acteId: acte.id,
            dossierId: acte.dossierId,
            clientId: dossier.clientId,
            date: new Date().toISOString(),
            dueDate: this.calculateDueDate(30), // 30 days
            status: 'DRAFT',
            lineItems,
            totalEmoluments,
            totalDebours,
            totalDroits,
            totalTVA,
            totalHT,
            totalTTC,
            paidAmount: 0,
            remainingAmount: totalTTC,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return db.addInvoice(invoice);
    }

    /**
     * Generate invoice number (FAC-YYYY-NNNN)
     */
    private static generateInvoiceNumber(): string {
        const year = new Date().getFullYear();
        const invoices = db.invoices.filter(inv => inv.number.startsWith(`FAC-${year}`));
        const nextNumber = invoices.length + 1;
        return `FAC-${year}-${nextNumber.toString().padStart(4, '0')}`;
    }

    /**
     * Calculate due date
     */
    private static calculateDueDate(days: number): string {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    }

    /**
     * Record a payment
     */
    static recordPayment(
        invoiceId: string,
        amount: number,
        method: Payment['method'],
        reference?: string,
        notes?: string,
        userId?: string
    ): Payment {
        const invoice = db.getInvoice(invoiceId);
        if (!invoice) throw new Error('Invoice not found');

        if (amount > invoice.remainingAmount) {
            throw new Error('Payment amount exceeds remaining balance');
        }

        const payment: Payment = {
            id: uuidv4(),
            invoiceId,
            dossierId: invoice.dossierId,
            amount,
            method,
            reference,
            date: new Date().toISOString(),
            notes,
            createdBy: userId || 'system',
            createdAt: new Date().toISOString()
        };

        return db.addPayment(payment);
    }

    /**
     * Get invoice with payments
     */
    static getInvoiceWithPayments(invoiceId: string) {
        const invoice = db.getInvoice(invoiceId);
        if (!invoice) return null;

        const payments = db.getPaymentsByInvoice(invoiceId);
        return {
            ...invoice,
            payments
        };
    }

    /**
     * Get all invoices for a dossier
     */
    static getDossierInvoices(dossierId: string) {
        return db.getInvoicesByDossier(dossierId);
    }

    /**
     * Get all invoices for a client
     */
    static getClientInvoices(clientId: string) {
        return db.getInvoicesByClient(clientId);
    }

    /**
     * Update invoice status
     */
    static updateInvoiceStatus(invoiceId: string, status: Invoice['status']) {
        return db.updateInvoice(invoiceId, { status });
    }
}
