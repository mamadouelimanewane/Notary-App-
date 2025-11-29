/**
 * BARÈME - OUVERTURE DE CRÉDIT AVEC NANTISSEMENT ET/OU AFFECTATION HYPOTHÉCAIRE
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 10_000_000, taux: 0.03, description: "0 à 10 Millions" },
    { min: 10_000_000, max: 40_000_000, taux: 0.02, description: "10 à 40 Millions" },
    { min: 40_000_000, max: 150_000_000, taux: 0.01, description: "40 à 150 Millions" },
    { min: 150_000_000, max: null, taux: 0.005, description: "Plus de 150 Millions" }
];

const BAREME_GREFFE: BaremeTranche[] = [
    { min: 0, max: 3_000_000, taux: 0.05, description: "De 0 à 3 Millions" },
    { min: 3_000_000, max: 5_000_000, taux: 0.015, description: "De 3 à 5 Millions" },
    { min: 5_000_000, max: null, taux: 0.01, description: "Plus de 5 Millions" }
];

const BAREME_CONSERVATION_FONCIERE: BaremeTranche[] = [
    { min: 0, max: null, taux: 0.01, description: "1%" }
];

const FRAIS_FIXE = {
    enregistrement: 5_000,
    droitsInscription: 20_000,
    expeditions: 50_000,
    divers: 50_000
};

export function calculerCreditHypothecaire(
    montantCredit: number
): CalculProvisionResult {
    if (montantCredit <= 0) {
        throw new Error("Le montant du crédit doit être supérieur à 0");
    }

    // Honoraires
    const { total: honoraires, details: honorairesDetail } = calculerProgressif(montantCredit, BAREME_HONORAIRES);
    const tva = honoraires * TAUX_TVA;

    // Greffe (barème progressif)
    const { total: greffe, details: greffeDetail } = calculerProgressif(montantCredit, BAREME_GREFFE);

    // Conservation foncière (1%)
    const { total: conservationFonciere, details: conservationDetail } = calculerProgressif(
        montantCredit,
        BAREME_CONSERVATION_FONCIERE
    );

    const totalHT = honoraires + greffe + conservationFonciere +
        FRAIS_FIXE.enregistrement + FRAIS_FIXE.droitsInscription +
        FRAIS_FIXE.expeditions + FRAIS_FIXE.divers;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'CREDIT_HYPOTHECAIRE',
        capital: montantCredit,
        honoraires,
        tva,
        enregistrement: FRAIS_FIXE.enregistrement,
        fraisFixe: {
            greffe,
            conservationFonciere,
            droitsInscription: FRAIS_FIXE.droitsInscription,
            expeditions: FRAIS_FIXE.expeditions,
            divers: FRAIS_FIXE.divers
        },
        totalHT,
        totalTTC,
        details: {
            honorairesDetail,
            enregistrementDetail: greffeDetail,
            mutationDetail: conservationDetail
        }
    };
}
