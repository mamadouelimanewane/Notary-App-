import BalancePageClient from './BalancePageClient';

export default function BalancePage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Balance Générale</h1>
                <p className="text-gray-500">État synthétique des comptes (Ouverture, Mouvements, Clôture).</p>
            </div>

            <BalancePageClient />
        </div>
    );
}
