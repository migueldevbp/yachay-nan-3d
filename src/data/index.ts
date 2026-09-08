import { loadCatalog } from '@/modules/content/loaders';

const catalog = loadCatalog();

export const resources = catalog.resources;
export const words = catalog.words;
export const sentences = catalog.sentences;
export const brailleTable = catalog.braille;
