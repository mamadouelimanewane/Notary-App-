import { NextRequest, NextResponse } from 'next/server';
import { searchLegalDatabase, getLegalContext } from '@/lib/legal-knowledge';

// Initialize DeepSeek AI (open source, gratuit)
// Documentation: https://platform.deepseek.com/docs
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(req: NextRequest) {
    try {
        const { query, country } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        let aiResponse = '';

        // Recherche dans la base de connaissances locale
        const localResults = searchLegalDatabase(query, country);

        // Obtenir le contexte juridique pour enrichir la réponse IA
        const legalContext = getLegalContext(query);

        // Use DeepSeek AI if configured
        if (DEEPSEEK_API_KEY) {
            try {
                const systemPrompt = `Tu es un assistant juridique spécialisé en droit notarial sénégalais, français et africain (OHADA). 
Tu aides les notaires à trouver des informations juridiques précises.

Privilégie l'ordre suivant pour tes réponses:
1. Droit sénégalais (Code de la Famille, Code Pénal, Loi sur le Domaine National)
2. Droit OHADA (pour les aspects commerciaux)
3. Droit français (en complément)

Réponds toujours en français, de manière claire et professionnelle.
Cite les articles de loi pertinents avec leurs références exactes.`;

                const userPrompt = `${query}${legalContext}`;

                const response = await fetch(DEEPSEEK_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: 'deepseek-chat', // ou 'deepseek-coder' pour code
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ],
                        max_tokens: 800,
                        temperature: 0.3, // Plus précis que créatif
                    }),
                });

                if (!response.ok) {
                    throw new Error(`DeepSeek API error: ${response.statusText}`);
                }

                const data = await response.json();
                aiResponse = data.choices[0]?.message?.content || '';

            } catch (error) {
                console.error('DeepSeek AI error:', error);
                aiResponse = "L'IA n'est pas disponible actuellement. Veuillez vérifier votre clé API DeepSeek.";
            }
        } else {
            aiResponse = `🔑 Pour utiliser l'assistant IA DeepSeek (gratuit et open source):

1. Obtenez votre clé API gratuite sur: https://platform.deepseek.com
2. Ajoutez-la dans le fichier .env:
   DEEPSEEK_API_KEY=votre_clé

💡 DeepSeek est une alternative open source à Gemini, spécialisée en raisonnement juridique.`;
        }

        // Retourner la réponse IA et les références locales
        return NextResponse.json({
            aiResponse,
            results: localResults.map(ref => ({
                title: `${ref.country} - ${ref.code} ${ref.article}`,
                summary: ref.content,
                url: ref.url,
                category: ref.category,
                country: ref.country
            }))
        });

    } catch (error) {
        console.error('Error in legal search:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
