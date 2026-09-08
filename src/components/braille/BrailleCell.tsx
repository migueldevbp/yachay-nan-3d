import { useMemo, type KeyboardEvent } from 'react';
import { describeDots } from '@/modules/braille';
import { useTranslation } from '@/i18n/useTranslation';
import { cx } from '@/utils/cx';

export type BrailleCellSize = 'sm' | 'md' | 'lg' | 'xl';

export interface BrailleCellProps {
  dots: number[];
  size?: BrailleCellSize;
  showDotNumbers?: boolean;
  showEmptyDots?: boolean;
  interactive?: boolean;
  onDotsChange?: (dots: number[]) => void;
  onConfirm?: () => void;
  label?: string;
  highlight?: number[];
}

const DOT_ORDER = [1, 2, 3, 4, 5, 6] as const;

const POSITIONS: Record<(typeof DOT_ORDER)[number], { x: number; y: number }> =
  {
    1: { x: 22, y: 22 },
    2: { x: 22, y: 50 },
    3: { x: 22, y: 78 },
    4: { x: 50, y: 22 },
    5: { x: 50, y: 50 },
    6: { x: 50, y: 78 },
  };

function normalize(dots: number[]): number[] {
  return [...new Set(dots.filter((dot) => dot >= 1 && dot <= 6))].sort(
    (a, b) => a - b,
  );
}

function toggleDot(dots: number[], point: number): number[] {
  const set = new Set(dots);
  if (set.has(point)) {
    set.delete(point);
  } else {
    set.add(point);
  }
  return normalize([...set]);
}

export function BrailleCell({
  dots,
  size = 'md',
  showDotNumbers = false,
  showEmptyDots = true,
  interactive = false,
  onDotsChange,
  onConfirm,
  label,
  highlight = [],
}: BrailleCellProps) {
  const { t } = useTranslation('braille');
  const active = useMemo(() => new Set(normalize(dots)), [dots]);
  const highlighted = useMemo(() => new Set(highlight), [highlight]);
  const accessibleName = label?.trim() || describeDots(normalize(dots), 'es');

  function handleButtonKey(
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    if (!interactive) {
      return;
    }
    if (event.key >= '1' && event.key <= '6') {
      event.preventDefault();
      onDotsChange?.(toggleDot(dots, Number(event.key)));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      onConfirm?.();
    }
  }

  if (interactive) {
    return (
      <div
        className={cx(
          'braille-cell',
          'braille-cell--interactive',
          `braille-cell--${size}`,
        )}
        role="group"
        aria-label={accessibleName}
      >
        {DOT_ORDER.map((point) => {
          const on = active.has(point);
          if (!on && !showEmptyDots) {
            return null;
          }
          const pos = POSITIONS[point];
          return (
            <button
              key={point}
              type="button"
              className={cx(
                'braille-cell__dot-button',
                on && 'braille-cell__dot-button--on',
                highlighted.has(point) && 'braille-cell__dot-button--highlight',
              )}
              aria-pressed={on}
              aria-label={t('dotButton', { n: point })}
              onClick={() => onDotsChange?.(toggleDot(dots, point))}
              onKeyDown={handleButtonKey}
              style={{
                left: `${(pos.x / 72) * 100}%`,
                top: `${(pos.y / 100) * 100}%`,
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle
                  className={cx(
                    'braille-cell__circle',
                    on
                      ? 'braille-cell__circle--on'
                      : 'braille-cell__circle--off',
                  )}
                  cx="12"
                  cy="12"
                  r="8"
                />
                {showDotNumbers ? (
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    className="braille-cell__num"
                  >
                    {point}
                  </text>
                ) : null}
              </svg>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <svg
      className={cx('braille-cell', `braille-cell--${size}`)}
      viewBox="0 0 72 100"
      role="img"
      aria-label={accessibleName}
    >
      <rect
        className="braille-cell__frame"
        x="4"
        y="4"
        width="64"
        height="92"
        rx="8"
      />
      {DOT_ORDER.map((point) => {
        const on = active.has(point);
        if (!on && !showEmptyDots) {
          return null;
        }
        const pos = POSITIONS[point];
        return (
          <g key={point}>
            <circle
              className={cx(
                'braille-cell__circle',
                on ? 'braille-cell__circle--on' : 'braille-cell__circle--off',
                highlighted.has(point) && 'braille-cell__circle--highlight',
              )}
              cx={pos.x}
              cy={pos.y}
              r="10"
            />
            {showDotNumbers ? (
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                className="braille-cell__num"
                aria-hidden="true"
              >
                {point}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
