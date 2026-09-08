import { useTranslation } from '@/i18n/useTranslation';

interface PhonemeDisplayProps {
  phoneme: string;
}

export function PhonemeDisplay({ phoneme }: PhonemeDisplayProps) {
  const { t } = useTranslation('alphabet');

  return (
    <p className="resource-phoneme">{t('phonemeLabel', { phoneme })}</p>
  );
}
