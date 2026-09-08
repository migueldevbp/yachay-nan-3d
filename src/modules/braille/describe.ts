import { charToBraille, expandSpec } from '@/modules/braille/BrailleEngine';

function joinEs(dots: readonly number[]): string {
  if (dots.length === 0) {
    return 'sin puntos';
  }
  if (dots.length === 1) {
    return `punto ${dots[0]}`;
  }
  if (dots.length === 2) {
    return `puntos ${dots[0]} y ${dots[1]}`;
  }
  const head = dots.slice(0, -1).join(', ');
  const last = dots[dots.length - 1];
  return `puntos ${head} y ${last}`;
}

export function describeDots(dots: number[], _lang: 'es' = 'es'): string {
  return joinEs([...dots].sort((a, b) => a - b));
}

function describeSpecParts(
  char: string,
  spec: NonNullable<ReturnType<typeof charToBraille>>,
): string {
  const pieces: string[] = [];
  for (const prefix of spec.prefixes ?? []) {
    pieces.push(prefix === 'number' ? 'signo de número' : 'signo de mayúscula');
  }
  pieces.push(joinEs(spec.dots));
  for (const extra of spec.extraCells ?? []) {
    pieces.push(joinEs(extra));
  }

  const body = pieces.join(', ');
  if (char >= '0' && char <= '9') {
    return `Braille del número ${char}: ${body}`;
  }
  return `Braille de la letra ${char}: ${body}`;
}

export function describeCharacter(char: string, _lang: 'es' = 'es'): string {
  const spec = charToBraille(char);
  if (!spec) {
    return '';
  }
  return describeSpecParts(char, spec);
}

export function describeExpanded(char: string, lang: 'es' = 'es'): string[] {
  const spec = charToBraille(char);
  if (!spec) {
    return [];
  }
  return expandSpec(spec).map((cell) => describeDots(cell.dots, lang));
}
