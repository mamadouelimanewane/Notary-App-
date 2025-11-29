# 🛡️ Guide de Sécurité et Gestion des Accès (RBAC)

Ce module assure la sécurité de l'application notariale via une gestion fine des rôles (RBAC) et une traçabilité complète des actions (Audit Logs).

## 1. Rôles et Permissions

L'application définit 6 rôles distincts, chacun avec des permissions spécifiques :

| Rôle | Description | Permissions Clés |
|------|-------------|------------------|
| **ADMIN** | Administrateur Système | Accès total, Gestion utilisateurs, Audit, Paramètres |
| **NOTAIRE** | Notaire Associé/Salarié | Création/Validation Actes, Comptabilité (Lecture), Clients |
| **CLERC** | Clerc de Notaire | Rédaction Actes, Gestion Dossiers, Clients |
| **ASSISTANT** | Assistant(e) Juridique | Lecture Dossiers/Actes, Gestion Clients (Simple) |
| **COMPTABLE** | Comptable Taxateur | Saisie Comptable, États Financiers, Facturation |
| **SECRETAIRE** | Secrétaire / Accueil | Accueil Client, Prise de RDV, Messagerie |

### Définitions Techniques
*   **Fichier** : `lib/rbac.ts`
*   **Logique** : Les permissions sont vérifiées côté serveur via `requirePermission()` avant chaque action sensible.

## 2. Gestion des Utilisateurs

L'interface d'administration (`/dashboard/admin/users`) permet de :
*   Créer de nouveaux collaborateurs.
*   Attribuer/Modifier des rôles.
*   Désactiver un compte (départ d'un collaborateur) sans supprimer l'historique.
*   Réinitialiser les mots de passe.

## 3. Journal d'Audit (Traçabilité)

Pour répondre aux exigences de sécurité notariale, toutes les actions sensibles sont enregistrées dans un journal inaltérable (`/dashboard/admin/audit`).

**Actions tracées :**
*   Connexions / Déconnexions
*   Création/Modification/Suppression d'utilisateurs
*   Suppression de dossiers ou d'actes
*   Validation d'écritures comptables

**Données conservées :**
*   Qui (Utilisateur)
*   Quoi (Action & Ressource)
*   Quand (Horodatage précis)
*   Détails (Valeurs modifiées)

## 4. Sécurité Technique

*   **Mots de passe** : Hachage fort avec `bcrypt`.
*   **API** : Protection de toutes les routes API par vérification de session et de permission.
*   **Architecture** : Séparation stricte entre le code client et les vérifications serveur (`lib/auth-guard.ts`).

## Guide d'Utilisation (Admin)

1.  **Créer un utilisateur** :
    *   Allez dans **Administration > Gérer les utilisateurs**.
    *   Cliquez sur **Nouvel Utilisateur**.
    *   Remplissez les infos et choisissez le Rôle approprié.
    *   Le mot de passe initial doit être communiqué de manière sécurisée.

2.  **Vérifier une action suspecte** :
    *   Allez dans **Administration > Journal d'Audit**.
    *   Utilisez la recherche pour filtrer par utilisateur ou par type d'action.
