"use client";

import { FileText, Download } from "lucide-react";
import { generateCompromisPDF } from "@/lib/pdf-generator";

interface ActesPageClientProps {
    actes: any[];
    dossiers: any[];
}

export default function ActesPageClient({ actes, dossiers }: ActesPageClientProps) {
    const getDossierRef = (dossierId: string) => {
        const dossier = dossiers.find((d) => d.id === dossierId);
        return dossier ? dossier.ref : "Inconnu";
    };

    const handleRegenerate = (acte: any) => {
        if (acte.type === 'COMPROMIS' && acte.metadata.seller && acte.metadata.buyer && acte.metadata.property) {
            const dossier = dossiers.find((d) => d.id === acte.dossierId);
            if (dossier) {
                generateCompromisPDF(
                    { ref: getDossierRef(acte.dossierId), title: dossier.title },
                    acte.metadata.buyer,
                    acte.metadata.seller,
                    acte.metadata.property
                );
            }
        }
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'COMPROMIS': 'Compromis',
            'VENTE': 'Acte de Vente',
            'NOTORIETE': 'Notoriété',
            'DONATION': 'Donation',
            'AUTRE': 'Autre'
        };
        return labels[type] || type;
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'BROUILLON': 'Brouillon',
            'SIGNE': 'Signé',
            'ENREGISTRE': 'Enregistré'
        };
        return labels[status] || status;
    };

    return (
        <div className="rounded-md border bg-white">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Titre</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {actes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                    Aucun acte généré. Générez un acte depuis un dossier.
                                </td>
                            </tr>
                        ) : (
                            actes.map((acte) => (
                                <tr key={acte.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium flex items-center">
                                        <FileText className="mr-2 h-4 w-4 text-slate-500" />
                                        {acte.title}
                                    </td>
                                    <td className="p-4 align-middle">{getTypeLabel(acte.type)}</td>
                                    <td className="p-4 align-middle">{new Date(acte.createdAt).toLocaleDateString('fr-FR')}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${acte.status === 'SIGNE' ? 'bg-green-100 text-green-800' : acte.status === 'ENREGISTRE' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {getStatusLabel(acte.status)}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <button
                                            onClick={() => handleRegenerate(acte)}
                                            className="text-slate-900 hover:underline flex items-center justify-end ml-auto"
                                        >
                                            <Download className="mr-1 h-4 w-4" /> Télécharger
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
