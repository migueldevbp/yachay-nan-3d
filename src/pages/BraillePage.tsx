import { useState } from 'react';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PageHeader } from '@/components/ui/PageHeader';
import { BrailleExplorer } from '@/pages/braille/BrailleExplorer';
import { BrailleReference } from '@/pages/braille/BrailleReference';
import { BraillePractice } from '@/pages/braille/BraillePractice';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';
import { cx } from '@/utils/cx';

type BrailleTab = 'explorer' | 'reference' | 'practice';

export function BraillePage() {
  const { t } = useTranslation('braille');
  const { say } = useAccessibility();
  const [tab, setTab] = useState<BrailleTab>('explorer');

  const tabs: Array<{ id: BrailleTab; label: string }> = [
    { id: 'explorer', label: t('tabExplorer') },
    { id: 'reference', label: t('tabReference') },
    { id: 'practice', label: t('tabPractice') },
  ];

  function selectTab(next: BrailleTab) {
    setTab(next);
    const label = tabs.find((item) => item.id === next)?.label;
    if (label) {
      say(label);
    }
  }

  return (
    <>
      <Breadcrumbs />
      <PageHeader title={t('title')} />
      <div className="braille-tabs" role="tablist" aria-label={t('title')}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`braille-tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`braille-panel-${item.id}`}
            tabIndex={tab === item.id ? 0 : -1}
            className={cx(
              'braille-tabs__tab',
              tab === item.id && 'braille-tabs__tab--active',
            )}
            onClick={() => selectTab(item.id)}
            onKeyDown={(event) => {
              const order: BrailleTab[] = ['explorer', 'reference', 'practice'];
              const current = order.indexOf(tab);
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                selectTab(order[(current + 1) % order.length] ?? 'explorer');
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                selectTab(
                  order[(current - 1 + order.length) % order.length] ??
                    'explorer',
                );
              } else if (event.key === 'Home') {
                event.preventDefault();
                selectTab('explorer');
              } else if (event.key === 'End') {
                event.preventDefault();
                selectTab('practice');
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`braille-panel-${tab}`}
        aria-labelledby={`braille-tab-${tab}`}
        className="braille-tabs__panel"
      >
        {tab === 'explorer' ? <BrailleExplorer /> : null}
        {tab === 'reference' ? <BrailleReference /> : null}
        {tab === 'practice' ? <BraillePractice /> : null}
      </div>
    </>
  );
}
