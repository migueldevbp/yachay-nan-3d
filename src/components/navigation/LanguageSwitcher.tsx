import { isQuechuaValidated } from '@/i18n/config';
import { useTranslation } from '@/i18n/useTranslation';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Select } from '@/components/ui/Select';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';
import type { LanguageCode } from '@/i18n/types';

export function LanguageSwitcher() {
  const { t, language, setLanguage } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const { say } = useAccessibility();
  const validated = isQuechuaValidated();

  function handleChange(next: LanguageCode) {
    setLanguage(next);
    if (next === 'qu' && !validated) {
      say(t('quechuaWarning'), 'assertive');
      return;
    }
    say(
      next === 'qu'
        ? tSettings('languageSavedQu')
        : tSettings('languageSavedEs'),
    );
  }

  return (
    <div className="language-switcher">
      <Select<LanguageCode>
        label={t('language')}
        value={language}
        options={[
          { value: 'es', label: t('languageEs') },
          { value: 'qu', label: t('languageQu') },
        ]}
        onChange={handleChange}
      />
      {!validated ? <StatusBadge status="pending" /> : null}
      {language === 'qu' && !validated ? (
        <p className="language-switcher__warning" role="status">
          {t('quechuaWarning')}
        </p>
      ) : null}
    </div>
  );
}
