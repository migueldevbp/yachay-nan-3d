import { useMemo, useState } from 'react';
import { BrailleCell } from '@/components/braille/BrailleCell';
import { BrailleKeyboard } from '@/components/braille/BrailleKeyboard';
import { Button } from '@/components/ui/Button';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { charToBraille, describeDots } from '@/modules/braille';
import type { ActivityResult, PracticeMode } from '@/modules/braille';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';

const PRACTICE_LETTERS = ['A', 'B', 'C', 'E', 'L', 'M', 'S'] as const;
const ROUND_SIZE = 5;

function sameDots(a: number[], b: number[]): boolean {
  const left = [...a].sort((x, y) => x - y).join(',');
  const right = [...b].sort((x, y) => x - y).join(',');
  return left === right;
}

function letterDots(letter: string): number[] {
  return charToBraille(letter.toLowerCase())?.dots ?? [];
}

function distractors(answer: string, count: number): string[] {
  const pool = PRACTICE_LETTERS.filter((letter) => letter !== answer);
  const picked: string[] = [];
  for (const letter of pool) {
    if (picked.length >= count) {
      break;
    }
    picked.push(letter);
  }
  return picked;
}

interface BraillePracticeProps {
  onActivityComplete?: (result: ActivityResult) => void;
}

export function BraillePractice({ onActivityComplete }: BraillePracticeProps) {
  const { t } = useTranslation('braille');
  const { preferences, say } = useAccessibility();
  const [mode, setMode] = useState<PracticeMode>('letter-to-braille');
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [dots, setDots] = useState<number[]>([]);
  const [choice, setChoice] = useState<string>('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>(
    'idle',
  );
  const [finished, setFinished] = useState(false);

  const sequence = useMemo(() => PRACTICE_LETTERS.slice(0, ROUND_SIZE), []);
  const current = sequence[step] ?? 'A';
  const optionsCount = preferences.optionsPerActivity;
  const choices = useMemo(() => {
    const others = distractors(current, optionsCount - 1);
    return [current, ...others];
  }, [current, optionsCount]);

  const instruction =
    mode === 'letter-to-braille'
      ? `${t('promptLetter')}. ${current}. ${describeDots(letterDots(current), 'es')}`
      : `${t('promptBraille')}. ${describeDots(letterDots(current), 'es')}`;

  function announceInstruction() {
    say(instruction);
  }

  function start() {
    setStarted(true);
    setStep(0);
    setCorrectCount(0);
    setDots([]);
    setChoice('');
    setFeedback('idle');
    setFinished(false);
    say(instruction);
  }

  function finishRound(finalCorrect: number) {
    setFinished(true);
    const result: ActivityResult = {
      mode,
      correct: finalCorrect,
      total: sequence.length,
    };
    onActivityComplete?.(result);
    const summary = t('hitsSummary', {
      correct: finalCorrect,
      total: sequence.length,
    });
    const doneMessage = `${t('roundDone')}. ${summary}`;
    say(doneMessage);
  }

  function goNext(nextCorrect: number) {
    const nextStep = step + 1;
    if (nextStep >= sequence.length) {
      finishRound(nextCorrect);
      return;
    }
    setStep(nextStep);
    setDots([]);
    setChoice('');
    setFeedback('idle');
    const nextLetter = sequence[nextStep] ?? 'A';
    const nextInstruction =
      mode === 'letter-to-braille'
        ? `${t('promptLetter')}. ${nextLetter}. ${describeDots(letterDots(nextLetter), 'es')}`
        : `${t('promptBraille')}. ${describeDots(letterDots(nextLetter), 'es')}`;
    say(nextInstruction);
  }

  function confirm() {
    if (finished || feedback === 'correct') {
      return;
    }
    const ok =
      mode === 'letter-to-braille'
        ? sameDots(dots, letterDots(current))
        : choice === current;
    if (ok) {
      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);
      setFeedback('correct');
      say(t('correct'));
      return;
    }
    setFeedback('incorrect');
    say(t('incorrect'));
  }

  if (!started) {
    return (
      <div className="braille-practice">
        <p>{t('practiceReady')}</p>
        <RadioGroup<PracticeMode>
          legend={t('modeLegend')}
          name="braille-practice-mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'letter-to-braille', label: t('modeLetterToBraille') },
            { value: 'braille-to-letter', label: t('modeBrailleToLetter') },
          ]}
        />
        <Button onClick={start}>{t('startPractice')}</Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="braille-practice" role="status">
        <p>{t('roundDone')}</p>
        <p>
          {t('hitsSummary', { correct: correctCount, total: sequence.length })}
        </p>
        <Button onClick={start}>{t('startPractice')}</Button>
      </div>
    );
  }

  return (
    <div className="braille-practice">
      <p>
        {t('questionProgress', { current: step + 1, total: sequence.length })}
      </p>
      <Button variant="ghost" onClick={announceInstruction}>
        {t('repeat')}
      </Button>

      {mode === 'letter-to-braille' ? (
        <>
          <p className="braille-practice__prompt">
            {t('promptLetter')} <strong aria-live="polite">{current}</strong>
          </p>
          <BrailleKeyboard
            dots={dots}
            onDotsChange={setDots}
            onConfirm={confirm}
          />
        </>
      ) : (
        <>
          <p className="braille-practice__prompt">{t('promptBraille')}</p>
          <BrailleCell
            dots={letterDots(current)}
            size="xl"
            label={describeDots(letterDots(current), 'es')}
          />
          <RadioGroup<string>
            legend={t('chooseLetter')}
            name="braille-choice"
            value={choice}
            onChange={setChoice}
            options={choices.map((letter) => ({
              value: letter,
              label: letter,
            }))}
          />
        </>
      )}

      {feedback === 'correct' ? (
        <p
          className="braille-practice__feedback braille-practice__feedback--ok"
          role="status"
        >
          <span aria-hidden="true">✓</span> {t('correct')}
        </p>
      ) : null}
      {feedback === 'incorrect' ? (
        <p
          className="braille-practice__feedback braille-practice__feedback--bad"
          role="status"
        >
          <span aria-hidden="true">!</span> {t('incorrect')}
        </p>
      ) : null}

      {feedback === 'correct' ? (
        <Button onClick={() => goNext(correctCount)}>
          {t('nextQuestion')}
        </Button>
      ) : (
        <Button onClick={confirm}>{t('confirm')}</Button>
      )}
    </div>
  );
}
