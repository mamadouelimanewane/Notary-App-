# 🚀 Script d'Optimisation des Pages Dashboard

## Pages à Optimiser

Ajouter cette configuration au début de chaque page Server Component :

```typescript
// Force static rendering and caching
export const dynamic = 'force-static';
export const revalidate = 60; // Revalidate every 60 seconds
```

## Liste des Pages Principales

### ✅ Déjà Optimisées
- [x] `clients/page.tsx`
- [x] `dossiers/page.tsx`

### 🔲 À Optimiser (Priorité Haute)

#### 1. `actes/page.tsx`
```typescript
export const dynamic = 'force-static';
export const revalidate = 60;
```

#### 2. `templates/page.tsx`
```typescript
export const dynamic = 'force-static';
export const revalidate = 120; // Templates changent rarement
```

#### 3. `page.tsx` (Dashboard principal)
```typescript
export const dynamic = 'force-static';
export const revalidate = 30; // Stats mises à jour fréquemment
```

#### 4. `comptabilite/page.tsx`
```typescript
export const dynamic = 'force-static';
export const revalidate = 60;
```

#### 5. `rapports/page.tsx`
```typescript
export const dynamic = 'force-static';
export const revalidate = 60;
```

### 🔲 À Optimiser (Priorité Moyenne)

#### 6. `archives/page.tsx`
```typescript
export const dynamic = 'force-static';
export const revalidate = 120;
```

#### 7. `formalites/page.tsx`
```typescript
export const dynamic = 'force-static';
export const revalidate = 60;
```

#### 8. `facturation/page.tsx`
```typescript
export const dynamic = 'force-static';
export const revalidate = 60;
```

#### 9. `tresorerie/page.tsx`
```typescript
export const dynamic = 'force-static';
export const revalidate = 30; // Trésorerie mise à jour fréquemment
```

#### 10. `rapprochement/page.tsx`
```typescript
export const dynamic = 'force-static';
export const revalidate = 60;
```

### ⚠️ Pages à Laisser Dynamiques

Ces pages nécessitent des données en temps réel :

#### 1. `agenda/page.tsx`
```typescript
export const dynamic = 'force-dynamic'; // Temps réel requis
```

#### 2. `crm/page.tsx`
```typescript
export const dynamic = 'force-dynamic'; // Interactions en temps réel
```

#### 3. `recherche-juridique/page.tsx`
```typescript
export const dynamic = 'force-dynamic'; // Recherche en temps réel
```

## Recommandations par Type de Page

| Type de Page | Revalidate | Raison |
|--------------|------------|--------|
| **Listes** (clients, dossiers) | 60s | Changent modérément |
| **Stats** (dashboard) | 30s | Mises à jour fréquentes |
| **Archives** | 120s | Très stables |
| **Templates** | 120s | Rarement modifiés |
| **Comptabilité** | 60s | Changent modérément |
| **Trésorerie** | 30s | Mises à jour fréquentes |
| **Agenda** | Dynamic | Temps réel requis |
| **CRM** | Dynamic | Interactions temps réel |

## Impact Attendu

### Performance
- **Navigation** : 10s → 0.5s (-95%)
- **Première visite** : 15s → 2s (-87%)
- **Charge serveur** : -83%

### Expérience Utilisateur
- ✅ Navigation fluide
- ✅ Pas de blocage
- ✅ Feedback instantané

## Comment Appliquer

### Méthode Manuelle
1. Ouvrir chaque fichier `page.tsx`
2. Ajouter les exports en haut du fichier
3. Tester la navigation

### Méthode Automatique (Script)
```bash
# À créer si nécessaire
node scripts/optimize-pages.js
```

## Vérification

### Checklist par Page
- [ ] Export `dynamic` ajouté
- [ ] Export `revalidate` configuré
- [ ] Navigation testée (< 1s)
- [ ] Pas d'erreur console
- [ ] Données affichées correctement

### Test Global
```bash
# Naviguer rapidement entre :
Clients → Dossiers → Actes → Templates → Dashboard → Clients

# Temps total attendu : < 3 secondes
```

## Notes Importantes

1. **Ne pas optimiser les pages avec formulaires** qui modifient des données
2. **Tester après chaque modification** pour vérifier que les données s'affichent
3. **Ajuster `revalidate`** selon la fréquence de mise à jour des données
4. **Monitorer les performances** avec les DevTools

---

**Date** : 27 novembre 2024  
**Version** : 1.0  
**Statut** : 📋 Guide d'optimisation
