# 💾 Guide de Sauvegarde et Restauration

Ce module permet de sécuriser les données de l'application via des instantanés (snapshots) de la base de données.

## Fonctionnalités

1.  **Création de Sauvegarde** :
    *   Génère une copie instantanée du fichier `data.json`.
    *   Le fichier est stocké dans le dossier `backups/` du serveur.
    *   Format du nom : `backup-YYYY-MM-DDTHH-mm-ss-sssZ.json`.

2.  **Téléchargement** :
    *   Permet de récupérer le fichier JSON sur votre poste local pour un archivage externe (recommandé).

3.  **Restauration** :
    *   Remplace la base de données actuelle par le contenu de la sauvegarde choisie.
    *   **⚠️ Attention** : Cette action est irréversible et écrase les données actuelles. Une sauvegarde de sécurité "pre-restore" est automatiquement créée avant l'opération.
    *   L'application recharge automatiquement les données en mémoire après la restauration.

4.  **Suppression** :
    *   Permet de supprimer les anciennes sauvegardes pour libérer de l'espace.

## Sécurité

*   **Permissions** : Seuls les utilisateurs avec la permission `MANAGE_SETTINGS` (Admin) peuvent accéder à ce module.
*   **Audit** : Toutes les opérations (Création, Restauration, Suppression) sont enregistrées dans le Journal d'Audit (`/dashboard/admin/audit`).
*   **Protection** : Le système empêche l'accès aux fichiers en dehors du dossier `backups/` (Path Traversal Protection).

## Procédure de Restauration en cas de Sinistre

1.  Accédez à **Administration > Sauvegardes**.
2.  Identifiez la sauvegarde la plus récente et valide.
3.  Cliquez sur l'icône **Restaurer** (flèche circulaire).
4.  Confirmez l'action.
5.  La page se rechargera avec les données restaurées.

## Recommandations

*   Effectuez une sauvegarde **avant chaque mise à jour majeure** ou modification critique.
*   Téléchargez régulièrement les sauvegardes sur un support externe sécurisé.
