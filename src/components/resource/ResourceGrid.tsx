import { useRef, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { ResourceCard } from '@/components/resource/ResourceCard';
import {
  resourceDisplayName,
  resourcePath,
} from '@/modules/content/resourceId';
import type { EducationalResource } from '@/types/content';
import { useTranslation } from '@/i18n/useTranslation';
import { cx } from '@/utils/cx';

interface ResourceGridProps {
  items: EducationalResource[];
  label: string;
  calm: boolean;
  focusedIndex: number;
  onFocusChange: (index: number) => void;
}

export const GRID_COLUMNS = 4;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

export function ResourceGrid({
  items,
  label,
  calm,
  focusedIndex,
  onFocusChange,
}: ResourceGridProps) {
  const { t, language } = useTranslation('alphabet');
  const cellRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  function focusAt(index: number) {
    const next = Math.min(items.length - 1, Math.max(0, index));
    onFocusChange(next);
    cellRefs.current[next]?.focus();
  }

  function handleKey(event: KeyboardEvent<HTMLAnchorElement>) {
    if (items.length === 0) {
      return;
    }
    const columns = calm ? 1 : GRID_COLUMNS;
    if (event.key === 'ArrowRight' || (calm && event.key === 'ArrowDown')) {
      event.preventDefault();
      focusAt(focusedIndex + 1);
    } else if (event.key === 'ArrowLeft' || (calm && event.key === 'ArrowUp')) {
      event.preventDefault();
      focusAt(focusedIndex - 1);
    } else if (!calm && event.key === 'ArrowDown') {
      event.preventDefault();
      focusAt(focusedIndex + columns);
    } else if (!calm && event.key === 'ArrowUp') {
      event.preventDefault();
      focusAt(focusedIndex - columns);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusAt(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusAt(items.length - 1);
    }
  }

  function linkLabel(item: EducationalResource): string {
    const name = resourceDisplayName(item, language);
    return item.vision.hasPhysicalPiece
      ? t('cardLabelWithPiece', { name })
      : name;
  }

  if (calm) {
    return (
      <ul className="resource-list" aria-label={label}>
        {items.map((item, index) => (
          <li key={item.id}>
            <Link
              ref={(node) => {
                cellRefs.current[index] = node;
              }}
              to={resourcePath(item.id)}
              className="resource-list__link"
              tabIndex={index === focusedIndex ? 0 : -1}
              aria-label={linkLabel(item)}
              onFocus={() => onFocusChange(index)}
              onKeyDown={handleKey}
            >
              <ResourceCard resource={item} variant="compact" />
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  const rows = chunk(items, GRID_COLUMNS);

  return (
    <div
      className="resource-grid"
      role="grid"
      aria-label={label}
      aria-rowcount={rows.length}
      aria-colcount={GRID_COLUMNS}
      tabIndex={-1}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={row[0]?.id ?? rowIndex}
          role="row"
          className="resource-grid__row"
          aria-rowindex={rowIndex + 1}
        >
          {row.map((item, columnIndex) => {
            const index = rowIndex * GRID_COLUMNS + columnIndex;
            return (
              <div
                key={item.id}
                role="gridcell"
                aria-colindex={columnIndex + 1}
                className={cx(
                  'resource-grid__cell',
                  index === focusedIndex && 'resource-grid__cell--focused',
                )}
              >
                <Link
                  ref={(node) => {
                    cellRefs.current[index] = node;
                  }}
                  to={resourcePath(item.id)}
                  className="resource-grid__link"
                  tabIndex={index === focusedIndex ? 0 : -1}
                  aria-label={linkLabel(item)}
                  onFocus={() => onFocusChange(index)}
                  onKeyDown={handleKey}
                >
                  <ResourceCard resource={item} variant="compact" />
                </Link>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
