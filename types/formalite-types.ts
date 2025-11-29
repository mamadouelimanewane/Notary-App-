// Types pour le module Formalités

export enum FormaliteType {
    ENREGISTREMENT_FISCAL = 'ENREGISTREMENT_FISCAL',
    PUBLICITE_FONCIERE = 'PUBLICITE_FONCIERE',
    INSCRIPTION_HYPOTHEQUE = 'INSCRIPTION_HYPOTHEQUE',
    MAINLEVEE_HYPOTHEQUE = 'MAINLEVEE_HYPOTHEQUE',
    RADIATION_HYPOTHEQUE = 'RADIATION_HYPOTHEQUE',
    DECLARATION_SUCCESSION = 'DECLARATION_SUCCESSION',
    NOTIFICATION_PREEMPTION = 'NOTIFICATION_PREEMPTION',
    AUTRE = 'AUTRE'
}

export enum FormaliteStatus {
    EN_ATTENTE = 'EN_ATTENTE',
    EN_COURS = 'EN_COURS',
    COMPLETEE = 'COMPLETEE',
    REJETEE = 'REJETEE',
    ANNULEE = 'ANNULEE'
}

export enum FormalitePriorite {
    BASSE = 'BASSE',
    NORMALE = 'NORMALE',
    HAUTE = 'HAUTE',
    URGENTE = 'URGENTE'
}

export interface FormaliteFrais {
    montantBase: number;
    taxe: number;
    fraisGestion: number;
    total: number;
    devise: string;
}

export interface FormaliteDocument {
    id: string;
    formaliteId: string;
    nom: string;
    type: string;
    url: string;
    taille: number;
    uploadePar: string;
    dateUpload: string;
}

export interface FormaliteHistorique {
    id: string;
    formaliteId: string;
    action: string;
    ancienStatut?: FormaliteStatus;
    nouveauStatut?: FormaliteStatus;
    commentaire?: string;
    effectuePar: string;
    dateAction: string;
}

export interface Formalite {
    id: string;
    acteId: string;
    dossierId: string;
    type: FormaliteType;
    statut: FormaliteStatus;
    priorite: FormalitePriorite;

    // Informations générales
    titre: string;
    description?: string;
    reference?: string;

    // Dates
    dateCreation: string;
    dateEcheance?: string;
    dateCompletee?: string;

    // Organisme destinataire
    organisme?: string;
    contactOrganisme?: string;

    // Frais
    frais: FormaliteFrais;

    // Informations spécifiques selon le type
    detailsSpecifiques?: {
        // Pour PUBLICITE_FONCIERE
        numeroDepot?: string;
        volumeFeuillet?: string;

        // Pour INSCRIPTION_HYPOTHEQUE
        montantGaranti?: number;
        rangHypotheque?: string;

        // Pour ENREGISTREMENT_FISCAL
        numeroEnregistrement?: string;
        droitsPercus?: number;

        // Champs génériques
        [key: string]: any;
    };

    // Suivi
    responsable?: string;
    observations?: string;

    // Métadonnées
    creePar: string;
    modifiePar?: string;
    dateModification?: string;
}

export interface FormaliteStats {
    total: number;
    enAttente: number;
    enCours: number;
    completees: number;
    rejetees: number;
    enRetard: number;
    montantTotalFrais: number;
}

export interface FormaliteFilters {
    statut?: FormaliteStatus[];
    type?: FormaliteType[];
    priorite?: FormalitePriorite[];
    acteId?: string;
    dossierId?: string;
    dateDebut?: string;
    dateFin?: string;
    responsable?: string;
    enRetard?: boolean;
}

// Règles de génération automatique des formalités selon le type d'acte
export interface FormaliteRule {
    acteType: string;
    formalitesRequises: {
        type: FormaliteType;
        delaiJours: number;
        priorite: FormalitePriorite;
        obligatoire: boolean;
    }[];
}
