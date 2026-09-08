import { brailleToChar, charToBraille } from '@/modules/braille';
import { LETTER_DOTS } from '@/utils/braille';
import {
  dotsKey,
  sameDotPattern,
  toReadingDots,
  toSlatePosition,
} from '@/modules/braille-writing/mirroring';
import type {
  CellDiagnosis,
  SequenceDiagnosis,
} from '@/modules/braille-writing/types';

function diff(expected: number[], actual: number[]): {
  missing: number[];
  extra: number[];
} {
  const want = new Set(expected);
  const got = new Set(actual);
  return {
    missing: expected.filter((dot) => !got.has(dot)),
    extra: actual.filter((dot) => !want.has(dot)),
  };
}

export function readingDotsForChar(char: string): number[] | undefined {
  if (!char) {
    return undefined;
  }
  return charToBraille(char.toLowerCase())?.dots;
}

export function getDangerousPairs(): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  const seen = new Set<string>();
  for (const [letter, dots] of Object.entries(LETTER_DOTS)) {
    const mirrored = toSlatePosition([...dots]);
    const other = brailleToChar(mirrored);
    if (!other || other === letter) {
      continue;
    }
    const key = [letter, other].sort().join('|');
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    pairs.push([letter, other]);
  }
  return pairs.sort((a, b) => a[0].localeCompare(b[0], 'es'));
}

export function getSymmetricLetters(alphabet = 'abcdefghijklmnopqrstuvwxyz'): string[] {
  return [...alphabet].filter((letter) => {
    const dots = LETTER_DOTS[letter];
    if (!dots) {
      return false;
    }
    return sameDotPattern([...dots], toSlatePosition([...dots]));
  });
}

function pairFor(expected?: string, written?: string): [string, string] | undefined {
  if (!expected || !written || expected === written) {
    return undefined;
  }
  const found = getDangerousPairs().find(
    ([a, b]) =>
      (a === expected && b === written) || (a === written && b === expected),
  );
  return found ? [expected, written] : undefined;
}

export function diagnoseSlateCell(
  expectedReading: number[],
  actualSlate: number[],
  expectedLetter?: string,
): CellDiagnosis {
  const expectedSlate = toSlatePosition(expectedReading);
  const actualReading = toReadingDots(actualSlate);
  const writtenLetter = brailleToChar(actualReading);
  const missingReading = diff(expectedReading, actualReading).missing;
  const extraReading = diff(expectedReading, actualReading).extra;
  const missingSlate = diff(expectedSlate, actualSlate).missing;
  const extraSlate = diff(expectedSlate, actualSlate).extra;
  const ok = sameDotPattern(actualReading, expectedReading);

  const base: CellDiagnosis = {
    ok,
    expectedReading: [...expectedReading].sort((a, b) => a - b),
    actualReading,
    expectedSlate,
    actualSlate: [...actualSlate].sort((a, b) => a - b),
    writtenLetter,
    expectedLetter,
    missingReading,
    extraReading,
    missingSlate,
    extraSlate,
    mirrorPair: pairFor(expectedLetter, writtenLetter),
  };

  if (ok) {
    return base;
  }

  if (sameDotPattern(actualSlate, expectedReading)) {
    return { ...base, kind: 'mirrored' };
  }

  if (extraReading.length === 0 && missingReading.length > 0) {
    return { ...base, kind: 'missing_dots' };
  }

  if (missingReading.length === 0 && extraReading.length > 0) {
    return { ...base, kind: 'extra_dots' };
  }

  if (writtenLetter && writtenLetter !== expectedLetter) {
    return { ...base, kind: 'wrong_letter' };
  }

  if (missingReading.length > 0) {
    return { ...base, kind: 'missing_dots' };
  }

  return { ...base, kind: 'extra_dots' };
}

export function diagnoseReadingCell(
  expectedReading: number[],
  actualReading: number[],
  expectedLetter?: string,
): CellDiagnosis {
  return diagnoseSlateCell(
    expectedReading,
    toSlatePosition(actualReading),
    expectedLetter,
  );
}

export function diagnoseSequence(
  expected: number[][],
  actual: number[][],
): SequenceDiagnosis {
  const cells = expected.map((want, index) =>
    diagnoseReadingCell(want, actual[index] ?? []),
  );
  const ok = cells.every((cell) => cell.ok);
  if (ok) {
    return { ok: true, cells };
  }

  if (
    expected.length > 1 &&
    actual.length === expected.length &&
    expected.every((want, index) =>
      sameDotPattern(want, actual[actual.length - 1 - index] ?? []),
    )
  ) {
    return { ok: false, kind: 'reversed_order', cells };
  }

  return { ok: false, cells };
}

export function pairKeySet(): Set<string> {
  return new Set(
    getDangerousPairs().map(([a, b]) => [a, b].sort().join('|')),
  );
}

export { dotsKey };
