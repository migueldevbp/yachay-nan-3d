import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { PhaseNotice } from '@/components/ui/PhaseNotice';
import { useTranslation } from '@/i18n/useTranslation';

export function ProgressPage() {
  const { t } = useTranslation('progress');

  return (
    <>
      <Breadcrumbs />
      <PageHeader title={t('title')} />
      <EmptyState>
        <PhaseNotice phase="14" description={t('coming')} />
      </EmptyState>
    </>
  );
}
