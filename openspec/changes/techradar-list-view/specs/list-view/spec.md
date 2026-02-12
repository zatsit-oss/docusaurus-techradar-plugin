## MODIFIED Requirements

> **Note**: Ce delta spec modifie la spec existante `openspec/specs/list-view/spec.md` en ajoutant des requirements d'implémentation spécifiques.

### Requirement: ListView doit afficher les technologies groupées par rings

Le composant ListView DOIT organiser les entrées en sections correspondant aux rings, dans l'ordre défini dans les données.

#### Scenario: Affichage groupé par rings
- **WHEN** ListView reçoit des données valides
- **THEN** affiche une section pour chaque ring
- **AND** chaque section a un header avec nom du ring et count
- **AND** sections suivent l'ordre des rings dans les données

#### Scenario: Entrées triées alphabétiquement dans chaque ring
- **WHEN** section ring contient plusieurs entrées
- **THEN** entrées sont triées par label (ordre alphabétique)
- **AND** tri est case-insensitive

### Requirement: Composant doit supporter le filtrage par recherche textuelle

ListView DOIT filtrer les entrées selon le texte de recherche saisi.

#### Scenario: Recherche dans les labels
- **WHEN** utilisateur saisit "react" dans le champ search
- **THEN** seules les entrées contenant "react" dans le label sont affichées
- **AND** recherche est case-insensitive
- **AND** count dans headers reflète les résultats filtrés

#### Scenario: Recherche vide affiche tout
- **WHEN** champ search est vide
- **THEN** toutes les entrées sont affichées

### Requirement: Composant doit supporter le filtrage par rings

ListView DOIT filtrer les entrées selon les rings sélectionnés.

#### Scenario: Filtrage par rings sélectionnés
- **WHEN** utilisateur sélectionne ADOPT et TRIAL
- **THEN** seules les entrées dans ces rings sont affichées
- **AND** sections des autres rings n'apparaissent pas

#### Scenario: Aucun ring sélectionné affiche tout
- **WHEN** aucun ring n'est sélectionné
- **THEN** toutes les entrées sont affichées

### Requirement: Composant doit supporter le filtrage par quadrants

ListView DOIT filtrer les entrées selon les quadrants sélectionnés.

#### Scenario: Filtrage par quadrants sélectionnés
- **WHEN** utilisateur sélectionne "Languages & Frameworks" et "Tools"
- **THEN** seules les entrées dans ces quadrants sont affichées

#### Scenario: Aucun quadrant sélectionné affiche tout
- **WHEN** aucun quadrant n'est sélectionné
- **THEN** toutes les entrées sont affichées

### Requirement: Filtres doivent se combiner avec AND logique entre catégories

Les filtres de différentes catégories (search, rings, quadrants) DOIVENT être combinés avec AND logique.

#### Scenario: Filtres combinés
- **WHEN** search="react", rings=[0] (ADOPT), quadrants=[0] (Lang & Frameworks)
- **THEN** seules les entrées matchant TOUS les critères sont affichées
- **AND** entry doit contenir "react" ET être dans ring 0 ET dans quadrant 0

### Requirement: Affichage doit utiliser icônes de statut

ListView DOIT afficher les icônes de statut (moved) pour chaque entrée.

#### Scenario: Icône de statut affiché
- **WHEN** entry a moved=0 (stable)
- **THEN** affiche icône ○
- **WHEN** entry a moved=1 (moved in)
- **THEN** affiche icône △
- **WHEN** entry a moved=-1 (moved out)
- **THEN** affiche icône ▽
- **WHEN** entry a moved=2 (new)
- **THEN** affiche icône ★

#### Scenario: Icônes colorées selon statut
- **WHEN** icône est affichée
- **THEN** utilise couleur CSS correspondant au statut
- **AND** couleurs proviennent de variables Infima

### Requirement: Clic sur entry doit appeler callback onEntryClick

ListView DOIT appeler le callback onEntryClick quand utilisateur clique sur une entrée.

#### Scenario: Clic ouvre modal via callback
- **WHEN** utilisateur clique sur une card d'entry
- **THEN** onEntryClick est appelé avec les données de l'entry
- **AND** permet au parent (TechRadar) d'ouvrir le modal

### Requirement: Lien documentation doit être affiché si présent

ListView DOIT afficher un lien vers la documentation si entry.link est présent.

#### Scenario: Lien affiché et cliquable
- **WHEN** entry contient link="/docs/react"
- **THEN** affiche bouton ou lien "Documentation →"
- **AND** clic navigue vers /docs/react

#### Scenario: Pas de lien si field absent
- **WHEN** entry ne contient pas de field link
- **THEN** aucun lien documentation n'est affiché

### Requirement: Affichage doit indiquer nombre de résultats

ListView DOIT afficher le count total de technologies et le count par ring.

#### Scenario: Count total affiché
- **WHEN** filtres sont appliqués
- **THEN** affiche "X technologies" avec X = nombre total de résultats filtrés

#### Scenario: Count par ring affiché
- **WHEN** section ring est affichée
- **THEN** header affiche "{RING_NAME} (X)" avec X = count dans ce ring

### Requirement: Message si aucun résultat

ListView DOIT afficher un message clair si les filtres ne retournent aucun résultat.

#### Scenario: Aucun résultat trouvé
- **WHEN** filtres appliqués ne matchent aucune entry
- **THEN** affiche message "Aucune technologie trouvée"
- **AND** suggère de modifier les filtres

### Requirement: Styling doit utiliser Infima et supporter dark mode

ListView DOIT utiliser classes Infima pour cards, badges, et layout.

#### Scenario: Cards stylées avec Infima
- **WHEN** entries sont affichées
- **THEN** utilisent classe card d'Infima
- **AND** hover effect natif Infima

#### Scenario: Dark mode supporté
- **WHEN** Docusaurus est en dark mode
- **THEN** ListView utilise variables CSS dark mode
- **AND** couleurs s'adaptent automatiquement

### Requirement: Composant doit être accessible

ListView DOIT utiliser éléments sémantiques et ARIA attributes.

#### Scenario: Navigation clavier complète
- **WHEN** utilisateur navigue au clavier
- **THEN** tous les éléments interactifs sont focusables
- **AND** ordre de tabulation est logique

#### Scenario: Screen reader friendly
- **WHEN** screen reader lit la page
- **THEN** structure sémantique (section, article, headings) est correcte
- **AND** filtres ont labels appropriés

### Requirement: Performance avec useMemo pour filtrage

ListView DOIT utiliser useMemo pour éviter recalculs inutiles lors du filtrage.

#### Scenario: Filtrage optimisé
- **WHEN** filtres changent
- **THEN** données sont filtrées
- **AND** résultat est mémorisé
- **WHEN** autre prop change (non lié aux filtres)
- **THEN** filtrage n'est pas recalculé

### Requirement: Debounce sur recherche textuelle

Le champ search DOIT être debouncé pour éviter trop de re-renders pendant la saisie.

#### Scenario: Debounce pendant typing
- **WHEN** utilisateur tape dans le champ search
- **THEN** filtrage n'est appliqué qu'après 300ms sans nouvelle saisie
- **AND** évite re-render à chaque caractère
