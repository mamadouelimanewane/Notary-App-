import { db } from '../db';
import type { AccountEntry } from './types';

export interface BalanceLine {
    accountCode: string;
    accountLabel: string;
    debitOpening: number;
    creditOpening: number;
    debitMovement: number;
    creditMovement: number;
    debitClosing: number;
    creditClosing: number;
}

export interface LedgerLine {
    date: string;
    reference: string;
    label: string;
    debit: number;
    credit: number;
    balance: number;
}

export interface BilanLine {
    code: string;
    label: string;
    note: string;
    currentYear: number;
    previousYear: number;
}

export interface CompteResultatLine {
    code: string;
    label: string;
    note: string;
    currentYear: number;
    previousYear: number;
}

/**
 * Service de génération des états financiers OHADA
 */
export class FinancialStatementsService {
    /**
     * Génère le Grand Livre (Ledger) pour un compte
     */
    static generateLedger(params: {
        accountCode: string;
        startDate: string;
        endDate: string;
    }): {
        accountCode: string;
        accountLabel: string;
        startDate: string;
        endDate: string;
        openingBalance: number;
        lines: LedgerLine[];
        closingBalance: number;
    } {
        const account = db.accounts.find(a => a.code === params.accountCode);
        if (!account) {
            throw new Error(`Compte ${params.accountCode} non trouvé`);
        }

        const entries = db.getAccountEntries(params.accountCode);

        // Filtrer par période
        const periodEntries = entries.filter(entry => {
            const journalEntry = db.journalEntries.find(je => je.id === entry.journalEntryId);
            if (!journalEntry) return false;

            const entryDate = new Date(journalEntry.date);
            return entryDate >= new Date(params.startDate) && entryDate <= new Date(params.endDate);
        });

        // Calculer le solde d'ouverture (toutes les écritures avant startDate)
        const openingEntries = entries.filter(entry => {
            const journalEntry = db.journalEntries.find(je => je.id === entry.journalEntryId);
            if (!journalEntry) return false;
            return new Date(journalEntry.date) < new Date(params.startDate);
        });

        const openingBalance = openingEntries.reduce(
            (sum, entry) => sum + entry.debit - entry.credit,
            0
        );

        // Générer les lignes
        let balance = openingBalance;
        const lines: LedgerLine[] = periodEntries.map(entry => {
            const journalEntry = db.journalEntries.find(je => je.id === entry.journalEntryId);
            if (!journalEntry) {
                throw new Error('Journal entry not found');
            }

            balance += entry.debit - entry.credit;

            return {
                date: journalEntry.date,
                reference: journalEntry.reference,
                label: entry.label,
                debit: entry.debit,
                credit: entry.credit,
                balance
            };
        });

        return {
            accountCode: params.accountCode,
            accountLabel: account.label,
            startDate: params.startDate,
            endDate: params.endDate,
            openingBalance,
            lines,
            closingBalance: balance
        };
    }

    /**
     * Génère la Balance Générale
     */
    static generateBalance(params: {
        startDate: string;
        endDate: string;
    }): {
        startDate: string;
        endDate: string;
        lines: BalanceLine[];
        totals: {
            debitOpening: number;
            creditOpening: number;
            debitMovement: number;
            creditMovement: number;
            debitClosing: number;
            creditClosing: number;
        };
    } {
        const lines: BalanceLine[] = [];

        // Pour chaque compte ayant des mouvements
        const accountsWithMovements = new Set<string>();
        db.journalEntries.forEach(entry => {
            entry.entries.forEach(e => accountsWithMovements.add(e.accountCode));
        });

        for (const accountCode of accountsWithMovements) {
            const account = db.accounts.find(a => a.code === accountCode);
            if (!account) continue;

            const entries = db.getAccountEntries(accountCode);

            // Soldes d'ouverture
            const openingEntries = entries.filter(entry => {
                const journalEntry = db.journalEntries.find(je => je.id === entry.journalEntryId);
                if (!journalEntry) return false;
                return new Date(journalEntry.date) < new Date(params.startDate);
            });

            const openingBalance = openingEntries.reduce(
                (sum, entry) => sum + entry.debit - entry.credit,
                0
            );

            // Mouvements de la période
            const periodEntries = entries.filter(entry => {
                const journalEntry = db.journalEntries.find(je => je.id === entry.journalEntryId);
                if (!journalEntry) return false;
                const entryDate = new Date(journalEntry.date);
                return entryDate >= new Date(params.startDate) && entryDate <= new Date(params.endDate);
            });

            const debitMovement = periodEntries.reduce((sum, entry) => sum + entry.debit, 0);
            const creditMovement = periodEntries.reduce((sum, entry) => sum + entry.credit, 0);

            // Soldes de clôture
            const closingBalance = openingBalance + debitMovement - creditMovement;

            lines.push({
                accountCode,
                accountLabel: account.label,
                debitOpening: openingBalance > 0 ? openingBalance : 0,
                creditOpening: openingBalance < 0 ? -openingBalance : 0,
                debitMovement,
                creditMovement,
                debitClosing: closingBalance > 0 ? closingBalance : 0,
                creditClosing: closingBalance < 0 ? -closingBalance : 0
            });
        }

        // Trier par code de compte
        lines.sort((a, b) => a.accountCode.localeCompare(b.accountCode));

        // Calculer les totaux
        const totals = lines.reduce(
            (acc, line) => ({
                debitOpening: acc.debitOpening + line.debitOpening,
                creditOpening: acc.creditOpening + line.creditOpening,
                debitMovement: acc.debitMovement + line.debitMovement,
                creditMovement: acc.creditMovement + line.creditMovement,
                debitClosing: acc.debitClosing + line.debitClosing,
                creditClosing: acc.creditClosing + line.creditClosing
            }),
            {
                debitOpening: 0,
                creditOpening: 0,
                debitMovement: 0,
                creditMovement: 0,
                debitClosing: 0,
                creditClosing: 0
            }
        );

        return {
            startDate: params.startDate,
            endDate: params.endDate,
            lines,
            totals
        };
    }

