import SimulationPageClient from './SimulationPageClient';

export default function SimulationPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Simulateur de Frais</h1>
                <p className="text-gray-500">Estimez le coût total d'un acte (Emoluments, Taxes, Débours).</p>
            </div>

            <SimulationPageClient />
        </div>
    );
}
