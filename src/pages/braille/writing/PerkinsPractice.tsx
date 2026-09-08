import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PerkinsKeyboard } from '@/components/braille-writing/PerkinsKeyboard';
import { SlateCell } from '@/components/braille-writing/SlateCell';
import { WritingFeedback } from '@/components/braille-writing/WritingFeedback';
import type { ActivityResult } from '@/modules/braille';
import {
  WritingSession,
  confirmOkMessage,
  diagnosisMessage,
  helpMessage,
  toSlatePosition,
} from '@/modules/braille-writing';
import { useBrailleVoice } from '@/pages/braille/writing/useBrailleVoice';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';

const LETTERS = ['c', 'e', 'a'] as const;

interface PerkinsPracticeProps {
  onActivityComplete?: (result: ActivityResult) => void;
}

export function PerkinsPractice({ onActivityComplete }: PerkinsPracticeProps) {
  const { t } = useTranslation('braille');
  const { say } = useAccessibility();
  const tv = useBrailleVoice();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'perkins' | 'slate'>('perkins');
  const [session, setSession] = useState(() => new WritingSession(LETTERS[0]));
  const [pending, setPending] = useState<number[]>([]);
  const [slateDots, setSlateDots] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  const [ok, setOk] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const letter = LETTERS[index] ?? 'c';

  const announce = useCallback(() => {
    const message = `${t('perkinsNoMirror')}. ${letter}`;
    say(message);
    setFeedback(message);
    setOk(null);
  }, [letter, say, t]);

  useEffect(() => {
    announce();
  }, [announce]);

  function completeIfDone(nextCorrect: number, nextIndex: number) {
    if (nextIndex >= LETTERS.length) {
      setFinished(true);
      const result: ActivityResult = {
        mode: 'perkins-writing',
        correct: nextCorrect,
        total: LETTERS.length,
      };
      onActivityComplete?.(result);
      const summary = t('hitsSummary', {
        correct: nextCorrect,
        total: LETTERS.length,
      });
      const doneMessage = `${t('lessonComplete')}. ${summary}`;
      say(doneMessage);
      setFeedback(doneMessage);
      setOk(true);
    }
  }

  const onPerkinsCell = useCallback(
    (readingDots: number[]) => {
      if (phase !== 'perkins' || finished) {
        return;
      }
      const diagnosis = session.confirmReading(readingDots);
      if (!diagnosis) {
        return;
      }
      if (diagnosis.ok) {
        const message = confirmOkMessage(tv, letter);
        say(message);
        setFeedback(message);
        setOk(true);
        setPhase('slate');
        setSlateDots([]);
        const contrast = t('contrastBody');
        say(contrast);
        return;
      }
      const error = diagnosisMessage(tv, diagnosis);
      say(error);
      setFeedback(error);
      setOk(false);
    },
    [finished, letter, phase, say, session, t, tv],
  );

  function confirmSlate() {
    const expected = toSlatePosition(session.cells[0]?.readingDots ?? []);
    const same =
      [...slateDots].sort().join(',') === [...expected].sort().join(',');
    if (same) {
      const nextCorrect = correct + 1;
      setCorrect(nextCorrect);
      const message = confirmOkMessage(tv, letter);
      say(message);
      setFeedback(message);
      setOk(true);
      const nextIndex = index + 1;
      if (nextIndex >= LETTERS.length) {
        completeIfDone(nextCorrect, nextIndex);
        return;
      }
      setIndex(nextIndex);
      setSession(new WritingSession(LETTERS[nextIndex] ?? 'c'));
      setPhase('perkins');
      setPending([]);
      setSlateDots([]);
      return;
    }
    const error = t('voiceIncorrect');
    say(error);
    setFeedback(error);
    setOk(false);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === '?') {
        event.preventDefault();
        say(t('shortcutsHelp'));
      }
      if ((event.key === 'h' || event.key === 'H') && phase === 'slate') {
        event.preventDefault();
        const help = helpMessage(tv, letter);
        say(help);
        setFeedback(help);
      }
      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        announce();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [announce, letter, phase, say, t, tv]);

  if (finished) {
    return (
      <div className="perkins-practice" role="status">
        <WritingFeedback ok message={feedback} />
      </div>
    );
  }

  return (
    <div className="perkins-practice">
      <p>{t('perkinsNoMirror')}</p>
      <p>{t('contrastTitle')}</p>
      <p>{t('contrastBody')}</p>
      <p className="slate-practice__prompt">{letter}</p>
      {phase === 'perkins' ? (
        <PerkinsKeyboard
          pendingDots={pending}
          onPendingChange={setPending}
          onCell={onPerkinsCell}
        />
      ) : (
        <>
          <p>{t('modeSlate')}</p>
          <SlateCell
            writingDots={slateDots}
            size="xl"
            interactive
            onDotsChange={setSlateDots}
          />
          <Button onClick={confirmSlate}>{t('confirm')}</Button>
        </>
      )}
      {ok !== null && feedback ? (
        <WritingFeedback ok={ok} message={feedback} />
      ) : (
        <p role="status">{feedback}</p>
      )}
      <Button variant="ghost" onClick={announce}>
        {t('repeat')}
      </Button>
    </div>
  );
}
