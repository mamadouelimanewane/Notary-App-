/**
 * BARÈME - TAXE DE PLUS-VALUE IMMOBILIÈRE
 */

import { CalculProvisionResult, TAUX_TVA } from '../types';

export function calculerTaxePlusValue(
    prixAcquisition: number,
    anneeAcquisition: number,
    prixVente: number,
    depensesTravaux: number = 0
): CalculProvisionResult {
    if (prixAcquisition <= 0 || prixVente <= 0) {
        throw new Error("Les prix doivent être supérieurs à 0");
    }

    const anneeActuelle = new Date().getFullYear();
    const dureeDetention = anneeActuelle - anneeAcquisition;

    // Calcul du taux forfaitaire basé sur la durée de détention
    // Exemple simplifié : 120 pour les biens détenus longtemps
    const tauxForfaitaire = Math.min(120, dureeDetention * 10);

    // Valeur d'acquisition actualisée
    const valeurAcquisition = prixAcquisition * (1 + tauxForfaitaire / 100);

    // Coefficient (exemple : 1.0000)
    const coefficient = 1.0000;

    // Prix de revient de l'immeuble
    const prixRevient = valeurAcquisition + depensesTravaux;

    // Plus-value brute
    const plusValueBrute = prixVente - prixRevient;

    // Taxe de plus-value (exemple : calculée sur la plus-value)
    const taxePlusValue = plusValueBrute > 0 ? plusValueBrute * 0.20 : 0; // 20% de la plus-value

    // Pas d'honoraires ni de TVA pour ce calcul fiscal
    const honoraires = 0;
    const tva = 0;
    const enregistrement = 0;

    const totalHT = taxePlusValue;
    const totalTTC = taxePlusValue;

    return {
        typeSociete: 'TAXE_PLUS_VALUE',
        capital: prixVente,
        honoraires,
        tva,
        enregistrement,
        fraisFixe: {},
        totalHT,
        totalTTC,
        details: {
            honorairesDetail: [{
                tranche: "Plus-value imposable",
                montant: plusValueBrute,
                taux: 20,
                calcul: taxePlusValue
            }],
            enregistrementDetail: [{
                tranche: "Taxe de plus-value",
                montant: plusValueBrute,
                taux: 20,
                calcul: taxePlusValue
            }]
        }
    };
}
