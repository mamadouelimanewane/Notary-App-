import { db } from "@/lib/db";
import Link from "next/link";
import { Upload, CheckCircle, XCircle } from "lucide-react";

export default function RapprochementPage() {
    const bankStatements = db.bankStatements || [];
    const bankTransactions = db.bankTransactions || [];
    const accountingTransactions = db.transactions;

    const unreconciledBank = bankTransactions.filter(t => !t.reconciled).length;
    const unreconciledAccounting = accountingTransactions.filter(t => !t.reconciled).length;
    const totalReconciled = bankTransactions.filter(t => t.reconciled).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rapprochement Bancaire</h1>
                    <p className="text-muted-foreground mt-1">Rapprochez vos relevés bancaires avec votre comptabilité</p>
                </div>
                <Link href="/dashboard/rapprochement/upload" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 py-2">
                    <Upload className="mr-2 h-4 w-4" /> Importer un relevé
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Transactions bancaires non rapprochées</p>
                        <XCircle className="h-5 w-5 text-orange-500" />
                    </div>
                    <p className="text-3xl font-bold mt-2">{unreconciledBank}</p>
                </div>
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Opérations comptables non rapprochées</p>
                        <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold mt-2">{unreconciledAccounting}</p>
                </div>
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Transactions rapprochées</p>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold mt-2">{totalReconciled}</p>
                </div>
            </div>

            <div className="rounded-xl border bg-white p-6">
                <h2 className="font-semibold text-lg mb-4">Relevés bancaires</h2>
                {bankStatements.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Upload className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-4">Aucun relevé importé</p>
                        <Link href="/dashboard/rapprochement/upload" className="mt-2 inline-flex text items-center text-sm text-blue-600 hover:underline">
                            Importer votre premier relevé →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bankStatements.map(statement => (
                            <Link href={`/dashboard/rapprochement/${statement.id}`} key={statement.id} className="block">
                                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                    <div>
                                        <p className="font-medium">{statement.fileName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {statement.totalTransactions} transactions • {statement.reconciledCount} rapprochées
                                        </p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(statement.uploadedAt).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
