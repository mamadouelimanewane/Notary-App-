# 🌳 Guide du Simulateur Successoral

Ce module permet de modéliser la dévolution successorale d'un dossier et de visualiser graphiquement la répartition du patrimoine entre les héritiers.

## Fonctionnalités

### 1. Modélisation Familiale
*   **Ajout d'héritiers** : Interface simple pour ajouter le Conjoint Survivant, les Enfants, et les Parents.
*   **Contrôles de cohérence** : Le système empêche d'ajouter plusieurs conjoints (monogamie par défaut) ou des configurations impossibles.
*   **Liste dynamique** : Gestion facile (ajout/suppression) des membres de la famille.

### 2. Moteur de Calcul (Droit Civil / OHADA)
Le moteur (`lib/succession/engine.ts`) applique les règles standards de dévolution :
*   **Réserve Héréditaire** : Calcul automatique de la part réservée aux enfants selon leur nombre (50%, 66%, 75%).
*   **Quotité Disponible** : Calcul de la part dont le défunt peut disposer librement.
*   **Droits du Conjoint** : Attribution d'une part théorique (1/4 en pleine propriété dans cette version) en concours avec les enfants.

### 3. Visualisation
*   **Graphique Interactif** : Un diagramme circulaire (Pie Chart) montre instantanément "qui reçoit quoi".
*   **Chiffrage** : Calcul des montants en FCFA basé sur l'actif net déclaré.
*   **Explications** : Génération automatique d'un texte explicatif juridique justifiant le calcul.

## Architecture Technique

*   **Page** : `app/dashboard/succession/page.tsx`
*   **Logique Métier** : `lib/succession/engine.ts`
*   **Visualisation** : Librairie `recharts` pour les graphiques.

## Guide d'Utilisation

1.  Accédez au menu **Simulateur Successoral**.
2.  Dans la colonne de gauche, **construisez la famille** :
    *   Ajoutez le conjoint survivant (si existant).
    *   Ajoutez les enfants du défunt.
3.  Saisissez le montant de l'**Actif Net** (Patrimoine total à partager).
4.  Le graphique à droite se met à jour en temps réel.
5.  Consultez le panneau "Analyse Juridique" pour voir les taux de réserve et de quotité disponible.

## Évolutions Futures Possibles

*   **Gestion de la Polygamie** : Adapter le moteur pour gérer plusieurs épouses (fréquent en zone OHADA).
*   **Usufruit vs Nue-Propriété** : Affiner le choix du conjoint.
*   **Représentation** : Gérer les petits-enfants venant en représentation d'un enfant prédécédé.
*   **Export PDF** : Générer un rapport imprimable pour le client.
