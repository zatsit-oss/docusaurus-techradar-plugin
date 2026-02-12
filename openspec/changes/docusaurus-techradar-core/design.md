## Context

Ce design couvre l'implémentation d'un plugin Docusaurus pour afficher un Tech Radar interactif. Le Tech Radar est un outil de communication visuel popularisé par ThoughtWorks et implémenté par Zalando avec D3.js.

**Contraintes techniques** :
- Docusaurus utilise SSR (Server-Side Rendering) pour générer des pages statiques
- D3.js manipule le DOM directement, incompatible avec SSR
- Le plugin doit s'intégrer dans l'écosystème Docusaurus (lifecycle hooks, theming, etc.)
- Les données radar doivent être versionables et éditables simplement (JSON/YAML)

**Stakeholders** :
- Équipes de développement documentant leurs choix technologiques
- Architectes définissant les standards techniques
- Développeurs contribuant à la documentation

## Goals / Non-Goals

**Goals** :
- Plugin Docusaurus fonctionnel et packagé pour npm
- Visualisation radar basée sur D3.js + script Zalando
- Modal interactif pour naviguer vers la documentation
- Support de multiples radars dans un même site (`source` prop)
- Configuration flexible avec validation
- Styling cohérent avec Docusaurus (Infima + dark mode)

**Non-Goals** :
- Vue liste avec filtres (change séparé `techradar-list-view`)
- SSR pour le radar visuel
- Backend pour éditer les données
- Génération automatique des données radar
- Mobile-first responsive (MVP : dimensions fixes, amélioration future)

## Decisions

### 1. Plugin > Library React standalone

**Décision** : Implémenter comme plugin Docusaurus, pas comme simple library React.

**Alternatives** :
- Library React : utilisateur fait `import TechRadar from 'lib'` et gère les données manuellement
- Plugin Docusaurus : configuration centralisée dans `docusaurus.config.js`, lifecycle hooks, données injectées globalement

**Rationale** :
- Meilleure intégration Docusaurus (conventions, theming, lifecycle)
- Gestion automatique des données au build time
- Configuration centralisée
- Exposition automatique via `@theme/TechRadar`

### 2. D3.js via CDN, chargement client-side

**Décision** : Charger D3.js v7 depuis CDN (`https://d3js.org/d3.v7.min.js`) côté client uniquement.

**Alternatives** :
- Bundle D3.js dans le plugin : augmente drastiquement la taille du bundle (~250KB)
- Réécrire en React natif : effort énorme, maintenance complexe
- Utiliser react-d3 ou visx : styles différents, pas compatible avec Zalando radar.js

**Rationale** :
- Évite bundle bloat (D3 ~250KB minified)
- Résout le problème SSR : le code D3 ne s'exécute que côté client
- Réutilise le script Zalando éprouvé
- Cache navigateur pour D3.js

**Implementation** :
```typescript
// useD3Loader hook
useEffect(() => {
  if (typeof window === 'undefined') return; // SSR guard
  if (window.d3) { setLoaded(true); return; }
  
  const script = document.createElement('script');
  script.src = 'https://d3js.org/d3.v7.min.js';
  script.async = true;
  script.onload = () => setLoaded(true);
  document.head.appendChild(script);
}, []);
```

### 3. Wrapper React autour de Zalando radar.js

**Décision** : Copier et adapter `radar.js` de Zalando comme wrapper React, ne pas réécrire.

**Alternatives** :
- Réécrire complètement en React : effort massif, risque de bugs
- Utiliser iframe : isolation mais problèmes de communication et styling

**Rationale** :
- Algorithme de positionnement automatique éprouvé (évite collisions)
- Calculs géométriques complexes déjà résolus
- Maintien de la compatibilité visuelle avec Zalando
- Focus sur l'intégration Docusaurus, pas sur réinventer la roue

**Adaptations nécessaires** :
- Convertir en module ES6
- Exposer callback `onEntryClick` pour intégration React
- Utiliser ref React pour cibler le SVG
- Remplacer couleurs hardcodées par CSS variables Infima

### 4. Modal/Drawer avec Infima, pas de bibliothèque externe

**Décision** : Implémenter le modal/drawer en React + CSS modules avec Infima, pas de `react-modal` ou autre lib.

**Alternatives** :
- react-modal : dépendance supplémentaire, styles à overrider
- Headless UI : plus de code, over-engineering pour ce cas simple

**Rationale** :
- Infima déjà présent dans Docusaurus
- Contrôle total du styling et animations
- Pas de dépendance supplémentaire
- Cohérence visuelle garantie

**Implementation** :
```tsx
// React Portal pour render au top-level
return createPortal(
  <div className={styles.backdrop} onClick={onClose}>
    <div className={styles.drawer} onClick={e => e.stopPropagation()}>
      {/* Content */}
    </div>
  </div>,
  document.body
);
```

```css
/* Animation slide depuis la droite */
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.drawer { animation: slideIn 300ms ease-in-out; }
```

### 5. Multi-radar via prop `source`, pas global state

**Décision** : Supporter plusieurs radars via `<TechRadar source="./custom.json" />`, state local par instance.

**Alternatives** :
- State global (Redux/Context) : over-engineering, complexité inutile
- Un seul radar par site : trop limitant

