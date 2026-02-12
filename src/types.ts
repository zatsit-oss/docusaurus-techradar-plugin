// TypeScript types for the Tech Radar plugin

export interface RadarQuadrant {
  name: string;
}

export interface RadarRing {
  name: string;
  color: string;
}

export interface RadarEntry {
  label: string;
  quadrant: number; // 0-3
  ring: number; // 0-N (index in rings array)
  moved: -1 | 0 | 1 | 2; // -1=out, 0=stable, 1=in, 2=new
  link?: string; // URL to documentation
}

export interface RadarData {
  title?: string;
  quadrants: [RadarQuadrant, RadarQuadrant, RadarQuadrant, RadarQuadrant];
  rings: RadarRing[];
  entries: RadarEntry[];
}

export interface RadarDataState {
  data: RadarData | null;
  loading: boolean;
  error: Error | null;
}

export interface PluginOptions {
  radarFile: string;
  width?: number;
  height?: number;
  radarVersion?: string;
  colors?: {
    background?: string;
    grid?: string;
    inactive?: string;
  };
}

export interface TechRadarProps {
  source?: string;
  width?: number;
  height?: number;
  colors?: {
    background?: string;
    grid?: string;
    inactive?: string;
  };
}

export interface PluginContent {
  radarData: RadarData;
  radarVersion: string;
}
