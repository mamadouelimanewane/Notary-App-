"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { Role, ROLE_LABELS } from "@/lib/rbac";
import { Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface UserFormProps {
    user?: User;
    isEditMode?: boolean;
}

export function UserForm({ user, isEditMode = false }: UserFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        password: "",
        role: user?.role || "CLERC" as Role,
        isActive: user?.isActive ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const url = isEditMode ? `/api/admin/users/${user?.id}` : "/api/admin/users";
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Une erreur est survenue");
            }

            setSuccess(isEditMode ? "Utilisateur mis à jour avec succès" : "Utilisateur créé avec succès");

            if (!isEditMode) {
                // Reset form on create
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    role: "CLERC",
                    isActive: true,
                });
            }

            router.refresh();

            if (!isEditMode) {
                setTimeout(() => router.push("/dashboard/admin/users"), 1500);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                    <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                    <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email professionnel</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        {isEditMode ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
                    </label>
                    <input
                        type="password"
                        required={!isEditMode}
                        minLength={8}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder={isEditMode ? "••••••••" : "8 caractères minimum"}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rôle & Permissions</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        {Object.entries(ROLE_LABELS).map(([role, label]) => (
                            <option key={role} value={role}>
                                {label} ({role})
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                        Le rôle détermine les permissions par défaut de l'utilisateur.
                    </p>
                </div>

                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Compte Actif</span>
                    </label>
                    <p className="text-xs text-slate-500 mt-1 ml-6">
                        Désactivez cette case pour bloquer l'accès sans supprimer l'utilisateur.
                    </p>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isEditMode ? "Enregistrer les modifications" : "Créer l'utilisateur"}
                </button>
            </div>
        </form>
    );
}
