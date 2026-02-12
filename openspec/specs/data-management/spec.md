# Data Management

## Overview

Système de chargement, validation et fourniture des données du Tech Radar. Supporte JSON et YAML, avec validation de schéma et gestion d'erreurs robuste.

## Requirements

### Data Format

**MUST** supporter le format inspiré de Zalando avec extension pour les liens :

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

**MUST** valider :
- `quadrants` : tableau de 4 éléments avec `name` (string)
- `rings` : tableau de 1-4 éléments avec `name` (string) et `color` (hex color)
- `entries` : tableau avec :
  - `label` (string, required)
  - `quadrant` (0-3, required)
  - `ring` (0-N, required, index dans rings)
  - `moved` (-1, 0, 1, 2, required)
  - `link` (string, optional)

**SHOULD** supporter YAML avec la même structure

### Data Loading

**MUST** charger les données depuis :
1. Fichier par défaut configuré dans le plugin (`radarFile` option)
2. Source custom via prop `<TechRadar source="..." />`

**MUST** gérer les erreurs :
- Fichier introuvable → message clair au build time
- JSON malformé → erreur avec ligne/colonne
- Validation échouée → liste des champs invalides

**SHOULD** cacher les données chargées (build time)

### Data Access

**MUST** exposer via hook React :
```typescript
const { data, loading, error } = useRadarData(source);
```

**MUST** supporter :
- Chargement depuis plugin global data
- Chargement depuis source custom
- État de chargement
- Gestion d'erreur

## TypeScript Types

```typescript
export interface RadarQuadrant {
  name: string;
}

export interface RadarRing {
  name: string;
  color: string;
}

export interface RadarEntry {
  label: string;
  quadrant: number;  // 0-3
  ring: number;      // 0-N (index dans rings)
  moved: -1 | 0 | 1 | 2;  // -1=out, 0=stable, 1=in, 2=new
  link?: string;     // URL vers documentation
}

export interface RadarData {
  title?: string;
  quadrants: [RadarQuadrant, RadarQuadrant, RadarQuadrant, RadarQuadrant];
  rings: RadarRing[];
  entries: RadarEntry[];
}

export interface RadarDataState {
  data: RadarData | null;
  loading: boolean;
  error: Error | null;
}
```

## Validation Schema

**MUST** utiliser `@docusaurus/utils-validation` (Joi-based) :

```typescript
import { Joi } from '@docusaurus/utils-validation';

export const RadarDataSchema = Joi.object({
  title: Joi.string().optional(),
  quadrants: Joi.array()
    .items(Joi.object({ name: Joi.string().required() }))
    .length(4)
    .required(),
  rings: Joi.array()
    .items(Joi.object({
      name: Joi.string().required(),
      color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required()
    }))
    .min(1)
    .max(4)
    .required(),
  entries: Joi.array()
    .items(Joi.object({
      label: Joi.string().required(),
      quadrant: Joi.number().integer().min(0).max(3).required(),
      ring: Joi.number().integer().min(0).required(),
      moved: Joi.number().valid(-1, 0, 1, 2).required(),
      link: Joi.string().optional()
    }))
    .required()
});
```

## Loading Flow

```
┌──────────────────────────────────────────────────┐
│  Build Time (Plugin)                             │
│                                                  │
│  loadContent()                                   │
│       │                                          │
│       ├─▶ Read radarFile from options           │
│       │   (e.g., ./data/tech-radar.json)        │
│       │                                          │
│       ├─▶ Parse JSON/YAML                       │
│       │                                          │
│       ├─▶ Validate with RadarDataSchema         │
│       │   ├─ Success → return data              │
│       │   └─ Error → throw with details         │
│       │                                          │
│       └─▶ contentLoaded()                       │
│           └─▶ setGlobalData({ radarData })      │
└──────────────────────────────────────────────────┘
                      │
                      │ Data available globally
                      ▼
┌──────────────────────────────────────────────────┐
│  Runtime (React Component)                       │
│                                                  │
│  useRadarData(source?)                           │
│       │                                          │
│       ├─▶ if (source)                            │
│       │   ├─▶ fetch(source)                      │
│       │   ├─▶ parse & validate                   │
│       │   └─▶ return { data, loading, error }   │
│       │                                          │
│       └─▶ else                                   │
│           ├─▶ usePluginData()                    │
│           └─▶ return plugin's global data        │
└──────────────────────────────────────────────────┘
```

## Error Handling

**MUST** fournir des messages d'erreur clairs :

```typescript
// Build time errors
throw new Error(
  `[docusaurus-techradar-plugin] Invalid radar data in ${radarFile}:\n` +
  `- rings[0].color: must be a hex color (e.g., #5ba300)\n` +
  `- entries[5].quadrant: must be between 0 and 3 (got 4)`
);

// Runtime errors (custom source)
setError(new Error(
  `Failed to load radar data from ${source}:\n` +
  `File not found or invalid JSON`
));
```

## Performance Considerations

**SHOULD** :
- Valider uniquement au build time pour les données du plugin
- Cacher les données parsées
- Éviter les revalidations inutiles côté client

**MUST NOT** :
- Charger les données de manière synchrone côté client
- Bloquer le rendering pendant la validation

## Testing Requirements

**MUST** tester :
- Validation de données valides (pass)
- Validation de données invalides (fail avec messages clairs)
- Chargement JSON et YAML
- Gestion d'erreurs (fichier manquant, JSON malformé)
- Hook `useRadarData` avec et sans source

## Edge Cases

**MUST** gérer :
- Fichier vide → erreur claire
- Quadrants manquants ou incomplets → erreur
- Index `ring` hors limites → erreur
- Couleur invalide → erreur avec suggestion
- Link absent → OK (optionnel)
- Title absent → OK (optionnel, utiliser default)

## Related Specs

- [Plugin Architecture](../plugin-architecture/spec.md) - Lifecycle et chargement
- [Configuration](../configuration/spec.md) - Options du plugin
