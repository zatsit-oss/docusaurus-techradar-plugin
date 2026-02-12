# List View

## Overview

Vue liste des technologies du Tech Radar, organisée par rings avec recherche et filtrage. Alternative accessible au radar visuel, avec navigation vers la documentation.

## Requirements

### Structure

**MUST** organiser par rings :
```
ADOPT (12 technologies)
├─ React
├─ TypeScript
└─ ...

TRIAL (8 technologies)
├─ Solid.js
├─ Bun
└─ ...

ASSESS (5 technologies)
HOLD (3 technologies)
```

**MUST** afficher pour chaque entrée :
- Icon/emoji du statut (`moved` : ○, △, ▽, ★)
- Nom de la technologie (`label`)
- Quadrant
- Lien cliquable vers la documentation (si `link` présent)

### Filtering

**MUST** permettre de filtrer par :
- **Recherche textuelle** : recherche dans `label`
- **Ring** : multi-select (ADOPT, TRIAL, etc.)
- **Quadrant** : multi-select

**SHOULD** afficher le nombre de résultats :
```
ADOPT (12) → ADOPT (5)  // après filtrage
```

**SHOULD** persister les filtres dans l'URL (query params) :
- Future feature, pas MVP
- Pour MVP : state local uniquement

### Sorting

**MUST** trier par défaut :
1. Par ring (ordre configuré)
2. Par label (alphabétique) dans chaque ring

**SHOULD** permettre de trier par :
- Nom (A-Z, Z-A)
- Quadrant
- Statut (moved)

Pour MVP : tri par défaut uniquement

### Interaction

**MUST** permettre de :
- Cliquer sur une entrée → ouvrir le modal/drawer
- Cliquer sur le lien "Docs" → navigation directe (si `link` présent)

**SHOULD** highlight l'entrée au hover

## Component Structure

```tsx
interface ListViewProps {
  data: RadarData;
  filters?: ListFilters;
  onFiltersChange?: (filters: ListFilters) => void;
  onEntryClick?: (entry: RadarEntry) => void;
}

interface ListFilters {
  search: string;
  rings: number[];      // Indices des rings sélectionnés
  quadrants: number[];  // Indices des quadrants sélectionnés
}

export const ListView: React.FC<ListViewProps> = ({
  data,
  filters = { search: '', rings: [], quadrants: [] },
  onFiltersChange,
  onEntryClick
}) => {
  const filteredData = useFilteredData(data, filters);

  return (
    <div className="list-view">
      <ListFilters 
        filters={filters}
        onChange={onFiltersChange}
        rings={data.rings}
        quadrants={data.quadrants}
      />
      <ListContent
        data={filteredData}
        onEntryClick={onEntryClick}
      />
    </div>
  );
};
```

## UI Layout

```
┌────────────────────────────────────────────────────┐
│  🔍 Recherche: [________________]                  │
│                                                    │
│  📊 Rings: [☑ ADOPT][☑ TRIAL][☐ ASSESS][☐ HOLD]   │
│  📁 Quadrants: [☑ Lang][☐ Tools][☑ Plat][☐ Tech]  │
│                                                    │
│  28 technologies                                   │
├────────────────────────────────────────────────────┤
│                                                    │
│  ● ADOPT (12)                                      │
│  ┌──────────────────────────────────────────────┐ │
│  │  ○  React                                    │ │
│  │      Languages & Frameworks                  │ │
│  │      [📖 Documentation →]                     │ │
│  ├──────────────────────────────────────────────┤ │
│  │  ○  TypeScript                               │ │
│  │      Languages & Frameworks                  │ │
│  │      [📖 Documentation →]                     │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ● TRIAL (8)                                       │
│  ┌──────────────────────────────────────────────┐ │
│  │  △  Solid.js                                 │ │
│  │      Languages & Frameworks                  │ │
│  │      [📖 Documentation →]                     │ │
│  ├──────────────────────────────────────────────┤ │
│  │  ★  Bun                                      │ │
│  │      Tools                                   │ │
│  │      [📖 Documentation →]                     │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

## Status Icons

**MUST** afficher les statuts avec des symboles visuels :

```typescript
const STATUS_ICONS = {
  [-1]: { icon: '▽', label: 'Moved out', color: 'var(--ifm-color-danger)' },
  [0]:  { icon: '○', label: 'Stable', color: 'var(--ifm-color-primary)' },
  [1]:  { icon: '△', label: 'Moved in', color: 'var(--ifm-color-success)' },
  [2]:  { icon: '★', label: 'New', color: 'var(--ifm-color-warning)' }
} as const;
```

**SHOULD** ajouter tooltip au hover sur l'icône :
```tsx
<span 
  className="status-icon" 
  title={STATUS_ICONS[entry.moved].label}
  style={{ color: STATUS_ICONS[entry.moved].color }}
