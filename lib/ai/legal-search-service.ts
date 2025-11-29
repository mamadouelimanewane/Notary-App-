import { OHADA_DATA, LegalArticle } from './legal-data';
import { GenerationService } from './generation-service';

export interface SearchResult {
    answer: string;
    sources: LegalArticle[];
    isSimulated?: boolean;
}

export class LegalSearchService {

    /**
     * Effectue une recherche juridique sémantique (RAG)
     */
    static async search(query: string): Promise<SearchResult> {
        // 1. Récupération (Retrieval) : Trouver les articles pertinents
        const relevantArticles = this.findRelevantArticles(query);

        // Si aucun article pertinent n'est trouvé
        if (relevantArticles.length === 0) {
            return {
                answer: "Je n'ai pas trouvé d'articles spécifiques dans ma base de connaissances OHADA correspondant à votre demande. Veuillez reformuler ou préciser votre question.",
                sources: []
            };
        }

        // 2. Augmentation (Augmentation) : Créer le contexte
        const context = relevantArticles.map(a =>
            `[${a.source} - ${a.article}] ${a.title}: ${a.content}`
        ).join('\n\n');

        const prompt = `
Contexte Juridique (OHADA) :
${context}

Question de l'utilisateur : "${query}"

Consignes :
En utilisant UNIQUEMENT le contexte juridique fourni ci-dessus, réponds à la question de l'utilisateur.
Cite précisément les articles (ex: "Selon l'article 309 de l'AUDSCGIE...").
Si la réponse n'est pas dans le contexte, dis-le clairement.
Sois précis, professionnel et synthétique.
    `;

        // 3. Génération (Generation)
        try {
            const result = await GenerationService.generate('SUMMARY', prompt); // On utilise le type SUMMARY comme proxy générique

            return {
                answer: result.content,
                sources: relevantArticles
            };
        } catch (error) {
            console.error("Erreur RAG:", error);
            return {
                answer: "Une erreur est survenue lors de l'analyse juridique.",
                sources: relevantArticles
            };
        }
    }

    /**
     * Algorithme de recherche simple (Keyword Matching pondéré)
     * Simule une recherche vectorielle pour ce prototype
     */
    private static findRelevantArticles(query: string): LegalArticle[] {
        const terms = query.toLowerCase()
            .replace(/[.,\?]/g, '')
            .split(' ')
            .filter(w => w.length > 2); // Ignore les mots courts (le, la, de...)

        const scoredArticles = OHADA_DATA.map(article => {
            let score = 0;
            const contentLower = (article.content + " " + article.title + " " + article.keywords.join(" ")).toLowerCase();

            terms.forEach(term => {
                if (contentLower.includes(term)) {
                    score += 1;
                    // Bonus si le mot est dans le titre ou les mots-clés
                    if (article.title.toLowerCase().includes(term)) score += 2;
                    if (article.keywords.includes(term)) score += 3;
                }
            });

            return { article, score };
        });

        // Trier par score décroissant et garder ceux qui ont un score > 0
        return scoredArticles
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3) // Garder les 3 meilleurs
            .map(item => item.article);
    }
}
