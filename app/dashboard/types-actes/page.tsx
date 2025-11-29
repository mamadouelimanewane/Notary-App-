'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ACTE_CATEGORIES,
    ACTE_TYPES,
    getAllActeTypes,
    getActesByCategory,
    ActeCategory
} from '@/lib/acte-types';
import {
    Search,
    FileText,
    Users,
    Home,
    Building2,
    Briefcase,
    Sprout,
    Globe,
    CheckCircle2,
    List,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    TrendingUp,
    Filter,
    X
} from 'lucide-react';

const categoryIcons: Record<ActeCategory, any> = {
    FAMILLE: Users,
    SUCCESSION: FileText,
    IMMOBILIER: Home,
    AFFAIRES: Briefcase,
    RURAL: Sprout,
    INTERNATIONAL: Globe,
    AUTHENTIFICATION: CheckCircle2,
    AUTRE: List
};

const categoryColors: Record<ActeCategory, { bg: string; text: string; gradient: string; border: string }> = {
    FAMILLE: {
        bg: 'bg-gradient-to-br from-pink-50 to-rose-100',
        text: 'text-pink-700',
        gradient: 'from-pink-500 to-rose-500',
        border: 'border-pink-200 hover:border-pink-300'
    },
    SUCCESSION: {
        bg: 'bg-gradient-to-br from-purple-50 to-violet-100',
        text: 'text-purple-700',
        gradient: 'from-purple-500 to-violet-500',
        border: 'border-purple-200 hover:border-purple-300'
    },
    IMMOBILIER: {
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-100',
        text: 'text-blue-700',
        gradient: 'from-blue-500 to-cyan-500',
        border: 'border-blue-200 hover:border-blue-300'
    },
    AFFAIRES: {
        bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
        text: 'text-green-700',
        gradient: 'from-green-500 to-emerald-500',
        border: 'border-green-200 hover:border-green-300'
    },
    RURAL: {
        bg: 'bg-gradient-to-br from-yellow-50 to-amber-100',
        text: 'text-yellow-700',
        gradient: 'from-yellow-500 to-amber-500',
        border: 'border-yellow-200 hover:border-yellow-300'
    },
    INTERNATIONAL: {
        bg: 'bg-gradient-to-br from-indigo-50 to-blue-100',
        text: 'text-indigo-700',
        gradient: 'from-indigo-500 to-blue-500',
        border: 'border-indigo-200 hover:border-indigo-300'
    },
    AUTHENTIFICATION: {
        bg: 'bg-gradient-to-br from-teal-50 to-cyan-100',
        text: 'text-teal-700',
        gradient: 'from-teal-500 to-cyan-500',
        border: 'border-teal-200 hover:border-teal-300'
    },
    AUTRE: {
        bg: 'bg-gradient-to-br from-gray-50 to-slate-100',
        text: 'text-gray-700',
        gradient: 'from-gray-500 to-slate-500',
        border: 'border-gray-200 hover:border-gray-300'
    }
};

const ITEMS_PER_PAGE = 50;

