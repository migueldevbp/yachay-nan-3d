import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cx } from '@/utils/cx';

export type SliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value'
> & {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  description?: string;
  valueText?: string;
};

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    label,
    value,
    min,
    max,
    step,
    onChange,
    description,
    valueText,
    className,
    id,
    disabled,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descriptionId = description ? `${inputId}-help` : undefined;
  const valueId = `${inputId}-value`;

  function snap(next: number): number {
    const clamped = Math.min(max, Math.max(min, next));
    const steps = Math.round((clamped - min) / step);
    return Number((min + steps * step).toFixed(4));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Home') {
      event.preventDefault();
      onChange(min);
    } else if (event.key === 'End') {
      event.preventDefault();
      onChange(max);
    }
  }

  return (
    <div className={cx('ui-slider', className)}>
      <div className="ui-slider__header">
        <label htmlFor={inputId} className="ui-slider__label">
          {label}
        </label>
        <span id={valueId} className="ui-slider__value">
          {valueText ?? String(value)}
        </span>
      </div>
      {description ? (
        <p id={descriptionId} className="ui-field-help">
          {description}
        </p>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        type="range"
        className="ui-slider__input"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText ?? String(value)}
        aria-describedby={[descriptionId, valueId].filter(Boolean).join(' ')}
        onChange={(event) => onChange(snap(Number(event.target.value)))}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    </div>
  );
});
