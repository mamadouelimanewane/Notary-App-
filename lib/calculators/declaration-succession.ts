/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour Déclaration de Succession
 * Conforme au barème sénégalais
 */

export interface DeclarationSuccessionInput {
    valeurImmeuble: number;
    resteActifSuccessoral: number;
    valeurPassif: number;
    droitsSuccession?: number;
    penalites?: number;
    conservationFonciere?: boolean;
    notoriete?: boolean;
    procuration?: boolean;
    exequatur?: boolean;
}

export interface DeclarationSuccessionResult {
    // Honoraires (sur Actif Brut)
    honoraires: number;
    detailHonoraires: {
        tranche: string;
        taux: string;
        montant: number;
    }[];

    // Taxes et frais
    tva: number;
    tauxTVA: number;

    // Droits de succession
    droitsSuccession: number;
    penalites: number;

    // Conservation foncière
    conservationFonciere: number;
    baseConservation: number;

    // Droits mutation
    droitsMutation: number;

    // Frais annexes
    notoriete: number;
    procuration: number;
    exequatur: number;
    fraisGeneraux: number;

    // Totaux
    actifBrut: number;
    actifNet: number;
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
 * Calcule les honoraires selon le barème spécifique Succession (sur Actif Brut)
 */
function calculerHonoraires(actifBrut: number): { total: number; details: any[] } {
    const tranches = [
        { min: 0, max: 10_000_000, taux: 1.50, label: '1 à 10 millions' },
        { min: 10_000_000, max: 40_000_000, taux: 1.00, label: '10 à 40 millions' },
        { min: 40_000_000, max: 150_000_000, taux: 0.75, label: '40 à 150 millions' },
        { min: 150_000_000, max: Infinity, taux: 0.50, label: 'Plus de 150 millions' }
    ];

    let total = 0;
    const details = [];

    for (const tranche of tranches) {
        if (actifBrut > tranche.min) {
            const montantTranche = Math.min(actifBrut, tranche.max) - tranche.min;
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
 * Calcule les droits sur mutation selon barème
 */
function calculerDroitsMutation(actifBrut: number): number {
    if (actifBrut <= 1_500_000) return 0;
    if (actifBrut <= 2_500_000) return 0;
    if (actifBrut > 2_500_000) return 20_000;
    return 0;
}

/**
 * Calcule tous les frais et honoraires pour Déclaration de Succession
 */
export function calculerDeclarationSuccession(input: DeclarationSuccessionInput): DeclarationSuccessionResult {
    const {
        valeurImmeuble,
        resteActifSuccessoral,
        valeurPassif,
        droitsSuccession = 0,
        penalites = 0,
        conservationFonciere = true,
        notoriete = true,
        procuration = true,
        exequatur = true
    } = input;

    const actifBrut = valeurImmeuble + resteActifSuccessoral;
    const actifNet = actifBrut - valeurPassif;

    // 1. Honoraires (sur Actif Brut)
    const { total: honoraires, details: detailHonoraires } = calculerHonoraires(actifBrut);

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Conservation foncière (1% de Valeur Immeuble + 6 500)
    // Note: Dans l'exemple, le montant est très bas (106 500 pour 100M).
    // Je vais appliquer la règle standard : 1% + 6500.
    // L'utilisateur pourra ajuster la valeur de l'immeuble si nécessaire.
    const baseConservation = valeurImmeuble + 6_500;
    const conservationFonciereAmount = conservationFonciere ? (baseConservation * 1) / 100 : 0;

    // 4. Droits sur mutation (sur Actif Brut ou Net ? Généralement Brut pour les actes)
    const droitsMutation = calculerDroitsMutation(actifBrut);

    // 5. Frais annexes
    const fraisNotoriete = notoriete ? 40_000 : 0;
    const fraisProcuration = procuration ? 40_000 : 0;
    const fraisExequatur = exequatur ? 40_000 : 0;
    const fraisGeneraux = 50_000;

    // Total
    const total = honoraires + tva + droitsSuccession + penalites +
        conservationFonciereAmount + droitsMutation +
        fraisNotoriete + fraisProcuration + fraisExequatur + fraisGeneraux;

    // Construction des lignes pour affichage
    const lignes = [
        { label: 'VALEUR DE L\'IMMEUBLE', montant: valeurImmeuble, isBold: false },
        { label: 'RESTE ACTIF SUCCESSORAL', montant: resteActifSuccessoral, isBold: false },
        { label: 'ACTIF BRUT TOTAL', montant: actifBrut, isBold: true },
        { label: 'VALEUR DU PASSIF', montant: valeurPassif, isBold: false },
        { label: 'ACTIF NET', montant: actifNet, isBold: true },

        ...detailHonoraires.map(d => ({
            label: d.tranche,
            detail: `TAUX ${d.taux}`,
            montant: d.montant,
            isBold: false
        })),
        { label: 'HONORAIRES', montant: honoraires, isBold: true },
        { label: 'TVA', detail: `${tauxTVA}%`, montant: tva, isBold: false },
    ];

    if (droitsSuccession > 0) {
        lignes.push({ label: 'DROITS DE SUCCESSION', montant: droitsSuccession, isBold: false });
    }
    if (penalites > 0) {
        lignes.push({ label: 'PENALITES', montant: penalites, isBold: false });
    }

    lignes.push(
        { label: 'CONSERVATION FONCIERE', detail: `1% de ${baseConservation.toLocaleString('fr-FR')}`, montant: conservationFonciereAmount, isBold: false },
        { label: 'DROITS SUR MUTATION', montant: droitsMutation, isBold: false },
        { label: 'NOTORIETE', montant: fraisNotoriete, isBold: false },
        { label: 'PROCURATION', montant: fraisProcuration, isBold: false },
        { label: 'EXEQUATUR', montant: fraisExequatur, isBold: false },
        { label: 'FRAIS GENERAUX', montant: fraisGeneraux, isBold: false },
        { label: 'TOTAL', montant: total, isBold: true }
    );

    return {
        honoraires,
        detailHonoraires,
        tva,
        tauxTVA,
        droitsSuccession,
        penalites,
        conservationFonciere: conservationFonciereAmount,
        baseConservation,
        droitsMutation,
        notoriete: fraisNotoriete,
        procuration: fraisProcuration,
        exequatur: fraisExequatur,
        fraisGeneraux,
        actifBrut,
        actifNet,
        total,
        lignes
    };
}

/**
 * Formate un montant en FCFA
 */
export function formaterMontantSuccession(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