    /**
     * Génère le Bilan OHADA (Actif et Passif)
     */
    static generateBilan(params: {
        endDate: string;
        previousYearEndDate?: string;
    }): {
        actif: BilanLine[];
        passif: BilanLine[];
        totalActif: number;
        totalPassif: number;
    } {
        const balance = this.generateBalance({
            startDate: '1900-01-01', // Depuis le début
            endDate: params.endDate
        });

        // ACTIF (Classes 1, 2, 3, 4, 5 - Soldes débiteurs)
        const actifLines: BilanLine[] = [];

        // Actif immobilisé (Classe 2)
        const immobilisations = balance.lines.filter(l => l.accountCode.startsWith('2'));
        if (immobilisations.length > 0) {
            actifLines.push({
                code: 'AD',
                label: 'ACTIF IMMOBILISÉ',
                note: '',
                currentYear: immobilisations.reduce((sum, l) => sum + l.debitClosing - l.creditClosing, 0),
                previousYear: 0 // TODO: Calculer année précédente
            });
        }

        // Actif circulant (Classe 3, 4, 5)
        const stocks = balance.lines.filter(l => l.accountCode.startsWith('3'));
        const creances = balance.lines.filter(l => l.accountCode.startsWith('4') && l.debitClosing > l.creditClosing);
        const tresorerie = balance.lines.filter(l => l.accountCode.startsWith('5'));

        if (stocks.length > 0 || creances.length > 0 || tresorerie.length > 0) {
            actifLines.push({
                code: 'AE',
                label: 'ACTIF CIRCULANT',
                note: '',
                currentYear:
                    stocks.reduce((sum, l) => sum + l.debitClosing - l.creditClosing, 0) +
                    creances.reduce((sum, l) => sum + l.debitClosing - l.creditClosing, 0) +
                    tresorerie.reduce((sum, l) => sum + l.debitClosing - l.creditClosing, 0),
                previousYear: 0
            });
        }

        // PASSIF (Classes 1, 4, 5 - Soldes créditeurs)
        const passifLines: BilanLine[] = [];

        // Capitaux propres (Classe 1)
        const capitaux = balance.lines.filter(l => l.accountCode.startsWith('1'));
        if (capitaux.length > 0) {
            passifLines.push({
                code: 'CP',
                label: 'CAPITAUX PROPRES',
                note: '',
                currentYear: capitaux.reduce((sum, l) => sum + l.creditClosing - l.debitClosing, 0),
                previousYear: 0
            });
        }

        // Dettes (Classe 4 - soldes créditeurs)
        const dettes = balance.lines.filter(l => l.accountCode.startsWith('4') && l.creditClosing > l.debitClosing);
        if (dettes.length > 0) {
            passifLines.push({
                code: 'DF',
                label: 'DETTES',
                note: '',
                currentYear: dettes.reduce((sum, l) => sum + l.creditClosing - l.debitClosing, 0),
                previousYear: 0
            });
        }

        const totalActif = actifLines.reduce((sum, l) => sum + l.currentYear, 0);
        const totalPassif = passifLines.reduce((sum, l) => sum + l.currentYear, 0);

        return {
            actif: actifLines,
            passif: passifLines,
            totalActif,
            totalPassif
        };
    }

