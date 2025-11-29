'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FileText,
    Plus,
    Filter,
    AlertCircle,
    Clock,
    CheckCircle,
    TrendingUp,
    DollarSign
} from 'lucide-react';
import FormaliteCard from '@/components/formalites/FormaliteCard';
import { Formalite, FormaliteStatus, FormaliteType, FormalitePriorite, FormaliteStats } from '@/types/formalite-types';

interface EnrichedFormalite extends Formalite {
    isEnRetard?: boolean;
    joursRestants?: number | null;
    acte?: any;
    dossier?: any;
    client?: any;
}

export default function FormalitesPage() {
    const router = useRouter();
    const [formalites, setFormalites] = useState<EnrichedFormalite[]>([]);
    const [stats, setStats] = useState<FormaliteStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterStatut, setFilterStatut] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');
    const [filterPriorite, setFilterPriorite] = useState<string>('');
    const [showEnRetard, setShowEnRetard] = useState(false);

    useEffect(() => {
        loadFormalites();
        loadStats();
    }, [filterStatut, filterType, filterPriorite, showEnRetard]);

    const loadFormalites = async () => {
        try {
            const params = new URLSearchParams();
            if (filterStatut) params.append('statut', filterStatut);
            if (filterType) params.append('type', filterType);
            if (filterPriorite) params.append('priorite', filterPriorite);
            if (showEnRetard) params.append('enRetard', 'true');

            const response = await fetch(`/api/formalites?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setFormalites(data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des formalités:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await fetch('/api/formalites/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        }
    };

    const handleStatusChange = async (id: string, newStatus: FormaliteStatus) => {
        try {
            const response = await fetch(`/api/formalites/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ statut: newStatus })
            });

            if (response.ok) {
                loadFormalites();
                loadStats();
            }
        } catch (error) {
            console.error('Erreur lors du changement de statut:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-primary">Formalités</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gestion des démarches administratives et formalités notariales
                    </p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/formalites/new')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvelle Formalité
                </button>
            </div>

            {/* Statistiques */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <FileText className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">En Attente</p>
                                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{stats.enAttente}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">En Cours</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.enCours}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700 dark:text-green-400">Complétées</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-300">{stats.completees}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-700 dark:text-red-400">En Retard</p>
                                <p className="text-2xl font-bold text-red-900 dark:text-red-300">{stats.enRetard}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
                        </div>
                    </div>
                </div>
            )}

            {/* Frais total */}
            {stats && stats.montantTotalFrais > 0 && (
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-primary-foreground">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium opacity-90">Montant Total des Frais</p>
                            <p className="text-3xl font-bold mt-1">{formatCurrency(stats.montantTotalFrais)} FCFA</p>
                        </div>
                        <DollarSign className="w-12 h-12 opacity-80" />
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-medium">Filtres</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Statut</label>
                        <select
                            value={filterStatut}
                            onChange={(e) => setFilterStatut(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Tous</option>
                            <option value={FormaliteStatus.EN_ATTENTE}>En Attente</option>
                            <option value={FormaliteStatus.EN_COURS}>En Cours</option>
                            <option value={FormaliteStatus.COMPLETEE}>Complétée</option>
                            <option value={FormaliteStatus.REJETEE}>Rejetée</option>
                            <option value={FormaliteStatus.ANNULEE}>Annulée</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Tous</option>
                            <option value={FormaliteType.ENREGISTREMENT_FISCAL}>Enregistrement Fiscal</option>
                            <option value={FormaliteType.PUBLICITE_FONCIERE}>Publicité Foncière</option>
                            <option value={FormaliteType.INSCRIPTION_HYPOTHEQUE}>Inscription Hypothèque</option>
                            <option value={FormaliteType.MAINLEVEE_HYPOTHEQUE}>Mainlevée Hypothèque</option>
                            <option value={FormaliteType.DECLARATION_SUCCESSION}>Déclaration Succession</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Priorité</label>
                        <select
                            value={filterPriorite}
                            onChange={(e) => setFilterPriorite(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Toutes</option>
                            <option value={FormalitePriorite.BASSE}>Basse</option>
                            <option value={FormalitePriorite.NORMALE}>Normale</option>
                            <option value={FormalitePriorite.HAUTE}>Haute</option>
                            <option value={FormalitePriorite.URGENTE}>Urgente</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Affichage</label>
                        <label className="flex items-center h-10 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showEnRetard}
                                onChange={(e) => setShowEnRetard(e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="ml-2 text-sm text-foreground">Seulement en retard</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Liste des formalités */}
            {formalites.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-lg border border-dashed p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune formalité</h3>
                    <p className="text-muted-foreground mb-4">
                        Commencez par créer une formalité ou générez-les automatiquement depuis un acte.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard/formalites/new')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Créer une Formalité
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formalites.map((formalite) => (
                        <FormaliteCard
                            key={formalite.id}
                            formalite={formalite}
                            onStatusChange={handleStatusChange}
                            onClick={() => router.push(`/dashboard/formalites/${formalite.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
