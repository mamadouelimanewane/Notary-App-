/**
 * BARÈME - DATION EN PAIEMENT (10%)
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 20_000_000, taux: 0.045, description: "1 à 20 Millions" },
    { min: 20_000_000, max: 80_000_000, taux: 0.03, description: "20 à 80 Millions" },
    { min: 80_000_000, max: 300_000_000, taux: 0.015, description: "80 à 300 Millions" },
    { min: 300_000_000, max: null, taux: 0.0075, description: "Plus de 300 Millions" }
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
    droitsMutation: 20_000,
    expeditions: 80_000
};

export function calculerDationPaiement10(
    prix: number
): CalculProvisionResult {
    if (prix <= 0) {
        throw new Error("Le prix doit être supérieur à 0");
    }

    // Honoraires
    const { total: honoraires, details: honorairesDetail } = calculerProgressif(prix, BAREME_HONORAIRES);
    const tva = honoraires * TAUX_TVA;

    // Enregistrement (10% du prix)
    const enregistrement = prix * 0.10;

    // Conservation foncière (1%)
    const { total: conservationFonciere, details: conservationDetail } = calculerProgressif(
        prix,
        BAREME_CONSERVATION_FONCIERE
    );

    // Morcellement
    const { total: morcellement } = calculerProgressif(prix, BAREME_MORCELLEMENT);
    const morcellemtFinal = morcellement > 0 ? morcellement : FRAIS_FIXE.morcellement;

    const totalHT = honoraires + enregistrement + conservationFonciere +
        morcellemtFinal + FRAIS_FIXE.droitsMutation + FRAIS_FIXE.expeditions;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'DATION_PAIEMENT_10',
        capital: prix,
        honoraires,
        tva,
        enregistrement,
        fraisFixe: {
            conservationFonciere,
            expeditions: FRAIS_FIXE.expeditions
        },
        totalHT,
        totalTTC,
        details: {
            honorairesDetail,
            enregistrementDetail: [{
                tranche: "Enregistrement 10%",
                montant: prix,
                taux: 10,
                calcul: enregistrement
            }],
            mutationDetail: conservationDetail
        }
    };
}
