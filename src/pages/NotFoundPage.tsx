import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routes';
import { PageHeader } from '@/components/ui/PageHeader';
import { useConfirmNavigation } from '@/hooks/useConfirmNavigation';
import { useTranslation } from '@/i18n/useTranslation';

export function NotFoundPage() {
  const { t } = useTranslation('errors');
  const { guardClick } = useConfirmNavigation();

  return (
    <>
      <PageHeader title={t('notFoundTitle')} lead={t('notFoundBody')} />
      <p>
        <Link to={ROUTE_PATHS.home} onClick={guardClick}>
          {t('notFoundAction')}
        </Link>
      </p>
    </>
  );
}
