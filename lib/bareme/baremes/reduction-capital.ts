/**
 * BARÈME - RÉDUCTION DE CAPITAL
 */

import { CalculProvisionResult, TAUX_TVA } from '../types';

const HONORAIRES_FIXE = 20_000;

const FRAIS_FIXE = {
    enregistrementMinute: 5_000,
    enregistrementAnnexe: 20_000,
    enregistrementPenalites: 15_000,
    greffe: 10_000,
    publicite: 55_000,
    expeditions: 60_000,
    divers: 25_000
};

export function calculerReductionCapital(
    capital: number
): CalculProvisionResult {
    if (capital <= 0) {
        throw new Error("Le capital doit être supérieur à 0");
    }

    // Honoraires fixes
    const honoraires = HONORAIRES_FIXE;
    const tva = honoraires * TAUX_TVA;

    // Enregistrement total
    const enregistrement = FRAIS_FIXE.enregistrementMinute +
        FRAIS_FIXE.enregistrementAnnexe +
        FRAIS_FIXE.enregistrementPenalites;

    const totalHT = honoraires + enregistrement +
        FRAIS_FIXE.greffe + FRAIS_FIXE.publicite +
        FRAIS_FIXE.expeditions + FRAIS_FIXE.divers;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'REDUCTION_CAPITAL',
        capital,
        honoraires,
        tva,
        enregistrement,
        fraisFixe: {
            greffe: FRAIS_FIXE.greffe,
            publicite: FRAIS_FIXE.publicite,
            expeditions: FRAIS_FIXE.expeditions,
            divers: FRAIS_FIXE.divers
        },
        totalHT,
        totalTTC,
        details: {
            honorairesDetail: [{
                tranche: "Droit fixe",
                montant: capital,
                taux: 0,
                calcul: HONORAIRES_FIXE
            }],
            enregistrementDetail: [
                {
                    tranche: "Minute",
                    montant: 0,
                    taux: 0,
                    calcul: FRAIS_FIXE.enregistrementMinute
                },
                {
                    tranche: "Annexe (10%)",
                    montant: 0,
                    taux: 10,
                    calcul: FRAIS_FIXE.enregistrementAnnexe
                },
                {
                    tranche: "Pénalités",
                    montant: 0,
                    taux: 0,
                    calcul: FRAIS_FIXE.enregistrementPenalites
                }
            ]
        }
    };
}