    /**
     * Génère le Compte de Résultat OHADA
     */
    static generateCompteResultat(params: {
        startDate: string;
        endDate: string;
        previousYearStartDate?: string;
        previousYearEndDate?: string;
    }): {
        charges: CompteResultatLine[];
        produits: CompteResultatLine[];
        totalCharges: number;
        totalProduits: number;
        resultat: number;
    } {
        const balance = this.generateBalance({
            startDate: params.startDate,
            endDate: params.endDate
        });

        // CHARGES (Classe 6)
        const chargesLines: CompteResultatLine[] = [];
        const chargesAccounts = balance.lines.filter(l => l.accountCode.startsWith('6'));

        // Regrouper par catégorie
        const chargesExploitation = chargesAccounts.filter(l =>
            l.accountCode.startsWith('60') ||
            l.accountCode.startsWith('61') ||
            l.accountCode.startsWith('62') ||
            l.accountCode.startsWith('63') ||
            l.accountCode.startsWith('64') ||
            l.accountCode.startsWith('65')
        );

        if (chargesExploitation.length > 0) {
            chargesLines.push({
                code: 'TA',
                label: 'CHARGES D\'EXPLOITATION',
                note: '',
                currentYear: chargesExploitation.reduce((sum, l) => sum + l.debitMovement, 0),
                previousYear: 0
            });
        }

        // PRODUITS (Classe 7)
        const produitsLines: CompteResultatLine[] = [];
        const produitsAccounts = balance.lines.filter(l => l.accountCode.startsWith('7'));

        const produitsExploitation = produitsAccounts.filter(l =>
            l.accountCode.startsWith('70') ||
            l.accountCode.startsWith('71') ||
            l.accountCode.startsWith('72') ||
            l.accountCode.startsWith('73') ||
            l.accountCode.startsWith('74') ||
            l.accountCode.startsWith('75')
        );

        if (produitsExploitation.length > 0) {
            produitsLines.push({
                code: 'RA',
                label: 'PRODUITS D\'EXPLOITATION',
                note: '',
                currentYear: produitsExploitation.reduce((sum, l) => sum + l.creditMovement, 0),
                previousYear: 0
            });
        }

        const totalCharges = chargesLines.reduce((sum, l) => sum + l.currentYear, 0);
        const totalProduits = produitsLines.reduce((sum, l) => sum + l.currentYear, 0);
        const resultat = totalProduits - totalCharges;

        return {
            charges: chargesLines,
            produits: produitsLines,
            totalCharges,
            totalProduits,
            resultat
        };
    }

    /**
     * Génère le TAFIRE (Tableau des Flux de Trésorerie)
     */
    static generateTafire(params: {
        startDate: string;
        endDate: string;
    }): {
        fluxExploitation: number;
        fluxInvestissement: number;
        fluxFinancement: number;
        variationTresorerie: number;
        tresorerieDebut: number;
        tresorerieFin: number;
    } {
        const balance = this.generateBalance({
            startDate: params.startDate,
            endDate: params.endDate
        });

        // Flux de trésorerie liés à l'exploitation
        const produitsEncaisses = balance.lines
            .filter(l => l.accountCode.startsWith('7'))
            .reduce((sum, l) => sum + l.creditMovement, 0);

        const chargesDecaissees = balance.lines
            .filter(l => l.accountCode.startsWith('6'))
            .reduce((sum, l) => sum + l.debitMovement, 0);

        const fluxExploitation = produitsEncaisses - chargesDecaissees;

        // Flux de trésorerie liés aux investissements
        const acquisitionsImmo = balance.lines
            .filter(l => l.accountCode.startsWith('2'))
            .reduce((sum, l) => sum + l.debitMovement, 0);

        const fluxInvestissement = -acquisitionsImmo;

        // Flux de trésorerie liés au financement
        const apportsCapital = balance.lines
            .filter(l => l.accountCode.startsWith('10'))
            .reduce((sum, l) => sum + l.creditMovement, 0);

        const fluxFinancement = apportsCapital;

        // Variation de trésorerie
        const variationTresorerie = fluxExploitation + fluxInvestissement + fluxFinancement;

        // Trésorerie de début et fin
        const tresorerieAccounts = balance.lines.filter(l =>
            l.accountCode.startsWith('5')
        );

        const tresorerieDebut = tresorerieAccounts.reduce(
            (sum, l) => sum + l.debitOpening - l.creditOpening,
            0
        );

        const tresorerieFin = tresorerieAccounts.reduce(
            (sum, l) => sum + l.debitClosing - l.creditClosing,
            0
        );

        return {
            fluxExploitation,
            fluxInvestissement,
            fluxFinancement,
            variationTresorerie,
            tresorerieDebut,
            tresorerieFin
        };
    }
}
