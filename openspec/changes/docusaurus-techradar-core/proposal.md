## Why

Les équipes de développement ont besoin d'un moyen clair et visuel pour communiquer leurs choix technologiques, partager l'état d'adoption des outils, et guider les décisions d'architecture. Le Tech Radar (popularisé par ThoughtWorks et Zalando) est un format établi pour cette communication, mais il n'existe pas d'intégration native avec Docusaurus, l'outil de documentation standard pour de nombreuses équipes.

Ce plugin comble ce gap en apportant une visualisation Tech Radar interactive directement dans Docusaurus, permettant de centraliser la documentation technique et les choix technologiques au même endroit.

## What Changes

- **Plugin Docusaurus** complet avec lifecycle hooks standard (loadContent, contentLoaded, getThemePath, getClientModules)
- **Visualisation radar D3.js** basée sur le script Zalando, avec wrapper React pour intégration Docusaurus
- **Système de configuration** avec validation Joi et support multi-radar via props
- **Chargement de données** depuis fichiers JSON/YAML avec validation de schéma
- **Modal/Drawer interactif** avec animation slide pour afficher les détails des technologies et naviguer vers la documentation
- **Composant React principal** (`<TechRadar />`) orchestrant les vues et les interactions
- **Support client-side uniquement** (pas de SSR) pour la compatibilité D3.js
- **Styling avec Infima** (CSS framework Docusaurus) et support dark mode natif

## Capabilities

### New Capabilities

- `plugin-architecture`: Structure du plugin Docusaurus avec lifecycle hooks, exports de composants React, et intégration du système de thème
- `configuration`: Schéma de configuration du plugin avec validation Joi, options par défaut, et override via props
- `data-management`: Système de chargement et validation des données radar depuis JSON/YAML, avec hooks React pour accès aux données
- `radar-visualization`: Composant de visualisation du radar utilisant D3.js v7 et wrapper React autour du script Zalando
- `modal-drawer`: Modal/drawer avec animation slide depuis la droite pour afficher les détails d'une technologie et lien vers documentation
- `main-component`: Composant React principal `<TechRadar />` gérant l'état, le toggle des vues, et l'orchestration des sous-composants

### Modified Capabilities

<!-- Aucune capability existante n'est modifiée - c'est un nouveau plugin -->

## Impact

**Nouveau code** :
- `src/index.ts` - Point d'entrée du plugin
- `src/types.ts` - Types TypeScript partagés
- `src/validateConfig.ts` - Validation des options
- `src/loadRadarData.ts` - Logique de chargement des données
- `src/loadD3.js` - Module client pour chargement D3.js
- `src/theme/TechRadar/` - Composants React (index, RadarView, Modal, etc.)
- `src/theme/hooks/` - Custom hooks React

**Dépendances** :
- Peer dependencies : `@docusaurus/types`, `@docusaurus/utils`, `@docusaurus/utils-validation`, `react`, `react-dom`
- Runtime : D3.js v7 chargé depuis CDN (pas bundlé)

**Package.json** :
- Configuration comme plugin Docusaurus (main, types, keywords, peerDependencies)

**Pas d'impact** sur :
- Code utilisateur existant (nouveau plugin optionnel)
- Autres plugins Docusaurus
- Build time Docusaurus (chargement client-side uniquement)

## Non-Goals

- Vue liste avec filtres (sera un change séparé)
- Support SSR pour le radar D3.js
- Responsive mobile optimisé (MVP : dimensions fixes)
- Accessibilité avancée (focus trap, navigation clavier complète)
- Backend pour édition des données
- Génération automatique des données radar
- Export CSV/JSON des données
- Timeline/historique des changements
