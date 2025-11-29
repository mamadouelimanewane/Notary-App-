export type HeirType = 'CONJOINT' | 'ENFANT' | 'PERE' | 'MERE';

export interface FamilyMember {
    id: string;
    type: HeirType;
    name: string;
    isAlive: boolean;
}

export interface SuccessionResult {
    reserve: number; // Part réservée aux héritiers (en %)
    quotiteDisponible: number; // Part libre (en %)
    shares: { heirId: string; percentage: number; value?: number }[];
    details: string[]; // Explications textuelles
}

export class SuccessionEngine {

    /**
     * Calcule les parts successorales théoriques
     * (Basé sur un droit civil standard type OHADA/Code Civil)
     */
    static calculate(members: FamilyMember[], totalAssets: number = 100): SuccessionResult {
        const aliveMembers = members.filter(m => m.isAlive);
        const children = aliveMembers.filter(m => m.type === 'ENFANT');
        const spouse = aliveMembers.find(m => m.type === 'CONJOINT');

        let reserve = 0;
        let quotite = 100;
        let shares: { heirId: string; percentage: number }[] = [];
        let details: string[] = [];

        // Cas 1 : Enfants présents
        if (children.length > 0) {
            const nbChildren = children.length;

            // Calcul de la réserve globale
            if (nbChildren === 1) reserve = 50;
            else if (nbChildren === 2) reserve = 66.66;
            else reserve = 75;

            quotite = 100 - reserve;
            details.push(`Présence de ${nbChildren} enfant(s) : La réserve héréditaire est de ${reserve}%.`);

            // Partage
            if (spouse) {
                // Option classique : Conjoint a 1/4 en pleine propriété (simplification)
                // Note: Les règles varient (Usufruit vs PP), ici on simule un partage en PP pour la démo
                const spouseShare = 25; // 1/4
                shares.push({ heirId: spouse.id, percentage: spouseShare });
                details.push("Le conjoint survivant reçoit 1/4 de la succession en pleine propriété.");

                // Le reste (75%) est partagé entre les enfants
                const childrenGlobalShare = 75;
                const sharePerChild = childrenGlobalShare / nbChildren;

                children.forEach(child => {
                    shares.push({ heirId: child.id, percentage: sharePerChild });
                });
                details.push(`Les enfants se partagent les 3/4 restants, soit ${sharePerChild.toFixed(2)}% chacun.`);

            } else {
                // Pas de conjoint, tout aux enfants
                const sharePerChild = 100 / nbChildren;
                children.forEach(child => {
                    shares.push({ heirId: child.id, percentage: sharePerChild });
                });
                details.push(`En l'absence de conjoint, les enfants se partagent la totalité, soit ${sharePerChild.toFixed(2)}% chacun.`);
            }
        }
        // Cas 2 : Pas d'enfants, mais Conjoint
        else if (spouse) {
            // Conjoint seul (simplifié)
            // Souvent le conjoint n'est pas héritier réservataire absolu sans enfants, 
            // mais pour la démo on lui donne tout ou partage avec parents
            shares.push({ heirId: spouse.id, percentage: 100 });
            details.push("En l'absence d'enfants, le conjoint survivant recueille la totalité de la succession (Règle simplifiée).");
        }
        // Cas 3 : Autres
        else {
            details.push("Cas complexe ou déshérence (non géré dans cette démo).");
        }

        return {
            reserve,
            quotiteDisponible: quotite,
            shares: shares.map(s => ({ ...s, value: (s.percentage / 100) * totalAssets })),
            details
        };
    }
}
