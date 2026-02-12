## ADDED Requirements

> **Note**: Ce delta spec référence la spec principale déjà définie dans `openspec/specs/modal-drawer/spec.md`.
> 
> Toutes les requirements pour cette capability sont documentées dans le spec principal.

### Requirement: Modal doit s'ouvrir au clic sur une technologie

Le modal/drawer DOIT s'ouvrir lorsque l'utilisateur clique sur une entrée du radar.

#### Scenario: Ouverture au clic depuis radar
- **WHEN** utilisateur clique sur une entrée dans le radar
- **THEN** le callback onEntryClick est appelé
- **AND** le modal s'ouvre avec les détails de l'entrée

### Requirement: Modal doit animer avec slide depuis la droite

Le modal DOIT utiliser une animation slide-in depuis la droite.

#### Scenario: Animation d'entrée
- **WHEN** modal s'ouvre
- **THEN** le drawer slide de translateX(100%) à translateX(0%)
- **AND** l'animation dure 300ms avec easing ease-in-out

#### Scenario: Animation de sortie
- **WHEN** modal se ferme
- **THEN** le drawer slide de translateX(0%) à translateX(100%)
- **AND** l'animation dure 300ms

### Requirement: Modal doit se fermer via multiples moyens

Le modal DOIT se fermer via bouton close, backdrop click, ou touche Escape.

#### Scenario: Fermeture via bouton close
- **WHEN** utilisateur clique sur le bouton × dans le header
- **THEN** le modal se ferme

#### Scenario: Fermeture via backdrop
- **WHEN** utilisateur clique sur l'overlay backdrop
- **THEN** le modal se ferme

#### Scenario: Fermeture via touche Escape
- **WHEN** utilisateur appuie sur Escape avec modal ouvert
- **THEN** le modal se ferme

### Requirement: Modal doit afficher métadonnées de l'entrée

Le modal DOIT afficher le nom, ring, quadrant, et statut de la technologie.

#### Scenario: Affichage des métadonnées
- **WHEN** modal s'ouvre pour une entrée
- **THEN** affiche le label de l'entrée
- **AND** affiche le ring avec badge coloré
- **AND** affiche le quadrant
- **AND** affiche le statut (moved) avec icône

### Requirement: Modal doit afficher lien vers documentation si présent

Le modal DOIT afficher un bouton vers la documentation si l'entrée a un champ `link`.

#### Scenario: Lien documentation présent
- **WHEN** entrée contient `"link": "/docs/react"`
- **THEN** modal affiche bouton "Voir la documentation complète"
- **AND** le clic navigue vers /docs/react

#### Scenario: Lien documentation absent
- **WHEN** entrée ne contient pas de champ link
- **THEN** aucun bouton documentation n'est affiché

### Requirement: Modal doit utiliser React Portal

Le modal DOIT utiliser React Portal pour render au top-level du DOM.

#### Scenario: Modal rendu hors hiérarchie parent
- **WHEN** modal s'ouvre
- **THEN** il est rendu via createPortal vers document.body
- **AND** évite les problèmes de z-index et overflow

### Requirement: Modal doit supporter dark mode via Infima

Le modal DOIT utiliser les variables CSS Docusaurus pour supporter le dark mode.

#### Scenario: Styling en mode clair
- **WHEN** Docusaurus est en mode clair
- **THEN** modal utilise --ifm-background-color clair

#### Scenario: Styling en mode sombre
- **WHEN** Docusaurus est en mode sombre
- **THEN** modal utilise --ifm-background-color sombre
- **AND** les couleurs s'adaptent automatiquement

### Requirement: Modal doit prévenir le scroll du body

Le modal DOIT bloquer le scroll du body quand il est ouvert.

#### Scenario: Body scroll désactivé quand modal ouvert
- **WHEN** modal s'ouvre
- **THEN** document.body.style.overflow est réglé à 'hidden'
- **AND** l'utilisateur ne peut pas scroller la page en arrière-plan

#### Scenario: Body scroll restauré quand modal fermé
- **WHEN** modal se ferme
- **THEN** document.body.style.overflow est restauré
- **AND** l'utilisateur peut à nouveau scroller

---

**Reference**: Voir `openspec/specs/modal-drawer/spec.md` pour la spécification complète incluant:
- Structure du composant Modal
- Animations CSS
- React Portal implementation
- Gestion des événements (Escape, click)
- Layout et styling Infima
- Accessibilité (ARIA)
