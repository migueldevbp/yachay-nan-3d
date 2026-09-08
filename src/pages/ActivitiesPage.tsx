import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { PhaseNotice } from '@/components/ui/PhaseNotice';
import { useTranslation } from '@/i18n/useTranslation';

export function ActivitiesPage() {
  const { t } = useTranslation('activities');

  return (
    <>
      <Breadcrumbs />
      <PageHeader title={t('title')} />
      <EmptyState>
        <PhaseNotice phase="11" description={t('coming')} />
      </EmptyState>
    </>
  );
}
