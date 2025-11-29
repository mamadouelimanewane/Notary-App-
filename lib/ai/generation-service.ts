import { GoogleGenerativeAI } from "@google/generative-ai";

// Interface pour la réponse de l'IA
export interface GenerationResult {
    content: string;
    error?: string;
}

// Types de génération supportés
export type GenerationType = 'CLAUSE' | 'EMAIL' | 'SUMMARY' | 'CORRECTION';

export class GenerationService {
    private static genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

    // Prompts système pour orienter l'IA
    private static SYSTEM_PROMPTS: Record<GenerationType, string> = {
        CLAUSE: "Tu es un expert notarial en droit OHADA. Rédige une clause juridique précise, formelle et sécurisée pour un acte notarié. Utilise le vocabulaire juridique approprié. Ne mets pas de texte d'introduction, donne directement la clause.",
        EMAIL: "Tu es un notaire. Rédige un email formel, courtois et professionnel à un client. Le ton doit être rassurant et expert.",
        SUMMARY: "Tu es un assistant juridique. Résume ce texte de manière synthétique en mettant en avant les points juridiques clés.",
        CORRECTION: "Tu es un correcteur expert. Corrige ce texte, améliore le style pour le rendre plus 'notarial' et professionnel, sans changer le sens juridique."
    };

    /**
     * Génère du contenu via l'IA
     */
    static async generate(type: GenerationType, prompt: string): Promise<GenerationResult> {
        try {
            // Vérification de la clé API
            if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
                console.warn("Pas de clé API Gemini trouvée. Mode simulation activé.");
                return this.simulateGeneration(type, prompt);
            }

            // Configuration du modèle
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

            // Construction du prompt complet
            const fullPrompt = `${this.SYSTEM_PROMPTS[type]}\n\nDemande utilisateur : ${prompt}`;

            // Génération
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            return { content: text };

        } catch (error) {
            console.error("Erreur de génération IA:", error);
            // Fallback en mode simulation si erreur (ex: quota dépassé, erreur réseau)
            return this.simulateGeneration(type, prompt);
        }
    }

    /**
     * Simulation pour tester l'interface sans clé API
     */
    private static async simulateGeneration(type: GenerationType, prompt: string): Promise<GenerationResult> {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 2000));

        let content = "";
        const promptLower = prompt.toLowerCase();

        switch (type) {
            case 'CLAUSE':
                content = `CLAUSE ${prompt.toUpperCase()}\n\nEn application des dispositions de l'Acte Uniforme OHADA relatif au droit commercial général, les parties conviennent expressément de ce qui suit :\n\n${prompt}\n\nLa présente clause fait partie intégrante de l'acte et s'impose aux parties qui la reconnaissent et l'acceptent.\n\nFait à [Ville], le [Date]\n\n(Ceci est une réponse simulée - Configurez votre clé API Gemini pour des réponses réelles et adaptées)`;
                break;

            case 'EMAIL':
                // Détection du contexte de l'email
                const sujet = promptLower.includes('bonjour') || promptLower.includes('salutation')
                    ? 'Salutations'
                    : promptLower.includes('dossier')
                        ? 'Votre dossier'
                        : promptLower.includes('rendez-vous') || promptLower.includes('rdv')
                            ? 'Rendez-vous'
                            : promptLower.includes('signature')
                                ? 'Signature de votre acte'
                                : 'Correspondance';

                const destinataire = prompt.match(/à\s+(\w+)/i)?.[1] || 'Monsieur/Madame';

                content = `Objet : ${sujet}\n\nCher${destinataire !== 'Monsieur/Madame' ? ' ' + destinataire : ' Maître / ' + destinataire},\n\n${prompt}\n\nRestant à votre disposition pour toute information complémentaire, je vous prie d'agréer, ${destinataire}, l'expression de mes salutations distinguées.\n\n[Votre nom]\nNotaire\n\n(Ceci est une réponse simulée basée sur votre demande : "${prompt}")`;
                break;

            case 'CORRECTION':
                content = `[VERSION CORRIGÉE ET AMÉLIORÉE]\n\n${prompt.split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}\n\n---\nAméliorations apportées :\n- Style juridique plus formel\n- Vocabulaire notarial approprié\n- Structure claire et professionnelle\n\n(Simulation - Pour une vraie correction avec IA, configurez une clé API Gemini)`;
                break;

            case 'SUMMARY':
                const mots = prompt.split(' ').length;
                content = `RÉSUMÉ (${mots} mots → résumé)\n\nPoints clés :\n• ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}\n• Analyse juridique en cours\n• Éléments essentiels identifiés\n\nConclusion : Ce document nécessite une analyse détaillée pour identifier les clauses essentielles et les obligations des parties.\n\n(Simulation - Résumé générique basé sur "${prompt.substring(0, 30)}...")`;
                break;

            default:
                content = `Réponse à votre demande : "${prompt}"\n\nEn mode production avec l'API Gemini connectée, je générerais un contenu juridique pertinent et adapté au droit OHADA, basé précisément sur votre demande.\n\nPour activer l'IA réelle :\n1. Obtenez une clé API Gemini sur https://makersuite.google.com/app/apikey\n2. Ajoutez-la dans votre fichier .env : NEXT_PUBLIC_GEMINI_API_KEY=votre_clé`;
        }

        return { content };
    }
}
