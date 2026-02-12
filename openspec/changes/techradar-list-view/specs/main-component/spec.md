## MODIFIED Requirements

> **Note**: Ce delta spec modifie la spec existante `openspec/specs/main-component/spec.md` pour ajouter le support de la vue liste et du toggle.

### Requirement: Composant principal doit gérer le state de la vue active

Le composant `<TechRadar />` DOIT gérer un state `currentView` pour déterminer quelle vue afficher (radar ou liste).

#### Scenario: Vue par défaut déterminée par prop ou config
- **WHEN** composant monte sans prop view
- **THEN** utilise la config plugin defaultView
- **AND** affiche la vue correspondante

#### Scenario: Prop view override la vue par défaut
- **WHEN** utilisateur passe `<TechRadar view="list" />`
- **THEN** la vue liste est affichée initialement
- **AND** l'état currentView est initialisé à 'list'

#### Scenario: Toggle modifie la vue active
- **WHEN** utilisateur clique sur toggle pour changer de vue
- **THEN** setState currentView est appelé
- **AND** la vue correspondante est affichée

### Requirement: Composant doit orchestrer RadarView ET ListView

Le composant DOIT rendre soit RadarView soit ListView selon currentView, jamais les deux simultanément.

#### Scenario: Vue radar affichée quand currentView='radar'
- **WHEN** currentView est 'radar'
- **THEN** seul RadarView est monté
- **AND** ListView n'est pas dans le DOM

#### Scenario: Vue liste affichée quand currentView='list'
- **WHEN** currentView est 'list'
- **THEN** seul ListView est monté
- **AND** RadarView n'est pas dans le DOM

### Requirement: Composant doit gérer l'état des filtres de liste

Le composant DOIT gérer un state `listFilters` pour la recherche et le filtrage dans ListView.

#### Scenario: Filtres initialisés vides
- **WHEN** composant monte
- **THEN** listFilters est { search: '', rings: [], quadrants: [] }

#### Scenario: Changement de filtres depuis ListView
- **WHEN** utilisateur modifie les filtres dans ListView
- **THEN** callback onFiltersChange est appelé
- **AND** setState listFilters met à jour l'état
- **AND** ListView re-render avec nouvelles données filtrées

### Requirement: Vue toggle doit être affiché au-dessus des vues

Le composant DOIT afficher ViewToggle avant RadarView/ListView.

#### Scenario: Toggle toujours visible
- **WHEN** composant est rendu
- **THEN** ViewToggle est affiché
- **AND** est positionné au-dessus de la vue active
- **AND** permet de basculer entre vues
