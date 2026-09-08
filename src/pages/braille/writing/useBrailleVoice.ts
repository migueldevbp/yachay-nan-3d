import { useCallback } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import type { VoiceT } from '@/modules/braille-writing';

export function useBrailleVoice(): VoiceT {
  const { t } = useTranslation('braille');
  return useCallback<VoiceT>(
    (key, vars) => t(key as Parameters<typeof t>[0], vars),
    [t],
  );
}
