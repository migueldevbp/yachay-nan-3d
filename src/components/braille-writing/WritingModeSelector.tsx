import { RadioGroup } from '@/components/ui/RadioGroup';
import { useTranslation } from '@/i18n/useTranslation';
import type { WritingScreen } from '@/modules/braille-writing';

interface WritingModeSelectorProps {
  value: WritingScreen;
  onChange: (value: WritingScreen) => void;
}

export function WritingModeSelector({
  value,
  onChange,
}: WritingModeSelectorProps) {
  const { t } = useTranslation('braille');

  return (
    <RadioGroup<WritingScreen>
      legend={t('modeWritingLegend')}
      name="writing-mode"
      value={value}
      onChange={onChange}
      options={[
        { value: 'mirror', label: t('modeMirror') },
        { value: 'slate', label: t('modeSlate') },
        { value: 'perkins', label: t('modePerkins') },
        { value: 'dictation', label: t('modeDictation') },
        { value: 'physical', label: t('modePhysical') },
      ]}
    />
  );
}
