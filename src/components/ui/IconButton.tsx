import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/utils/cx';

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
> & {
  'aria-label': string;
  children: ReactNode;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ className, type = 'button', children, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cx('ui-icon-button', className)}
        {...rest}
      >
        <span aria-hidden="true">{children}</span>
      </button>
    );
  },
);
