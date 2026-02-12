## ADDED Requirements

> **Note**: Ce delta spec référence la spec principale déjà définie dans `openspec/specs/plugin-architecture/spec.md`.
> 
> Toutes les requirements pour cette capability sont documentées dans le spec principal.

### Requirement: Plugin doit implémenter le lifecycle Docusaurus standard

Le plugin DOIT exporter une fonction qui retourne un objet Plugin avec les hooks `loadContent`, `contentLoaded`, `getThemePath`, et `getClientModules`.

#### Scenario: Plugin initialisé au build Docusaurus
- **WHEN** Docusaurus démarre le build
- **THEN** le plugin charge les données radar depuis le fichier configuré
- **AND** valide le format des données
- **AND** expose les composants via getThemePath

#### Scenario: Composants disponibles dans les pages
- **WHEN** utilisateur importe `@theme/TechRadar`
- **THEN** le composant principal TechRadar est accessible
- **AND** peut être utilisé dans n'importe quelle page MDX

### Requirement: Plugin doit supporter le chargement client-side uniquement

Le plugin DOIT charger D3.js côté client uniquement pour éviter les problèmes de SSR.

#### Scenario: D3.js chargé après hydration
- **WHEN** la page Docusaurus est rendue côté client
- **THEN** le script D3.js est chargé depuis le CDN
- **AND** le radar n'est rendu qu'après chargement de D3
- **AND** un loader est affiché pendant le chargement

### Requirement: Plugin doit supporter multi-radar

Le plugin DOIT permettre l'utilisation de plusieurs radars indépendants sur le même site.

#### Scenario: Plusieurs radars avec sources différentes
- **WHEN** utilisateur utilise `<TechRadar source="./frontend.json" />` et `<TechRadar source="./backend.json" />`
- **THEN** chaque instance charge ses propres données
- **AND** les instances sont indépendantes (pas d'état partagé)

#### Scenario: Radar sans source utilise config par défaut
- **WHEN** utilisateur utilise `<TechRadar />` sans prop source
- **THEN** le composant utilise le radarFile configuré dans docusaurus.config.js

### Requirement: Package.json doit être configuré comme plugin Docusaurus

Le package.json DOIT contenir les keywords et peerDependencies appropriés pour un plugin Docusaurus.

#### Scenario: Package installable via npm
- **WHEN** utilisateur exécute `npm install docusaurus-techradar-plugin`
- **THEN** le package s'installe avec les peer dependencies correctes
- **AND** est reconnu comme plugin Docusaurus

---

**Reference**: Voir `openspec/specs/plugin-architecture/spec.md` pour la spécification complète incluant:
- Structure du plugin
- Configuration package.json
- Lifecycle hooks détaillés
- Diagrammes d'architecture
- Support multi-radar
