## Context

Ce design couvre l'ajout d'une vue liste au plugin Tech Radar. Le change `docusaurus-techradar-core` a déjà implémenté la visualisation radar D3.js et le composant principal. Cette vue liste vient compléter l'expérience utilisateur en offrant une alternative accessible et filtrable.

**État actuel** :
- Composant `<TechRadar />` affiche uniquement RadarView (D3.js)
- Pas de recherche ou filtrage
- Navigation difficile pour trouver une technologie spécifique
- Accessibilité limitée (SVG D3.js)

**Objectif** :
- Ajouter ListView avec filtres
- Toggle pour basculer radar ↔ liste
- Meilleure accessibilité et utilisabilité

## Goals / Non-Goals

**Goals** :
- Vue liste groupée par rings avec tri alphabétique
- Filtres : recherche textuelle + multi-select rings/quadrants
- Toggle radar/liste intégré dans TechRadar
- Styling cohérent avec Infima et dark mode
- Même interaction modal au clic que le radar

**Non-Goals** :
- Tri avancé (multiple critères, drag&drop)
- Persistance filtres dans URL
- Virtualisation pour performance
- Export des données filtrées
- Vue tableau configurable

## Decisions

### 1. Toggle dans le composant principal, pas deux composants séparés

**Décision** : Un seul composant `<TechRadar />` avec toggle interne, pas `<TechRadarChart />` et `<TechRadarList />` séparés.

**Alternatives** :
- Deux composants séparés : `<TechRadarChart />` et `<TechRadarList />`
- Prop `view` qui force une vue spécifique sans toggle

**Rationale** :
- UX cohérente : toggle standardisé, pas de décisions pour l'utilisateur
- État partagé : selectedEntry et données partagées entre vues
- Simplicité d'API : un seul composant à documenter et utiliser

**Implementation** :
```tsx
const [currentView, setCurrentView] = useState<'radar' | 'list'>('radar');

<ViewToggle view={currentView} onChange={setCurrentView} />
{currentView === 'radar' ? <RadarView /> : <ListView />}
```

### 2. Filtres contrôlés avec state local, pas de URL sync

**Décision** : Filtres gérés en state local React, pas de synchronisation avec URL query params.

**Alternatives** :
- Sync URL : filtres dans `?search=react&rings=0,1`
- Context API : state global partagé

**Rationale** :
- Simplicité MVP : pas de gestion d'historique ou deep linking
- Performance : pas de re-render au typing (URL updates)
- Scope : feature future si demandée

**Implementation** :
```tsx
const [filters, setFilters] = useState<ListFilters>({
  search: '',
  rings: [],
  quadrants: []
});
```

### 3. Grouping par rings, tri alphabétique par défaut

**Décision** : Liste organisée en sections par ring (ADOPT, TRIAL, etc.), entries triées alphabétiquement dans chaque section.

**Alternatives** :
- Liste plate triable par colonne (table)
- Grouping par quadrant
- Tri personnalisable (date, statut, etc.)

**Rationale** :
- Cohérence avec le radar visuel (rings = cercles concentriques)
- Tri alphabétique = recherche facilitée
- Grouping clair visuellement avec badges colorés

**Implementation** :
```tsx
rings.map(ring => (
  <section key={ring.name}>
    <h3>{ring.name} ({count})</h3>
    {entriesInRing.sort((a,b) => a.label.localeCompare(b.label)).map(...)}
  </section>
))
```

### 4. Filtres comme composant séparé, state lifted up

**Décision** : `<ListFilters />` composant séparé, state géré par parent (TechRadar).

**Alternatives** :
- Filtres intégrés dans ListView
- Custom hook `useFilters()` avec logic interne

**Rationale** :
- Séparation des responsabilités : ListView affiche, ListFilters filtre
- Réutilisabilité potentielle
- Testabilité améliorée

**Implementation** :
```tsx
<ListView>
  <ListFilters 
    filters={filters}
    onChange={setFilters}
    rings={data.rings}
    quadrants={data.quadrants}
  />
  <ListContent data={filteredData} />
</ListView>
```

### 5. useMemo pour filtrage, pas de recompute à chaque render

**Décision** : Hook `useFilteredData` utilise `useMemo` pour filtrer les données uniquement quand filtres ou données changent.

**Alternatives** :
- Filtrage direct dans render (recalcul à chaque render)
- Zustand/Redux pour state management

**Rationale** :
- Performance : évite filtrage inutile
- Simplicité : pas de lib externe, React natif
- Suffisant pour MVP

