import { contentEngine } from '@/modules/content/ContentEngine';

export type LessonKind =
  | 'cell'
  | 'mirror'
  | 'letters'
  | 'syllables'
  | 'words'
  | 'prefixes'
  | 'sentences'
  | 'free';

export interface WritingLesson {
  id: number;
  titleKey: string;
  objectiveKey: string;
  advanceKey: string;
  dependsOn: number | null;
  kind: LessonKind;
  letters: string[];
}

const LESSONS: WritingLesson[] = [
  {
    id: 1,
    titleKey: 'lesson1Title',
    objectiveKey: 'lesson1Objective',
    advanceKey: 'lesson1Advance',
    dependsOn: null,
    kind: 'cell',
    letters: [],
  },
  {
    id: 2,
    titleKey: 'lesson2Title',
    objectiveKey: 'lesson2Objective',
    advanceKey: 'lesson2Advance',
    dependsOn: 1,
    kind: 'mirror',
    letters: ['c', 'g', 'x', 'e', 'd', 'f'],
  },
  {
    id: 3,
    titleKey: 'lesson3Title',
    objectiveKey: 'lesson3Objective',
    advanceKey: 'lesson3Advance',
    dependsOn: 2,
    kind: 'letters',
    letters: ['a', 'e', 'i', 'o', 'u'],
  },
  {
    id: 4,
    titleKey: 'lesson4Title',
    objectiveKey: 'lesson4Objective',
    advanceKey: 'lesson4Advance',
    dependsOn: 3,
    kind: 'letters',
    letters: ['m', 'p', 's', 'l'],
  },
  {
    id: 5,
    titleKey: 'lesson5Title',
    objectiveKey: 'lesson5Objective',
    advanceKey: 'lesson5Advance',
    dependsOn: 4,
    kind: 'syllables',
    letters: ['m', 'a', 'e', 'i', 'o', 'u'],
  },
  {
    id: 6,
    titleKey: 'lesson6Title',
    objectiveKey: 'lesson6Objective',
    advanceKey: 'lesson6Advance',
    dependsOn: 5,
    kind: 'words',
    letters: ['m', 'a', 'p', 's', 'o', 'l', 'u', 'n', 'á'],
  },
  {
    id: 7,
    titleKey: 'lesson7Title',
    objectiveKey: 'lesson7Objective',
    advanceKey: 'lesson7Advance',
    dependsOn: 6,
    kind: 'prefixes',
    letters: ['A', '1'],
  },
  {
    id: 8,
    titleKey: 'lesson8Title',
    objectiveKey: 'lesson8Objective',
    advanceKey: 'lesson8Advance',
    dependsOn: 7,
    kind: 'words',
    letters: [],
  },
  {
    id: 9,
    titleKey: 'lesson9Title',
    objectiveKey: 'lesson9Objective',
    advanceKey: 'lesson9Advance',
    dependsOn: 8,
    kind: 'sentences',
    letters: [],
  },
  {
    id: 10,
    titleKey: 'lesson10Title',
    objectiveKey: 'lesson10Objective',
    advanceKey: 'lesson10Advance',
    dependsOn: 9,
    kind: 'free',
    letters: [],
  },
];

export function getWritingLessons(): WritingLesson[] {
  return LESSONS;
}

export function getWritingLesson(id: number): WritingLesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}

function engineCharacters(type: 'syllable' | 'word' | 'sentence'): string[] {
  return contentEngine
    .getByType(type)
    .map((item) => item.character)
    .filter((value) => value.length > 0);
}

export function promptsForLesson(lesson: WritingLesson): string[] {
  if (lesson.kind === 'letters' || lesson.kind === 'mirror') {
    return lesson.letters;
  }
  if (lesson.kind === 'syllables') {
    const wanted = new Set(['ma', 'me', 'mi', 'mo', 'mu']);
    return engineCharacters('syllable').filter((item) => wanted.has(item));
  }
  if (lesson.kind === 'words' && lesson.id === 6) {
    const wanted = new Set(['mamá', 'papá', 'sol', 'luna']);
    return engineCharacters('word').filter((item) => wanted.has(item));
  }
  if (lesson.kind === 'words') {
    return engineCharacters('word').slice(0, 4);
  }
  if (lesson.kind === 'prefixes') {
    return ['A', '1'];
  }
  if (lesson.kind === 'sentences') {
    const first = engineCharacters('sentence')[0];
    return first ? [first] : [];
  }
  return [];
}

export function canAdvanceLesson(_lessonId: number, correct: number, total: number): boolean {
  if (total === 0) {
    return true;
  }
  return correct === total;
}
