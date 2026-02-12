import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import type { RadarData, PluginOptions } from '../../types';

interface TechRadarPluginData {
  radarData: RadarData;
  options: PluginOptions;
}

// Mock data for SSR/build time
const mockData: TechRadarPluginData = {
  radarData: {
    quadrants: [
      { name: 'Q1' },
      { name: 'Q2' },
      { name: 'Q3' },
      { name: 'Q4' },
    ],
    rings: [{ name: 'Ring 1', color: '#000000' }],
    entries: [],
  },
  options: {
    radarFile: '',
    width: 1450,
    height: 1000,
    radarVersion: '0.12',
  },
};

export function usePluginData(): TechRadarPluginData {
  // SSR guard - return mock data during build
  if (!ExecutionEnvironment.canUseDOM) {
    return mockData;
  }

  // At runtime, try to get data from global data
  try {
    if (typeof window !== 'undefined' && (window as any).docusaurus) {
      const globalData = (window as any).docusaurus.globalData;
      const pluginData = globalData?.['docusaurus-techradar-plugin']?.default;

      if (pluginData && pluginData.radarData) {
        return pluginData as TechRadarPluginData;
      }
    }
  } catch (error) {
    console.error('Error accessing plugin data:', error);
  }

  // Fallback to mock data
  return mockData;
}
