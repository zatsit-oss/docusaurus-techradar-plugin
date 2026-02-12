import { useState, useEffect } from 'react';
import type { RadarData, RadarDataState } from '../../types';
import { usePluginData } from './usePluginData';

export function useRadarData(source?: string): RadarDataState {
  const pluginData = usePluginData();
  const [state, setState] = useState<RadarDataState>({
    data: source ? null : pluginData.radarData,
    loading: !!source,
    error: null,
  });

  useEffect(() => {
    if (!source) {
      // Use plugin data
      setState({
        data: pluginData.radarData,
        loading: false,
        error: null,
      });
      return;
    }

    // Load custom source
    let cancelled = false;

    async function loadCustomSource() {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(source);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          // Basic validation
          if (!data.quadrants || !data.rings || !data.entries) {
            throw new Error('Invalid radar data format');
          }

          setState({ data: data as RadarData, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error:
              error instanceof Error
                ? error
                : new Error('Failed to load radar data'),
          });
        }
      }
    }

    loadCustomSource();

    return () => {
      cancelled = true;
    };
  }, [source, pluginData]);

  return state;
}
