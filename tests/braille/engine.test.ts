import { describe, expect, it } from 'vitest';
import {
  brailleToChar,
  charToBraille,
  describeCharacter,
  describeDots,
  dotsToUnicode,
  getValidationStatus,
  textToBraille,
  unicodeToDots,
} from '@/modules/braille';
import { CAPITAL_SIGN_DOTS, NUMBER_SIGN_DOTS } from '@/utils/braille';

describe('BrailleEngine', () => {
  it('los 64 patrones van y vuelven', () => {
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

  it("textToBraille('A5') produce 4 celdas en el orden correcto", () => {
    const cells = textToBraille('A5');
    expect(cells).toHaveLength(4);
    expect(cells[0]?.dots).toEqual([...CAPITAL_SIGN_DOTS]);
    expect(cells[1]?.dots).toEqual([1]);
    expect(cells[2]?.dots).toEqual([...NUMBER_SIGN_DOTS]);
    expect(cells[3]?.dots).toEqual([1, 5]);
  });

  it('textToBraille aplica signo de mayúscula y de número', () => {
    const casa = textToBraille('Casa');
    expect(casa[0]?.dots).toEqual([...CAPITAL_SIGN_DOTS]);
    expect(casa[1]?.dots).toEqual([1, 4]);
    expect(casa[2]?.dots).toEqual([1]);
    expect(casa[3]?.dots).toEqual([2, 3, 4]);
    expect(casa[4]?.dots).toEqual([1]);

    const twelve = textToBraille('12');
    expect(twelve).toHaveLength(4);
    expect(twelve[0]?.dots).toEqual([...NUMBER_SIGN_DOTS]);
    expect(twelve[1]?.dots).toEqual([1]);
    expect(twelve[2]?.dots).toEqual([...NUMBER_SIGN_DOTS]);
    expect(twelve[3]?.dots).toEqual([1, 2]);
  });

  it('caracteres desconocidos devuelven undefined sin lanzar', () => {
    expect(() => charToBraille('@')).not.toThrow();
    expect(charToBraille('@')).toBeUndefined();
    expect(charToBraille('')).toBeUndefined();
    expect(brailleToChar([1, 2, 3, 4, 5, 6, 1])).toBeUndefined();
    expect(textToBraille('@A')).toHaveLength(2);
  });

  it('charToBraille y brailleToChar son inversos en letras minúsculas', () => {
    const letters = 'abcdefghijklmnopqrstuvwxyzñáéíóúü';
    for (const letter of letters) {
      const spec = charToBraille(letter);
      expect(spec, letter).toBeTruthy();
      expect(brailleToChar(spec?.dots ?? [])).toBe(letter);
    }
  });

  it('describeDots no menciona puntos vacíos', () => {
    expect(describeDots([1], 'es')).toBe('punto 1');
    expect(describeDots([1, 5], 'es')).toBe('puntos 1 y 5');
    expect(describeDots([1], 'es')).not.toMatch(/2/);
  });

  it('describeCharacter de A incluye punto 1 y el signo de mayúscula', () => {
    const text = describeCharacter('A', 'es');
    expect(text).toMatch(/punto 1/);
    expect(text).toMatch(/mayúscula/);
    expect(text).not.toMatch(/punto 2/);
  });

  it('la tabla sigue por validar', () => {
    expect(getValidationStatus()).toBe('pending_validation');
  });
});
