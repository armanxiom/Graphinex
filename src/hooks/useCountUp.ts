import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(active: boolean, target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [active, duration, target]);

  return value;
}
