import {
  DIGRAPH_CELLS,
  dotsToUnicode as utilDotsToUnicode,
  LETTER_DOTS,
  prefixDots,
  renderBraille,
  unicodeToDots as utilUnicodeToDots,
} from '@/utils/braille';
import type { BraillePrefix, BrailleSpec } from '@/types/braille';
import type { ValidationStatus } from '@/types/content';
import { contentEngine } from '@/modules/content/ContentEngine';

const DIGIT_TO_LETTER = [
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

function sortedDots(dots: readonly number[]): number[] {
  return [...new Set(dots)].sort((a, b) => a - b);
}

function isValidDots(dots: readonly number[]): boolean {
  return dots.every(
    (point) => Number.isInteger(point) && point >= 1 && point <= 6,
  );
}

function makeSpec(
  dots: readonly number[],
  prefixes?: BraillePrefix[],
  extraCells?: number[][],
): BrailleSpec {
  const normalized = sortedDots(dots);
  return {
    dots: normalized,
    prefixes,
    extraCells,
    unicode: renderBraille({
      dots: normalized,
      prefixes,
      extraCells,
    }),
    validation: getValidationStatus(),
  };
}

function prefixSpec(kind: BraillePrefix): BrailleSpec {
  const dots = [...prefixDots(kind)];
  return {
    dots,
    unicode: utilDotsToUnicode(dots),
    validation: getValidationStatus(),
  };
}

export function dotsToUnicode(dots: number[]): string {
  return utilDotsToUnicode(sortedDots(dots));
}

export function unicodeToDots(char: string): number[] {
  return utilUnicodeToDots(char);
}

export function getValidationStatus(): ValidationStatus {
  return contentEngine.getBrailleTable().meta.validation;
}

export function charToBraille(char: string): BrailleSpec | undefined {
  if (!char) {
    return undefined;
  }

  const lower = char.toLowerCase();
  if (lower === 'ch' || lower === 'll') {
    const cells = DIGRAPH_CELLS[lower];
    const first = cells?.[0];
    const extra = cells?.slice(1);
    if (!first) {
      return undefined;
    }
    const prefixes: BraillePrefix[] | undefined =
      char === char.toUpperCase() ? ['capital'] : undefined;
    return makeSpec(
      first,
      prefixes,
      extra ? extra.map((cell) => [...cell]) : undefined,
    );
  }

  if (char.length === 1 && char >= '0' && char <= '9') {
    const letter = DIGIT_TO_LETTER[Number(char)];
    if (!letter) {
      return undefined;
    }
    const dots = LETTER_DOTS[letter];
    if (!dots) {
      return undefined;
    }
    return makeSpec(dots, ['number']);
  }

  if (char.length !== 1) {
    return undefined;
  }

  const glyph = LETTER_DOTS[lower];
  if (!glyph) {
    return undefined;
  }

  const isUpper = char !== lower;
  return makeSpec(glyph, isUpper ? ['capital'] : undefined);
}

export function brailleToChar(dots: number[]): string | undefined {
  if (!isValidDots(dots) || dots.length !== new Set(dots).size) {
    return undefined;
  }
  const key = dotsToUnicode(dots);
  for (const [letter, letterDots] of Object.entries(LETTER_DOTS)) {
    if (dotsToUnicode([...letterDots]) === key) {
      return letter;
    }
  }
  return undefined;
}

export function expandSpec(spec: BrailleSpec): BrailleSpec[] {
  const cells: BrailleSpec[] = [];
  for (const prefix of spec.prefixes ?? []) {
    cells.push(prefixSpec(prefix));
  }
  cells.push({
    dots: spec.dots,
    unicode: utilDotsToUnicode(spec.dots),
    validation: spec.validation,
  });
  for (const extra of spec.extraCells ?? []) {
    cells.push({
      dots: extra,
      unicode: utilDotsToUnicode(extra),
      validation: spec.validation,
    });
  }
  return cells;
}

export function textToBraille(text: string): BrailleSpec[] {
  const cells: BrailleSpec[] = [];
  let index = 0;
  while (index < text.length) {
    const pair = text.slice(index, index + 2);
    const pairSpec =
      pair.length === 2 && ['ch', 'll', 'CH', 'LL'].includes(pair)
        ? charToBraille(pair)
        : undefined;
    if (pairSpec) {
      cells.push(...expandSpec(pairSpec));
      index += 2;
      continue;
    }

    const current = text[index];
    if (!current) {
      break;
    }
    const spec = charToBraille(current);
    if (spec) {
      cells.push(...expandSpec(spec));
    }
    index += 1;
  }
  return cells;
}
