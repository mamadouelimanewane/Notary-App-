import { getCurrentUser, requirePermission } from "@/lib/auth-guard";
import { UserForm } from "@/components/admin/UserForm";
import { db } from "@/lib/db";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface Props {
    params: { id: string };
}

export default async function EditUserPage({ params }: Props) {
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

    const userToEdit = db.users.find(u => u.id === params.id);

    if (!userToEdit) {
        notFound();
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
                    <h1 className="text-2xl font-bold tracking-tight">Modifier Utilisateur</h1>
                    <p className="text-muted-foreground">
                        Mettez à jour les informations et les droits de {userToEdit.firstName} {userToEdit.lastName}.
                    </p>
                </div>
            </div>

            <UserForm user={userToEdit} isEditMode={true} />
        </div>
    );
}
