/**
 * BARÈME - SA CONSTITUTION AVEC ADMINISTRATEUR GÉNÉRAL
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 20_000_000, taux: 0.02, description: "0 à 20 Millions" },
    { min: 20_000_000, max: 80_000_000, taux: 0.015, description: "20 à 80 Millions" },
    { min: 80_000_000, max: 300_000_000, taux: 0.01, description: "80 à 300 Millions" },
    { min: 300_000_000, max: 600_000_000, taux: 0.005, description: "300 à 600 Millions" },
    { min: 600_000_000, max: 1_200_000_000, taux: 0.003, description: "600 à 1200 Millions" },
    { min: 1_200_000_000, max: 1_500_000_000, taux: 0.002, description: "1200 à 1500 Millions" },
    { min: 1_500_000_000, max: null, taux: 0.001, description: "Plus de 1500 Millions" }
];

const BAREME_ENREGISTREMENT: BaremeTranche[] = [
    { min: 0, max: 100_000_000, taux: 0, description: "De 0 à 100 Millions" },
    { min: 100_000_000, max: null, taux: 0.01, description: "Plus de 100 Millions" }
];

const FRAIS_FIXE = {
    greffe: 41_000,
    publicite: 85_000,
    expeditions: 100_000,
    divers: 100_000
};

export function calculerSAAdminGeneral(capital: number): CalculProvisionResult {
    if (capital <= 0) {
        throw new Error("Le capital doit être supérieur à 0");
    }

    const { total: honoraires, details: honorairesDetail } = calculerProgressif(capital, BAREME_HONORAIRES);
    const tva = honoraires * TAUX_TVA;
    const { total: enregistrement, details: enregistrementDetail } = calculerProgressif(capital, BAREME_ENREGISTREMENT);

    const totalHT = honoraires + enregistrement + FRAIS_FIXE.greffe + FRAIS_FIXE.publicite + FRAIS_FIXE.expeditions + FRAIS_FIXE.divers;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'SA_AG_NUMERAIRE',
        capital,
        honoraires,
        tva,
        enregistrement,
        fraisFixe: FRAIS_FIXE,
        totalHT,
        totalTTC,
        details: {
            honorairesDetail,
            enregistrementDetail
        }
    };
}
