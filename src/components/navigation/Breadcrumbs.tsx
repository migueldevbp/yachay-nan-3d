import { Link, useLocation } from 'react-router-dom';
import {
  BREADCRUMB_LABEL_KEY,
  ROUTE_PATHS,
  type RoutePath,
} from '@/app/routes';
import { useConfirmNavigation } from '@/hooks/useConfirmNavigation';
import { useTranslation } from '@/i18n/useTranslation';

export function Breadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const { t: tCommon } = useTranslation('common');
  const { guardClick } = useConfirmNavigation();
  const path = location.pathname as RoutePath;

  if (path === ROUTE_PATHS.home) {
    return null;
  }

  const key = BREADCRUMB_LABEL_KEY[path as Exclude<RoutePath, '/'>];
  if (!key) {
    return null;
  }

  return (
    <nav className="breadcrumbs" aria-label={tCommon('breadcrumbs')}>
      <ol className="breadcrumbs__list">
        <li>
          <Link to={ROUTE_PATHS.home} onClick={guardClick}>
            {tCommon('breadcrumbHome')}
          </Link>
        </li>
        <li aria-current="page">{t(key)}</li>
      </ol>
    </nav>
  );
}
