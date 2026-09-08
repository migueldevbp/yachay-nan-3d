import { useEffect, useMemo, useState } from 'react';
import { BrailleLegend } from '@/components/braille/BrailleLegend';
import { Button } from '@/components/ui/Button';
import { MirrorExplainer } from '@/components/braille-writing/MirrorExplainer';
import { SlatePractice } from '@/pages/braille/writing/SlatePractice';
import type { ActivityResult } from '@/modules/braille';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';

const STEP_LETTERS: Record<number, string> = {
  1: 'a',
  3: 'e',
  4: 'c',
  5: 'f',
};

interface LearnMirrorProps {
  onActivityComplete?: (result: ActivityResult) => void;
}

export function LearnMirror({ onActivityComplete }: LearnMirrorProps) {
  const { t } = useTranslation('braille');
  const { say } = useAccessibility();
  const [step, setStep] = useState(1);
  const letter = STEP_LETTERS[step] ?? 'c';

  const title = t(`mirrorStep${step}Title` as 'mirrorStep1Title');
  const body = t(`mirrorStep${step}Body` as 'mirrorStep1Body');

  useEffect(() => {
    const message = `${title}. ${body}`;
    say(message);
  }, [body, say, title]);

  const explainerLetter = useMemo(() => {
    if (step === 4) {
      return 'c';
    }
    if (step === 5) {
      return 'f';
    }
    return letter;
  }, [letter, step]);

  return (
    <section className="learn-mirror">
      <h2>{title}</h2>
      <p>{body}</p>
      {step === 1 ? <BrailleLegend /> : null}
      {step === 3 || step === 4 || step === 5 ? (
        <MirrorExplainer letter={explainerLetter} />
      ) : null}
      {step === 5 ? <p>{t('fdPairNote')}</p> : null}
      {step === 6 ? (
        <SlatePractice
          lessonId={2}
          hideHelpUntilTried
          onActivityComplete={onActivityComplete}
        />
      ) : (
        <>
          <div className="writing-actions">
            <Button
              variant="secondary"
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              disabled={step === 1}
            >
              {t('previous')}
            </Button>
            <Button
              onClick={() => {
                const next = Math.min(6, step + 1);
                setStep(next);
              }}
            >
              {t('next')}
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
