# Main Component (TechRadar)

## Overview

Composant principal `<TechRadar />` qui orchestre les vues (radar/liste), gère l'état, et coordonne les interactions. Point d'entrée pour les utilisateurs du plugin.

## Requirements

### Component API

**MUST** exposer via `@theme/TechRadar` :

```tsx
interface TechRadarProps {
  // Data source (optional, fallback to plugin config)
  source?: string;
  
  // View control (optional, fallback to plugin config)
  view?: 'radar' | 'list';
  
  // Visual customization (optional, override plugin config)
  width?: number;
  height?: number;
  
  // Callbacks (optional)
  onEntryClick?: (entry: RadarEntry) => void;
}

export const TechRadar: React.FC<TechRadarProps>;
```

### Usage Examples

```tsx
// Basic usage - uses plugin config
import TechRadar from '@theme/TechRadar';

<TechRadar />

// Custom source
<TechRadar source="./backend-radar.json" />

// Force list view
<TechRadar view="list" />

// Custom dimensions
<TechRadar width={1200} height={800} />

// Multiple radars in same page
<TechRadar source="./frontend.json" />
<TechRadar source="./backend.json" />
<TechRadar source="./infra.json" />
```

### State Management

**MUST** gérer en local :
- Vue active (`radar` | `list`)
- Entrée sélectionnée (pour modal)
- Filtres de la liste
- État de chargement D3

```tsx
interface TechRadarState {
  currentView: 'radar' | 'list';
  selectedEntry: RadarEntry | null;
  listFilters: ListFilters;
  d3Loaded: boolean;
}
```

### Component Structure

```tsx
export const TechRadar: React.FC<TechRadarProps> = ({
  source,
  view: initialView,
  width,
  height,
  onEntryClick
}) => {
  // Load data (plugin config or custom source)
  const { data, loading, error } = useRadarData(source);
  
  // Load D3 client-side
  const d3Loaded = useD3Loader();
  
  // Local state
  const [currentView, setCurrentView] = useState<'radar' | 'list'>(
    initialView || data?.defaultView || 'radar'
  );
  const [selectedEntry, setSelectedEntry] = useState<RadarEntry | null>(null);
  const [listFilters, setListFilters] = useState<ListFilters>({
    search: '',
    rings: [],
    quadrants: []
  });
  
  // Handle entry click
  const handleEntryClick = useCallback((entry: RadarEntry) => {
    setSelectedEntry(entry);
    onEntryClick?.(entry);
  }, [onEntryClick]);
  
  // Loading state
  if (loading) {
    return <TechRadarLoader />;
  }
  
  // Error state
  if (error) {
    return <TechRadarError error={error} />;
  }
  
  if (!data) {
    return null;
  }
  
  return (
    <div className="tech-radar-container">
      <ViewToggle 
        view={currentView} 
        onChange={setCurrentView} 
      />
      
      {currentView === 'radar' ? (
        <RadarView 
          data={data}
          width={width}
          height={height}
          onEntryClick={handleEntryClick}
        />
      ) : (
        <ListView
          data={data}
          filters={listFilters}
          onFiltersChange={setListFilters}
          onEntryClick={handleEntryClick}
        />
      )}
      
      <Modal
        entry={selectedEntry}
        rings={data.rings}
        quadrants={data.quadrants}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
};
```

## View Toggle

```tsx
interface ViewToggleProps {
  view: 'radar' | 'list';
  onChange: (view: 'radar' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onChange }) => {
  return (
    <div className="view-toggle">
      <button
        className={view === 'radar' ? 'active' : ''}
        onClick={() => onChange('radar')}
        aria-pressed={view === 'radar'}
      >
        📊 Vue Radar
      </button>
      <button
        className={view === 'list' ? 'active' : ''}
        onClick={() => onChange('list')}
        aria-pressed={view === 'list'}
      >
        📋 Vue Liste
      </button>
    </div>
  );
};
```

**Styling** : Utiliser `button-group` d'Infima

## Loading State

```tsx
const TechRadarLoader: React.FC = () => {
  return (
    <div className="tech-radar-loader">
      <div className="spinner" />
      <p>Chargement du Tech Radar...</p>
    </div>
  );
};
```

## Error State

