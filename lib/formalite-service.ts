// Service de gestion des formalités

import { db } from './db';
import {
    FormaliteType,
    FormaliteStatus,
    FormalitePriorite,
    type Formalite,
    type FormaliteDocument,
    type FormaliteHistorique,
    type FormaliteStats,
    type FormaliteFilters,
    type FormaliteFrais
} from '@/types/formalite-types';
import {
    FORMALITE_RULES,
    BAREME_FRAIS,
    DELAIS_REGLEMENTAIRES,
    ORGANISMES_DESTINATAIRES,
    FORMALITE_LABELS
} from './formalite-rules';
import { v4 as uuidv4 } from 'uuid';

export class FormaliteService {

    /**
     * Créer une nouvelle formalité
     */
    static createFormalite(data: Partial<Formalite>, userId: string): Formalite {
        const now = new Date().toISOString();

        const formalite: Formalite = {
            id: uuidv4(),
            acteId: data.acteId!,
            dossierId: data.dossierId!,
            type: data.type!,
            statut: FormaliteStatus.EN_ATTENTE,
            priorite: data.priorite || FormalitePriorite.NORMALE,
            titre: data.titre || FORMALITE_LABELS[data.type!],
            description: data.description,
            reference: data.reference,
            dateCreation: now,
            dateEcheance: data.dateEcheance,
            organisme: data.organisme || ORGANISMES_DESTINATAIRES[data.type!],
            contactOrganisme: data.contactOrganisme,
            frais: data.frais || this.calculateFrais(data.type!, 0),
            detailsSpecifiques: data.detailsSpecifiques || {},
            responsable: data.responsable,
            observations: data.observations,
            creePar: userId
        };

        db.addFormalite(formalite);

        // Créer l'entrée d'historique
        this.addHistorique(formalite.id, 'CREATION', undefined, FormaliteStatus.EN_ATTENTE, 'Formalité créée', userId);

        return formalite;
    }

    /**
     * Générer automatiquement les formalités pour un acte
     */
    static async generateFormalitesForActe(
        acteId: string,
        dossierId: string,
        acteType: string,
        valeurActe: number = 0,
        userId: string
    ): Promise<Formalite[]> {
        const rule = FORMALITE_RULES.find(r => r.acteType === acteType);

        if (!rule) {
            return [];
        }

        const formalites: Formalite[] = [];
        const now = new Date();

        for (const formaliteRequise of rule.formalitesRequises) {
            const dateEcheance = new Date(now);
            dateEcheance.setDate(dateEcheance.getDate() + formaliteRequise.delaiJours);

            const frais = this.calculateFrais(formaliteRequise.type, valeurActe);

            const formalite = this.createFormalite({
                acteId,
                dossierId,
                type: formaliteRequise.type,
                priorite: formaliteRequise.priorite,
                titre: FORMALITE_LABELS[formaliteRequise.type],
                dateEcheance: dateEcheance.toISOString(),
                frais,
                organisme: ORGANISMES_DESTINATAIRES[formaliteRequise.type]
            }, userId);

            formalites.push(formalite);
        }

        return formalites;
    }

    /**
     * Calculer les frais d'une formalité
     */
    static calculateFrais(type: FormaliteType, valeurBase: number = 0): FormaliteFrais {
        const bareme = BAREME_FRAIS[type];

        const montantBase = bareme.montantBase;
        const taxe = valeurBase * bareme.tauxPourcentage;
        const fraisGestion = bareme.fraisGestion;
        const total = montantBase + taxe + fraisGestion;

        return {
            montantBase,
            taxe,
            fraisGestion,
            total,
            devise: 'FCFA'
        };
    }

    /**
     * Mettre à jour le statut d'une formalité
     */
    static updateStatus(
        formaliteId: string,
        nouveauStatut: FormaliteStatus,
        commentaire: string = '',
        userId: string
    ): Formalite | null {
        const formalite = db.getFormalite(formaliteId);

        if (!formalite) {
            return null;
        }

        const ancienStatut = formalite.statut;
        const updates: Partial<Formalite> = {
            statut: nouveauStatut,
            modifiePar: userId
        };

        if (nouveauStatut === FormaliteStatus.COMPLETEE) {
            updates.dateCompletee = new Date().toISOString();
        }

        const updated = db.updateFormalite(formaliteId, updates);

        if (updated) {
            this.addHistorique(
                formaliteId,
                'CHANGEMENT_STATUT',
                ancienStatut,
                nouveauStatut,
                commentaire,
                userId
            );
        }

        return updated;
    }

