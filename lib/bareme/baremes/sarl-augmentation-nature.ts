/**
 * BARÈME - SARL AUGMENTATION DE CAPITAL EN NATURE
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 20_000_000, taux: 0.045, description: "0 à 20 Millions" },
    { min: 20_000_000, max: 80_000_000, taux: 0.03, description: "20 à 80 Millions" },
    { min: 80_000_000, max: 300_000_000, taux: 0.015, description: "80 à 300 Millions" },
    { min: 300_000_000, max: null, taux: 0.0075, description: "Plus de 300 Millions" }
];

const BAREME_ENREGISTREMENT_NUMERAIRE: BaremeTranche[] = [
    { min: 0, max: 100_000_000, taux: 0, description: "De 0 à 100 Millions" },
    { min: 100_000_000, max: null, taux: 0.01, description: "Plus de 100 Millions" }
];

const BAREME_ENREGISTREMENT_NATURE: BaremeTranche[] = [
    { min: 0, max: 100_000_000, taux: 0.03, description: "De 0 à 100 Millions" },
    { min: 100_000_000, max: null, taux: 0.03, description: "Plus de 100 Millions" }
];

const BAREME_CONSERVATION_FONCIERE: BaremeTranche[] = [
    { min: 0, max: 1_500_000, taux: 0, description: "0 à 1,5 Millions" },
    { min: 1_500_000, max: 2_500_000, taux: 0, description: "1,5 à 2,5 Millions" },
    { min: 2_500_000, max: null, taux: 0.01, description: "Plus de 2,5 Millions" }
];

const FRAIS_FIXE = {
    greffe: 43_160,
    publicite: 85_000,
    expeditions: 100_000,
    divers: 50_000,
    droitsInscription: 20_000
};

export function calculerSARLAugmentationNature(
    ancienCapital: number,
    nouveauCapital: number,
    augmentationNumeraire: number,
    augmentationNature: number
): CalculProvisionResult {
    if (nouveauCapital <= ancienCapital) {
        throw new Error("Le nouveau capital doit être supérieur à l'ancien capital");
    }

    const augmentationTotal = nouveauCapital - ancienCapital;

    if (augmentationNumeraire + augmentationNature !== augmentationTotal) {
        throw new Error("La somme des augmentations doit égaler l'augmentation totale");
    }

    // Honoraires sur l'augmentation totale
    const { total: honoraires, details: honorairesDetail } = calculerProgressif(augmentationTotal, BAREME_HONORAIRES);
    const tva = honoraires * TAUX_TVA;

    // Enregistrement numéraire
    const { total: enregistrementNumeraire } = calculerProgressif(augmentationNumeraire, BAREME_ENREGISTREMENT_NUMERAIRE);

    // Enregistrement nature (3%)
    const { total: enregistrementNature, details: enregistrementNatureDetail } = calculerProgressif(augmentationNature, BAREME_ENREGISTREMENT_NATURE);

    const enregistrement = enregistrementNumeraire + enregistrementNature;

    // Conservation foncière (1% selon barème)
    const { total: conservationFonciere, details: conservationDetail } = calculerProgressif(
        augmentationNature,
        BAREME_CONSERVATION_FONCIERE
    );

    const totalHT = honoraires + enregistrement + conservationFonciere +
        FRAIS_FIXE.greffe + FRAIS_FIXE.publicite + FRAIS_FIXE.expeditions +
        FRAIS_FIXE.divers + FRAIS_FIXE.droitsInscription;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'SARL_AUGMENTATION_NATURE',
        capital: augmentationTotal,
        capitalNature: augmentationNature,
        capitalNumeraire: augmentationNumeraire,
        honoraires,
        tva,
        enregistrement,
        fraisFixe: {
            ...FRAIS_FIXE,
            conservationFonciere
        },
        totalHT,
        totalTTC,
        details: {
            honorairesDetail,
            enregistrementDetail: enregistrementNatureDetail,
            mutationDetail: conservationDetail
        }
    };
}
