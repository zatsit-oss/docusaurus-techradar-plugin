# Modal Drawer

## Overview

Modal/drawer qui s'ouvre au clic sur une technologie (depuis le radar ou la liste). Affiche les détails et permet la navigation vers la documentation. Animation slide depuis la droite.

## Requirements

### Behavior

**MUST** s'ouvrir au clic sur une technologie :
- Depuis le radar (via `onEntryClick`)
- Depuis la liste (via `onEntryClick`)

**MUST** se fermer :
- Clic sur la croix (×)
- Clic sur le backdrop (overlay)
- Touche Escape
- Navigation vers la doc (optionnel)

**MUST** afficher :
- Nom de la technologie (`label`)
- Ring avec couleur
- Quadrant
- Statut (`moved`) avec icône et label
- Lien vers documentation (si présent)

### Animation

**MUST** animer avec slide depuis la droite :
- Entrée : translate de 100% → 0%
- Sortie : translate de 0% → 100%
- Durée : 300ms
- Easing : ease-in-out

**MUST** animer le backdrop :
- Fade in/out
- Opacity 0 → 0.5 (entrée), 0.5 → 0 (sortie)

### Layout

```
┌────────────────────────────────────────────────┐
│                                                │
│  Main content (backdrop overlay)              │
│                                                │
│    ┌────────────────────────────────────────┐ │
│    │  ✕                                     │ │ ◄─ Drawer
│    │                                        │ │   (320px width)
│    │  React                                 │ │
│    │  ━━━━━                                 │ │
│    │                                        │ │
│    │  🟢 ADOPT                              │ │
│    │  Languages & Frameworks                │ │
│    │  ○ Stable                              │ │
│    │                                        │ │
│    │  ──────────────────────────            │ │
│    │                                        │ │
│    │  [📖 Voir la documentation complète]  │ │
│    │                                        │ │
│    │                                        │ │
│    └────────────────────────────────────────┘ │
│                                                │
└────────────────────────────────────────────────┘
```

### UI Framework

**MUST** utiliser Infima (CSS Docusaurus) :
- Pas de bibliothèque externe (react-modal, etc.)
- Implementation custom avec React Portal
- Classes CSS modules

**MUST** supporter dark mode :
- Variables CSS Docusaurus
- Tester en mode clair et sombre

## Component Structure

```tsx
interface ModalProps {
  entry: RadarEntry | null;
  rings: RadarRing[];
  quadrants: RadarQuadrant[];
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  entry,
  rings,
  quadrants,
  onClose
}) => {
  const isOpen = entry !== null;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!entry) return null;

  return createPortal(
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div 
        className={styles.modalDrawer} 
        onClick={(e) => e.stopPropagation()}
      >
        <ModalContent 
          entry={entry}
          ring={rings[entry.ring]}
          quadrant={quadrants[entry.quadrant]}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body
  );
};
```

## CSS Implementation

```css
/* styles.module.css */

.modalBackdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  
  animation: fadeIn 300ms ease-in-out;
}

.modalDrawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: var(--ifm-background-color);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  
  animation: slideIn 300ms ease-in-out;
  
  overflow-y: auto;
  padding: var(--ifm-spacing-vertical) var(--ifm-spacing-horizontal);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Dark mode support */
[data-theme='dark'] .modalDrawer {
  border-left: 1px solid var(--ifm-color-emphasis-200);
}
```

## Content Layout

```tsx
const ModalContent: React.FC<{
  entry: RadarEntry;
  ring: RadarRing;
  quadrant: RadarQuadrant;
  onClose: () => void;
}> = ({ entry, ring, quadrant, onClose }) => {
  const statusInfo = STATUS_ICONS[entry.moved];
  
  return (
    <div className={styles.modalContent}>
      {/* Header */}
      <div className={styles.modalHeader}>
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      {/* Title */}
      <h2 className={styles.modalTitle}>{entry.label}</h2>

      {/* Metadata */}
      <div className={styles.metadata}>
        <div className={styles.metaItem}>
          <span 
            className={styles.ringBadge}
            style={{ 
              backgroundColor: ring.color,
              color: getContrastColor(ring.color)
            }}
          >
            {ring.name}
          </span>
        </div>
        
        <div className={styles.metaItem}>
          <strong>Quadrant:</strong> {quadrant.name}
        </div>
        
        <div className={styles.metaItem}>
          <strong>Statut:</strong>{' '}
          <span style={{ color: statusInfo.color }}>
            {statusInfo.icon} {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Documentation link */}
      {entry.link && (
        <div className={styles.actions}>
          <a 
            href={entry.link}
            className="button button--primary button--block"
          >
            📖 Voir la documentation complète
          </a>
        </div>
      )}
    </div>
  );
};
```

## React Portal

**MUST** utiliser React Portal pour render au top-level :

```tsx
import { createPortal } from 'react-dom';

// Dans le composant
return createPortal(
  <div>...</div>,
  document.body
);
```

**Pourquoi ?**
- Évite les problèmes de z-index
- Évite les conflits de overflow:hidden
- Meilleure gestion du focus

## Accessibility

**MUST** :
- Focus trap : focus reste dans le modal quand ouvert
- Focus sur la croix à l'ouverture
- Escape pour fermer
- ARIA attributes : `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Annoncer l'ouverture aux screen readers

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  className={styles.modalDrawer}
>
  <h2 id="modal-title">{entry.label}</h2>
  {/* ... */}
</div>
```

**SHOULD** :
- Restore focus sur l'élément qui a ouvert le modal après fermeture
- Utiliser un hook custom `useFocusTrap` ou library légère

## Responsive

**MUST** adapter sur mobile :
- Full width sur petits écrans (< 768px)
- Slide from bottom sur très petits écrans (< 480px) ?

Pour MVP :
- Slide depuis la droite sur tous écrans
- Max-width 400px, 100% sur mobile

## Performance

**SHOULD** :
- Lazy render : ne render que si `entry !== null`
- Cleanup event listeners dans useEffect
- Éviter re-renders inutiles (memo si nécessaire)

## Testing

**MUST** tester :
- Ouverture avec entrée
- Fermeture via bouton close
- Fermeture via backdrop click
- Fermeture via Escape
- Affichage correct des métadonnées
- Lien documentation présent si `entry.link`
- Lien documentation absent si pas de `link`
- Animation (snapshot après animation)

**SHOULD** tester :
- Focus trap
- ARIA attributes
- Dark mode

## Edge Cases

**MUST** gérer :
- Entry sans link → bouton masqué
- Ring color invalide → fallback color
- Très long label → ellipsis ou wrap
- Multiples modals (ne devrait pas arriver) → afficher le dernier

## Animation Details

**MUST** distinguer enter/exit :
```css
/* Enter */
.modalEnter {
  animation: slideIn 300ms ease-in-out;
}

/* Exit */
.modalExit {
  animation: slideOut 300ms ease-in-out;
}

@keyframes slideOut {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}
```

**Option** : Utiliser state machine ou `react-transition-group` pour gérer animations
**MVP** : Simple classes CSS avec conditional rendering

## Non-Goals

- Pas de descriptions longues dans MVP (seulement métadonnées + lien)
- Pas de historique des changements (moved in/out depuis quand)
- Pas de related technologies
- Pas de commentaires ou votes
- Pas de slide from bottom sur mobile (MVP)

## Related Specs

- [Radar Visualization](../radar-visualization/spec.md) - Trigger depuis radar
- [List View](../list-view/spec.md) - Trigger depuis liste
- [Data Management](../data-management/spec.md) - Structure de entry
