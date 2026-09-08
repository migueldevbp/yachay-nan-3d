import { BrailleCell } from '@/components/braille/BrailleCell';
import { useTranslation } from '@/i18n/useTranslation';

interface BrailleKeyboardProps {
  dots: number[];
  onDotsChange: (dots: number[]) => void;
  onConfirm?: () => void;
  showDotNumbers?: boolean;
}

export function BrailleKeyboard({
  dots,
  onDotsChange,
  onConfirm,
  showDotNumbers = true,
}: BrailleKeyboardProps) {
  const { t } = useTranslation('braille');

  return (
    <div className="braille-keyboard">
      <p className="braille-keyboard__help">{t('keyboardHelp')}</p>
      <BrailleCell
        dots={dots}
        size="xl"
        interactive
        showDotNumbers={showDotNumbers}
        showEmptyDots
        onDotsChange={onDotsChange}
        onConfirm={onConfirm}
        label={t('cellGroup')}
      />
    </div>
  );
}
