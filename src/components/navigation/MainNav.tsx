import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/app/routes';
import { Button } from '@/components/ui/Button';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useConfirmNavigation } from '@/hooks/useConfirmNavigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';
import { cx } from '@/utils/cx';

const COMPACT_QUERY = '(max-width: 48rem)';

export function MainNav() {
  const { t } = useTranslation('navigation');
  const { t: tCommon } = useTranslation('common');
  const { preferences } = useAccessibility();
  const { guardClick } = useConfirmNavigation();
  const compact = useMediaQuery(COMPACT_QUERY);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const panelId = useId();
  const calm = preferences.density === 'calm';
  const items = calm ? NAV_ITEMS.filter((item) => item.essential) : NAV_ITEMS;

  useFocusTrap(panelRef, compact && open);

  useEffect(() => {
    if (!compact) {
      setOpen(false);
    }
  }, [compact]);

  useEffect(() => {
    if (!compact || !open) {
      return;
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [compact, open]);

  function handleArrowNav(event: ReactKeyboardEvent<HTMLAnchorElement>) {
    const keys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ];
    if (!keys.includes(event.key)) {
      return;
    }

    const links = Array.from(
      listRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [],
    );
    if (links.length === 0) {
      return;
    }

    const currentIndex = links.findIndex(
      (link) => link === document.activeElement,
    );
    let nextIndex = currentIndex < 0 ? 0 : currentIndex;

    if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = links.length - 1;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % links.length;
    } else {
      nextIndex = (currentIndex - 1 + links.length) % links.length;
    }

    event.preventDefault();
    links[nextIndex]?.focus();
  }

  const list = (
    <ul ref={listRef} className="main-nav__list">
      {items.map((item) => (
        <li key={item.to} className="main-nav__item">
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              cx('main-nav__link', isActive && 'main-nav__link--active')
            }
            onKeyDown={handleArrowNav}
            onClick={(event) => {
              guardClick(event);
              if (!event.defaultPrevented) {
                setOpen(false);
              }
            }}
          >
            {t(item.key)}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  if (!compact) {
    return (
      <nav className="main-nav" aria-label={tCommon('mainNav')}>
        {list}
      </nav>
    );
  }

  return (
    <div className="main-nav main-nav--compact">
      <Button
        ref={triggerRef}
        variant="secondary"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? tCommon('closeMenu') : tCommon('openMenu')}
      </Button>
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          className="main-nav__panel"
          role="dialog"
          aria-label={tCommon('mainNav')}
        >
          <nav aria-label={tCommon('mainNav')}>{list}</nav>
        </div>
      ) : null}
    </div>
  );
}
