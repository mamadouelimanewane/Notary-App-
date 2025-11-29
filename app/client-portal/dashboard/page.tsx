'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    FileText,
    Upload,
    MessageSquare,
    Calendar,
    CreditCard,
    LogOut,
    User,
    Bell,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';

interface ClientDossier {
    id: string;
    reference: string;
    acteType: string;
    acteLabel: string;
    status: string;
    progress: number;
    currentStep?: string;
    estimatedCompletionDate?: string;
    requiresAction: boolean;
}

interface ClientStats {
    totalDossiers: number;
    activeDossiers: number;
    completedDossiers: number;
    pendingDocuments: number;
    unreadMessages: number;
    upcomingAppointments: number;
    pendingPayments: number;
}

export default function ClientPortalDashboard() {
    const router = useRouter();
    const [dossiers, setDossiers] = useState<ClientDossier[]>([]);
    const [stats, setStats] = useState<ClientStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const token = localStorage.getItem('client_portal_token');
            if (!token) {
                router.push('/client-portal/login');
                return;
            }

            // Récupérer les dossiers
            const dossiersResponse = await fetch('/api/client-portal/dossiers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (dossiersResponse.ok) {
                const data = await dossiersResponse.json();
                setDossiers(data.dossiers || []);
            }

            // Récupérer les statistiques
            const statsResponse = await fetch('/api/client-portal/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (statsResponse.ok) {
                const data = await statsResponse.json();
                setStats(data.stats);
            }

            // Récupérer le profil
            const userStr = localStorage.getItem('client_portal_user');
            if (userStr) {
                setUser(JSON.parse(userStr));
            }

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('client_portal_token');
        localStorage.removeItem('client_portal_user');
        router.push('/client-portal/login');
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; variant: any }> = {
            'draft': { label: 'Brouillon', variant: 'secondary' },
            'pending_documents': { label: 'Documents en attente', variant: 'warning' },
            'in_review': { label: 'En cours d\'examen', variant: 'default' },
            'ready_for_signature': { label: 'Prêt à signer', variant: 'success' },
            'signed': { label: 'Signé', variant: 'success' },
            'completed': { label: 'Terminé', variant: 'success' },
            'cancelled': { label: 'Annulé', variant: 'destructive' }
        };

        const config = statusConfig[status] || { label: status, variant: 'default' };
        return <Badge variant={config.variant as any}>{config.label}</Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold text-primary">
                                🏛️ Cabinet Notaire
                            </div>
                            <Badge variant="outline">Portail Client</Badge>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Bienvenue, {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-muted-foreground">
                        Suivez l'avancement de vos dossiers en temps réel
                    </p>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Dossiers Actifs
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.activeDossiers}</div>
                                <p className="text-xs text-muted-foreground">
                                    sur {stats.totalDossiers} total
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Documents en Attente
                                </CardTitle>
                                <Upload className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pendingDocuments}</div>
                                <p className="text-xs text-muted-foreground">
                                    à fournir
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Messages
                                </CardTitle>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                                <p className="text-xs text-muted-foreground">
                                    non lus
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Rendez-vous
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
                                <p className="text-xs text-muted-foreground">
                                    à venir
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Actions Requises */}
                {dossiers.some(d => d.requiresAction) && (
                    <Card className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
                                <AlertCircle className="h-5 w-5" />
                                Actions Requises
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {dossiers.filter(d => d.requiresAction).map(dossier => (
                                    <div key={dossier.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                                        <div>
                                            <p className="font-medium">{dossier.acteLabel}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Réf: {dossier.reference}
                                            </p>
                                        </div>
                                        <Button size="sm">
                                            Voir le dossier
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Dossiers List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mes Dossiers</CardTitle>
                        <CardDescription>
                            Suivez l'avancement de vos dossiers en cours
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dossiers.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                    Aucun dossier en cours
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {dossiers.map(dossier => (
                                    <div
                                        key={dossier.id}
                                        className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {dossier.acteLabel}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Réf: {dossier.reference}
                                                </p>
                                            </div>
                                            {getStatusBadge(dossier.status)}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Progression</span>
                                                <span className="font-medium">{dossier.progress}%</span>
                                            </div>
                                            <Progress value={dossier.progress} className="h-2" />
                                        </div>

                                        {dossier.currentStep && (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>Étape actuelle : {dossier.currentStep}</span>
                                            </div>
                                        )}

                                        {dossier.estimatedCompletionDate && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    Fin estimée : {new Date(dossier.estimatedCompletionDate).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                        )}

                                        <div className="mt-4 flex gap-2">
                                            <Button size="sm" variant="default">
                                                Voir les détails
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Documents
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Messages
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
