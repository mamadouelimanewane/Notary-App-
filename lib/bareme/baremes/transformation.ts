/**
 * BARÈME - TRANSFORMATION DE SOCIÉTÉ SANS AUGMENTATION DE CAPITAL
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 20_000_000, taux: 0.01, description: "0 à 20 Millions" },
    { min: 20_000_000, max: 80_000_000, taux: 0.0075, description: "20 à 80 Millions" },
    { min: 80_000_000, max: 300_000_000, taux: 0.005, description: "80 à 300 Millions" },
    { min: 300_000_000, max: 600_000_000, taux: 0.0025, description: "300 à 600 Millions" },
    { min: 600_000_000, max: 1_200_000_000, taux: 0.0015, description: "600 à 1200 Millions" },
    { min: 1_200_000_000, max: 1_500_000_000, taux: 0.001, description: "1200 à 1500 Millions" },
    { min: 1_500_000_000, max: null, taux: 0.0005, description: "Plus de 1500 Millions" }
];

const FRAIS_FIXE = {
    enregistrementMinute: 5_000,
    enregistrementAnnexe: 20_000,
    enregistrementPenalites: 5_000,
    greffe: 10_000,
    publicite: 55_000,
    expeditions: 60_000,
    divers: 59_000
};

export function calculerTransformation(
    capital: number
): CalculProvisionResult {
    if (capital <= 0) {
        throw new Error("Le capital doit être supérieur à 0");
    }

    // Honoraires
    const { total: honoraires, details: honorairesDetail } = calculerProgressif(capital, BAREME_HONORAIRES);
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
        typeSociete: 'TRANSFORMATION',
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
            honorairesDetail,
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
