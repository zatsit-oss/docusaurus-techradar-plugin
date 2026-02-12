# Plugin Architecture

## Overview

Plugin Docusaurus pour afficher un Tech Radar interactif basé sur la visualisation Zalando. Architecture modulaire avec chargement des données, composants React, et intégration dans l'écosystème Docusaurus.

## Requirements

### Plugin Structure

**MUST** suivre la structure standard d'un plugin Docusaurus :
- Export d'une fonction plugin depuis `src/index.ts`
- Implémentation des lifecycle hooks : `loadContent`, `contentLoaded`, `getThemePath`, `getClientModules`
- Types TypeScript pour les options et les données

**MUST** exposer les composants via `getThemePath()` :
- Composants placés dans `src/theme/`
- Convention Docusaurus : `theme/TechRadar/`

**MUST** supporter le chargement client-side uniquement (no SSR) :
- D3.js chargé depuis CDN côté client
- Composants radar enveloppés dans `useEffect` ou équivalent
- Affichage d'un loader pendant le chargement

### Package Configuration

**MUST** configurer `package.json` comme plugin Docusaurus :
```json
{
  "name": "docusaurus-techradar-plugin",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "keywords": [
    "docusaurus",
    "docusaurus-plugin",
    "tech-radar",
    "technology-radar"
  ],
  "peerDependencies": {
    "@docusaurus/types": "^3.0.0",
    "@docusaurus/utils": "^3.0.0",
    "@docusaurus/utils-validation": "^3.0.0",
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

**SHOULD** ne pas bundler D3.js (chargement CDN)

### Plugin Lifecycle

**MUST** implémenter :

1. **loadContent()** :
   - Charge le fichier radar (JSON/YAML) depuis la config
   - Valide le format des données
   - Retourne les données typées

2. **contentLoaded({ content, actions })** :
   - Injecte les données via `setGlobalData()`
   - Rend les données accessibles aux composants

3. **getThemePath()** :
   - Retourne le chemin vers `src/theme`
   - Permet à Docusaurus de découvrir les composants

4. **getClientModules()** :
   - Retourne le module de chargement D3.js
   - Exécuté uniquement côté client

### Multi-Radar Support

**MUST** supporter plusieurs instances avec des sources différentes :
```tsx
<TechRadar source="./frontend-radar.json" />
<TechRadar source="./backend-radar.json" />
```

**SHOULD** avoir une source par défaut depuis la config du plugin si aucune prop `source`

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│  docusaurus.config.js                                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │ plugins: [                                        │  │
│  │   ['docusaurus-techradar-plugin', {               │  │
│  │     radarFile: './data/default-radar.json'        │  │
│  │   }]                                              │  │
│  │ ]                                                 │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                      │
                      │ Plugin init
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Plugin (src/index.ts)                                  │
│                                                         │
│  loadContent() ───────┐                                 │
│       │               │                                 │
│       ▼               │                                 │
│  Read JSON/YAML       │                                 │
│  Validate schema      │                                 │
│       │               │                                 │
│       ▼               │                                 │
│  contentLoaded() ◄────┘                                 │
│       │                                                 │
│       └──▶ setGlobalData({ radarData })                │
│                                                         │
│  getThemePath() ─────▶ './theme'                        │
│  getClientModules() ─▶ './loadD3.js'                    │
└─────────────────────────────────────────────────────────┘
                      │
                      │ Components available
                      ▼
┌─────────────────────────────────────────────────────────┐
│  User's Docusaurus Site                                 │
│                                                         │
│  docs/our-tech-radar.mdx                                │
│  ───────────────────────                                │
│  import TechRadar from '@theme/TechRadar';              │
│                                                         │
│  <TechRadar source="./custom-radar.json" />             │
│      │                                                  │
│      └──▶ Uses plugin data or loads custom source      │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
docusaurus-techradar-plugin/
├─ src/
│  ├─ index.ts                    # Plugin entry point
│  ├─ types.ts                    # TypeScript types
│  ├─ validateConfig.ts           # Options validation
│  ├─ loadRadarData.ts            # Data loading logic
│  ├─ loadD3.js                   # Client module for D3
│  └─ theme/                      # React components
│     ├─ TechRadar/
│     │  ├─ index.tsx             # Main component
│     │  ├─ RadarView.tsx         # D3 radar view
│     │  ├─ ListView.tsx          # List view
│     │  ├─ Modal.tsx             # Drawer modal
│     │  ├─ ViewToggle.tsx        # Radar/List toggle
│     │  └─ styles.module.css     # Component styles
│     └─ hooks/
│        ├─ useD3Loader.ts        # D3 loading hook
│        ├─ useRadarData.ts       # Data fetching hook
│        └─ usePluginData.ts      # Plugin data access
├─ dist/                          # Build output
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Plugin > Library | Meilleure intégration Docusaurus, configuration centralisée |
| D3.js via CDN | Évite bundle bloat, pas de SSR concerns |
| Client-side only | D3.js manipule le DOM, incompatible SSR |
| Infima CSS | Déjà inclus dans Docusaurus, cohérence visuelle |
| Multi-source support | Flexibilité pour multiples radars |

## Non-Goals

- Ne pas réimplémenter D3.js ou le rendering du radar (utiliser Zalando)
- Ne pas supporter SSR pour le composant radar
- Ne pas créer un backend pour stocker les données
- Ne pas gérer l'authentification ou les permissions

## Related Specs

- [Data Management](../data-management/spec.md) - Chargement et validation des données
- [Radar Visualization](../radar-visualization/spec.md) - Composant de visualisation
- [Configuration](../configuration/spec.md) - Options du plugin
