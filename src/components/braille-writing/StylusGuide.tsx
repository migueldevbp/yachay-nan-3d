import { describeDots } from '@/modules/braille';
import {
  describeWritingPositions,
  readingDotsForChar,
  toSlatePosition,
  type VoiceT,
} from '@/modules/braille-writing';
import { useTranslation } from '@/i18n/useTranslation';

interface StylusGuideProps {
  letter: string;
}

export function StylusGuide({ letter }: StylusGuideProps) {
  const { t } = useTranslation('braille');
  const tVoice: VoiceT = (key, vars) =>
    t(key as Parameters<typeof t>[0], vars);
  const reading = readingDotsForChar(letter) ?? [];
  const slate = toSlatePosition(reading);

  return (
    <p className="stylus-guide">
      {t('voiceHelpLetter', {
        letter,
        reading: describeDots(reading, 'es'),
        slate: describeWritingPositions(slate, tVoice),
      })}
    </p>
  );
}
