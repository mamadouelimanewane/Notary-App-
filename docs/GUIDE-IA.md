# 🤖 Guide des Fonctionnalités d'Intelligence Artificielle

Ce document détaille les modules d'IA intégrés à l'application Notaire OHADA, leur fonctionnement technique et leur utilisation.

## Sommaire
1.  [Vue d'ensemble](#vue-densemble)
2.  [OCR Intelligent (Extraction d'Identité)](#1-ocr-intelligent-extraction-didentité)
3.  [Assistant de Rédaction (Génération de Contenu)](#2-assistant-de-rédaction-génération-de-contenu)
4.  [Recherche Juridique Sémantique (RAG)](#3-recherche-juridique-sémantique-rag)
5.  [Configuration Technique](#configuration-technique)

---

## Vue d'ensemble

L'application intègre trois piliers d'IA pour augmenter la productivité notariale :
*   **Vision** : Lecture automatique de documents (CNI, Passeports).
*   **Génération** : Rédaction assistée de clauses et courriers.
*   **Recherche** : Interrogation en langage naturel de la base juridique OHADA.

---

## 1. OCR Intelligent (Extraction d'Identité)

Permet de remplir automatiquement la fiche d'un nouveau client en scannant sa pièce d'identité.

### Fonctionnalités
*   **Drag & Drop** : Interface intuitive pour déposer les fichiers images.
*   **Extraction** : Récupération du Nom, Prénom, Date de Naissance et N° de Pièce.
*   **Pré-remplissage** : Les champs du formulaire se remplissent automatiquement.

### Architecture Technique
*   **Librairie** : `tesseract.js` (Exécution locale dans le navigateur via WebAssembly).
*   **Service** : `lib/ai/ocr-service.ts`
*   **Composant UI** : `components/ai/IdCardScanner.tsx`
*   **Logique** : Utilisation d'expressions régulières (Regex) heuristiques pour parser le texte brut extrait par l'OCR.

### Utilisation
1.  Aller dans **Clients > Nouveau Client**.
2.  Glisser une image de CNI ou Passeport dans la zone dédiée.
3.  Vérifier les données extraites et compléter si nécessaire.

---

## 2. Assistant de Rédaction (Génération de Contenu)

Un assistant conversationnel pour aider à la rédaction d'actes et de correspondances.

### Fonctionnalités
*   **Rédaction de Clauses** : Génération de clauses juridiques OHADA spécifiques.
*   **Rédaction d'Emails** : Création de courriers types professionnels.
*   **Correction** : Amélioration du style et correction orthographique.

### Architecture Technique
*   **Moteur** : Google Gemini Pro (`@google/generative-ai`).
*   **Service** : `lib/ai/generation-service.ts`
*   **Composant UI** : `components/ai/WritingAssistant.tsx`
*   **Page** : `app/dashboard/assistant/page.tsx`
*   **Sécurité** : Utilisation de "System Prompts" pour garantir un ton juridique et sécurisé.
*   **Fallback** : Mode simulation activé automatiquement si aucune clé API n'est configurée.

### Utilisation
1.  Aller dans **Assistant IA** via le menu latéral.
2.  Choisir le type de tâche (Clause, Email, Correction).
3.  Décrire le besoin (ex: "Clause de non-concurrence pour un gérant de SARL").
4.  Copier le résultat généré.

---

## 3. Recherche Juridique Sémantique (RAG)

Un moteur de recherche qui comprend les questions en langage naturel et répond en citant les articles de loi.

### Fonctionnalités
*   **Compréhension** : Analyse de questions complexes (ex: "Quel est le délai de prescription...").
*   **Recherche** : Identification des articles pertinents dans la base OHADA.
*   **Synthèse** : Génération d'une réponse claire résumant les articles trouvés.
*   **Sources** : Affichage des articles de loi utilisés pour la réponse.

### Architecture Technique (RAG - Retrieval Augmented Generation)
1.  **Retrieval (Récupération)** :
    *   Base de connaissances : `lib/ai/legal-data.ts` (JSON structuré des Actes Uniformes).
    *   Algorithme : Scoring par mots-clés pondérés (Simulation de recherche vectorielle).
2.  **Augmentation** :
    *   Construction d'un prompt contenant la question utilisateur + les articles trouvés.
3.  **Génération** :
    *   Appel à l'IA (Gemini) pour synthétiser la réponse à partir du contexte fourni.

*   **Service** : `lib/ai/legal-search-service.ts`
*   **API** : `app/api/ai/legal-search/route.ts`
*   **Page** : `app/dashboard/recherche-juridique/page.tsx`

### Utilisation
1.  Aller dans **Recherche Juridique**.
2.  Poser une question (ex: "Comment constituer une SA ?").
3.  Lire la réponse synthétique et consulter les sources citées.

---

## Configuration Technique

### Variables d'Environnement
Pour activer pleinement l'IA (hors mode simulation), ajoutez votre clé API Gemini dans le fichier `.env` :

```env
NEXT_PUBLIC_GEMINI_API_KEY=votre_clé_api_ici
```

### Extension Future
*   **Vector Database** : Remplacer la recherche par mots-clés par une vraie base vectorielle (Pinecone, pgvector) pour une meilleure précision sémantique.
*   **Modèles Locaux** : Intégrer des modèles open-source (Llama 3, Mistral) pour une confidentialité totale des données.
