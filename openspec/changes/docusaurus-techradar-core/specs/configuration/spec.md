## ADDED Requirements

> **Note**: Ce delta spec référence la spec principale déjà définie dans `openspec/specs/configuration/spec.md`.
> 
> Toutes les requirements pour cette capability sont documentées dans le spec principal.

### Requirement: Plugin doit accepter des options validées

Le plugin DOIT accepter et valider des options de configuration via Joi schema.

#### Scenario: Configuration valide acceptée
- **WHEN** utilisateur configure le plugin dans docusaurus.config.js avec radarFile valide
- **THEN** la configuration est validée et acceptée
- **AND** les valeurs par défaut sont appliquées pour les options manquantes

#### Scenario: Configuration invalide rejetée avec message clair
- **WHEN** utilisateur configure le plugin avec un radarFile absent ou width invalide
- **THEN** le build échoue avec un message d'erreur explicite
- **AND** le message indique exactement quelle option est invalide

### Requirement: Options doivent être surchargeables par props

Les options du plugin DOIVENT pouvoir être surchargées au niveau du composant via props.

#### Scenario: Props surchargent la config plugin
- **WHEN** utilisateur utilise `<TechRadar width={1000} />` alors que la config plugin définit width=1450
- **THEN** le composant utilise width=1000
- **AND** la config plugin reste inchangée pour les autres instances

### Requirement: Valeurs par défaut doivent être définies

Le plugin DOIT fournir des valeurs par défaut sensibles pour toutes les options sauf radarFile.

#### Scenario: Options manquantes utilisent les defaults
- **WHEN** utilisateur configure seulement radarFile
- **THEN** width=1450, height=1000, defaultView='radar' sont appliqués
- **AND** colors utilisent les variables Infima

### Requirement: Configuration doit supporter personnalisation visuelle

Le plugin DOIT permettre la personnalisation des couleurs, dimensions, et comportements.

#### Scenario: Personnalisation des couleurs
- **WHEN** utilisateur configure colors.background, colors.grid
- **THEN** le radar utilise ces couleurs personnalisées
- **AND** le dark mode continue de fonctionner

#### Scenario: Personnalisation des dimensions
- **WHEN** utilisateur configure width et height
- **THEN** le radar est rendu avec ces dimensions
- **AND** les dimensions sont entre 400 et 3000 pixels

---

**Reference**: Voir `openspec/specs/configuration/spec.md` pour la spécification complète incluant:
- Schema de validation Joi
- Options disponibles et types
- Valeurs par défaut
- Exemples d'usage
- Merge des configs (plugin + props)
