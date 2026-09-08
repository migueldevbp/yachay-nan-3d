import { BrailleCell } from '@/components/braille/BrailleCell';
import { SlateCell } from '@/components/braille-writing/SlateCell';
import { describeDots } from '@/modules/braille';
import {
  describeWritingPositions,
  readingDotsForChar,
  toSlatePosition,
  type VoiceT,
} from '@/modules/braille-writing';
import { useTranslation } from '@/i18n/useTranslation';

interface MirrorExplainerProps {
  letter: string;
}

export function MirrorExplainer({ letter }: MirrorExplainerProps) {
  const { t } = useTranslation('braille');
  const tVoice: VoiceT = (key, vars) =>
    t(key as Parameters<typeof t>[0], vars);
  const reading = readingDotsForChar(letter) ?? [];
  const writing = toSlatePosition(reading);
  const description = t('mirrorDescribe', {
    reading: describeDots(reading, 'es'),
    slate: describeWritingPositions(writing, tVoice),
  });

  return (
    <figure className="mirror-explainer">
      <div className="mirror-explainer__pair">
        <div>
          <p>{t('mirrorReading')}</p>
          <BrailleCell
            dots={reading}
            size="lg"
            showDotNumbers
            label={`${t('mirrorReading')}. ${describeDots(reading, 'es')}`}
          />
        </div>
        <div>
          <p>{t('mirrorWriting')}</p>
          <SlateCell
            writingDots={writing}
            size="lg"
            showDotNumbers
            label={`${t('mirrorWriting')}. ${describeWritingPositions(writing, tVoice)}`}
          />
        </div>
      </div>
      <figcaption>{description}</figcaption>
    </figure>
  );
}
