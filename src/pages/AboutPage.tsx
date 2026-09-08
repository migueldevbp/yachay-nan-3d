import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from '@/i18n/useTranslation';

const REPOSITORY_URL = 'https://github.com/migueldevbp/yachay-nan-3d';

export function AboutPage() {
  const { t } = useTranslation('about');

  return (
    <>
      <Breadcrumbs />
      <PageHeader title={t('title')} lead={t('nameMeaning')} />
      <section className="prose-section" aria-labelledby="about-principle">
        <h2 id="about-principle">{t('principleTitle')}</h2>
        <p>{t('principleBody')}</p>
      </section>
      <section className="prose-section" aria-labelledby="about-repo">
        <h2 id="about-repo">{t('repoTitle')}</h2>
        <p>{t('repoBody')}</p>
        <p>
          <a href={REPOSITORY_URL} rel="noreferrer">
            {t('repoLabel')}
          </a>
        </p>
      </section>
    </>
  );
}
