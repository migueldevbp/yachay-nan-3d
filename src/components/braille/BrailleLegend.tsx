import { BrailleCell } from '@/components/braille/BrailleCell';
import { useTranslation } from '@/i18n/useTranslation';

export function BrailleLegend() {
  const { t } = useTranslation('braille');

  return (
    <figure className="braille-legend">
      <figcaption className="braille-legend__title">
        {t('legendTitle')}
      </figcaption>
      <p>{t('legendBody')}</p>
      <BrailleCell
        dots={[]}
        size="lg"
        showDotNumbers
        showEmptyDots
        label={t('legendCaption')}
      />
    </figure>
  );
}
