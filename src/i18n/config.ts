import type { LanguageCode, QuechuaMeta } from '@/i18n/types';
import commonEs from '@/i18n/es/common.json';
import navigationEs from '@/i18n/es/navigation.json';
import homeEs from '@/i18n/es/home.json';
import alphabetEs from '@/i18n/es/alphabet.json';
import numbersEs from '@/i18n/es/numbers.json';
import brailleEs from '@/i18n/es/braille.json';
import signsEs from '@/i18n/es/signs.json';
import cameraEs from '@/i18n/es/camera.json';
import activitiesEs from '@/i18n/es/activities.json';
import wordsEs from '@/i18n/es/words.json';
import settingsEs from '@/i18n/es/settings.json';
import progressEs from '@/i18n/es/progress.json';
import teacherEs from '@/i18n/es/teacher.json';
import aboutEs from '@/i18n/es/about.json';
import privacyEs from '@/i18n/es/privacy.json';
import errorsEs from '@/i18n/es/errors.json';
import commonQu from '@/i18n/qu/common.json';
import navigationQu from '@/i18n/qu/navigation.json';
import homeQu from '@/i18n/qu/home.json';
import alphabetQu from '@/i18n/qu/alphabet.json';
import numbersQu from '@/i18n/qu/numbers.json';
import brailleQu from '@/i18n/qu/braille.json';
import signsQu from '@/i18n/qu/signs.json';
import cameraQu from '@/i18n/qu/camera.json';
import activitiesQu from '@/i18n/qu/activities.json';
import wordsQu from '@/i18n/qu/words.json';
import settingsQu from '@/i18n/qu/settings.json';
import progressQu from '@/i18n/qu/progress.json';
import teacherQu from '@/i18n/qu/teacher.json';
import aboutQu from '@/i18n/qu/about.json';
import privacyQu from '@/i18n/qu/privacy.json';
import errorsQu from '@/i18n/qu/errors.json';
import quechuaMeta from '@/i18n/qu/_meta.json';

export const NAMESPACES = [
  'common',
  'navigation',
  'home',
  'alphabet',
  'numbers',
  'braille',
  'signs',
  'camera',
  'activities',
  'words',
  'settings',
  'progress',
  'teacher',
  'about',
  'privacy',
  'errors',
] as const;

export type Namespace = (typeof NAMESPACES)[number];

export interface Messages {
  common: typeof commonEs;
  navigation: typeof navigationEs;
  home: typeof homeEs;
  alphabet: typeof alphabetEs;
  numbers: typeof numbersEs;
  braille: typeof brailleEs;
  signs: typeof signsEs;
  camera: typeof cameraEs;
  activities: typeof activitiesEs;
  words: typeof wordsEs;
  settings: typeof settingsEs;
  progress: typeof progressEs;
  teacher: typeof teacherEs;
  about: typeof aboutEs;
  privacy: typeof privacyEs;
  errors: typeof errorsEs;
}

export const messages: Record<LanguageCode, Messages> = {
  es: {
    common: commonEs,
    navigation: navigationEs,
    home: homeEs,
    alphabet: alphabetEs,
    numbers: numbersEs,
    braille: brailleEs,
    signs: signsEs,
    camera: cameraEs,
    activities: activitiesEs,
    words: wordsEs,
    settings: settingsEs,
    progress: progressEs,
    teacher: teacherEs,
    about: aboutEs,
    privacy: privacyEs,
    errors: errorsEs,
  },
  qu: {
    common: commonQu,
    navigation: navigationQu,
    home: homeQu,
    alphabet: alphabetQu,
    numbers: numbersQu,
    braille: brailleQu,
    signs: signsQu,
    camera: cameraQu,
    activities: activitiesQu,
    words: wordsQu,
    settings: settingsQu,
    progress: progressQu,
    teacher: teacherQu,
    about: aboutQu,
    privacy: privacyQu,
    errors: errorsQu,
  },
};

export const quechuaCatalogMeta = quechuaMeta as QuechuaMeta;

export function isQuechuaValidated(): boolean {
  return quechuaCatalogMeta.status === 'validated';
}
