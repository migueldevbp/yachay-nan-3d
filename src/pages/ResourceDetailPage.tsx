import { useCallback, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routes';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { ResourceCard } from '@/components/resource/ResourceCard';
import { ResourceNavigator } from '@/components/resource/ResourceNavigator';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from '@/i18n/useTranslation';
import { contentEngine } from '@/modules/content';
import {
  getResourceByParam,
  resourceDisplayName,
  resourcePath,
} from '@/modules/content/resourceId';

export function ResourceDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { t, language } = useTranslation('alphabet');
  const resource = getResourceByParam(id);

  const siblings = useMemo(() => {
    if (!resource) {
      return [];
    }
    return contentEngine
      .getSequence(resource.type)
      .filter((item) => item.caseForm === resource.caseForm);
  }, [resource]);

  const index = resource
    ? siblings.findIndex((item) => item.id === resource.id)
    : -1;
  const previous = index > 0 ? siblings[index - 1] : undefined;
  const next =
    index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined;

  const goPrevious = useCallback(() => {
    if (previous) {
      navigate(resourcePath(previous.id));
    }
  }, [navigate, previous]);

  const goNext = useCallback(() => {
    if (next) {
      navigate(resourcePath(next.id));
    }
  }, [navigate, next]);

  if (!resource) {
    return (
      <>
        <Breadcrumbs />
        <PageHeader title={t('notFoundTitle')} lead={t('notFoundBody')} />
        <p>
          <Link to={ROUTE_PATHS.alphabet}>{t('backToList')}</Link>
        </p>
      </>
    );
  }

  const related = contentEngine.getRelated(resource.id);
  const practiceItems = [resource, ...related];
  const name = resourceDisplayName(resource, language);

  return (
    <>
      <Breadcrumbs />
      <PageHeader title={name} lead={t('detailLead')} />
      <ResourceCard resource={resource} variant="detailed" autoAnnounce />
      <ResourceNavigator
        previous={previous}
        next={next}
        onPrevious={goPrevious}
        onNext={goNext}
      />
      <section className="resource-practice" aria-labelledby="practice-title">
        <h2 id="practice-title" className="resource-practice__title">
          {t('practiceTitle')}
        </h2>
        <p>{t('practiceLead')}</p>
        <ul className="resource-practice__list">
          {practiceItems.map((item) => (
            <li key={item.id}>
              <Link
                to={`${ROUTE_PATHS.activities}?recurso=${item.id}`}
              >
                {t('practiceItem', {
                  name: resourceDisplayName(item, language),
                })}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
