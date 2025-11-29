import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ActesPageClient from "./ActesPageClient";

export default function ActesPage() {
    const actes = db.actes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const dossiers = db.dossiers;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Actes & Documents</h1>
                <Link href="/dashboard/actes/new">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvel Acte
                    </Button>
                </Link>
            </div>

            <ActesPageClient actes={actes} dossiers={dossiers} users={db.users} templates={db.templates} />
        </div>
    );
}
