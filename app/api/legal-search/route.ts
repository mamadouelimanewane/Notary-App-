import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI (free tier)
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        let aiResponse = '';

        // Use Gemini AI if configured
        if (genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

                const prompt = `Tu es un assistant juridique français spécialisé en droit notarial. 
Réponds à la question suivante de manière claire et précise, en citant les articles de loi pertinents si possible.

Question: ${query}

Réponds de manière concise (maximum 300 mots) et professionnelle.`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                aiResponse = response.text();
            } catch (error) {
                console.error('Gemini AI error:', error);
                aiResponse = "L'IA n'est pas disponible actuellement. Veuillez configurer votre clé API Gemini dans le fichier .env (GEMINI_API_KEY).";
            }
        } else {
            aiResponse = "Pour utiliser l'assistant IA, ajoutez votre clé API Gemini gratuite dans le fichier .env:\nGEMINI_API_KEY=votre_clé\n\nObtenez-la sur: https://makersuite.google.com/app/apikey";
        }

        // Mock legal references (in real app, would call Légifrance API)
        const results = [
            {
                title: "Code Civil - Article 931",
                summary: "Disposition générale sur les donations",
                url: "https://www.legifrance.gouv.fr"
            }
        ];

        return NextResponse.json({ aiResponse, results });

    } catch (error) {
        console.error('Error in legal search:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
