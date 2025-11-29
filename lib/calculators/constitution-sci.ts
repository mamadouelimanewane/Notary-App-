/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour Constitution S.C.I avec Apport en Numéraires
 * Conforme au barème sénégalais
 */

export interface ConstitutionSCIInput {
    capital: number;
}

export interface ConstitutionSCIResult {
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

    // Enregistrement
    enregistrement: number;
    detailEnregistrement: string;

    // Autres frais
    expeditions: number;
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
 * Calcule les honoraires selon le barème spécifique Constitution SCI (identique SARL)
 */
function calculerHonoraires(capital: number): { total: number; details: any[] } {
    const tranches = [
        { min: 0, max: 20_000_000, taux: 2.00, label: '0 à 20 Millions' },
        { min: 20_000_000, max: 80_000_000, taux: 1.50, label: '20 à 80 Millions' },
        { min: 80_000_000, max: 300_000_000, taux: 1.00, label: '80 à 300 Millions' },
        { min: 300_000_000, max: 600_000_000, taux: 0.50, label: '300 à 600 Millions' },
        { min: 600_000_000, max: 1_200_000_000, taux: 0.30, label: '600 à 1200 Millions' },
        { min: 1_200_000_000, max: 1_500_000_000, taux: 0.20, label: '1200 à 1500 Millions' },
        { min: 1_500_000_000, max: Infinity, taux: 0.10, label: 'Plus de 1500 Millions' }
    ];

    let total = 0;
    const details = [];

    for (const tranche of tranches) {
        if (capital > tranche.min) {
            const montantTranche = Math.min(capital, tranche.max) - tranche.min;
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
 * Calcule l'enregistrement
 * Règle : 25 000 jusqu'à 100M, puis 1% sur le surplus
 */
function calculerEnregistrement(capital: number): { montant: number; detail: string } {
    if (capital <= 100_000_000) {
        return { montant: 25_000, detail: 'Forfait (0 à 100 Millions)' };
    } else {
        const surplus = capital - 100_000_000;
        const montantSurplus = (surplus * 1) / 100;
        return {
            montant: 25_000 + montantSurplus,
            detail: `25 000 + 1% sur surplus de ${(surplus).toLocaleString('fr-FR')}`
        };
    }
}

/**
 * Calcule tous les frais et honoraires pour Constitution SCI
 */
export function calculerConstitutionSCI(input: ConstitutionSCIInput): ConstitutionSCIResult {
    const { capital } = input;

    // 1. Honoraires
    const { total: honoraires, details: detailHonoraires } = calculerHonoraires(capital);

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Enregistrement
    const { montant: enregistrement, detail: detailEnregistrement } = calculerEnregistrement(capital);

    // 4. Frais divers
    const expeditions = 60_000;
    const divers = 0;

    // Total
    const total = honoraires + tva + enregistrement + expeditions + divers;

    // Construction des lignes pour affichage
    const lignes = [
        { label: 'CAPITAL', montant: capital, isBold: true },
        ...detailHonoraires.map(d => ({
            label: d.tranche,
            detail: `TAUX ${d.taux}`,
            montant: d.montant,
            isBold: false
        })),
        { label: 'HONORAIRES', montant: honoraires, isBold: true },
        { label: 'TVA', detail: `${tauxTVA}%`, montant: tva, isBold: false },
        { label: 'ENREGISTREMENT', detail: detailEnregistrement, montant: enregistrement, isBold: false },
        { label: 'EXPEDITIONS', montant: expeditions, isBold: false },
        { label: 'DIVERS', montant: divers, isBold: false },
        { label: 'TOTAL', montant: total, isBold: true }
    ];

    return {
        honoraires,
        detailHonoraires,
        tva,
        tauxTVA,
        enregistrement,
        detailEnregistrement,
        expeditions,
        divers,
        total,
        lignes
    };
}

/**
 * Formate un montant en FCFA
 */
export function formaterMontantSCI(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
