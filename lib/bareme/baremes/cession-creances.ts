/**
 * BARÈME - CESSION DE CRÉANCES ET DE GARANTIES
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 10_000_000, taux: 0.03, description: "0 à 10 Millions" },
    { min: 10_000_000, max: 40_000_000, taux: 0.02, description: "10 à 40 Millions" },
    { min: 40_000_000, max: 150_000_000, taux: 0.01, description: "40 à 150 Millions" },
    { min: 150_000_000, max: null, taux: 0.005, description: "Plus de 150 Millions" }
];

const BAREME_ENREGISTREMENT: BaremeTranche[] = [
    { min: 0, max: null, taux: 0.01, description: "1%" }
];

const BAREME_CONSERVATION_FONCIERE: BaremeTranche[] = [
    { min: 0, max: 1_500_000, taux: 0, description: "0 à 1,5 Millions" },
    { min: 1_500_000, max: 2_500_000, taux: 0, description: "1,5 à 2,5 Millions" },
    { min: 2_500_000, max: null, taux: 0.01, description: "Plus de 2,5 Millions" }
];

const FRAIS_FIXE = {
    droitsInscription: 20_000,
    expeditions: 50_000,
    divers: 50_000
};

export function calculerCessionCreances(
    montantCession: number
): CalculProvisionResult {
    if (montantCession <= 0) {
        throw new Error("Le montant de la cession doit être supérieur à 0");
    }

    // Honoraires
    const { total: honoraires, details: honorairesDetail } = calculerProgressif(montantCession, BAREME_HONORAIRES);
    const tva = honoraires * TAUX_TVA;

    // Enregistrement (1%)
    const { total: enregistrement, details: enregistrementDetail } = calculerProgressif(montantCession, BAREME_ENREGISTREMENT);

    // Conservation foncière (1% selon barème)
    const { total: conservationFonciere, details: conservationDetail } = calculerProgressif(
        montantCession,
        BAREME_CONSERVATION_FONCIERE
    );

    const totalHT = honoraires + enregistrement + conservationFonciere +
        FRAIS_FIXE.droitsInscription + FRAIS_FIXE.expeditions + FRAIS_FIXE.divers;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'CESSION_CREANCES',
        capital: montantCession,
        honoraires,
        tva,
        enregistrement,
        fraisFixe: {
            conservationFonciere,
            droitsInscription: FRAIS_FIXE.droitsInscription,
            expeditions: FRAIS_FIXE.expeditions,
            divers: FRAIS_FIXE.divers
        },
        totalHT,
        totalTTC,
        details: {
            honorairesDetail,
            enregistrementDetail,
            mutationDetail: conservationDetail
        }
    };
}
