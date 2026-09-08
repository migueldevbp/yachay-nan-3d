export type PracticeMode = 'letter-to-braille' | 'braille-to-letter';

/**
 * Resultado de una tanda de práctica.
 * Punto de extensión para la Fase 15 (progreso del aprendiz):
 * la UI emite `onActivityComplete(result)` y no persiste nada aquí.
 */
export interface ActivityResult {
  mode: PracticeMode;
  correct: number;
  total: number;
}
