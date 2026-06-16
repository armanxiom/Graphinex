import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(active: boolean, target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);
  const lastValueRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    lastValueRef.current = 0;
    setValue(0);

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const nextValue = Math.round(target * eased);

      if (nextValue !== lastValueRef.current) {
        lastValueRef.current = nextValue;
        setValue(nextValue);
      }

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick);
      } else {
        lastValueRef.current = target;
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
