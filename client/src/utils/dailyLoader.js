/**
 * Daily.co SDK Dynamic Loader
 * Lazy-loads the locally bundled @daily-co/daily-js package on demand (code-split by Vite)
 * so classroom media loads reliably from our own origin with zero external CDN timeouts.
 */

let dailyPromise = null;

export const loadDaily = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Daily SDK requires a browser environment'));
  }

  if (dailyPromise) {
    return dailyPromise;
  }

  dailyPromise = import('@daily-co/daily-js')
    .then((mod) => {
      const DailyIframe = mod?.default || mod;
      if (!DailyIframe || typeof DailyIframe.createCallObject !== 'function') {
        throw new Error('DailyIframe.createCallObject is unavailable');
      }
      return DailyIframe;
    })
    .catch((err) => {
      dailyPromise = null;
      console.warn('[DailyLoader] Failed to load bundled Daily.co SDK:', err);
      throw err;
    });

  return dailyPromise;
};
