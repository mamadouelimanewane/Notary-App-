import { db } from '@/lib/db';
import { accountService } from '@/lib/accounting/account-service';
import SaisieEcritureClient from './SaisieEcritureClient';
import { createDefaultJournals } from '@/lib/accounting/account-service';

export default function SaisieEcriturePage() {
    // Load data
    let accounts = db.accounts;
    if (accounts.length === 0) {
        accounts = accountService.getAllAccounts();
    }

    let journals = db.journals;
    if (journals.length === 0) {
        journals = createDefaultJournals();
        // Optionally save default journals to DB if not present
        // journals.forEach(j => db.addJournal(j));
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Saisie d'écriture</h1>
                <p className="text-muted-foreground mt-1">
                    Enregistrement manuel d'opérations comptables
                </p>
            </div>

            <SaisieEcritureClient journals={journals} accounts={accounts} />
        </div>
    );
}
