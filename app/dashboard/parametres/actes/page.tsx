import ActTemplatesPageClient from './ActTemplatesPageClient';

export default function ActTemplatesPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Modèles d'Actes</h1>
                <p className="text-gray-500">Configurez les règles de calcul des frais pour chaque type d'acte (Vente, Prêt, etc.).</p>
            </div>

            <ActTemplatesPageClient />
        </div>
    );
}
