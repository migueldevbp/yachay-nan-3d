import { useCallback, useContext } from 'react';
import { I18nContext } from '@/i18n/I18nProvider';
import { lookupMessage, validationRatioFor } from '@/i18n/catalog';
import type { Messages, Namespace } from '@/i18n/config';
import type {
  InterpolationVars,
  LanguageCode,
  MessagePaths,
} from '@/i18n/types';
import { AccessibilityContext } from '@/modules/accessibility/AccessibilityContext';

export function useTranslation<N extends Namespace>(namespace: N) {
  const i18n = useContext(I18nContext);
  const accessibility = useContext(AccessibilityContext);
  const language: LanguageCode = accessibility?.preferences.language ?? 'es';

  const t = useCallback(
    (key: MessagePaths<Messages[N]>, vars?: InterpolationVars): string => {
      return lookupMessage(language, namespace, key, vars, (warning) => {
        const token = `${language}:${namespace}.${key}`;
        if (i18n?.warnedKeys.has(token)) {
          return;
        }
        i18n?.warnedKeys.add(token);
        if (import.meta.env.DEV) {
          console.warn(warning);
        }
      });
    },
    [i18n, language, namespace],
  );

  const setLanguage = useCallback(
    (next: LanguageCode) => {
      accessibility?.setPreference('language', next);
    },
    [accessibility],
  );

  const validationRatio = validationRatioFor(language);

  return {
    t,
    language,
    setLanguage,
    validationRatio,
  };
}
