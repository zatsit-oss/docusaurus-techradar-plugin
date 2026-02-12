## 1. Types et Interfaces

- [ ] 1.1 Ajouter type ListFilters dans src/types.ts (search: string, rings: number[], quadrants: number[])
- [ ] 1.2 Ajouter type pour props ViewToggle (view, onChange)
- [ ] 1.3 Ajouter type pour props ListView (data, filters, onFiltersChange, onEntryClick)
- [ ] 1.4 Ajouter type pour props ListFilters (filters, onChange, rings, quadrants)

## 2. Hook useFilteredData

- [ ] 2.1 Créer hook useFilteredData dans src/theme/hooks/useFilteredData.ts
- [ ] 2.2 Implémenter filtrage par search (case-insensitive, includes)
- [ ] 2.3 Implémenter filtrage par rings (multi-select avec OR)
- [ ] 2.4 Implémenter filtrage par quadrants (multi-select avec OR)
- [ ] 2.5 Combiner filtres avec AND logique entre catégories
- [ ] 2.6 Utiliser useMemo pour optimiser performance
- [ ] 2.7 Retourner données filtrées et groupées par rings

## 3. Hook useDebounce (pour search)

- [ ] 3.1 Créer hook useDebounce dans src/theme/hooks/useDebounce.ts
- [ ] 3.2 Implémenter debounce avec délai configurable (default 300ms)
- [ ] 3.3 Cleanup timer lors du unmount

## 4. ViewToggle Component

- [ ] 4.1 Créer composant ViewToggle dans src/theme/TechRadar/ViewToggle.tsx
- [ ] 4.2 Définir interface ViewToggleProps (view, onChange)
- [ ] 4.3 Implémenter deux boutons : "Vue Radar" et "Vue Liste"
- [ ] 4.4 Utiliser classes Infima button et button-group
- [ ] 4.5 Ajouter classe "active" sur bouton correspondant à la vue courante
- [ ] 4.6 Ajouter aria-pressed pour accessibilité
- [ ] 4.7 Gérer onClick pour appeler onChange
- [ ] 4.8 Supporter navigation clavier (Tab, Enter, Space)

## 5. ListFilters Component

- [ ] 5.1 Créer composant ListFilters dans src/theme/TechRadar/ListFilters.tsx
- [ ] 5.2 Définir interface ListFiltersProps
- [ ] 5.3 Implémenter champ search avec input text
- [ ] 5.4 Utiliser useDebounce sur valeur search avant d'appeler onChange
- [ ] 5.5 Implémenter multi-select rings (checkboxes ou badges cliquables)
- [ ] 5.6 Implémenter multi-select quadrants (checkboxes ou badges cliquables)
- [ ] 5.7 Afficher count total de technologies filtrées
- [ ] 5.8 Utiliser classes Infima pour styling
- [ ] 5.9 Ajouter labels et ARIA attributes pour accessibilité

## 6. ListView Component

- [ ] 6.1 Créer composant ListView dans src/theme/TechRadar/ListView.tsx
- [ ] 6.2 Définir interface ListViewProps
- [ ] 6.3 Utiliser useFilteredData pour obtenir données filtrées
- [ ] 6.4 Grouper entries par rings avec map sur rings
- [ ] 6.5 Afficher header de section pour chaque ring (nom + count)
- [ ] 6.6 Trier entries alphabétiquement dans chaque ring (localeCompare)
- [ ] 6.7 Créer card pour chaque entry avec icône statut, label, quadrant
- [ ] 6.8 Afficher lien documentation si entry.link présent
- [ ] 6.9 Gérer onClick sur card pour appeler onEntryClick
- [ ] 6.10 Afficher message "Aucune technologie trouvée" si filteredData vide

## 7. Styling ListView

- [ ] 7.1 Créer styles pour ListView dans src/theme/TechRadar/styles.module.css
- [ ] 7.2 Utiliser classes Infima card pour entries
- [ ] 7.3 Styliser ring sections avec headers et spacing
- [ ] 7.4 Styliser icônes de statut avec couleurs (variables CSS)
- [ ] 7.5 Responsive : stack filtres verticalement sur mobile
- [ ] 7.6 Supporter dark mode via [data-theme='dark']
- [ ] 7.7 Hover effects sur cards et lien documentation

