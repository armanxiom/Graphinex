export const premiumEase = [0.22, 1, 0.36, 1] as const;

export const premiumRevealTransition = {
  duration: 0.9,
  ease: premiumEase,
} as const;

export const premiumCardTransition = {
  duration: 0.6,
  ease: premiumEase,
} as const;

export const premiumButtonTransition = {
  duration: 0.45,
  ease: premiumEase,
} as const;

export const premiumDrawerTransition = {
  duration: 0.52,
  ease: premiumEase,
} as const;

export const premiumMagneticTransition = {
  duration: 0.24,
  ease: premiumEase,
} as const;
