## 1. Setup Project Structure

- [x] 1.1 Configurer package.json comme plugin Docusaurus (main, types, keywords, peerDependencies)
- [x] 1.2 Créer structure de dossiers src/ (index.ts, types.ts, theme/, hooks/)
- [x] 1.3 Ajouter peer dependencies (@docusaurus/types, @docusaurus/utils, @docusaurus/utils-validation)
- [x] 1.4 Configurer tsconfig.json pour exports multiples (ESM + CJS)

## 2. Types et Validation

- [x] 2.1 Définir types TypeScript dans src/types.ts (PluginOptions, RadarData, RadarEntry, etc.)
- [x] 2.2 Créer schema Joi pour validation options plugin dans src/validateConfig.ts
- [x] 2.3 Créer schema Joi pour validation données radar (RadarDataSchema)
- [x] 2.4 Implémenter fonction de merge des configs (defaults + plugin + props)

## 3. Plugin Lifecycle

- [x] 3.1 Implémenter fonction plugin principale dans src/index.ts
- [x] 3.2 Implémenter hook loadContent() pour charger et valider radarFile
- [x] 3.3 Implémenter hook contentLoaded() pour injecter données via setGlobalData
- [x] 3.4 Implémenter getThemePath() pour exposer src/theme
- [x] 3.5 Créer module client src/loadD3.js pour chargement D3.js CDN
- [x] 3.6 Implémenter getClientModules() pour retourner loadD3.js

## 4. Data Management

- [x] 4.1 Implémenter loadRadarData() dans src/loadRadarData.ts (support JSON et YAML)
- [x] 4.2 Ajouter gestion d'erreurs avec messages clairs (fichier manquant, JSON malformé, validation)
- [x] 4.3 Créer hook usePluginData() dans src/theme/hooks/usePluginData.ts
- [x] 4.4 Créer hook useRadarData(source?) dans src/theme/hooks/useRadarData.ts
- [x] 4.5 Gérer chargement custom source (fetch + validate client-side)

## 5. D3.js Loading Hook

