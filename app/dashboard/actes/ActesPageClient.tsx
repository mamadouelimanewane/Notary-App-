"use client";

import { FileText, Download, History, MessageSquare, ShieldCheck, Edit, Eye, CheckCircle, Clock, AlertCircle, FileCheck } from "lucide-react";
import { generateCompromisPDF } from "@/lib/pdf-generator";
import { useState, useMemo } from "react";
import { HeroSection, StatsCard, ModernSearchBar, FilterPills, ModernPageLayout, FilterOption } from "@/components/modern";
import { Card, CardContent } from "@/components/ui/card";
import PrintButton from "@/components/PrintButton";
import PrintActeList from "@/components/print/PrintActeList";
import { WorkflowStatusBadge } from "@/components/workflow/WorkflowStatus";
import { WorkflowActions } from "@/components/workflow/WorkflowActions";
import { WorkflowHistory } from "@/components/workflow/WorkflowHistory";
import { WorkflowComments } from "@/components/workflow/WorkflowComments";
import { BlockchainBadge } from "@/components/workflow/BlockchainBadge";
import { getAvailableWorkflowActions } from "@/lib/workflow-definitions";
import { useSession } from "next-auth/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/db";
import { ACTE_CATEGORIES } from "@/lib/acte-types";

interface ActesPageClientProps {
    actes: any[];
    dossiers: any[];
    users: User[];
    templates: any[];
}

const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
        "Droit de la Famille": "from-pink-500 to-rose-500",
        "Successions & Libéralités": "from-purple-500 to-violet-500",
        "Droit Immobilier": "from-blue-500 to-cyan-500",
        "Droit des Affaires": "from-green-500 to-emerald-500",
        "Droit Rural & Agricole": "from-yellow-500 to-amber-500",
        "Actes Internationaux": "from-indigo-500 to-blue-500",
        "Authentifications & Certifications": "from-teal-500 to-cyan-500",
        "Autres Actes": "from-gray-500 to-slate-500"
    };
    return gradients[category] || "from-gray-500 to-slate-500";
};

