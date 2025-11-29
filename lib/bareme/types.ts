/**
 * TYPES COMMUNS - MODULE BARÈME
 * Types partagés pour tous les calculs de provisions
 */

export type TypeSociete =
    | 'SARL_NUMERAIRE'
    | 'SARL_AUGMENTATION'
    | 'SARL_AUGMENTATION_NATURE'
    | 'SARL_NATURE'
    | 'SCI_NUMERAIRE'
    | 'SCI_AUGMENTATION'
    | 'SCI_AUGMENTATION_NATURE'
    | 'SCI_NATURE'
    | 'SA_AUGMENTATION'
    | 'SA_CA_NUMERAIRE'
    | 'SA_AG_NUMERAIRE'
    | 'SA_NATURE'
    | 'CREDIT_HYPOTHECAIRE'
    | 'CESSION_CREANCES'
    | 'MAINLEVEE'
    | 'DISSOLUTION'
    | 'REDUCTION_CAPITAL'
    | 'TRANSFORMATION'
    | 'CESSION_PARTS_SCI'
    | 'DATION_PAIEMENT'
    | 'DATION_PAIEMENT_10'
    | 'VENTE_1'
    | 'VENTE_ADJUDICATION'
    | 'LOCATION_GERANCE'
    | 'BAIL_COMMERCIAL'
    | 'BAIL_HABITATION'
    | 'PARTAGE_COMMUNAUTE'
    | 'PARTAGE_INDIVIS'
    | 'TAXE_PLUS_VALUE';

export interface BaremeTranche {
    min: number;
    max: number | null;
    taux: number;
    description: string;
}

export interface FraisFixe {
    greffe?: number;
    publicite?: number;
    expeditions?: number;
    divers?: number;
    droitsInscription?: number;
    conservationFonciere?: number;
    declarationRegularite?: number;
    declarationSouscription?: number;
    immeuble?: number;
    mutationPropriete?: number;
}

export interface DetailTranche {
    tranche: string;
    montant: number;
    taux: number;
    calcul: number;
}

export interface CalculProvisionResult {
    typeSociete: TypeSociete;
    capital: number;
    capitalNature?: number;
    capitalNumeraire?: number;
    honoraires: number;
    tva: number;
    enregistrement: number;
    fraisFixe: FraisFixe;
    totalHT: number;
    totalTTC: number;
    details: {
        honorairesDetail: DetailTranche[];
        enregistrementDetail: DetailTranche[];
        immeubleDetail?: DetailTranche[];
        mutationDetail?: DetailTranche[];
    };
}

/**
 * TAUX TVA SÉNÉGAL
 */
export const TAUX_TVA = 0.18;

/**
 * Calcule selon un barème progressif
 */
export function calculerProgressif(
    montant: number,
    bareme: BaremeTranche[]
): { total: number; details: DetailTranche[] } {
    let total = 0;
    const details: DetailTranche[] = [];

    for (const tranche of bareme) {
        if (montant <= tranche.min) break;

        const montantTranche = tranche.max
            ? Math.min(montant, tranche.max) - tranche.min
            : montant - tranche.min;

        if (montantTranche > 0) {
            const calcul = montantTranche * tranche.taux;
            total += calcul;

            details.push({
                tranche: tranche.description,
                montant: montantTranche,
                taux: tranche.taux * 100,
                calcul: calcul
            });
        }
    }

    return { total, details };
}

/**
 * Formate un montant en FCFA
 */
export function formaterMontantFCFA(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant) + ' FCFA';
}
