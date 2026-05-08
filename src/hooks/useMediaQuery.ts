import { useEffect, useState } from 'react';

export function useMediaQuery(query: string, defaultValue = false) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };

    updateMatches();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMatches);
      return () => mediaQuery.removeEventListener('change', updateMatches);
    }

    mediaQuery.addListener(updateMatches);
    return () => mediaQuery.removeListener(updateMatches);
  }, [query]);

  return matches;
}

export function useIsMobileViewport() {
  return useMediaQuery('(max-width: 767px)');
}
