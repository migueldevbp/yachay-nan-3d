import { useTranslation } from '@/i18n/useTranslation';
import { cx } from '@/utils/cx';

interface WritingFeedbackProps {
  ok: boolean;
  message: string;
}

export function WritingFeedback({ ok, message }: WritingFeedbackProps) {
  const { t } = useTranslation('braille');

  return (
    <p
      className={cx(
        'writing-feedback',
        ok ? 'writing-feedback--ok' : 'writing-feedback--bad',
      )}
      role="status"
    >
      <span className="writing-feedback__icon" aria-hidden="true">
        {ok ? '✓' : '!'}
      </span>
      <span className="ui-visually-hidden">
        {ok ? t('iconCorrect') : t('iconIncorrect')}
      </span>
      <span>{message}</span>
    </p>
  );
}
