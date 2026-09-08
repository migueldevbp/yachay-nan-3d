import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { cx } from '@/utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    const isDisabled = Boolean(disabled) || loading;

    return (
      <button
        ref={ref}
        type={type}
        className={cx(
          'ui-button',
          `ui-button--${variant}`,
          `ui-button--${size}`,
          className,
        )}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading ? (
          <>
            <span aria-hidden="true">{children}</span>
            <VisuallyHidden>Cargando</VisuallyHidden>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);
