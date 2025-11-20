import React from 'react';
import { db } from '@/lib/db';
import { accountService } from '@/lib/accounting/account-service';
import PlanComptableClient from './PlanComptableClient';
import { BookOpen } from 'lucide-react';

export default function PlanComptablePage() {
    // Récupérer les comptes depuis la DB ou le service par défaut
    let accounts = db.accounts;

    // Si la DB est vide (pas encore initialisée), utiliser le service pour charger depuis le JSON
    if (!accounts || accounts.length === 0) {
        accounts = accountService.getAllAccounts();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-custom-gold" />
                        Plan Comptable OHADA
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Référentiel comptable harmonisé (SYSCOHADA Révisé)
                    </p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                    {accounts.length} comptes actifs
                </div>
            </div>

            <PlanComptableClient initialAccounts={accounts} />
        </div>
    );
}
