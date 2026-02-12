## ADDED Requirements

### Requirement: Toggle doit permettre de basculer entre radar et liste

Le composant ViewToggle DOIT permettre à l'utilisateur de basculer entre la vue radar et la vue liste.

#### Scenario: Basculement de radar vers liste
- **WHEN** utilisateur clique sur le bouton "Vue Liste" alors que vue radar est active
- **THEN** la vue change vers liste
- **AND** le bouton "Vue Liste" est marqué comme actif
- **AND** RadarView est démonté, ListView est monté

#### Scenario: Basculement de liste vers radar
- **WHEN** utilisateur clique sur le bouton "Vue Radar" alors que vue liste est active
- **THEN** la vue change vers radar
- **AND** le bouton "Vue Radar" est marqué comme actif
- **AND** ListView est démonté, RadarView est monté

#### Scenario: Toggle accessible au clavier  
- **WHEN** utilisateur navigue au clavier (Tab)
- **THEN** les boutons toggle reçoivent le focus
- **AND** Entrée ou Espace bascule la vue

### Requirement: Toggle doit indiquer visuellement la vue active

Le toggle DOIT utiliser des états visuels clairs (actif/inactif) via classes CSS.

#### Scenario: Bouton actif stylé différemment
- **WHEN** vue radar est active
- **THEN** bouton "Vue Radar" a classe "active"
- **AND** utilise styling Infima pour état actif (background, border)

#### Scenario: ARIA attributes pour accessibilité
- **WHEN** toggle est rendu
- **THEN** boutons ont aria-pressed correspondant à l'état actif
- **AND** screen readers annoncent correctement l'état

### Requirement: Toggle doit utiliser Infima button-group

Le toggle DOIT utiliser les classes Infima `button-group` pour styling cohérent.

#### Scenario: Styling cohérent avec Docusaurus
- **WHEN** toggle est affiché
- **THEN** utilise classes button et button-group d'Infima
- **AND** le dark mode fonctionne automatiquement via variables CSS
