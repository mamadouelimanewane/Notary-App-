# Guide de Démarrage Rapide

## Installation & Configuration

### 1. Cloner et installer
```bash
cd c:\gravity\notary-app
npm install
```

### 2. Configurer l'environnement
Créer `.env` :
```bash
NEXTAUTH_SECRET=generate_avec_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=votre_cle_gratuite_sur_makersuite.google.com
```

### 3. Initialiser les données
```bash
node seed-users.js
```

### 4. Lancer l'application
```bash
npm run dev
```

Ouvrir http://localhost:3000

## Connexion

### Utilisateurs par défaut
- **Admin** : `admin@notary.fr` / `admin123`
- **Notaire** : `marie.dubois@notary.fr` / `notaire123`
- **Clerc** : `jean.martin@notary.fr` / `clerc123`

## Fonctionnalités Principales

### Navigation
- **Tableau de bord** : Vue d'ensemble
- **Clients** : Gestion clients (CRUD)
- **Dossiers** : Gestion dossiers avec statuts
- **Actes** : Historique actes générés
- **Templates** : Création modèles avec variables
- **Archives** : Archives par année
- **Comptabilité** : Opérations financières
- **Rapprochement** : Import relevés bancaires CSV
- **Recherche Juridique** : IA Gemini gratuite
- **Agenda** : Rendez-vous

### Workflow Type
1. Créer un client
2. Créer un dossier pour ce client
3. Générer un acte (ex: Compromis de Vente)
4. Signer l'acte (Settings → Signature)  
5. Archiver quand terminé
6. Enregistrer opérations comptables
7. Importer relevé bancaire pour rapprochement

## Fichiers Importants

- `/lib/db.ts` : Schéma base de données
- `/lib/auth.ts` : Configuration authentification
- `/app/actions.ts` : Server actions
- `/data.json` : Base de données (fichier)

## Support & Documentation

- Walkthrough complet : `walkthrough.md`
- Guide déploiement : `deployment-guide.md`
- Plan implémentation : `implementation_plan.md`
- Liste tâches : `task.md`

## Problèmes Courants

### Le build échoue
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Erreur authentification
Vérifier que `NEXTAUTH_SECRET` est défini dans `.env`

### Gemini AI ne répond pas
Vérifier `GEMINI_API_KEY` dans `.env`

## Prochaines Étapes

1. Tester toutes les fonctionnalités
2. Personnaliser selon besoins
3. Consulter `deployment-guide.md` pour production
4. Migrer vers SQLite pour persistance

Besoin d'aide ? Consultez les guides dans le dossier artifacts.
