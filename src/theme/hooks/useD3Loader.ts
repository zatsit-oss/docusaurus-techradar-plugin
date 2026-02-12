import { useState, useEffect } from 'react';

declare global {
  interface Window {
    d3?: unknown;
    radar_visualization?: unknown;
  }
}

export function useD3Loader(radarVersion: string = '0.12'): { loaded: boolean; error: Error | null } {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') {
      return;
    }

    // Check if both D3 and radar_visualization are already loaded
    if (window.d3 && window.radar_visualization) {
      setLoaded(true);
      return;
    }

    let d3Loaded = !!window.d3;
    let radarLoaded = !!window.radar_visualization;

    const checkAllLoaded = () => {
      if (d3Loaded && radarLoaded) {
        setLoaded(true);
      }
    };

    const radarScriptUrl = `https://zalando.github.io/tech-radar/release/radar-${radarVersion}.js`;

    // Load D3.js if not already present
    if (!d3Loaded) {
      const d3Script = document.querySelector(
        'script[src="https://d3js.org/d3.v7.min.js"]'
      ) as HTMLScriptElement | null;

      if (d3Script) {
        if (window.d3) {
          d3Loaded = true;
          checkAllLoaded();
        } else {
          d3Script.addEventListener('load', () => {
            d3Loaded = true;
            checkAllLoaded();
          });
          d3Script.addEventListener('error', () =>
            setError(new Error('Failed to load D3.js from CDN'))
          );
        }
      } else {
        // Create and load D3 script
        const script = document.createElement('script');
        script.src = 'https://d3js.org/d3.v7.min.js';
        script.async = true;
        // Removed crossOrigin to avoid CORS issues with script tags
        script.onload = () => {
          d3Loaded = true;
          checkAllLoaded();
        };
        script.onerror = () =>
          setError(new Error('Failed to load D3.js from CDN'));
        document.head.appendChild(script);
      }
    }

    // Load Zalando radar.js if not already present
    if (!radarLoaded) {
      const radarScript = document.querySelector(
        `script[src="${radarScriptUrl}"]`
      ) as HTMLScriptElement | null;

      if (radarScript) {
        if (window.radar_visualization) {
          radarLoaded = true;
          checkAllLoaded();
        } else {
          radarScript.addEventListener('load', () => {
            radarLoaded = true;
            checkAllLoaded();
          });
          radarScript.addEventListener('error', () =>
            setError(new Error('Failed to load Zalando radar.js from CDN'))
          );
        }
      } else {
        // Create and load Zalando radar script
        const script = document.createElement('script');
        script.src = radarScriptUrl;
        script.async = true;
        // Removed crossOrigin to avoid CORS issues with script tags
        script.onload = () => {
          radarLoaded = true;
          checkAllLoaded();
        };
        script.onerror = () =>
          setError(new Error('Failed to load Zalando radar.js from CDN'));
        document.head.appendChild(script);
      }
    }

    if (d3Loaded && radarLoaded) {
      checkAllLoaded();
    }

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      if (!d3Loaded || !radarLoaded) {
        setError(
          new Error(
            `Loading timeout: ${!d3Loaded ? 'D3.js' : ''} ${!radarLoaded ? 'radar.js' : ''}`
          )
        );
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, [radarVersion]);

  return { loaded, error };
}
