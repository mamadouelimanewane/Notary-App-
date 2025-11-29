# 🎯 SIDEBAR HTML PURE - INSTRUCTIONS D'INTÉGRATION

## ✅ CE QUI A ÉTÉ CRÉÉ

1. **`components/SidebarHTML.html`** - Sidebar HTML pure (NOUVEAU)
2. **`components/Sidebar-backup.tsx`** - Backup de l'ancienne sidebar React

---

## 🚀 OPTION 1 : INTÉGRATION DANS NEXT.JS (RECOMMANDÉ)

Cette option garde Next.js mais utilise une sidebar HTML pure.

### Étape 1 : Créer un composant wrapper

Créez `components/SidebarWrapper.tsx` :

```tsx
"use client";

import { useEffect, useRef } from 'react';

export function SidebarWrapper() {
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sidebarRef.current) {
            // Charger le HTML de la sidebar
            fetch('/sidebar.html')
                .then(res => res.text())
                .then(html => {
                    if (sidebarRef.current) {
                        sidebarRef.current.innerHTML = html;
                        
                        // Exécuter les scripts
                        const scripts = sidebarRef.current.querySelectorAll('script');
                        scripts.forEach(script => {
                            const newScript = document.createElement('script');
                            newScript.textContent = script.textContent;
                            document.body.appendChild(newScript);
                        });
                    }
                });
        }
    }, []);

    return <div ref={sidebarRef} />;
}
```

### Étape 2 : Copier le HTML dans public

```bash
# Copier le contenu de la sidebar (sans <!DOCTYPE>, <html>, <head>, <body>)
# Juste le contenu du <body>
```

Créez `public/sidebar.html` avec SEULEMENT :

```html
<div class="sidebar">
    <!-- Contenu de la sidebar -->
</div>

<style>
    /* Tous les styles CSS */
</style>

<script>
    // Tous les scripts JS
</script>
```

### Étape 3 : Remplacer dans le layout

Dans `app/dashboard/layout.tsx` :

```tsx
// AVANT
import { Sidebar } from "@/components/Sidebar";

// APRÈS
import { SidebarWrapper } from "@/components/SidebarWrapper";

// Dans le JSX
<SidebarWrapper />
```

---

## 🚀 OPTION 2 : SIDEBAR STANDALONE (PLUS SIMPLE)

Cette option utilise la sidebar comme fichier HTML indépendant.

### Étape 1 : Copier dans public

```bash
cp components/SidebarHTML.html public/sidebar-standalone.html
```

### Étape 2 : Créer un composant iframe

Créez `components/SidebarIframe.tsx` :

```tsx
"use client";

export function SidebarIframe() {
    return (
        <iframe
            src="/sidebar-standalone.html"
            style={{
                width: '256px',
                height: '100vh',
                border: 'none',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 40
            }}
        />
    );
}
```

### Étape 3 : Remplacer dans le layout

Dans `app/dashboard/layout.tsx` :

```tsx
import { SidebarIframe } from "@/components/SidebarIframe";

// Dans le JSX
<SidebarIframe />
```

---

## 🚀 OPTION 3 : CONVERSION COMPLÈTE EN COMPOSANT REACT

Créez `components/SidebarPure.tsx` :

