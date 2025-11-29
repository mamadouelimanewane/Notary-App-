/**
 * BARÈME - PARTAGE DE COMMUNAUTÉ
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 10_000_000, taux: 0.04, description: "1 à 10 Millions" },
    { min: 10_000_000, max: 40_000_000, taux: 0.03, description: "10 à 40 Millions" },
    { min: 40_000_000, max: 150_000_000, taux: 0.015, description: "40 à 150 Millions" },
    { min: 150_000_000, max: null, taux: 0.0075, description: "Plus de 150 Millions" }
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
    enregistrement: 450_000, // 1% du prix
    morcellement: 20_000,
    droitsMutation: 20_000,
    divers: 60_000
};

export function calculerPartageCommunaute(
    prix: number,
    nombreTitres: number = 0
): CalculProvisionResult {
    if (prix <= 0) {
        throw new Error("Le prix doit être supérieur à 0");
    }

    // Honoraires
    const { total: honoraires, details: honorairesDetail } = calculerProgressif(prix, BAREME_HONORAIRES);
    const tva = honoraires * TAUX_TVA;

    // Enregistrement (1% du prix)
    const enregistrement = prix * 0.01;

    // Conservation foncière (1%)
    const { total: conservationFonciere, details: conservationDetail } = calculerProgressif(
        prix,
        BAREME_CONSERVATION_FONCIERE
    );

    // Morcellement
    const { total: morcellement } = calculerProgressif(prix, BAREME_MORCELLEMENT);
    const morcellemtFinal = morcellement > 0 ? morcellement : FRAIS_FIXE.morcellement;

    const totalHT = honoraires + enregistrement + conservationFonciere +
        morcellemtFinal + FRAIS_FIXE.droitsMutation + FRAIS_FIXE.divers;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'PARTAGE_COMMUNAUTE',
        capital: prix,
        honoraires,
        tva,
        enregistrement,
        fraisFixe: {
            conservationFonciere,
            divers: FRAIS_FIXE.divers
        },
        totalHT,
        totalTTC,
        details: {
            honorairesDetail,
            enregistrementDetail: [{
                tranche: "Enregistrement 1%",
                montant: prix,
                taux: 1,
                calcul: enregistrement
            }],
            mutationDetail: conservationDetail
        }
    };
}
