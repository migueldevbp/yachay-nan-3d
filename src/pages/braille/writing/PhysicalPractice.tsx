import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PhysicalSlateMode } from '@/components/braille-writing/PhysicalSlateMode';
import { SlatePractice } from '@/pages/braille/writing/SlatePractice';
import {
  describeWritingPositions,
  readingDotsForChar,
  toSlatePosition,
} from '@/modules/braille-writing';
import type { ActivityResult } from '@/modules/braille';
import { useBrailleVoice } from '@/pages/braille/writing/useBrailleVoice';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';

const SEQUENCE = ['m', 'a'] as const;

interface PhysicalPracticeProps {
  onActivityComplete?: (result: ActivityResult) => void;
}

export function PhysicalPractice({ onActivityComplete }: PhysicalPracticeProps) {
  const { t } = useTranslation('braille');
  const { say } = useAccessibility();
  const tv = useBrailleVoice();
  const [step, setStep] = useState(0);
  const [checking, setChecking] = useState(false);
  const [handsFree, setHandsFree] = useState(false);
  const [pauseMs, setPauseMs] = useState(5000);

  const letter = SEQUENCE[step] ?? 'm';
  const instruction = useMemo(() => {
    const reading = readingDotsForChar(letter) ?? [];
    return t('physicalStep', {
      cell: step + 1,
      letter,
      slate: describeWritingPositions(toSlatePosition(reading), tv),
    });
  }, [letter, step, t, tv]);

  const announce = useCallback(() => {
    say(instruction);
  }, [instruction, say]);

  useEffect(() => {
    announce();
  }, [announce]);

  const advance = useCallback(() => {
    if (checking) {
      return;
    }
    if (step + 1 >= SEQUENCE.length) {
      setChecking(true);
      const done = t('physicalDone');
      say(done);
      return;
    }
    setStep((current) => current + 1);
  }, [checking, say, step, t]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        if (event.key === 'Enter' && target instanceof HTMLInputElement) {
          return;
        }
        return;
      }
      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        advance();
      }
      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        announce();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, announce]);

  useEffect(() => {
    if (!handsFree || checking) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      advance();
    }, pauseMs);
    return () => window.clearTimeout(timer);
  }, [advance, checking, handsFree, pauseMs, step]);

  if (checking) {
    return (
      <div className="physical-practice">
        <p>{t('physicalDone')}</p>
        <SlatePractice
          lessonId={4}
          onActivityComplete={(result) =>
            onActivityComplete?.({ ...result, mode: 'physical-slate' })
          }
        />
      </div>
    );
  }

  return (
    <div className="physical-practice">
      <PhysicalSlateMode
        instruction={instruction}
        handsFree={handsFree}
        pauseMs={pauseMs}
        onHandsFreeChange={setHandsFree}
        onPauseChange={setPauseMs}
        onAdvance={advance}
      />
      <Button variant="ghost" onClick={announce}>
        {t('repeat')}
      </Button>
    </div>
  );
}
