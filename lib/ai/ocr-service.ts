import Tesseract from 'tesseract.js';

export interface ExtractedIdentity {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    idNumber?: string;
    rawText: string;
}

export class OcrService {
    /**
     * Analyse une image de pièce d'identité et extrait les informations
     */
    static async scanIdentityCard(imageFile: File): Promise<ExtractedIdentity> {
        try {
            // 1. Exécuter l'OCR
            const result = await Tesseract.recognize(
                imageFile,
                'fra', // Langue française
                {
                    logger: m => console.log(m) // Log progression
                }
            );

            const text = result.data.text;
            console.log('Texte extrait OCR:', text);

            // 2. Parser le texte pour trouver les entités
            return this.parseIdentityText(text);
        } catch (error) {
            console.error('Erreur OCR:', error);
            throw new Error("Impossible d'analyser l'image.");
        }
    }

    /**
     * Logique heuristique pour extraire les champs du texte brut
     * Adapté pour les CNI/Passeports standards (approximatif)
     */
    private static parseIdentityText(text: string): ExtractedIdentity {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const extracted: ExtractedIdentity = { rawText: text };

        // Regex simples pour détecter des motifs communs
        // Note: C'est une approche basique qui peut être améliorée avec des modèles plus spécifiques

        // Tentative de détection du NOM
        // Souvent précédé par "NOM" ou en majuscules sur les premières lignes
        const nameRegex = /(?:NOM|SURNAME)\s*[:\.]?\s*([A-Z\s]+)/i;
        const nameMatch = text.match(nameRegex);
        if (nameMatch) {
            extracted.lastName = nameMatch[1].trim();
        }

        // Tentative de détection des PRÉNOMS
        // Souvent précédé par "PRÉNOMS" ou "GIVEN NAMES"
        const firstNameRegex = /(?:PR[EÉ]NOMS?|GIVEN NAMES?)\s*[:\.]?\s*([A-Z][a-z\s\-]+)/i;
        const firstNameMatch = text.match(firstNameRegex);
        if (firstNameMatch) {
            extracted.firstName = firstNameMatch[1].trim();
        }

        // Tentative de détection de DATE DE NAISSANCE
        // Format JJ/MM/AAAA ou JJ.MM.AAAA
        const dateRegex = /(\d{2}[\/\.]\d{2}[\/\.]\d{4})/;
        const dateMatch = text.match(dateRegex);
        if (dateMatch) {
            extracted.birthDate = dateMatch[1].replace(/\./g, '/');
        }

        // Tentative de détection N° CNI / PASSEPORT
        // Souvent une suite de chiffres ou lettres/chiffres longue
        // Ex CNI Sénégal: 13 chiffres ? CNI CEDEAO...
        // On cherche un motif générique d'ID pour l'instant
        const idRegex = /(?:N°|NO|NUMERO)\s*[:\.]?\s*([A-Z0-9\s\-]{5,20})/;
        const idMatch = text.match(idRegex);
        if (idMatch) {
            extracted.idNumber = idMatch[1].trim();
        }

        return extracted;
    }
}
