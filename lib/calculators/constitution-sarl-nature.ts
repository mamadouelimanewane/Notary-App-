/**
 * Calculateur de frais et honoraires notariaux
 * Barème pour Constitution S.A.R.L avec Apport en Nature (Immobilier)
 * Conforme au barème sénégalais
 */

export interface ConstitutionSARLNatureInput {
    apportNature: number;
    apportNumeraire: number;
    engagementConservation: boolean; // Si true, taux réduit enregistrement nature (1%)
}

export interface ConstitutionSARLNatureResult {
    // Honoraires (sur Capital Total, barème immobilier)
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
    enregistrementSurplus: number; // 1% sur capital > 100M
    enregistrementNature: number; // 1% sur apport nature (si engagement)
    detailEnregistrement: string;

    // Conservation foncière
    conservationFonciere: number;
    baseConservation: number;

    // Droits sur inscription (Mutation)
    droitsInscription: number;

    // Autres frais
    greffe: number;
    publicite: number;
    expeditions: number;
    declarationRegularite: number;

    // Totaux
    capitalTotal: number;
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
 * Calcule les honoraires selon le barème IMMOBILIER standard (4.5% ...)
 * Appliqué sur le Capital Total
 */
function calculerHonoraires(capitalTotal: number): { total: number; details: any[] } {
    const tranches = [
        { min: 0, max: 20_000_000, taux: 4.50, label: '0 à 20 Millions' },
        { min: 20_000_000, max: 80_000_000, taux: 3.00, label: '20 à 80 Millions' },
        { min: 80_000_000, max: 300_000_000, taux: 1.50, label: '80 à 300 Millions' },
        { min: 300_000_000, max: Infinity, taux: 0.75, label: 'Plus de 300 Millions' }
    ];

    let total = 0;
    const details = [];

    for (const tranche of tranches) {
        if (capitalTotal > tranche.min) {
            const montantTranche = Math.min(capitalTotal, tranche.max) - tranche.min;
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
 * Calcule les droits sur inscription (Mutation)
 */
function calculerDroitsInscription(capitalTotal: number): number {
    if (capitalTotal > 2_500_000) return 20_000;
    return 0;
}

/**
 * Calcule tous les frais et honoraires pour Constitution SARL avec Apport Nature
 */
export function calculerConstitutionSARLNature(input: ConstitutionSARLNatureInput): ConstitutionSARLNatureResult {
    const { apportNature, apportNumeraire, engagementConservation = true } = input;
    const capitalTotal = apportNature + apportNumeraire;

    // 1. Honoraires (Barème Immobilier sur Capital Total)
    const { total: honoraires, details: detailHonoraires } = calculerHonoraires(capitalTotal);

    // 2. TVA (18% sur honoraires)
    const tauxTVA = 18;
    const tva = (honoraires * tauxTVA) / 100;

    // 3. Enregistrement
    // a) Sur le surplus du capital (> 100M)
    let enregistrementSurplus = 0;
    if (capitalTotal > 100_000_000) {
        enregistrementSurplus = ((capitalTotal - 100_000_000) * 1) / 100;
    }

    // b) Sur l'apport en nature
    // Si engagement conservation 10 ans : 1%
    // Sinon : Taux standard (souvent 5% ou plus, mais ici on suit l'exemple à 1%)
    const tauxEnregistrementNature = engagementConservation ? 1 : 5; // Hypothèse 5% si pas d'engagement
    const enregistrementNature = (apportNature * tauxEnregistrementNature) / 100;

    // 4. Conservation Foncière (1% Apport Nature + 7 500)
    const baseConservation = apportNature + 7_500;
    const conservationFonciere = (apportNature * 1) / 100 + 7_500;

    // 5. Droits sur inscription
    const droitsInscription = calculerDroitsInscription(capitalTotal);

    // 6. Frais divers
    const greffe = 54_500;
    const publicite = 55_000;
    const expeditions = 60_000;
    const declarationRegularite = 59_000;

    // Total
    const total = honoraires + tva + enregistrementSurplus + enregistrementNature +
        conservationFonciere + droitsInscription + greffe + publicite +
        expeditions + declarationRegularite;

    // Construction des lignes pour affichage
    const lignes = [
        { label: 'CAPITAL TOTAL', montant: capitalTotal, isBold: true },
        { label: 'DONT APPORT NATURE', montant: apportNature, isBold: false },
        { label: 'DONT APPORT NUMERAIRE', montant: apportNumeraire, isBold: false },

        ...detailHonoraires.map(d => ({
            label: d.tranche,
            detail: `TAUX ${d.taux}`,
            montant: d.montant,
            isBold: false
        })),
        { label: 'HONORAIRES', montant: honoraires, isBold: true },
        { label: 'TVA', detail: `${tauxTVA}%`, montant: tva, isBold: false },

        { label: 'ENREGISTREMENT (SURPLUS)', detail: '1% sur Capital > 100M', montant: enregistrementSurplus, isBold: false },
        { label: 'ENREGISTREMENT (NATURE)', detail: `${tauxEnregistrementNature}% sur Apport Nature`, montant: enregistrementNature, isBold: false },

        { label: 'CONSERVATION FONCIERE', detail: `1% + 7 500`, montant: conservationFonciere, isBold: false },
        { label: 'DROITS SUR INSCRIPTION', montant: droitsInscription, isBold: false },

        { label: 'GREFFE', montant: greffe, isBold: false },
        { label: 'PUBLICITE', montant: publicite, isBold: false },
        { label: 'EXPEDITIONS', montant: expeditions, isBold: false },
        { label: 'DECL. REGULARITE', montant: declarationRegularite, isBold: false },

        { label: 'TOTAL', montant: total, isBold: true }
    ];

    return {
        honoraires,
        detailHonoraires,
        tva,
        tauxTVA,
        enregistrementSurplus,
        enregistrementNature,
        detailEnregistrement: `Surplus: ${formaterMontant(enregistrementSurplus)}, Nature: ${formaterMontant(enregistrementNature)}`,
        conservationFonciere,
        baseConservation,
        droitsInscription,
        greffe,
        publicite,
        expeditions,
        declarationRegularite,
        capitalTotal,
        total,
        lignes
    };
}

function formaterMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}

/**
 * Formate un montant en FCFA (export)
 */
export function formaterMontantSARLNature(montant: number): string {
    return formaterMontant(montant);
}
