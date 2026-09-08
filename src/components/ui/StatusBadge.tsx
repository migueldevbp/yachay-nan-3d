import { forwardRef, type HTMLAttributes } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { cx } from '@/utils/cx';

export type StatusKind = 'validated' | 'pending' | 'draft' | 'mock' | 'real';

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: StatusKind;
};

const STATUS_META: Record<
  StatusKind,
  {
    key:
      | 'statusValidated'
      | 'statusPending'
      | 'statusDraft'
      | 'statusMock'
      | 'statusReal';
    icon: string;
  }
> = {
  validated: { key: 'statusValidated', icon: '✓' },
  pending: { key: 'statusPending', icon: '!' },
  draft: { key: 'statusDraft', icon: '✎' },
  mock: { key: 'statusMock', icon: '◇' },
  real: { key: 'statusReal', icon: '●' },
};

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge({ status, className, ...rest }, ref) {
    const { t } = useTranslation('common');
    const meta = STATUS_META[status];

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
          {meta.icon}
        </span>
        <span className="ui-status-badge__text">{t(meta.key)}</span>
      </span>
    );
  },
);
