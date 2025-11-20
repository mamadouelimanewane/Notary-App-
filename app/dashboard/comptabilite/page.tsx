import { db } from "@/lib/db";
import { Plus, BookOpen } from "lucide-react";
import Link from "next/link";
import ComptabilitePageClient from "./ComptabilitePageClient";

export default function ComptabilitePage() {
    const transactions = db.transactions;
    const dossiers = db.dossiers;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Comptabilité</h1>
                <div className="flex gap-2">
                    <Link
                        href="/dashboard/comptabilite/plan-comptable"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        <BookOpen className="mr-2 h-4 w-4" /> Plan Comptable
                    </Link>
                    <Link
                        href="/dashboard/comptabilite/new"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-slate-900 text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nouvelle Opération
                    </Link>
                </div>
            </div>

            <ComptabilitePageClient transactions={transactions} dossiers={dossiers} />
        </div>
    );
}
