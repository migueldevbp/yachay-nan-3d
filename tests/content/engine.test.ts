import { describe, expect, it } from 'vitest';
import { contentEngine } from '@/modules/content/ContentEngine';

describe('ContentEngine', () => {
  it('getById y getByCharacter', () => {
    const letterA = contentEngine.getById('letter-upper-a');
    expect(letterA?.character).toBe('A');
    expect(contentEngine.getByCharacter('A', 'uppercase')?.id).toBe(
      'letter-upper-a',
    );
    expect(contentEngine.getByCharacter('a', 'lowercase')?.id).toBe(
      'letter-lower-a',
    );
  });

  it('getByType y getSequence', () => {
    const letters = contentEngine.getByType('letter');
    expect(letters.length).toBe(58);
    const sequence = contentEngine.getSequence('letter');
    expect(sequence[0]?.order).toBe(1);
  });

  it('getByModelClass encuentra la pieza A', () => {
    expect(contentEngine.getByModelClass('letter-A')?.character).toBe('A');
  });

  it('getMvpResources devuelve exactamente A, B, C, M, S mayúsculas', () => {
    const mvp = contentEngine.getMvpResources();
    expect(mvp.map((item) => item.character).sort()).toEqual([
      'A',
      'B',
      'C',
      'M',
      'S',
    ]);
    expect(mvp.every((item) => item.caseForm === 'uppercase')).toBe(true);
    expect(mvp.every((item) => item.vision.hasPhysicalPiece)).toBe(true);
  });

  it('getWordsFormableWith no arma CASA si falta la segunda A', () => {
    const withOneA = contentEngine.getWordsFormableWith(['C', 'A', 'S']);
    expect(withOneA.some((word) => word.character === 'casa')).toBe(false);

    const withTwoA = contentEngine.getWordsFormableWith(['C', 'A', 'S', 'A']);
    expect(withTwoA.some((word) => word.character === 'casa')).toBe(true);
  });

  it('getRelated devuelve recursos existentes', () => {
    const related = contentEngine.getRelated('word-casa');
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((item) => item.id.length > 0)).toBe(true);
  });

  it('getValidationSummary reporta 0 validados', () => {
    const summary = contentEngine.getValidationSummary();
    expect(summary.validated).toBe(0);
    expect(summary.draft).toBe(0);
    expect(summary.pending).toBeGreaterThan(0);
    expect(summary.pending).toBe(contentEngine.getAll().length);
  });

  it('CASA es la palabra objetivo de la demo', () => {
    const casa = contentEngine.getById('word-casa');
    expect(casa?.character).toBe('casa');
    expect(casa && 'requiredPieces' in casa && casa.requiredPieces).toEqual([
      'C',
      'A',
      'S',
      'A',
    ]);
    expect(casa && 'isDemoTarget' in casa && casa.isDemoTarget).toBe(true);
  });
});
