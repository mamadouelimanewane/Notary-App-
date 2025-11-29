# 🎨 Composants Modernes - Documentation

**Dossier** : `components/modern/`  
**Version** : 1.0  
**Statut** : ✅ Production Ready

---

## 📦 COMPOSANTS DISPONIBLES

### 1. HeroSection
**Fichier** : `HeroSection.tsx`

#### Description
Section hero avec gradient, icône, titre, description et stats optionnelles.

#### Props
```typescript
interface HeroSectionProps {
    title: string;              // Titre principal
    description: string;        // Description
    icon: LucideIcon;          // Icône (de lucide-react)
    stats?: {                  // Stats optionnelles
        label: string;
        value: string | number;
    }[];
}
```

#### Exemple
```tsx
<HeroSection
    title="Types d'Actes"
    description="Classification exhaustive de 138+ types d'actes"
    icon={FileText}
    stats={[
        { label: 'Total', value: 138 },
        { label: 'Catégories', value: 8 }
    ]}
/>
```

---

### 2. StatsCard
**Fichier** : `StatsCard.tsx`

#### Description
Carte de statistique avec gradient, icône, valeur, description et trend optionnel.
**Optimisé** avec `React.memo`.

#### Props
```typescript
interface StatsCardProps {
    title: string;              // Titre
    value: string | number;     // Valeur principale
    icon: LucideIcon;          // Icône
    gradient: string;          // Gradient (ex: "from-blue-500 to-cyan-500")
    description?: string;      // Description optionnelle
    trend?: {                  // Trend optionnel
        value: string;         // Ex: "+12%"
        isPositive: boolean;   // true = vert, false = rouge
    };
    onClick?: () => void;      // Action au clic
}
```

#### Exemple
```tsx
<StatsCard
    title="Total Clients"
    value={156}
    icon={Users}
    gradient="from-blue-500 to-cyan-500"
    description="Clients enregistrés"
    trend={{ value: "+12%", isPositive: true }}
    onClick={() => console.log('Clicked')}
/>
```

---

### 3. ModernSearchBar
**Fichier** : `ModernSearchBar.tsx`

#### Description
Barre de recherche moderne avec debouncing (300ms), icône Search et bouton Clear.
**Optimisé** avec debouncing automatique.

#### Props
```typescript
interface ModernSearchBarProps {
    value: string;              // Valeur actuelle
    onChange: (value: string) => void;  // Callback
    placeholder?: string;       // Placeholder (défaut: "Rechercher...")
    className?: string;         // Classes CSS additionnelles
    debounceMs?: number;       // Délai debounce (défaut: 300ms)
}
```

#### Exemple
```tsx
const [searchQuery, setSearchQuery] = useState("");

<ModernSearchBar
    value={searchQuery}
    onChange={setSearchQuery}
    placeholder="Rechercher un client..."
    debounceMs={500}  // Optionnel
/>
```

---

### 4. FilterPills
**Fichier** : `FilterPills.tsx`

#### Description
Pills de filtres interactives avec gradients, icônes et badges de compteur.

#### Props
```typescript
interface FilterOption {
    id: string;                 // ID unique
    label: string;             // Label affiché
    icon?: LucideIcon;         // Icône optionnelle
    count?: number;            // Compteur optionnel
    gradient?: string;         // Gradient optionnel
}

interface FilterPillsProps {
    options: FilterOption[];    // Options de filtres
    selected: string;          // ID sélectionné
    onSelect: (id: string) => void;  // Callback
    className?: string;        // Classes CSS additionnelles
}
```

#### Exemple
```tsx
const [selectedType, setSelectedType] = useState("ALL");

const typeFilters = [
    { id: 'ALL', label: 'Tous', icon: List, count: 100 },
    { id: 'PARTICULIER', label: 'Particuliers', icon: User, count: 60, gradient: 'from-green-500 to-emerald-500' },
    { id: 'ENTREPRISE', label: 'Entreprises', icon: Building2, count: 40, gradient: 'from-blue-500 to-cyan-500' }
];

<FilterPills
    options={typeFilters}
    selected={selectedType}
    onSelect={setSelectedType}
/>
```

---

### 5. ModernPageLayout
**Fichier** : `ModernPageLayout.tsx`

#### Description
Layout de page avec background gradient global et container.

#### Props
```typescript
interface ModernPageLayoutProps {
    children: ReactNode;       // Contenu de la page
    className?: string;        // Classes CSS additionnelles
}
```

