import { useAccessibility } from '@/modules/accessibility/useAccessibility';
import type { AnnouncerUrgency } from '@/modules/accessibility/types';

/**
 * Canal único de mensajes del sistema al usuario.
 * Toda fase posterior debe llamar a say(); no anunciar por otros caminos.
 */
export function useAnnouncer() {
  const { say, caption, livePolite, liveAssertive } = useAccessibility();

  return {
    say: (message: string, urgency: AnnouncerUrgency = 'polite') => {
      say(message, urgency);
    },
    caption,
    livePolite,
    liveAssertive,
  };
}