```tsx
"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function SidebarPure() {
    const pathname = usePathname();
    const [officeName, setOfficeName] = useState('Cabinet Notaire Keur Jaraaf');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Récupérer le nom de l'office
        fetch('/api/office-name')
            .then(res => res.json())
            .then(data => setOfficeName(data.officeName || 'Cabinet Notaire'))
            .catch(() => setOfficeName('Cabinet Notaire Keur Jaraaf'));

        // Vérifier si admin
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(session => {
                if (session?.user?.role === 'ADMIN') {
                    setIsAdmin(true);
                }
            })
            .catch(() => {});
    }, []);

    const navigation = [
        { name: "Tableau de bord", href: "/dashboard" },
        { name: "Clients", href: "/dashboard/clients" },
        { name: "Dossiers", href: "/dashboard/dossiers" },
        { name: "Actes", href: "/dashboard/actes" },
        { name: "Templates", href: "/dashboard/templates" },
        { name: "Archives", href: "/dashboard/archives" },
        { name: "Comptabilité", href: "/dashboard/comptabilite" },
        { name: "Trésorerie", href: "/dashboard/tresorerie/caisse" },
        { name: "Facturation", href: "/dashboard/facturation" },
        { name: "Rapprochement", href: "/dashboard/rapprochement" },
        { name: "Rapports", href: "/dashboard/rapports" },
        { name: "Recherche Juridique", href: "/dashboard/recherche-juridique" },
        { name: "Agenda", href: "/dashboard/agenda" },
        { name: "Formalités", href: "/dashboard/formalites" },
        { name: "CRM", href: "/dashboard/crm" },
        { name: "Portail Client", href: "/dashboard/portail-client" },
        { name: "Négociation", href: "/dashboard/negociation" },
    ];

    const adminNavigation = [
        { name: "Utilisateurs", href: "/dashboard/admin/users" },
        { name: "Privilèges", href: "/dashboard/admin/privileges" },
        { name: "Paramètres", href: "/dashboard/parametres" },
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '256px',
            backgroundColor: '#0f172a',
            color: 'white',
            position: 'fixed',
            left: 0,
            top: 0,
            overflowY: 'auto'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '64px',
                borderBottom: '1px solid #1e293b',
                padding: '0 16px'
            }}>
                <h1 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    textAlign: 'center'
                }}>{officeName}</h1>
            </div>

            <nav style={{ flex: 1, padding: '16px 8px' }}>
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <a
                            key={item.name}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px 16px',
                                marginBottom: '4px',
                                color: isActive ? 'white' : '#cbd5e1',
                                textDecoration: 'none',
                                borderRadius: '6px',
                                backgroundColor: isActive ? '#1e293b' : 'transparent',
                                fontSize: '14px',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = '#1e293b';
                                    e.currentTarget.style.color = 'white';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#cbd5e1';
                                }
                            }}
                        >
                            {item.name}
                        </a>
                    );
                })}

                {isAdmin && (
                    <div style={{
                        marginTop: '24px',
                        paddingTop: '16px',
                        borderTop: '1px solid #1e293b'
                    }}>
                        <div style={{
                            padding: '0 16px 8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Administration
                        </div>
                        {adminNavigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px 16px',
                                        marginBottom: '4px',
                                        color: isActive ? 'white' : '#cbd5e1',
                                        textDecoration: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: isActive ? '#1e293b' : 'transparent',
                                        fontSize: '14px',
                                        fontWeight: 500
                                    }}
                                >
                                    {item.name}
                                </a>
                            );
                        })}
                    </div>
                )}
            </nav>
        </div>
    );
}
```

Puis dans `app/dashboard/layout.tsx` :

```tsx
import { SidebarPure } from "@/components/SidebarPure";

// Dans le JSX
<SidebarPure />
```

---

## ✅ AVANTAGES DE CHAQUE OPTION

### Option 1 (HTML chargé dynamiquement)
- ✅ Sidebar 100% HTML
- ✅ Pas de React dans la sidebar
- ❌ Un peu complexe à mettre en place

### Option 2 (iframe)
- ✅ Très simple
- ✅ Isolation complète
- ❌ Communication parent-enfant limitée

### Option 3 (Composant React avec styles inline)
- ✅ Facile à intégrer
- ✅ Pas de CSS externe
- ✅ Navigation avec `<a href>` standard
- ✅ **RECOMMANDÉ**

---

## 🎯 MA RECOMMANDATION

**Utilisez l'OPTION 3** - C'est le meilleur compromis :
- Garde Next.js
- Utilise des `<a href>` standards (pas de Link)
- Styles inline (pas de problème CSS)
- Facile à déboguer

---

## 📝 POUR TESTER

1. Créez le fichier `components/SidebarPure.tsx` avec le code de l'Option 3
2. Dans `app/dashboard/layout.tsx`, remplacez :
   ```tsx
   import { Sidebar } from "@/components/Sidebar";
   ```
   par :
   ```tsx
   import { SidebarPure } from "@/components/SidebarPure";
   ```
3. Remplacez `<Sidebar />` par `<SidebarPure />`
4. Redémarrez le serveur : `npm run dev`
5. Testez la navigation

---

## 🔧 RESTAURATION

Si vous voulez revenir à l'ancienne sidebar :

```bash
cp components/Sidebar-backup.tsx components/Sidebar.tsx
```

---

**Quelle option voulez-vous que j'implémente ?**
