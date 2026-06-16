import { useState } from 'react';

export type PerformanceTier = 'low' | 'balanced' | 'high';

export type DevicePerformanceProfile = {
  tier: PerformanceTier;
  isMobile: boolean;
  isTouchDevice: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  saveData: boolean;
  shouldAnimateHeavy: boolean;
  shouldUsePremiumMotion: boolean;
  shouldUseScrollFX: boolean;
  shouldAutoplayMedia: boolean;
  shouldShowDecorativeBlur: boolean;
  shouldPrefetchAggressively: boolean;
};

function readConnection() {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const navigatorWithConnection = navigator as Navigator & {
    connection?: { effectiveType?: string; saveData?: boolean } | null;
    mozConnection?: { effectiveType?: string; saveData?: boolean } | null;
    webkitConnection?: { effectiveType?: string; saveData?: boolean } | null;
  };

  return navigatorWithConnection.connection ?? navigatorWithConnection.mozConnection ?? navigatorWithConnection.webkitConnection ?? null;
}

export function detectDevicePerformance(): DevicePerformanceProfile {
  if (typeof window === 'undefined') {
    return {
      tier: 'balanced',
      isMobile: false,
      isTouchDevice: false,
      isLowEnd: false,
      prefersReducedMotion: false,
      saveData: false,
      shouldAnimateHeavy: true,
      shouldUsePremiumMotion: true,
      shouldUseScrollFX: true,
      shouldAutoplayMedia: true,
      shouldShowDecorativeBlur: true,
      shouldPrefetchAggressively: true
    };
  }

  const connection = readConnection();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const saveData = Boolean(connection?.saveData);
  const effectiveType = connection?.effectiveType ?? '';
  const isSlowNetwork = /(^|[^a-z])(slow-2g|2g)([^a-z]|$)/i.test(effectiveType);
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const minViewport = Math.min(window.innerWidth, window.innerHeight);

  const lowEnd =
    prefersReducedMotion ||
    saveData ||
    isSlowNetwork ||
    hardwareConcurrency <= 4 ||
    deviceMemory <= 4 ||
    minViewport <= 440;

  const balanced =
    !lowEnd &&
    (hardwareConcurrency <= 6 || deviceMemory <= 6 || isMobile || isTouchDevice);

  const tier: PerformanceTier = lowEnd ? 'low' : balanced ? 'balanced' : 'high';

  return {
    tier,
    isMobile,
    isTouchDevice,
    isLowEnd: lowEnd,
    prefersReducedMotion,
    saveData,
    shouldAnimateHeavy: tier !== 'low',
    shouldUsePremiumMotion: tier === 'high' && !prefersReducedMotion,
    shouldUseScrollFX: tier === 'high',
    shouldAutoplayMedia: tier === 'high' && !saveData && !isSlowNetwork,
    shouldShowDecorativeBlur: tier === 'high' && !prefersReducedMotion,
    shouldPrefetchAggressively: tier !== 'low'
  };
}

export function useDevicePerformance(): DevicePerformanceProfile {
  const [profile] = useState<DevicePerformanceProfile>(() => detectDevicePerformance());

  return profile;
}
