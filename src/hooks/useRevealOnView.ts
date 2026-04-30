import { useEffect, useRef, useState } from 'react';

export function useRevealOnView<T extends HTMLElement = HTMLElement>(options: IntersectionObserverInit = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
        ...options
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible]);

  return { ref, isVisible };
}
