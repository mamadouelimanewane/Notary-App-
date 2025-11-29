import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ReconciliationClient } from "./ReconciliationClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: {
        id: string;
    };
}

export default function ReconciliationPage({ params }: PageProps) {
    const statement = db.bankStatements.find(s => s.id === params.id);

    if (!statement) {
        notFound();
    }

    const bankTransactions = db.bankTransactions.filter(t => t.statementId === statement.id);

    // Get all accounting transactions (or filter by date range if needed later)
    // Ideally we should filter by date range close to the statement dates, but for now let's take all unreconciled
    // or all transactions to let the user search.
    // However, passing ALL transactions might be heavy if there are thousands.
    // Let's pass all for now as this is a prototype/MVP.
    const accountingTransactions = db.transactions;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/rapprochement" className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rapprochement</h1>
                    <p className="text-muted-foreground">
                        Relevé du {new Date(statement.uploadedAt).toLocaleDateString('fr-FR')}
                    </p>
                </div>
            </div>

            <ReconciliationClient
                statement={statement}
                bankTransactions={bankTransactions}
                accountingTransactions={accountingTransactions}
            />
        </div>
    );
}
