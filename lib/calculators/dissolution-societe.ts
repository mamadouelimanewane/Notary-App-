/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour Dissolution de Société
 * Conforme au barème sénégalais
 */

export interface DissolutionSocieteInput {
    capital: number;
    nombreAnnexes: number;
    penalites?: boolean;
    montantPenalites?: number;
}

export interface DissolutionSocieteResult {
    // Honoraires (fixe)
    honoraires: number;

    // Taxes et frais
    tva: number;
    tauxTVA: number;

    // Enregistrement
    enregistrementMinute: number;
    enregistrementAnnexe: number;
    nombreAnnexes: number;
    coutParAnnexe: number;
    penalites: number;

    // Greffe et Publicité
    greffe: number;
    publicite: number;

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
 * Calcule tous les frais et honoraires pour Dissolution de Société
 */
export function calculerDissolutionSociete(input: DissolutionSocieteInput): DissolutionSocieteResult {
    const { capital, nombreAnnexes, penalites = false, montantPenalites = 0 } = input;

    // 1. Honoraires (Droit fixe)
    const honoraires = 20_000;

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Enregistrement
    const enregistrementMinute = 5_000;

    // Annexe : 2 000 FCFA par annexe (selon exemple : 10 annexes -> 20 000)
    const coutParAnnexe = 2_000;
    const enregistrementAnnexe = nombreAnnexes * coutParAnnexe;

    // Pénalités : Montant saisi ou 0
    const fraisPenalites = penalites ? montantPenalites : 0;

    // 4. Greffe (fixe)
    const greffe = 10_000;

    // 5. Publicité (fixe)
    const publicite = 55_000;

    // 6. Expéditions (fixe)
    const expeditions = 50_000;

    // 7. Divers (fixe)
    const divers = 0;

    // Total
    const total = honoraires + tva + enregistrementMinute + enregistrementAnnexe +
        fraisPenalites + greffe + publicite + expeditions + divers;

    // Construction des lignes pour affichage
    const lignes = [
        { label: 'CAPITAL', montant: capital, isBold: true },
        { label: 'HONORAIRES', detail: 'Droit fixe', montant: honoraires, isBold: true },
        { label: 'TVA', detail: `${tauxTVA}%`, montant: tva, isBold: false },
        { label: 'ENREGISTREMENT MINUTE', montant: enregistrementMinute, isBold: false },
        { label: 'ENREGISTREMENT ANNEXES', detail: `${nombreAnnexes} annexe(s) × ${coutParAnnexe}`, montant: enregistrementAnnexe, isBold: false },
    ];

    if (penalites && fraisPenalites > 0) {
        lignes.push({ label: 'PENALITES', montant: fraisPenalites, isBold: false });
    }

    lignes.push(
        { label: 'GREFFE', montant: greffe, isBold: false },
        { label: 'PUBLICITE', montant: publicite, isBold: false },
        { label: 'EXPEDITIONS', montant: expeditions, isBold: false },
        { label: 'DIVERS', montant: divers, isBold: false },
        { label: 'TOTAL', montant: total, isBold: true }
    );

    return {
        honoraires,
        tva,
        tauxTVA,
        enregistrementMinute,
        enregistrementAnnexe,
        nombreAnnexes,
        coutParAnnexe,
        penalites: fraisPenalites,
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
export function formaterMontantDissolution(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
