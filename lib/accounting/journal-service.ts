import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import type { JournalEntry, AccountEntry, Journal } from './types';
import { accountService } from './account-service';

export class JournalService {

    /**
     * Créer une nouvelle écriture comptable
     */
    createEntry(
        journalId: string,
        date: string,
        label: string,
        entries: Omit<AccountEntry, 'id' | 'journalEntryId'>[],
        reference?: string,
        dossierId?: string,
        userId: string = 'system',
        validated: boolean = false // Default to draft (brouillard)
    ): JournalEntry {
        // 1. Valider l'équilibre (Partie Double)
        const totalDebit = entries.reduce((sum, e) => sum + (e.debit || 0), 0);
        const totalCredit = entries.reduce((sum, e) => sum + (e.credit || 0), 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) { // Tolérance pour les arrondis
            throw new Error(`Écriture déséquilibrée : Débit ${totalDebit} != Crédit ${totalCredit}`);
        }

        if (totalDebit === 0 && totalCredit === 0) {
            throw new Error("L'écriture ne peut pas être vide");
        }

        // 2. Valider les comptes
        entries.forEach(entry => {
            const validation = accountService.validateAccount(entry.accountCode);
            if (!validation.valid) {
                throw new Error(`Compte invalide ${entry.accountCode}: ${validation.error}`);
            }
        });

        // 3. Créer l'objet JournalEntry
        const journalEntryId = uuidv4();
        const fullEntries: AccountEntry[] = entries.map(e => ({
            ...e,
            id: uuidv4(),
            journalEntryId,
            debit: e.debit || 0,
            credit: e.credit || 0
        }));

        const newEntry: JournalEntry = {
            id: journalEntryId,
            journalId,
            date,
            label,
            reference: reference || this.generateReference(journalId, date),
            entries: fullEntries,
            dossierId,
            validated,
            createdAt: new Date().toISOString(),
            createdBy: userId
        };

        // 4. Sauvegarder via db (qui gère la persistance JSON)
        db.addJournalEntry(newEntry);

        return newEntry;
    }

    /**
     * Générer une référence unique pour l'écriture
     * Format: JNL-ANNEE-MOIS-SEQ (ex: VT-2024-11-001)
     */
    private generateReference(journalId: string, date: string): string {
        const journal = this.getJournal(journalId);
        const code = journal ? journal.code : 'OD';
        const year = new Date(date).getFullYear();
        const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0');

        // Dans une vraie DB, on chercherait le dernier numéro de séquence
        // Ici on utilise un timestamp court pour simplifier sans collision majeure en démo
        const seq = Date.now().toString().slice(-4);

        return `${code}-${year}-${month}-${seq}`;
    }

    getJournal(id: string): Journal | undefined {
        return db.journals.find(j => j.id === id);
    }

    getAllJournals(): Journal[] {
        return db.journals;
    }

    getEntries(journalId?: string): JournalEntry[] {
        // Note: db.journalEntries contient toutes les écritures. 
        // Il faudrait filtrer par journal si on stockait l'ID du journal dans l'écriture.
        // Pour l'instant on retourne tout ou on filtre si on ajoute le champ journalId à JournalEntry
        return db.journalEntries;
    }
    validateEntry(entryId: string): JournalEntry {
        const entry = db.getJournalEntry(entryId);
        if (!entry) {
            throw new Error('Écriture non trouvée');
        }

        if (entry.validated) {
            throw new Error('Écriture déjà validée');
        }

        const updatedEntry = db.updateJournalEntry(entryId, { validated: true });
        if (!updatedEntry) {
            throw new Error('Erreur lors de la validation');
        }

        return updatedEntry;
    }
}

export const journalService = new JournalService();