## 8. Intégration dans TechRadar Component

- [ ] 8.1 Modifier src/theme/TechRadar/index.tsx pour ajouter state currentView
- [ ] 8.2 Initialiser currentView depuis prop view ou config defaultView
- [ ] 8.3 Ajouter state listFilters initialisé à { search: '', rings: [], quadrants: [] }
- [ ] 8.4 Ajouter ViewToggle au-dessus des vues
- [ ] 8.5 Conditionner affichage : currentView === 'radar' ? <RadarView /> : <ListView />
- [ ] 8.6 Passer filters et onFiltersChange à ListView
- [ ] 8.7 Passer onEntryClick à ListView (même callback que RadarView)
- [ ] 8.8 Vérifier que Modal fonctionne avec les deux vues

## 9. Tests - ViewToggle

- [ ] 9.1 Tester rendu des deux boutons
- [ ] 9.2 Tester classe "active" sur bouton correspondant à view
- [ ] 9.3 Tester onClick appelle onChange avec nouvelle vue
- [ ] 9.4 Tester aria-pressed reflète l'état actif
- [ ] 9.5 Tester navigation clavier (Tab, Enter)

## 10. Tests - ListFilters

- [ ] 10.1 Tester affichage champ search, rings, quadrants
- [ ] 10.2 Tester onChange search appelle callback après debounce
- [ ] 10.3 Tester sélection rings met à jour filters.rings
- [ ] 10.4 Tester sélection quadrants met à jour filters.quadrants
- [ ] 10.5 Tester count affiché correspond aux résultats filtrés

## 11. Tests - ListView

- [ ] 11.1 Tester affichage groupé par rings
- [ ] 11.2 Tester tri alphabétique dans chaque ring
- [ ] 11.3 Tester filtrage par search (case-insensitive)
- [ ] 11.4 Tester filtrage par rings sélectionnés
- [ ] 11.5 Tester filtrage par quadrants sélectionnés
- [ ] 11.6 Tester combinaison de filtres (AND logique)
- [ ] 11.7 Tester affichage icônes statut (○, △, ▽, ★)
- [ ] 11.8 Tester clic sur entry appelle onEntryClick
- [ ] 11.9 Tester affichage lien docs si entry.link présent
- [ ] 11.10 Tester message "Aucune technologie trouvée" si aucun résultat
- [ ] 11.11 Tester count par ring reflète filtres

## 12. Tests - Integration TechRadar

- [ ] 12.1 Tester toggle bascule entre RadarView et ListView
- [ ] 12.2 Tester state currentView change au toggle
- [ ] 12.3 Tester une seule vue montée à la fois (pas les deux)
- [ ] 12.4 Tester filtres listFilters persistent lors du toggle
- [ ] 12.5 Tester Modal s'ouvre depuis ListView au clic
- [ ] 12.6 Tester Modal s'ouvre depuis RadarView au clic
- [ ] 12.7 Tester prop view initialise correctement currentView

## 13. Tests - Performance

- [ ] 13.1 Tester useFilteredData utilise useMemo (pas de recalcul inutile)
- [ ] 13.2 Tester debounce search évite re-renders à chaque caractère
- [ ] 13.3 Tester performance avec 100+ entries (render temps acceptable)

## 14. Accessibilité

- [ ] 14.1 Tester navigation clavier complète (Tab, Enter, Espace)
- [ ] 14.2 Tester screen reader annonce correctement filtres et résultats
- [ ] 14.3 Tester labels ARIA sur filtres
- [ ] 14.4 Tester structure sémantique (section, article, headings)
- [ ] 14.5 Tester ordre de tabulation logique

## 15. Documentation

- [ ] 15.1 Mettre à jour README.md pour documenter vue liste
- [ ] 15.2 Ajouter exemples d'usage avec toggle et filtres
- [ ] 15.3 Documenter prop view pour forcer une vue spécifique
- [ ] 15.4 Ajouter screenshots de la vue liste

## 16. Build et Validation

- [ ] 16.1 Tester build avec `bun run build`
- [ ] 16.2 Vérifier pas de warnings TypeScript
- [ ] 16.3 Tester dans site Docusaurus exemple
- [ ] 16.4 Valider dark mode fonctionne pour ListView
- [ ] 16.5 Valider responsive sur mobile pour filtres et liste
