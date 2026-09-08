import { BrailleCell } from '@/components/braille/BrailleCell';
import { describeWritingPositions } from '@/modules/braille-writing';
import { useTranslation } from '@/i18n/useTranslation';
import type { VoiceT } from '@/modules/braille-writing';

interface SlateCellProps {
  writingDots: number[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDotNumbers?: boolean;
  label?: string;
  interactive?: boolean;
  onDotsChange?: (dots: number[]) => void;
}

export function SlateCell({
  writingDots,
  size = 'md',
  showDotNumbers = true,
  label,
  interactive = false,
  onDotsChange,
}: SlateCellProps) {
  const { t } = useTranslation('braille');
  const tVoice: VoiceT = (key, vars) =>
    t(key as Parameters<typeof t>[0], vars);

  return (
    <BrailleCell
      dots={writingDots}
      size={size}
      showDotNumbers={showDotNumbers}
      showEmptyDots
      interactive={interactive}
      onDotsChange={onDotsChange}
      label={label ?? describeWritingPositions(writingDots, tVoice)}
    />
  );
}
