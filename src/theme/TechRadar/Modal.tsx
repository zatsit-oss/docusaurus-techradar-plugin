import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { RadarEntry } from '../../types';
import styles from './styles.module.css';

interface ModalProps {
  entry: RadarEntry | null;
  onClose: () => void;
  quadrants: Array<{ name: string }>;
  rings: Array<{ name: string }>;
}

export function Modal({ entry, onClose, quadrants, rings }: ModalProps) {
  useEffect(() => {
    if (!entry) return;

    // Block body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [entry, onClose]);

  if (!entry) return null;

  const quadrantName = quadrants[entry.quadrant]?.name || 'Unknown';
  const ringName = rings[entry.ring]?.name || 'Unknown';
  const movedText = {
    '-1': 'Moved out',
    '0': 'No change',
    '1': 'Moved in',
    '2': 'New',
  }[entry.moved.toString()] || 'Unknown';

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <h2 id="modal-title" className={styles.drawerTitle}>
            {entry.label}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.drawerContent}>
          <div className={styles.metadataGrid}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Quadrant:</span>
              <span className={styles.metadataValue}>{quadrantName}</span>
            </div>

            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Ring:</span>
              <span className={styles.metadataValue}>{ringName}</span>
            </div>

            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Status:</span>
              <span className={styles.metadataValue}>{movedText}</span>
            </div>
          </div>

          {entry.link && (
            <div className={styles.linkSection}>
              <a
                href={entry.link}
                className={styles.docLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Documentation →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