```tsx
interface TechRadarErrorProps {
  error: Error;
}

const TechRadarError: React.FC<TechRadarErrorProps> = ({ error }) => {
  return (
    <div className="alert alert--danger" role="alert">
      <strong>Erreur de chargement du Tech Radar</strong>
      <p>{error.message}</p>
    </div>
  );
};
```

**Uses Infima** : `alert alert--danger`

## Component Architecture Diagram

```
┌────────────────────────────────────────────────────┐
│  <TechRadar source="..." view="..." />             │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ useRadarData(source)                         │ │
│  │  ├─ if source → fetch custom                 │ │
│  │  └─ else → usePluginData()                   │ │
│  └──────────────────────────────────────────────┘ │
│                     │                             │
│                     ▼                             │
│  ┌──────────────────────────────────────────────┐ │
│  │ State:                                       │ │
│  │  - currentView                               │ │
│  │  - selectedEntry                             │ │
│  │  - listFilters                               │ │
│  └──────────────────────────────────────────────┘ │
│                     │                             │
│                     ▼                             │
│  ┌──────────────────────────────────────────────┐ │
│  │ <ViewToggle />                               │ │
│  └──────────────────────────────────────────────┘ │
│                     │                             │
│         ┌───────────┴───────────┐                 │
│         ▼                       ▼                 │
│  ┌─────────────┐         ┌─────────────┐         │
│  │ <RadarView> │         │ <ListView>  │         │
│  └─────────────┘         └─────────────┘         │
│         │                       │                 │
│         └───────────┬───────────┘                 │
│                     │ onEntryClick                │
│                     ▼                             │
│  ┌──────────────────────────────────────────────┐ │
│  │ <Modal entry={selectedEntry} />              │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

## Styling

**MUST** utiliser CSS modules :

```typescript
import styles from './styles.module.css';

<div className={styles.techRadarContainer}>
  ...
</div>
```

**MUST** supporter dark mode :
- Utiliser variables CSS Docusaurus
- Tester en mode clair et sombre

## Responsive

**MUST** adapter sur mobile :
- Stack toggle buttons verticalement
- Ajuster dimensions du radar (scale down)
- Full width sur petits écrans

## Accessibility

**MUST** :
- ARIA labels sur les boutons
- Focus visible sur toggle
- Annoncer changement de vue aux screen readers
- Navigation clavier complète

```tsx
<div 
  role="region" 
  aria-label={`Tech Radar - Vue ${currentView}`}
  className={styles.container}
>
  {/* ... */}
</div>
```

## Performance

**SHOULD** :
- Mémoiser callbacks (`useCallback`)
- Éviter re-renders inutiles
- Lazy load les vues (React.lazy) ?

Pour MVP : pas de lazy loading

## Testing

**MUST** tester :
- Rendu avec données du plugin
- Rendu avec source custom
- Toggle entre vues
- Clic sur entrée → ouvre modal
- Fermeture du modal
- Affichage loader pendant chargement
- Affichage erreur si échec chargement

**SHOULD** tester :
- Multiple instances sur même page
- Props override plugin config
- Responsive sur différentes tailles

## Integration Example

```tsx
// Dans docs/tech-radar.mdx

---
title: Notre Tech Radar
---

import TechRadar from '@theme/TechRadar';

# Tech Radar de l'équipe

Voici les technologies que nous utilisons et évaluons :

<TechRadar />

## Par domaine

### Frontend
<TechRadar source="./frontend-radar.json" />

### Backend
<TechRadar source="./backend-radar.json" />

### Infrastructure
<TechRadar source="./infra-radar.json" />
```

## Error Boundaries

**SHOULD** wrap dans Error Boundary :

```tsx
class TechRadarErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <TechRadarError error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Usage
export default function TechRadarWithBoundary(props) {
  return (
    <TechRadarErrorBoundary>
      <TechRadar {...props} />
    </TechRadarErrorBoundary>
  );
}
```

## Non-Goals

- Pas de state global (Redux/Context) - tout local
- Pas de persistance d'état (localStorage) dans MVP
- Pas de URL sync pour la vue active (MVP)
- Pas de server-side rendering

## Related Specs

- [Plugin Architecture](../plugin-architecture/spec.md) - Exposition du composant
- [Radar Visualization](../radar-visualization/spec.md) - Vue radar
- [List View](../list-view/spec.md) - Vue liste
- [Modal Drawer](../modal-drawer/spec.md) - Modal d'interaction
- [Data Management](../data-management/spec.md) - Chargement des données
