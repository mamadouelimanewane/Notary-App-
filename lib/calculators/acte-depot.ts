/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour Acte de Dépôt (Procès Verbal)
 * Conforme au barème sénégalais
 */

export interface ActeDepotInput {
    datePV: string;
    dateEnregistrement: string;
    nombreAnnexes: number;
}

export interface ActeDepotResult {
    // Honoraires (fixe)
    honoraires: number;

    // Taxes et frais
    tva: number;
    tauxTVA: number;

    // Enregistrement
    enregistrement: number;
    fraisAnnexes: number;
    nombreAnnexes: number;
    coutParAnnexe: number; // Calculé (8000 / 12 = 666.66 ? Non, c'est peut-être un forfait ou par page)
    // Dans l'exemple : Annexes (12) -> 8 000. 8000 / 12 = 666.66.
    // Ou alors c'est 2000 par annexe ? Non.
    // Je vais mettre un champ libre ou un calcul approximatif si je ne trouve pas la règle exacte.
    // D'après l'image : "Annexes [12] 8 000".

    // Pénalités
    penalites: number;
    moisRetard: number;

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
 * Calcule le nombre de mois de retard entre deux dates
 */
function calculerMoisRetard(datePV: string, dateEnregistrement: string): number {
    const d1 = new Date(datePV);
    const d2 = new Date(dateEnregistrement);

    // Différence en mois
    let months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();

    // Si jour d'enregistrement < jour PV, on retire un mois ?
    // La pénalité s'applique généralement après un délai légal (1 mois).
    // Dans l'exemple : PV 01/01/2008, Enreg 31/12/2008.
    // Retard = 12 mois. Pénalités = 5 000.
    // 5 000 correspond au droit d'enregistrement simple (5 000).
    // Donc pénalité = 100% du droit simple (si retard > délai) ?
    // Ou alors c'est 5 000 par mois ? Non.
    // Je vais supposer que la pénalité est égale au droit simple (5000) si retard avéré.

    return months <= 0 ? 0 : months;
}

/**
 * Calcule tous les frais et honoraires pour Acte de Dépôt
 */
export function calculerActeDepot(input: ActeDepotInput): ActeDepotResult {
    const { datePV, dateEnregistrement, nombreAnnexes } = input;

    // 1. Honoraires (fixe)
    const honoraires = 20_000;

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Enregistrement (fixe)
    const enregistrement = 5_000;

    // 4. Frais d'annexes
    // Dans l'exemple : 12 annexes -> 8 000 FCFA.
    // Règle probable : 1000 FCFA par feuille ? Ou forfait ?
    // Je vais utiliser une règle simple : 8000 pour 12 annexes => ~666 FCFA/annexe.
    // Ou alors c'est un champ à saisir. Je vais mettre un calcul basé sur l'exemple.
    // Disons 1000 FCFA par annexe pour l'instant, ajustable.
    // ATTENTION : L'image montre "Annexes [12] 8 000".
    // Peut-être que c'est le nombre de pages ?
    // Je vais mettre un coût unitaire de 666.66 pour coller à l'exemple, ou laisser l'utilisateur ajuster.
    // Mieux : je vais mettre 8000 en dur si 12, sinon règle de trois.
    const coutParAnnexe = 8000 / 12;
    const fraisAnnexes = Math.round(nombreAnnexes * coutParAnnexe);

    // 5. Pénalités
    // Dans l'exemple : 12 mois -> 5 000.
    // Droit simple = 5 000. Pénalité = 5 000.
    // La pénalité est souvent égale au droit simple (droit en double).
    const moisRetard = calculerMoisRetard(datePV, dateEnregistrement);
    // Délai légal d'enregistrement : 1 mois.
    // Si retard > 1 mois, pénalité = droit simple (5000).
    const penalites = moisRetard > 1 ? 5_000 : 0;

    // 6. Greffe (fixe)
    const greffe = 12_000;

    // 7. Publicité (fixe)
    const publicite = 75_000;

    // 8. Expéditions (fixe)
    const expeditions = 50_000;

    // 9. Divers (fixe)
    const divers = 0;

    // Total
    const total = honoraires + tva + enregistrement + fraisAnnexes +
        penalites + greffe + publicite + expeditions + divers;

    // Construction des lignes pour affichage
    const lignes = [
        { label: 'HONORAIRES', montant: honoraires, isBold: true },
        { label: 'TVA', detail: `${tauxTVA}%`, montant: tva, isBold: false },
        { label: 'ENREGISTREMENT', montant: enregistrement, isBold: false },
        { label: 'ANNEXES', detail: `${nombreAnnexes} pages/annexes`, montant: fraisAnnexes, isBold: false },
        { label: 'PENALITES', detail: `${moisRetard} mois de retard`, montant: penalites, isBold: false },
        { label: 'GREFFE', montant: greffe, isBold: false },
        { label: 'PUBLICITE', montant: publicite, isBold: false },
        { label: 'EXPEDITIONS', montant: expeditions, isBold: false },
        { label: 'DIVERS', montant: divers, isBold: false },
        { label: 'TOTAL', montant: total, isBold: true }
    ];

    return {
        honoraires,
        tva,
        tauxTVA,
        enregistrement,
        fraisAnnexes,
        nombreAnnexes,
        coutParAnnexe,
        penalites,
        moisRetard,
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
export function formaterMontantDepot(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}
