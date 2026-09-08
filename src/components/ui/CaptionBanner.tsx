import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';

/**
 * Banda persistente de subtítulos. Si captions está activo, muestra
 * lo último que el sistema dijo. No depende del audio.
 * El anuncio a lectores de pantalla lo hace Announcer, no este banner,
 * para no duplicar el mensaje.
 */
export function CaptionBanner() {
  const { preferences, caption } = useAccessibility();
  const { t } = useTranslation('common');

  if (!preferences.captions || !caption) {
    return null;
  }

  return (
    <div className="caption-banner" aria-hidden="true">
      <p className="caption-banner__label">{t('caption')}</p>
      <p className="caption-banner__text">{caption}</p>
    </div>
  );
}
