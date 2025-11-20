import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import Link from "next/link";
import ClientsPageClient from "./ClientsPageClient";

export default function ClientsPage() {
    const clients = db.clients.filter(c => !c.isDeleted);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                <Link
                    href="/dashboard/clients/new"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-slate-900 text-white"
                >
                    <Plus className="mr-2 h-4 w-4" /> Nouveau Client
                </Link>
            </div>

            <ClientsPageClient clients={clients} />
        </div>
    );
}
