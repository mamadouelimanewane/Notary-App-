/**
 * BARÈME - BAIL À USAGE COMMERCIAL
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 20_000_000, taux: 0.045, description: "1 à 20 Millions" },
    { min: 20_000_000, max: 80_000_000, taux: 0.03, description: "20 à 80 Millions" },
    { min: 80_000_000, max: 300_000_000, taux: 0.015, description: "80 à 300 Millions" },
    { min: 300_000_000, max: null, taux: 0.0075, description: "Plus de 300 Millions" }
];

const FRAIS_FIXE = {
    enregistrement: 62_500, // 5% de la base
    publicite: 30_000,
    divers: 30_000
};

export function calculerBailCommercial(
    loyerMensuel: number,
    dureeMois: number
): CalculProvisionResult {
    if (loyerMensuel <= 0 || dureeMois <= 0) {
        throw new Error("Le loyer mensuel et la durée doivent être supérieurs à 0");
    }

    // Base de calcul = loyer mensuel × durée en mois
    const base = loyerMensuel * dureeMois;

    // Honoraires
    const { total: honoraires, details: honorairesDetail } = calculerProgressif(base, BAREME_HONORAIRES);
    const tva = honoraires * TAUX_TVA;

    // Enregistrement (5% de la base)
    const enregistrement = base * 0.05;

    const totalHT = honoraires + enregistrement +
        FRAIS_FIXE.publicite + FRAIS_FIXE.divers;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'BAIL_COMMERCIAL',
        capital: base,
        honoraires,
        tva,
        enregistrement,
        fraisFixe: {
            publicite: FRAIS_FIXE.publicite,
            divers: FRAIS_FIXE.divers
        },
        totalHT,
        totalTTC,
        details: {
            honorairesDetail,
            enregistrementDetail: [{
                tranche: "Enregistrement 5%",
                montant: base,
                taux: 5,
                calcul: enregistrement
            }]
        }
    };
}
