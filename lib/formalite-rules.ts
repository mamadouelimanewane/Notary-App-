// Règles métier pour la génération automatique des formalités selon le type d'acte

import { FormaliteType, FormalitePriorite, type FormaliteRule } from '@/types/formalite-types';

// Mapping des types d'actes vers les formalités obligatoires
export const FORMALITE_RULES: FormaliteRule[] = [
    // ACTES IMMOBILIERS
    {
        acteType: 'VENTE',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 15,
                priorite: FormalitePriorite.HAUTE,
                obligatoire: true
            },
            {
                type: FormaliteType.PUBLICITE_FONCIERE,
                delaiJours: 30,
                priorite: FormalitePriorite.HAUTE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'COMPROMIS',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 10,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'HYPOTHEQUE',
        formalitesRequises: [
            {
                type: FormaliteType.INSCRIPTION_HYPOTHEQUE,
                delaiJours: 15,
                priorite: FormalitePriorite.HAUTE,
                obligatoire: true
            },
            {
                type: FormaliteType.PUBLICITE_FONCIERE,
                delaiJours: 30,
                priorite: FormalitePriorite.HAUTE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'MAINLEVEE',
        formalitesRequises: [
            {
                type: FormaliteType.MAINLEVEE_HYPOTHEQUE,
                delaiJours: 15,
                priorite: FormalitePriorite.HAUTE,
                obligatoire: true
            },
            {
                type: FormaliteType.PUBLICITE_FONCIERE,
                delaiJours: 30,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'VEFA',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 15,
                priorite: FormalitePriorite.HAUTE,
                obligatoire: true
            },
            {
                type: FormaliteType.PUBLICITE_FONCIERE,
                delaiJours: 30,
                priorite: FormalitePriorite.HAUTE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'SERVITUDE',
        formalitesRequises: [
            {
                type: FormaliteType.PUBLICITE_FONCIERE,
                delaiJours: 30,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'BAIL_EMPHYTEOTIQUE',
        formalitesRequises: [
            {
                type: FormaliteType.PUBLICITE_FONCIERE,
                delaiJours: 30,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'DEMEMBREMENT',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 15,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: true
            },
            {
                type: FormaliteType.PUBLICITE_FONCIERE,
                delaiJours: 30,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: true
            }
        ]
    },

    // ACTES DE FAMILLE
    {
        acteType: 'DONATION_SIMPLE',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 30,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'DONATION_EPOUX',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 30,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'DONATION_PARTAGE',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 30,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'PARTAGE_SUCCESSION',
        formalitesRequises: [
            {
                type: FormaliteType.DECLARATION_SUCCESSION,
                delaiJours: 180,
                priorite: FormalitePriorite.HAUTE,
                obligatoire: true
            },
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 30,
                priorite: FormalitePriorite.HAUTE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'CONTRAT_MARIAGE',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 30,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: false
            }
        ]
    },

    // ACTES D'AFFAIRES
    {
        acteType: 'SCI',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 15,
                priorite: FormalitePriorite.HAUTE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'CESSION_PARTS',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 30,
                priorite: FormalitePriorite.HAUTE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'BAIL_COMMERCIAL',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 30,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: true
            }
        ]
    },
    {
        acteType: 'BAIL_PROFESSIONNEL',
        formalitesRequises: [
            {
                type: FormaliteType.ENREGISTREMENT_FISCAL,
                delaiJours: 30,
                priorite: FormalitePriorite.NORMALE,
                obligatoire: true
            }
        ]
    }
];

// Barèmes des frais de formalités (en FCFA)
export const BAREME_FRAIS = {
    [FormaliteType.ENREGISTREMENT_FISCAL]: {
        montantBase: 50000,
        tauxPourcentage: 0.05, // 5% de la valeur de l'acte
        fraisGestion: 5000
    },
    [FormaliteType.PUBLICITE_FONCIERE]: {
        montantBase: 75000,
        tauxPourcentage: 0.01, // 1% de la valeur
        fraisGestion: 10000
    },
    [FormaliteType.INSCRIPTION_HYPOTHEQUE]: {
        montantBase: 100000,
        tauxPourcentage: 0.015, // 1.5% du montant garanti
        fraisGestion: 15000
    },
    [FormaliteType.MAINLEVEE_HYPOTHEQUE]: {
        montantBase: 50000,
        tauxPourcentage: 0,
        fraisGestion: 10000
    },
    [FormaliteType.RADIATION_HYPOTHEQUE]: {
        montantBase: 50000,
        tauxPourcentage: 0,
        fraisGestion: 10000
    },
    [FormaliteType.DECLARATION_SUCCESSION]: {
        montantBase: 150000,
        tauxPourcentage: 0.10, // 10% de la valeur de la succession
        fraisGestion: 20000
    },
    [FormaliteType.NOTIFICATION_PREEMPTION]: {
        montantBase: 25000,
        tauxPourcentage: 0,
        fraisGestion: 5000
    },
    [FormaliteType.AUTRE]: {
        montantBase: 30000,
        tauxPourcentage: 0,
        fraisGestion: 5000
    }
};

// Délais réglementaires par défaut (en jours)
export const DELAIS_REGLEMENTAIRES = {
    [FormaliteType.ENREGISTREMENT_FISCAL]: 30,
    [FormaliteType.PUBLICITE_FONCIERE]: 30,
    [FormaliteType.INSCRIPTION_HYPOTHEQUE]: 15,
    [FormaliteType.MAINLEVEE_HYPOTHEQUE]: 15,
    [FormaliteType.RADIATION_HYPOTHEQUE]: 15,
    [FormaliteType.DECLARATION_SUCCESSION]: 180,
    [FormaliteType.NOTIFICATION_PREEMPTION]: 60,
    [FormaliteType.AUTRE]: 30
};

// Organismes destinataires
export const ORGANISMES_DESTINATAIRES = {
    [FormaliteType.ENREGISTREMENT_FISCAL]: 'Direction Générale des Impôts et des Domaines',
    [FormaliteType.PUBLICITE_FONCIERE]: 'Service de la Publicité Foncière',
    [FormaliteType.INSCRIPTION_HYPOTHEQUE]: 'Conservation des Hypothèques',
    [FormaliteType.MAINLEVEE_HYPOTHEQUE]: 'Conservation des Hypothèques',
    [FormaliteType.RADIATION_HYPOTHEQUE]: 'Conservation des Hypothèques',
    [FormaliteType.DECLARATION_SUCCESSION]: 'Direction Générale des Impôts',
    [FormaliteType.NOTIFICATION_PREEMPTION]: 'Commune / Collectivité Territoriale',
    [FormaliteType.AUTRE]: 'À définir'
};

// Libellés des types de formalités
export const FORMALITE_LABELS = {
    [FormaliteType.ENREGISTREMENT_FISCAL]: 'Enregistrement Fiscal',
    [FormaliteType.PUBLICITE_FONCIERE]: 'Publicité Foncière',
    [FormaliteType.INSCRIPTION_HYPOTHEQUE]: 'Inscription d\'Hypothèque',
    [FormaliteType.MAINLEVEE_HYPOTHEQUE]: 'Mainlevée d\'Hypothèque',
    [FormaliteType.RADIATION_HYPOTHEQUE]: 'Radiation d\'Hypothèque',
    [FormaliteType.DECLARATION_SUCCESSION]: 'Déclaration de Succession',
    [FormaliteType.NOTIFICATION_PREEMPTION]: 'Notification de Préemption',
    [FormaliteType.AUTRE]: 'Autre Formalité'
};
