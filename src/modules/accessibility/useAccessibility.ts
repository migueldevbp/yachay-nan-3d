import { useContext } from 'react';
import { AccessibilityContext } from '@/modules/accessibility/AccessibilityContext';
import type { AccessibilityContextValue } from '@/modules/accessibility/AccessibilityContext';

export function useAccessibility(): AccessibilityContextValue {
  const value = useContext(AccessibilityContext);
  if (!value) {
    throw new Error(
      'useAccessibility debe usarse dentro de AccessibilityProvider.',
    );
  }
  return value;
}
