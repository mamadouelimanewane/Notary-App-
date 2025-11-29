/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour Vente Immobilière (10%)
 * Conforme au barème sénégalais - Taux standard
 */

export interface Vente10Input {
    prix: number;
    typeMorcellement?: 'OUI' | 'NON';
    conservationFonciere?: boolean;
}

export interface Vente10Result {
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
    enregistrement: number;
    tauxEnregistrement: number;
    conservationFonciere: number;
    morcellement: number;
    droitsMutation: number;
    expeditions: number;
    fraisGeneraux: number;

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
 * Calcule les honoraires selon le barème progressif
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
 * Calcule tous les frais et honoraires pour vente immobilière (10%)
 */
export function calculerVente10(input: Vente10Input): Vente10Result {
    const { prix, typeMorcellement = 'OUI', conservationFonciere = true } = input;

    // 1. Honoraires (barème progressif standard)
    const { total: honoraires, details: detailHonoraires } = calculerHonoraires(prix);

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Enregistrement (10% du prix - taux standard)
    const tauxEnregistrement = 10;
    const enregistrement = (prix * tauxEnregistrement) / 100;

    // 4. Conservation foncière (1% du prix)
    const conservationFonciereAmount = conservationFonciere ? (prix * 1) / 100 : 0;

    // 5. Morcellement
    const morcellement = typeMorcellement === 'OUI' ? 22_500 : 0;

    // 6. Droits sur mutation
    const droitsMutation = calculerDroitsMutation(prix);

    // 7. Expéditions (fixe)
    const expeditions = 50_000;

    // 8. Frais généraux (fixe)
    const fraisGeneraux = 50_000;

    // Total
    const total = honoraires + tva + enregistrement + conservationFonciereAmount +
        morcellement + droitsMutation + expeditions + fraisGeneraux;

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
        { label: 'CONSERVATION FONCIERE', detail: '1%', montant: conservationFonciereAmount, isBold: false },
        { label: 'MORCELLEMENT', detail: typeMorcellement, montant: morcellement, isBold: false },
    ];

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
        { label: 'FRAIS GENERAUX', montant: fraisGeneraux, isBold: false },
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
        morcellement,
        droitsMutation,
        expeditions,
        fraisGeneraux,
        total,
        lignes
    };
}

/**
 * Formate un montant en FCFA
 */
export function formaterMontantVente10(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
