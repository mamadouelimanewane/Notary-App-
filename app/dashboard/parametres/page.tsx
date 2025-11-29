import Link from 'next/link';
import { Settings, Calculator, FileText, Percent, Palette } from 'lucide-react';

export default function ParametresPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-gray-500">Configuration générale de l'étude et des modules.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/parametres/taxes" className="block p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Percent className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="ml-3 text-lg font-semibold">Taxes & Impôts</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Configuration des taux de TVA, droits d'enregistrement et comptes associés.
                    </p>
                </Link>

                <Link href="/dashboard/parametres/actes" className="block p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-purple-100 rounded-full">
                            <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="ml-3 text-lg font-semibold">Modèles d'Actes</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Définition des règles de calcul des frais (Emoluments, Débours) par type d'acte.
                    </p>
                </Link>

                <Link href="/dashboard/parametres/theme" className="block p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-pink-100 rounded-full">
                            <Palette className="h-6 w-6 text-pink-600" />
                        </div>
                        <h3 className="ml-3 text-lg font-semibold">Apparence</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Personnalisez les couleurs et le thème de l'interface.
                    </p>
                </Link>

                <Link href="/dashboard/parametres/signature" className="block p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-orange-100 rounded-full">
                            <FileText className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="ml-3 text-lg font-semibold">Signature</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Gérez votre signature numérique pour les actes.
                    </p>
                </Link>

                <Link href="/dashboard/admin/settings" className="block p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <Settings className="h-6 w-6 text-gray-600" />
                        </div>
                        <h3 className="ml-3 text-lg font-semibold">Général</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Informations de l'étude, logo, et préférences globales.
                    </p>
                </Link>
            </div>
        </div>
    );
}