#### Exemple
```tsx
<ModernPageLayout>
    <HeroSection {...} />
    {/* Contenu de la page */}
</ModernPageLayout>
```

---

### 6. Index
**Fichier** : `index.ts`

#### Description
Fichier d'exports centralisés pour faciliter les imports.

#### Utilisation
```tsx
// Au lieu de :
import { HeroSection } from '@/components/modern/HeroSection';
import { StatsCard } from '@/components/modern/StatsCard';

// Utiliser :
import { HeroSection, StatsCard } from '@/components/modern';
```

---

## 🎨 GRADIENTS DISPONIBLES

### Stats Cards
```css
Bleu     : from-blue-500 to-cyan-500
Violet   : from-purple-500 to-pink-500
Vert     : from-green-500 to-emerald-500
Orange   : from-orange-500 to-red-500
Ambre    : from-amber-500 to-orange-500
Indigo   : from-indigo-500 to-blue-500
Teal     : from-teal-500 to-cyan-500
Rose     : from-pink-500 to-rose-500
```

### Catégories
```css
FAMILLE        : from-pink-500 to-rose-500
SUCCESSION     : from-purple-500 to-violet-500
IMMOBILIER     : from-blue-500 to-cyan-500
AFFAIRES       : from-green-500 to-emerald-500
RURAL          : from-yellow-500 to-amber-500
INTERNATIONAL  : from-indigo-500 to-blue-500
AUTHENTIF.     : from-teal-500 to-cyan-500
AUTRE          : from-gray-500 to-slate-500
```

---

## 📝 EXEMPLE COMPLET

```tsx
"use client";

import { HeroSection, StatsCard, ModernSearchBar, FilterPills, ModernPageLayout } from "@/components/modern";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, TrendingUp } from "lucide-react";
import { useState, useMemo } from "react";

export default function ExamplePage({ items }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("ALL");

    // Stats avec useMemo
    const stats = useMemo(() => ({
        total: items.length,
        active: items.filter(i => i.active).length
    }), [items]);

    // Filtres
    const typeFilters = [
        { id: 'ALL', label: 'Tous', icon: Users, count: stats.total },
        { id: 'TYPE1', label: 'Type 1', icon: Building2, count: 50, gradient: 'from-blue-500 to-cyan-500' }
    ];

    // Filtrage avec useMemo
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === 'ALL' || item.type === selectedType;
            return matchesSearch && matchesType;
        });
    }, [items, searchQuery, selectedType]);

    return (
        <ModernPageLayout>
            {/* Hero */}
            <HeroSection
                title="Ma Page"
                description="Description de ma page"
                icon={Users}
                stats={[{ label: 'Total', value: stats.total }]}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total"
                    value={stats.total}
                    icon={Users}
                    gradient="from-blue-500 to-cyan-500"
                    description="Items"
                    trend={{ value: "+12%", isPositive: true }}
                />
            </div>

            {/* Search & Filters */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                    <ModernSearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Rechercher..."
                    />
                    
                    <div>
                        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Type</h3>
                        <FilterPills
                            options={typeFilters}
                            selected={selectedType}
                            onSelect={setSelectedType}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredItems.map(item => (
                            <div key={item.id}>
                                {/* Item card */}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </ModernPageLayout>
    );
}
```

---

## 🚀 BONNES PRATIQUES

### Performance
- ✅ Utiliser `useMemo` pour stats et filtrage
- ✅ Le debouncing est automatique dans ModernSearchBar
- ✅ StatsCard est déjà optimisé avec React.memo

### Responsive
- ✅ Tous les composants sont responsive
- ✅ Grid adaptatif (1 col mobile, 2-3 tablet, 3-4 desktop)
- ✅ Pills avec texte abrégé sur mobile

### Accessibilité
- ✅ Contraste suffisant (WCAG AA)
- ✅ Tailles de texte lisibles
- ✅ Focus visible sur éléments interactifs

---

## 📚 DOCUMENTATION COMPLÈTE

- **DESIGN_SYSTEM_GUIDE.md** - Guide de style complet
- **GUIDE_RAPIDE_CONTINUER.md** - Guide rapide pour continuer
- **OPTIMISATION_PERFORMANCES.md** - Guide d'optimisation

---

**Créé par** : Assistant IA  
**Date** : 27 novembre 2024  
**Version** : 1.0  
**Statut** : ✅ Production Ready
