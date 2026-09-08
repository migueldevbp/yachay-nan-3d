import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from '@/i18n/useTranslation';

export function PrivacyPage() {
  const { t } = useTranslation('privacy');

  return (
    <>
      <Breadcrumbs />
      <PageHeader title={t('title')} lead={t('intro')} />
      <section className="prose-section" aria-labelledby="privacy-camera">
        <h2 id="privacy-camera">{t('cameraTitle')}</h2>
        <p>{t('cameraBody')}</p>
      </section>
      <section className="prose-section" aria-labelledby="privacy-progress">
        <h2 id="privacy-progress">{t('progressTitle')}</h2>
        <p>{t('progressBody')}</p>
      </section>
      <section className="prose-section" aria-labelledby="privacy-personal">
        <h2 id="privacy-personal">{t('personalTitle')}</h2>
        <p>{t('personalBody')}</p>
      </section>
      <section className="prose-section" aria-labelledby="privacy-prefs">
        <h2 id="privacy-prefs">{t('prefsTitle')}</h2>
        <p>{t('prefsBody')}</p>
      </section>
    </>
  );
}
