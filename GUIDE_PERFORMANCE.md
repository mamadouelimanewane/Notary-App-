# 🎯 Guide des Bonnes Pratiques - Performance React/Next.js

## 📌 Objectif

Éviter les problèmes de performance, de surcharge mémoire et de redémarrages système lors du développement de l'application notariale.

---

## 🚨 Règles d'Or

### 1. **Pagination Obligatoire pour les Listes > 50 Éléments**

❌ **Mauvais** :
```tsx
{items.map(item => <ItemCard key={item.id} {...item} />)}
```

✅ **Bon** :
```tsx
const ITEMS_PER_PAGE = 50;
const paginatedItems = items.slice(startIndex, endIndex);

{paginatedItems.map(item => <ItemCard key={item.id} {...item} />)}
```

### 2. **Mémoïsation des Calculs Coûteux**

❌ **Mauvais** :
```tsx
function MyComponent() {
    const expensiveData = processLargeDataset(data); // Recalculé à chaque rendu
    return <div>{expensiveData}</div>;
}
```

✅ **Bon** :
```tsx
function MyComponent() {
    const expensiveData = useMemo(
        () => processLargeDataset(data),
        [data] // Recalculé seulement si data change
    );
    return <div>{expensiveData}</div>;
}
```

### 3. **Lazy Loading pour les Composants Lourds**

❌ **Mauvais** :
```tsx
import HeavyChart from './HeavyChart';

function Dashboard() {
    return <HeavyChart data={data} />;
}
```

✅ **Bon** :
```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
    loading: () => <Spinner />,
    ssr: false
});

function Dashboard() {
    return <HeavyChart data={data} />;
}
```

### 4. **Virtualisation pour les Très Longues Listes**

Pour les listes de **500+ éléments**, utilisez la virtualisation :

```tsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
    const Row = ({ index, style }) => (
        <div style={style}>
            <ItemCard {...items[index]} />
        </div>
    );

    return (
        <FixedSizeList
            height={600}
            itemCount={items.length}
            itemSize={100}
            width="100%"
        >
            {Row}
        </FixedSizeList>
    );
}
```

### 5. **Debouncing pour les Recherches**

❌ **Mauvais** :
```tsx
<Input onChange={(e) => setSearchQuery(e.target.value)} />
// Déclenche un re-render à chaque frappe
```

✅ **Bon** :
```tsx
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const [searchInput, setSearchInput] = useState('');
const debouncedSearch = useDebouncedValue(searchInput, 300);

useEffect(() => {
    // Recherche seulement après 300ms d'inactivité
    performSearch(debouncedSearch);
}, [debouncedSearch]);
```

---

## 📊 Checklist de Performance

### Avant de Créer une Nouvelle Page

- [ ] La liste contient-elle plus de 50 éléments ? → **Ajouter pagination**
- [ ] Y a-t-il des calculs complexes ? → **Utiliser `useMemo`**
- [ ] Y a-t-il des composants lourds ? → **Lazy loading**
- [ ] Y a-t-il un champ de recherche ? → **Debouncing**
- [ ] Y a-t-il des images ? → **Lazy loading + optimisation**

### Pendant le Développement

- [ ] Vérifier la console pour les warnings React
- [ ] Utiliser React DevTools Profiler
- [ ] Tester avec des données réelles (100+ éléments)
- [ ] Vérifier l'utilisation mémoire (Task Manager)
- [ ] Tester sur une machine moins puissante

### Avant de Commiter

- [ ] Pas de `console.log` en production
- [ ] Pas de boucles infinies dans `useEffect`
- [ ] Toutes les dépendances de `useEffect` sont correctes
- [ ] Les clés des listes sont uniques et stables
- [ ] Les images ont des attributs `width` et `height`

---

## 🔧 Outils de Monitoring

### 1. **React DevTools Profiler**

```bash
# Installer l'extension Chrome/Firefox
# Puis dans l'application :
# 1. Ouvrir DevTools
# 2. Onglet "Profiler"
# 3. Cliquer "Record"
# 4. Interagir avec l'app
# 5. Analyser les composants lents
```

### 2. **Next.js Bundle Analyzer**

```bash
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // config
})

# Analyser
ANALYZE=true npm run build
```

### 3. **Lighthouse**

```bash
# Dans Chrome DevTools
# 1. Onglet "Lighthouse"
# 2. Sélectionner "Performance"
# 3. Cliquer "Generate report"
# 4. Viser un score > 90
```

---

## 💡 Patterns Recommandés

### Pattern 1 : Liste Paginée avec Recherche

