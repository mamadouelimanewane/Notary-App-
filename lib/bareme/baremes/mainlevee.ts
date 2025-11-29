/**
 * BARÈME - MAINLEVÉE (Levée d'hypothèque/garantie)
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 20_000_000, taux: 0.0075, description: "0 à 20 Millions" },
    { min: 20_000_000, max: 80_000_000, taux: 0.005, description: "20 à 80 Millions" },
    { min: 80_000_000, max: 300_000_000, taux: 0.0025, description: "80 à 300 Millions" },
    { min: 300_000_000, max: null, taux: 0.00125, description: "Plus de 300 Millions" }
];

const BAREME_CONSERVATION_FONCIERE: BaremeTranche[] = [
    { min: 0, max: null, taux: 0.01, description: "1%" }
];

const FRAIS_FIXE = {
    enregistrement: 5_000,
    expeditions: 45_000,
    divers: 50_000
};

export function calculerMainlevee(
    montant: number
): CalculProvisionResult {
    if (montant <= 0) {
        throw new Error("Le montant doit être supérieur à 0");
    }

    // Honoraires
    const { total: honoraires, details: honorairesDetail } = calculerProgressif(montant, BAREME_HONORAIRES);
    const tva = honoraires * TAUX_TVA;

    // Conservation foncière (1%)
    const { total: conservationFonciere, details: conservationDetail } = calculerProgressif(
        montant,
        BAREME_CONSERVATION_FONCIERE
    );

    const totalHT = honoraires + conservationFonciere +
        FRAIS_FIXE.enregistrement + FRAIS_FIXE.expeditions + FRAIS_FIXE.divers;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'MAINLEVEE',
        capital: montant,
        honoraires,
        tva,
        enregistrement: FRAIS_FIXE.enregistrement,
        fraisFixe: {
            conservationFonciere,
            expeditions: FRAIS_FIXE.expeditions,
            divers: FRAIS_FIXE.divers
        },
        totalHT,
        totalTTC,
        details: {
            honorairesDetail,
            enregistrementDetail: [],
            mutationDetail: conservationDetail
        }
    };
}
