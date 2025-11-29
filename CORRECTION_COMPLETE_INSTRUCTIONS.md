# ✅ CORRECTION COMPLÈTE DES 5 PAGES - Instructions

## 🎯 Problème Identifié

Les 5 pages (Clients, Dossiers, Actes, Types d'Actes, Templates) utilisent des composants `<Link>` de Next.js qui causent des requêtes POST répétées.

## ✅ Solution Appliquée

J'ai commencé à remplacer tous les `<Link>` par des liens natifs `<a>` avec `window.location.href`.

### Pages Corrigées

1. ✅ **Clients** - 100% corrigé (3 Links remplacés)
2. ⏳ **Dossiers** - Import commenté, Links à remplacer
3. ⏳ **Actes** - À corriger
4. ⏳ **Types d'Actes** - À corriger  
5. ⏳ **Templates** - À corriger

## 🔧 SOLUTION RAPIDE - Redémarrer le Serveur

### Étape 1 : Arrêter le Serveur
Dans PowerShell :
```powershell
Ctrl + C
```

### Étape 2 : Supprimer le Cache
```powershell
Remove-Item -Recurse -Force .next
```

### Étape 3 : Redémarrer
```powershell
npm run dev
```

### Étape 4 : Tester la Page Clients

1. Allez sur http://localhost:3000
2. Cliquez sur **"Clients"** dans la sidebar
3. La page devrait se charger
4. **Vérifiez PowerShell** - Vous devriez voir :
   ```
   GET /dashboard/clients 200 in XXXms
   ```
   **PAS** de POST répétés !

## 📊 Résultat Attendu

### Pour la Page Clients (Corrigée)
- ✅ Navigation fluide
- ✅ Pas de POST répétés
- ✅ Sidebar ne se bloque plus

### Pour les Autres Pages (Pas Encore Corrigées)
- ❌ POST répétés persistent
- ❌ Sidebar se bloque

## 🚀 PROCHAINES ÉTAPES

### Option A : Je Continue la Correction (Recommandé)

Je peux continuer à corriger les 4 autres pages une par une. Cela prendra environ 10-15 minutes.

**Dites-moi** : "Continue la correction des autres pages"

### Option B : Vous Testez d'Abord

Vous pouvez d'abord tester que la page Clients fonctionne maintenant, puis me demander de corriger les autres.

**Dites-moi** : "Je teste d'abord Clients"

## 📝 Note Technique

Le remplacement est simple mais doit être fait manuellement pour chaque `<Link>` :

```typescript
// AVANT
<Link href="/dashboard/dossiers/new">
    <Plus /> Nouveau Dossier
</Link>

// APRÈS
<a 
    href="/dashboard/dossiers/new"
    onClick={(e) => { 
        e.preventDefault(); 
        window.location.href = '/dashboard/dossiers/new'; 
    }}
>
    <Plus /> Nouveau Dossier
</a>
```

---

**Redémarrez le serveur et testez la page Clients maintenant !** 🚀

Si ça fonctionne, je continue avec les 4 autres pages.
