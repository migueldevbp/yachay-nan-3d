import { BrailleString } from '@/components/braille/BrailleString';
import { describeDots } from '@/modules/braille';
import { useTranslation } from '@/i18n/useTranslation';

export interface BrailleTableRow {
  id: string;
  character: string;
  cells: number[][];
  unicode: string;
  category: 'letter' | 'accent' | 'number' | 'prefix';
}

interface BrailleTableProps {
  rows: BrailleTableRow[];
}

export function BrailleTable({ rows }: BrailleTableProps) {
  const { t } = useTranslation('braille');

  return (
    <div className="braille-table-wrap">
      <table className="braille-table">
        <caption>{t('tableCaption')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('colChar')}</th>
            <th scope="col">{t('colCell')}</th>
            <th scope="col">{t('colDots')}</th>
            <th scope="col">{t('colUnicode')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.character}</th>
              <td>
                <BrailleString cells={row.cells} size="sm" />
              </td>
              <td>
                {row.cells.map((cell) => describeDots(cell, 'es')).join('; ')}
              </td>
              <td>
                <span aria-hidden="true">{row.unicode}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
