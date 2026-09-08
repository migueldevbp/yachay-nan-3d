import { createContext } from 'react';
import type { AccessibilityPreferences } from '@/modules/accessibility/types';
import type { AnnouncerUrgency } from '@/modules/accessibility/types';

export interface AccessibilityContextValue {
  preferences: AccessibilityPreferences;
  setPreference: <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K],
  ) => void;
  resetPreferences: () => void;
  quietModeActive: boolean;
  toggleQuietMode: () => void;
  say: (message: string, urgency?: AnnouncerUrgency) => void;
  caption: string;
  livePolite: string;
  liveAssertive: string;
}

export const AccessibilityContext =
  createContext<AccessibilityContextValue | null>(null);
