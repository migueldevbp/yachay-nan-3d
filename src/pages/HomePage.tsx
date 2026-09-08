import { APP_PHASE, ROUTE_PATHS } from '@/app/routes';
import { SectionCard } from '@/components/navigation/SectionCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from '@/i18n/useTranslation';

const PHASES = [
  { id: '01', key: 'phase01', done: true },
  { id: '02', key: 'phase02', done: true },
  { id: '03', key: 'phase03', done: true },
  { id: '04', key: 'phase04', done: true },
  { id: '05', key: 'phase05', done: false },
  { id: '06', key: 'phase06', done: false },
  { id: '07', key: 'phase07', done: false },
  { id: '08', key: 'phase08', done: false },
  { id: '09', key: 'phase09', done: false },
  { id: '10', key: 'phase10', done: false },
  { id: '11', key: 'phase11', done: false },
  { id: '12', key: 'phase12', done: false },
  { id: '13', key: 'phase13', done: false },
  { id: '14', key: 'phase14', done: false },
  { id: '15', key: 'phase15', done: false },
  { id: '16', key: 'phase16', done: false },
  { id: '17', key: 'phase17', done: false },
] as const;

const SECTIONS = [
  { to: ROUTE_PATHS.alphabet, titleKey: 'alphabet', cardKey: 'cardAlphabet' },
  { to: ROUTE_PATHS.numbers, titleKey: 'numbers', cardKey: 'cardNumbers' },
  { to: ROUTE_PATHS.braille, titleKey: 'braille', cardKey: 'cardBraille' },
  { to: ROUTE_PATHS.signs, titleKey: 'signs', cardKey: 'cardSigns' },
  { to: ROUTE_PATHS.camera, titleKey: 'camera', cardKey: 'cardCamera' },
  {
    to: ROUTE_PATHS.activities,
    titleKey: 'activities',
    cardKey: 'cardActivities',
  },
  { to: ROUTE_PATHS.words, titleKey: 'words', cardKey: 'cardWords' },
  { to: ROUTE_PATHS.progress, titleKey: 'progress', cardKey: 'cardProgress' },
] as const;

export function HomePage() {
  const { t } = useTranslation('home');
  const { t: tNav } = useTranslation('navigation');

  return (
    <>
      <PageHeader title={t('title')} lead={t('lead')}>
        <p className="phase-banner" role="status">
          {t('phase', { phase: APP_PHASE })}
        </p>
      </PageHeader>

      <section className="home-sections" aria-labelledby="home-sections-title">
        <h2 id="home-sections-title" className="home-section-title">
          {t('sectionsTitle')}
        </h2>
        <div className="section-card-grid">
          {SECTIONS.map((section) => (
            <SectionCard
              key={section.to}
              to={section.to}
              title={tNav(section.titleKey)}
              description={t(section.cardKey)}
            />
          ))}
        </div>
      </section>

      <section className="home-status" aria-labelledby="home-status-title">
        <h2 id="home-status-title" className="home-section-title">
          {t('statusTitle')}
        </h2>
        <ol className="home-status__list">
          {PHASES.map((phase) => (
            <li key={phase.id} className="home-status__item">
              <span>{t(phase.key)}</span>
              <span>{phase.done ? t('statusReady') : t('statusPending')}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
