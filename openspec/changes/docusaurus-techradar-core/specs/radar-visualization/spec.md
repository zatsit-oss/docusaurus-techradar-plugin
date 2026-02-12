## ADDED Requirements

> **Note**: Ce delta spec référence la spec principale déjà définie dans `openspec/specs/radar-visualization/spec.md`.
> 
> Toutes les requirements pour cette capability sont documentées dans le spec principal.

### Requirement: Composant doit charger D3.js depuis CDN côté client

Le composant DOIT charger D3.js v7 depuis CDN de manière asynchrone côté client uniquement.

#### Scenario: D3.js chargé avec succès
- **WHEN** composant monte dans le navigateur
- **THEN** D3.js est chargé depuis https://d3js.org/d3.v7.min.js
- **AND** l'état `d3Loaded` devient true
- **AND** le radar est rendu

#### Scenario: Loader affiché pendant chargement
- **WHEN** D3.js n'est pas encore chargé
- **THEN** un indicateur de chargement est affiché
- **AND** le radar n'est pas rendu

#### Scenario: Pas de chargement côté serveur
- **WHEN** Docusaurus génère la page en SSR
- **THEN** aucun appel à D3.js n'est fait
- **AND** le composant ne crash pas

### Requirement: Wrapper React doit intégrer radar.js de Zalando

Le composant DOIT utiliser le script radar.js de Zalando adapté en wrapper React.

#### Scenario: Radar rendu avec données valides
- **WHEN** composant reçoit des données radar valides et D3 est chargé
- **THEN** appelle radar_visualization avec les données
- **AND** le SVG radar est rendu dans le DOM

#### Scenario: Callback onEntryClick intégré
- **WHEN** utilisateur clique sur une entrée du radar
- **THEN** le callback onEntryClick est appelé avec les données de l'entry
- **AND** peut déclencher l'ouverture du modal

### Requirement: Composant doit utiliser ref React pour cibler SVG

Le composant DOIT utiliser une ref React pour fournir le SVG à D3.js.

#### Scenario: SVG ref passé à radar_visualization
- **WHEN** useEffect exécute le rendu D3
- **THEN** la ref SVG est utilisée comme cible
- **AND** D3 manipule le SVG via la ref

### Requirement: Composant doit gérer cleanup D3

Le composant DOIT nettoyer les éléments D3 lors du unmount pour éviter memory leaks.

#### Scenario: Cleanup lors du unmount
- **WHEN** composant est démonté
- **THEN** les event listeners D3 sont supprimés
- **AND** les éléments SVG générés par D3 sont nettoyés

### Requirement: Configuration visuelle doit être personnalisable

Le composant DOIT accepter width, height, colors, et autres options visuelles.

#### Scenario: Dimensions personnalisées
- **WHEN** composant reçoit width=1200 et height=900
- **THEN** le radar est rendu avec ces dimensions

#### Scenario: Couleurs personnalisées
- **WHEN** composant reçoit colors.background et colors.grid
- **THEN** le radar utilise ces couleurs au lieu des defaults

---

**Reference**: Voir `openspec/specs/radar-visualization/spec.md` pour la spécification complète incluant:
- Hook useD3Loader
- Wrapper React autour de radar.js
- Gestion du lifecycle et cleanup
- Configuration visuelle
- Adaptation du script Zalando
