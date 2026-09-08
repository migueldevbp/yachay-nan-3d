import type { BraillePrefix } from '@/types/braille';

export const BRAILLE_BASE = 0x2800;

export const NUMBER_SIGN_DOTS = [3, 4, 5, 6] as const;
export const CAPITAL_SIGN_DOTS = [4, 6] as const;

const DIGIT_LETTERS = [
  'j',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
] as const;

export function dotsToBitmask(dots: readonly number[]): number {
  let mask = 0;
  for (const point of dots) {
    if (!Number.isInteger(point) || point < 1 || point > 6) {
      throw new Error(
        `Punto Braille inválido: ${point}. Debe estar entre 1 y 6.`,
      );
    }
    mask |= 1 << (point - 1);
  }
  return mask;
}

export function dotsToUnicode(dots: readonly number[]): string {
  return String.fromCodePoint(BRAILLE_BASE + dotsToBitmask(dots));
}

export function unicodeToDots(cell: string): number[] {
  const codePoint = cell.codePointAt(0);
  if (codePoint === undefined) {
    throw new Error('Celda Braille vacía.');
  }
  const mask = codePoint - BRAILLE_BASE;
  if (mask < 0 || mask > 63) {
    throw new Error(`No es una celda Braille de 6 puntos: ${cell}`);
  }
  const dots: number[] = [];
  for (let point = 1; point <= 6; point += 1) {
    if (mask & (1 << (point - 1))) {
      dots.push(point);
    }
  }
  return dots;
}

export function renderCells(cells: ReadonlyArray<readonly number[]>): string {
  return cells.map((cell) => dotsToUnicode(cell)).join('');
}

export function prefixDots(prefix: BraillePrefix): readonly number[] {
  return prefix === 'number' ? NUMBER_SIGN_DOTS : CAPITAL_SIGN_DOTS;
}

export function renderBraille(spec: {
  dots: readonly number[];
  extraCells?: ReadonlyArray<readonly number[]>;
  prefixes?: readonly BraillePrefix[];
}): string {
  const cells: Array<readonly number[]> = [];
  for (const prefix of spec.prefixes ?? []) {
    cells.push(prefixDots(prefix));
  }
  cells.push(spec.dots);
  for (const extra of spec.extraCells ?? []) {
    cells.push(extra);
  }
  return renderCells(cells);
}

export function encodeDigit(digit: number): string {
  if (!Number.isInteger(digit) || digit < 0 || digit > 9) {
    throw new Error(`Dígito fuera de rango: ${digit}`);
  }
  const letter = DIGIT_LETTERS[digit];
  if (!letter) {
    throw new Error(`No hay letra Braille para el dígito ${digit}`);
  }
  return renderBraille({
    dots: letterDots(letter),
    prefixes: ['number'],
  });
}

export function letterDots(letter: string): number[] {
  const glyph = LETTER_DOTS[letter];
  if (!glyph) {
    throw new Error(`No hay puntos Braille para «${letter}».`);
  }
  return [...glyph];
}

/**
 * Puntos de una sola celda. CH y LL no van aquí: son dos celdas.
 * Fuente: JSON de grado 1; este mapa se usa para dígitos y tests.
 * Debe coincidir con src/data/braille/spanish-grade1.json.
 */
export const LETTER_DOTS: Record<string, readonly number[]> = {
  a: [1],
  b: [1, 2],
  c: [1, 4],
  d: [1, 4, 5],
  e: [1, 5],
  f: [1, 2, 4],
  g: [1, 2, 4, 5],
  h: [1, 2, 5],
  i: [2, 4],
  j: [2, 4, 5],
  k: [1, 3],
  l: [1, 2, 3],
  m: [1, 3, 4],
  n: [1, 3, 4, 5],
  o: [1, 3, 5],
  p: [1, 2, 3, 4],
  q: [1, 2, 3, 4, 5],
  r: [1, 2, 3, 5],
  s: [2, 3, 4],
  t: [2, 3, 4, 5],
  u: [1, 3, 6],
  v: [1, 2, 3, 6],
  w: [2, 4, 5, 6],
  x: [1, 3, 4, 6],
  y: [1, 3, 4, 5, 6],
  z: [1, 3, 5, 6],
  ñ: [1, 2, 4, 5, 6],
  á: [1, 2, 3, 5, 6],
  é: [2, 3, 4, 6],
  í: [3, 4],
  ó: [3, 4, 6],
  ú: [2, 3, 4, 5, 6],
  ü: [1, 2, 5, 6],
};

export const DIGRAPH_CELLS: Record<string, readonly number[][]> = {
  ch: [
    [1, 4],
    [1, 2, 5],
  ],
  ll: [
    [1, 2, 3],
    [1, 2, 3],
  ],
};
