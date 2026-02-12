## ADDED Requirements

> **Note**: Ce delta spec référence la spec principale déjà définie dans `openspec/specs/data-management/spec.md`.
> 
> Toutes les requirements pour cette capability sont documentées dans le spec principal.

### Requirement: Système doit charger données depuis JSON ou YAML

Le système DOIT charger les données radar depuis des fichiers JSON ou YAML avec le format Zalando étendu.

#### Scenario: Chargement JSON réussi
- **WHEN** le plugin charge un fichier .json valide
- **THEN** les données sont parsées et validées
- **AND** retournées comme objet RadarData typé

#### Scenario: Chargement YAML réussi
- **WHEN** le plugin charge un fichier .yaml ou .yml valide
- **THEN** les données sont parsées et validées  
- **AND** retournées comme objet RadarData typé

### Requirement: Données doivent être validées avec schéma strict

Les données chargées DOIVENT être validées avec un schéma Joi garantissant la structure correcte.

#### Scenario: Validation réussie avec données complètes
- **WHEN** fichier contient quadrants (4), rings (1-4), entries avec tous champs requis
- **THEN** la validation passe
- **AND** les données sont disponibles pour les composants

#### Scenario: Validation échoue avec message détaillé
- **WHEN** fichier contient quadrants incomplets ou ring color invalide
- **THEN** le build échoue
- **AND** le message d'erreur liste exactement les champs invalides

### Requirement: Format doit supporter extensions pour Docusaurus

Le format des données DOIT supporter un champ `link` optionnel pour navigation vers documentation.

#### Scenario: Entry avec lien vers documentation
- **WHEN** entry contient `"link": "/docs/frontend/react"`
- **THEN** le composant affiche un bouton de navigation
- **AND** le clic redirige vers la page de documentation

#### Scenario: Entry sans lien reste valide
- **WHEN** entry ne contient pas de champ link
- **THEN** la validation passe
- **AND** aucun bouton de navigation n'est affiché

### Requirement: Chargement doit gérer erreurs clairement

Le système DOIT fournir des messages d'erreur clairs pour tous les cas d'échec.

#### Scenario: Fichier introuvable
- **WHEN** radarFile pointe vers un fichier inexistant
- **THEN** le build échoue avec message "File not found: <path>"

#### Scenario: JSON malformé
- **WHEN** fichier contient du JSON invalide
- **THEN** le build échoue avec numéro de ligne et erreur syntax

#### Scenario: Schema invalide
- **WHEN** fichier a structure incorrecte (ex: 3 quadrants au lieu de 4)
- **THEN** le build échoue avec liste des violations de schéma

### Requirement: Hook React doit exposer données avec état de chargement

Le hook `useRadarData` DOIT retourner les données, l'état de chargement, et les erreurs.

#### Scenario: Données chargées depuis plugin global data
- **WHEN** composant appelle `useRadarData()` sans source
- **THEN** retourne `{ data: RadarData, loading: false, error: null }`
- **AND** les données proviennent de setGlobalData du plugin

#### Scenario: Données chargées depuis source custom
- **WHEN** composant appelle `useRadarData('./custom.json')`
- **THEN** fetch et valide le fichier côté client
- **AND** retourne `{ data: RadarData, loading: true/false, error: Error }`

---

**Reference**: Voir `openspec/specs/data-management/spec.md` pour la spécification complète incluant:
- Format des données (RadarData, RadarEntry, etc.)
- Schema de validation Joi
- Types TypeScript
- Hook useRadarData
- Gestion d'erreurs détaillée
