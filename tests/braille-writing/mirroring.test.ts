import { describe, expect, it } from 'vitest';
import {
  allSixDotPatterns,
  toReadingDots,
  toSlatePosition,
} from '@/modules/braille-writing';

describe('espejo de la regleta', () => {
  it('cumple el invariante ida y vuelta para los 64 patrones', () => {
    for (const pattern of allSixDotPatterns()) {
      expect(toReadingDots(toSlatePosition(pattern))).toEqual(pattern);
      expect(toSlatePosition(toReadingDots(pattern))).toEqual(pattern);
    }
  });

  it('convierte casos comprobados a mano', () => {
    expect(toSlatePosition([1])).toEqual([4]);
    expect(toSlatePosition([1, 5])).toEqual([2, 4]);
    expect(toSlatePosition([1, 4])).toEqual([1, 4]);
    expect(toReadingDots([4])).toEqual([1]);
    expect(toReadingDots([4, 2])).toEqual([1, 5]);
  });
});
