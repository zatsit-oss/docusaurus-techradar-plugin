import { useState, useEffect } from 'react';

declare global {
  interface Window {
    d3?: unknown;
  }
}

export function useD3Loader(): { loaded: boolean; error: Error | null } {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') {
      return;
    }

    // Check if D3 is already loaded
    if (window.d3) {
      setLoaded(true);
      return;
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector(
      'script[src="https://d3js.org/d3.v7.min.js"]'
    );

    if (existingScript) {
      // Wait for it to load
      existingScript.addEventListener('load', () => setLoaded(true));
      existingScript.addEventListener('error', () =>
        setError(new Error('Failed to load D3.js from CDN'))
      );
      return;
    }

    // D3.js should be loaded via getClientModules, but we can wait for it
    const checkInterval = setInterval(() => {
      if (window.d3) {
        setLoaded(true);
        clearInterval(checkInterval);
      }
    }, 100);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (!window.d3) {
        setError(new Error('D3.js loading timeout'));
      }
    }, 10000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  return { loaded, error };
}
