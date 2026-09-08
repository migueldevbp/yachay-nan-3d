import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type DialogHTMLAttributes,
  type ReactNode,
} from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { IconButton } from '@/components/ui/IconButton';
import { cx } from '@/utils/cx';

export type DialogProps = Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'open' | 'title'
> & {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  function Dialog({ open, onClose, title, children, className, ...rest }, ref) {
    const innerRef = useRef<HTMLDialogElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const titleId = useId();
    const wasOpen = useRef(false);

    useImperativeHandle(ref, () => innerRef.current as HTMLDialogElement);

    useLayoutEffect(() => {
      const node = innerRef.current;
      if (!node) {
        return;
      }

      if (open) {
        if (
          !wasOpen.current &&
          document.activeElement instanceof HTMLElement &&
          !node.contains(document.activeElement)
        ) {
          triggerRef.current = document.activeElement;
        }
        wasOpen.current = true;
        if (!node.open) {
          try {
            node.showModal();
          } catch {
            node.setAttribute('open', '');
          }
        }
        document.body.style.overflow = 'hidden';
        return;
      }

      if (wasOpen.current) {
        if (node.open || node.hasAttribute('open')) {
          try {
            node.close();
          } catch {
            node.removeAttribute('open');
          }
        }
        document.body.style.overflow = '';
        const trigger = triggerRef.current;
        wasOpen.current = false;
        queueMicrotask(() => {
          trigger?.focus();
        });
      }
    }, [open]);

    useFocusTrap(innerRef, open);

    useEffect(() => {
      const node = innerRef.current;
      if (!node) {
        return;
      }

      function handleCancel(event: Event) {
        event.preventDefault();
        onClose();
      }

      node.addEventListener('cancel', handleCancel);
      return () => {
        node.removeEventListener('cancel', handleCancel);
        document.body.style.overflow = '';
      };
    }, [onClose]);

    useEffect(() => {
      if (!open) {
        return;
      }

      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
        }
      }

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, onClose]);

    return (
      <dialog
        ref={innerRef}
        className={cx('ui-dialog', className)}
        aria-modal="true"
        aria-labelledby={titleId}
        {...rest}
      >
        <div className="ui-dialog__header">
          <h2 id={titleId} className="ui-dialog__title">
            {title}
          </h2>
          <IconButton aria-label="Cerrar" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="ui-dialog__body">{children}</div>
      </dialog>
    );
  },
);

function CloseIcon() {
  return (
    <svg width="1.25em" height="1.25em" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.3 5.71 12 12.01l-6.3-6.3-1.4 1.42 6.29 6.29-6.3 6.3 1.42 1.4 6.29-6.29 6.3 6.3 1.4-1.42-6.29-6.29 6.3-6.3z"
      />
    </svg>
  );
}
