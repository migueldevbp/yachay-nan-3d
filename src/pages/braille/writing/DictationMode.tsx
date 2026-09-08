import { useMemo, useState } from 'react';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Button } from '@/components/ui/Button';
import { SlatePractice } from '@/pages/braille/writing/SlatePractice';
import { contentEngine } from '@/modules/content/ContentEngine';
import { spell } from '@/modules/braille-writing';
import type { ActivityResult } from '@/modules/braille';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';

type DictationLevel = 'letters' | 'syllables' | 'words' | 'sentences';

interface DictationModeProps {
  onActivityComplete?: (result: ActivityResult) => void;
}

function itemsFor(level: DictationLevel): string[] {
  if (level === 'letters') {
    return ['a', 'e', 'i', 'o', 'u'];
  }
  if (level === 'syllables') {
    return contentEngine
      .getByType('syllable')
      .map((item) => item.character)
      .filter((item) => ['ma', 'me', 'mi', 'mo', 'mu'].includes(item));
  }
  if (level === 'words') {
    const wanted = new Set(['mamá', 'papá', 'sol', 'luna']);
    return contentEngine
      .getByType('word')
      .map((item) => item.character)
      .filter((item) => wanted.has(item));
  }
  const first = contentEngine.getByType('sentence')[0]?.character;
  return first ? [first] : [];
}

export function DictationMode({ onActivityComplete }: DictationModeProps) {
  const { t } = useTranslation('braille');
  const { say } = useAccessibility();
  const [level, setLevel] = useState<DictationLevel>('letters');
  const [started, setStarted] = useState(false);
  const items = useMemo(() => itemsFor(level), [level]);
  const current = items[0] ?? 'a';
  const lessonId =
    level === 'letters' ? 3 : level === 'syllables' ? 5 : level === 'words' ? 6 : 9;

  function announce() {
    say(current);
  }

  if (!started) {
    return (
      <div className="dictation-mode">
        <RadioGroup<DictationLevel>
          legend={t('dictationLevel')}
          name="dictation-level"
          value={level}
          onChange={setLevel}
          options={[
            { value: 'letters', label: t('levelLetters') },
            { value: 'syllables', label: t('levelSyllables') },
            { value: 'words', label: t('levelWords') },
            { value: 'sentences', label: t('levelSentences') },
          ]}
        />
        <Button
          onClick={() => {
            setStarted(true);
            announce();
          }}
        >
          {t('startWriting')}
        </Button>
      </div>
    );
  }

  return (
    <div className="dictation-mode">
      <p>{current}</p>
      <div className="writing-actions">
        <Button
          variant="ghost"
          onClick={() => {
            announce();
          }}
        >
          {t('repeatDictation')}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            const spelled = spell(current);
            say(spelled);
          }}
        >
          {t('spellWord')}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            say(current);
          }}
        >
          {t('readFlow')}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            const spelled = spell(current);
            say(spelled);
          }}
        >
          {t('readCells')}
        </Button>
      </div>
      <SlatePractice
        lessonId={lessonId}
        onActivityComplete={(result) =>
          onActivityComplete?.({ ...result, mode: 'dictation' })
        }
      />
    </div>
  );
}