- [x] 5.1 Créer hook useD3Loader() dans src/theme/hooks/useD3Loader.ts
- [x] 5.2 Implémenter chargement asynchrone D3.js depuis CDN (https://d3js.org/d3.v7.min.js)
- [x] 5.3 Ajouter SSR guard (typeof window === 'undefined')
- [x] 5.4 Gérer état loaded et erreurs de chargement
- [x] 5.5 Cleanup script tag lors du unmount

## 6. Adapter Zalando radar.js

- [x] 6.1 Télécharger radar.js depuis repo Zalando (https://github.com/zalando/tech-radar)
- [x] 6.2 Copier dans src/theme/TechRadar/radar.ts
- [x] 6.3 Convertir en module ES6 (export function radar_visualization)
- [x] 6.4 Ajouter callback onEntryClick dans la config
- [x] 6.5 Modifier pour utiliser ID SVG fourni (ref React) au lieu de sélecteur fixe
- [x] 6.6 Remplacer couleurs hardcodées par CSS variables Infima

## 7. RadarView Component

- [x] 7.1 Créer composant RadarView dans src/theme/TechRadar/RadarView.tsx
- [x] 7.2 Utiliser useRef pour cibler le SVG
- [x] 7.3 Utiliser useD3Loader pour attendre chargement D3
- [x] 7.4 Implémenter useEffect pour appeler radar_visualization
- [x] 7.5 Passer callback onEntryClick à radar_visualization
- [x] 7.6 Implémenter cleanup D3 dans useEffect return
- [x] 7.7 Créer composant RadarLoader pour affichage pendant chargement
- [x] 7.8 Accepter props width, height, colors

## 8. Modal/Drawer Component

- [x] 8.1 Créer composant Modal dans src/theme/TechRadar/Modal.tsx
- [x] 8.2 Utiliser createPortal pour render vers document.body
- [x] 8.3 Implémenter structure backdrop + drawer
- [x] 8.4 Créer animations CSS slide depuis droite (slideIn, slideOut)
- [x] 8.5 Gérer fermeture via bouton close, backdrop click, touche Escape
- [x] 8.6 Bloquer scroll du body quand modal ouvert (overflow: hidden)
- [x] 8.7 Afficher métadonnées de l'entrée (label, ring, quadrant, status)
- [x] 8.8 Afficher bouton lien documentation si entry.link présent
- [x] 8.9 Ajouter ARIA attributes (role="dialog", aria-modal, aria-labelledby)

## 9. Main TechRadar Component

- [x] 9.1 Créer composant principal dans src/theme/TechRadar/index.tsx
- [x] 9.2 Définir props interface (source, width, height, onEntryClick)
- [x] 9.3 Utiliser hooks useRadarData et useD3Loader
- [x] 9.4 Gérer state local (selectedEntry)
- [x] 9.5 Implémenter TechRadarLoader pour état loading
- [x] 9.6 Implémenter TechRadarError pour état error
- [x] 9.7 Orchestrer RadarView + Modal
- [x] 9.8 Gérer callback handleEntryClick
- [ ] 9.9 Wrapper dans Error Boundary

## 10. Styling

- [x] 10.1 Créer styles.module.css dans src/theme/TechRadar/
- [x] 10.2 Utiliser CSS variables Infima pour couleurs et spacing
- [x] 10.3 Implémenter styles modal/drawer avec animations
- [x] 10.4 Supporter dark mode via [data-theme='dark']
- [x] 10.5 Styles responsive basiques (full width sur mobile)
- [x] 10.6 Styles loader et error states

## 11. Tests - Plugin Lifecycle

- [ ] 11.1 Tester loadContent charge et valide JSON valide
- [ ] 11.2 Tester loadContent échoue avec JSON invalide (message clair)
- [ ] 11.3 Tester loadContent échoue avec fichier manquant
- [ ] 11.4 Tester contentLoaded injecte données via setGlobalData
- [ ] 11.5 Tester validation config plugin (options valides/invalides)

## 12. Tests - Hooks

- [ ] 12.1 Tester useD3Loader charge D3 depuis CDN (mock)
- [ ] 12.2 Tester useD3Loader retourne loaded state correct
- [ ] 12.3 Tester useRadarData charge depuis plugin data
- [ ] 12.4 Tester useRadarData charge depuis custom source
- [ ] 12.5 Tester useRadarData gère erreurs (loading, error states)

## 13. Tests - Components

- [ ] 13.1 Tester RadarView render après D3 loaded
- [ ] 13.2 Tester RadarView affiche loader pendant chargement
- [ ] 13.3 Tester RadarView appelle onEntryClick au clic
- [ ] 13.4 Tester Modal s'ouvre avec entry non-null
- [ ] 13.5 Tester Modal se ferme via close button, backdrop, Escape
- [ ] 13.6 Tester Modal affiche métadonnées correctement
- [ ] 13.7 Tester Modal affiche lien docs si entry.link présent
- [ ] 13.8 Tester TechRadar affiche loader puis contenu
- [ ] 13.9 Tester TechRadar affiche erreur en cas d'échec
- [ ] 13.10 Tester TechRadar gère multi-instances avec sources différentes

## 14. Documentation

- [ ] 14.1 Mettre à jour README.md avec installation et usage
- [ ] 14.2 Documenter toutes les options de configuration
- [ ] 14.3 Ajouter exemples d'usage (basic, multi-radar, custom config)
- [ ] 14.4 Documenter format des données (JSON/YAML schema)
- [ ] 14.5 Ajouter section troubleshooting (D3 ne charge pas, etc.)
- [ ] 14.6 Créditer Zalando tech-radar avec lien et license

## 15. Build et Package

- [ ] 15.1 Tester build avec `bun run build`
- [ ] 15.2 Vérifier dist/ contient index.js, index.cjs, index.d.ts
- [ ] 15.3 Vérifier exports package.json (ESM + CJS)
- [ ] 15.4 Tester installation locale dans un site Docusaurus test
- [ ] 15.5 Valider que composant est accessible via @theme/TechRadar
