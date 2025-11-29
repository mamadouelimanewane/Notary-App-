'use client';

import Link from 'next/link';
import { Calculator, TrendingUp, Home, Building, Key, Gift, RefreshCw, FileArchive, Lock, Split, XCircle, ScrollText, Building2, Landmark } from 'lucide-react';

export default function CalculateursPage() {
    const calculateurs = [
        {
            id: 'plus-value',
            title: 'Taxe de Plus-Value Immobilière',
            description: 'Calcul de la taxe sur les plus-values de cession de biens immobiliers',
            icon: TrendingUp,
            href: '/dashboard/calculateurs/plus-value',
            color: 'blue'
        },
        {
            id: 'bareme-attribution',
            title: 'Frais et Honoraires - Attribution',
            description: 'Calcul des frais notariaux pour attribution par partage (COHAG)',
            icon: Calculator,
            href: '/dashboard/calculateurs/bareme-attribution',
            color: 'purple'
        },
        {
            id: 'cession-parts',
            title: 'Cession de Parts Sociales',
            description: 'Calcul des frais pour cession de parts de SARL, SAS, SA',
            icon: Building,
            href: '/dashboard/calculateurs/cession-parts',
            color: 'green'
        },
        {
            id: 'cession-fonds',
            title: 'Cession de Fonds de Commerce',
            description: 'Calcul des frais pour cession de fonds de commerce',
            icon: Calculator,
            href: '/dashboard/calculateurs/cession-fonds',
            color: 'orange'
        },
        {
            id: 'vente-1pct',
            title: 'Vente Immobilière (1%)',
            description: 'Calcul des frais pour vente avec enregistrement à 1%',
            icon: Home,
            href: '/dashboard/calculateurs/vente-1pct',
            color: 'blue'
        },
        {
            id: 'vente-10pct',
            title: 'Vente Immobilière (10%)',
            description: 'Calcul des frais pour vente avec enregistrement à 10% (standard)',
            icon: Building,
            href: '/dashboard/calculateurs/vente-10pct',
            color: 'purple'
        },
        {
            id: 'rgt-copro',
            title: 'RGT Copropriété',
            description: 'Registre Général des Titres - Immatriculation copropriété',
            icon: Building,
            href: '/dashboard/calculateurs/rgt-copro',
            color: 'teal'
        },
        {
            id: 'permis-occuper',
            title: 'Permis d\'Occuper',
            description: 'Calcul des frais pour permis d\'occuper',
            icon: Key,
            href: '/dashboard/calculateurs/permis-occuper',
            color: 'orange'
        },
        {
            id: 'donation',
            title: 'Donation',
            description: 'Mutation à titre gratuit entre vifs (entre époux ou autre)',
            icon: Gift,
            href: '/dashboard/calculateurs/donation',
            color: 'pink'
        },
        {
            id: 'partage-immeuble',
            title: 'Partage d\'Immeuble',
            description: 'Calcul des frais pour partage avec soulte et morcellement',
            icon: Calculator,
            href: '/dashboard/calculateurs/partage-immeuble',
            color: 'cyan'
        },
        {
            id: 'echange-immeuble',
            title: 'Echange d\'Immeuble',
            description: 'Calcul des frais pour échange avec soulte',
            icon: RefreshCw,
            href: '/dashboard/calculateurs/echange-immeuble',
            color: 'indigo'
        },
        {
            id: 'acte-depot',
            title: 'Acte de Dépôt (PV)',
            description: 'Frais de dépôt de pièces avec calcul de pénalités',
            icon: FileArchive,
            href: '/dashboard/calculateurs/acte-depot',
            color: 'slate'
        },
        {
            id: 'mandat-sequestre',
            title: 'Mandat du Séquestre',
            description: 'Calcul des frais pour mandat de séquestre',
            icon: Lock,
            href: '/dashboard/calculateurs/mandat-sequestre',
            color: 'green'
        },
        {
            id: 'attribution-partage',
            title: 'Attribution Partage',
            description: 'Calcul des frais pour attribution partage avec morcellement',
            icon: Split,
            href: '/dashboard/calculateurs/attribution-partage',
            color: 'blue'
        },
        {
            id: 'dissolution-societe',
            title: 'Dissolution de Société',
            description: 'Calcul des frais pour dissolution de société',
            icon: XCircle,
            href: '/dashboard/calculateurs/dissolution-societe',
            color: 'red'
        },
        {
            id: 'declaration-succession',
            title: 'Déclaration de Succession',
            description: 'Calcul des frais de succession (Actif Brut/Net, Droits)',
            icon: ScrollText,
            href: '/dashboard/calculateurs/declaration-succession',
            color: 'amber'
        },
        {
            id: 'constitution-sarl',
            title: 'Constitution S.A.R.L',
            description: 'Frais de constitution SARL avec apport numéraire',
            icon: Building2,
            href: '/dashboard/calculateurs/constitution-sarl',
            color: 'cyan'
        },
        {
            id: 'constitution-sci',
            title: 'Constitution S.C.I',
            description: 'Frais de constitution SCI avec apport numéraire',
            icon: Home,
            href: '/dashboard/calculateurs/constitution-sci',
            color: 'emerald'
        },
        {
            id: 'constitution-sa',
            title: 'Constitution S.A.',
            description: 'Frais de constitution SA avec conseil d\'administration',
            icon: Landmark,
            href: '/dashboard/calculateurs/constitution-sa',
            color: 'indigo'
        },
        {
            id: 'constitution-sarl-nature',
            title: 'Constitution S.A.R.L (Nature)',
            description: 'Constitution SARL avec apport immobilier',
            icon: Building,
            href: '/dashboard/calculateurs/constitution-sarl-nature',
            color: 'teal'
        },
        {
            id: 'droits-enregistrement',
            title: 'Droits d\'Enregistrement',
            description: 'Calcul des droits d\'enregistrement pour les actes notariés',
            icon: Building,
            href: '/dashboard/calculateurs/droits-enregistrement',
            color: 'green'
        },
        {
            id: 'frais-notaire',
            title: 'Frais de Notaire',
            description: 'Estimation des frais et honoraires notariaux',
            icon: Calculator,
            href: '/dashboard/calculateurs/frais-notaire',
            color: 'purple'
        },
        {
            id: 'pret-immobilier',
            title: 'Prêt Immobilier',
            description: 'Simulation de prêt immobilier et calcul des mensualités',
            icon: Home,
            href: '/dashboard/calculateurs/pret-immobilier',
            color: 'orange'
        }
    ];

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
        teal: 'bg-teal-100 text-teal-600',
        pink: 'bg-pink-100 text-pink-600'
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Calculator className="h-8 w-8 text-blue-600" />
                    Calculateurs Notariaux
                </h1>
                <p className="text-muted-foreground mt-1">Outils de calcul pour les actes notariés</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {calculateurs.map((calc) => (
                    <Link
                        key={calc.id}
                        href={calc.href}
                        className="group rounded-xl border bg-white p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${colorClasses[calc.color as keyof typeof colorClasses] || 'bg-gray-100 text-gray-600'} group-hover:scale-110 transition-transform`}>
                                <calc.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                                    {calc.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {calc.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="rounded-xl border bg-blue-50 p-6">
                <h3 className="font-semibold mb-3">ℹ️ À propos des calculateurs</h3>
                <div className="space-y-2 text-sm text-slate-700">
                    <p>• Les calculs sont conformes à la réglementation sénégalaise en vigueur</p>
                    <p>• Les résultats sont donnés à titre indicatif et doivent être vérifiés</p>
                    <p>• Vous pouvez exporter les résultats en PDF pour vos dossiers</p>
                </div>
            </div>
        </div>
    );
}
