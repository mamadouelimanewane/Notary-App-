/**
 * Calculateur de Taxe de Plus-Value Immobilière
 * Conforme au droit sénégalais et français
 */

export interface PlusValueInput {
    // Données d'acquisition
    prixAcquisition: number;
    anneeAcquisition: number;

    // Données de cession
    prixVente: number;
    anneeCession: number;

    // Travaux et améliorations
    depensesTravaux?: number;

    // Type de bien
    typeBien: 'BAIL' | 'IMMEUBLE' | 'TERRAIN';
}

export interface PlusValueResult {
    // Valeurs calculées
    valeurAcquisition: number;
    prixRevient: number;
    plusValueBrute: number;

    // Abattements
    tauxForfaitaire: number;
    coefficient: number;
    dureeDetention: number;

    // Taxe
    plusValueImposable: number;
    tauxImposition: number;
    taxePlusValue: number;

    // Détails
    details: {
        label: string;
        valeur: number | string;
    }[];
}

/**
 * Calcule le taux forfaitaire selon la durée de détention
 */
function calculerTauxForfaitaire(dureeDetention: number): number {
    // Barème sénégalais/français simplifié
    if (dureeDetention < 5) return 0;
    if (dureeDetention < 10) return 60;
    if (dureeDetention < 15) return 80;
    if (dureeDetention < 20) return 100;
    if (dureeDetention < 25) return 110;
    if (dureeDetention >= 30) return 120;
    return 120;
}

/**
 * Calcule la taxe de plus-value immobilière
 */
export function calculerPlusValueImmobiliere(input: PlusValueInput): PlusValueResult {
    const {
        prixAcquisition,
        anneeAcquisition,
        prixVente,
        anneeCession,
        depensesTravaux = 0,
        typeBien
    } = input;

    // 1. Durée de détention
    const dureeDetention = anneeCession - anneeAcquisition;

    // 2. Taux forfaitaire
    const tauxForfaitaire = calculerTauxForfaitaire(dureeDetention);

    // 3. Valeur d'acquisition actualisée
    const valeurAcquisition = prixAcquisition * (1 + tauxForfaitaire / 100);

    // 4. Prix de revient (valeur acquisition + travaux)
    const prixRevient = valeurAcquisition + depensesTravaux;

    // 5. Plus-value brute
    const plusValueBrute = prixVente - prixRevient;

    // 6. Coefficient d'abattement (exemple: 1.0 = pas d'abattement)
    const coefficient = 1.0000;

    // 7. Plus-value imposable
    const plusValueImposable = plusValueBrute * coefficient;

    // 8. Taux d'imposition (15% au Sénégal pour les plus-values immobilières)
    const tauxImposition = 15;

    // 9. Taxe de plus-value
    const taxePlusValue = (plusValueImposable * tauxImposition) / 100;

    // Détails du calcul
    const details = [
        { label: 'Prix d\'acquisition', valeur: prixAcquisition },
        { label: 'Année d\'acquisition', valeur: anneeAcquisition },
        { label: 'Durée de détention', valeur: `${dureeDetention} ans` },
        { label: 'Taux forfaitaire', valeur: tauxForfaitaire },
        { label: 'Valeur d\'acquisition actualisée', valeur: valeurAcquisition },
        { label: 'Dépenses pour travaux', valeur: depensesTravaux },
        { label: 'Prix de revient', valeur: prixRevient },
        { label: 'Prix de vente', valeur: prixVente },
        { label: 'Plus-value brute', valeur: plusValueBrute },
        { label: 'Coefficient', valeur: coefficient },
        { label: 'Plus-value imposable', valeur: plusValueImposable },
        { label: 'Taux d\'imposition', valeur: `${tauxImposition}%` },
        { label: 'TAXE DE PLUS-VALUE', valeur: taxePlusValue },
    ];

    return {
        valeurAcquisition,
        prixRevient,
        plusValueBrute,
        tauxForfaitaire,
        coefficient,
        dureeDetention,
        plusValueImposable,
        tauxImposition,
        taxePlusValue,
        details
    };
}

/**
 * Formate un montant en FCFA
 */
export function formaterMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
