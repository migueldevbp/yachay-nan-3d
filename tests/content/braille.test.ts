import { describe, expect, it } from 'vitest';
import {
  dotsToUnicode,
  encodeDigit,
  LETTER_DOTS,
  unicodeToDots,
} from '@/utils/braille';
import { loadCatalog } from '@/modules/content/loaders';

describe('Braille de 6 puntos', () => {
  it('deriva unicode correcto para a, b, c, m, s, z', () => {
    expect(dotsToUnicode(LETTER_DOTS.a ?? [])).toBe('\u2801');
    expect(dotsToUnicode(LETTER_DOTS.b ?? [])).toBe('\u2803');
    expect(dotsToUnicode(LETTER_DOTS.c ?? [])).toBe('\u2809');
    expect(dotsToUnicode(LETTER_DOTS.m ?? [])).toBe('\u280D');
    expect(dotsToUnicode(LETTER_DOTS.s ?? [])).toBe('\u280E');
    expect(dotsToUnicode(LETTER_DOTS.z ?? [])).toBe('\u2835');
  });

  it('es simétrico unicode <-> dots en los 64 patrones', () => {
    for (let mask = 0; mask < 64; mask += 1) {
      const dots: number[] = [];
      for (let point = 1; point <= 6; point += 1) {
        if (mask & (1 << (point - 1))) {
          dots.push(point);
        }
      }
      const cell = dotsToUnicode(dots);
      expect(unicodeToDots(cell)).toEqual(dots);
    }
  });

  it('el número 1 produce dos celdas (signo numérico + a)', () => {
    const encoded = encodeDigit(1);
    expect(Array.from(encoded)).toHaveLength(2);
    expect(encoded).toBe('\u283C\u2801');
  });

  it('la tabla JSON coincide con el mapa de puntos', () => {
    const table = loadCatalog().braille;
    for (const [letter, dots] of Object.entries(LETTER_DOTS)) {
      const glyph = table.glyphs.find((item) => item.character === letter);
      expect(glyph, letter).toBeTruthy();
      expect(glyph?.dots).toEqual([...dots]);
      expect(glyph?.validation).toBe('pending_validation');
    }
  });

  it('cubre las 26 letras latinas mínimas', () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    for (const letter of alphabet) {
      expect(LETTER_DOTS[letter]).toBeTruthy();
    }
  });
});