**Rationale** :
- Flexibilité maximale (frontend-radar.json, backend-radar.json, etc.)
- Isolation des instances (pas d'effets de bord)
- Simplicité d'implémentation
- Fallback sur la config du plugin si pas de `source`

### 6. Validation Joi au build time

**Décision** : Valider les données avec `@docusaurus/utils-validation` (Joi-based) au build time.

**Alternatives** :
- Zod : plus moderne mais dépendance supplémentaire
- Validation runtime : ralentit le client, erreurs tardives

**Rationale** :
- Intégration native Docusaurus (déjà présent)
- Erreurs détectées au build (fail fast)
- Pas d'overhead runtime
- Messages d'erreur contextuels

## Risks / Trade-offs

### [Risk] D3.js CDN indisponible
**Mitigation** : Afficher loader avec message clair. Future : option pour bundle D3.js localement.

### [Risk] Radar illisible avec 100+ technologies
**Mitigation** : Documentation recommandant max 60-80 entrées. Future : pagination ou filtrage.

### [Risk] Pas de SSR pour le radar
**Impact** : SEO limité pour le contenu du radar lui-même. Le reste de la page Docusaurus est SSR.
**Mitigation** : Acceptable car c'est une visualisation interactive, pas du contenu textuel critique.

### [Trade-off] Dimensions fixes (pas responsive)
**Impact** : Sur mobile, le radar peut déborder ou être trop petit.
**Mitigation** : MVP accepte cette limitation. Future feature : scale dynamique basé sur viewport.

### [Trade-off] Wrapper Zalando vs réécriture
**Pro** : Gain de temps énorme, algo éprouvé
**Con** : Dépendance sur code tiers, moins de contrôle
**Decision** : Acceptable car code MIT license, stable, et modificable si besoin.

## Plugin Lifecycle Architecture

```
Build Time                    Runtime (Browser)
═══════════                   ═════════════════

┌─────────────────┐
│ loadContent()   │
│ - Read JSON     │
│ - Validate      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│contentLoaded()  │
│ - setGlobalData │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ getThemePath()  │─────────────────────▶ Components available
└─────────────────┘                      in @theme/TechRadar
         │
         ▼
┌─────────────────┐
│getClientModules │─────────────────────▶ D3.js loaded client-side
└─────────────────┘
                                         ┌──────────────────┐
                                         │ <TechRadar />    │
                                         │ - useRadarData() │
                                         │ - useD3Loader()  │
                                         │ - RadarView      │
                                         │ - Modal          │
                                         └──────────────────┘
```

## Component Hierarchy

```
<TechRadar source? view? width? height?>
  │
  ├─ useRadarData(source) ────▶ Load from plugin or custom source
  ├─ useD3Loader() ───────────▶ Ensure D3.js loaded
  │
  ├─ State:
  │   - selectedEntry
  │   - d3Loaded
  │
  ├─ <RadarView>
  │   ├─ useEffect: render D3 radar
  │   ├─ <svg ref={svgRef}>
  │   └─ onEntryClick ─────────▶ setSelectedEntry
  │
  └─ <Modal entry={selectedEntry}>
      ├─ React Portal
      ├─ Backdrop
      └─ Drawer (slide animation)
          ├─ Entry details
          └─ Link to docs
```

## Data Flow

```
docusaurus.config.js
  ├─ radarFile: "./data/radar.json"
  │
  ▼
Plugin loadContent()
  ├─ fs.readFile(radarFile)
  ├─ JSON.parse()
  ├─ Joi.validate()
  └─ return validated data
  │
  ▼
Plugin contentLoaded()
  └─ setGlobalData({ radarData })
  │
  ▼
Component useRadarData(source?)
  ├─ if (source) → fetch + validate
  └─ else → usePluginData()
  │
  ▼
<RadarView data={radarData} />
```

## File Structure

```
src/
├─ index.ts                   # Plugin entry, lifecycle hooks
├─ types.ts                   # Shared TypeScript interfaces
├─ validateConfig.ts          # Joi schema for plugin options
├─ loadRadarData.ts           # Load & validate JSON/YAML
├─ loadD3.js                  # Client module for D3.js CDN
│
└─ theme/
   ├─ TechRadar/
   │  ├─ index.tsx            # Main component
   │  ├─ RadarView.tsx        # D3 visualization
   │  ├─ Modal.tsx            # Drawer component
   │  ├─ radar.ts             # Adapted Zalando radar.js
   │  └─ styles.module.css    # Component styles
   │
   └─ hooks/
      ├─ useD3Loader.ts       # D3 CDN loading hook
      ├─ useRadarData.ts      # Data fetching hook
      └─ usePluginData.ts     # Plugin global data access
```

## Migration Plan

N/A - Nouveau plugin, pas de migration nécessaire.

**Déploiement** :
1. Build : `bun run build` → génère `dist/`
2. Publish : `npm publish`
3. Installation user : `npm install docusaurus-techradar-plugin`
4. Configuration dans `docusaurus.config.js`
5. Usage : `import TechRadar from '@theme/TechRadar'` dans MDX

**Rollback** : Retirer le plugin de la config Docusaurus.

## Open Questions

1. **Fallback si D3.js ne charge pas** : Afficher juste un message d'erreur ou fallback sur une vue simplifiée ?
   → Décision : Message d'erreur clair pour MVP

2. **Performance avec 100+ entrées** : Limite technique ou juste UX dégradé ?
   → À tester pendant implémentation, documenter les limites recommandées

3. **License Zalando radar.js** : MIT, OK pour copier et adapter ?
   → Oui, MIT license permet réutilisation. Créditer dans README.

4. **Version de D3.js** : Figer sur v7.x ou permettre v8+ ?
   → Figer sur v7 pour compatibilité Zalando radar.js, upgrade future si besoin
