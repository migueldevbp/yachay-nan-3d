import type {
  AccessibilityPreferences,
  AccessibilityState,
} from '@/modules/accessibility/types';
import { getInitialPreferences } from '@/modules/accessibility/presets';

/**
 * Adaptador de persistencia de preferencias.
 * La UI no importa localStorage: solo el módulo de accesibilidad.
 */
export const STORAGE_KEY = 'yachay-nan-3d:accessibility';
const STORAGE_VERSION = 1;

interface StoredPayload {
  version: number;
  preferences: AccessibilityPreferences;
  quietMode: {
    active: boolean;
    snapshot: AccessibilityPreferences | null;
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isTheme(value: unknown): value is AccessibilityPreferences['theme'] {
  return value === 'light' || value === 'dark' || value === 'high-contrast';
}

function isTextScale(
  value: unknown,
): value is AccessibilityPreferences['textScale'] {
  return value === 100 || value === 125 || value === 150 || value === 200;
}

function isMotion(value: unknown): value is AccessibilityPreferences['motion'] {
  return value === 'full' || value === 'reduced' || value === 'none';
}

function isSpeechRate(
  value: unknown,
): value is AccessibilityPreferences['speechRate'] {
  return value === 0.6 || value === 0.8 || value === 1.0 || value === 1.2;
}

function isDensity(
  value: unknown,
): value is AccessibilityPreferences['density'] {
  return value === 'standard' || value === 'calm';
}

function isInstructionLength(
  value: unknown,
): value is AccessibilityPreferences['instructionLength'] {
  return value === 'short' || value === 'full';
}

function isOptionsPerActivity(
  value: unknown,
): value is AccessibilityPreferences['optionsPerActivity'] {
  return value === 2 || value === 3 || value === 4;
}

function isLanguage(
  value: unknown,
): value is AccessibilityPreferences['language'] {
  return value === 'es' || value === 'qu';
}

function parsePreferences(value: unknown): AccessibilityPreferences | null {
  if (!isObject(value)) {
    return null;
  }

  const defaults = getInitialPreferences();
  const next: AccessibilityPreferences = { ...defaults };

  if (isTheme(value.theme)) next.theme = value.theme;
  if (isTextScale(value.textScale)) next.textScale = value.textScale;
  if (isMotion(value.motion)) next.motion = value.motion;
  if (typeof value.sound === 'boolean') next.sound = value.sound;
  if (typeof value.speech === 'boolean') next.speech = value.speech;
  if (isSpeechRate(value.speechRate)) next.speechRate = value.speechRate;
  if (typeof value.captions === 'boolean') next.captions = value.captions;
  if (typeof value.signLanguage === 'boolean') {
    next.signLanguage = value.signLanguage;
  }
  if (typeof value.braille === 'boolean') next.braille = value.braille;
  if (isDensity(value.density)) next.density = value.density;
  if (isInstructionLength(value.instructionLength)) {
    next.instructionLength = value.instructionLength;
  }
  if (isOptionsPerActivity(value.optionsPerActivity)) {
    next.optionsPerActivity = value.optionsPerActivity;
  }
  if (typeof value.confirmNavigation === 'boolean') {
    next.confirmNavigation = value.confirmNavigation;
  }
  if (isLanguage(value.language)) next.language = value.language;

  return next;
}

function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadAccessibilityState(): AccessibilityState | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed) || parsed.version !== STORAGE_VERSION) {
      return null;
    }
    const preferences = parsePreferences(parsed.preferences);
    if (!preferences) {
      return null;
    }

    const quietModeRaw = isObject(parsed.quietMode) ? parsed.quietMode : {};
    const snapshot = parsePreferences(quietModeRaw.snapshot);

    return {
      preferences,
      quietMode: {
        active: quietModeRaw.active === true,
        snapshot,
      },
    };
  } catch {
    return null;
  }
}

export function saveAccessibilityState(state: AccessibilityState): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const payload: StoredPayload = {
    version: STORAGE_VERSION,
    preferences: state.preferences,
    quietMode: state.quietMode,
  };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Almacenamiento lleno o bloqueado: la sesión sigue en memoria.
  }
}

export function clearAccessibilityState(): void {
  const storage = getStorage();
  storage?.removeItem(STORAGE_KEY);
}
