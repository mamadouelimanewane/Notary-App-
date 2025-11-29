/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour Echange d'Immeuble
 * Conforme au barème sénégalais
 */

export interface EchangeImmeubleInput {
    prix: number;
    soulte: number;
    conservationFonciere?: boolean;
}

export interface EchangeImmeubleResult {
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
    enregistrementSoulte: number;
    tauxEnregistrementSoulte: number;

    // Conservation foncière
    conservationFonciere: number;
    baseConservation: number;
    tauxConservation: number;

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
 * Calcule tous les frais et honoraires pour Echange d'Immeuble
 */
export function calculerEchangeImmeuble(input: EchangeImmeubleInput): EchangeImmeubleResult {
    const { prix, soulte, conservationFonciere = true } = input;

    // 1. Honoraires (barème progressif standard)
    const { total: honoraires, details: detailHonoraires } = calculerHonoraires(prix);

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Enregistrement (5% sur prix)
    const tauxEnregistrement = 5;
    const enregistrement = (prix * tauxEnregistrement) / 100;

    // 4. Enregistrement sur Soulte (15%)
    const tauxEnregistrementSoulte = 15;
    const enregistrementSoulte = (soulte * tauxEnregistrementSoulte) / 100;

    // 5. Conservation foncière (2% de prix + 14 000)
    // Note: Dans l'exemple, c'est 2% + 14 000.
    const tauxConservation = 2;
    const baseConservation = prix + 7_000; // 2% de 1 000 000 = 20 000. + 14 000 = 34 000.
    // Attendez, 2% de 1 000 000 = 20 000. Dans l'exemple, le montant est 34 000.
    // 34 000 - 20 000 = 14 000. Donc c'est 2% du prix + 14 000 fixe.
    const conservationFonciereAmount = conservationFonciere ? ((prix * tauxConservation) / 100) + 14_000 : 0;

    // 6. Droits sur mutation
    const droitsMutation = calculerDroitsMutation(prix);

    // 7. Expéditions (fixe)
    const expeditions = 60_000;

    // 8. Divers (fixe)
    const divers = 25_000;

    // Total
    const total = honoraires + tva + enregistrement + enregistrementSoulte +
        conservationFonciereAmount + droitsMutation + expeditions + divers;

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
        { label: 'SOULTE', detail: `${soulte.toLocaleString('fr-FR')} à ${tauxEnregistrementSoulte}%`, montant: enregistrementSoulte, isBold: false },
        { label: 'CONSERVATION FONCIERE', detail: `2% + 14 000`, montant: conservationFonciereAmount, isBold: false },
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
        enregistrementSoulte,
        tauxEnregistrementSoulte,
        conservationFonciere: conservationFonciereAmount,
        baseConservation: prix,
        tauxConservation,
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
export function formaterMontantEchange(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
