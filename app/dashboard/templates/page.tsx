import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, FileText, Edit, Trash2 } from "lucide-react";
import { ACTE_TYPES, ACTE_CATEGORIES, type ActeCategory } from "@/lib/acte-types";

export default function TemplatesPage() {
    const templates = db.templates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const getActeLabel = (type: string) => {
        return ACTE_TYPES[type as keyof typeof ACTE_TYPES]?.label || type;
    };

    const getCategoryLabel = (category: string) => {
        return ACTE_CATEGORIES[category as ActeCategory] || category;
    };

    // Group templates by category
    const templatesByCategory = templates.reduce((acc, template) => {
        if (!acc[template.category]) {
            acc[template.category] = [];
        }
        acc[template.category].push(template);
        return acc;
    }, {} as Record<string, typeof templates>);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Templates d'Actes</h1>
                    <p className="text-muted-foreground mt-1">Gérez vos modèles de documents personnalisés</p>
                </div>
                <Link href="/dashboard/templates/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 py-2">
                    <Plus className="mr-2 h-4 w-4" /> Nouveau Template
                </Link>
            </div>

            {templates.length === 0 ? (
                <div className="rounded-md border bg-white p-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold">Aucun template</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Créez votre premier template pour générer des actes personnalisés</p>
                    <Link href="/dashboard/templates/new" className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 py-2">
                        <Plus className="mr-2 h-4 w-4" /> Créer un template
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
                        <div key={category} className="space-y-3">
                            <h2 className="text-xl font-semibold flex items-center">
                                <span className="bg-slate-100 px-3 py-1 rounded-md text-sm">{getCategoryLabel(category)}</span>
                                <span className="ml-2 text-sm text-muted-foreground">({categoryTemplates.length})</span>
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {categoryTemplates.map((template) => (
                                    <div key={template.id} className="rounded-xl border bg-card text-card-foreground shadow hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg flex items-center">
                                                        <FileText className="mr-2 h-5 w-5 text-slate-600" />
                                                        {template.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mt-1">{getActeLabel(template.acteType)}</p>
                                                    {template.isDefault && (
                                                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                                                            Système
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-4 text-xs text-muted-foreground">
                                                <p>Variables: {template.variables.length}</p>
                                                <p>Modifié: {new Date(template.updatedAt).toLocaleDateString('fr-FR')}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 flex gap-2">
                                            <Link href={`/dashboard/templates/${template.id}/edit`} className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                                                <Edit className="mr-1 h-4 w-4" /> Éditer
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
