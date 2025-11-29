import {
    AIQuery,
    AIIntent,
    AIResponse,
    AIAction,
    AIContext,
    AISearchResult,
    AISuggestion,
    AIActionButton,
    INTENT_PATTERNS,
    ENTITY_PATTERNS
} from '@/types/ai-assistant';

/**
 * Service d'Assistant IA Amélioré
 * Traitement du langage naturel, recherche intelligente et actions automatiques
 */
export class AIAssistantService {
    /**
     * Traite une requête utilisateur
     */
    async processQuery(query: string, userId: string, context: AIContext = 'general'): Promise<AIResponse> {
        const aiQuery: AIQuery = {
            id: this.generateId(),
            userId,
            query,
            context,
            timestamp: new Date().toISOString()
        };

        // 1. Détecte l'intention
        const intent = this.detectIntent(query, context);

        // 2. Exécute l'action correspondante
        const result = await this.executeIntent(intent, userId);

        // 3. Génère des suggestions
        const suggestions = this.generateSuggestions(intent, result);

        // 4. Crée la réponse
        const response: AIResponse = {
            id: this.generateId(),
            queryId: aiQuery.id,
            intent,
            answer: result.answer,
            data: result.data,
            suggestions,
            actions: result.actions,
            timestamp: new Date().toISOString()
        };

        return response;
    }

    /**
     * Détecte l'intention de l'utilisateur
     */
    private detectIntent(query: string, context: AIContext): AIIntent {
        let action: AIAction = 'search';
        let confidence = 0.5;

        // Détecte l'action
        for (const [intentAction, patterns] of Object.entries(INTENT_PATTERNS)) {
            for (const pattern of patterns) {
                if (pattern.test(query)) {
                    action = intentAction as AIAction;
                    confidence = 0.8;
                    break;
                }
            }
            if (confidence > 0.7) break;
        }

        // Extrait les entités
        const entities = this.extractEntities(query);

        return {
            action,
            context,
            entities,
            confidence
        };
    }

    /**
     * Extrait les entités nommées de la requête
     */
    private extractEntities(query: string): Record<string, any> {
        const entities: Record<string, any> = {};

        // Date
        for (const pattern of ENTITY_PATTERNS.date) {
            const match = query.match(pattern);
            if (match) {
                entities.date = this.parseDate(match[0]);
                break;
            }
        }

        // Heure
        for (const pattern of ENTITY_PATTERNS.time) {
            const match = query.match(pattern);
            if (match) {
                entities.time = match[0];
                break;
            }
        }

        // Montant
        for (const pattern of ENTITY_PATTERNS.amount) {
            const match = query.match(pattern);
            if (match) {
                entities.amount = match[0];
                break;
            }
        }

        // Nom
        for (const pattern of ENTITY_PATTERNS.name) {
            const match = query.match(pattern);
            if (match) {
                const nameMatch = query.match(new RegExp(`${match[0]}\\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)`, 'i'));
                if (nameMatch) {
                    entities.name = nameMatch[1];
                }
                break;
            }
        }

        // ID
        for (const pattern of ENTITY_PATTERNS.id) {
            const match = query.match(pattern);
            if (match) {
                entities.id = match[0].replace(/[^\d]/g, '');
                break;
            }
        }

        return entities;
    }

    /**
     * Exécute l'intention détectée
     */
    private async executeIntent(intent: AIIntent, userId: string): Promise<{
        answer: string;
        data?: any;
        actions?: AIActionButton[];
    }> {
        switch (intent.action) {
            case 'search':
                return this.handleSearch(intent, userId);
            case 'create':
                return this.handleCreate(intent, userId);
            case 'analyze':
                return this.handleAnalyze(intent, userId);
            case 'suggest':
                return this.handleSuggest(intent, userId);
            default:
                return {
                    answer: "Je n'ai pas bien compris votre demande. Pouvez-vous reformuler ?",
                    data: null
                };
        }
    }

    /**
     * Gère les recherches
     */
    private async handleSearch(intent: AIIntent, userId: string): Promise<any> {
        const results: AISearchResult[] = [];

        // Simulation de recherche
        if (intent.context === 'clients' || intent.entities.name) {
            results.push({
                type: 'client',
                id: 'client_1',
                title: intent.entities.name || 'Marie Dupont',
                description: 'Cliente depuis 2023 - 3 dossiers actifs',
                metadata: { phone: '+221 77 123 45 67', email: 'marie@example.com' },
                relevance: 0.95
            });
        }

        if (intent.context === 'dossiers') {
            results.push({
                type: 'dossier',
                id: 'dossier_1',
                title: 'Vente Immobilière - Villa Almadies',
                description: 'En cours - Créé le 15/11/2024',
                metadata: { status: 'EN_COURS', client: 'Marie Dupont' },
                relevance: 0.9
            });
        }

        const answer = results.length > 0
            ? `J'ai trouvé ${results.length} résultat${results.length > 1 ? 's' : ''} pour votre recherche.`
            : "Aucun résultat trouvé pour votre recherche.";

        return {
            answer,
            data: results,
            actions: results.length > 0 ? [
                {
                    id: 'view_all',
                    label: 'Voir tous les résultats',
                    action: 'search',
                    params: { query: intent.entities },
                    variant: 'primary' as const
                }
            ] : undefined
        };
    }

