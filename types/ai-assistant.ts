// Types pour l'Assistant IA Amélioré

export type AIAction =
    | 'search'
    | 'create'
    | 'update'
    | 'delete'
    | 'export'
    | 'send_notification'
    | 'schedule'
    | 'analyze'
    | 'suggest';

export type AIContext =
    | 'clients'
    | 'dossiers'
    | 'actes'
    | 'agenda'
    | 'comptabilite'
    | 'rapports'
    | 'general';

export interface AIQuery {
    id: string;
    userId: string;
    query: string; // Question de l'utilisateur
    context: AIContext;
    timestamp: string;
}

export interface AIIntent {
    action: AIAction;
    context: AIContext;
    entities: Record<string, any>; // Entités extraites (noms, dates, montants, etc.)
    confidence: number; // 0-1
}

export interface AIResponse {
    id: string;
    queryId: string;
    intent: AIIntent;
    answer: string; // Réponse textuelle
    data?: any; // Données structurées
    suggestions?: AISuggestion[];
    actions?: AIActionButton[];
    timestamp: string;
}

export interface AISuggestion {
    id: string;
    type: 'action' | 'question' | 'tip';
    title: string;
    description: string;
    icon?: string;
    action?: () => void;
}

export interface AIActionButton {
    id: string;
    label: string;
    action: AIAction;
    params: Record<string, any>;
    variant: 'primary' | 'secondary' | 'danger';
}

export interface AIConversation {
    id: string;
    userId: string;
    title: string;
    messages: AIMessage[];
    createdAt: string;
    updatedAt: string;
}

export interface AIMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    intent?: AIIntent;
    data?: any;
    timestamp: string;
}

export interface AISearchResult {
    type: 'client' | 'dossier' | 'acte' | 'appointment';
    id: string;
    title: string;
    description: string;
    metadata: Record<string, any>;
    relevance: number; // 0-1
}

// Exemples de requêtes prédéfinies
export const AI_QUERY_EXAMPLES = [
    {
        category: 'Recherche',
        queries: [
            "Trouve tous les actes de vente de 2024",
            "Clients avec paiements en retard",
            "Dossiers de Monsieur Diop",
            "Rendez-vous de la semaine prochaine",
            "Actes non signés"
        ]
    },
    {
        category: 'Actions',
        queries: [
            "Crée un rendez-vous avec Mme Fall demain à 10h",
            "Génère une facture pour le dossier #123",
            "Envoie un rappel de paiement au client X",
            "Archive le dossier #456",
            "Exporte les rapports du mois"
        ]
    },
    {
        category: 'Analyse',
        queries: [
            "Quel est mon chiffre d'affaires ce mois ?",
            "Combien de dossiers en retard ?",
            "Quels sont mes clients les plus actifs ?",
            "Statistiques des actes par type",
            "Prévisions de trésorerie"
        ]
    },
    {
        category: 'Suggestions',
        queries: [
            "Que dois-je faire aujourd'hui ?",
            "Quels dossiers nécessitent mon attention ?",
            "Y a-t-il des paiements en attente ?",
            "Quels rendez-vous sont à confirmer ?",
            "Recommandations pour améliorer ma productivité"
        ]
    }
];

// Patterns de reconnaissance d'intention
export const INTENT_PATTERNS = {
    search: [
        /trouve|cherche|recherche|affiche|montre|liste/i,
        /quels?|combien|qui/i
    ],
    create: [
        /crée|créer|ajoute|ajouter|nouveau|nouvelle/i,
        /planifie|planifier|programme|programmer/i
    ],
    update: [
        /modifie|modifier|change|changer|met à jour|mettre à jour/i
    ],
    delete: [
        /supprime|supprimer|efface|effacer|archive|archiver/i
    ],
    export: [
        /exporte|exporter|télécharge|télécharger|génère|générer/i
    ],
    send_notification: [
        /envoie|envoyer|notifie|notifier|rappelle|rappeler/i
    ],
    analyze: [
        /analyse|analyser|calcule|calculer|statistiques|rapport/i,
        /quel est|combien de|quelle est/i
    ],
    suggest: [
        /suggère|suggérer|recommande|recommander|conseille|conseiller/i,
        /que dois-je|qu'est-ce que je|aide-moi/i
    ]
};

// Entités nommées à extraire
export const ENTITY_PATTERNS = {
    date: [
        /aujourd'hui|demain|hier/i,
        /lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche/i,
        /\d{1,2}\/\d{1,2}\/\d{4}/,
        /\d{4}-\d{2}-\d{2}/
    ],
    time: [
        /\d{1,2}h\d{2}/,
        /\d{1,2}:\d{2}/,
        /à \d{1,2}h/
    ],
    amount: [
        /\d+\s*(FCFA|€|euros?|francs?)/i,
        /\d+\s*millions?/i
    ],
    name: [
        /M\.|Mme|Monsieur|Madame/i
    ],
    id: [
        /#\d+/,
        /dossier\s+\d+/i,
        /client\s+\d+/i
    ]
};
