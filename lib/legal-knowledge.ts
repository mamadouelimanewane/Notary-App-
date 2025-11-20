/**
 * Base de connaissances juridiques pour notaires
 * Sources: Sénégal, France, Afrique francophone
 */

export interface LegalReference {
    id: string;
    country: 'SENEGAL' | 'FRANCE' | 'OHADA' | 'AUTRE_AFRIQUE';
    category: 'CIVIL' | 'PENAL' | 'COMMERCIAL' | 'FAMILLE' | 'IMMOBILIER' | 'SUCCESSION';
    code: string;
    article: string;
    title: string;
    content: string;
    url?: string;
}

export const legalKnowledgeBase: LegalReference[] = [
    // ===== SÉNÉGAL - CODE CIVIL =====
    {
        id: 'sn-cc-543',
        country: 'SENEGAL',
        category: 'FAMILLE',
        code: 'Code de la Famille',
        article: 'Article 543',
        title: 'Capacité juridique du majeur',
        content: 'Toute personne est capable de contracter sauf exceptions prévues par la loi.',
        url: 'http://www.jo.gouv.sn'
    },
    {
        id: 'sn-cc-371',
        country: 'SENEGAL',
        category: 'FAMILLE',
        code: 'Code de la Famille',
        article: 'Article 371',
        title: 'Régimes matrimoniaux',
        content: 'Les époux peuvent choisir leur régime matrimonial parmi les régimes légaux ou conventionnels.',
        url: 'http://www.jo.gouv.sn'
    },
    {
        id: 'sn-penal-305',
        country: 'SENEGAL',
        category: 'PENAL',
        code: 'Code Pénal',
        article: 'Article 305',
        title: 'Vol simple',
        content: 'Quiconque soustrait frauduleusement une chose appartenant à autrui est coupable de vol.',
        url: 'http://www.jo.gouv.sn'
    },
    {
        id: 'sn-penal-320',
        country: 'SENEGAL',
        category: 'PENAL',
        code: 'Code Pénal',
        article: 'Article 320',
        title: 'Escroquerie',
        content: 'Est coupable d\'escroquerie celui qui obtient un bien par manœuvres frauduleuses.',
        url: 'http://www.jo.gouv.sn'
    },

    // ===== FRANCE - CODE CIVIL =====
    {
        id: 'fr-cc-931',
        country: 'FRANCE',
        category: 'CIVIL',
        code: 'Code Civil',
        article: 'Article 931',
        title: 'Forme des donations',
        content: 'Tous actes portant donation entre vifs seront passés devant notaires.',
        url: 'https://www.legifrance.gouv.fr'
    },
    {
        id: 'fr-cc-1382',
        country: 'FRANCE',
        category: 'CIVIL',
        code: 'Code Civil',
        article: 'Article 1240',
        title: 'Responsabilité civile',
        content: 'Tout fait quelconque de l\'homme, qui cause à autrui un dommage, oblige celui par la faute duquel il est arrivé à le réparer.',
        url: 'https://www.legifrance.gouv.fr'
    },
    {
        id: 'fr-cc-1583',
        country: 'FRANCE',
        category: 'IMMOBILIER',
        code: 'Code Civil',
        article: 'Article 1583',
        title: 'Vente immobilière',
        content: 'La vente est parfaite entre les parties dès qu\'on est convenu de la chose et du prix.',
        url: 'https://www.legifrance.gouv.fr'
    },

    // ===== OHADA (Organisation pour l'Harmonisation en Afrique du Droit des Affaires) =====
    {
        id: 'ohada-ausc-4',
        country: 'OHADA',
        category: 'COMMERCIAL',
        code: 'Acte Uniforme sur les Sociétés Commerciales',
        article: 'Article 4',
        title: 'Constitution de société',
        content: 'La société est créée par deux ou plusieurs personnes qui conviennent d\'affecter à une activité des biens en numéraire ou en nature.',
        url: 'https://www.ohada.org'
    },
    {
        id: 'ohada-audcg-25',
        country: 'OHADA',
        category: 'COMMERCIAL',
        code: 'Acte Uniforme Droit Commercial Général',
        article: 'Article 25',
        title: 'Registre du commerce',
        content: 'Toute personne physique ou morale ayant la qualité de commerçant doit se faire immatriculer au registre du commerce.',
        url: 'https://www.ohada.org'
    },

    // ===== SÉNÉGAL - SUCCESSION =====
    {
        id: 'sn-fam-571',
        country: 'SENEGAL',
        category: 'SUCCESSION',
        code: 'Code de la Famille',
        article: 'Article 571',
        title: 'Ouverture de la succession',
        content: 'La succession s\'ouvre au moment du décès et au lieu du dernier domicile du défunt.',
        url: 'http://www.jo.gouv.sn'
    },
    {
        id: 'sn-fam-590',
        country: 'SENEGAL',
        category: 'SUCCESSION',
        code: 'Code de la Famille',
        article: 'Article 590',
        title: 'Capacité de succéder',
        content: 'Pour succéder, il faut exister à l\'ouverture de la succession ou avoir été conçu à cette date.',
        url: 'http://www.jo.gouv.sn'
    },

    // ===== SÉNÉGAL - IMMOBILIER =====
    {
        id: 'sn-dom-1',
        country: 'SENEGAL',
        category: 'IMMOBILIER',
        code: 'Loi sur le Domaine National',
        article: 'Article 1',
        title: 'Constitution du domaine national',
        content: 'Constituent le domaine national toutes les terres non classées dans le domaine public, non immatriculées.',
        url: 'http://www.jo.gouv.sn'
    },
];

/**
 * Recherche dans la base de connaissances juridiques
 */
export function searchLegalDatabase(query: string, country?: string): LegalReference[] {
    const queryLower = query.toLowerCase();

    return legalKnowledgeBase.filter(ref => {
        const matchesCountry = !country || ref.country === country;
        const matchesQuery =
            ref.title.toLowerCase().includes(queryLower) ||
            ref.content.toLowerCase().includes(queryLower) ||
            ref.article.toLowerCase().includes(queryLower) ||
            ref.code.toLowerCase().includes(queryLower);

        return matchesCountry && matchesQuery;
    });
}

/**
 * Obtenir des références par catégorie
 */
export function getReferencesByCategory(category: LegalReference['category'], country?: string): LegalReference[] {
    return legalKnowledgeBase.filter(ref => {
        const matchesCategory = ref.category === category;
        const matchesCountry = !country || ref.country === country;
        return matchesCategory && matchesCountry;
    });
}

/**
 * Obtenir le contexte juridique pour l'IA
 */
export function getLegalContext(query: string): string {
    const relevantRefs = searchLegalDatabase(query).slice(0, 5);

    if (relevantRefs.length === 0) {
        return '';
    }

    return `\n\nRéférences juridiques pertinentes:\n${relevantRefs.map(ref =>
        `- ${ref.country} ${ref.code} ${ref.article}: ${ref.title}\n  ${ref.content}`
    ).join('\n\n')}`;
}
