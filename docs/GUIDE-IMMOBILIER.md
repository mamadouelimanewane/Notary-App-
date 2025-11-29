# 🗺️ Guide du Module Immobilier (SIG)

Ce module transforme la gestion immobilière de l'étude en un Système d'Information Géographique (SIG) interactif. Il permet de visualiser, filtrer et gérer le patrimoine immobilier sur une carte dynamique.

## Fonctionnalités

### 1. Cartographie Interactive
*   **Vue Carte (OpenStreetMap)** : Affichage de tous les biens (Terrains, Maisons, Immeubles) sur une carte mondiale précise.
*   **Marqueurs Intelligents** : Chaque bien est représenté par un marqueur cliquable.
*   **Popups Détaillées** : Au clic sur un marqueur, une fiche résumée apparaît avec photo, prix, statut et adresse.

### 2. Gestion de Portefeuille
*   **Vue Liste** : Une colonne latérale affiche la liste des biens avec leurs photos et détails clés.
*   **Filtres** : Possibilité de filtrer par type de bien (Maison, Appartement, Terrain, etc.).
*   **Statuts Visuels** : Code couleur immédiat pour connaître l'état du dossier :
    *   🟢 **À Vendre**
    *   🔵 **En Gestion**
    *   🔴 **Vendu**
    *   🟠 **En Litige**

### 3. Synchronisation Liste-Carte
*   La liste et la carte travaillent de concert pour offrir une vue d'ensemble cohérente du patrimoine géré par l'étude.

## Architecture Technique

*   **Librairie Cartographique** : `Leaflet` (via `react-leaflet`).
*   **Tuiles (Tiles)** : OpenStreetMap (Gratuit et Open Source).
*   **Données** : Structure JSON avec coordonnées GPS (`latitude`, `longitude`).
*   **Rendu** : Import dynamique (`next/dynamic`) avec `ssr: false` pour compatibilité Next.js (car Leaflet manipule le DOM `window`).

### Structure des Données (Exemple)
```typescript
interface Property {
  id: string;
  title: string;
  type: 'TERRAIN' | 'MAISON' | ...;
  coordinates: [number, number]; // [Latitude, Longitude]
  price: number;
  status: 'A_VENDRE' | ...;
  imageUrl: string;
}
```

## Guide d'Utilisation

1.  Accédez au menu **Immobilier (SIG)**.
2.  **Navigation** : Zoomez et déplacez-vous sur la carte comme sur Google Maps.
3.  **Exploration** : Cliquez sur un marqueur bleu pour voir le détail du bien.
4.  **Filtrage** : Utilisez les boutons en haut (Tout voir, Maison, Terrain...) pour affiner l'affichage.
5.  **Modes de Vue** : Sur mobile, basculez entre la vue "Carte" et la vue "Liste" via les boutons dédiés.

## Évolutions Futures Possibles

*   **Géocodage Automatique** : Saisir une adresse textuelle et laisser l'API trouver les coordonnées GPS automatiquement.
*   **Couches Cadastrales** : Superposer les plans du cadastre (si disponibles via API gouvernementale).
*   **Recherche par Rayon** : "Trouver tous les terrains à moins de 5km de ce point".
*   **Intégration Dossiers** : Lier chaque marqueur directement au dossier juridique complet dans l'application.
