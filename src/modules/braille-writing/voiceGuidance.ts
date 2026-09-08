import { describeDots } from '@/modules/braille';
import { toReadingDots, toSlatePosition } from '@/modules/braille-writing/mirroring';
import { readingDotsForChar } from '@/modules/braille-writing/validation';
import type { CellDiagnosis } from '@/modules/braille-writing/types';

export type VoiceT = (key: string, vars?: Record<string, string | number>) => string;

export const SLATE_KEY_TO_WRITING: Record<string, number> = {
  s: 1,
  d: 2,
  f: 3,
  j: 4,
  k: 5,
  l: 6,
};

export const PERKINS_KEY_TO_READING: Record<string, number> = {
  f: 1,
  d: 2,
  s: 3,
  j: 4,
  k: 5,
  l: 6,
};

const LETTER_NAMES: Record<string, string> = {
  a: 'a',
  b: 'be',
  c: 'ce',
  d: 'de',
  e: 'e',
  f: 'efe',
  g: 'ge',
  h: 'hache',
  i: 'i',
  j: 'jota',
  k: 'ka',
  l: 'ele',
  m: 'eme',
  n: 'ene',
  ñ: 'eñe',
  o: 'o',
  p: 'pe',
  q: 'cu',
  r: 'ere',
  s: 'ese',
  t: 'te',
  u: 'u',
  v: 'uve',
  w: 'uve doble',
  x: 'equis',
  y: 'ye',
  z: 'zeta',
  á: 'a con tilde',
  é: 'e con tilde',
  í: 'i con tilde',
  ó: 'o con tilde',
  ú: 'u con tilde',
  ü: 'u con diéresis',
};

export function positionName(writingDot: number, t: VoiceT): string {
  return t(`pos${writingDot}`);
}

export function describeWritingPositions(writingDots: number[], t: VoiceT): string {
  const names = [...writingDots]
    .sort((a, b) => a - b)
    .map((dot) => positionName(dot, t));
  if (names.length === 0) {
    return t('posEmpty');
  }
  if (names.length === 1) {
    return names[0] ?? t('posEmpty');
  }
  if (names.length === 2) {
    return `${names[0]} ${t('andWord')} ${names[1]}`;
  }
  return `${names.slice(0, -1).join(', ')} ${t('andWord')} ${names[names.length - 1]}`;
}

export function spell(word: string): string {
  return [...word]
    .filter((char) => char.trim().length > 0)
    .map((char) => LETTER_NAMES[char.toLowerCase()] ?? char)
    .join(', ');
}

export function cellStartMessage(
  t: VoiceT,
  cell: number,
  line: number,
  letter: string,
): string {
  return t('voiceCellStart', { cell, line, letter });
}

export function helpMessage(t: VoiceT, letter: string): string {
  const reading = readingDotsForChar(letter) ?? [];
  const slate = toSlatePosition(reading);
  return t('voiceHelpLetter', {
    letter,
    reading: describeDots(reading, 'es'),
    slate: describeWritingPositions(slate, t),
  });
}

export function punchMessage(t: VoiceT, writingDot: number): string {
  const reading = toReadingDots([writingDot])[0] ?? writingDot;
  return t('voicePunch', {
    position: positionName(writingDot, t),
    readingPoint: t('voiceReadingPoint', { n: reading }),
  });
}

export function confirmOkMessage(t: VoiceT, letter: string): string {
  return t('voiceConfirmOk', { letter });
}

export function lineEndMessage(t: VoiceT, line: number): string {
  return t('voiceLineEnd', { line });
}

export function reviewMessage(t: VoiceT, written: string, remaining: boolean): string {
  return remaining ? t('voiceReviewMore', { written }) : t('voiceReviewDone', { written });
}

export function diagnosisMessage(t: VoiceT, diagnosis: CellDiagnosis): string {
  if (diagnosis.ok) {
    return t('voiceConfirmOk', { letter: diagnosis.expectedLetter ?? '' });
  }

  if (diagnosis.kind === 'mirrored' && diagnosis.mirrorPair) {
    return t('voiceMirroredPair', {
      written: diagnosis.writtenLetter ?? '',
      expected: diagnosis.expectedLetter ?? '',
    });
  }

  if (diagnosis.kind === 'mirrored') {
    return t('voiceMirrored');
  }

  if (diagnosis.kind === 'wrong_letter') {
    const missing = diagnosis.missingSlate;
    if (missing.length > 0) {
      return t('voiceWrongLetterMissing', {
        written: diagnosis.writtenLetter ?? '',
        expected: diagnosis.expectedLetter ?? '',
        missing: describeWritingPositions(missing, t),
        reading: describeDots(diagnosis.missingReading, 'es'),
      });
    }
    return t('voiceWrongLetter', {
      written: diagnosis.writtenLetter ?? '',
      expected: diagnosis.expectedLetter ?? '',
    });
  }

  if (diagnosis.kind === 'missing_dots') {
    return t('voiceMissing', {
      writing: describeWritingPositions(diagnosis.missingSlate, t),
      reading: describeDots(diagnosis.missingReading, 'es'),
    });
  }

  if (diagnosis.kind === 'extra_dots') {
    return t('voiceExtra', {
      writing: describeWritingPositions(diagnosis.extraSlate, t),
      reading: describeDots(diagnosis.extraReading, 'es'),
    });
  }

  if (diagnosis.kind === 'reversed_order') {
    return t('voiceReversed');
  }

  return t('voiceIncorrect');
}

export function parseAdvanceCommand(text: string): boolean {
  const normalized = text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return normalized === 'listo' || normalized === 'siguiente';
}
