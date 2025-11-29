# 🔧 GUIDE DE DÉPANNAGE - BOUCLE DE SAUVEGARDE

**Problème** : Tentatives permanentes de POST vers `/dashboard/admin/backup`

---

## 🔍 DIAGNOSTIC

Le problème observé :
```
POST /dashboard/admin/backup 200 in 92ms
POST /dashboard/admin/backup 200 in 61ms
POST /dashboard/admin/backup 200 in 79ms
POST /dashboard/admin/backup 200 in 64ms
```

---

## ✅ SOLUTION

### **1. Redémarrer le serveur de développement**

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

### **2. Vider le cache Next.js**

```bash
# Supprimer le dossier .next
rm -rf .next

# Ou sur Windows
rmdir /s .next

# Puis relancer
npm run dev
```

### **3. Vérifier qu'il n'y a pas de route API en conflit**

La page est à : `app/dashboard/admin/backup/page.tsx`  
La route API est à : `app/api/admin/backups/route.ts` (avec un 's')

✅ **Pas de conflit** - Les chemins sont différents

---

## 📋 CONFIGURATION DE LA SAUVEGARDE AUTOMATIQUE

### **Comment ça fonctionne**

1. **Configuration** : L'utilisateur configure la fréquence dans l'interface
2. **Stockage** : La config est sauvegardée dans `localStorage`
3. **Exécution** : La sauvegarde automatique doit être gérée par un **cron job** côté serveur

### **Ce qui est implémenté**

✅ Interface de configuration  
✅ Sauvegarde de la config dans localStorage  
✅ Bouton de sauvegarde manuelle  

### **Ce qui reste à faire**

⏳ Cron job pour sauvegarde automatique  
⏳ Service backend pour planification  
⏳ Vérification de la fréquence configurée  

---

## 🚀 IMPLÉMENTATION DE LA SAUVEGARDE AUTOMATIQUE

### **Option 1 : Cron Job Node.js**

```typescript
// lib/cron/backup-scheduler.ts
import cron from 'node-cron';

export function scheduleBackups() {
  // Lire la config depuis la DB
  const config = getBackupConfig();
  
  let cronExpression = '';
  
  switch (config.frequency) {
    case 'daily':
      cronExpression = `0 ${config.time.split(':')[1]} ${config.time.split(':')[0]} * * *`;
      break;
    case 'weekly':
      cronExpression = `0 ${config.time.split(':')[1]} ${config.time.split(':')[0]} * * 1`;
      break;
    case 'monthly':
      cronExpression = `0 ${config.time.split(':')[1]} ${config.time.split(':')[0]} 1 * *`;
      break;
  }
  
  cron.schedule(cronExpression, async () => {
    await createBackup();
  });
}
```

### **Option 2 : Vercel Cron Jobs**

```typescript
// app/api/cron/backup/route.ts
export async function GET(request: Request) {
  // Vérifier le token Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Créer la sauvegarde
  await createBackup();
  
  return Response.json({ success: true });
}
```

```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/backup",
    "schedule": "0 8 * * *"
  }]
}
```

### **Option 3 : Bull Queue (Recommandé pour production)**

```typescript
// lib/queue/backup-queue.ts
import Queue from 'bull';

const backupQueue = new Queue('backup', process.env.REDIS_URL);

export function scheduleBackup(config: BackupConfig) {
  // Annuler les jobs existants
  backupQueue.clean(0, 'delayed');
  
  // Planifier selon la fréquence
  let cronExpression = '';
  
  switch (config.frequency) {
    case 'daily':
      cronExpression = `0 ${config.time} * * *`;
      break;
    case 'weekly':
      cronExpression = `0 ${config.time} * * 1`;
      break;
    case 'monthly':
      cronExpression = `0 ${config.time} 1 * *`;
      break;
  }
  
  backupQueue.add({}, {
    repeat: { cron: cronExpression }
  });
}

// Traiter les jobs
backupQueue.process(async (job) => {
  await createBackup();
});
```

---

## 📝 RECOMMANDATIONS

### **Court Terme**
1. ✅ Redémarrer le serveur pour résoudre la boucle
2. ✅ Utiliser uniquement la sauvegarde manuelle
3. ✅ Documenter la configuration

### **Moyen Terme**
1. ⏳ Implémenter un cron job simple
2. ⏳ Ajouter des logs de sauvegarde
3. ⏳ Tester la fréquence configurée

### **Long Terme**
1. ⏳ Utiliser Bull Queue pour la production
2. ⏳ Ajouter la rotation automatique (suppression anciennes sauvegardes)
3. ⏳ Implémenter la sauvegarde cloud (S3, etc.)
4. ⏳ Notifications en cas d'échec

---

## ✅ VÉRIFICATION

Après redémarrage, vérifier que :

- ✅ La page `/dashboard/admin/backup` se charge correctement
- ✅ Pas de requêtes POST automatiques
- ✅ Le bouton "Créer une Sauvegarde" fonctionne
- ✅ La configuration se sauvegarde dans localStorage
- ✅ Pas d'erreurs dans la console

---

**Créé le** : 27 novembre 2024  
**Statut** : ✅ Solution documentée
