# Configuration

## Overview

Configuration du plugin Docusaurus pour le Tech Radar. Options dans `docusaurus.config.js` et validation avec schéma Joi.

## Requirements

### Plugin Options

**MUST** supporter les options suivantes :

```typescript
interface PluginOptions {
  // Data source (obligatoire)
  radarFile: string;  // Chemin vers JSON/YAML
  
  // Visual customization (optionnel)
  title?: string;
  width?: number;
  height?: number;
  colors?: {
    background?: string;
    grid?: string;
    inactive?: string;
  };
  fontFamily?: string;
  scale?: number;
  
  // Behavior (optionnel)
  defaultView?: 'radar' | 'list';
  openLinksInNewTab?: boolean;
}
```

### Default Values

```typescript
const DEFAULT_OPTIONS: Required<Omit<PluginOptions, 'radarFile'>> = {
  title: 'Tech Radar',
  width: 1450,
  height: 1000,
  colors: {
    background: 'var(--ifm-background-color)',
    grid: '#bbb',
    inactive: '#ddd'
  },
  fontFamily: 'var(--ifm-font-family-base)',
  scale: 1.0,
  defaultView: 'radar',
  openLinksInNewTab: true
};
```

### Validation Schema

**MUST** valider avec Joi :

```typescript
import { Joi } from '@docusaurus/utils-validation';

export const PluginOptionsSchema = Joi.object({
  radarFile: Joi.string().required(),
  title: Joi.string().optional(),
  width: Joi.number().integer().min(400).max(3000).optional(),
  height: Joi.number().integer().min(400).max(3000).optional(),
  colors: Joi.object({
    background: Joi.string().optional(),
    grid: Joi.string().optional(),
    inactive: Joi.string().optional()
  }).optional(),
  fontFamily: Joi.string().optional(),
  scale: Joi.number().min(0.5).max(2.0).optional(),
  defaultView: Joi.string().valid('radar', 'list').optional(),
  openLinksInNewTab: Joi.boolean().optional()
});
```

## Usage Example

```javascript
// docusaurus.config.js

module.exports = {
  // ... autres configs
  
  plugins: [
    [
      'docusaurus-techradar-plugin',
      {
        // Obligatoire
        radarFile: './data/tech-radar.json',
        
        // Optionnel
        title: 'Notre Tech Radar 2026',
        width: 1200,
        height: 900,
        defaultView: 'list',
        colors: {
          background: '#f5f5f5',
          grid: '#999',
          inactive: '#ccc'
        }
      }
    ]
  ]
};
```

## Component Props

**MUST** permettre de override via props du composant :

```tsx
// Dans une page Docusaurus
import TechRadar from '@theme/TechRadar';

<TechRadar 
  source="./custom-radar.json"  // Override radarFile
  view="list"                    // Override defaultView
  width={1000}                   // Override width
/>
```

**Priority** : Props > Plugin options > Defaults

## Configuration Merging

```typescript
function mergeConfigs(
  pluginOptions: PluginOptions,
  componentProps: Partial<PluginOptions>
): Required<PluginOptions> {
  return {
    ...DEFAULT_OPTIONS,
    ...pluginOptions,
    ...componentProps,
    colors: {
      ...DEFAULT_OPTIONS.colors,
      ...pluginOptions.colors,
      ...componentProps.colors
    }
  };
}
```

## Error Messages

**MUST** fournir messages clairs pour erreurs de config :

```typescript
// radarFile manquant
throw new Error(
  '[docusaurus-techradar-plugin] Option "radarFile" is required.\n' +
  'Add it to your docusaurus.config.js:\n' +
  '  plugins: [["docusaurus-techradar-plugin", { radarFile: "./data/radar.json" }]]'
);

// width invalide
throw new Error(
  '[docusaurus-techradar-plugin] Option "width" must be between 400 and 3000 (got 5000)'
);

// defaultView invalide
throw new Error(
  '[docusaurus-techradar-plugin] Option "defaultView" must be "radar" or "list" (got "table")'
);
```

## Environment-Specific Config

**SHOULD** supporter différentes configs par environnement :

```javascript
// docusaurus.config.js
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: [
    [
      'docusaurus-techradar-plugin',
      {
        radarFile: isDev 
          ? './data/tech-radar.dev.json'
          : './data/tech-radar.prod.json'
      }
    ]
  ]
};
```

## TypeScript Support

**MUST** exposer les types :

```typescript
// src/types.ts
export interface PluginOptions {
  radarFile: string;
  title?: string;
  width?: number;
  height?: number;
  colors?: {
    background?: string;
    grid?: string;
    inactive?: string;
  };
  fontFamily?: string;
  scale?: number;
  defaultView?: 'radar' | 'list';
  openLinksInNewTab?: boolean;
}

// Export pour les utilisateurs
export type { PluginOptions } from './types';
```

**Users can import** :
```typescript
import type { PluginOptions } from 'docusaurus-techradar-plugin';
```

## Preset Support (Future)

**SHOULD** (future, pas MVP) supporter Docusaurus presets :

```javascript
// Future: docusaurus-preset-techradar
module.exports = function preset(context, opts = {}) {
  return {
    plugins: [
      ['docusaurus-techradar-plugin', opts]
    ],
    themes: []
  };
};
```

## CSS Variables

**SHOULD** exposer CSS variables pour deep customization :

```css
/* Injected by plugin */
:root {
  --techradar-bg: var(--ifm-background-color);
  --techradar-grid: #bbb;
  --techradar-inactive: #ddd;
  --techradar-font: var(--ifm-font-family-base);
}

[data-theme='dark'] {
  --techradar-bg: var(--ifm-background-color);
  --techradar-grid: #555;
  --techradar-inactive: #333;
}
```

Users can override :
```css
/* src/css/custom.css */
:root {
  --techradar-grid: #ff0000;
}
```

## Testing

**MUST** tester :
- Validation réussie avec config valide
- Validation échouée avec config invalide (radarFile manquant, types invalides)
- Merge des configs (defaults + plugin + props)
- Messages d'erreur clairs

## Documentation

**MUST** documenter dans README.md :
- Toutes les options disponibles
- Valeurs par défaut
- Exemples d'usage
- Types TypeScript

**Format** :

```markdown
## Configuration

### Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `radarFile` | `string` | - | **(Required)** Path to radar data file (JSON/YAML) |
| `title` | `string` | `'Tech Radar'` | Title of the radar |
| `width` | `number` | `1450` | Radar width in pixels (400-3000) |
| ... | ... | ... | ... |

### Example

\`\`\`javascript
// docusaurus.config.js
module.exports = {
  plugins: [
    ['docusaurus-techradar-plugin', {
      radarFile: './data/tech-radar.json',
      title: 'Our Tech Radar',
      defaultView: 'list'
    }]
  ]
};
\`\`\`
```

## Non-Goals

- Pas de UI pour éditer la config (tout en code)
- Pas de config via fichier séparé (tout dans docusaurus.config.js)
- Pas de génération automatique de radar data (MVP)
- Pas de remote data fetching (seulement fichiers locaux)

## Related Specs

- [Plugin Architecture](../plugin-architecture/spec.md) - Plugin lifecycle
- [Data Management](../data-management/spec.md) - radarFile loading
- [Radar Visualization](../radar-visualization/spec.md) - Visual options usage
