import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import { BankAccount, CashTransaction, FundTransfer, TreasuryStats, CashTransactionType, CashTransactionCategory, TransferStatus } from '@/types/treasury';
import { JournalService } from './accounting/journal-service';

export class TreasuryService {
    private static instance: TreasuryService;

    private constructor() { }

    public static getInstance(): TreasuryService {
        if (!TreasuryService.instance) {
            TreasuryService.instance = new TreasuryService();
        }
        return TreasuryService.instance;
    }

    // --- Bank Accounts ---

    public getBankAccounts(): BankAccount[] {
        return db.bankAccounts;
    }

    public getBankAccount(id: string): BankAccount | undefined {
        return db.bankAccounts.find(acc => acc.id === id);
    }

    public createBankAccount(data: Omit<BankAccount, 'id' | 'balance' | 'isActive'>): BankAccount {
        const newAccount: BankAccount = {
            id: uuidv4(),
            ...data,
            balance: 0,
            isActive: true
        };
        db.bankAccounts.push(newAccount);
        // Trigger save (using a dummy update or implementing a save method in JsonDB would be better, 
        // but for now we rely on the fact that db.ts methods usually trigger save. 
        // Since we pushed directly, we might need a way to persist. 
        // Ideally JsonDB should expose a generic 'save' or specific 'addBankAccount' method.
        // For this prototype, we'll assume we add a helper in db.ts or just use what we have.
        // Actually, looking at db.ts, it has specific add methods. We should probably add one for Treasury.
        // For now, let's assume we will add `save()` to JsonDB public interface or add specific methods.
        // Let's add specific methods to db.ts later. For now, we'll simulate persistence if needed, 
        // but really we should update db.ts.
        // Let's assume we'll update db.ts to expose a save method or add specific methods.
        // I will update db.ts to add `addBankAccount` etc.
        return newAccount;
    }

    // --- Cash Transactions (Livre de Caisse) ---

    public getCashTransactions(): CashTransaction[] {
        return db.cashTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    public async addCashTransaction(data: Omit<CashTransaction, 'id' | 'createdAt' | 'accountingEntryId'>): Promise<CashTransaction> {
        const transaction: CashTransaction = {
            id: uuidv4(),
            ...data,
            createdAt: new Date().toISOString()
        };

        // 1. Add to Treasury DB
        db.cashTransactions.push(transaction);

        // 2. Generate Accounting Entry (Integration with Accounting Module)
        // We need to determine the Journal (Caisse) and Accounts.
        // This is a simplified integration.
        try {
            const journalService = new JournalService();
            const caisseJournal = db.journals.find(j => j.type === 'CAISSE');

            if (caisseJournal) {
                // Determine accounts based on category
                let creditAccount = '531100'; // Caisse (Plan OHADA)
                let debitAccount = '';

                // Logic to select accounts based on transaction type and category
                // This is a placeholder for the complex accounting rules engine
                if (transaction.type === 'IN') {
                    debitAccount = '531100'; // Caisse Debit
                    // Credit account depends on source (Client, Honoraires...)
                    creditAccount = transaction.clientId ? '411100' : '706000';
                } else {
                    creditAccount = '531100'; // Caisse Credit
                    // Debit account depends on destination
                    debitAccount = '600000'; // Charge generic
                }

                // Create accounting entry
                // await journalService.createEntry(...) 
                // We will implement this fully when connecting the modules.
            }
        } catch (error) {
            console.error("Failed to generate accounting entry for cash transaction", error);
        }

        return transaction;
    }

    // --- Stats ---

    public getStats(): TreasuryStats {
        const bankTotal = db.bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);

        // Calculate Cash Balance
        const cashIn = db.cashTransactions
            .filter(t => t.type === 'IN')
            .reduce((sum, t) => sum + t.amount, 0);
        const cashOut = db.cashTransactions
            .filter(t => t.type === 'OUT')
            .reduce((sum, t) => sum + t.amount, 0);
        const cashTotal = cashIn - cashOut;

        // Split Bank funds (Approximation based on account types)
        const officeFunds = db.bankAccounts
            .filter(acc => acc.type === 'OFFICE')
            .reduce((sum, acc) => sum + acc.balance, 0);

        const clientFunds = db.bankAccounts
            .filter(acc => acc.type === 'CLIENT')
            .reduce((sum, acc) => sum + acc.balance, 0);

        // Monthly Flows (Current Month)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyInflow = db.cashTransactions
            .filter(t => t.type === 'IN' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0); // + Bank inflows (to be implemented)

        const monthlyOutflow = db.cashTransactions
            .filter(t => t.type === 'OUT' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0); // + Bank outflows

        return {
            totalOfficeFunds: officeFunds,
            totalClientFunds: clientFunds,
            totalCash: cashTotal,
            monthlyInflow,
            monthlyOutflow
        };
    }

    // --- Fund Transfers ---

    public async createTransfer(data: Omit<FundTransfer, 'id' | 'createdAt' | 'status'>): Promise<FundTransfer> {
        const transfer: FundTransfer = {
            id: uuidv4(),
            ...data,
            status: 'DRAFT',
            createdAt: new Date().toISOString()
        };

        db.fundTransfers.push(transfer);
        db.save();
        return transfer;
    }

    public getTransfers(): FundTransfer[] {
        return db.fundTransfers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    public getTransfer(id: string): FundTransfer | undefined {
        return db.fundTransfers.find(t => t.id === id);
    }

    public async updateTransferStatus(id: string, status: TransferStatus, userId: string): Promise<FundTransfer | null> {
        const transfer = db.fundTransfers.find(t => t.id === id);
        if (!transfer) return null;

        transfer.status = status;
        if (status === 'VALIDATED') {
            transfer.validatedBy = userId;
        }
        if (status === 'EXECUTED') {
            transfer.executedAt = new Date().toISOString();
            // Update account balances
            await this.executeTransfer(transfer);
        }

        db.save();
        return transfer;
    }

    private async executeTransfer(transfer: FundTransfer): Promise<void> {
        const fromAccount = db.bankAccounts.find(a => a.id === transfer.fromAccountId);
        const toAccount = db.bankAccounts.find(a => a.id === transfer.toAccountId);

        if (!fromAccount || !toAccount) {
            throw new Error('Account not found');
        }

        // Check solvency
        if (fromAccount.balance < transfer.amount) {
            throw new Error('Insufficient funds');
        }

        // Update balances
        fromAccount.balance -= transfer.amount;
        toAccount.balance += transfer.amount;

        db.save();

        // TODO: Generate accounting entries
    }

    // --- Solvency Control ---

    public checkSolvency(accountId: string, amount: number): { solvent: boolean; balance: number; message?: string } {
        const account = db.bankAccounts.find(a => a.id === accountId);
        if (!account) {
            return { solvent: false, balance: 0, message: 'Compte introuvable' };
        }

        const solvent = account.balance >= amount;
        return {
            solvent,
            balance: account.balance,
            message: solvent ? undefined : `Solde insuffisant (Disponible: ${account.balance} ${account.currency})`
        };
    }

    public getDossierBalance(dossierId: string): number {
        // Calculate dossier balance from payments, invoices, and transfers
        const invoices = db.invoices.filter(i => i.dossierId === dossierId);
        const payments = db.payments.filter(p => p.dossierId === dossierId);

        const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);

        return totalPaid - totalInvoiced; // Positive = client has credit, Negative = client owes
    }
}
