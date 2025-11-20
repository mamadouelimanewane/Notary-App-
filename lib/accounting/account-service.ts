import fs from 'fs';
import path from 'path';
import type { Account, Journal, JournalType } from './types';

const ACCOUNTS_PATH = path.join(process.cwd(), 'data', 'ohada-accounts.json');

/**
 * Service de gestion du plan comptable OHADA
 */
export class AccountService {
    private accounts: Account[] = [];
    private accountsMap: Map<string, Account> = new Map();

    constructor() {
        this.loadAccounts();
    }

    /**
     * Charge le plan comptable depuis le fichier JSON
     */
    private loadAccounts() {
        try {
            const fileContent = fs.readFileSync(ACCOUNTS_PATH, 'utf-8');
            const data = JSON.parse(fileContent);

            this.accounts = data.accounts.map((acc: any) => ({
                code: acc.code,
                label: acc.label,
                classCode: acc.classCode,
                type: acc.type,
                nature: acc.nature,
                description: acc.description,
                parent: acc.parent,
                isActive: acc.isActive !== false,
                isSummary: acc.isSummary || false
            }));

            // Créer une map pour accès rapide
            this.accounts.forEach(account => {
                this.accountsMap.set(account.code, account);
            });

            console.log(`✅ ${this.accounts.length} comptes OHADA chargés`);
        } catch (error) {
            console.error('❌ Erreur lors du chargement du plan comptable:', error);
            this.accounts = [];
        }
    }

    /**
     * Récupère tous les comptes
     */
    getAllAccounts(): Account[] {
        return this.accounts;
    }

    /**
     * Récupère un compte par son code
     */
    getAccount(code: string): Account | undefined {
        return this.accountsMap.get(code);
    }

    /**
     * Recherche de comptes par code ou libellé
     */
    searchAccounts(query: string): Account[] {
        const lowerQuery = query.toLowerCase();
        return this.accounts.filter(account =>
            account.code.includes(query) ||
            account.label.toLowerCase().includes(lowerQuery) ||
            account.description?.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Récupère comptes par classe
     */
    getAccountsByClass(classCode: string): Account[] {
        return this.accounts.filter(account => account.classCode === classCode);
    }

    /**
     * Récupère comptes par type
     */
    getAccountsByType(type: 'ACTIF' | 'PASSIF' | 'CHARGE' | 'PRODUIT' | 'RESULTAT'): Account[] {
        return this.accounts.filter(account => account.type === type);
    }

    /**
     * Récupère uniquement les comptes imputables (non collectifs)
     */
    getImputableAccounts(): Account[] {
        return this.accounts.filter(account => !account.isSummary);
    }

    /**
     * Récupère les comptes de niveau N (profondeur)
     */
    getAccountsByLevel(level: number): Account[] {
        return this.accounts.filter(account => account.code.length === level);
    }

    /**
     * Valide qu'un compte existe et est imputable
     */
    validateAccount(code: string): { valid: boolean; error?: string } {
        const account = this.getAccount(code);

        if (!account) {
            return { valid: false, error: `Compte ${code} n'existe pas` };
        }

        if (!account.isActive) {
            return { valid: false, error: `Compte ${code} est inactif` };
        }

        if (account.isSummary) {
            return { valid: false, error: `Compte ${code} est un compte collectif (non imputable)` };
        }

        return { valid: true };
    }

    /**
     * Obtient le compte parent
     */
    getParentAccount(code: string): Account | undefined {
        const account = this.getAccount(code);
        if (!account || !account.parent) {
            return undefined;
        }
        return this.getAccount(account.parent);
    }

    /**
     * Obtient tous les comptes enfants
     */
    getChildAccounts(code: string): Account[] {
        return this.accounts.filter(account => account.parent === code);
    }
}

/**
 * Créer les journaux par défaut
 */
export function createDefaultJournals(): Journal[] {
    return [
        {
            id: 'journal-ventes',
            code: 'VT',
            label: 'Journal des ventes',
            type: 'VENTES',
            isActive: true
        },
        {
            id: 'journal-achats',
            code: 'AC',
            label: 'Journal des achats',
            type: 'ACHATS',
            isActive: true
        },
        {
            id: 'journal-banque',
            code: 'BQ',
            label: 'Journal de banque',
            type: 'BANQUE',
            isActive: true
        },
        {
            id: 'journal-caisse',
            code: 'CA',
            label: 'Journal de caisse',
            type: 'CAISSE',
            isActive: true
        },
        {
            id: 'journal-od',
            code: 'OD',
            label: 'Opérations diverses',
            type: 'OPERATIONS',
            isActive: true
        },
        {
            id: 'journal-nouveau',
            code: 'AN',
            label: 'À-nouveaux',
            type: 'NOUVEAU',
            isActive: true
        }
    ];
}

// Instance singleton
export const accountService = new AccountService();
