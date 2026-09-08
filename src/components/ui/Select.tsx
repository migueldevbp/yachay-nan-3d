import {
  forwardRef,
  useId,
  type ForwardedRef,
  type Ref,
  type SelectHTMLAttributes,
} from 'react';
import { cx } from '@/utils/cx';

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

export type SelectProps<T extends string | number> = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'onChange' | 'value'
> & {
  label: string;
  value: T;
  options: Array<SelectOption<T>>;
  onChange: (value: T) => void;
  description?: string;
};

function SelectInner<T extends string | number>(
  {
    label,
    value,
    options,
    onChange,
    description,
    className,
    id,
    ...rest
  }: SelectProps<T>,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const descriptionId = description ? `${selectId}-help` : undefined;

  return (
    <div className={cx('ui-select', className)}>
      <label htmlFor={selectId} className="ui-select__label">
        {label}
      </label>
      {description ? (
        <p id={descriptionId} className="ui-field-help">
          {description}
        </p>
      ) : null}
      <select
        ref={ref}
        id={selectId}
        className="ui-select__control"
        value={String(value)}
        aria-describedby={descriptionId}
        onChange={(event) => {
          const match = options.find(
            (option) => String(option.value) === event.target.value,
          );
          if (match) {
            onChange(match.value);
          }
        }}
        {...rest}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export const Select = forwardRef(SelectInner) as <T extends string | number>(
  props: SelectProps<T> & { ref?: Ref<HTMLSelectElement> },
) => ReturnType<typeof SelectInner>;
