import { getCurrentUser, requirePermission } from "@/lib/auth-guard";
import { UserForm } from "@/components/admin/UserForm";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewUserPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    try {
        await requirePermission('MANAGE_USERS');
    } catch (error) {
        return (
            <div className="p-8 text-center text-red-600">
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-xl font-bold">Accès Refusé</h2>
                <p>Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/admin/users"
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Nouvel Utilisateur</h1>
                    <p className="text-muted-foreground">
                        Créez un compte pour un collaborateur de l'étude.
                    </p>
                </div>
            </div>

            <UserForm />
        </div>
    );
}
