import { useEffect, useRef } from 'react';
import { BrailleCell } from '@/components/braille/BrailleCell';
import {
  PERKINS_CHORD_MS,
  PERKINS_KEY_TO_READING,
} from '@/modules/braille-writing';
import { useTranslation } from '@/i18n/useTranslation';

interface PerkinsKeyboardProps {
  pendingDots: number[];
  onCell: (readingDots: number[]) => void;
  onPendingChange?: (dots: number[]) => void;
  disabled?: boolean;
}

export function PerkinsKeyboard({
  pendingDots,
  onCell,
  onPendingChange,
  disabled = false,
}: PerkinsKeyboardProps) {
  const { t } = useTranslation('braille');
  const chordRef = useRef(new Set<number>());
  const timerRef = useRef<number | null>(null);
  const onCellRef = useRef(onCell);
  const onPendingRef = useRef(onPendingChange);
  onCellRef.current = onCell;
  onPendingRef.current = onPendingChange;

  useEffect(() => {
    function flush() {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const dots = [...chordRef.current].sort((a, b) => a - b);
      chordRef.current.clear();
      onPendingRef.current?.([]);
      if (dots.length > 0) {
        onCellRef.current(dots);
      }
    }

    function arm() {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(flush, PERKINS_CHORD_MS);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (disabled) {
        return;
      }
      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        chordRef.current.clear();
        onPendingRef.current?.([]);
        onCellRef.current([]);
        return;
      }
      const dot = PERKINS_KEY_TO_READING[event.key.toLowerCase()];
      if (!dot || event.repeat) {
        return;
      }
      event.preventDefault();
      chordRef.current.add(dot);
      onPendingRef.current?.([...chordRef.current].sort((a, b) => a - b));
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (disabled) {
        return;
      }
      const dot = PERKINS_KEY_TO_READING[event.key.toLowerCase()];
      if (!dot) {
        return;
      }
      event.preventDefault();
      arm();
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [disabled]);

  return (
    <div className="perkins-keyboard" role="group" aria-label={t('perkinsKeyHelp')}>
      <p>{t('perkinsKeyHelp')}</p>
      <p>{t('perkinsNoMirror')}</p>
      <BrailleCell
        dots={pendingDots}
        size="lg"
        showDotNumbers
        label={t('cellGroup')}
      />
    </div>
  );
}
