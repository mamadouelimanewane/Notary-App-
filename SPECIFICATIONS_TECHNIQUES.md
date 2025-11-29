# Spécifications Techniques - Application de Gestion Notariale

## 1. Vue d'ensemble
L'application est une solution de gestion d'office notarial (Notary Office Management System) conçue pour être autonome, performante et facile à déployer. Elle est inspirée des standards de l'industrie (Genapi, Septeo) mais adaptée pour une infrastructure légère et moderne.

## 2. Infrastructure Matérielle Requise (Serveur / Poste Principal)
Pour un fonctionnement optimal dans un cabinet de 1 à 10 utilisateurs :

*   **Processeur (CPU)** : Intel Core i5 (8ème gen+) ou AMD Ryzen 5 (série 3000+). Minimum 4 cœurs.
*   **Mémoire Vive (RAM)** : 
    *   Minimum : 8 GB
    *   Recommandé : 16 GB (surtout pour le traitement de documents et l'IA locale).
*   **Stockage** : 
    *   Disque SSD obligatoire (NVMe recommandé).
    *   Espace : 256 GB minimum (dépend du volume de documents scannés/archivés).
*   **Réseau** : Connexion Ethernet Gigabit pour le serveur.
*   **Système d'Exploitation** : 
    *   Windows 10/11 Pro (Recommandé pour la compatibilité avec les périphériques notariaux).
    *   Compatible Linux (Ubuntu 22.04+) ou macOS pour le serveur.

## 3. Stack Technologique (Logiciel)

### Langage et Framework
*   **Langage** : TypeScript (v5+) pour une robustesse et un typage strict.
*   **Framework Principal** : Next.js 14+ (App Router).
    *   Utilisation intensive des **Server Actions** pour la logique backend.
    *   Rendu Hybride (SSR/CSR) pour la performance.
*   **Interface Utilisateur (UI)** :
    *   **React 18+**.
    *   **Tailwind CSS** pour le stylisme utilitaire.
    *   **Shadcn/ui** (basé sur Radix UI) pour les composants accessibles et modernes.
    *   **Lucide React** pour les icônes.

### Outils de Développement Requis
Pour maintenir ou étendre l'application, les outils suivants sont nécessaires :
*   **Node.js** : Version 18.17.0 ou supérieure (LTS recommandée).
*   **NPM** : Gestionnaire de paquets (inclus avec Node.js).
*   **Git** : Pour le versionning du code.
*   **VS Code** : Éditeur recommandé avec extensions (ESLint, Prettier, Tailwind CSS).

## 4. Base de Données et Stockage

### Type de Base de Données
Actuellement, l'application utilise une **Base de Données JSON Locale** (Custom JSON File Adapter).
*   **Architecture** : Les données sont stockées dans des fichiers `.json` structurés dans le dossier `/data`.
*   **Avantages** :
    *   Zéro configuration (pas de serveur SQL à installer).
    *   Portabilité totale (copier le dossier = sauvegarder la base).
    *   Lisibilité humaine des données.

### Limites et Contraintes
*   **Concurrence** : Risque de conflits si plusieurs écritures simultanées millimétrées (géré via file d'attente mémoire, mais pas aussi robuste qu'un SGBD transactionnel).
*   **Volume** : Performance dégradée si les fichiers JSON dépassent ~100MB chacun (chargement en mémoire).
*   **Intégrité** : Pas de contraintes de clé étrangère natives (gérées par le code applicatif).

### Évolution Possible
L'architecture "Repository Pattern" utilisée (`lib/db.ts`) permet de migrer facilement vers :
*   **SQLite** (via Better-SQLite3 ou Prisma) pour une meilleure performance locale.
*   **PostgreSQL** (via Prisma) pour une installation multi-utilisateurs robuste en réseau.

## 5. Services Tiers et APIs Indispensables

Pour activer toutes les fonctionnalités, les comptes/clés API suivants sont requis :

1.  **Intelligence Artificielle (OBLIGATOIRE pour les modules IA)**
    *   **Fournisseur** : Google Gemini (Google AI Studio).
    *   **Usage** : Génération de clauses, résumé de dossiers, extraction de données.
    *   **Coût** : Gratuit (tier free) ou Payant selon volume.

2.  **Emails (Recommandé)**
    *   **Fournisseur** : SendGrid, Resend, ou SMTP standard (OVH, Gmail, etc.).
    *   **Usage** : Notifications clients, envoi d'actes, rappels de RDV.

3.  **Stockage Cloud (Optionnel)**
    *   Actuellement stockage local. Possibilité de connecter AWS S3 ou Google Drive pour les backups.

## 6. Modules Fonctionnels Implémentés
*   **Gestion des Dossiers** : Workflow, Tâches, Délais.
*   **Rédaction d'Actes** : Éditeur riche, Templates, Variables dynamiques.
*   **Comptabilité** : Journal, Grand Livre, Rapprochement Bancaire (Normes OHADA).
*   **CRM** : Gestion clients, KYC.
*   **Agenda** : Prise de RDV, Synchronisation.

## 7. Liens Utiles
*   **Next.js Documentation** : [https://nextjs.org/docs](https://nextjs.org/docs)
*   **Tailwind CSS** : [https://tailwindcss.com/](https://tailwindcss.com/)
*   **Google AI Studio** : [https://aistudio.google.com/](https://aistudio.google.com/)
*   **React Email** (pour les templates mails) : [https://react.email/](https://react.email/)

---
*Généré par l'Assistant Technique Gravity - 29/11/2025*
