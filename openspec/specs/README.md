# Docusaurus Tech Radar Plugin - Overview

## Vision

Plugin Docusaurus pour afficher un Tech Radar interactif inspiré de Zalando. Permet aux équipes de documenter et partager leurs choix technologiques avec une visualisation en radar D3.js et une vue liste accessible.

## Architecture Globale

```
┌──────────────────────────────────────────────────────────┐
│                DOCUSAURUS SITE                           │
│                                                          │
│  docusaurus.config.js                                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │ plugins: [                                         │  │
│  │   ['docusaurus-techradar-plugin', {                │  │
│  │     radarFile: './data/tech-radar.json'            │  │
│  │   }]                                               │  │
│  │ ]                                                  │  │
│  └────────────────────────────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│  ┌────────────────────────────────────────────────────┐  │
│  │ PLUGIN                                             │  │
│  │ ├─ loadContent() → Load & validate JSON/YAML      │  │
│  │ ├─ contentLoaded() → Inject global data           │  │
│  │ ├─ getThemePath() → Expose React components       │  │
│  │ └─ getClientModules() → Load D3.js                │  │
│  └────────────────────────────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│  ┌────────────────────────────────────────────────────┐  │
│  │ COMPOSANT REACT: <TechRadar />                     │  │
│  │                                                    │  │
│  │  [○ Vue Radar | ● Vue Liste]  ← ViewToggle        │  │
│  │                                                    │  │
│  │  ┌──────────────┐      ┌──────────────┐           │  │
│  │  │ RadarView    │      │ ListView     │           │  │
│  │  │ (D3.js SVG)  │      │ (React)      │           │  │
│  │  │              │      │              │           │  │
│  │  │   ⚛️ → clic   │      │ React        │           │  │
│  │  │              │      │ /docs/react  │           │  │
│  │  └──────────────┘      └──────────────┘           │  │
│  │         │                      │                  │  │
│  │         └──────────┬───────────┘                  │  │
│  │                    ▼                              │  │
│  │         ┌─────────────────────┐                   │  │
│  │         │ Modal/Drawer        │ ← Slide right    │  │
│  │         │ - Tech details      │                  │  │
│  │         │ - Link to docs      │                  │  │
│  │         └─────────────────────┘                   │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Capabilities (Specs)

| Capability | Description | Status |
|------------|-------------|--------|
| [Plugin Architecture](./plugin-architecture/spec.md) | Structure du plugin Docusaurus, lifecycle hooks, exports | 📋 Spec |
| [Configuration](./configuration/spec.md) | Options du plugin, validation, defaults | 📋 Spec |
| [Data Management](./data-management/spec.md) | Chargement JSON/YAML, validation, hooks | 📋 Spec |
| [Main Component](./main-component/spec.md) | Composant `<TechRadar />`, state management | 📋 Spec |
| [Radar Visualization](./radar-visualization/spec.md) | Vue radar D3.js, wrapper Zalando | 📋 Spec |
| [List View](./list-view/spec.md) | Vue liste accessible, filtres, tri | 📋 Spec |
| [Modal Drawer](./modal-drawer/spec.md) | Modal de détails, animation slide | 📋 Spec |

## Dependency Graph

```
plugin-architecture
    │
    ├──▶ configuration (options schema)
    │
    └──▶ data-management (load & validate)
            │
            └──▶ main-component (<TechRadar />)
                    │
                    ├──▶ radar-visualization
                    │
                    ├──▶ list-view
                    │
                    └──▶ modal-drawer
