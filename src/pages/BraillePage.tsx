import { useState } from 'react';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PageHeader } from '@/components/ui/PageHeader';
import { BrailleExplorer } from '@/pages/braille/BrailleExplorer';
import { BrailleReference } from '@/pages/braille/BrailleReference';
import { BraillePractice } from '@/pages/braille/BraillePractice';
import {
  BrailleTabs,
  type BrailleTab,
} from '@/pages/braille/BrailleTabs';
import { useTranslation } from '@/i18n/useTranslation';

export function BraillePage() {
  const { t } = useTranslation('braille');
  const [tab, setTab] = useState<Exclude<BrailleTab, 'writing'>>('explorer');

  return (
    <>
      <Breadcrumbs />
      <PageHeader title={t('title')} />
      <BrailleTabs current={tab} onSelect={setTab} />
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
