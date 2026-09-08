import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AccessibilityContext } from '@/modules/accessibility/AccessibilityContext';
import { applyPreferences } from '@/modules/accessibility/applyPreferences';
import {
  applyQuietMode,
  getInitialPreferences,
} from '@/modules/accessibility/presets';
import {
  loadAccessibilityState,
  saveAccessibilityState,
} from '@/modules/accessibility/storage';
import type {
  AccessibilityPreferences,
  AccessibilityState,
  AnnouncerUrgency,
} from '@/modules/accessibility/types';

function readInitialState(): AccessibilityState {
  const stored = loadAccessibilityState();
  if (stored) {
    applyPreferences(stored.preferences);
    return stored;
  }
  const preferences = getInitialPreferences();
  applyPreferences(preferences);
  return {
    preferences,
    quietMode: { active: false, snapshot: null },
  };
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const [state, setState] = useState<AccessibilityState>(readInitialState);
  const [caption, setCaption] = useState('');
  const [livePolite, setLivePolite] = useState('');
  const [liveAssertive, setLiveAssertive] = useState('');
  const preferencesRef = useRef(state.preferences);
  const skipInitialPersist = useRef(true);
  preferencesRef.current = state.preferences;

  useLayoutEffect(() => {
    applyPreferences(state.preferences);
    if (skipInitialPersist.current) {
      skipInitialPersist.current = false;
      return;
    }
    saveAccessibilityState(state);
  }, [state]);

  const say = useCallback(
    (message: string, urgency: AnnouncerUrgency = 'polite') => {
      const trimmed = message.trim();
      if (!trimmed) {
        return;
      }

      if (urgency === 'assertive') {
        setLiveAssertive('');
        requestAnimationFrame(() => {
          setLiveAssertive(trimmed);
        });
      } else {
        setLivePolite('');
        requestAnimationFrame(() => {
          setLivePolite(trimmed);
        });
      }

      if (preferencesRef.current.captions) {
        setCaption(trimmed);
      }

      if (preferencesRef.current.speech) {
        // FASE 07: SpeechProvider
        // Aquí se enviará el mensaje al motor de voz con
        // preferencesRef.current.speechRate. No reproducir audio en esta fase.
      }
    },
    [],
  );

  const setPreference = useCallback(
    <K extends keyof AccessibilityPreferences>(
      key: K,
      value: AccessibilityPreferences[K],
    ) => {
      setState((current) => {
        if (current.preferences[key] === value) {
          return current;
        }
        return {
          ...current,
          preferences: { ...current.preferences, [key]: value },
        };
      });
    },
    [],
  );

  const resetPreferences = useCallback(() => {
    setState({
      preferences: getInitialPreferences(),
      quietMode: { active: false, snapshot: null },
    });
    setCaption('');
  }, []);

  const toggleQuietMode = useCallback(() => {
    setState((current) => {
      if (current.quietMode.active) {
        return {
          preferences: current.quietMode.snapshot ?? getInitialPreferences(),
          quietMode: { active: false, snapshot: null },
        };
      }
      return {
        preferences: applyQuietMode(current.preferences),
        quietMode: { active: true, snapshot: current.preferences },
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      preferences: state.preferences,
      setPreference,
      resetPreferences,
      quietModeActive: state.quietMode.active,
      toggleQuietMode,
      say,
      caption,
      livePolite,
      liveAssertive,
    }),
    [
      state.preferences,
      state.quietMode.active,
      setPreference,
      resetPreferences,
      toggleQuietMode,
      say,
      caption,
      livePolite,
      liveAssertive,
    ],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}
