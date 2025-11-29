import ResultatPageClient from './ResultatPageClient';

export default function ResultatPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Compte de Résultat</h1>
                <p className="text-gray-500">Analyse de la rentabilité (Charges / Produits).</p>
            </div>

            <ResultatPageClient />
        </div>
    );
}
