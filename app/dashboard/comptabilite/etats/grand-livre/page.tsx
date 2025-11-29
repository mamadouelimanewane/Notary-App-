import GrandLivrePageClient from './GrandLivrePageClient';

export default function GrandLivrePage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Grand Livre Général</h1>
                <p className="text-gray-500">Détail des écritures par compte.</p>
            </div>

            <GrandLivrePageClient />
        </div>
    );
}
