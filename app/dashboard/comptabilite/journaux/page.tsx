import { db } from '@/lib/db';
import JournauxPageClient from './JournauxPageClient';

export default function JournauxPage() {
    // Load journals from DB
    const journals = db.journals;

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuration des Journaux</h1>
                <p className="text-gray-500">Créez et gérez vos journaux comptables auxiliaires.</p>
            </div>

            <JournauxPageClient initialJournals={journals} />
        </div>
    );
}
