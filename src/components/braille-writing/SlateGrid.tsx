import { brailleToChar, describeDots } from '@/modules/braille';
import {
  describeWritingPositions,
  toReadingDots,
  type SlateState,
  type VoiceT,
} from '@/modules/braille-writing';
import { SlateCell } from '@/components/braille-writing/SlateCell';
import { useTranslation } from '@/i18n/useTranslation';
import { cx } from '@/utils/cx';

interface SlateGridProps {
  state: SlateState;
}

export function SlateGrid({ state }: SlateGridProps) {
  const { t } = useTranslation('braille');
  const tVoice: VoiceT = (key, vars) =>
    t(key as Parameters<typeof t>[0], vars);
  const cellNumbers = Array.from({ length: state.cellsPerLine }, (_, i) => i);

  return (
    <div className="slate-grid-wrap">
      <table className="slate-grid">
        <caption>{t('slateCaption')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('slateLine', { n: '' }).trim()}</th>
            {[...cellNumbers].reverse().map((cell) => (
              <th key={cell} scope="col">
                {t('slateCellHeader', { n: cell + 1 })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: state.lines }, (_, line) => (
            <tr key={line}>
              <th scope="row">{t('slateLine', { n: line + 1 })}</th>
              {[...cellNumbers].reverse().map((cell) => {
                const writing = state.cells.get(`${line}:${cell}`) ?? [];
                const reading = toReadingDots(writing);
                const letter = brailleToChar(reading) ?? '';
                const isCursor =
                  state.cursor.line === line && state.cursor.cell === cell;
                const label = isCursor
                  ? t('slateCellCursor', {
                      cell: cell + 1,
                      line: line + 1,
                      writing: describeWritingPositions(writing, tVoice),
                    })
                  : writing.length === 0
                    ? t('slateCellEmpty', { cell: cell + 1, line: line + 1 })
                    : t('slateCellFilled', {
                        cell: cell + 1,
                        line: line + 1,
                        letter,
                        reading: describeDots(reading, 'es'),
                      });
                return (
                  <td
                    key={cell}
                    className={cx(isCursor && 'slate-grid__cell--cursor')}
                    aria-current={isCursor ? 'true' : undefined}
                  >
                    <SlateCell
                      writingDots={writing}
                      size="sm"
                      showDotNumbers={false}
                      label={label}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
