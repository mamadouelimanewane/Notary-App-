# 📘 MODULE BARÈME NOTARIAL - DOCUMENTATION FINALE (29 TYPES)

## 🌟 Introduction
Ce module est un système complet et modulaire de calcul des provisions pour frais et honoraires notariaux. Il supporte **29 types d'actes distincts**, couvrant la quasi-totalité des opérations courantes d'une étude notariale (Droit des sociétés, Immobilier, Famille, Crédit).

Le système est conçu pour être :
*   **Précis** : Respecte scrupuleusement les barèmes légaux (décrets officiels).
*   **Complet** : Gère les honoraires, la TVA, les droits d'enregistrement, et les frais fixes (greffe, publicité, etc.).
*   **Modulaire** : Chaque type de calcul est isolé, facilitant la maintenance et l'ajout de nouveaux types.
*   **Ergonomique** : Interface utilisateur intuitive regroupant les actes par catégories.

---

## 📊 Liste des 29 Types d'Actes Supportés

### 🏢 1. Droit des Sociétés - Constitution (7 Types)
*   **SARL - Apport en Numéraire** (`SARL_NUMERAIRE`) : Calcul sur le capital social.
*   **SARL - Apport en Nature** (`SARL_NATURE`) : Distingue les apports en nature et en numéraire.
*   **SCI - Apport en Numéraire** (`SCI_NUMERAIRE`) : Calcul standard pour les SCI.
*   **SCI - Apport en Nature** (`SCI_NATURE`) : Gestion spécifique des apports immobiliers.
*   **SA avec Conseil d'Administration** (`SA_CA_NUMERAIRE`) : Barème spécifique aux SA.
*   **SA avec Administrateur Général** (`SA_AG_NUMERAIRE`) : Variante de la SA.
*   **SA - Apport en Nature** (`SA_NATURE`) : Constitution de SA avec apports en nature.

### 📈 2. Droit des Sociétés - Vie Sociale (9 Types)
*   **SARL - Augmentation de Capital** (`SARL_AUGMENTATION`) : Calcul sur le nouveau capital.
*   **SARL - Augmentation (Mixte)** (`SARL_AUGMENTATION_NATURE`) : Augmentation avec apports en nature et numéraire.
*   **SCI - Augmentation de Capital** (`SCI_AUGMENTATION`) : Pour les SCI existantes.
*   **SCI - Augmentation (Mixte)** (`SCI_AUGMENTATION_NATURE`) : Cas complexe pour les SCI.
*   **SA - Augmentation de Capital** (`SA_AUGMENTATION`) : Mise à jour du capital pour les SA.
*   **Dissolution de Société** (`DISSOLUTION`) : Frais fixes et proportionnels sur le boni de liquidation.
*   **Réduction de Capital** (`REDUCTION_CAPITAL`) : Calcul sur le montant de la réduction.
*   **Transformation de Société** (`TRANSFORMATION`) : Changement de forme juridique.
*   **Cession de Parts SCI** (`CESSION_PARTS_SCI`) : Calcul sur le prix de cession.

### 🏠 3. Immobilier & Crédit (7 Types)
*   **Vente Immobilière** (`VENTE_1`) : Vente classique (Taux 1% ou autre selon config).
*   **Vente par Adjudication** (`VENTE_ADJUDICATION`) : Vente aux enchères (Taux spécifique).
*   **Ouverture de Crédit Hypothécaire** (`CREDIT_HYPOTHECAIRE`) : Calcul sur le montant du prêt garanti.
*   **Mainlevée Hypothécaire** (`MAINLEVEE`) : Acte de libération d'hypothèque.
*   **Dation en Paiement (5%)** (`DATION_PAIEMENT`) : Paiement d'une dette par remise d'un bien.
*   **Dation en Paiement (10%)** (`DATION_PAIEMENT_10`) : Variante avec taux d'enregistrement majoré.
*   **Taxe de Plus-Value Immobilière** (`TAXE_PLUS_VALUE`) : Calcul fiscal sur la revente (hors honoraires).

### 🤝 4. Baux & Commerce (4 Types)
*   **Location Gérance** (`LOCATION_GERANCE`) : Calcul sur les loyers cumulés.
*   **Bail Commercial** (`BAIL_COMMERCIAL`) : Bail pour locaux commerciaux.
*   **Bail d'Habitation** (`BAIL_HABITATION`) : Bail résidentiel (Taux réduit).
*   **Cession de Créances** (`CESSION_CREANCES`) : Transfert de dettes/créances.

### 👨‍👩‍👧‍👦 5. Famille & Partage (2 Types)
*   **Partage de Communauté** (`PARTAGE_COMMUNAUTE`) : Liquidation (Divorce, etc.).
*   **Partage de Biens Indivis** (`PARTAGE_INDIVIS`) : Sortie d'indivision avec soulte.

---

## 🛠️ Architecture Technique

### Structure des Fichiers
```
lib/bareme/
├── baremes/                 # 29 fichiers de logique métier (un par type)
│   ├── sarl-numeraire.ts
│   ├── vente-1.ts
│   ├── partage-communaute.ts
│   └── ...
├── types.ts                 # Définitions TypeScript (Interfaces, Enums)
└── index.ts                 # Point d'entrée unique (Exports)
```

### API Route
*   **Endpoint** : `POST /api/bareme/calcul-provision`
*   **Authentification** : Requiert une session active (`next-auth`).
*   **Corps de la Requête** :
    ```json
    {
      "type": "SARL_NUMERAIRE",
      "capital": 1000000
      // ... autres champs selon le type
    }
    ```
*   **Réponse (Succès)** :
    ```json
    {
      "typeSociete": "SARL_NUMERAIRE",
      "capital": 1000000,
      "honoraires": 450000,
      "tva": 81000,
      "enregistrement": 10000,
      "fraisFixe": { "greffe": 30000, ... },
      "totalHT": 500000,
      "totalTTC": 581000,
      "details": { ... }
    }
    ```

---

## 💻 Guide Utilisateur (Calculateur)

Le calculateur est accessible via le tableau de bord (`/dashboard/bareme/calcul-provision`).

### 1. Sélection du Type
Utilisez le menu déroulant pour choisir l'acte. Les actes sont regroupés par catégories pour une recherche rapide.

### 2. Saisie des Données
Le formulaire s'adapte dynamiquement.
*   *Exemple Vente* : Saisissez le "Prix de Vente".
*   *Exemple Bail* : Saisissez le "Loyer Mensuel" et la "Durée".
*   *Exemple Société* : Saisissez le "Capital Social".

### 3. Résultats
Cliquez sur **"Calculer la Provision"**.
*   **Résumé** : Affiche le montant total à provisionner.
*   **Détail Honoraires** : Montre le calcul tranche par tranche.
*   **Détail Frais** : Liste les taxes (enregistrement) et débours (greffe, etc.).

---

## 🚀 Évolutions Possibles

1.  **Génération PDF** : Ajouter un bouton pour télécharger un devis formel au format PDF.
2.  **Sauvegarde** : Enregistrer les calculs dans le dossier client.
3.  **Personnalisation** : Permettre à l'administrateur de modifier les taux ou les frais fixes via une interface de configuration.

---
*Généré par l'Assistant IA - Système Barème Notarial v2.0*