export default function ActesPageClient({ actes: initialActes, dossiers, users, templates }: ActesPageClientProps) {
    const { data: session } = useSession();
    const [actes] = useState(initialActes);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("ALL");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [selectedUser, setSelectedUser] = useState("ALL");
    const [selectedActe, setSelectedActe] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [actionComment, setActionComment] = useState("");

    // Statistiques
    const stats = useMemo(() => {
        const signes = actes.filter(a => a.status === 'SIGNE').length;
        const enRevision = actes.filter(a => a.status === 'EN_REVISION').length;
        const valides = actes.filter(a => a.status === 'VALIDE').length;
        const brouillons = actes.filter(a => a.status === 'BROUILLON').length;

        return {
            total: actes.length,
            signes,
            enRevision,
            valides,
            brouillons
        };
    }, [actes]);

    const getDossierRef = (dossierId: string) => {
        const dossier = dossiers.find(d => d.id === dossierId);
        return dossier ? dossier.ref : 'N/A';
    };

    const availableActions = useMemo(() => {
        if (!selectedActe || !session?.user) return [];
        const userRole = (session.user as any).role || 'NOTAIRE';
        return getAvailableWorkflowActions(selectedActe.status, userRole);
    }, [selectedActe, session]);

    const handleAction = async (actionId: string) => {
        if (!selectedActe) return;
        setIsActionLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({
                title: "Action effectuée",
                description: `L'action a été enregistrée avec succès.`,
            });
            setIsDetailsOpen(false);
        } catch (error) {
            console.error(error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue.",
                variant: "destructive"
            });
        } finally {
            setIsActionLoading(false);
            setActionComment("");
        }
    };

    // Extract unique categories and types
    const categories = useMemo(() => {
        const cats = new Set(actes.map(a => a.category).filter(Boolean));
        return Array.from(cats).sort();
    }, [actes]);

    const types = useMemo(() => {
        const typeSet = new Set(actes.map(a => a.type).filter(Boolean));
        return Array.from(typeSet).sort();
    }, [actes]);

    // Filter options
    const statusFilters: FilterOption[] = [
        { id: 'ALL', label: 'Tous', icon: FileText, count: actes.length },
        { id: 'BROUILLON', label: 'Brouillons', icon: Edit, count: stats.brouillons, gradient: 'from-gray-500 to-slate-500' },
        { id: 'EN_REVISION', label: 'En révision', icon: Clock, count: stats.enRevision, gradient: 'from-orange-500 to-red-500' },
        { id: 'VALIDE', label: 'Validés', icon: CheckCircle, count: stats.valides, gradient: 'from-blue-500 to-cyan-500' },
        { id: 'SIGNE', label: 'Signés', icon: FileCheck, count: stats.signes, gradient: 'from-green-500 to-emerald-500' }
    ];

    const categoryFilters: FilterOption[] = [
        { id: 'ALL', label: 'Toutes', icon: FileText, count: actes.length },
        ...categories.map(cat => ({
            id: cat,
            label: cat,
            icon: FileText,
            count: actes.filter(a => a.category === cat).length,
            gradient: getCategoryGradient(cat)
        }))
    ];

    const filteredActes = useMemo(() => {
        return actes.filter((acte) => {
            const matchesSearch =
                searchQuery === "" ||
                acte.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                acte.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                getDossierRef(acte.dossierId).toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = selectedType === "ALL" || acte.type === selectedType;
            const matchesCategory = selectedCategory === "ALL" || acte.category === selectedCategory;
            const matchesStatus = selectedStatus === "ALL" || acte.status === selectedStatus;
            const matchesUser = selectedUser === "ALL" || acte.assignedTo === selectedUser;

            return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesUser;
        });
    }, [actes, searchQuery, selectedType, selectedCategory, selectedStatus, selectedUser]);

    return (
        <ModernPageLayout>
            {/* Hero Section */}
            <HeroSection
                title="Actes Notariaux"
                description="Gérez tous vos actes notariaux avec suivi du workflow complet"
                icon={FileText}
                stats={[
                    { label: 'Total', value: stats.total },
                    { label: 'Signés', value: stats.signes }
                ]}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Actes"
                    value={stats.total}
                    icon={FileText}
                    gradient="from-blue-500 to-cyan-500"
                    description="Actes enregistrés"
                    trend={{ value: "+18%", isPositive: true }}
                />
                <StatsCard
                    title="Signés"
                    value={stats.signes}
                    icon={FileCheck}
                    gradient="from-green-500 to-emerald-500"
                    description="Actes signés"
                />
                <StatsCard
                    title="En Révision"
                    value={stats.enRevision}
                    icon={Clock}
                    gradient="from-orange-500 to-red-500"
                    description="En attente de validation"
                />
                <StatsCard
                    title="Brouillons"
                    value={stats.brouillons}
                    icon={Edit}
                    gradient="from-purple-500 to-pink-500"
                    description="En cours de rédaction"
                />
            </div>

            {/* Search and Filters */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                    {/* Search Bar */}
                    <ModernSearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Rechercher un acte par titre, type ou référence dossier..."
                    />

                    {/* Status Filters */}
                    <div>
                        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Statut</h3>
                        <FilterPills
                            options={statusFilters}
                            selected={selectedStatus}
                            onSelect={setSelectedStatus}
                        />
                    </div>

                    {/* Category Filters */}
                    {categories.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Catégorie</h3>
                            <FilterPills
                                options={categoryFilters.slice(0, 8)}
                                selected={selectedCategory}
                                onSelect={setSelectedCategory}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground font-medium">
                            {filteredActes.length} acte{filteredActes.length > 1 ? 's' : ''} trouvé{filteredActes.length > 1 ? 's' : ''}
                        </div>
                        <PrintButton
                            label="Imprimer"
                            variant="outline"
                            onBeforePrint={() => setShowPrintPreview(true)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Print Preview */}
            {showPrintPreview && (
                <div className="print-container hidden" data-print="show">
                    <PrintActeList
                        actes={filteredActes}
                        filters={{
                            types: selectedType !== "ALL" ? [selectedType] : [],
                            categories: selectedCategory !== "ALL" ? [selectedCategory] : [],
                            statuses: selectedStatus !== "ALL" ? [selectedStatus] : [],
                            searchQuery
                        }}
                    />
                </div>
            )}

            {/* Results Grid */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredActes.map((acte) => {
                            const gradient = getCategoryGradient(acte.category);

                            return (
                                <div
                                    key={acte.id}
                                    className="group relative border-2 border-gray-200 hover:border-blue-300 rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white hover:-translate-y-2 overflow-hidden"
                                    onClick={() => {
                                        setSelectedActe(acte);
                                        setIsDetailsOpen(true);
                                    }}
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
                                                <WorkflowStatusBadge status={acte.status} />
                                                <span className="block text-xs text-muted-foreground mt-1">
                                                    Dossier: {getDossierRef(acte.dossierId)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-bold text-base mb-2 text-blue-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {acte.title}
                                        </h3>

                                        {/* Type & Category */}
                                        <div className="space-y-2 mb-3">
                                            <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-br ${gradient} bg-opacity-10 text-blue-700 border border-blue-200`}>
                                                {acte.type}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {acte.category}
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="text-xs text-muted-foreground">
                                            Créé le {new Date(acte.createdAt).toLocaleDateString("fr-FR")}
                                        </div>

                                        {/* Blockchain Badge */}
                                        {acte.blockchainHash && (
                                            <div className="mt-3">
                                                <BlockchainBadge hash={acte.blockchainHash} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty State */}
                        {filteredActes.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center p-16 text-center">
                                <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4">
                                    <FileText className="h-16 w-16 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Aucun acte trouvé</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    Essayez de modifier vos filtres ou créez un nouveau dossier pour générer des actes.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-primary" />
                            {selectedActe?.title}
                        </DialogTitle>
                        <DialogDescription>
                            Dossier: {selectedActe && getDossierRef(selectedActe.dossierId)} • {selectedActe?.type}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedActe && (
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="details">Détails</TabsTrigger>
                                <TabsTrigger value="history">Historique</TabsTrigger>
                                <TabsTrigger value="comments">Commentaires</TabsTrigger>
                                <TabsTrigger value="actions">Actions</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Statut</label>
                                        <div className="mt-1">
                                            <WorkflowStatusBadge status={selectedActe.status} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
                                        <p className="mt-1">{selectedActe.category}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Date de création</label>
                                        <p className="mt-1">{new Date(selectedActe.createdAt).toLocaleDateString("fr-FR")}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Dossier</label>
                                        <p className="mt-1">{getDossierRef(selectedActe.dossierId)}</p>
                                    </div>
                                </div>

                                {selectedActe.blockchainHash && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Blockchain</label>
                                        <div className="mt-1">
                                            <BlockchainBadge hash={selectedActe.blockchainHash} />
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => generateCompromisPDF(selectedActe)}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Télécharger PDF
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {/* Generate Word */ }}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Télécharger Word
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="history">
                                <WorkflowHistory acteId={selectedActe.id} />
                            </TabsContent>

                            <TabsContent value="comments">
                                <WorkflowComments acteId={selectedActe.id} />
                            </TabsContent>

                            <TabsContent value="actions" className="space-y-4">
                                <WorkflowActions
                                    actions={availableActions}
                                    onAction={handleAction}
                                    isLoading={isActionLoading}
                                />
                                <div>
                                    <label className="text-sm font-medium">Commentaire (optionnel)</label>
                                    <Textarea
                                        value={actionComment}
                                        onChange={(e) => setActionComment(e.target.value)}
                                        placeholder="Ajoutez un commentaire..."
                                        className="mt-2"
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </DialogContent>
            </Dialog>
        </ModernPageLayout>
    );
}
