import { db } from '../db';
import type { Account } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service de gestion automatique des comptes clients (411.xxx)
 * Crée automatiquement un sous-compte pour chaque client
 */
export class ClientAccountService {
    /**
     * Crée un compte client (411.xxx) pour un nouveau client
     * Format: 411.XXXX où XXXX est un numéro séquentiel
     */
    static createClientAccount(clientId: string, clientName: string): Account {
        // Vérifier si le client a déjà un compte
        const existingAccount = this.getClientAccount(clientId);
        if (existingAccount) {
            return existingAccount;
        }

        // Générer le numéro de compte
        const accountNumber = this.generateClientAccountNumber();

        // Créer le compte
        const account: Account = {
            id: uuidv4(),
            code: accountNumber,
            label: `Client - ${clientName}`,
            type: 'TIERS',
            class: '4',
            parentCode: '411',
            isActive: true,
            metadata: {
                clientId,
                autoCreated: true,
                createdAt: new Date().toISOString()
            }
        };

        return db.addAccount(account);
    }

    /**
     * Récupère le compte d'un client
     */
    static getClientAccount(clientId: string): Account | undefined {
        return db.accounts.find(
            account => account.metadata?.clientId === clientId
        );
    }

    /**
     * Génère le prochain numéro de compte client (411.XXXX)
     */
    private static generateClientAccountNumber(): string {
        // Récupérer tous les comptes clients (411.xxx)
        const clientAccounts = db.accounts.filter(
            account => account.code.startsWith('411.') && account.code.length > 4
        );

        if (clientAccounts.length === 0) {
            return '411.0001';
        }

        // Trouver le numéro le plus élevé
        const maxNumber = clientAccounts.reduce((max, account) => {
            const parts = account.code.split('.');
            if (parts.length === 2) {
                const num = parseInt(parts[1], 10);
                return num > max ? num : max;
            }
            return max;
        }, 0);

        const nextNumber = maxNumber + 1;
        return `411.${nextNumber.toString().padStart(4, '0')}`;
    }

    /**
     * Met à jour le libellé du compte client
     */
    static updateClientAccountLabel(clientId: string, newName: string): Account | null {
        const account = this.getClientAccount(clientId);
        if (!account) return null;

        return db.updateAccount(account.id, {
            label: `Client - ${newName}`
        });
    }

    /**
     * Désactive le compte d'un client (ne le supprime pas pour préserver l'historique)
     */
    static deactivateClientAccount(clientId: string): Account | null {
        const account = this.getClientAccount(clientId);
        if (!account) return null;

        return db.updateAccount(account.id, {
            isActive: false
        });
    }

    /**
     * Récupère le solde du compte client
     */
    static getClientBalance(clientId: string): number {
        const account = this.getClientAccount(clientId);
        if (!account) return 0;

        // Récupérer toutes les écritures pour ce compte
        const entries = db.getAccountEntries(account.code);

        // Calculer le solde (débit - crédit pour un compte client)
        const balance = entries.reduce((sum, entry) => {
            return sum + entry.debit - entry.credit;
        }, 0);

        return balance;
    }

    /**
     * Récupère tous les comptes clients
     */
    static getAllClientAccounts(): Account[] {
        return db.accounts.filter(
            account => account.code.startsWith('411.') && account.metadata?.clientId
        );
    }
}
