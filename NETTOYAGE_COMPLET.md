# 🔧 NETTOYAGE COMPLET ET REDÉMARRAGE

## 🚨 Problème Actuel

Erreur : **"ChunkLoadError: Loading chunk app/layout failed"**

**Cause** : Le cache de Next.js est corrompu.

## ✅ SOLUTION SIMPLE

### Méthode 1 : Script Automatique (RECOMMANDÉ)

1. **Fermez TOUS les terminaux PowerShell**

2. **Ouvrez un NOUVEAU terminal PowerShell**

3. **Allez dans le dossier du projet** :
   ```powershell
   cd C:\gravity\notary-app
   ```

4. **Lancez le script de nettoyage** :
   ```powershell
   .\restart-clean.bat
   ```

Le script va :
- ✅ Arrêter tous les processus Node
- ✅ Supprimer le cache `.next`
- ✅ Supprimer le cache `node_modules/.cache`
- ✅ Redémarrer le serveur proprement

### Méthode 2 : Manuelle

Si le script ne fonctionne pas, faites ceci :

1. **Fermez TOUS les terminaux**

2. **Ouvrez le Gestionnaire des tâches** (Ctrl + Shift + Esc)

3. **Cherchez "Node.js"** dans les processus

4. **Cliquez droit → Arrêter le processus** sur TOUS les Node.js

5. **Ouvrez un nouveau terminal PowerShell**

6. **Supprimez les caches** :
   ```powershell
   cd C:\gravity\notary-app
   Remove-Item -Recurse -Force .next
   Remove-Item -Recurse -Force node_modules\.cache
   ```

7. **Redémarrez** :
   ```powershell
   npm run dev
   ```

## 🧪 Vérification

Après le redémarrage, vous devriez voir dans PowerShell :

```
▲ Next.js 14.2.15
- Local: http://localhost:3000

✓ Ready in X.Xs
```

**SANS** :
- ❌ "Port 3000 is in use"
- ❌ "turbo"

## 🌐 Test dans le Navigateur

1. **Allez sur** : http://localhost:3000

2. **Rafraîchissez** : Ctrl + Shift + R

3. **Vous ne devriez PLUS voir** :
   - ❌ "ChunkLoadError"
   - ❌ "Loading chunk failed"

4. **Vous devriez voir** :
   - ✅ La page de login ou le dashboard

## 🔍 Si le Problème Persiste

### Vérification 1 : Processus Node
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue
```

**Résultat attendu** : Une seule ligne (un seul processus)

**Si plusieurs lignes** : Tuez-les tous :
```powershell
Stop-Process -Name node -Force
```

### Vérification 2 : Port 3000
```powershell
netstat -ano | findstr :3000
```

**Si occupé** : Tuez le processus qui l'utilise

### Vérification 3 : Cache Supprimé
```powershell
Test-Path .next
Test-Path node_modules\.cache
```

**Résultat attendu** : `False` pour les deux

**Si True** : Supprimez manuellement les dossiers dans l'Explorateur Windows

## 📊 Checklist

- [ ] Tous les terminaux fermés
- [ ] Tous les processus Node arrêtés
- [ ] Cache `.next` supprimé
- [ ] Cache `node_modules/.cache` supprimé
- [ ] Nouveau terminal ouvert
- [ ] Serveur redémarré avec `npm run dev`
- [ ] Un seul serveur sur le port 3000
- [ ] Navigateur rafraîchi (Ctrl + Shift + R)

## 🎯 Résultat Attendu

Après ces étapes :
- ✅ Serveur démarre sur le port 3000
- ✅ Pas d'erreur "ChunkLoadError"
- ✅ Application se charge normalement
- ✅ Navigation fonctionne

---

## 🚀 ACTIONS IMMÉDIATES

1. **Fermez TOUS les terminaux PowerShell**
2. **Ouvrez un NOUVEAU terminal**
3. **Lancez** :
   ```powershell
   cd C:\gravity\notary-app
   .\restart-clean.bat
   ```

**Attendez que le serveur démarre, puis testez http://localhost:3000** 🎉
