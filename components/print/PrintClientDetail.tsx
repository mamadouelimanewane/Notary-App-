"use client";

import PrintHeader from "./PrintHeader";
import { formatPrintDate } from "@/lib/print-utils";

interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    type: 'PARTICULIER' | 'ENTREPRISE';
    companyName?: string;
    ninea?: string;
    legalForm?: string;
    registrationNumber?: string;
    contactPerson?: string;
    createdAt?: string;
}

interface Dossier {
    id: string;
    ref: string;
    title: string;
    type: string;
    status: string;
}

interface PrintClientDetailProps {
    client: Client;
    dossiers: Dossier[];
}

export default function PrintClientDetail({ client, dossiers }: PrintClientDetailProps) {
    return (
        <div className="print-container p-8">
            <PrintHeader
                title="Fiche Client"
                subtitle={client.type === 'ENTREPRISE' && client.companyName
                    ? client.companyName
                    : `${client.firstName} ${client.lastName}`}
            />

            {/* Informations générales */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-slate-300">
                    Informations Générales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Prénom</p>
                        <p className="text-sm">{client.firstName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Nom</p>
                        <p className="text-sm">{client.lastName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Email</p>
                        <p className="text-sm">{client.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Téléphone</p>
                        <p className="text-sm">{client.phone}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs text-slate-600 font-semibold">Adresse</p>
                        <p className="text-sm">{client.address}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Code Postal</p>
                        <p className="text-sm">{client.zipCode}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Ville</p>
                        <p className="text-sm">{client.city}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">Type</p>
                        <p className="text-sm font-medium">
                            {client.type === 'PARTICULIER' ? 'Particulier' : 'Entreprise'}
                        </p>
                    </div>
                    {client.createdAt && (
                        <div>
                            <p className="text-xs text-slate-600 font-semibold">Date de création</p>
                            <p className="text-sm">{formatPrintDate(client.createdAt)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Informations entreprise */}
            {client.type === 'ENTREPRISE' && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-slate-300">
                        Informations Entreprise
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {client.companyName && (
                            <div className="col-span-2">
                                <p className="text-xs text-slate-600 font-semibold">Nom de l'Entreprise</p>
                                <p className="text-sm font-medium">{client.companyName}</p>
                            </div>
                        )}
                        {client.ninea && (
                            <div>
                                <p className="text-xs text-slate-600 font-semibold">NINEA</p>
                                <p className="text-sm">{client.ninea}</p>
                            </div>
                        )}
                        {client.legalForm && (
                            <div>
                                <p className="text-xs text-slate-600 font-semibold">Forme Juridique</p>
                                <p className="text-sm">{client.legalForm}</p>
                            </div>
                        )}
                        {client.registrationNumber && (
                            <div>
                                <p className="text-xs text-slate-600 font-semibold">N° RCCM</p>
                                <p className="text-sm">{client.registrationNumber}</p>
                            </div>
                        )}
                        {client.contactPerson && (
                            <div>
                                <p className="text-xs text-slate-600 font-semibold">Personne de Contact</p>
                                <p className="text-sm">{client.contactPerson}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Dossiers liés */}
            <div>
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-slate-300">
                    Dossiers Liés ({dossiers.length})
                </h3>
                {dossiers.length > 0 ? (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-300">
                                <th className="text-left py-2 px-2 font-semibold text-xs">Référence</th>
                                <th className="text-left py-2 px-2 font-semibold text-xs">Titre</th>
                                <th className="text-left py-2 px-2 font-semibold text-xs">Type</th>
                                <th className="text-left py-2 px-2 font-semibold text-xs">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dossiers.map((dossier) => (
                                <tr key={dossier.id} className="border-b border-slate-200">
                                    <td className="py-2 px-2">{dossier.ref}</td>
                                    <td className="py-2 px-2">{dossier.title}</td>
                                    <td className="py-2 px-2">{dossier.type}</td>
                                    <td className="py-2 px-2">{dossier.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-sm text-slate-600 italic">Aucun dossier lié à ce client.</p>
                )}
            </div>
        </div>
    );
}