**Implementation** :
```tsx
const filteredEntries = useMemo(() => {
  return data.entries.filter(entry => {
    if (filters.search && !entry.label.toLowerCase().includes(filters.search)) 
      return false;
    if (filters.rings.length && !filters.rings.includes(entry.ring)) 
      return false;
    if (filters.quadrants.length && !filters.quadrants.includes(entry.quadrant)) 
      return false;
    return true;
  });
}, [data.entries, filters]);
```

### 6. Même modal que RadarView, pas de duplication

**Décision** : ListView utilise le même composant `<Modal />` via callback `onEntryClick`.

**Rationale** :
- DRY : un seul composant Modal
- Cohérence UX : même interaction depuis radar ou liste
- Déjà implémenté dans change core

## Component Architecture

```
<TechRadar>
  │
  ├─ State:
  │   - currentView: 'radar' | 'list'
  │   - selectedEntry: RadarEntry | null
  │   - listFilters: { search, rings, quadrants }
  │
  ├─ <ViewToggle 
  │     view={currentView}
  │     onChange={setCurrentView}
  │   />
  │
  ├─ {currentView === 'radar' && 
  │     <RadarView onEntryClick={setSelectedEntry} />
  │   }
  │
  ├─ {currentView === 'list' &&
  │     <ListView
  │       data={data}
  │       filters={listFilters}
  │       onFiltersChange={setListFilters}
  │       onEntryClick={setSelectedEntry}
  │     >
  │       <ListFilters />
  │       <ListContent />
  │     </ListView>
  │   }
  │
  └─ <Modal entry={selectedEntry} onClose={...} />
```

## ListView Component Structure

```
<ListView>
  │
  ├─ <ListFilters>
  │   ├─ <input search />
  │   ├─ <MultiSelect rings />
  │   └─ <MultiSelect quadrants />
  │
  └─ <ListContent>
      │
      └─ {rings.map(ring => (
          <section className="ring-section">
            <h3>{ring.name} ({count})</h3>
            {entries.map(entry => (
              <article className="tech-card" onClick={() => onEntryClick(entry)}>
                <span className="status-icon">{icon}</span>
                <div>
                  <h4>{entry.label}</h4>
                  <p>{quadrant.name}</p>
                  {entry.link && <a>Documentation →</a>}
                </div>
              </article>
            ))}
          </section>
        ))}
```

## Filtering Logic

```
Input: 
  - entries: RadarEntry[]
  - filters: { search, rings[], quadrants[] }

Process:
  1. Text search: entry.label includes filters.search (case-insensitive)
  2. Rings filter: entry.ring in filters.rings (if non-empty)
  3. Quadrants filter: entry.quadrant in filters.quadrants (if non-empty)

Output:
  - Filtered entries array

Optimization:
  - useMemo to prevent recalculation
  - Debounce search input (300ms) to reduce re-renders
```

## Risks / Trade-offs

### [Risk] Performance avec beaucoup d'entrées (>100)
**Mitigation** : useMemo pour filtrage, debounce sur search. Si problème persiste, virtualisation (react-window) en future feature.

### [Risk] Filtres UX complexe sur mobile
**Mitigation** : Stack vertical sur petits écrans, filtres collapsibles. MVP garde filtres toujours visibles.

### [Trade-off] Pas de persistance filtres
**Pro** : Simplicité, pas de gestion URL
**Con** : Filtres perdus au refresh
**Decision** : Acceptable pour MVP, feature future si demandée

### [Trade-off] Tri alphabétique uniquement
**Pro** : Prévisible, facile à implémenter
**Con** : Pas de tri par date/statut
**Decision** : MVP garde tri simple, sorting avancé en future feature

## Migration Plan

N/A - Ajout de fonctionnalité, backward compatible.

**Déploiement** :
1. Implémenter dans branche feature
2. Merge dans main après tests
3. Release patch version (compatible API)

**Rollback** : N/A - feature additive, pas de breaking change.

## Open Questions

1. **Debounce search** : 300ms suffisant ou trop long ?
   → À tester pendant implémentation, ajustable

2. **Filtres : AND ou OR entre rings ?**
   → AND (entry doit être dans un des rings sélectionnés ET dans un des quadrants sélectionnés)
   → Décision: OR dans chaque catégorie (ring 0 OR 1), AND between categories

3. **Ordre des rings dans la liste** : suivre l'ordre du fichier data ou toujours ADOPT → TRIAL → ASSESS → HOLD ?
   → Suivre l'ordre du fichier data (flexible)

4. **Count dans header ring** : total ou filtré ?
   → Filtré (reflète ce qui est affiché)
