export interface LegalArticle {
    id: string;
    source: string; // Ex: AUDSCGIE, AUPSRVE
    article: string;
    title: string;
    content: string;
    keywords: string[];
}

export const OHADA_DATA: LegalArticle[] = [
    // --- AUDSCGIE (Droit des Sociétés) ---
    {
        id: "auscgie-309",
        source: "AUDSCGIE",
        article: "Article 309",
        title: "Capital social minimum de la SARL",
        content: "Sauf dispositions nationales contraires, le capital social doit être d'un million (1.000.000) de francs CFA au moins. Il est divisé en parts sociales égales dont la valeur nominale ne peut être inférieure à cinq mille (5.000) francs CFA.",
        keywords: ["sarl", "capital", "minimum", "parts sociales", "valeur nominale"]
    },
    {
        id: "auscgie-385",
        source: "AUDSCGIE",
        article: "Article 385",
        title: "Capital social de la SA",
        content: "Le capital social doit être de dix millions (10.000.000) de francs CFA au moins. Il est divisé en actions dont le montant nominal ne peut être inférieur à dix mille (10.000) francs CFA.",
        keywords: ["sa", "société anonyme", "capital", "minimum", "actions"]
    },
    {
        id: "auscgie-41",
        source: "AUDSCGIE",
        article: "Article 41",
        title: "Capacité juridique des sociétés",
        content: "La société jouit de la personnalité juridique à compter de son immatriculation au Registre du Commerce et du Crédit Mobilier.",
        keywords: ["personnalité morale", "immatriculation", "rccm", "capacité"]
    },

    // --- AUDCG (Droit Commercial Général) ---
    {
        id: "audcg-16",
        source: "AUDCG",
        article: "Article 16",
        title: "Prescription en matière commerciale",
        content: "Les obligations nées à l'occasion de leur commerce entre commerçants, ou entre commerçants et non-commerçants, se prescrivent par cinq ans si elles ne sont pas soumises à des prescriptions plus courtes.",
        keywords: ["prescription", "délai", "cinq ans", "5 ans", "commerciale"]
    },
    {
        id: "audcg-234",
        source: "AUDCG",
        article: "Article 234",
        title: "Bail à usage professionnel",
        content: "Est réputé bail à usage professionnel toute convention, écrite ou non, entre une personne investie par la loi ou une convention du droit de donner en location tout ou partie d'un immeuble... et une autre personne physique ou morale, permettant à cette dernière d'exercer dans les lieux une activité commerciale, industrielle, artisanale ou professionnelle.",
        keywords: ["bail", "location", "commercial", "professionnel", "définition"]
    },

    // --- AUPSRVE (Recouvrement & Voies d'exécution) ---
    {
        id: "aupsrve-1",
        source: "AUPSRVE",
        article: "Article 1",
        title: "Injonction de payer",
        content: "Le recouvrement d'une créance certaine, liquide et exigible peut être demandé suivant la procédure d'injonction de payer.",
        keywords: ["injonction", "payer", "recouvrement", "créance", "liquide", "exigible"]
    },
    {
        id: "aupsrve-91",
        source: "AUPSRVE",
        article: "Article 91",
        title: "Saisie conservatoire",
        content: "Toute personne dont la créance paraît fondée en son principe peut, par requête, solliciter de la juridiction compétente l'autorisation de pratiquer une mesure conservatoire sur tous les biens mobiliers corporels ou incorporels de son débiteur.",
        keywords: ["saisie", "conservatoire", "biens", "débiteur", "créance"]
    }
];
