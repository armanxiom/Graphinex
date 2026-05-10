import { lazy, Suspense, useMemo, type ComponentType, type ReactNode } from 'react';
import { useRevealOnView } from '../hooks/useRevealOnView';
import { useDevicePerformance } from '../lib/performance';

export type DeferredSectionProps = {
  id: string;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  preload?: boolean;
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback: ReactNode;
};

export function DeferredSection({
  id,
  className = '',
  rootMargin,
  threshold = 0.08,
  preload = false,
  loader,
  fallback
}: DeferredSectionProps) {
  const profile = useDevicePerformance();
  const { ref, isVisible } = useRevealOnView<HTMLElement>({
    rootMargin:
      rootMargin ??
      (profile.isLowEnd
        ? '1500px 0px'
        : profile.isMobile
          ? '1100px 0px'
          : '800px 0px'),
    threshold
  });

  const LazySection = useMemo(() => lazy(loader), [loader]);
  const shouldMount = preload || isVisible;

  if (!shouldMount) {
    return (
      <section
        ref={ref}
        id={id}
        className={className}
        aria-busy="true"
        aria-live="polite"
      >
        {fallback}
      </section>
    );
  }

  return (
    <Suspense fallback={
      <section
        ref={ref}
        id={id}
        className={className}
        aria-busy="true"
        aria-live="polite"
      >
        {fallback}
      </section>
    }>
      <LazySection />
    </Suspense>
  );
}
