# 🎨 GUIDE DE STYLE - DESIGN SYSTEM MODERNE

**Date** : 26 novembre 2024  
**Version** : 3.0  
**Application** : Cabinet Notaire Keur Jaraaf

---

## 🌈 PALETTE DE COULEURS GLOBALE

### Gradients Principaux
```typescript
// Hero Sections
bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600

// Backgrounds de Page
bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
dark:from-slate-900 dark:via-slate-800 dark:to-slate-900

// Cartes de Statistiques
from-blue-500 to-cyan-500      // Bleu
from-purple-500 to-pink-500    // Violet
from-green-500 to-emerald-500  // Vert
from-orange-500 to-red-500     // Orange
from-violet-500 to-purple-500  // Violet foncé
from-amber-500 to-orange-500   // Ambre
from-teal-500 to-cyan-500      // Teal
from-indigo-500 to-blue-500    // Indigo
```

### Couleurs par Catégorie (Actes)
```typescript
FAMILLE        : from-pink-500 to-rose-500
SUCCESSION     : from-purple-500 to-violet-500
IMMOBILIER     : from-blue-500 to-cyan-500
AFFAIRES       : from-green-500 to-emerald-500
RURAL          : from-yellow-500 to-amber-500
INTERNATIONAL  : from-indigo-500 to-blue-500
AUTHENTIFICATION: from-teal-500 to-cyan-500
AUTRE          : from-gray-500 to-slate-500
```

---

## 🎯 COMPOSANTS STANDARDS

### 1. Hero Section (En-tête de Page)

```tsx
<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 text-white shadow-2xl">
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <IconComponent className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    Titre de la Page
                </h1>
                <p className="text-blue-100 text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Description de la page
                </p>
            </div>
        </div>
    </div>
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
</div>
```

### 2. Cartes de Statistiques

```tsx
<Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-blue-100">
                Titre
            </CardTitle>
            <Icon className="h-5 w-5 text-blue-200" />
        </div>
    </CardHeader>
    <CardContent className="relative z-10">
        <div className="text-5xl font-bold mb-1">{value}</div>
        <p className="text-xs text-blue-100">Description</p>
    </CardContent>
</Card>
```

### 3. Barre de Recherche Moderne

```tsx
<div className="relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    <Input
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-12 pr-12 h-14 text-lg border-2 focus:border-blue-500 rounded-xl shadow-sm"
    />
    {searchQuery && (
        <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setSearchQuery('')}
        >
            <X className="h-4 w-4" />
        </Button>
    )}
</div>
```

### 4. Pills de Filtres (Catégories)

```tsx
<div className="flex flex-wrap gap-3">
    <Button
        variant={isSelected ? 'default' : 'outline'}
        onClick={() => handleSelect()}
        className={`rounded-full transition-all ${
            isSelected 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' 
                : 'hover:border-blue-400'
        }`}
    >
        <Icon className="h-4 w-4 mr-2" />
        Label
        <Badge variant="secondary" className="ml-2">
            {count}
        </Badge>
    </Button>
</div>
```

### 5. Cartes d'Items (Actes, Dossiers, etc.)

