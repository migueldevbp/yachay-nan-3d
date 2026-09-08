import {
  forwardRef,
  useId,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type Ref,
} from 'react';
import { cx } from '@/utils/cx';

export interface RadioOption<T extends string | number> {
  value: T;
  label: string;
  description?: string;
}

export type RadioGroupProps<T extends string | number> = Omit<
  HTMLAttributes<HTMLFieldSetElement>,
  'onChange'
> & {
  legend: string;
  name: string;
  value: T;
  options: Array<RadioOption<T>>;
  onChange: (value: T) => void;
  description?: string;
};

function RadioGroupInner<T extends string | number>(
  {
    legend,
    name,
    value,
    options,
    onChange,
    description,
    className,
    ...rest
  }: RadioGroupProps<T>,
  ref: ForwardedRef<HTMLFieldSetElement>,
) {
  const helpId = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const index = options.findIndex((option) => option.value === value);
    if (index < 0 || options.length === 0) {
      return;
    }

    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      nextIndex = (index + 1) % options.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      nextIndex = (index - 1 + options.length) % options.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = options.length - 1;
    } else {
      return;
    }

    const next = options[nextIndex];
    if (next) {
      onChange(next.value);
      const nextId = `${name}-${String(next.value)}`;
      document.getElementById(nextId)?.focus();
    }
  }

  return (
    <fieldset
      ref={ref}
      className={cx('ui-radio-group', className)}
      aria-describedby={description ? helpId : undefined}
      {...rest}
    >
      <legend className="ui-radio-group__legend">{legend}</legend>
      {description ? (
        <p id={helpId} className="ui-field-help">
          {description}
        </p>
      ) : null}
      <div className="ui-radio-group__options" role="presentation">
        {options.map((option) => {
          const optionId = `${name}-${String(option.value)}`;
          const selected = option.value === value;
          return (
            <label key={optionId} className="ui-radio" htmlFor={optionId}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={String(option.value)}
                checked={selected}
                onChange={() => onChange(option.value)}
                onKeyDown={handleKeyDown}
              />
              <span className="ui-radio__mark" aria-hidden="true" />
              <span className="ui-radio__text">
                <span className="ui-radio__label">{option.label}</span>
                {option.description ? (
                  <span className="ui-radio__help">{option.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export const RadioGroup = forwardRef(RadioGroupInner) as <
  T extends string | number,
>(
  props: RadioGroupProps<T> & { ref?: Ref<HTMLFieldSetElement> },
) => ReturnType<typeof RadioGroupInner>;
