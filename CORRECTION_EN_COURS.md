# 🔧 CORRECTION EN COURS - Pages CRUD

## ✅ Page Corrigée

1. ✅ **Clients** - Tous les `<Link>` remplacés par `<a>` avec `window.location.href`

## 🔄 Pages en Cours de Correction

2. ⏳ Dossiers
3. ⏳ Actes  
4. ⏳ Types d'Actes
5. ⏳ Templates

## 🎯 Méthode

Pour chaque page, je remplace :
```typescript
// AVANT (cause des POST)
<Link href="/path">Texte</Link>

// APRÈS (navigation propre)
<a 
    href="/path"
    onClick={(e) => { 
        e.preventDefault(); 
        window.location.href = '/path'; 
    }}
>
    Texte
</a>
```

## 📊 Progression

- [x] Clients (3 Links remplacés)
- [ ] Dossiers
- [ ] Actes
- [ ] Types d'Actes
- [ ] Templates

---

**Temps estimé** : 5-10 minutes pour corriger toutes les pages