```

## Tech Stack

### Core
- **TypeScript 5.x** (ES2022 target)
- **React 18+**
- **Docusaurus 3.0+**

### Visualization
- **D3.js v7** (loaded from CDN)
- **Zalando radar.js** (adapted as wrapper)

### Build & Dev
- **TSDX** (Bunchee bundler)
- **Vitest** + Testing Library
- **Oxlint** + Oxfmt (Rust-powered)
- **Node >=20**

### Styling
- **Infima** (Docusaurus CSS framework)
- **CSS Modules**

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Plugin > Library | Meilleure intégration Docusaurus, configuration centralisée |
| D3.js via CDN | Évite bundle bloat, pas de SSR concerns |
| Client-side only | D3.js manipule le DOM, incompatible SSR |
| Wrapper Zalando | Réutiliser algo éprouvé, pas de réécriture |
| Infima CSS | Déjà dans Docusaurus, cohérence visuelle |
| Modal slide right | Animation moderne, pattern familier |
| Multi-source support | Flexibilité pour plusieurs radars |
| JSON/YAML data | Simple, versionnable, éditable |

## MVP Scope

### ✅ Inclus dans MVP

- Plugin Docusaurus complet avec lifecycle
- Chargement données JSON/YAML avec validation
- Vue Radar (D3.js + Zalando wrapper)
- Vue Liste avec filtres basiques (search, ring, quadrant)
- Toggle Radar ↔ Liste
- Modal/Drawer avec slide animation
- Liens vers documentation
- Support multi-radar (`source` prop)
- Dark mode (via Infima)
- Tests unitaires (Vitest)

### ❌ Hors scope MVP (futures features)

- SSR pour le radar
- Responsive mobile optimisé
- Accessibilité avancée (focus trap, etc.)
- Tri avancé dans liste
- Persistance filtres dans URL
- Virtualisation liste (performance)
- Métadonnées enrichies (description, tags, owners)
- Timeline/historique des changements
- Export CSV/JSON
- Backend pour édition
- Preset Docusaurus

## Implementation Strategy

### Phase 1: Foundation
1. Setup plugin structure
2. Configuration & validation
3. Data loading & management

### Phase 2: Core Components
4. Main TechRadar component
5. Radar view (D3 wrapper)
6. List view

### Phase 3: Interactions
7. Modal/Drawer
8. View toggle
9. Click handling

### Phase 4: Polish
10. Styling & dark mode
11. Error handling
12. Documentation

## File Structure

```
docusaurus-techradar-plugin/
├─ src/
│  ├─ index.ts                    # Plugin entry
│  ├─ types.ts                    # TypeScript types
│  ├─ validateConfig.ts           # Options validation
│  ├─ loadRadarData.ts            # Data loading
│  ├─ loadD3.js                   # Client D3 loader
│  └─ theme/                      # React components
│     ├─ TechRadar/
│     │  ├─ index.tsx             # Main component
│     │  ├─ RadarView.tsx         # D3 view
│     │  ├─ ListView.tsx          # List view
│     │  ├─ Modal.tsx             # Drawer
│     │  ├─ ViewToggle.tsx        # Toggle
│     │  ├─ radar.ts              # Zalando adapter
│     │  └─ styles.module.css
│     └─ hooks/
│        ├─ useD3Loader.ts
│        ├─ useRadarData.ts
│        └─ usePluginData.ts
├─ dist/                          # Build output
├─ openspec/                      # Specs & changes
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Data Format

```json
{
  "title": "Tech Radar 2026",
  "quadrants": [
    { "name": "Languages & Frameworks" },
    { "name": "Tools" },
    { "name": "Platforms" },
    { "name": "Techniques" }
  ],
  "rings": [
    { "name": "ADOPT", "color": "#5ba300" },
    { "name": "TRIAL", "color": "#009eb0" },
    { "name": "ASSESS", "color": "#c7ba00" },
    { "name": "HOLD", "color": "#e09b96" }
  ],
  "entries": [
    {
      "label": "React",
      "quadrant": 0,
      "ring": 0,
      "moved": 0,
      "link": "/docs/frontend/react"
    }
  ]
}
```

## Next Steps

Vous pouvez maintenant :

1. **Créer un change complet** : `/opsx:ff` pour générer tous les artifacts (proposal, design, specs, tasks)
2. **Créer étape par étape** : `/opsx:new` pour créer un change et itérer artifact par artifact
3. **Explorer une spec spécifique** : `/opsx:explore <capability>` pour approfondir

Recommandation : `/opsx:ff` pour avoir immédiatement tous les artifacts et pouvoir déléguer des tâches à des agents.

## Estimated Effort

- **Plugin setup + Data management** : ~6h
- **Main component + View toggle** : ~4h
- **Radar view (D3 wrapper)** : ~8h
- **List view + Filtres** : ~6h
- **Modal/Drawer** : ~4h
- **Styling + Dark mode** : ~4h
- **Tests** : ~6h
- **Documentation** : ~3h

**Total MVP** : ~40-45h

Peut être divisé en sous-tâches indépendantes pour parallélisation.
