// Client-side module to load D3.js from CDN
// This is executed only in the browser, not during SSR

export default (function loadD3() {
  if (typeof window === 'undefined') {
    return; // SSR guard
  }

  // Check if D3 is already loaded
  if (window.d3) {
    return;
  }

  // Load D3.js v7 from CDN
  const script = document.createElement('script');
  script.src = 'https://d3js.org/d3.v7.min.js';
  script.async = true;
  script.crossOrigin = 'anonymous';

  document.head.appendChild(script);
})();
