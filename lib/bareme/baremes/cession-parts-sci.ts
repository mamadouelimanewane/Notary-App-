/**
 * BARÈME - CESSION DE PARTS D'INTÉRÊTS D'UNE SCI
 */

import { BaremeTranche, CalculProvisionResult, TAUX_TVA, calculerProgressif } from '../types';

const BAREME_HONORAIRES: BaremeTranche[] = [
    { min: 0, max: 20_000_000, taux: 0.045, description: "1 à 20 Millions" },
    { min: 20_000_000, max: 80_000_000, taux: 0.03, description: "20 à 80 Millions" },
    { min: 80_000_000, max: 300_000_000, taux: 0.015, description: "80 à 300 Millions" },
    { min: 300_000_000, max: null, taux: 0.0075, description: "Plus de 300 Millions" }
];

const BAREME_MUTATION: BaremeTranche[] = [
    { min: 0, max: null, taux: 0.01, description: "1%" }
];

const FRAIS_FIXE = {
    enregistrement: 10_000,
    greffe: 12_000,
    expeditions: 50_000,
    divers: 100_000
};

export function calculerCessionPartsSCI(
    prix: number,
    valeurImmeuble: number
): CalculProvisionResult {
    if (prix <= 0) {
        throw new Error("Le prix doit être supérieur à 0");
    }

    // Honoraires sur le prix
    const { total: honoraires, details: honorairesDetail } = calculerProgressif(prix, BAREME_HONORAIRES);
    const tva = honoraires * TAUX_TVA;

    // Enregistrement (1% du prix)
    const enregistrement = FRAIS_FIXE.enregistrement;

    // Mutation (1% de la valeur de l'immeuble)
    const { total: mutation, details: mutationDetail } = calculerProgressif(valeurImmeuble, BAREME_MUTATION);

    const totalHT = honoraires + enregistrement + mutation +
        FRAIS_FIXE.greffe + FRAIS_FIXE.expeditions + FRAIS_FIXE.divers;
    const totalTTC = totalHT + tva;

    return {
        typeSociete: 'CESSION_PARTS_SCI',
        capital: prix,
        honoraires,
        tva,
        enregistrement,
        fraisFixe: {
            greffe: FRAIS_FIXE.greffe,
            expeditions: FRAIS_FIXE.expeditions,
            divers: FRAIS_FIXE.divers,
            mutationPropriete: mutation
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
            mutationDetail
        }
    };
}
