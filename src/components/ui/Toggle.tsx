import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cx } from '@/utils/cx';

export type ToggleProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'size'
> & {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, checked, onChange, description, className, id, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descriptionId = description ? `${inputId}-help` : undefined;

  return (
    <div className={cx('ui-toggle', className)}>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        className="ui-toggle__input"
        checked={checked}
        disabled={disabled}
        aria-describedby={descriptionId}
        onChange={(event) => onChange(event.target.checked)}
        {...rest}
      />
      <label htmlFor={inputId} className="ui-toggle__label">
        <span className="ui-toggle__track" aria-hidden="true">
          <span className="ui-toggle__thumb" />
        </span>
        <span className="ui-toggle__text">
          <span className="ui-toggle__title">{label}</span>
          {description ? (
            <span id={descriptionId} className="ui-toggle__help">
              {description}
            </span>
          ) : null}
        </span>
      </label>
    </div>
  );
});
