---
description: Workflow complet pour la gestion d'un acte notarié de vente immobilière, de l'ouverture du dossier à la clôture.
---

# Workflow : Acte Notarié - Vente Immobilière

Ce workflow décrit les étapes standard pour traiter un dossier de vente immobilière dans l'application Notary App.

## 1. Phase Initiale : Ouverture du Dossier et Collecte d'Informations

### 1.1. Contact et Rendez-vous
- **Action** : Créer une fiche "Prospect" ou "Client" si elle n'existe pas.
- **Responsable** : Secrétariat / Notaire.
- **Note** : L'initiateur peut être le vendeur ou l'acheteur.

### 1.2. Ouverture du Dossier
- **Action** : Créer un nouveau dossier dans le module "Dossiers".
- **Type de dossier** : Vente Immobilière.
- **Données requises** :
    - Identité Vendeur (Personne physique ou morale).
    - Identité Acquéreur.
    - Désignation sommaire du bien.
    - Prix présumé.
- **Responsable** : Clerc / Collaborateur.

### 1.3. Collecte des Pièces Initiales
- **Action** : Utiliser l'onglet "Pièces" du dossier pour uploader les documents.
- **Checklist Obligatoire** :
    - [ ] Pièces d'identité des parties (CNI, Passeport).
    - [ ] Titre Foncier (TF) ou copie.
    - [ ] Certificat de mariage / situation matrimoniale.
    - [ ] Statuts (si société).
- **Responsable** : Clerc.

## 2. Phase Pré-Contractuelle : L'Avant-Contrat

### 2.1. Rédaction de l'Avant-Contrat
- **Action** : Générer le document "Promesse de Vente" ou "Compromis" depuis les modèles d'actes.
- **Détails** : Inclure les conditions suspensives (obtention de prêt, purge droit de préemption, etc.).
- **Responsable** : Clerc.

### 2.2. Réception du Dépôt de Garantie
- **Action** : Enregistrer l'encaissement dans le module "Comptabilité".
- **Type** : Dépôt / Acompte.
- **Document** : Générer un "Reçu de paiement" pour l'acquéreur.
- **Responsable** : Comptable / Formaliste.

### 2.3. Signature de l'Avant-Contrat
- **Action** : Scanner et uploader l'avant-contrat signé dans le dossier (Sous-dossier "Avant-Contrat").
- **Note** : Vérifier la date de validité pour la vente définitive.
- **Responsable** : Notaire et Parties.

## 3. Phase d'Étude et Vérifications

### 3.1. Vérifications Administratives
- **Action** : Lancer les demandes de pièces administratives.
- **Tâches** :
    - [ ] Demande d'État Réel (Conservation Foncière) pour vérifier les charges/hypothèques.
    - [ ] Vérification situation fiscale du vendeur (Quitus fiscal).
    - [ ] Vérification urbanisme (si applicable).
- **Responsable** : Clerc / Formaliste.

## 4. Phase de Production de l'Acte Authentique

### 4.1. Préparation Financière (Taxe et Frais)
- **Action** : Utiliser le **Calculateur de Provision** (Module Barème).
- **Type** : `VENTE_1` (ou autre selon le cas).
- **Tâche** : Générer le décompte financier final (Prix + Frais + Taxes - Acompte).
- **Vérification** : S'assurer que l'acquéreur a viré le solde complet sur le compte de l'étude AVANT la signature.
- **Responsable** : Comptable / Clerc.

### 4.2. Rédaction et Impression
- **Action** : Finaliser la rédaction de l'Acte de Vente Authentique.
- **Contenu** : Intégrer les résultats des vérifications (origine de propriété, situation hypothécaire).
- **Responsable** : Notaire / Clerc Principal.

### 4.3. Signature et Solde
- **Action** : Rendez-vous de signature.
- **Comptabilité** : Déclencher le paiement du prix au vendeur (après déduction des frais éventuels et remboursement hypothèques).
- **Responsable** : Notaire.

## 5. Après Signature : Formalités et Archivage

### 5.1. Enregistrement Fiscal
- **Action** : Payer les droits d'enregistrement aux impôts.
- **Document** : Scanner la quittance et l'acte enregistré.
- **Responsable** : Formaliste.

### 5.2. Mutation du Titre Foncier
- **Action** : Dépôt à la Conservation Foncière pour mutation.
- **Suivi** : Mettre à jour le statut du dossier ("En attente de mutation").
- **Responsable** : Formaliste.

### 5.3. Clôture du Dossier
- **Action** :
    1. Vérifier que le nouveau Titre Foncier est établi au nom de l'acquéreur.
    2. Remettre les copies authentiques aux parties.
    3. Archiver la minute (original) au rang des minutes de l'étude.
    4. Changer le statut du dossier à "Clôturé".
- **Responsable** : Archiviste / Notaire.