    /**
     * Ajouter un document à une formalité
     */
    static attachDocument(
        formaliteId: string,
        nom: string,
        type: string,
        url: string,
        taille: number,
        userId: string
    ): FormaliteDocument {
        const document: FormaliteDocument = {
            id: uuidv4(),
            formaliteId,
            nom,
            type,
            url,
            taille,
            uploadePar: userId,
            dateUpload: new Date().toISOString()
        };

        db.addFormaliteDocument(document);

        this.addHistorique(
            formaliteId,
            'AJOUT_DOCUMENT',
            undefined,
            undefined,
            `Document ajouté : ${nom}`,
            userId
        );

        return document;
    }

    /**
     * Ajouter une entrée d'historique
     */
    static addHistorique(
        formaliteId: string,
        action: string,
        ancienStatut?: FormaliteStatus,
        nouveauStatut?: FormaliteStatus,
        commentaire?: string,
        userId: string = 'system'
    ): FormaliteHistorique {
        const historique: FormaliteHistorique = {
            id: uuidv4(),
            formaliteId,
            action,
            ancienStatut,
            nouveauStatut,
            commentaire,
            effectuePar: userId,
            dateAction: new Date().toISOString()
        };

        db.addFormaliteHistorique(historique);
        return historique;
    }

    /**
     * Obtenir les statistiques des formalités
     */
    static getStats(filters?: FormaliteFilters): FormaliteStats {
        let formalites = db.formalites;

        // Appliquer les filtres
        if (filters) {
            formalites = this.applyFilters(formalites, filters);
        }

        const now = new Date();
        const enRetard = formalites.filter(f =>
            f.dateEcheance &&
            new Date(f.dateEcheance) < now &&
            f.statut !== FormaliteStatus.COMPLETEE &&
            f.statut !== FormaliteStatus.ANNULEE
        );

        const montantTotalFrais = formalites.reduce((sum, f) => sum + f.frais.total, 0);

        return {
            total: formalites.length,
            enAttente: formalites.filter(f => f.statut === FormaliteStatus.EN_ATTENTE).length,
            enCours: formalites.filter(f => f.statut === FormaliteStatus.EN_COURS).length,
            completees: formalites.filter(f => f.statut === FormaliteStatus.COMPLETEE).length,
            rejetees: formalites.filter(f => f.statut === FormaliteStatus.REJETEE).length,
            enRetard: enRetard.length,
            montantTotalFrais
        };
    }

    /**
     * Filtrer les formalités
     */
    static applyFilters(formalites: Formalite[], filters: FormaliteFilters): Formalite[] {
        let filtered = [...formalites];

        if (filters.statut && filters.statut.length > 0) {
            filtered = filtered.filter(f => filters.statut!.includes(f.statut));
        }

        if (filters.type && filters.type.length > 0) {
            filtered = filtered.filter(f => filters.type!.includes(f.type));
        }

        if (filters.priorite && filters.priorite.length > 0) {
            filtered = filtered.filter(f => filters.priorite!.includes(f.priorite));
        }

        if (filters.acteId) {
            filtered = filtered.filter(f => f.acteId === filters.acteId);
        }

        if (filters.dossierId) {
            filtered = filtered.filter(f => f.dossierId === filters.dossierId);
        }

        if (filters.responsable) {
            filtered = filtered.filter(f => f.responsable === filters.responsable);
        }

        if (filters.dateDebut) {
            filtered = filtered.filter(f => f.dateCreation >= filters.dateDebut!);
        }

        if (filters.dateFin) {
            filtered = filtered.filter(f => f.dateCreation <= filters.dateFin!);
        }

        if (filters.enRetard) {
            const now = new Date();
            filtered = filtered.filter(f =>
                f.dateEcheance &&
                new Date(f.dateEcheance) < now &&
                f.statut !== FormaliteStatus.COMPLETEE &&
                f.statut !== FormaliteStatus.ANNULEE
            );
        }

        return filtered;
    }

    /**
     * Vérifier si une formalité est en retard
     */
    static isEnRetard(formalite: Formalite): boolean {
        if (!formalite.dateEcheance) return false;
        if (formalite.statut === FormaliteStatus.COMPLETEE) return false;
        if (formalite.statut === FormaliteStatus.ANNULEE) return false;

        return new Date(formalite.dateEcheance) < new Date();
    }

    /**
     * Obtenir le nombre de jours restants avant l'échéance
     */
    static getJoursRestants(formalite: Formalite): number | null {
        if (!formalite.dateEcheance) return null;

        const now = new Date();
        const echeance = new Date(formalite.dateEcheance);
        const diff = echeance.getTime() - now.getTime();
        const jours = Math.ceil(diff / (1000 * 60 * 60 * 24));

        return jours;
    }
}
