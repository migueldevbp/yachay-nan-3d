import { useTranslation } from '@/i18n/useTranslation';

interface PhaseNoticeProps {
  phase: string;
  description: string;
}

export function PhaseNotice({ phase, description }: PhaseNoticeProps) {
  const { t } = useTranslation('common');

  return (
    <p className="phase-notice" role="status">
      {t('phaseNotice', { phase, description })}
    </p>
  );
}
