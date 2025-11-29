# 📋 Guide du Module Pilotage (Kanban)

Ce module offre une vue visuelle et interactive pour le suivi de l'avancement des dossiers, inspirée des méthodes agiles (Kanban). Il permet de piloter l'activité de l'étude en un coup d'œil.

## Fonctionnalités

### 1. Tableau Interactif
*   **Vue en Colonnes** : Les dossiers sont organisés par étape clé du processus notarial :
    *   **Ouverture** : Dossiers fraîchement créés.
    *   **Attente Pièces** : En attente de documents clients/administratifs.
    *   **Rédaction** : Actes en cours de rédaction par les clercs.
    *   **Signature** : Actes prêts à signer ou RDV fixés.
    *   **Formalités** : Enregistrement, publicité foncière, etc.
    *   **Clôturé** : Dossiers terminés et archivés.

### 2. Gestion Drag & Drop (Glisser-Déposer)
*   **Fluidité** : Déplacez les cartes d'une colonne à l'autre simplement à la souris ou au doigt (tactile).
*   **Mise à jour instantanée** : Le statut du dossier change automatiquement lors du déplacement.

### 3. Cartes Dossiers Riches
Chaque carte affiche les informations essentielles pour une prise de décision rapide :
*   **Titre & Type** : Ex: "Vente Villa Saly" (Vente Immobilière).
*   **Client** : Nom du client principal.
*   **Priorité** : Indicateur visuel (🔴 Haute) pour les urgences.
*   **Montant** : Valeur financière du dossier (si applicable).
*   **Date** : Date de création ou de dernière modification.

## Architecture Technique

*   **Librairie** : `@dnd-kit/core` (Moteur Drag & Drop moderne et accessible).
*   **Composants** :
    *   `KanbanBoard.tsx` : Orchestrateur principal, gère l'état et les événements de drag.
    *   `KanbanColumnContainer.tsx` : Gère l'affichage d'une colonne et le tri vertical (`SortableContext`).
    *   `KanbanCardItem.tsx` : Composant carte individuel, draggable (`useSortable`).
*   **Données** : Structure flexible permettant d'ajouter/modifier des colonnes facilement (`lib/kanban/data.ts`).

## Guide d'Utilisation

1.  Accédez au menu **Pilotage (Kanban)**.
2.  **Déplacer** : Cliquez et maintenez une carte pour la déplacer vers l'étape suivante (ex: de "Rédaction" à "Signature").
3.  **Visualiser** : Repérez immédiatement les goulots d'étranglement (ex: trop de dossiers bloqués en "Attente Pièces").
4.  **Prioriser** : Traitez en priorité les cartes marquées d'une alerte rouge.

## Évolutions Futures Possibles

*   **Automatisations (Workflows)** :
    *   *Exemple* : Glisser une carte dans "Signature" envoie automatiquement un email de convocation au client.
    *   *Exemple* : Glisser dans "Clôturé" génère la facture finale.
*   **Filtres Avancés** : Filtrer par Clerc responsable, par Type d'acte, ou par Date.
*   **Mode "Swimlanes"** : Lignes horizontales pour séparer les dossiers par Clerc ou Notaire.
