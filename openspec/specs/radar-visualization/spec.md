# Radar Visualization

## Overview

Composant de visualisation du Tech Radar utilisant D3.js v7 et le script `radar.js` de Zalando. Wrapper React autour de la visualisation D3, avec chargement client-side et intégration dans Docusaurus.

## Requirements

### D3.js Loading

**MUST** charger D3.js depuis CDN côté client uniquement :
- URL : `https://d3js.org/d3.v7.min.js`
- Chargement asynchrone dans `useEffect`
- Hook `useD3Loader()` pour gérer l'état

**MUST** afficher un loader pendant le chargement :
```tsx
{!d3Loaded && (
  <div className="radar-loading">
    <div className="spinner" />
    Chargement du radar...
  </div>
)}
```

**MUST NOT** rendre le radar avant que D3 soit chargé

### Zalando Radar Integration

**MUST** utiliser le script `radar.js` de Zalando :
- Source : https://github.com/zalando/tech-radar/blob/master/docs/radar.js
- Version : Compatible avec D3.js v7
- Adaptation : Wrapper React, pas de réécriture complète

**SHOULD** copier et adapter `radar.js` :
- Placer dans `src/theme/TechRadar/radar.ts`
- Convertir en module ES6
- Exposer fonction `radar_visualization(config)`

### React Integration

**MUST** créer un wrapper React :

```tsx
interface RadarViewProps {
  data: RadarData;
  width?: number;
  height?: number;
  onEntryClick?: (entry: RadarEntry) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({
  data,
  width = 1450,
  height = 1000,
  onEntryClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const d3Loaded = useD3Loader();

  useEffect(() => {
    if (!d3Loaded || !svgRef.current) return;

    // Appeler radar_visualization
    radar_visualization({
      svg_id: svgRef.current.id,
      width,
      height,
      quadrants: data.quadrants,
      rings: data.rings,
      entries: data.entries,
      // ... autres options
    });
  }, [d3Loaded, data, width, height]);

  return (
    <div className="radar-view">
      {!d3Loaded && <RadarLoader />}
      <svg ref={svgRef} id="tech-radar" />
    </div>
  );
};
```

**MUST** gérer le cleanup dans `useEffect` :
- Supprimer les éléments D3 lors du unmount
- Éviter les memory leaks

### Click Handling

**MUST** permettre de capturer les clics sur les entrées :
- Intercepter les événements de clic D3
- Appeler `onEntryClick(entry)` avec les données de l'entrée
- Permettre la navigation ou l'ouverture du modal

**SHOULD** adapter `radar.js` pour exposer les clics :
```javascript
blip.on('click', function(event, d) {
  // Appeler callback React
  if (config.onEntryClick) {
    config.onEntryClick(d);
  }
});
```

### Styling

**MUST** utiliser Infima (CSS Docusaurus) :
- Classes CSS modules : `styles.module.css`
- Variables Infima pour couleurs et spacing
- Mode sombre supporté via CSS variables Docusaurus

**MUST** rendre le radar responsive (future feature, pas MVP) :
- Pour MVP : dimensions fixes
- Ajouter note dans docs que responsive viendra plus tard

### Configuration Options

**MUST** accepter les options de customisation :

```typescript
interface RadarConfig {
  width?: number;          // Default: 1450
  height?: number;         // Default: 1000
  colors?: {
    background?: string;   // Default: var(--ifm-background-color)
    grid?: string;         // Default: #bbb
    inactive?: string;     // Default: #ddd
  };
  fontFamily?: string;     // Default: var(--ifm-font-family-base)
  scale?: number;          // Default: 1.0
}
```

## Component Architecture

```
┌─────────────────────────────────────────────────┐
│  RadarView Component                            │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ useD3Loader()                             │  │
│  │  ├─ Check if D3 loaded                    │  │
│  │  ├─ Load from CDN if needed               │  │
│  │  └─ Return loaded state                   │  │
│  └───────────────────────────────────────────┘  │
│                  │                              │
│                  ▼                              │
│  ┌───────────────────────────────────────────┐  │
│  │ {!loaded && <RadarLoader />}              │  │
│  └───────────────────────────────────────────┘  │
│                  │                              │
│                  ▼                              │
│  ┌───────────────────────────────────────────┐  │
│  │ <svg ref={svgRef} id="tech-radar" />      │  │
│  └───────────────────────────────────────────┘  │
│                  │                              │
│                  ▼                              │
│  ┌───────────────────────────────────────────┐  │
│  │ useEffect(() => {                         │  │
│  │   radar_visualization({                   │  │
│  │     svg_id: svgRef.current.id,            │  │
│  │     entries: data.entries,                │  │
│  │     onEntryClick: handleClick             │  │
│  │   })                                      │  │
│  │ }, [loaded, data])                        │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## D3 Loading Hook

```typescript
// src/theme/hooks/useD3Loader.ts

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    d3: any;
  }
}

export function useD3Loader(): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return;

    // Already loaded
    if (window.d3) {
      setLoaded(true);
      return;
    }

    // Load from CDN
    const script = document.createElement('script');
    script.src = 'https://d3js.org/d3.v7.min.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => {
      console.error('Failed to load D3.js from CDN');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts before load
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return loaded;
}
```

## Zalando Radar Adaptation

**MUST** adapter le script original :
1. Copier `radar.js` depuis le repo Zalando
2. Convertir en module ES6
3. Exporter `radar_visualization` comme fonction
4. Ajouter callback `onEntryClick` dans la config
5. Remplacer les couleurs hardcodées par des CSS variables
6. Utiliser l'ID du SVG fourni (ref React) au lieu de sélecteur fixe

**SHOULD NOT** réécrire complètement :
- Garder la logique de positionnement automatique
- Garder les calculs de collision
- Garder le système de quadrants et rings

## Testing

**MUST** tester :
- Chargement de D3 depuis CDN (mock)
- Rendu du SVG après chargement
- Callback onEntryClick quand on clique
- Cleanup lors du unmount
- Affichage du loader pendant chargement

**SHOULD** tester :
- Différentes tailles (width/height)
- Différentes configurations de couleurs
- Gestion d'erreur si D3 ne charge pas

## Performance

**SHOULD** :
- Éviter les re-renders inutiles (memo ou useMemo)
- Ne recréer le radar que si les données changent
- Cleanup D3 éléments avant re-render

**MUST NOT** :
- Créer plusieurs instances de radar dans le même SVG
- Laisser des event listeners actifs après unmount

## Accessibility

**SHOULD** (future, pas MVP) :
- Ajouter ARIA labels aux éléments SVG
- Rendre navigable au clavier
- Fournir texte alternatif

Pour MVP :
- Fournir la vue liste comme alternative accessible

## Non-Goals

- Ne pas réécrire le radar en React natif (garder Zalando)
- Ne pas supporter SSR pour cette visualisation
- Ne pas rendre responsive dans MVP
- Ne pas améliorer l'accessibilité dans MVP (vue liste = alternative)

## Related Specs

- [Plugin Architecture](../plugin-architecture/spec.md) - Intégration du composant
- [Data Management](../data-management/spec.md) - Format des données
- [Modal Drawer](../modal-drawer/spec.md) - Interaction au clic
