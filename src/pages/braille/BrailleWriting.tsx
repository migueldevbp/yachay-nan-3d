import { useState } from 'react';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { WritingModeSelector } from '@/components/braille-writing/WritingModeSelector';
import { BrailleTabs } from '@/pages/braille/BrailleTabs';
import { LearnMirror } from '@/pages/braille/writing/LearnMirror';
import { SlatePractice } from '@/pages/braille/writing/SlatePractice';
import { PerkinsPractice } from '@/pages/braille/writing/PerkinsPractice';
import { DictationMode } from '@/pages/braille/writing/DictationMode';
import { PhysicalPractice } from '@/pages/braille/writing/PhysicalPractice';
import type { WritingScreen } from '@/modules/braille-writing';
import type { ActivityResult } from '@/modules/braille';
import { useTranslation } from '@/i18n/useTranslation';

const DOCS_URL =
  'https://github.com/migueldevbp/yachay-nan-3d/blob/main/docs/braille-writing.md';

interface BrailleWritingProps {
  initialScreen?: WritingScreen;
  onActivityComplete?: (result: ActivityResult) => void;
}

export function BrailleWriting({
  initialScreen = 'mirror',
  onActivityComplete,
}: BrailleWritingProps) {
  const { t } = useTranslation('braille');
  const [screen, setScreen] = useState<WritingScreen>(initialScreen);

  return (
    <>
      <Breadcrumbs />
      <PageHeader title={t('writingTitle')} lead={t('writingLead')} />
      <BrailleTabs current="writing" />
      <div
        role="tabpanel"
        id="braille-panel-writing"
        aria-labelledby="braille-tab-writing"
        className="braille-tabs__panel"
      >
        <div className="braille-reference__status">
          <StatusBadge status="pending" />
          <p>{t('writingValidationNote')}</p>
          <a href={DOCS_URL} target="_blank" rel="noreferrer">
            {t('writingValidationLink')}
          </a>
        </div>
        <p>{t('shortcutsHelp')}</p>
        <WritingModeSelector value={screen} onChange={setScreen} />
        {screen === 'mirror' ? (
          <LearnMirror onActivityComplete={onActivityComplete} />
        ) : null}
        {screen === 'slate' ? (
          <SlatePractice onActivityComplete={onActivityComplete} />
        ) : null}
        {screen === 'perkins' ? (
          <PerkinsPractice onActivityComplete={onActivityComplete} />
        ) : null}
        {screen === 'dictation' ? (
          <DictationMode onActivityComplete={onActivityComplete} />
        ) : null}
        {screen === 'physical' ? (
          <PhysicalPractice onActivityComplete={onActivityComplete} />
        ) : null}
      </div>
    </>
  );
}
