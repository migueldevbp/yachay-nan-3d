import { useEffect, useLayoutEffect, type MouseEvent } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { APP_PHASE, ROUTE_PATHS } from '@/app/routes';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher';
import { MainNav } from '@/components/navigation/MainNav';
import { AccessibilityButton } from '@/components/settings/AccessibilityButton';
import { Announcer } from '@/components/ui/Announcer';
import { CaptionBanner } from '@/components/ui/CaptionBanner';
import {
  ConfirmNavigationProvider,
  useConfirmNavigation,
} from '@/hooks/useConfirmNavigation';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';

export function AppLayout() {
  return (
    <ConfirmNavigationProvider>
      <AppShell />
    </ConfirmNavigationProvider>
  );
}

function AppShell() {
  const location = useLocation();
  const { t } = useTranslation('common');
  const { t: tNav } = useTranslation('navigation');
  const { say } = useAccessibility();
  const { guardClick } = useConfirmNavigation();

  useEffect(() => {
    document.title = t('brand');
  }, [t]);

  useLayoutEffect(() => {
    const heading = document.querySelector<HTMLElement>('#contenido h1');
    heading?.focus();
    const title = heading?.textContent?.trim();
    if (title) {
      say(title);
    }
  }, [location.pathname, say]);

  function handleSkipLink(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const main = document.getElementById('contenido');
    main?.focus();
  }

  return (
    <div className="app-shell min-h-screen bg-bg text-text">
      <a href="#contenido" className="skip-link" onClick={handleSkipLink}>
        {t('skipToContent')}
      </a>
      <header className="app-header">
        <Link to={ROUTE_PATHS.home} className="app-brand" onClick={guardClick}>
          {t('brand')}
        </Link>
        <div className="app-header__tools">
          <MainNav />
          <AccessibilityButton />
          <LanguageSwitcher />
        </div>
      </header>
      <main id="contenido" className="app-main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>
          {t('brand')} · {t('footerLine', { phase: APP_PHASE })}
        </p>
        <p className="app-footer__links">
          <Link to={ROUTE_PATHS.about} onClick={guardClick}>
            {tNav('about')}
          </Link>
          <Link to={ROUTE_PATHS.privacy} onClick={guardClick}>
            {tNav('privacy')}
          </Link>
        </p>
      </footer>
      <CaptionBanner />
      <Announcer />
    </div>
  );
}
