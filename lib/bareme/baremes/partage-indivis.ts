/**
 * BARÈME - PARTAGE DE BIENS INDIVIS
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 10_000_000, taux: 0.03, description: "0 à 10 Millions" },
    { min: 10_000_000, max: 40_000_000, taux: 0.02, description: "10 à 40 Millions" },
    { min: 40_000_000, max: 150_000_000, taux: 0.01, description: "40 à 150 Millions" },
    { min: 150_000_000, max: null, taux: 0.005, description: "150 Millions et plus" }
];

const BAREME_CONSERVATION_FONCIERE: BaremeTranche[] = [
    { min: 0, max: null, taux: 0.01, description: "1%" }
];

const BAREME_MORCELLEMENT: BaremeTranche[] = [
    { min: 0, max: 1_500_000, taux: 0, description: "0 à 1,5 Millions" },
    { min: 1_500_000, max: 2_500_000, taux: 0, description: "1,5 à 2,5 Millions" },
    { min: 2_500_000, max: null, taux: 0, description: "Plus de 2,5 Millions" }
];

const FRAIS_FIXE = {
    morcellement: 20_000,
    droitsInscription: 20_000,
    expeditions: 80_000
};

const TAUX_SOULTE = 0.15; // 15% de la soulte

export function calculerPartageIndivis(
    montant: number,
    soulte: number = 0
): CalculProvisionResult {
    if (montant <= 0) {
        throw new Error("Le montant doit être supérieur à 0");
    }

    // Honoraires
    const { total: honoraires, details: honorairesDetail } = calculerProgressif(montant, BAREME_HONORAIRES);
    const tva = honoraires * TAUX_TVA;

    // Enregistrement (1% du montant)
    const enregistrement = montant * 0.01;

    // Soulte (15% de la soulte)
    const fraisSoulte = soulte * TAUX_SOULTE;

    // Conservation foncière (1%)
    const { total: conservationFonciere, details: conservationDetail } = calculerProgressif(
        montant,
        BAREME_CONSERVATION_FONCIERE
    );

    // Morcellement
    const { total: morcellement } = calculerProgressif(montant, BAREME_MORCELLEMENT);
    const morcellemtFinal = morcellement > 0 ? morcellement : FRAIS_FIXE.morcellement;

    const totalHT = honoraires + enregistrement + fraisSoulte + conservationFonciere +
        morcellemtFinal + FRAIS_FIXE.droitsInscription + FRAIS_FIXE.expeditions;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'PARTAGE_INDIVIS',
        capital: montant,
        honoraires,
        tva,
        enregistrement,
        fraisFixe: {
            conservationFonciere,
            droitsInscription: FRAIS_FIXE.droitsInscription,
            expeditions: FRAIS_FIXE.expeditions,
            divers: fraisSoulte
        },
        totalHT,
        totalTTC,
        details: {
            honorairesDetail,
            enregistrementDetail: [{
                tranche: "Enregistrement 1%",
                montant: montant,
                taux: 1,
                calcul: enregistrement
            }],
            mutationDetail: conservationDetail
        }
    };
}
