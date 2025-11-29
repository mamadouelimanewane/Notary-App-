/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour Cession de Fonds de Commerce
 * Conforme au barème sénégalais
 */

export interface CessionFondsInput {
    prixCession: number;
    valeurFonds: number;
    marchandisesNeuves: number;
}

export interface CessionFondsResult {
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
    enregistrementFonds: number;
    enregistrementMarchandises: number;
    enregistrementTotal: number;

    // Autres frais
    greffe: number;
    publicite: number;
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
 * Calcule tous les frais et honoraires pour cession de fonds de commerce
 */
export function calculerCessionFonds(input: CessionFondsInput): CessionFondsResult {
    const { prixCession, valeurFonds, marchandisesNeuves } = input;

    // 1. Honoraires (barème progressif sur prix de cession)
    const { total: honoraires, details: detailHonoraires } = calculerHonoraires(prixCession);

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Enregistrement
    // - Valeur fonds de commerce : 10%
    const enregistrementFonds = (valeurFonds * 10) / 100;

    // - Marchandises neuves : 1%
    const enregistrementMarchandises = (marchandisesNeuves * 1) / 100;

    const enregistrementTotal = enregistrementFonds + enregistrementMarchandises;

    // 4. Greffe (déclaration modificative)
    const greffe = 20_000;

    // 5. Publicité (annonces légales)
    const publicite = 75_000;

    // 6. Expéditions
    const expeditions = 60_000;

    // 7. Divers
    const divers = 0;

    // Total
    const total = honoraires + tva + enregistrementTotal + greffe + publicite + expeditions + divers;

    // Construction des lignes pour affichage
    const lignes = [
        { label: 'PRIX DE CESSION', montant: prixCession, isBold: true },
        ...detailHonoraires.map(d => ({
            label: d.tranche,
            detail: `TAUX ${d.taux}`,
            montant: d.montant,
            isBold: false
        })),
        { label: 'HONORAIRES', montant: honoraires, isBold: true },
        { label: 'TVA', detail: `${tauxTVA}%`, montant: tva, isBold: false },
        { label: 'ENREGISTREMENT', montant: 0, isBold: true },
        { label: 'Valeur fonds de commerce', detail: `10% de ${valeurFonds.toLocaleString('fr-FR')} frs`, montant: enregistrementFonds, isBold: false },
        { label: 'Marchandises neuves', detail: `1% de ${marchandisesNeuves.toLocaleString('fr-FR')} frs`, montant: enregistrementMarchandises, isBold: false },
        { label: 'GREFFE', detail: '(Déclaration modificative)', montant: greffe, isBold: false },
        { label: 'PUBLICITE', montant: publicite, isBold: false },
        { label: 'EXPEDITIONS', montant: expeditions, isBold: false },
        { label: 'DIVERS', montant: divers, isBold: false },
        { label: 'TOTAL', montant: total, isBold: true }
    ];

    return {
        honoraires,
        detailHonoraires,
        tva,
        tauxTVA,
        enregistrementFonds,
        enregistrementMarchandises,
        enregistrementTotal,
        greffe,
        publicite,
        expeditions,
        divers,
        total,
        lignes
    };
}

/**
 * Formate un montant en FCFA
 */
export function formaterMontantFonds(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
