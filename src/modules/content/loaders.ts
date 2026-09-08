import {
  formatZodError,
  hydrateResource,
  hydrateSentence,
  hydrateWord,
  parseWithSchema,
  storedResourceSchema,
  storedSentenceSchema,
  storedWordSchema,
  brailleTableSchema,
} from '@/modules/content/schemas';
import type {
  EducationalResource,
  SentenceResource,
  WordResource,
} from '@/types/content';
import type { BrailleTable } from '@/types/braille';
import uppercaseJson from '@/data/alphabet/uppercase.json';
import lowercaseJson from '@/data/alphabet/lowercase.json';
import digitsJson from '@/data/numbers/digits.json';
import syllablesJson from '@/data/syllables/basic-es.json';
import wordsJson from '@/data/words/basic-es.json';
import sentencesJson from '@/data/sentences/basic-es.json';
import brailleJson from '@/data/braille/spanish-grade1.json';

export interface ContentCatalog {
  resources: EducationalResource[];
  words: WordResource[];
  sentences: SentenceResource[];
  braille: BrailleTable;
}

function parseList<T>(
  schema: Parameters<typeof parseWithSchema<T>>[0],
  data: unknown,
  path: string,
): T[] {
  if (!Array.isArray(data)) {
    throw new Error(
      `Contenido inválido en ${path}: (raíz) — se esperaba un arreglo`,
    );
  }
  return data.map((item, index) =>
    parseWithSchema(schema, item, `${path}[${index}]`),
  );
}

export function loadCatalog(): ContentCatalog {
  const letters = [
    ...parseList(
      storedResourceSchema,
      uppercaseJson,
      'src/data/alphabet/uppercase.json',
    ).map(hydrateResource),
    ...parseList(
      storedResourceSchema,
      lowercaseJson,
      'src/data/alphabet/lowercase.json',
    ).map(hydrateResource),
  ];

  const numbers = parseList(
    storedResourceSchema,
    digitsJson,
    'src/data/numbers/digits.json',
  ).map(hydrateResource);

  const syllables = parseList(
    storedResourceSchema,
    syllablesJson,
    'src/data/syllables/basic-es.json',
  ).map(hydrateResource);

  const words = parseList(
    storedWordSchema,
    wordsJson,
    'src/data/words/basic-es.json',
  ).map(hydrateWord);

  const sentences = parseList(
    storedSentenceSchema,
    sentencesJson,
    'src/data/sentences/basic-es.json',
  ).map(hydrateSentence);

  const brailleParsed = brailleTableSchema.safeParse(brailleJson);
  if (!brailleParsed.success) {
    throw new Error(
      formatZodError(
        'src/data/braille/spanish-grade1.json',
        brailleParsed.error,
      ),
    );
  }

  const resources: EducationalResource[] = [
    ...letters,
    ...numbers,
    ...syllables,
    ...words,
    ...sentences,
  ];

  return {
    resources,
    words,
    sentences,
    braille: brailleParsed.data,
  };
}
