import React, { useEffect, useRef } from 'react';
import type { RadarData } from '../../types';
import { useD3Loader } from '../hooks/useD3Loader';

interface RadarViewProps {
  data: RadarData;
  width?: number;
  height?: number;
  radarVersion?: string;
  onEntryClick?: (entry: { label: string; link?: string }) => void;
  colors?: {
    background?: string;
    grid?: string;
    inactive?: string;
  };
}

export function RadarView({
  data,
  width = 1450,
  height = 1000,
  radarVersion = '0.12',
  onEntryClick,
  colors,
}: RadarViewProps) {
  const svgRef = useRef<HTMLDivElement>(null);
  const { loaded, error } = useD3Loader(radarVersion);

  useEffect(() => {
    if (!loaded || !svgRef.current || !data) {
      return;
    }

    // Check if radar_visualization is available
    if (typeof window === 'undefined' || !window.radar_visualization) {
      console.error('radar_visualization not available');
      return;
    }

    // Clear any existing SVG
    svgRef.current.innerHTML = '';

    // Create unique ID for this radar instance
    const radarId = `radar-${Math.random().toString(36).substr(2, 9)}`;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = radarId;
    svgRef.current.appendChild(svg);

    try {
      // Call radar visualization from window
      (window.radar_visualization as any)({
        svg: radarId,
        width,
        height,
        colors: colors || {
          background: '#fff',
          grid: '#bbb',
          inactive: '#ddd',
        },
        entries: data.entries,
        quadrants: data.quadrants,
        rings: data.rings,
        title: data.title,
        print_layout: false,
        links_in_new_tabs: false,
        // Custom entry click handler
        entry_click: onEntryClick
          ? (entry: { label: string; link?: string }) => {
              onEntryClick(entry);
            }
          : undefined,
      });
    } catch (err) {
      console.error('Error rendering radar:', err);
    }

    return () => {
      // Cleanup
      if (svgRef.current) {
        svgRef.current.innerHTML = '';
      }
    };
  }, [loaded, data, width, height, onEntryClick, colors]);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#d32f2f' }}>
        <p>Failed to load dependencies: {error.message}</p>
        <p>Please check your internet connection and try again.</p>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading radar visualization...</p>
      </div>
    );
  }

  return <div ref={svgRef} />;
}
