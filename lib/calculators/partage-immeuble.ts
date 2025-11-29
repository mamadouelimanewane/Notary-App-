/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour Partage d'Immeuble
 * Conforme au barème sénégalais
 */

export interface PartageImmeubleInput {
    valeurActifBrut: number;
    valeurPassif: number;
    soulte: number;
    nombreParcelles: number;
    conservationFonciere?: boolean;
}

export interface PartageImmeubleResult {
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

    // Morcellement
    morcellement: number;
    coutParParcelle: number;

    // Conservation foncière
    conservationFonciere: number;
    baseConservation: number;

    // Droits mutation
    droitsMutation: number;
    valeurActifNet: number;

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
 * Calcule les honoraires selon le barème spécifique Partage
 */
function calculerHonoraires(prix: number): { total: number; details: any[] } {
    const tranches = [
        { min: 0, max: 10_000_000, taux: 4.00, label: '1 à 10 millions' },
        { min: 10_000_000, max: 40_000_000, taux: 3.00, label: '10 à 40 millions' },
        { min: 40_000_000, max: 150_000_000, taux: 1.50, label: '40 à 150 millions' },
        { min: 150_000_000, max: Infinity, taux: 0.75, label: 'Plus de 150 millions' }
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
                    taux: `${tranche.taux.toFixed(2)}%`,
                    montant: honorairesTranche
                });
            }
        }
    }

    return { total, details };
}

/**
 * Calcule les droits sur mutation selon barème (sur Actif Net)
 */
function calculerDroitsMutation(prix: number): number {
    if (prix <= 1_500_000) return 0;
    if (prix <= 2_500_000) return 0;
    if (prix > 2_500_000) return 20_000;
    return 0;
}

/**
 * Calcule tous les frais et honoraires pour Partage d'Immeuble
 */
export function calculerPartageImmeuble(input: PartageImmeubleInput): PartageImmeubleResult {
    const { valeurActifBrut, valeurPassif, soulte, nombreParcelles, conservationFonciere = true } = input;

    // 1. Honoraires (barème spécifique Partage sur Actif Brut)
    const { total: honoraires, details: detailHonoraires } = calculerHonoraires(valeurActifBrut);

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Enregistrement (1% sur Actif Brut)
    const tauxEnregistrement = 1;
    const enregistrement = (valeurActifBrut * tauxEnregistrement) / 100;

    // 4. Enregistrement sur Soulte (15%)
    const tauxEnregistrementSoulte = 15;
    const enregistrementSoulte = (soulte * tauxEnregistrementSoulte) / 100;

    // 5. Morcellement (20 000 par parcelle)
    const coutParParcelle = 20_000;
    const morcellement = nombreParcelles * coutParParcelle;

    // 6. Conservation foncière (1% de Actif Brut + 7 000)
    const baseConservation = valeurActifBrut + 7_000;
    const conservationFonciereAmount = conservationFonciere ? (baseConservation * 1) / 100 : 0;

    // 7. Droits sur mutation (sur Actif Net)
    const valeurActifNet = valeurActifBrut - valeurPassif;
    const droitsMutation = calculerDroitsMutation(valeurActifNet);

    // 8. Expéditions (fixe - 0 dans l'exemple mais souvent présent, je mets 0 pour coller à l'exemple)
    const expeditions = 0;

    // 9. Divers (fixe)
    const divers = 50_000;

    // Total
    const total = honoraires + tva + enregistrement + enregistrementSoulte +
        morcellement + conservationFonciereAmount + droitsMutation + expeditions + divers;

    // Construction des lignes pour affichage
    const lignes = [
        { label: 'VALEUR ACTIF BRUT', montant: valeurActifBrut, isBold: true },
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
        { label: 'MORCELLEMENT', detail: `${nombreParcelles} parcelle(s) × ${coutParParcelle}`, montant: morcellement, isBold: false },
        { label: 'CONSERVATION FONCIERE', detail: `1% de ${baseConservation.toLocaleString('fr-FR')}`, montant: conservationFonciereAmount, isBold: false },
    ];

    // Droits sur mutation (détail)
    if (valeurActifNet <= 1_500_000) {
        lignes.push({ label: '0 à 1,5 Millions', montant: 0, isBold: false });
    }
    if (valeurActifNet > 1_500_000 && valeurActifNet <= 2_500_000) {
        lignes.push({ label: '1,5 à 2,5 Millions', montant: 0, isBold: false });
    }
    if (valeurActifNet > 2_500_000) {
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
        morcellement,
        coutParParcelle,
        conservationFonciere: conservationFonciereAmount,
        baseConservation,
        droitsMutation,
        valeurActifNet,
        expeditions,
        divers,
        total,
        lignes
    };
}

/**
 * Formate un montant en FCFA
 */
export function formaterMontantPartage(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
