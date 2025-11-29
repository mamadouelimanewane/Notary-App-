"use client";

import Link from "next/link";
import { Plus, FileText, Edit, Eye, Copy, Trash2, Layers } from "lucide-react";
import { ACTE_TYPES, ACTE_CATEGORIES, type ActeCategory } from "@/lib/acte-types";
import { HeroSection, StatsCard, ModernSearchBar, FilterPills, ModernPageLayout, FilterOption } from "@/components/modern";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { Template } from "@/types/db";

interface TemplatesPageClientProps {
    initialTemplates: Template[];
}

export default function TemplatesPageClient({ initialTemplates }: TemplatesPageClientProps) {
    const templates = initialTemplates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const getActeLabel = (type: string) => {
        return ACTE_TYPES[type as keyof typeof ACTE_TYPES]?.label || type;
    };

    const getCategoryLabel = (category: string) => {
        return ACTE_CATEGORIES[category as ActeCategory] || category;
    };

    const getCategoryGradient = (category: string) => {
        const gradients: Record<string, string> = {
            "FAMILLE": "from-pink-500 to-rose-500",
            "SUCCESSION": "from-purple-500 to-violet-500",
            "IMMOBILIER": "from-blue-500 to-cyan-500",
            "AFFAIRES": "from-green-500 to-emerald-500",
            "RURAL": "from-yellow-500 to-amber-500",
            "INTERNATIONAL": "from-indigo-500 to-blue-500",
            "AUTHENTIFICATION": "from-teal-500 to-cyan-500",
            "AUTRE": "from-gray-500 to-slate-500"
        };
        return gradients[category] || "from-gray-500 to-slate-500";
    };

    // Statistiques
    const stats = useMemo(() => {
        const byCategory = templates.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const systemTemplates = templates.filter(t => t.isDefault).length;
        const customTemplates = templates.filter(t => !t.isDefault).length;

        return {
            total: templates.length,
            system: systemTemplates,
            custom: customTemplates,
            byCategory
        };
    }, [templates]);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(templates.map(t => t.category).filter(Boolean));
        return Array.from(cats).sort();
    }, [templates]);

    // Filter options
    const categoryFilters: FilterOption[] = [
        { id: 'ALL', label: 'Toutes', icon: Layers, count: templates.length },
        ...categories.map(cat => ({
            id: cat,
            label: getCategoryLabel(cat),
            icon: FileText,
            count: stats.byCategory[cat] || 0,
            gradient: getCategoryGradient(cat)
        }))
    ];

    // Filter templates
    const filteredTemplates = useMemo(() => {
        return templates.filter(template => {
            const matchesSearch =
                searchQuery === "" ||
                template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                getActeLabel(template.acteType).toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === "ALL" || template.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [templates, searchQuery, selectedCategory]);

    // Group templates by category
    const templatesByCategory = filteredTemplates.reduce((acc, template) => {
        if (!acc[template.category]) {
            acc[template.category] = [];
        }
        acc[template.category].push(template);
        return acc;
    }, {} as Record<string, typeof templates>);

    return (
        <ModernPageLayout>
            {/* Hero Section */}
            <HeroSection
                title="Templates d'Actes"
                description="Gérez vos modèles de documents personnalisés et accélérez la rédaction"
                icon={Layers}
                stats={[
                    { label: 'Total', value: stats.total },
                    { label: 'Personnalisés', value: stats.custom }
                ]}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Templates"
                    value={stats.total}
                    icon={Layers}
                    gradient="from-blue-500 to-cyan-500"
                    description="Modèles disponibles"
                />
                <StatsCard
                    title="Système"
                    value={stats.system}
                    icon={FileText}
                    gradient="from-purple-500 to-pink-500"
                    description="Templates par défaut"
                />
                <StatsCard
                    title="Personnalisés"
                    value={stats.custom}
                    icon={Edit}
                    gradient="from-green-500 to-emerald-500"
                    description="Créés par vous"
                />
                <StatsCard
                    title="Catégories"
                    value={categories.length}
                    icon={Layers}
                    gradient="from-orange-500 to-red-500"
                    description="Types d'actes"
                />
            </div>

            {/* Search and Filters */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                    {/* Search Bar */}
                    <ModernSearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Rechercher un template par nom ou type d'acte..."
                    />

                    {/* Category Filters */}
                    {categories.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Catégorie</h3>
                            <FilterPills
                                options={categoryFilters}
                                selected={selectedCategory}
                                onSelect={setSelectedCategory}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground font-medium">
                            {filteredTemplates.length} template{filteredTemplates.length > 1 ? 's' : ''} trouvé{filteredTemplates.length > 1 ? 's' : ''}
                        </div>
                        <Link
                            href="/dashboard/templates/new"
                            className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-11 px-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                        >
                            <Plus className="mr-2 h-5 w-5" /> Nouveau Template
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            {filteredTemplates.length === 0 ? (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-16">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4">
                                <FileText className="h-16 w-16 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Aucun template trouvé</h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                {searchQuery || selectedCategory !== "ALL"
                                    ? "Essayez de modifier vos filtres de recherche."
                                    : "Créez votre premier template pour générer des actes personnalisés"}
                            </p>
                            <Link
                                href="/dashboard/templates/new"
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-11 px-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                            >
                                <Plus className="mr-2 h-5 w-5" /> Créer un template
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => {
                        const gradient = getCategoryGradient(category);

                        return (
                            <div key={category}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`h-8 w-1 bg-gradient-to-b ${gradient} rounded-full`} />
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        {getCategoryLabel(category)}
                                    </h2>
                                    <span className="text-sm text-muted-foreground">
                                        ({categoryTemplates.length})
                                    </span>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {categoryTemplates.map((template) => (
                                        <div
                                            key={template.id}
                                            className={`group relative border-2 border-gray-200 hover:border-blue-300 rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white hover:-translate-y-2 overflow-hidden`}
                                        >
                                            {/* Gradient overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                                            <div className="relative z-10">
                                                {/* Header */}
                                                <div className="flex items-start gap-4 mb-3">
                                                    <div className={`p-3 bg-gradient-to-br ${gradient} bg-opacity-10 rounded-xl group-hover:scale-110 transition-transform`}>
                                                        <FileText className="h-6 w-6 text-blue-700" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-base mb-1 text-blue-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                            {template.name}
                                                        </h3>
                                                        {template.isDefault && (
                                                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                                                                Système
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Type */}
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    {getActeLabel(template.acteType)}
                                                </p>

                                                {/* Info */}
                                                <div className="space-y-1 mb-4 text-xs text-muted-foreground">
                                                    <p>Variables: {template.variables.length}</p>
                                                    <p>Modifié: {new Date(template.updatedAt).toLocaleDateString('fr-FR')}</p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/dashboard/templates/${template.id}/edit`}
                                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium transition-all"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Éditer
                                                    </Link>
                                                    <button className="px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-all">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </ModernPageLayout>
    );
}
