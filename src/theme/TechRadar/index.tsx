import React, { useState } from 'react';
import type { TechRadarProps, RadarEntry } from '../../types';
import { useRadarData } from '../hooks/useRadarData';
import { RadarView } from './RadarView';
import { Modal } from './Modal';
import styles from './styles.module.css';

export default function TechRadar({
  source,
  width,
  height,
  colors,
}: TechRadarProps) {
  const { data, loading, error } = useRadarData(source);
  const [selectedEntry, setSelectedEntry] = useState<RadarEntry | null>(null);

  const handleEntryClick = (entry: { label: string; link?: string }) => {
    // Find the full entry data
    const fullEntry = data?.entries.find((e) => e.label === entry.label);
    if (fullEntry) {
      setSelectedEntry(fullEntry);
    }
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
  };

  if (loading) {
    return (
      <div className={styles.techRadarLoader}>
        <p>Loading Tech Radar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.techRadarError}>
        <p>Error loading Tech Radar:</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.techRadarError}>
        <p>No radar data available</p>
      </div>
    );
  }

  return (
    <div className={styles.techRadarContainer}>
      <RadarView
        data={data}
        width={width}
        height={height}
        colors={colors}
        onEntryClick={handleEntryClick}
      />

      <Modal
        entry={selectedEntry}
        onClose={handleCloseModal}
        quadrants={data.quadrants}
        rings={data.rings}
      />
    </div>
  );
}
