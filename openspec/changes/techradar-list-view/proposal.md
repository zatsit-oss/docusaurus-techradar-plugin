## Why

Le radar visuel D3.js est excellent pour avoir une vue d'ensemble, mais il devient difficile à parcourir quand on cherche une technologie spécifique ou qu'on veut filtrer par catégorie. Une vue liste complémentaire permet de rechercher, filtrer, et naviguer plus efficacement dans les technologies, tout en restant accessible (navigation clavier, screen readers).

Cette vue liste améliore l'utilisabilité du plugin et offre une alternative accessible au radar visuel.

## What Changes

- **Composant ListView** affichant les technologies groupées par rings avec filtres (recherche, rings, quadrants)
- **Toggle view** permettant de basculer entre vue radar et vue liste
- **Intégration dans le composant principal** `<TechRadar />` avec state management pour la vue active
- **Filtres interactifs** : recherche textuelle, multi-select rings et quadrants
- **Styling Infima** cohérent avec le reste du plugin et support dark mode

## Capabilities

### New Capabilities

- `list-view-toggle`: Toggle permettant de basculer entre vue radar et vue liste, intégré dans le composant principal TechRadar

### Modified Capabilities

- `main-component`: Ajout du state management pour la vue active (radar/list) et intégration du toggle + ListView
- `list-view`: Extension de la spec existante pour la delta implementation (filtering, sorting, interaction)

## Impact

**Code modifié** :
- `src/theme/TechRadar/index.tsx` - Ajout state `currentView`, intégration `<ViewToggle />` et `<ListView />`
- `src/types.ts` - Ajout types `ListFilters`

**Nouveau code** :
- `src/theme/TechRadar/ViewToggle.tsx` - Composant toggle radar/liste
- `src/theme/TechRadar/ListView.tsx` - Composant vue liste
- `src/theme/TechRadar/ListFilters.tsx` - Composant filtres (search, rings, quadrants)
- `src/theme/hooks/useFilteredData.ts` - Hook pour filtrer les données
- Styles CSS pour liste, filtres, toggle

**UX** :
- Nouvelle façon d'explorer les technologies (complémentaire au radar)
- Meilleure accessibilité (navigation clavier, screen readers)
- Recherche et filtrage plus efficaces

**Pas d'impact** sur :
- API du composant TechRadar (backward compatible)
- Configuration du plugin
- Format des données radar

## Non-Goals

- Tri avancé (plusieurs critères, personnalisable) - MVP garde tri par défaut (ring > alphabétique)
- Persistance des filtres dans l'URL - state local uniquement
- Virtualisation de la liste pour performance - pas nécessaire pour MVP
- Export des données filtrées (CSV/JSON)
- Vue tableau avec colonnes configurables
