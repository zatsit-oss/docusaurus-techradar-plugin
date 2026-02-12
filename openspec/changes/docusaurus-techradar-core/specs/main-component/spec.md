## ADDED Requirements

> **Note**: Ce delta spec référence la spec principale déjà définie dans `openspec/specs/main-component/spec.md`.
> 
> Toutes les requirements pour cette capability sont documentées dans le spec principal.

### Requirement: Composant principal doit orchestrer toutes les sous-composants

Le composant `<TechRadar />` DOIT orchestrer RadarView, Modal, et gérer l'état global.

#### Scenario: Rendu avec toutes les parties
- **WHEN** composant est utilisé avec données valides
- **THEN** affiche RadarView
- **AND** gère le state pour selectedEntry
- **AND** rend Modal quand une entrée est sélectionnée

### Requirement: Composant doit accepter props pour override config

Le composant DOIT accepter props `source`, `width`, `height` pour override la config plugin.

#### Scenario: Prop source override radarFile du plugin
- **WHEN** utilisateur passe `<TechRadar source="./custom.json" />`
- **THEN** composant charge ./custom.json au lieu du radarFile plugin

#### Scenario: Props visuelles overrident config
- **WHEN** utilisateur passe width et height
- **THEN** RadarView utilise ces dimensions au lieu des defaults plugin

### Requirement: Composant doit gérer état de chargement

Le composant DOIT afficher un loader pendant le chargement des données ou de D3.js.

#### Scenario: Loader affiché pendant chargement
- **WHEN** données ou D3 ne sont pas encore chargés
- **THEN** affiche TechRadarLoader
- **AND** n'affiche pas RadarView ou Modal

#### Scenario: Contenu affiché après chargement
- **WHEN** données et D3 sont chargés
- **THEN** masque le loader
- **AND** affiche RadarView

### Requirement: Composant doit gérer erreurs de chargement

Le composant DOIT afficher une alerte claire en cas d'erreur de chargement.

#### Scenario: Erreur de chargement affichée
- **WHEN** chargement des données échoue
- **THEN** affiche TechRadarError avec message d'erreur
- **AND** utilise alerte Infima (alert--danger)

### Requirement: Composant doit gérer les clics sur les entrées

Le composant DOIT capturer les clics sur les entrées et ouvrir le modal.

#### Scenario: Clic sur entrée ouvre modal
- **WHEN** utilisateur clique sur une entrée dans RadarView
- **THEN** setState selectedEntry avec les données de l'entrée
- **AND** Modal s'ouvre avec ces données

#### Scenario: Fermeture modal réinitialise state
- **WHEN** utilisateur ferme le modal
- **THEN** setState selectedEntry à null
- **AND** Modal se ferme

### Requirement: Composant doit utiliser hooks pour charger données

Le composant DOIT utiliser `useRadarData` et `useD3Loader` hooks.

#### Scenario: useRadarData charge depuis plugin ou source
- **WHEN** composant monte
- **THEN** useRadarData est appelé avec source prop ou undefined
- **AND** retourne { data, loading, error }

#### Scenario: useD3Loader gère chargement D3
- **WHEN** composant monte côté client
- **THEN** useD3Loader charge D3.js depuis CDN
- **AND** retourne l'état loaded (boolean)

### Requirement: Composant doit supporter callback onEntryClick optionnel

Le composant DOIT accepter un callback `onEntryClick` pour permettre comportements custom.

#### Scenario: Callback optionnel appelé au clic
- **WHEN** utilisateur clique sur entrée et callback est fourni
- **THEN** callback est appelé avec les données de l'entrée
- **AND** le comportement par défaut (ouvrir modal) continue

---

**Reference**: Voir `openspec/specs/main-component/spec.md` pour la spécification complète incluant:
- API du composant (props)
- State management
- Integration RadarView + Modal
- Hooks (useRadarData, useD3Loader)
- Loading et error states
- Usage examples
