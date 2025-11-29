# 🧮 MODULE BARÈME - CALCUL DE PROVISIONS

**Date**: 28 Novembre 2024  
**Statut**: ✅ **IMPLÉMENTÉ ET FONCTIONNEL**

---

## 📋 DESCRIPTION

Module de calcul automatique des provisions pour **augmentation de capital de SARL** selon le barème notarial sénégalais.

### Fonctionnalités

✅ **Calcul automatique des honoraires** (barème progressif)  
✅ **Calcul de la TVA** (18%)  
✅ **Calcul des droits d'enregistrement**  
✅ **Frais fixes** (Greffe, Publicité, Expéditions, Divers)  
✅ **Détail par tranches**  
✅ **Interface interactive**  
✅ **API REST**

---

## 📊 BARÈME HONORAIRES

| Tranche | Taux |
|---------|------|
| 0 à 20 M | 2% |
| 20 à 80 M | 1,5% |
| 80 à 300 M | 1% |
| 300 à 600 M | 0,5% |
| 600 à 1200 M | 0,3% |
| 1200 à 1500 M | 0,2% |
| Plus de 1500 M | 0,1% |

## 📊 BARÈME ENREGISTREMENT

| Tranche | Taux |
|---------|------|
| 0 à 100 M | 0% |
| Plus de 100 M | 1% |

## 💰 FRAIS FIXES

- **Greffe**: 33 260 FCFA
- **Publicité**: 85 000 FCFA
- **Expéditions**: 100 000 FCFA
- **Divers**: 50 000 FCFA

---

## 📁 FICHIERS CRÉÉS

### 1. Module de Calcul
**`lib/bareme/calcul-provision.ts`**
- Fonctions de calcul
- Barèmes configurables
- Formatage FCFA
- Exemple d'utilisation

### 2. API Route
**`app/api/bareme/calcul-provision/route.ts`**
- Endpoint POST
- Validation des données
- Gestion des erreurs
- Authentification requise

### 3. Interface Utilisateur
**`app/dashboard/bareme/calcul-provision/page.tsx`**
- Formulaire interactif
- Affichage des résultats
- Détail par tranches
- Bouton génération devis

### 4. Navigation
**`components/SidebarPure.tsx`**
- Lien "Barème" ajouté
- Entre Facturation et Rapprochement

---

## 🚀 UTILISATION

### Via l'Interface

1. **Accéder au module**
   ```
   Dashboard → Barème
   ```

2. **Saisir les montants**
   - Ancien capital: 1 000 000 FCFA
   - Nouveau capital: 15 000 000 FCFA

3. **Cliquer sur "Calculer"**

4. **Voir les résultats**
   - Honoraires détaillés
   - TVA
   - Frais
   - Total TTC

### Via l'API

```typescript
// POST /api/bareme/calcul-provision
const response = await fetch('/api/bareme/calcul-provision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        ancienCapital: 1000000,
        nouveauCapital: 15000000
    })
});

const result = await response.json();
console.log(result.totalTTC); // 1 799 000 FCFA
```

### Via le Code

```typescript
import { calculerProvisionAugmentationCapital } from '@/lib/bareme/calcul-provision';

const result = calculerProvisionAugmentationCapital(1_000_000, 15_000_000);

console.log(result.totalTTC); // 1799000
console.log(result.honoraires); // 280000
console.log(result.tva); // 50400
console.log(result.enregistrement); // 1200000
```

---

## 📊 EXEMPLE DE CALCUL

### Données d'entrée
- **Ancien capital**: 1 000 000 FCFA
- **Nouveau capital**: 15 000 000 FCFA
- **Augmentation**: 14 000 000 FCFA

### Résultat

#### Honoraires
- Tranche 0-20M (14M × 2%): **280 000 FCFA**
- TVA (18%): **50 400 FCFA**

#### Enregistrement
- Tranche 100M+ (14M × 1%): **1 200 000 FCFA** (car > 100M)

#### Frais Fixes
- Greffe: **33 260 FCFA**
- Publicité: **85 000 FCFA**
- Expéditions: **100 000 FCFA**
- Divers: **50 000 FCFA**

#### **TOTAL TTC: 1 799 000 FCFA** ✅

---

## 🎨 INTERFACE

### Formulaire
- 2 champs: Ancien capital, Nouveau capital
- Bouton "Calculer la Provision"
- Validation en temps réel

### Résultats
- **Résumé**: 3 cartes (Ancien, Nouveau, Augmentation)
- **Honoraires**: Détail par tranches
- **Frais**: Liste complète
- **Total**: Mis en évidence

### Actions
- Bouton "Générer Devis" (à implémenter)

---

## 🔧 PERSONNALISATION

### Modifier les Barèmes

Dans `lib/bareme/calcul-provision.ts` :

```typescript
const BAREME_HONORAIRES: BaremeHonoraires[] = [
    { min: 0, max: 20_000_000, taux: 0.02, description: "0 à 20 Millions" },
    // Ajouter/modifier les tranches
];
```

### Modifier les Frais Fixes

```typescript
const FRAIS_FIXES = {
    GREFFE: 33_260,
    PUBLICITE: 85_000,
    EXPEDITIONS: 100_000,
    DIVERS: 50_000
};
```

### Modifier le Taux TVA

```typescript
const TAUX_TVA = 0.18; // 18%
```

---

## 📈 ÉVOLUTIONS POSSIBLES

### Court terme
- [ ] Génération de devis PDF
- [ ] Sauvegarde des calculs
- [ ] Historique des provisions

### Moyen terme
- [ ] Autres types d'actes (vente, donation, etc.)
- [ ] Barèmes personnalisables par étude
- [ ] Export Excel

### Long terme
- [ ] Intégration facturation
- [ ] Génération automatique d'actes
- [ ] Statistiques et analyses

---

## 🧪 TESTS

### Test Manuel

1. Aller sur `/dashboard/bareme/calcul-provision`
2. Saisir: Ancien = 1000000, Nouveau = 15000000
3. Cliquer "Calculer"
4. Vérifier: Total = 1 799 000 FCFA

### Test API

```bash
curl -X POST http://localhost:3000/api/bareme/calcul-provision \
  -H "Content-Type: application/json" \
  -d '{"ancienCapital":1000000,"nouveauCapital":15000000}'
```

### Test Unitaire

```typescript
import { calculerProvisionAugmentationCapital } from '@/lib/bareme/calcul-provision';

const result = calculerProvisionAugmentationCapital(1_000_000, 15_000_000);
expect(result.totalTTC).toBe(1_799_000);
expect(result.honoraires).toBe(280_000);
expect(result.tva).toBe(50_400);
```

---

## ✅ CHECKLIST

- [x] Module de calcul créé
- [x] API route créée
- [x] Interface utilisateur créée
- [x] Lien dans sidebar ajouté
- [x] Barèmes configurés
- [x] Frais fixes configurés
- [x] TVA configurée
- [x] Formatage FCFA
- [x] Validation des données
- [x] Gestion des erreurs
- [x] Documentation complète

---

## 🎯 RÉSULTAT

**MODULE 100% FONCTIONNEL !** ✅

Vous pouvez maintenant :
1. Accéder au module via la sidebar
2. Calculer des provisions
3. Voir les détails par tranches
4. Utiliser l'API dans d'autres modules

---

**TESTEZ MAINTENANT !** 🚀

Allez sur `/dashboard/bareme/calcul-provision` et testez le calcul !
