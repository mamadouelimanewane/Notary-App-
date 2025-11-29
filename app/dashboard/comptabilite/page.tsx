import { db } from "@/lib/db";
import { Plus, BookOpen, FileText, PieChart } from "lucide-react";
import Link from "next/link";
import AccountingDashboardClient from "./AccountingDashboardClient";

export default function ComptabilitePage() {

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight font-serif text-primary">Comptabilité</h1>
                <div className="flex gap-2">
                    <Link
                        href="/dashboard/comptabilite/plan-comptable"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        <BookOpen className="mr-2 h-4 w-4" /> Plan Comptable
                    </Link>
                    <Link
                        href="/dashboard/comptabilite/journaux"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        <BookOpen className="mr-2 h-4 w-4" /> Journaux
                    </Link>
                    <Link
                        href="/dashboard/comptabilite/saisie"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Saisie Écriture
                    </Link>
                    <Link
                        href="/dashboard/comptabilite/new"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nouvelle Opération
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/dashboard/comptabilite/etats/grand-livre" className="group block p-6 bg-card text-card-foreground rounded-xl border hover:shadow-md transition-all duration-200 hover:border-primary/50">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center"><BookOpen className="mr-2 h-5 w-5 text-muted-foreground group-hover:text-primary" /> Grand Livre</h3>
                    <p className="text-muted-foreground text-sm">Détail des écritures par compte.</p>
                </Link>

                <Link href="/dashboard/comptabilite/etats/balance" className="group block p-6 bg-card text-card-foreground rounded-xl border hover:shadow-md transition-all duration-200 hover:border-primary/50">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center"><FileText className="mr-2 h-5 w-5 text-muted-foreground group-hover:text-primary" /> Balance</h3>
                    <p className="text-muted-foreground text-sm">État synthétique des comptes.</p>
                </Link>

                <Link href="/dashboard/comptabilite/etats/bilan" className="group block p-6 bg-card text-card-foreground rounded-xl border hover:shadow-md transition-all duration-200 hover:border-primary/50">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center"><PieChart className="mr-2 h-5 w-5 text-muted-foreground group-hover:text-primary" /> Bilan</h3>
                    <p className="text-muted-foreground text-sm">Actif / Passif (Patrimoine).</p>
                </Link>

                <Link href="/dashboard/comptabilite/etats/resultat" className="group block p-6 bg-card text-card-foreground rounded-xl border hover:shadow-md transition-all duration-200 hover:border-primary/50">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center"><FileText className="mr-2 h-5 w-5 text-muted-foreground group-hover:text-primary" /> Résultat</h3>
                    <p className="text-muted-foreground text-sm">Charges / Produits (Rentabilité).</p>
                </Link>
            </div>

            <AccountingDashboardClient />
        </div>
    );
}
