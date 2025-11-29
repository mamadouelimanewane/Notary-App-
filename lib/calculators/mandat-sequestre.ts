/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour Mandat du Séquestre
 * Conforme au barème sénégalais
 */

export interface MandatSequestreInput {
    montant: number;
}

export interface MandatSequestreResult {
    // Honoraires
    honoraires: number;
    detailHonoraires: {
        tranche: string;
        taux: string;
        montant: number;
    }[];

    // Taxes et frais
    tva: number;
    tauxTVA: number;

    // Autres frais
    divers: number;

    // Total
    total: number;

    // Détails pour affichage
    lignes: {
        label: string;
        detail?: string;
        montant: number;
        isBold?: boolean;
    }[];
}

/**
 * Calcule les honoraires selon le barème spécifique Mandat Séquestre
 */
function calculerHonoraires(montant: number): { total: number; details: any[] } {
    const tranches = [
        { min: 0, max: 20_000_000, taux: 1.50, label: '0 à 20 millions' },
        { min: 20_000_000, max: 80_000_000, taux: 1.00, label: '20 à 80 millions' },
        { min: 80_000_000, max: 300_000_000, taux: 0.50, label: '80 à 300 millions' },
        { min: 300_000_000, max: Infinity, taux: 0.25, label: 'Plus de 300 Millions' }
    ];

    let total = 0;
    const details = [];

    for (const tranche of tranches) {
        if (montant > tranche.min) {
            const montantTranche = Math.min(montant, tranche.max) - tranche.min;
            const honorairesTranche = (montantTranche * tranche.taux) / 100;

            if (honorairesTranche > 0) {
                total += honorairesTranche;
                details.push({
                    tranche: tranche.label,
                    taux: `${tranche.taux.toFixed(2)}%`,
                    montant: honorairesTranche
                });
            }
        }
    }

    return { total, details };
}

/**
 * Calcule tous les frais et honoraires pour Mandat du Séquestre
 */
export function calculerMandatSequestre(input: MandatSequestreInput): MandatSequestreResult {
    const { montant } = input;

    // 1. Honoraires (barème spécifique)
    const { total: honoraires, details: detailHonoraires } = calculerHonoraires(montant);

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Divers (fixe)
    const divers = 10_000;

    // Total
    const total = honoraires + tva + divers;

    // Construction des lignes pour affichage
    const lignes = [
        { label: 'MONTANT', montant: montant, isBold: true },
        ...detailHonoraires.map(d => ({
            label: d.tranche,
            detail: `TAUX ${d.taux}`,
            montant: d.montant,
            isBold: false
        })),
        { label: 'HONORAIRES', montant: honoraires, isBold: true },
        { label: 'TVA', detail: `${tauxTVA}%`, montant: tva, isBold: false },
        { label: 'DIVERS', montant: divers, isBold: false },
        { label: 'TOTAL', montant: total, isBold: true }
    ];

    return {
        honoraires,
        detailHonoraires,
        tva,
        tauxTVA,
        divers,
        total,
        lignes
    };
}

/**
 * Formate un montant en FCFA
 */
export function formaterMontantSequestre(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
