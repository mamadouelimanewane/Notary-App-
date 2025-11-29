// Types d'Actes Notariaux - Classification Exhaustive
// Plus de 100 types d'actes couvrant toute la pratique notariale

export const ACTE_CATEGORIES = {
    FAMILLE: 'Droit de la Famille',
    IMMOBILIER: 'Droit Immobilier',
    AFFAIRES: 'Droit des Affaires',
    SUCCESSION: 'Successions & Libéralités',
    RURAL: 'Droit Rural & Agricole',
    INTERNATIONAL: 'Actes Internationaux',
    AUTHENTIFICATION: 'Authentifications & Certifications',
    AUTRE: 'Autres Actes'
} as const;

export type ActeCategory = keyof typeof ACTE_CATEGORIES;

export const ACTE_TYPES = {
    // ========================================
    // DROIT DE LA FAMILLE (Régimes Matrimoniaux, Filiation)
    // ========================================

    // Régimes Matrimoniaux
    CONTRAT_MARIAGE_SEPARATION: {
        label: 'Contrat de Mariage - Séparation de Biens',
        category: 'FAMILLE' as ActeCategory,
        description: 'Régime séparatiste : chaque époux conserve ses biens propres'
    },
    CONTRAT_MARIAGE_COMMUNAUTE: {
        label: 'Contrat de Mariage - Communauté Universelle',
        category: 'FAMILLE' as ActeCategory,
        description: 'Tous les biens sont communs aux époux'
    },
    CONTRAT_MARIAGE_PARTICIPATION: {
        label: 'Contrat de Mariage - Participation aux Acquêts',
        category: 'FAMILLE' as ActeCategory,
        description: 'Régime mixte : séparation pendant le mariage, partage à la dissolution'
    },
    CHANGEMENT_REGIME_MATRIMONIAL: {
        label: 'Changement de Régime Matrimonial',
        category: 'FAMILLE' as ActeCategory,
        description: 'Modification du régime matrimonial après 2 ans de mariage'
    },
    LIQUIDATION_REGIME_MATRIMONIAL: {
        label: 'Liquidation de Régime Matrimonial',
        category: 'FAMILLE' as ActeCategory,
        description: 'Partage des biens communs lors d\'un divorce ou décès'
    },

    // Concubinage
    CERTIFICAT_CONCUBINAGE: {
        label: 'Certificat de Concubinage',
        category: 'FAMILLE' as ActeCategory,
        description: 'Attestation de vie commune en concubinage'
    },
    CURATELLE: {
        label: 'Acte de Curatelle',
        category: 'FAMILLE' as ActeCategory,
        description: 'Assistance d\'une personne dans les actes de la vie civile'
    },
    EMANCIPATION: {
        label: 'Acte d\'Émancipation',
        category: 'FAMILLE' as ActeCategory,
        description: 'Émancipation d\'un mineur avant sa majorité'
    },

    // ========================================
    // SUCCESSIONS & LIBÉRALITÉS
    // ========================================

    // Testaments
    TESTAMENT_AUTHENTIQUE: {
        label: 'Testament Authentique',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Testament dicté au notaire en présence de témoins'
    },
    TESTAMENT_MYSTIQUE: {
        label: 'Testament Mystique',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Testament secret remis au notaire sous enveloppe scellée'
    },
    REVOCATION_TESTAMENT: {
        label: 'Révocation de Testament',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Annulation d\'un testament antérieur'
    },
    DEPOT_TESTAMENT: {
        label: 'Dépôt de Testament Olographe',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Dépôt d\'un testament écrit de la main du testateur'
    },

    // Donations
    DONATION_SIMPLE: {
        label: 'Donation Simple',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation entre vifs sans condition ni charge'
    },
    DONATION_EPOUX: {
        label: 'Donation entre Époux',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation au dernier vivant (au profit du conjoint survivant)'
    },
    DONATION_PARTAGE: {
        label: 'Donation-Partage',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation avec partage anticipé entre héritiers présomptifs'
    },
    DONATION_PARTAGE_TRANSGENERATIONNELLE: {
        label: 'Donation-Partage Transgénérationnelle',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation-partage incluant petits-enfants avec accord des enfants'
    },
    DONATION_GRADUELLE: {
        label: 'Donation Graduelle',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation avec obligation de conserver et transmettre'
    },
    DONATION_RESIDUELLE: {
        label: 'Donation Résiduelle',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation du résidu des biens à un second bénéficiaire'
    },
    DONATION_USUFRUIT: {
        label: 'Donation avec Réserve d\'Usufruit',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation de la nue-propriété en conservant l\'usufruit'
    },
    DONATION_NUE_PROPRIETE: {
        label: 'Donation de Nue-Propriété',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation de la nue-propriété seule'
    },
    DONATION_USUFRUIT_SEUL: {
        label: 'Donation d\'Usufruit',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation de l\'usufruit seul'
    },
    DONATION_CHARGE: {
        label: 'Donation avec Charge',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation assortie d\'obligations pour le donataire'
    },
    DONATION_CONDITION: {
        label: 'Donation avec Condition',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation sous condition suspensive ou résolutoire'
    },
    DONATION_MANUELLE: {
        label: 'Révélation de Donation Manuelle',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Déclaration d\'une donation de la main à la main'
    },
    DON_MANUEL_SOMME_ARGENT: {
        label: 'Don Manuel de Somme d\'Argent',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Donation d\'argent sans acte notarié (déclaration fiscale)'
    },

    // Successions
    NOTORIETE: {
        label: 'Acte de Notoriété',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Établit la qualité et les droits des héritiers'
    },
    NOTORIETE_APRES_DECES: {
        label: 'Acte de Notoriété après Décès',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Constate la dévolution successorale'
    },
    ATTESTATION_PROPRIETE: {
        label: 'Attestation de Propriété Immobilière',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Transfert de propriété par succession'
    },
    PARTAGE_SUCCESSION: {
        label: 'Partage de Succession',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Répartition des biens entre héritiers'
    },
    PARTAGE_AMIABLE: {
        label: 'Partage Amiable',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Partage à l\'amiable entre cohéritiers'
    },
    PARTAGE_JUDICIAIRE: {
        label: 'Partage Judiciaire',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Partage ordonné par le tribunal'
    },
    INVENTAIRE: {
        label: 'Inventaire de Succession',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Description détaillée des biens d\'une succession'
    },
    RENONCIATION_SUCCESSION: {
        label: 'Renonciation à Succession',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Refus d\'une succession par un héritier'
    },
    ACCEPTATION_SUCCESSION: {
        label: 'Acceptation de Succession',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Acceptation pure et simple ou à concurrence de l\'actif net'
    },
    ENVOI_POSSESSION: {
        label: 'Envoi en Possession',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Mise en possession des légataires universels ou à titre universel'
    },
    DELIVRANCE_LEGS: {
        label: 'Délivrance de Legs',
        category: 'SUCCESSION' as ActeCategory,
        description: 'Remise d\'un bien légué à un légataire'
    },

    // ========================================
    // DROIT IMMOBILIER
    // ========================================

    // Ventes
    VENTE: {
        label: 'Vente Immobilière',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Transfert de propriété d\'un bien immobilier'
    },
    VENTE_APPARTEMENT: {
        label: 'Vente d\'Appartement',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Vente d\'un lot de copropriété'
    },
    VENTE_MAISON: {
        label: 'Vente de Maison',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Vente d\'une maison individuelle'
    },
    VENTE_TERRAIN: {
        label: 'Vente de Terrain',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Vente d\'un terrain à bâtir ou agricole'
    },
    VENTE_IMMEUBLE_RAPPORT: {
        label: 'Vente d\'Immeuble de Rapport',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Vente d\'un immeuble locatif'
    },
    VENTE_VIAGER: {
        label: 'Vente en Viager',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Vente avec paiement d\'une rente viagère'
    },
    VENTE_ECHANGE: {
        label: 'Échange Immobilier',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Échange de biens immobiliers entre propriétaires'
    },
    COMPROMIS: {
        label: 'Compromis de Vente',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Avant-contrat de vente immobilière'
    },
    PROMESSE_VENTE: {
        label: 'Promesse de Vente',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Engagement unilatéral de vendre'
    },
    PROMESSE_ACHAT: {
        label: 'Promesse d\'Achat',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Engagement unilatéral d\'acheter'
    },
    VEFA: {
        label: 'VEFA (Vente en l\'État Futur d\'Achèvement)',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Vente sur plan d\'un bien à construire'
    },
    VENTE_IMMEUBLE_RENOVER: {
        label: 'Vente d\'Immeuble à Rénover',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Vente avec travaux de rénovation'
    },

    // Garanties et Sûretés
    HYPOTHEQUE: {
        label: 'Inscription d\'Hypothèque',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Garantie réelle sur un bien immobilier'
    },
    HYPOTHEQUE_CONVENTIONNELLE: {
        label: 'Hypothèque Conventionnelle',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Hypothèque consentie par le débiteur'
    },
    HYPOTHEQUE_RECHARGEABLE: {
        label: 'Hypothèque Rechargeable',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Hypothèque pouvant garantir plusieurs créances successives'
    },
    MAINLEVEE: {
        label: 'Mainlevée d\'Hypothèque',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Radiation de garantie hypothécaire'
    },
    PRIVILEGE_PRETEUR: {
        label: 'Privilège de Prêteur de Deniers',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Garantie pour le prêt du prix d\'acquisition'
    },
    NANTISSEMENT: {
        label: 'Nantissement Immobilier',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Affectation d\'un bien en garantie'
    },

    // Servitudes et Droits Réels
    SERVITUDE: {
        label: 'Constitution de Servitude',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Charge grevant un fonds au profit d\'un autre'
    },
    SERVITUDE_PASSAGE: {
        label: 'Servitude de Passage',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Droit de passage sur un terrain'
    },
    SERVITUDE_VUE: {
        label: 'Servitude de Vue',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Droit ou interdiction de vue'
    },
    SERVITUDE_ECOULEMENT: {
        label: 'Servitude d\'Écoulement des Eaux',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Droit d\'écoulement des eaux pluviales'
    },
    EXTINCTION_SERVITUDE: {
        label: 'Extinction de Servitude',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Suppression d\'une servitude'
    },
    DEMEMBREMENT: {
        label: 'Démembrement de Propriété',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Séparation usufruit et nue-propriété'
    },
    REUNION_USUFRUIT: {
        label: 'Réunion d\'Usufruit',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Réunion de l\'usufruit à la nue-propriété'
    },
    CESSION_USUFRUIT: {
        label: 'Cession d\'Usufruit',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Transfert du droit d\'usufruit'
    },
    CESSION_NUE_PROPRIETE: {
        label: 'Cession de Nue-Propriété',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Transfert de la nue-propriété'
    },

    // Baux
    BAIL_HABITATION: {
        label: 'Bail d\'Habitation',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Location d\'un logement à usage d\'habitation'
    },
    BAIL_COMMERCIAL: {
        label: 'Bail Commercial',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Location de locaux commerciaux (3-6-9)'
    },
    BAIL_PROFESSIONNEL: {
        label: 'Bail Professionnel',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Location pour activité libérale'
    },
    BAIL_EMPHYTEOTIQUE: {
        label: 'Bail Emphytéotique',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Bail de très longue durée (18 à 99 ans)'
    },
    BAIL_CONSTRUCTION: {
        label: 'Bail à Construction',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Bail avec obligation de construire (18 à 99 ans)'
    },
    BAIL_REHABILITATION: {
        label: 'Bail à Réhabilitation',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Bail avec obligation de réhabiliter'
    },
    CESSION_BAIL: {
        label: 'Cession de Bail',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Transfert des droits du preneur'
    },
    RESILIATION_BAIL: {
        label: 'Résiliation de Bail',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Fin anticipée du bail'
    },

    // Copropriété
    DIVISION_IMMEUBLE: {
        label: 'Division d\'Immeuble en Lots',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Création d\'une copropriété'
    },
    REGLEMENT_COPROPRIETE: {
        label: 'Règlement de Copropriété',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Statuts de la copropriété'
    },
    MODIFICATION_REGLEMENT: {
        label: 'Modification du Règlement de Copropriété',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Changement des règles de copropriété'
    },
    ETAT_DESCRIPTIF_DIVISION: {
        label: 'État Descriptif de Division',
        category: 'IMMOBILIER' as ActeCategory,
        description: 'Description technique des lots'
    },

    // ========================================
    // DROIT DES AFFAIRES
    // ========================================

    // Sociétés Civiles
    SCI: {
        label: 'Création de SCI',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Société Civile Immobilière'
    },
    SCP: {
        label: 'Création de SCP',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Société Civile Professionnelle'
    },
    SCM: {
        label: 'Création de SCM',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Société Civile de Moyens'
    },
    MODIFICATION_STATUTS: {
        label: 'Modification de Statuts',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Changement des statuts d\'une société'
    },
    AUGMENTATION_CAPITAL: {
        label: 'Augmentation de Capital',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Augmentation du capital social'
    },
    REDUCTION_CAPITAL: {
        label: 'Réduction de Capital',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Diminution du capital social'
    },
    DISSOLUTION_SOCIETE: {
        label: 'Dissolution de Société',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Fin de la société'
    },
    LIQUIDATION_SOCIETE: {
        label: 'Liquidation de Société',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Partage de l\'actif social'
    },

    // Cessions et Apports
    CESSION_PARTS: {
        label: 'Cession de Parts Sociales',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Transfert de parts de société civile'
    },
    CESSION_ACTIONS: {
        label: 'Cession d\'Actions',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Transfert d\'actions de société commerciale'
    },
    CESSION_FONDS_COMMERCE: {
        label: 'Cession de Fonds de Commerce',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Vente d\'un fonds de commerce'
    },
    APPORT_SOCIETE: {
        label: 'Apport en Société',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Apport de biens à une société'
    },
    APPORT_PARTIEL_ACTIF: {
        label: 'Apport Partiel d\'Actif',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Transfert d\'une branche d\'activité'
    },

    // Garanties
    CAUTIONNEMENT: {
        label: 'Acte de Cautionnement',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Engagement de garantie personnelle'
    },
    CAUTIONNEMENT_REEL: {
        label: 'Cautionnement Réel',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Garantie limitée à un bien déterminé'
    },
    GARANTIE_AUTONOME: {
        label: 'Garantie Autonome',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Engagement indépendant de la dette principale'
    },

    // Conventions
    CONVENTION_ENTREPRISE: {
        label: 'Convention d\'Entreprise',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Accord commercial ou de partenariat'
    },
    PACTE_ACTIONNAIRES: {
        label: 'Pacte d\'Actionnaires',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Accord entre associés'
    },
    PROTOCOLE_ACCORD: {
        label: 'Protocole d\'Accord',
        category: 'AFFAIRES' as ActeCategory,
        description: 'Accord préalable à une opération'
    },

    // ========================================
    // DROIT RURAL & AGRICOLE
    // ========================================

    BAIL_RURAL: {
        label: 'Bail Rural',
        category: 'RURAL' as ActeCategory,
        description: 'Location de terres agricoles (9 ans minimum)'
    },
    BAIL_FERMAGE: {
        label: 'Bail à Ferme',
        category: 'RURAL' as ActeCategory,
        description: 'Location de terres avec paiement en argent'
    },
    BAIL_METAYAGE: {
        label: 'Bail à Métayage',
        category: 'RURAL' as ActeCategory,
        description: 'Location avec partage des récoltes'
    },
    CESSION_BAIL_RURAL: {
        label: 'Cession de Bail Rural',
        category: 'RURAL' as ActeCategory,
        description: 'Transfert d\'un bail rural'
    },
    VENTE_TERRES_AGRICOLES: {
        label: 'Vente de Terres Agricoles',
        category: 'RURAL' as ActeCategory,
        description: 'Vente de parcelles agricoles (avec droit de préemption SAFER)'
    },
    REMEMBREMENT: {
        label: 'Acte de Remembrement',
        category: 'RURAL' as ActeCategory,
        description: 'Regroupement de parcelles agricoles'
    },
    GROUPEMENT_FONCIER_AGRICOLE: {
        label: 'Création de GFA',
        category: 'RURAL' as ActeCategory,
        description: 'Groupement Foncier Agricole'
    },
    GROUPEMENT_FONCIER_RURAL: {
        label: 'Création de GFR',
        category: 'RURAL' as ActeCategory,
        description: 'Groupement Foncier Rural'
    },

    // ========================================
    // ACTES INTERNATIONAUX
    // ========================================

    APOSTILLE: {
        label: 'Apostille',
        category: 'INTERNATIONAL' as ActeCategory,
        description: 'Certification pour usage à l\'étranger (Convention de La Haye)'
    },
    LEGALISATION: {
        label: 'Légalisation',
        category: 'INTERNATIONAL' as ActeCategory,
        description: 'Certification consulaire d\'un acte'
    },
    TRADUCTION_CERTIFIEE: {
        label: 'Traduction Certifiée Conforme',
        category: 'INTERNATIONAL' as ActeCategory,
        description: 'Traduction authentifiée par le notaire'
    },
    PROCURATION_INTERNATIONALE: {
        label: 'Procuration Internationale',
        category: 'INTERNATIONAL' as ActeCategory,
        description: 'Mandat pour agir à l\'étranger'
    },
    CERTIFICAT_COUTUME: {
        label: 'Certificat de Coutume',
        category: 'INTERNATIONAL' as ActeCategory,
        description: 'Attestation du droit applicable dans un pays'
    },
    ACTE_NOTARIE_EUROPEEN: {
        label: 'Acte Notarié Européen',
        category: 'INTERNATIONAL' as ActeCategory,
        description: 'Acte avec force exécutoire dans l\'UE'
    },

    // ========================================
    // AUTHENTIFICATIONS & CERTIFICATIONS
    // ========================================

    PROCURATION: {
        label: 'Procuration Authentique',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Mandat donné à un tiers'
    },
    PROCURATION_GENERALE: {
        label: 'Procuration Générale',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Mandat pour tous actes d\'administration'
    },
    PROCURATION_SPECIALE: {
        label: 'Procuration Spéciale',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Mandat pour un acte déterminé'
    },
    CONSTAT: {
        label: 'Constat',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Constatation matérielle de faits'
    },
    CONSTAT_ETAT_LIEUX: {
        label: 'Constat d\'État des Lieux',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Description de l\'état d\'un bien'
    },
    CONSTAT_AFFICHAGE: {
        label: 'Constat d\'Affichage',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Constatation d\'un affichage légal'
    },
    CONSTAT_INTERNET: {
        label: 'Constat Internet',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Constatation du contenu d\'un site web'
    },
    CERTIFICAT_PROPRIETE: {
        label: 'Certificat de Propriété',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Attestation de propriété d\'un bien'
    },
    CERTIFICAT_VIE: {
        label: 'Certificat de Vie',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Attestation qu\'une personne est en vie'
    },
    CERTIFICAT_HEREDITE: {
        label: 'Certificat d\'Hérédité',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Attestation de la qualité d\'héritier'
    },
    COPIE_AUTHENTIQUE: {
        label: 'Copie Authentique',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Copie certifiée conforme par le notaire'
    },
    COPIE_EXECUTOIRE: {
        label: 'Copie Exécutoire',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Copie revêtue de la formule exécutoire'
    },
    DEPOT_PIECE: {
        label: 'Dépôt de Pièce',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Dépôt d\'un document chez le notaire'
    },
    SIGNIFICATION: {
        label: 'Signification',
        category: 'AUTHENTIFICATION' as ActeCategory,
        description: 'Notification officielle d\'un acte'
    },

    // ========================================
    // AUTRES ACTES
    // ========================================

    PRET: {
        label: 'Prêt Immobilier',
        category: 'AUTRE' as ActeCategory,
        description: 'Contrat de prêt pour acquisition immobilière'
    },
    PRET_FAMILIAL: {
        label: 'Prêt Familial',
        category: 'AUTRE' as ActeCategory,
        description: 'Prêt entre membres d\'une famille'
    },
    RECONNAISSANCE_DETTE: {
        label: 'Reconnaissance de Dette',
        category: 'AUTRE' as ActeCategory,
        description: 'Acte constatant une dette'
    },
    QUITTANCE: {
        label: 'Quittance',
        category: 'AUTRE' as ActeCategory,
        description: 'Reconnaissance de paiement'
    },
    TRANSACTION: {
        label: 'Transaction',
        category: 'AUTRE' as ActeCategory,
        description: 'Accord mettant fin à un litige'
    },
    COMPROMIS_ARBITRAGE: {
        label: 'Compromis d\'Arbitrage',
        category: 'AUTRE' as ActeCategory,
        description: 'Soumission d\'un litige à un arbitre'
    },
    DEPOT_TESTAMENT_VIE: {
        label: 'Dépôt de Testament du Vivant',
        category: 'AUTRE' as ActeCategory,
        description: 'Conservation d\'un testament au fichier central'
    },
    OUVERTURE_TESTAMENT: {
        label: 'Ouverture de Testament',
        category: 'AUTRE' as ActeCategory,
        description: 'Ouverture et lecture d\'un testament après décès'
    },
    DEPOT_STATUTS: {
        label: 'Dépôt de Statuts',
        category: 'AUTRE' as ActeCategory,
        description: 'Dépôt des statuts d\'une association ou société'
    },
    CERTIFICAT_NON_INSCRIPTION: {
        label: 'Certificat de Non-Inscription',
        category: 'AUTRE' as ActeCategory,
        description: 'Attestation d\'absence d\'hypothèque ou privilège'
    },
    ETAT_HYPOTHECAIRE: {
        label: 'État Hypothécaire',
        category: 'AUTRE' as ActeCategory,
        description: 'Relevé des inscriptions grevant un bien'
    },
    BORDEREAU_INSCRIPTION: {
        label: 'Bordereau d\'Inscription',
        category: 'AUTRE' as ActeCategory,
        description: 'Demande d\'inscription d\'hypothèque'
    },
    COMMANDEMENT_PAYER: {
        label: 'Commandement de Payer',
        category: 'AUTRE' as ActeCategory,
        description: 'Mise en demeure de payer une dette'
    },
    SAISIE_IMMOBILIERE: {
        label: 'Acte de Saisie Immobilière',
        category: 'AUTRE' as ActeCategory,
        description: 'Procédure de saisie d\'un bien immobilier'
    },
    ADJUDICATION: {
        label: 'Adjudication',
        category: 'AUTRE' as ActeCategory,
        description: 'Vente aux enchères publiques'
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
            description: info.description || ''
        }));
}

export function getAllActeTypes(): Array<{ type: ActeType, label: string, category: string, description: string }> {
    return Object.entries(ACTE_TYPES).map(([type, info]) => ({
        type: type as ActeType,
        label: info.label,
        category: ACTE_CATEGORIES[info.category],
        description: info.description || ''
    }));
}

