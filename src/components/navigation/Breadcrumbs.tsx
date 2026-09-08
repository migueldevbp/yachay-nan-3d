import { Link, useLocation } from 'react-router-dom';
import {
  BREADCRUMB_LABEL_KEY,
  ROUTE_PATHS,
  type RoutePath,
} from '@/app/routes';
import { useConfirmNavigation } from '@/hooks/useConfirmNavigation';
import { useTranslation } from '@/i18n/useTranslation';
import {
  getResourceByParam,
  resourceDisplayName,
} from '@/modules/content/resourceId';

export function Breadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const { t: tCommon } = useTranslation('common');
  const { language } = useTranslation('alphabet');
  const { guardClick } = useConfirmNavigation();
  const path = location.pathname as RoutePath;

  if (path === ROUTE_PATHS.home) {
    return null;
  }

  const resourceMatch = location.pathname.match(/^\/recurso\/([^/]+)$/);
  if (resourceMatch?.[1]) {
    const resource = getResourceByParam(resourceMatch[1]);
    const parent =
      resource?.type === 'number' ? ROUTE_PATHS.numbers : ROUTE_PATHS.alphabet;
    const parentKey = resource?.type === 'number' ? 'numbers' : 'alphabet';
    const current = resource
      ? resourceDisplayName(resource, language)
      : resourceMatch[1];

    return (
      <nav className="breadcrumbs" aria-label={tCommon('breadcrumbs')}>
        <ol className="breadcrumbs__list">
          <li>
            <Link to={ROUTE_PATHS.home} onClick={guardClick}>
              {tCommon('breadcrumbHome')}
            </Link>
          </li>
          <li>
            <Link to={parent} onClick={guardClick}>
              {t(parentKey)}
            </Link>
          </li>
          <li aria-current="page">{current}</li>
        </ol>
      </nav>
    );
  }

  const key = BREADCRUMB_LABEL_KEY[path as Exclude<RoutePath, '/'>];
  if (!key) {
    return null;
  }

  const writing = path === ROUTE_PATHS.brailleWriting;

  return (
    <nav className="breadcrumbs" aria-label={tCommon('breadcrumbs')}>
      <ol className="breadcrumbs__list">
        <li>
          <Link to={ROUTE_PATHS.home} onClick={guardClick}>
            {tCommon('breadcrumbHome')}
          </Link>
        </li>
        {writing ? (
          <li>
            <Link to={ROUTE_PATHS.braille} onClick={guardClick}>
              {t('braille')}
            </Link>
          </li>
        ) : null}
        <li aria-current="page">{t(key)}</li>
      </ol>
    </nav>
  );
}
