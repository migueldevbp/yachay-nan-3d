export const MIRROR_MAP = { 1: 4, 2: 5, 3: 6, 4: 1, 5: 2, 6: 3 } as const;

export type BrailleDot = keyof typeof MIRROR_MAP;

function normalizeDots(dots: readonly number[]): number[] {
  return [...new Set(dots.filter((dot) => dot >= 1 && dot <= 6))].sort(
    (a, b) => a - b,
  );
}

function swapColumns(dots: readonly number[]): number[] {
  return normalizeDots(
    dots.map((dot) => MIRROR_MAP[dot as BrailleDot] ?? dot),
  );
}

/** Lectura (relieve) → posiciones de escritura en la regleta. */
export function toSlatePosition(readingDots: number[]): number[] {
  return swapColumns(readingDots);
}

/** Posiciones de la regleta → puntos de lectura al voltear el papel. */
export function toReadingDots(slatePositions: number[]): number[] {
  return swapColumns(slatePositions);
}

export function sameDotPattern(a: readonly number[], b: readonly number[]): boolean {
  const left = normalizeDots(a).join(',');
  const right = normalizeDots(b).join(',');
  return left === right;
}

export function dotsKey(dots: readonly number[]): string {
  return normalizeDots(dots).join(',');
}

export function allSixDotPatterns(): number[][] {
  const patterns: number[][] = [];
  for (let mask = 0; mask < 64; mask += 1) {
    const dots: number[] = [];
    for (let point = 1; point <= 6; point += 1) {
      if (mask & (1 << (point - 1))) {
        dots.push(point);
      }
    }
    patterns.push(dots);
  }
  return patterns;
}
