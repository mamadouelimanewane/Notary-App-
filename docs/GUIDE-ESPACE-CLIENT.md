# 🔐 Guide de l'Espace Client VIP (Extranet)

Ce module offre aux clients de l'étude un portail sécurisé accessible 24/7 pour suivre leurs dossiers, renforçant ainsi la transparence et la confiance.

## Fonctionnalités

### 1. Tableau de Bord Personnalisé
*   **Accueil** : Message de bienvenue personnalisé.
*   **Synthèse** : Vue immédiate du nombre de dossiers en cours.

### 2. Suivi des Dossiers (Timeline)
*   **Barre de Progression** : Visualisation graphique de l'avancement (ex: 75%).
*   **Statut** : État actuel clair (ex: "Signature", "Rédaction").
*   **Prochaine Étape** : Indication précise de l'action attendue (ex: "Signature le 15/04").

### 3. Gestion Documentaire
*   **Téléchargement** : Accès direct aux documents partagés par le notaire (Projets d'actes, Appels de fonds, Reçus).
*   **Sécurité** : Plus besoin d'envoyer des pièces sensibles par email non sécurisé.

### 4. Relation Client
*   **Contact Rapide** : Coordonnées du notaire et bouton de contact direct.
*   **FAQ** : Réponses aux questions fréquentes pour rassurer le client.

## Architecture Technique

*   **Route** : `/portal` (Séparé du `/dashboard` métier).
*   **Layout** : Design spécifique "Grand Public", épuré et rassurant (`app/portal/layout.tsx`).
*   **Authentification** : Page de login dédiée (`/portal/login`). Dans une version de production, l'accès se ferait via Email + Mot de passe ou Lien magique.
*   **Données** : Les données affichées sont une vue filtrée des dossiers réels de l'étude.

## Guide d'Utilisation (Côté Notaire)

1.  **Inviter un Client** : Créez un compte client dans l'admin et communiquez-lui ses accès.
2.  **Partager un Document** : Depuis le dossier, marquez un document comme "Visible Client".
3.  **Mettre à jour** : L'avancement du dossier dans le Kanban met automatiquement à jour la barre de progression du client.

## Avantages Concurrentiels

*   **Transparence** : Le client ne se demande plus "où ça en est".
*   **Modernité** : Image d'une étude à la pointe de la technologie.
*   **Gain de temps** : Moins d'appels téléphoniques pour des questions simples.
