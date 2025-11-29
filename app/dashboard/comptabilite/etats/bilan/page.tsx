import BilanPageClient from './BilanPageClient';

export default function BilanPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Bilan OHADA</h1>
                <p className="text-gray-500">État du patrimoine (Actif / Passif).</p>
            </div>

            <BilanPageClient />
        </div>
    );
}
