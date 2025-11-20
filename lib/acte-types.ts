// Types d'Actes Notariaux - Classification Complète

export const ACTE_CATEGORIES = {
    FAMILLE: 'Droit de la Famille',
    IMMOBILIER: 'Droit Immobilier',
    AFFAIRES: 'Droit des Affaires',
    AUTRE: 'Autres Actes'
} as const;

export type ActeCategory = keyof typeof ACTE_CATEGORIES;

export const ACTE_TYPES = {
    // DROIT DE LA FAMILLE
    CONTRAT_MARIAGE: {
        label: 'Contrat de Mariage',
        category: 'FAMILLE' as ActeCategory,
        description: 'Définit le régime matrimonial des époux'
    },
    DONATION_SIMPLE: {
        label: 'Donation Simple',
        category: 'FAMILLE' as ActeCategory,
        description: 'Donation entre vifs sans condition'
    },
    DONATION_EPOUX: {
        label: 'Donation entre Époux',
        category: 'FAMILLE' as ActeCategory,
        description: 'Donation au dernier vivant'
    },
    DONATION_PARTAGE: {
        label: 'Donation-Partage',
        category: 'FAMILLE' as ActeCategory,
        description: 'Donation avec partage anticipé de succession'
    },
    DONATION_USUFRUIT: {
        label: 'Donation avec Réserve d\'Usufruit',
        category: 'FAMILLE' as ActeCategory,
        description: 'Donation en conservant l\'usufruit'
    },
    TESTAMENT: {
        label: 'Testament Authentique',
        category: 'FAMILLE' as ActeCategory,
        description: 'Dispositions de dernières volontés'
    },
    NOTORIETE: {
        label: 'Acte de Notoriété',
        category: 'FAMILLE' as ActeCategory,
        description: 'Établit la qualité d\'héritier'
    },
    PARTAGE_SUCCESSION: {
        label: 'Partage de Succession',
        category: 'FAMILLE' as ActeCategory,
        description: 'Répartition des biens entre héritiers'
    },
    PACS: {
        label: 'PACS',
        category: 'FAMILLE' as ActeCategory,
        description: 'Pacte Civil de Solidarité'
    },
    CONSENTEMENT_PMA: {
        label: 'Consentement PMA',
        category: 'FAMILLE' as ActeCategory,
        description: 'Consentement à la procréation médicale assistée'
    },

    // DROIT IMMOBILIER
    VENTE: {
        label: 'Vente Immobilière',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Transfert de propriété d\'un bien immobilier'
    },
    COMPROMIS: {
        label: 'Compromis de Vente',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Avant-contrat de vente immobilière'
    },
    VEFA: {
        label: 'VEFA',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Vente en l\'état futur d\'achèvement'
    },
    HYPOTHEQUE: {
        label: 'Acte d\'Hypothèque',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Garantie sur un bien immobilier'
    },
    MAINLEVEE: {
        label: 'Mainlevée d\'Hypothèque',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Levée de garantie hypothécaire'
    },
    SERVITUDE: {
        label: 'Servitude',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Charge grevant un fonds au profit d\'un autre'
    },
    BAIL_EMPHYTEOTIQUE: {
        label: 'Bail Emphytéotique',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Bail de longue durée (18 à 99 ans)'
    },
    DEMEMBREMENT: {
        label: 'Démembrement de Propriété',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Séparation usufruit et nue-propriété'
    },

    // DROIT DES AFFAIRES
    SCI: {
        label: 'Création SCI',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Société Civile Immobilière'
    },
    CESSION_PARTS: {
        label: 'Cession de Parts Sociales',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Transfert de parts de société'
    },
    BAIL_COMMERCIAL: {
        label: 'Bail Commercial',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Location de locaux commerciaux'
    },
    BAIL_PROFESSIONNEL: {
        label: 'Bail Professionnel',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Location pour activité libérale'
    },
    CONVENTION_ENTREPRISE: {
        label: 'Convention d\'Entreprise',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Accord commercial ou de partenariat'
    },
    CAUTIONNEMENT: {
        label: 'Acte de Cautionnement',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Engagement de garantie'
    },

    // AUTRES
    PRET: {
        label: 'Prêt Immobilier',
        category: 'AUTRE' as ActeCategory,
        description: 'Contrat de prêt pour acquisition immobilière'
    },
    PROCURATION: {
        label: 'Procuration Authentique',
        category: 'AUTRE' as ActeCategory,
        description: 'Mandat donné à un tiers'
    },
    CONSTAT: {
        label: 'Constat',
        category: 'AUTRE' as ActeCategory,
        description: 'Constatation matérielle de faits'
    },
    CERTIFICAT_PROPRIETE: {
        label: 'Certificat de Propriété',
        category: 'AUTRE' as ActeCategory,
        description: 'Attestation de propriété d\'un bien'
    },
    INVENTAIRE: {
        label: 'Inventaire',
        category: 'AUTRE' as ActeCategory,
        description: 'Inventaire des biens d\'une succession'
    },
    PERSONNALISE: {
        label: 'Acte Personnalisé',
        category: 'AUTRE' as ActeCategory,
        description: 'Type d\'acte défini par l\'utilisateur'
    }
} as const;

export type ActeType = keyof typeof ACTE_TYPES;

// Helper functions
export function getActeLabel(type: ActeType): string {
    return ACTE_TYPES[type].label;
}

export function getActeCategory(type: ActeType): string {
    const categoryKey = ACTE_TYPES[type].category;
    return ACTE_CATEGORIES[categoryKey];
}

export function getActesByCategory(category: ActeCategory): Array<{ type: ActeType, label: string, description: string }> {
    return Object.entries(ACTE_TYPES)
        .filter(([_, info]) => info.category === category)
        .map(([type, info]) => ({
            type: type as ActeType,
            label: info.label,
            description: info.description
        }));
}

export function getAllActeTypes(): Array<{ type: ActeType, label: string, category: string, description: string }> {
    return Object.entries(ACTE_TYPES).map(([type, info]) => ({
        type: type as ActeType,
        label: info.label,
        category: ACTE_CATEGORIES[info.category],
        description: info.description
    }));
}
