/**
 * Daily.co SDK Dynamic Loader
 * Dynamically loads the official Daily.co WebRTC client library on demand
 * ensuring zero impact on initial page load bundle.
 */

let dailyPromise = null;

export const loadDaily = () => {
  // If already loaded on window
  if (typeof window !== 'undefined' && window.DailyIframe) {
    return Promise.resolve(window.DailyIframe);
  }

  if (dailyPromise) {
    return dailyPromise;
  }

  dailyPromise = new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      return reject(new Error('Daily SDK requires a browser environment'));
    }

    const existingScript = document.querySelector('script[src*="@daily-co/daily-js"]');
    if (existingScript) {
      if (window.DailyIframe) {
        resolve(window.DailyIframe);
      } else {
        existingScript.addEventListener('load', () => resolve(window.DailyIframe));
        existingScript.addEventListener('error', () => {
          dailyPromise = null;
          reject(new Error('Failed to load Daily.co SDK script'));
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@daily-co/daily-js@0.67.0/dist/daily-iframe.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      if (window.DailyIframe) {
        resolve(window.DailyIframe);
      } else {
        dailyPromise = null;
        reject(new Error('DailyIframe not found after script load'));
      }
    };

    script.onerror = (err) => {
      dailyPromise = null;
      console.warn('[DailyLoader] Daily.co SDK script failed to load from CDN', err);
      reject(new Error('Network error loading Daily.co video SDK'));
    };

    document.head.appendChild(script);
  });

  return dailyPromise;
};