export default function ActeTypesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ActeCategory | 'ALL'>('ALL');
    const [currentPage, setCurrentPage] = useState(1);

    const allActes = useMemo(() => getAllActeTypes(), []);

    // Filtrer les actes selon la recherche et la catégorie
    const filteredActes = useMemo(() => {
        const filtered = allActes.filter(acte => {
            const matchesSearch = searchQuery === '' ||
                acte.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                acte.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === 'ALL' ||
                acte.category === ACTE_CATEGORIES[selectedCategory as ActeCategory];

            return matchesSearch && matchesCategory;
        });

        setCurrentPage(1);
        return filtered;
    }, [allActes, searchQuery, selectedCategory]);

    // Pagination
    const totalPages = Math.ceil(filteredActes.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedActes = filteredActes.slice(startIndex, endIndex);

    // Compter les actes par catégorie
    const actesCountByCategory = useMemo(() => {
        return Object.keys(ACTE_CATEGORIES).reduce((acc, cat) => {
            const category = cat as ActeCategory;
            acc[category] = getActesByCategory(category).length;
            return acc;
        }, {} as Record<ActeCategory, number>);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto p-6 space-y-8">
                {/* Hero Header with Gradient */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                <FileText className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                    Types d'Actes Notariaux
                                </h1>
                                <p className="text-blue-100 text-lg flex items-center gap-2">
                                    <Sparkles className="h-5 w-5" />
                                    Classification exhaustive de {allActes.length}+ types d'actes professionnels
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Stats Cards with Gradients */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="pb-3 relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-blue-100">
                                    Total Types d'Actes
                                </CardTitle>
                                <TrendingUp className="h-5 w-5 text-blue-200" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-5xl font-bold mb-1">{allActes.length}</div>
                            <p className="text-xs text-blue-100">Actes disponibles</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="pb-3 relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-purple-100">
                                    Catégories
                                </CardTitle>
                                <Filter className="h-5 w-5 text-purple-200" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-5xl font-bold mb-1">
                                {Object.keys(ACTE_CATEGORIES).length}
                            </div>
                            <p className="text-xs text-purple-100">Domaines juridiques</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-500 to-emerald-500 text-white overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="pb-3 relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-green-100">
                                    Actes Immobiliers
                                </CardTitle>
                                <Home className="h-5 w-5 text-green-200" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-5xl font-bold mb-1">
                                {actesCountByCategory.IMMOBILIER}
                            </div>
                            <p className="text-xs text-green-100">Transactions immobilières</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-500 to-red-500 text-white overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="pb-3 relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-orange-100">
                                    Actes Famille
                                </CardTitle>
                                <Users className="h-5 w-5 text-orange-200" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-5xl font-bold mb-1">
                                {actesCountByCategory.FAMILLE}
                            </div>
                            <p className="text-xs text-orange-100">Droit de la famille</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters Card */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Search className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Rechercher un Type d'Acte</CardTitle>
                                <CardDescription>
                                    Filtrez par catégorie ou recherchez par nom
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {/* Search Bar with Clear Button */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un acte (ex: vente, donation, testament...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-12 h-14 text-lg border-2 focus:border-blue-500 rounded-xl shadow-sm"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant={selectedCategory === 'ALL' ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory('ALL')}
                                className={`rounded-full transition-all ${selectedCategory === 'ALL'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                                        : 'hover:border-blue-400'
                                    }`}
                            >
                                <List className="h-4 w-4 mr-2" />
                                Tous ({allActes.length})
                            </Button>
                            {Object.entries(ACTE_CATEGORIES).map(([key, label]) => {
                                const categoryKey = key as ActeCategory;
                                const Icon = categoryIcons[categoryKey];
                                const colors = categoryColors[categoryKey];
                                const count = actesCountByCategory[categoryKey];
                                const isSelected = selectedCategory === categoryKey;

                                return (
                                    <Button
                                        key={key}
                                        variant={isSelected ? 'default' : 'outline'}
                                        onClick={() => setSelectedCategory(categoryKey)}
                                        className={`rounded-full transition-all ${isSelected
                                                ? `bg-gradient-to-r ${colors.gradient} shadow-lg text-white`
                                                : `${colors.border} hover:shadow-md`
                                            }`}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">{label}</span>
                                        <span className="sm:hidden">{key.slice(0, 3)}</span>
                                        <Badge variant="secondary" className="ml-2">
                                            {count}
                                        </Badge>
                                    </Button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Results Card */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                    {filteredActes.length} acte{filteredActes.length > 1 ? 's' : ''} trouvé{filteredActes.length > 1 ? 's' : ''}
                                </CardTitle>
                                {searchQuery && (
                                    <CardDescription className="mt-1">
                                        Résultats pour "{searchQuery}"
                                    </CardDescription>
                                )}
                            </div>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground font-medium">
                                        Page {currentPage} sur {totalPages}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="rounded-full"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="rounded-full"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {paginatedActes.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4">
                                    <FileText className="h-16 w-16 text-blue-400" />
                                </div>
                                <p className="text-xl font-medium text-muted-foreground mb-2">
                                    Aucun acte trouvé
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Essayez de modifier vos critères de recherche
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {paginatedActes.map((acte, index) => {
                                    const categoryKey = Object.entries(ACTE_CATEGORIES).find(
                                        ([_, label]) => label === acte.category
                                    )?.[0] as ActeCategory;
                                    const Icon = categoryIcons[categoryKey];
                                    const colors = categoryColors[categoryKey];

                                    return (
                                        <div
                                            key={`${acte.type}-${index}`}
                                            className={`group relative border-2 ${colors.border} rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white hover:-translate-y-2 overflow-hidden`}
                                        >
                                            {/* Gradient overlay on hover */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                                            <div className="relative z-10">
                                                <div className="flex items-start gap-4 mb-3">
                                                    <div className={`p-3 ${colors.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                                                        <Icon className={`h-6 w-6 ${colors.text}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className={`font-bold text-base mb-1 ${colors.text} group-hover:text-blue-600 transition-colors line-clamp-2`}>
                                                            {acte.label}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                                                    {acte.description}
                                                </p>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs font-medium ${colors.text} border-current`}
                                                >
                                                    {acte.category}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Category Breakdown */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-blue-600" />
                        Explorer par Catégorie
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.entries(ACTE_CATEGORIES).map(([key, label]) => {
                            const categoryKey = key as ActeCategory;
                            const Icon = categoryIcons[categoryKey];
                            const colors = categoryColors[categoryKey];
                            const count = actesCountByCategory[categoryKey];

                            return (
                                <Card
                                    key={key}
                                    className={`group border-2 ${colors.border} cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white overflow-hidden`}
                                    onClick={() => setSelectedCategory(categoryKey)}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                    <CardHeader className="pb-4 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 ${colors.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                                                <Icon className={`h-8 w-8 ${colors.text}`} />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className={`text-lg ${colors.text} group-hover:text-blue-600 transition-colors`}>
                                                    {label}
                                                </CardTitle>
                                                <CardDescription className="text-sm mt-1">
                                                    {count} type{count > 1 ? 's' : ''} d'actes
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <div className="text-4xl font-bold text-center py-4 text-muted-foreground group-hover:text-blue-600 transition-colors">
                                            {count}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
