import { describe, expect, it } from 'vitest';
import {
  diagnoseSequence,
  diagnoseSlateCell,
  getDangerousPairs,
  getSymmetricLetters,
  readingDotsForChar,
  toSlatePosition,
} from '@/modules/braille-writing';

const EXPECTED_PAIRS: Array<[string, string]> = [
  ['d', 'f'],
  ['e', 'i'],
  ['h', 'j'],
  ['q', 'ñ'],
  ['r', 'w'],
  ['t', 'ü'],
  ['u', 'ó'],
  ['z', 'é'],
  ['á', 'ú'],
];

function pairSet(pairs: Array<[string, string]>): Set<string> {
  return new Set(pairs.map(([a, b]) => [a, b].sort().join('|')));
}

describe('validación de escritura', () => {
  it('genera los pares peligrosos sin escribirlos a mano', () => {
    expect(pairSet(getDangerousPairs())).toEqual(pairSet(EXPECTED_PAIRS));
  });

  it('las únicas simétricas del alfabeto latino son c, g y x', () => {
    expect(getSymmetricLetters()).toEqual(['c', 'g', 'x']);
    for (const letter of ['c', 'g', 'x']) {
      const dots = readingDotsForChar(letter) ?? [];
      expect(toSlatePosition(dots)).toEqual(dots);
    }
  });

  it('detecta el espejo cuando se escribe el patrón de lectura', () => {
    const expected = readingDotsForChar('e') ?? [];
    const diagnosis = diagnoseSlateCell(expected, expected, 'e');
    expect(diagnosis.ok).toBe(false);
    expect(diagnosis.kind).toBe('mirrored');
    expect(diagnosis.writtenLetter).toBe('i');
    expect(diagnosis.mirrorPair).toEqual(['e', 'i']);
  });

  it('clasifica puntos de menos, de más, otra letra y orden invertido', () => {
    const e = readingDotsForChar('e') ?? [];
    const missing = diagnoseSlateCell(e, toSlatePosition([1]), 'e');
    expect(missing.kind).toBe('missing_dots');

    const extra = diagnoseSlateCell(e, toSlatePosition([1, 5, 2]), 'e');
    expect(extra.kind).toBe('extra_dots');

    const s = readingDotsForChar('s') ?? [];
    const wrong = diagnoseSlateCell(e, toSlatePosition(s), 'e');
    expect(wrong.kind).toBe('wrong_letter');
    expect(wrong.writtenLetter).toBe('s');

    const ma = [readingDotsForChar('m') ?? [], readingDotsForChar('a') ?? []];
    const reversed = diagnoseSequence(ma, [...ma].reverse());
    expect(reversed.ok).toBe(false);
    expect(reversed.kind).toBe('reversed_order');
  });
});
