import { useMemo, useState } from 'react';
import { BrailleString } from '@/components/braille/BrailleString';
import { Button } from '@/components/ui/Button';
import { contentEngine } from '@/modules/content/ContentEngine';
import { describeCharacter, expandSpec } from '@/modules/braille';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';
import { cx } from '@/utils/cx';
import type { EducationalResource } from '@/types/content';

function explorerItems(): EducationalResource[] {
  const letters = contentEngine
    .getSequence('letter')
    .filter((item) => item.caseForm === 'uppercase');
  const numbers = contentEngine.getSequence('number');
  return [...letters, ...numbers];
}

export function BrailleExplorer() {
  const items = useMemo(() => explorerItems(), []);
  const [index, setIndex] = useState(0);
  const { t } = useTranslation('braille');
  const { preferences, say } = useAccessibility();
  const calm = preferences.density === 'calm';
  const current = items[index];

  if (!current) {
    return null;
  }

  const localized = current.i18n.es;
  const instruction =
    preferences.instructionLength === 'short'
      ? localized?.instructionShort
      : localized?.instruction;
  const association = current.associations[0];
  const description = describeCharacter(current.character, 'es');
  const cells = expandSpec(current.braille);

  function select(next: number) {
    const item = items[next];
    if (!item) {
      return;
    }
    setIndex(next);
    say(describeCharacter(item.character, 'es'));
  }

  const detail = (
    <div className="braille-explorer__detail">
      <p className="braille-explorer__glyph" aria-hidden="true">
        {current.character}
      </p>
      <BrailleString spec={current.braille} size="xl" showDotNumbers={!calm} />
      <p>{description}</p>
      {instruction ? <p>{instruction}</p> : null}
      {association ? (
        <p>{t('associatedWord', { word: association.word })}</p>
      ) : null}
      {current.media.imageUrl && current.media.imageAlt ? (
        <img src={current.media.imageUrl} alt={current.media.imageAlt} />
      ) : (
        <p className="ui-field-help">{t('noImage')}</p>
      )}
      <Button
        onClick={() => say(description)}
        aria-describedby="braille-listen-hint"
      >
        {t('listen')}
      </Button>
      <p id="braille-listen-hint" className="ui-field-help">
        {t('listenHint')}
      </p>
      <p className="ui-field-help">
        {t('unicodeText', {
          value: cells.map((cell) => cell.unicode).join(' '),
        })}
      </p>
    </div>
  );

  if (calm) {
    return (
      <div className="braille-explorer braille-explorer--calm">
        {detail}
        <div className="braille-explorer__pager">
          <Button
            size="lg"
            variant="secondary"
            onClick={() => select(Math.max(0, index - 1))}
            disabled={index === 0}
          >
            {t('previous')}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => select(Math.min(items.length - 1, index + 1))}
            disabled={index === items.length - 1}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="braille-explorer">
      <div className="braille-explorer__grid" role="listbox" aria-label={t('explorerList')}>
        {items.map((item, itemIndex) => (
          <button
            key={item.id}
            id={item.id}
            type="button"
            role="option"
            aria-selected={itemIndex === index}
            className={cx(
              'braille-explorer__option',
              itemIndex === index && 'braille-explorer__option--active',
            )}
            onClick={() => select(itemIndex)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                select(Math.min(items.length - 1, index + 1));
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                select(Math.max(0, index - 1));
              } else if (event.key === 'Home') {
                event.preventDefault();
                select(0);
              } else if (event.key === 'End') {
                event.preventDefault();
                select(items.length - 1);
              }
            }}
          >
            {item.character}
          </button>
        ))}
      </div>
      {detail}
    </div>
  );
}