>
  {STATUS_ICONS[entry.moved].icon}
</span>
```

## Filtering Logic

```typescript
function useFilteredData(
  data: RadarData,
  filters: ListFilters
): RadarData {
  return useMemo(() => {
    let filtered = data.entries;

    // Search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.label.toLowerCase().includes(search)
      );
    }

    // Rings
    if (filters.rings.length > 0) {
      filtered = filtered.filter(entry =>
        filters.rings.includes(entry.ring)
      );
    }

    // Quadrants
    if (filters.quadrants.length > 0) {
      filtered = filtered.filter(entry =>
        filters.quadrants.includes(entry.quadrant)
      );
    }

    return {
      ...data,
      entries: filtered
    };
  }, [data, filters]);
}
```

## Grouping Logic

**MUST** grouper les entrées par ring :

```typescript
function groupByRing(entries: RadarEntry[], rings: RadarRing[]) {
  return rings.map((ring, ringIndex) => ({
    ring,
    entries: entries
      .filter(e => e.ring === ringIndex)
      .sort((a, b) => a.label.localeCompare(b.label))
  }));
}
```

## Styling

**MUST** utiliser Infima classes :
- `card` pour les entrées
- `badge` pour les statuts
- `button button--link` pour les liens
- `margin-bottom--md` pour spacing

**MUST** supporter le dark mode :
- Utiliser variables CSS Docusaurus
- Tester en mode clair et sombre

## Accessibility

**MUST** :
- Utiliser éléments sémantiques (`<section>`, `<article>`, `<button>`)
- Labels ARIA pour les filtres
- Navigation clavier complète
- Screen reader friendly

**SHOULD** :
- Annoncer le nombre de résultats après filtrage
- Focus management lors de l'ouverture du modal

## Performance

**MUST** :
- Mémoiser les résultats filtrés (`useMemo`)
- Éviter les re-renders lors du typing (debounce search)

**SHOULD** :
- Virtualiser la liste si > 100 entrées (future feature)
- Pour MVP : pas de virtualisation

## Responsive

**MUST** :
- Empiler les filtres sur mobile
- Cards full-width sur petits écrans
- Boutons tactiles (min 44px)

## Testing

**MUST** tester :
- Affichage de toutes les entrées
- Filtrage par recherche
- Filtrage par ring
- Filtrage par quadrant
- Filtres combinés
- Clic sur entrée → appelle onEntryClick
- Clic sur lien docs → navigation

**SHOULD** tester :
- Tri alphabétique
- Affichage correct des icônes de statut
- Responsive sur différentes tailles

## Edge Cases

**MUST** gérer :
- Aucun résultat → afficher message "Aucune technologie trouvée"
- Entrée sans lien → bouton docs désactivé ou masqué
- Ring vide → afficher le ring avec "(0)"
- Recherche vide → afficher tout

## Non-Goals

- Pas de tri avancé dans MVP
- Pas de persistance des filtres dans URL (MVP)
- Pas de virtualisation (MVP)
- Pas d'export CSV/JSON (future)

## Related Specs

- [Radar Visualization](../radar-visualization/spec.md) - Vue complémentaire
- [Modal Drawer](../modal-drawer/spec.md) - Détails au clic
- [Data Management](../data-management/spec.md) - Format des données
