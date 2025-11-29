# Workflow de Traitement des Actes Notariés

Ce document décrit le processus de traitement des actes au sein de l'application, impliquant l'Assistante, le Clerc, le Notaire et le Comptable.

## Rôles et Responsabilités

*   **Assistant(e)** : Création des dossiers, saisie initiale des informations, préparation des brouillons.
*   **Clerc** : Rédaction juridique, vérification des pièces, validation des actes avant signature, formalités post-signature.
*   **Notaire** : Validation finale, signature électronique des actes.
*   **Comptable** : Vérification des taxes et émoluments, enregistrement comptable, validation des formalités payantes.

## États du Workflow

Le cycle de vie d'un acte passe par les états suivants :

1.  **BROUILLON** : L'acte est en cours de création.
2.  **EN_REVISION** : L'acte est soumis pour révision juridique.
3.  **VALIDE** : L'acte est validé et prêt pour la signature.
4.  **SIGNE** : L'acte a été signé par le Notaire.
5.  **ENREGISTRE** : Les formalités d'enregistrement et de paiement ont été effectuées.
6.  **ARCHIVE** : Le dossier est clos et l'acte est archivé.

## Diagramme de Transition

```mermaid
graph TD
    A[Brouillon] -->|Soumettre pour révision| B[En Révision]
    B -->|Valider| C[Validé]
    B -->|Demander corrections| A
    C -->|Signer| D[Signé]
    C -->|Rejeter| B
    D -->|Enregistrer (Formalités)| E[Enregistré]
    E -->|Archiver| F[Archivé]
```

## Détails des Actions

### 1. Création et Soumission (Assistant)
*   **Action** : `SUBMIT_REVIEW`
*   **Acteurs** : Assistant, Clerc, Notaire
*   **Transition** : `BROUILLON` -> `EN_REVISION`
*   **Description** : Une fois les informations de base saisies, l'acte est envoyé au service juridique (Clerc) pour rédaction et vérification.

### 2. Validation Juridique (Clerc)
*   **Action** : `VALIDATE`
*   **Acteurs** : Clerc, Notaire
*   **Transition** : `EN_REVISION` -> `VALIDE`
*   **Description** : Le Clerc vérifie la conformité juridique. Si tout est correct, il valide l'acte pour signature. Sinon, il peut demander des corrections (`REJECT`).

### 3. Signature (Notaire)
*   **Action** : `SIGN`
*   **Acteurs** : Notaire
*   **Transition** : `VALIDE` -> `SIGNE`
*   **Description** : Le Notaire appose sa signature électronique. Cela scelle le contenu de l'acte dans la blockchain.

### 4. Formalités et Comptabilité (Comptable/Clerc)
*   **Action** : `REGISTER`
*   **Acteurs** : Comptable, Clerc
*   **Transition** : `SIGNE` -> `ENREGISTRE`
*   **Description** : Le Comptable vérifie que les frais d'enregistrement et les émoluments sont réglés. Il marque l'acte comme enregistré une fois les formalités administratives accomplies.

### 5. Archivage (Notaire/Clerc)
*   **Action** : `ARCHIVE`
*   **Acteurs** : Notaire, Clerc
*   **Transition** : `ENREGISTRE` -> `ARCHIVE`
*   **Description** : Une fois toutes les étapes terminées, le dossier est archivé électroniquement.

## Sécurité et Traçabilité

Chaque changement d'état est enregistré dans un historique immuable et sécurisé par une chaîne de blocs (Blockchain locale), garantissant l'intégrité du processus.
