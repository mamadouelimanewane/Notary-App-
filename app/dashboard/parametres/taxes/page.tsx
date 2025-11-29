import TaxesPageClient from './TaxesPageClient';

export default function TaxesPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramétrage des Taxes</h1>
                <p className="text-gray-500">Définissez les taxes applicables aux actes et leurs comptes comptables associés.</p>
            </div>

            <TaxesPageClient />
        </div>
    );
}
