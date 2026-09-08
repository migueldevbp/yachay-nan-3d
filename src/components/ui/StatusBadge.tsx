import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '@/utils/cx';

export type StatusKind = 'validated' | 'pending' | 'draft' | 'mock' | 'real';

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: StatusKind;
};

const STATUS_COPY: Record<StatusKind, { label: string; icon: string }> = {
  validated: { label: 'Validado', icon: '✓' },
  pending: { label: 'Por validar', icon: '!' },
  draft: { label: 'Borrador', icon: '✎' },
  mock: { label: 'Simulado', icon: '◇' },
  real: { label: 'Real', icon: '●' },
};

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge({ status, className, ...rest }, ref) {
    const copy = STATUS_COPY[status];

    return (
      <span
        ref={ref}
        className={cx(
          'ui-status-badge',
          `ui-status-badge--${status}`,
          className,
        )}
        {...rest}
      >
        <span className="ui-status-badge__icon" aria-hidden="true">
          {copy.icon}
        </span>
        <span className="ui-status-badge__text">{copy.label}</span>
      </span>
    );
  },
);
