import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '@/utils/cx';

export type CardProps = HTMLAttributes<HTMLElement>;

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { className, ...rest },
  ref,
) {
  return <article ref={ref} className={cx('ui-card', className)} {...rest} />;
});
