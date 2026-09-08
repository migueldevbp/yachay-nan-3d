import { useAccessibility } from '@/modules/accessibility/useAccessibility';

/**
 * Extiende la región #announcer de la Fase 01 con dos niveles:
 * polite (por defecto) y assertive (urgente).
 */
export function Announcer() {
  const { livePolite, liveAssertive } = useAccessibility();

  return (
    <div id="announcer" className="ui-visually-hidden">
      <div id="announcer-polite" aria-live="polite" aria-atomic="true">
        {livePolite}
      </div>
      <div id="announcer-assertive" aria-live="assertive" aria-atomic="true">
        {liveAssertive}
      </div>
    </div>
  );
}