```tsx
function PaginatedList({ items }) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 50;

    const filtered = useMemo(() => 
        items.filter(item => 
            item.name.toLowerCase().includes(search.toLowerCase())
        ),
        [items, search]
    );

    const paginated = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    return (
        <>
            <SearchBar value={search} onChange={setSearch} />
            <div className="grid grid-cols-3 gap-4">
                {paginated.map(item => <ItemCard key={item.id} {...item} />)}
            </div>
            <Pagination 
                current={page} 
                total={totalPages} 
                onChange={setPage} 
            />
        </>
    );
}
```

### Pattern 2 : Chargement Progressif (Infinite Scroll)

```tsx
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

function InfiniteList({ items }) {
    const [displayCount, setDisplayCount] = useState(50);
    const { ref } = useInfiniteScroll(() => {
        setDisplayCount(prev => prev + 50);
    });

    return (
        <div>
            {items.slice(0, displayCount).map(item => 
                <ItemCard key={item.id} {...item} />
            )}
            <div ref={ref} className="h-10" />
        </div>
    );
}
```

### Pattern 3 : Tableau avec Tri et Filtres

```tsx
function DataTable({ data }) {
    const [sortBy, setSortBy] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [filters, setFilters] = useState({});

    const processed = useMemo(() => {
        let result = [...data];
        
        // Filtrage
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                result = result.filter(item => item[key] === value);
            }
        });

        // Tri
        result.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            return sortDir === 'asc' 
                ? aVal > bVal ? 1 : -1
                : aVal < bVal ? 1 : -1;
        });

        return result;
    }, [data, sortBy, sortDir, filters]);

    return <Table data={processed} />;
}
```

---

## 🎨 Optimisation des Images

### Next.js Image Component

```tsx
import Image from 'next/image';

// ❌ Mauvais
<img src="/photo.jpg" alt="Photo" />

// ✅ Bon
<Image 
    src="/photo.jpg" 
    alt="Photo"
    width={500}
    height={300}
    loading="lazy"
    placeholder="blur"
/>
```

### Formats Modernes

```tsx
<picture>
    <source srcSet="/photo.webp" type="image/webp" />
    <source srcSet="/photo.avif" type="image/avif" />
    <img src="/photo.jpg" alt="Photo" />
</picture>
```

---

## 🔍 Debugging de Performance

### Identifier les Composants Lents

```tsx
import { Profiler } from 'react';

function onRenderCallback(
    id, phase, actualDuration, baseDuration, 
    startTime, commitTime, interactions
) {
    if (actualDuration > 16) { // Plus de 16ms = problème
        console.warn(`${id} took ${actualDuration}ms to render`);
    }
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
    <MyComponent />
</Profiler>
```

### Détecter les Re-renders Inutiles

```tsx
import { useWhyDidYouUpdate } from '@/hooks/useWhyDidYouUpdate';

function MyComponent(props) {
    useWhyDidYouUpdate('MyComponent', props);
    // ...
}
```

---

## 📈 Objectifs de Performance

### Métriques Cibles

| Métrique | Cible | Critique |
|----------|-------|----------|
| **First Contentful Paint (FCP)** | < 1.8s | < 3s |
| **Largest Contentful Paint (LCP)** | < 2.5s | < 4s |
| **Time to Interactive (TTI)** | < 3.8s | < 7.3s |
| **Total Blocking Time (TBT)** | < 200ms | < 600ms |
| **Cumulative Layout Shift (CLS)** | < 0.1 | < 0.25 |

### Taille des Bundles

| Type | Taille Max | Recommandé |
|------|------------|------------|
| **Page principale** | < 200KB | < 100KB |
| **Bundle JS total** | < 500KB | < 300KB |
| **Bundle CSS** | < 50KB | < 30KB |
| **Images par page** | < 500KB | < 200KB |

---

## 🚀 Optimisations Avancées

### 1. Code Splitting par Route

```tsx
// Next.js le fait automatiquement pour les pages
// Mais vous pouvez aussi le faire manuellement :

const AdminPanel = dynamic(() => import('./AdminPanel'), {
    loading: () => <Skeleton />,
});
```

### 2. Prefetching Intelligent

```tsx
import Link from 'next/link';

// Next.js prefetch automatiquement les liens visibles
<Link href="/dashboard" prefetch={true}>
    Dashboard
</Link>

// Désactiver si pas nécessaire
<Link href="/rare-page" prefetch={false}>
    Rare Page
</Link>
```

### 3. Service Workers pour le Cache

```tsx
// public/sw.js
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
```

---

## 📚 Ressources

### Documentation
- [React Performance](https://react.dev/learn/render-and-commit)
- [Next.js Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)

### Outils
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Why Did You Render](https://github.com/welldone-software/why-did-you-render)

### Libraries Utiles
- `react-window` - Virtualisation de listes
- `react-intersection-observer` - Lazy loading
- `use-debounce` - Debouncing
- `swr` ou `react-query` - Gestion de cache

---

**Dernière mise à jour** : 25 novembre 2024  
**Version** : 1.0  
**Auteur** : Cabinet Notaire Keur Jaraaf
