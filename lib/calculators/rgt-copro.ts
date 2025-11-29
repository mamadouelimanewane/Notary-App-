/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour RGT Copropriété (Registre Général des Titres)
 * Conforme au barème sénégalais
 */

export interface RGTCoproInput {
    prix: number;
    nombreTitres: number;
}

export interface RGTCoproResult {
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

    // Titres et conservation
    nombreTitres: number;
    coutParTitre: number;
    coutTitres: number;
    conservationFonciere: number;
    tauxConservation: number;

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
 * Calcule les honoraires selon le barème progressif RGT
 */
function calculerHonoraires(prix: number): { total: number; details: any[] } {
    const tranches = [
        { min: 0, max: 20_000_000, taux: 2.25, label: '1 à 20 millions' },
        { min: 20_000_000, max: 80_000_000, taux: 1.50, label: '20 à 80 millions' },
        { min: 80_000_000, max: 300_000_000, taux: 0.75, label: '80 à 300 millions' },
        { min: 300_000_000, max: Infinity, taux: 0.375, label: 'Plus de 300 millions' }
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
 * Calcule tous les frais et honoraires pour RGT Copropriété
 */
export function calculerRGTCopro(input: RGTCoproInput): RGTCoproResult {
    const { prix, nombreTitres } = input;

    // 1. Honoraires (barème progressif)
    const { total: honoraires, details: detailHonoraires } = calculerHonoraires(prix);

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Enregistrement (fixe)
    const enregistrement = 5_000;

    // 4. Nombre de titres créés
    const coutParTitre = 26_500;
    const coutTitres = nombreTitres * coutParTitre;

    // 5. Conservation foncière (1% du prix + coût titres)
    const tauxConservation = 1;
    const baseConservation = prix + coutTitres;
    const conservationFonciere = (baseConservation * tauxConservation) / 100;

    // 6. Expéditions (fixe)
    const expeditions = 50_000;

    // 7. Divers (fixe)
    const divers = 50_000;

    // Total
    const total = honoraires + tva + enregistrement + coutTitres +
        conservationFonciere + expeditions + divers;

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
        { label: 'ENREGISTREMENT', montant: enregistrement, isBold: false },
        { label: 'NBRE DE TITRES CREES', detail: `${nombreTitres} × ${coutParTitre.toLocaleString('fr-FR')}`, montant: coutTitres, isBold: false },
        { label: 'CONSERVATION FONCIERE', detail: `${tauxConservation}% de ${baseConservation.toLocaleString('fr-FR')}`, montant: conservationFonciere, isBold: false },
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
        nombreTitres,
        coutParTitre,
        coutTitres,
        conservationFonciere,
        tauxConservation,
        expeditions,
        divers,
        total,
        lignes
    };
}

/**
 * Formate un montant en FCFA
 */
export function formaterMontantRGT(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
