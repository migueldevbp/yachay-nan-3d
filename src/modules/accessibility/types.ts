export type ThemePreference = 'light' | 'dark' | 'high-contrast';
export type TextScalePreference = 100 | 125 | 150 | 200;
export type MotionPreference = 'full' | 'reduced' | 'none';
export type SpeechRatePreference = 0.6 | 0.8 | 1.0 | 1.2;
export type DensityPreference = 'standard' | 'calm';
export type InstructionLengthPreference = 'short' | 'full';
export type OptionsPerActivityPreference = 2 | 3 | 4;
export type LanguagePreference = 'es' | 'qu';
export type AnnouncerUrgency = 'polite' | 'assertive';

export interface AccessibilityPreferences {
  theme: ThemePreference;
  textScale: TextScalePreference;
  motion: MotionPreference;
  sound: boolean;
  speech: boolean;
  speechRate: SpeechRatePreference;
  captions: boolean;
  signLanguage: boolean;
  braille: boolean;
  density: DensityPreference;
  instructionLength: InstructionLengthPreference;
  optionsPerActivity: OptionsPerActivityPreference;
  confirmNavigation: boolean;
  language: LanguagePreference;
}

export interface QuietModeState {
  active: boolean;
  snapshot: AccessibilityPreferences | null;
}

export interface AccessibilityState {
  preferences: AccessibilityPreferences;
  quietMode: QuietModeState;
}

export type PreferenceKey = keyof AccessibilityPreferences;
