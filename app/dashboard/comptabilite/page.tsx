import { db } from "@/lib/db";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";

export default function ComptabilitePage() {
    const transactions = db.transactions;
    const dossiers = db.dossiers;

    const getDossierRef = (dossierId: string) => {
        const dossier = dossiers.find((d) => d.id === dossierId);
        return dossier ? dossier.ref : "Inconnu";
    };

    const totalCredit = transactions
        .filter((t) => t.type === "CREDIT")
        .reduce((acc, t) => acc + t.amount, 0);

    const totalDebit = transactions
        .filter((t) => t.type === "DEBIT")
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalCredit - totalDebit;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Comptabilité</h1>
                <Link href="/dashboard/comptabilite/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-slate-900 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle Opération
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Solde Global</h3>
                    </div>
                    <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Crédit</h3>
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                        {totalCredit.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Débit</h3>
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                        {totalDebit.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </div>
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dossier</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Montant</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {transactions.map((t) => (
                                <tr key={t.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle">{new Date(t.date).toLocaleDateString('fr-FR')}</td>
                                    <td className="p-4 align-middle">{t.description}</td>
                                    <td className="p-4 align-middle font-medium">{getDossierRef(t.dossierId)}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${t.type === 'CREDIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className={`p-4 align-middle text-right font-bold ${t.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {t.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                        Aucune opération enregistrée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
