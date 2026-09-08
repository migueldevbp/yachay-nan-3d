import type { AccessibilityPreferences } from '@/modules/accessibility/types';

const QUERY_REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const QUERY_MORE_CONTRAST = '(prefers-contrast: more)';
const QUERY_DARK = '(prefers-color-scheme: dark)';

function matchesQuery(query: string): boolean {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }
  return window.matchMedia(query).matches;
}

/**
 * Valores iniciales inteligentes: respetan el sistema operativo
 * y nunca activan voz hasta que la persona lo pida.
 */
export function getInitialPreferences(): AccessibilityPreferences {
  const prefersHighContrast = matchesQuery(QUERY_MORE_CONTRAST);
  const prefersDark = matchesQuery(QUERY_DARK);
  const prefersReducedMotion = matchesQuery(QUERY_REDUCED_MOTION);

  return {
    theme: prefersHighContrast
      ? 'high-contrast'
      : prefersDark
        ? 'dark'
        : 'light',
    textScale: 100,
    motion: prefersReducedMotion ? 'reduced' : 'full',
    sound: true,
    speech: false,
    speechRate: 1.0,
    captions: true,
    signLanguage: false,
    braille: true,
    density: 'standard',
    instructionLength: 'full',
    optionsPerActivity: 3,
    confirmNavigation: false,
    language: 'es',
  };
}

/**
 * Ajustes que el Modo Tranquilo aplica de golpe.
 * El resto se conserva en un snapshot para poder revertir.
 */
export const QUIET_MODE_PATCH: Pick<
  AccessibilityPreferences,
  | 'motion'
  | 'sound'
  | 'density'
  | 'instructionLength'
  | 'optionsPerActivity'
  | 'confirmNavigation'
> = {
  motion: 'none',
  sound: false,
  density: 'calm',
  instructionLength: 'short',
  optionsPerActivity: 2,
  confirmNavigation: true,
};

export function applyQuietMode(
  current: AccessibilityPreferences,
): AccessibilityPreferences {
  return { ...current, ...QUIET_MODE_PATCH };
}

export const MEDIA_QUERIES = {
  reducedMotion: QUERY_REDUCED_MOTION,
  moreContrast: QUERY_MORE_CONTRAST,
  dark: QUERY_DARK,
} as const;