```tsx
<div className={`group relative border-2 ${colors.border} rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white hover:-translate-y-2 overflow-hidden`}>
    {/* Gradient overlay on hover */}
    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
    
    <div className="relative z-10">
        <div className="flex items-start gap-4 mb-3">
            <div className={`p-3 ${colors.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                <Icon className={`h-6 w-6 ${colors.text}`} />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-base mb-1 ${colors.text} group-hover:text-blue-600 transition-colors line-clamp-2`}>
                    Titre
                </h3>
            </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
            Description
        </p>
        <Badge variant="outline" className={`text-xs font-medium ${colors.text} border-current`}>
            Catégorie
        </Badge>
    </div>
</div>
```

### 6. Cartes de Catégories (Grandes)

```tsx
<Card className={`group border-2 ${colors.border} cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white overflow-hidden`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
    <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center gap-4">
            <div className={`p-4 ${colors.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                <Icon className={`h-8 w-8 ${colors.text}`} />
            </div>
            <div className="flex-1">
                <CardTitle className={`text-lg ${colors.text} group-hover:text-blue-600 transition-colors`}>
                    Titre
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                    Description
                </CardDescription>
            </div>
        </div>
    </CardHeader>
    <CardContent className="relative z-10">
        <div className="text-4xl font-bold text-center py-4 text-muted-foreground group-hover:text-blue-600 transition-colors">
            {count}
        </div>
    </CardContent>
</Card>
```

---

## 🎨 EFFETS ET ANIMATIONS

### Hover Effects Standards
```css
/* Translation verticale */
hover:-translate-y-1  /* Petit mouvement */
hover:-translate-y-2  /* Mouvement moyen */

/* Ombres */
hover:shadow-lg       /* Ombre légère */
hover:shadow-xl       /* Ombre moyenne */
hover:shadow-2xl      /* Ombre forte */

/* Scale */
group-hover:scale-110 /* Agrandissement 10% */

/* Transitions */
transition-all duration-300  /* Transition fluide */
```

### Gradients Overlay
```tsx
{/* Gradient qui apparaît au hover */}
<div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

{/* Gradient subtil (5-10%) */}
<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
```

### Éléments Décoratifs
```tsx
{/* Cercles flous en arrière-plan */}
<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
<div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
```

---

## 📐 ESPACEMENTS ET TAILLES

### Padding/Margin Standards
```css
p-4   /* Petit */
p-6   /* Moyen */
p-8   /* Grand */
p-12  /* Très grand */

gap-3 /* Petit */
gap-4 /* Moyen */
gap-6 /* Grand */
```

### Tailles de Texte
```css
text-xs    /* 12px - Descriptions secondaires */
text-sm    /* 14px - Texte normal */
text-base  /* 16px - Texte principal */
text-lg    /* 18px - Sous-titres */
text-xl    /* 20px - Titres de cartes */
text-2xl   /* 24px - Titres de sections */
text-4xl   /* 36px - Grands titres */
text-5xl   /* 48px - Hero titles */
```

### Arrondis
```css
rounded-lg   /* 8px - Standard */
rounded-xl   /* 12px - Moyen */
rounded-2xl  /* 16px - Grand */
rounded-3xl  /* 24px - Très grand */
rounded-full /* Cercle/Pill */
```

---

## 🎯 CHECKLIST D'IMPLÉMENTATION

Pour chaque nouvelle page, appliquer :

- [ ] **Hero Section** avec gradient bleu-indigo-violet
- [ ] **Background** dégradé subtil (slate-blue-indigo)
- [ ] **Cartes de Stats** avec gradients colorés
- [ ] **Barre de Recherche** grande (h-14) avec icône et bouton clear
- [ ] **Pills de Filtres** arrondies avec badges de compteur
- [ ] **Cartes d'Items** avec hover effects (translate, shadow, scale)
- [ ] **Gradients Overlay** au hover (opacity 5-10%)
- [ ] **Icônes** dans badges colorés
- [ ] **Transitions** fluides (duration-300)
- [ ] **Responsive** design (grid adaptatif)
- [ ] **Dark Mode** support (variantes dark:)
- [ ] **Éléments Décoratifs** (cercles flous)

---

## 📋 PAGES À TRANSFORMER

### Priorité 1 (Critiques)
- [x] **Types d'Actes** ✅
- [ ] **Dashboard** (déjà bien, à peaufiner)
- [ ] **Clients**
- [ ] **Dossiers**
- [ ] **Actes**

### Priorité 2 (Importantes)
- [ ] **Templates**
- [ ] **Comptabilité**
- [ ] **Rapports**
- [ ] **Archives**

### Priorité 3 (Secondaires)
- [ ] **Agenda**
- [ ] **Recherche Juridique**
- [ ] **Administration**
- [ ] **Paramètres**

---

## 💡 CONSEILS DE DESIGN

### 1. **Cohérence Visuelle**
- Utiliser toujours les mêmes gradients pour les mêmes types d'éléments
- Respecter la palette de couleurs définie
- Maintenir les mêmes espacements

### 2. **Performance**
- Utiliser `useMemo` pour les calculs coûteux
- Pagination pour les grandes listes (50 items max)
- Lazy loading pour les images

### 3. **Accessibilité**
- Contraste suffisant (WCAG AA minimum)
- Tailles de texte lisibles (minimum 14px)
- Focus visible sur les éléments interactifs

### 4. **Responsive**
- Mobile-first approach
- Grid adaptatif (1 col mobile, 2-3 tablet, 3-4 desktop)
- Texte abrégé sur petit écran

### 5. **Dark Mode**
- Toujours prévoir les variantes `dark:`
- Tester en mode sombre
- Ajuster les opacités si nécessaire

---

## 🚀 EXEMPLE COMPLET D'UNE PAGE

Voir `app/dashboard/types-actes/page.tsx` pour un exemple complet d'implémentation.

---

**Créé par** : Assistant IA  
**Date** : 26 novembre 2024  
**Version** : 3.0  
**Statut** : ✅ Guide de référence
