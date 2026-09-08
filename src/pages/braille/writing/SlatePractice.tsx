import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { SlateCell } from '@/components/braille-writing/SlateCell';
import { SlateGrid } from '@/components/braille-writing/SlateGrid';
import { StylusGuide } from '@/components/braille-writing/StylusGuide';
import { WritingFeedback } from '@/components/braille-writing/WritingFeedback';
import type { ActivityResult } from '@/modules/braille';
import {
  SLATE_KEY_TO_WRITING,
  SlateModel,
  WritingSession,
  cellStartMessage,
  confirmOkMessage,
  diagnosisMessage,
  expandTarget,
  getWritingLesson,
  getWritingLessons,
  helpMessage,
  lineEndMessage,
  promptsForLesson,
  punchMessage,
  reviewMessage,
} from '@/modules/braille-writing';
import { useBrailleVoice } from '@/pages/braille/writing/useBrailleVoice';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';

interface SlatePracticeProps {
  lessonId?: number;
  hideHelpUntilTried?: boolean;
  onActivityComplete?: (result: ActivityResult) => void;
}

function vibratePunch() {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(30);
  }
}

export function SlatePractice({
  lessonId = 3,
  hideHelpUntilTried = false,
  onActivityComplete,
}: SlatePracticeProps) {
  const { t } = useTranslation('braille');
  const { say } = useAccessibility();
  const tv = useBrailleVoice();
  const [selectedLesson, setSelectedLesson] = useState(lessonId);
  const [started, setStarted] = useState(true);
  const [slate] = useState(() => new SlateModel(2, 8));
  const [gridTick, setGridTick] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackOk, setFeedbackOk] = useState<boolean | null>(null);
  const [tried, setTried] = useState(false);
  const [finished, setFinished] = useState(false);
  const hitsRef = useRef(0);
  const helpBlocked = hideHelpUntilTried && !tried;

  const lesson = getWritingLesson(selectedLesson) ?? getWritingLesson(3);
  const prompts = useMemo(
    () => (lesson ? promptsForLesson(lesson) : ['a', 'e', 'i', 'o', 'u']),
    [lesson],
  );
  const promptIndex = useRef(0);
  const [session, setSession] = useState(() => new WritingSession(prompts[0] ?? 'a'));
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const currentLabel = session.current?.label ?? prompts[promptIndex.current] ?? 'a';

  const announceStart = useCallback(() => {
    const current = sessionRef.current.current;
    if (!current) {
      return;
    }
    const cursor = slate.getCursor();
    const message = cellStartMessage(
      tv,
      cursor.cell + 1,
      cursor.line + 1,
      current.label,
    );
    say(message);
    setFeedback(message);
    setFeedbackOk(null);
  }, [say, slate, tv]);

  const announcedKey = useRef('');
  useEffect(() => {
    if (!started || finished) {
      return;
    }
    const key = `${promptIndex.current}:${session.step}:${session.target}`;
    if (announcedKey.current === key) {
      return;
    }
    announcedKey.current = key;
    announceStart();
  }, [announceStart, finished, session, started]);

  function refreshGrid() {
    setGridTick((value) => value + 1);
  }

  const promptsRef = useRef(prompts);
  promptsRef.current = prompts;

  const finishAll = useCallback(
    (finalCorrect: number) => {
      const totalCells = promptsRef.current.reduce(
        (sum, item) => sum + expandTarget(item).length,
        0,
      );
      setFinished(true);
      const result: ActivityResult = {
        mode: 'slate-writing',
        correct: finalCorrect,
        total: totalCells,
      };
      onActivityComplete?.(result);
      const summary = t('hitsSummary', {
        correct: finalCorrect,
        total: totalCells,
      });
      const doneMessage = `${t('lessonComplete')}. ${summary}`;
      say(doneMessage);
      setFeedback(doneMessage);
      setFeedbackOk(true);
    },
    [onActivityComplete, say, t],
  );

  const confirmCell = useCallback(() => {
    const current = sessionRef.current;
    if (current.done || finished) {
      return;
    }
    setTried(true);
    const diagnosis = current.confirmSlate(slate.currentDots());
    if (!diagnosis) {
      return;
    }
    if (diagnosis.ok) {
      const wrap = slate.confirmCell();
      refreshGrid();
      const nextHits = hitsRef.current + 1;
      hitsRef.current = nextHits;
      const ok = confirmOkMessage(tv, currentLabel);
      say(ok);
      setFeedback(ok);
      setFeedbackOk(true);
      if (wrap.lineWrapped) {
        const lineMsg = lineEndMessage(tv, slate.humanLineNumber());
        say(lineMsg);
      }
      if (!current.done) {
        announceStart();
        return;
      }
      const nextIndex = promptIndex.current + 1;
      const list = promptsRef.current;
      if (nextIndex >= list.length) {
        finishAll(nextHits);
        return;
      }
      promptIndex.current = nextIndex;
      setSession(new WritingSession(list[nextIndex] ?? 'a'));
      return;
    }
    const error = diagnosisMessage(tv, diagnosis);
    say(error);
    setFeedback(error);
    setFeedbackOk(false);
    slate.setCurrentDots([]);
    refreshGrid();
  }, [announceStart, currentLabel, finishAll, finished, say, slate, tv]);

  const punch = useCallback(
    (writingDot: number) => {
      slate.punch(writingDot);
      refreshGrid();
      vibratePunch();
      const message = punchMessage(tv, writingDot);
      say(message);
      setFeedback(message);
    },
    [say, slate, tv],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!started || finished) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (event.key === '?') {
        event.preventDefault();
        say(t('shortcutsHelp'));
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setStarted(false);
        return;
      }
      if (event.key === 'h' || event.key === 'H') {
        event.preventDefault();
        if (helpBlocked) {
          return;
        }
        const help = helpMessage(tv, currentLabel);
        say(help);
        setFeedback(help);
        return;
      }
      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        announceStart();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        slate.moveCursor(0, 1);
        refreshGrid();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        slate.moveCursor(0, -1);
        refreshGrid();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        slate.moveCursor(1, 0);
        refreshGrid();
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        slate.moveCursor(-1, 0);
        refreshGrid();
        return;
      }
      if (event.key === 'Backspace') {
        event.preventDefault();
        slate.undo();
        refreshGrid();
        return;
      }
      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        confirmCell();
        return;
      }
      if (event.key >= '1' && event.key <= '6') {
        event.preventDefault();
        punch(Number(event.key));
        return;
      }
      const mapped = SLATE_KEY_TO_WRITING[event.key.toLowerCase()];
      if (mapped) {
        event.preventDefault();
        punch(mapped);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    announceStart,
    confirmCell,
    currentLabel,
    finished,
    helpBlocked,
    punch,
    say,
    slate,
    started,
    t,
    tv,
  ]);

  const state = slate.getState();
  void gridTick;

  if (!started) {
    return (
      <div className="slate-practice">
        <Select<number>
          label={t('lessonLabel')}
          value={selectedLesson}
          onChange={setSelectedLesson}
          options={getWritingLessons()
            .filter((item) => item.kind !== 'cell' && item.kind !== 'free')
            .map((item) => ({
              value: item.id,
              label: t(item.titleKey as 'lesson3Title'),
            }))}
        />
        <Button
          onClick={() => {
            promptIndex.current = 0;
            setSession(new WritingSession(prompts[0] ?? 'a'));
            setFinished(false);
            hitsRef.current = 0;
            announcedKey.current = '';
            setStarted(true);
          }}
        >
          {t('startWriting')}
        </Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="slate-practice" role="status">
        <WritingFeedback ok message={feedback} />
        <Button
          onClick={() => {
            promptIndex.current = 0;
            setSession(new WritingSession(prompts[0] ?? 'a'));
            setFinished(false);
            setTried(false);
            hitsRef.current = 0;
            announcedKey.current = '';
          }}
        >
          {t('startWriting')}
        </Button>
      </div>
    );
  }

  const written = session.writtenLetters().filter(Boolean).join(', ');

  return (
    <div className="slate-practice">
      {lesson ? (
        <>
          <p>
            {t('lessonLabel')} {lesson.id}. {t(lesson.titleKey as 'lesson3Title')}
          </p>
          <p>
            {t('lessonObjective')}. {t(lesson.objectiveKey as 'lesson3Objective')}
          </p>
          <p>
            {t('lessonAdvance')}. {t(lesson.advanceKey as 'lesson3Advance')}
          </p>
        </>
      ) : null}
      <p>{t('slatePracticeSize')}</p>
      <p>{t('slateKeyHelp')}</p>
      <p className="slate-practice__prompt">
        {t('questionProgress', {
          current: promptIndex.current + 1,
          total: prompts.length,
        })}{' '}
        <strong>{currentLabel}</strong>
      </p>
      <SlateCell writingDots={slate.currentDots()} size="xl" showDotNumbers />
      <SlateGrid state={state} />
      <div className="slate-touch" role="group" aria-label={t('slateKeyHelp')}>
        {([1, 2, 3, 4, 5, 6] as const).map((dot) => (
          <button
            key={dot}
            type="button"
            className="slate-touch__zone"
            onClick={() => punch(dot)}
          >
            {t(`pos${dot}` as 'pos1')}
          </button>
        ))}
      </div>
      {helpBlocked ? null : <StylusGuide letter={currentLabel} />}
      {feedbackOk === null && feedback ? <p role="status">{feedback}</p> : null}
      {feedbackOk !== null && feedback ? (
        <WritingFeedback ok={feedbackOk} message={feedback} />
      ) : null}
      {written ? (
        <p>{reviewMessage(tv, written, !session.done)}</p>
      ) : null}
      <div className="writing-actions">
        <Button
          variant="ghost"
          onClick={() => {
            if (helpBlocked) {
              return;
            }
            const help = helpMessage(tv, currentLabel);
            say(help);
            setFeedback(help);
          }}
        >
          {t('help')}
        </Button>
        <Button variant="ghost" onClick={announceStart}>
          {t('repeat')}
        </Button>
        <Button onClick={confirmCell}>{t('confirm')}</Button>
      </div>
    </div>
  );
}
