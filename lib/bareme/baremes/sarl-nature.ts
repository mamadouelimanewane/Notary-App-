/**
 * BARÈME - SARL CONSTITUTION AVEC APPORT EN NATURE
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 20_000_000, taux: 0.045, description: "0 à 20 Millions" },
    { min: 20_000_000, max: 80_000_000, taux: 0.03, description: "20 à 80 Millions" },
    { min: 80_000_000, max: 300_000_000, taux: 0.015, description: "80 à 300 Millions" },
    { min: 300_000_000, max: null, taux: 0.0075, description: "Plus de 300 Millions" }
];

const BAREME_ENREGISTREMENT: BaremeTranche[] = [
    { min: 0, max: 100_000_000, taux: 0, description: "De 0 à 100 Millions" },
    { min: 100_000_000, max: null, taux: 0.01, description: "Plus de 100 Millions" }
];

const BAREME_CONSERVATION_FONCIERE: BaremeTranche[] = [
    { min: 0, max: 1_500_000, taux: 0, description: "0 à 1,5 Millions" },
    { min: 1_500_000, max: 2_500_000, taux: 0, description: "1,5 à 2,5 Millions" },
    { min: 2_500_000, max: null, taux: 0, description: "Plus de 2,5 Millions" }
];

const FRAIS_FIXE = {
    greffe: 54_500,
    publicite: 55_000,
    expeditions: 60_000,
    declarationRegularite: 59_000,
    droitsInscription: 20_000,
    conservationFonciere: 1_007_500, // OUI + 7500
    immeuble: 1_000_000 // 1% de la valeur de l'apport (100M)
};

export function calculerSARLNature(
    capitalTotal: number,
    capitalNature: number,
    capitalNumeraire: number
): CalculProvisionResult {
    if (capitalTotal <= 0) {
        throw new Error("Le capital doit être supérieur à 0");
    }

    if (capitalNature + capitalNumeraire !== capitalTotal) {
        throw new Error("La somme des apports doit égaler le capital total");
    }

    // Honoraires sur le capital total
    const { total: honoraires, details: honorairesDetail } = calculerProgressif(capitalTotal, BAREME_HONORAIRES);
    const tva = honoraires * TAUX_TVA;

    // Enregistrement sur capital > 100M
    const { total: enregistrement, details: enregistrementDetail } = calculerProgressif(capitalTotal, BAREME_ENREGISTREMENT);

    // Immeuble (1% de la valeur de l'apport en nature)
    const immeuble = capitalNature * 0.01;
    const immeubleDetail = [{
        tranche: "Valeur de l'apport",
        montant: capitalNature,
        taux: 1,
        calcul: immeuble
    }];

    // Conservation foncière (fixe selon barème)
    const { total: conservationFonciere, details: conservationDetail } = calculerProgressif(
        capitalNature,
        BAREME_CONSERVATION_FONCIERE
    );

    const totalHT = honoraires + enregistrement + immeuble +
        FRAIS_FIXE.greffe + FRAIS_FIXE.publicite + FRAIS_FIXE.expeditions +
        FRAIS_FIXE.declarationRegularite + FRAIS_FIXE.droitsInscription +
        FRAIS_FIXE.conservationFonciere;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'SARL_NATURE',
        capital: capitalTotal,
        capitalNature,
        capitalNumeraire,
        honoraires,
        tva,
        enregistrement,
        fraisFixe: {
            ...FRAIS_FIXE,
            immeuble
        },
        totalHT,
        totalTTC,
        details: {
            honorairesDetail,
            enregistrementDetail,
            immeubleDetail,
            mutationDetail: conservationDetail
        }
    };
}
