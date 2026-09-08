import type { AccessibilityPreferences } from '@/modules/accessibility/types';

/**
 * Escribe atributos en <html>. El CSS reacciona a ellos.
 * No hay estilos condicionales en JavaScript.
 */
export function applyPreferences(preferences: AccessibilityPreferences): void {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  root.lang = preferences.language;
  root.dataset.theme = preferences.theme;
  root.dataset.motion = preferences.motion;
  root.dataset.density = preferences.density;
  root.dataset.textScale = String(preferences.textScale);
  root.dataset.captions = preferences.captions ? 'on' : 'off';
  root.dataset.braille = preferences.braille ? 'on' : 'off';
  root.dataset.signLanguage = preferences.signLanguage ? 'on' : 'off';
}
