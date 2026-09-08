import { useMemo, useState } from 'react';
import { BrailleLegend } from '@/components/braille/BrailleLegend';
import {
  BrailleTable,
  type BrailleTableRow,
} from '@/components/braille/BrailleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Select } from '@/components/ui/Select';
import { charToBraille, expandSpec } from '@/modules/braille';
import { contentEngine } from '@/modules/content/ContentEngine';
import { renderBraille } from '@/utils/braille';
import { useTranslation } from '@/i18n/useTranslation';

const DOCS_URL =
  'https://github.com/migueldevbp/yachay-nan-3d/blob/main/docs/braille.md';

type CategoryFilter = 'all' | 'letter' | 'accent' | 'number' | 'prefix';

function buildRows(labels: {
  capital: string;
  number: string;
}): BrailleTableRow[] {
  const table = contentEngine.getBrailleTable();
  const glyphRows: BrailleTableRow[] = table.glyphs.map((glyph) => {
    const spec = {
      dots: glyph.dots,
      unicode: renderBraille({ dots: glyph.dots }),
      validation: glyph.validation,
    };
    const cells = expandSpec(spec).map((cell) => cell.dots);
    return {
      id: glyph.id,
      character:
        glyph.category === 'prefix'
          ? glyph.prefixKind === 'number'
            ? labels.number
            : labels.capital
          : glyph.character,
      cells,
      unicode: spec.unicode,
      category: glyph.category,
    };
  });

  const numberRows: BrailleTableRow[] = [];
  for (let digit = 0; digit <= 9; digit += 1) {
    const spec = charToBraille(String(digit));
    if (!spec) {
      continue;
    }
    const expanded = expandSpec(spec);
    numberRows.push({
      id: `number-${digit}`,
      character: String(digit),
      cells: expanded.map((cell) => cell.dots),
      unicode: spec.unicode,
      category: 'number',
    });
  }

  return [...glyphRows, ...numberRows];
}

export function BrailleReference() {
  const { t } = useTranslation('braille');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');
  const rows = useMemo(
    () =>
      buildRows({
        capital: t('signCapital'),
        number: t('signNumber'),
      }),
    [t],
  );

  const visible = rows.filter((row) => {
    if (category !== 'all' && row.category !== category) {
      return false;
    }
    if (!query.trim()) {
      return true;
    }
    return row.character.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <div className="braille-reference">
      <div className="braille-reference__status">
        <StatusBadge status="pending" />
        <p>{t('validationNote')}</p>
        <p>
          <a href={DOCS_URL} rel="noreferrer">
            {t('validationLink')}
          </a>
        </p>
      </div>

      <BrailleLegend />

      <div className="braille-reference__tools">
        <Select<CategoryFilter>
          label={t('filterCategory')}
          value={category}
          onChange={setCategory}
          options={[
            { value: 'all', label: t('filterAll') },
            { value: 'letter', label: t('filterLetters') },
            { value: 'accent', label: t('filterAccents') },
            { value: 'number', label: t('filterNumbers') },
            { value: 'prefix', label: t('filterSigns') },
          ]}
        />
        <div className="ui-select">
          <label htmlFor="braille-search" className="ui-select__label">
            {t('searchLabel')}
          </label>
          <input
            id="braille-search"
            className="ui-select__control"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <BrailleTable rows={visible} />
    </div>
  );
}
