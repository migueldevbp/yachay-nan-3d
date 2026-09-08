import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '@/utils/cx';

export type VisuallyHiddenProps = HTMLAttributes<HTMLSpanElement>;

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={cx('ui-visually-hidden', className)}
        {...rest}
      />
    );
  },
);
