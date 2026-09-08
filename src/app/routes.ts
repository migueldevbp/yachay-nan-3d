export const APP_PHASE = '05b';

export const ROUTE_PATHS = {
  home: '/',
  alphabet: '/alfabeto',
  numbers: '/numeros',
  braille: '/braille',
  brailleWriting: '/braille/escritura',
  signs: '/senas',
  camera: '/camara',
  activities: '/actividades',
  words: '/palabras',
  progress: '/progreso',
  teacher: '/docente',
  about: '/acerca',
  privacy: '/privacidad',
} as const;

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

export type NavItemKey =
  | 'home'
  | 'alphabet'
  | 'numbers'
  | 'braille'
  | 'signs'
  | 'camera'
  | 'activities'
  | 'words'
  | 'progress'
  | 'teacher';

export interface NavItem {
  to: RoutePath;
  key: NavItemKey;
  essential: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: ROUTE_PATHS.home, key: 'home', essential: true },
  { to: ROUTE_PATHS.alphabet, key: 'alphabet', essential: true },
  { to: ROUTE_PATHS.numbers, key: 'numbers', essential: false },
  { to: ROUTE_PATHS.braille, key: 'braille', essential: false },
  { to: ROUTE_PATHS.signs, key: 'signs', essential: false },
  { to: ROUTE_PATHS.camera, key: 'camera', essential: true },
  { to: ROUTE_PATHS.activities, key: 'activities', essential: true },
  { to: ROUTE_PATHS.words, key: 'words', essential: false },
  { to: ROUTE_PATHS.progress, key: 'progress', essential: false },
  { to: ROUTE_PATHS.teacher, key: 'teacher', essential: false },
];

export const PAGE_ROUTES = [
  ROUTE_PATHS.home,
  ROUTE_PATHS.alphabet,
  ROUTE_PATHS.numbers,
  ROUTE_PATHS.braille,
  ROUTE_PATHS.signs,
  ROUTE_PATHS.camera,
  ROUTE_PATHS.activities,
  ROUTE_PATHS.words,
  ROUTE_PATHS.progress,
  ROUTE_PATHS.teacher,
  ROUTE_PATHS.about,
  ROUTE_PATHS.privacy,
] as const;

export const BREADCRUMB_LABEL_KEY: Record<
  Exclude<RoutePath, '/'>,
  NavItemKey | 'about' | 'privacy' | 'brailleWriting'
> = {
  [ROUTE_PATHS.alphabet]: 'alphabet',
  [ROUTE_PATHS.numbers]: 'numbers',
  [ROUTE_PATHS.braille]: 'braille',
  [ROUTE_PATHS.brailleWriting]: 'brailleWriting',
  [ROUTE_PATHS.signs]: 'signs',
  [ROUTE_PATHS.camera]: 'camera',
  [ROUTE_PATHS.activities]: 'activities',
  [ROUTE_PATHS.words]: 'words',
  [ROUTE_PATHS.progress]: 'progress',
  [ROUTE_PATHS.teacher]: 'teacher',
  [ROUTE_PATHS.about]: 'about',
  [ROUTE_PATHS.privacy]: 'privacy',
};
