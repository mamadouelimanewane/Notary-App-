/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour Attribution Partage
 * Conforme au barème sénégalais
 */

export interface AttributionPartageInput {
    prix: number;
    morcellement?: boolean;
    nombreParcelles?: number;
    conservationFonciere?: boolean;
}

export interface AttributionPartageResult {
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
    tauxEnregistrement: number;

    // Conservation foncière
    conservationFonciere: number;
    baseConservation: number;

    // Morcellement
    morcellement: number;
    coutParParcelle: number;

    // Droits mutation
    droitsMutation: number;

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
 * Calcule les honoraires selon le barème progressif standard
 */
function calculerHonoraires(prix: number): { total: number; details: any[] } {
    const tranches = [
        { min: 0, max: 20_000_000, taux: 4.5, label: '1 à 20 millions' },
        { min: 20_000_000, max: 80_000_000, taux: 3, label: '20 à 80 millions' },
        { min: 80_000_000, max: 300_000_000, taux: 1.5, label: '80 à 300 millions' },
        { min: 300_000_000, max: Infinity, taux: 0.75, label: 'Plus de 300 millions' }
    ];

    let total = 0;
    const details = [];

    for (const tranche of tranches) {
        if (prix > tranche.min) {
            const montantTranche = Math.min(prix, tranche.max) - tranche.min;
            const honorairesTranche = (montantTranche * tranche.taux) / 100;

            if (honorairesTranche > 0) {
                total += honorairesTranche;
                details.push({
                    tranche: tranche.label,
                    taux: `${tranche.taux}%`,
                    montant: honorairesTranche
                });
            }
        }
    }

    return { total, details };
}

/**
 * Calcule les droits sur mutation selon barème
 */
function calculerDroitsMutation(prix: number): number {
    if (prix <= 1_500_000) return 0;
    if (prix <= 2_500_000) return 0;
    if (prix > 2_500_000) return 20_000;
    return 0;
}

/**
 * Calcule tous les frais et honoraires pour Attribution Partage
 */
export function calculerAttributionPartage(input: AttributionPartageInput): AttributionPartageResult {
    const { prix, morcellement = true, nombreParcelles = 1, conservationFonciere = true } = input;

    // 1. Honoraires (barème progressif standard)
    const { total: honoraires, details: detailHonoraires } = calculerHonoraires(prix);

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Enregistrement (5% sur prix)
    const tauxEnregistrement = 5;
    const enregistrement = (prix * tauxEnregistrement) / 100;

    // 4. Conservation foncière (1% de prix + 6 500)
    const baseConservation = prix + 6_500;
    const conservationFonciereAmount = conservationFonciere ? (baseConservation * 1) / 100 : 0;

    // 5. Morcellement (20 000 par parcelle)
    const coutParParcelle = 20_000;
    const fraisMorcellement = morcellement ? nombreParcelles * coutParParcelle : 0;

    // 6. Droits sur mutation
    const droitsMutation = calculerDroitsMutation(prix);

    // 7. Expéditions (fixe)
    const expeditions = 50_000;

    // 8. Divers (fixe)
    const divers = 50_000;

    // Total
    const total = honoraires + tva + enregistrement + conservationFonciereAmount +
        fraisMorcellement + droitsMutation + expeditions + divers;

    // Construction des lignes pour affichage
    const lignes = [
        { label: 'PRIX', montant: prix, isBold: true },
        ...detailHonoraires.map(d => ({
            label: d.tranche,
            detail: `TAUX ${d.taux}`,
            montant: d.montant,
            isBold: false
        })),
        { label: 'HONORAIRES', montant: honoraires, isBold: true },
        { label: 'TVA', detail: `${tauxTVA}%`, montant: tva, isBold: false },
        { label: 'ENREGISTREMENT', detail: `${tauxEnregistrement}%`, montant: enregistrement, isBold: false },
        { label: 'CONSERVATION FONCIERE', detail: `1% de ${baseConservation.toLocaleString('fr-FR')}`, montant: conservationFonciereAmount, isBold: false },
    ];

    if (morcellement) {
        lignes.push({ label: 'MORCELLEMENT', detail: `${nombreParcelles} parcelle(s)`, montant: fraisMorcellement, isBold: false });
    }

    // Droits sur mutation (détail)
    if (prix <= 1_500_000) {
        lignes.push({ label: '0 à 1,5 Millions', montant: 0, isBold: false });
    }
    if (prix > 1_500_000 && prix <= 2_500_000) {
        lignes.push({ label: '1,5 à 2,5 Millions', montant: 0, isBold: false });
    }
    if (prix > 2_500_000) {
        lignes.push({ label: 'Plus de 2,5 Millions', montant: 20_000, isBold: false });
    }
    lignes.push({ label: 'DROITS SUR MUTATION', montant: droitsMutation, isBold: true });

    lignes.push(
        { label: 'EXPEDITIONS', montant: expeditions, isBold: false },
        { label: 'DIVERS', montant: divers, isBold: false },
        { label: 'TOTAL', montant: total, isBold: true }
    );

    return {
        honoraires,
        detailHonoraires,
        tva,
        tauxTVA,
        enregistrement,
        tauxEnregistrement,
        conservationFonciere: conservationFonciereAmount,
        baseConservation,
        morcellement: fraisMorcellement,
        coutParParcelle,
        droitsMutation,
        expeditions,
        divers,
        total,
        lignes
    };
}

/**
 * Formate un montant en FCFA
 */
export function formaterMontantAttribution(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