    /**
     * Gère les créations
     */
    private async handleCreate(intent: AIIntent, userId: string): Promise<any> {
        const { date, time, name } = intent.entities;

        if (intent.context === 'agenda' && date && time) {
            return {
                answer: `Parfait ! Je peux créer un rendez-vous ${name ? `avec ${name}` : ''} le ${date} à ${time}.`,
                data: { date, time, name },
                actions: [
                    {
                        id: 'confirm_create',
                        label: 'Confirmer la création',
                        action: 'create',
                        params: { type: 'appointment', date, time, name },
                        variant: 'primary' as const
                    },
                    {
                        id: 'cancel',
                        label: 'Annuler',
                        action: 'search',
                        params: {},
                        variant: 'secondary' as const
                    }
                ]
            };
        }

        return {
            answer: "Pour créer un élément, j'ai besoin de plus d'informations. Que souhaitez-vous créer ?",
            data: null
        };
    }

    /**
     * Gère les analyses
     */
    private async handleAnalyze(intent: AIIntent, userId: string): Promise<any> {
        // Simulation d'analyse
        const analyses = {
            'chiffre d\'affaires': {
                answer: "Votre chiffre d'affaires ce mois est de 2,500,000 FCFA (+15% vs mois dernier).",
                data: { amount: 2500000, growth: 15, period: 'month' }
            },
            'dossiers en retard': {
                answer: "Vous avez 3 dossiers en retard (plus de 30 jours en cours).",
                data: { count: 3, threshold: 30 }
            },
            'clients actifs': {
                answer: "Vos 5 clients les plus actifs sont : Marie Dupont (5 dossiers), Jean Martin (4 dossiers), etc.",
                data: { clients: ['Marie Dupont', 'Jean Martin'] }
            }
        };

        // Recherche dans les analyses
        for (const [key, value] of Object.entries(analyses)) {
            if (intent.entities.query?.toLowerCase().includes(key)) {
                return value;
            }
        }

        return {
            answer: "Voici un résumé de votre activité : 45 clients, 23 dossiers actifs, 12 actes signés ce mois.",
            data: { clients: 45, dossiers: 23, actes: 12 }
        };
    }

    /**
     * Gère les suggestions
     */
    private async handleSuggest(intent: AIIntent, userId: string): Promise<any> {
        const suggestions: AISuggestion[] = [
            {
                id: 'task_1',
                type: 'action',
                title: 'Finaliser le dossier #123',
                description: 'En attente depuis 5 jours',
                icon: 'AlertTriangle'
            },
            {
                id: 'task_2',
                type: 'action',
                title: 'Rappeler Mme Fall',
                description: 'Rendez-vous à confirmer',
                icon: 'Phone'
            },
            {
                id: 'task_3',
                type: 'action',
                title: 'Envoyer facture client #456',
                description: 'Paiement en attente',
                icon: 'FileText'
            }
        ];

        return {
            answer: "Voici ce que je vous recommande de faire aujourd'hui :",
            data: suggestions,
            actions: [
                {
                    id: 'view_tasks',
                    label: 'Voir toutes les tâches',
                    action: 'search',
                    params: { type: 'tasks' },
                    variant: 'primary' as const
                }
            ]
        };
    }

    /**
     * Génère des suggestions contextuelles
     */
    private generateSuggestions(intent: AIIntent, result: any): AISuggestion[] {
        const suggestions: AISuggestion[] = [];

        // Suggestions basées sur le contexte
        if (intent.context === 'clients') {
            suggestions.push({
                id: 'create_client',
                type: 'action',
                title: 'Créer un nouveau client',
                description: 'Ajouter un client à votre base',
                icon: 'UserPlus'
            });
        }

        if (intent.context === 'dossiers') {
            suggestions.push({
                id: 'create_dossier',
                type: 'action',
                title: 'Créer un nouveau dossier',
                description: 'Ouvrir un nouveau dossier',
                icon: 'FolderPlus'
            });
        }

        // Questions de suivi
        suggestions.push({
            id: 'follow_up',
            type: 'question',
            title: 'Voulez-vous plus de détails ?',
            description: 'Je peux vous fournir des informations supplémentaires',
            icon: 'HelpCircle'
        });

        return suggestions.slice(0, 3); // Maximum 3 suggestions
    }

    /**
     * Parse une date en format lisible
     */
    private parseDate(dateStr: string): string {
        const today = new Date();

        if (/aujourd'hui/i.test(dateStr)) {
            return today.toLocaleDateString('fr-FR');
        }

        if (/demain/i.test(dateStr)) {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toLocaleDateString('fr-FR');
        }

        if (/hier/i.test(dateStr)) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return yesterday.toLocaleDateString('fr-FR');
        }

        return dateStr;
    }

    /**
     * Recherche intelligente dans toutes les données
     */
    async smartSearch(query: string, userId: string): Promise<AISearchResult[]> {
        // TODO: Implémenter la recherche dans la base de données
        // Pour l'instant, retourne des résultats simulés
        return [];
    }

    // Utilitaires
    private generateId(): string {
        return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Instance singleton
export const aiAssistant = new AIAssistantService();
