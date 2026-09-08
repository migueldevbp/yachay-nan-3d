import { z } from 'zod';
import { renderBraille } from '@/utils/braille';
import type { BrailleSpec } from '@/types/braille';
import type {
  EducationalResource,
  WordResource,
  SentenceResource,
} from '@/types/content';

export const validationStatusSchema = z.enum([
  'validated',
  'pending_validation',
  'draft',
]);

export const resourceTypeSchema = z.enum([
  'letter',
  'number',
  'syllable',
  'word',
  'sentence',
]);

export const caseFormSchema = z.enum(['uppercase', 'lowercase', 'none']);

export const languageCodeSchema = z.enum(['es', 'qu']);

export const braillePrefixSchema = z.enum(['number', 'capital']);

const dotsSchema = z
  .array(z.number().int().min(1).max(6))
  .min(0)
  .refine((dots) => new Set(dots).size === dots.length, {
    message: 'Los puntos Braille no deben repetirse en una celda',
  });

export const storedBrailleSchema = z.object({
  dots: dotsSchema,
  extraCells: z.array(dotsSchema).optional(),
  prefixes: z.array(braillePrefixSchema).optional(),
  validation: validationStatusSchema,
});

export const visionSchema = z.object({
  modelClass: z.string().min(1),
  fiducialId: z.number().int().positive().optional(),
  minConfidence: z.number().min(0).max(1),
  hasPhysicalPiece: z.boolean(),
});

export const associationSchema = z.object({
  word: z.string().min(1),
  imageUrl: z.string().min(1).optional(),
  imageAlt: z.string().min(1),
});

export const signResourceSchema = z.object({
  assetUrl: z.string().min(1),
  assetType: z.enum(['image', 'video', 'lottie']),
  signLanguage: z.literal('LSP'),
  description: z.string().min(1),
  validation: validationStatusSchema,
});

export const mediaSchema = z
  .object({
    imageUrl: z.string().min(1).optional(),
    imageAlt: z.string().min(1).optional(),
    audioUrl: z.string().min(1).optional(),
    sign: signResourceSchema.optional(),
    piece3dUrl: z.string().min(1).optional(),
  })
  .superRefine((media, ctx) => {
    if (media.imageUrl && !media.imageAlt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Toda imagen requiere imageAlt',
        path: ['imageAlt'],
      });
    }
  });

export const localizedResourceSchema = z.object({
  name: z.string().min(1),
  instruction: z.string().min(1),
  instructionShort: z.string().min(1),
  example: z.string().min(1).optional(),
  validation: validationStatusSchema,
});

const resourceBaseSchema = z.object({
  id: z.string().min(1),
  type: resourceTypeSchema,
  character: z.string().min(1),
  caseForm: caseFormSchema,
  order: z.number().int().positive(),
  difficulty: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  phoneme: z.string().min(1).optional(),
  braille: storedBrailleSchema,
  associations: z.array(associationSchema),
  media: mediaSchema,
  vision: visionSchema,
  i18n: z.object({
    es: localizedResourceSchema.optional(),
    qu: localizedResourceSchema.optional(),
  }),
  tags: z.array(z.string()),
  relatedIds: z.array(z.string()),
  validation: validationStatusSchema,
});

export const storedResourceSchema = resourceBaseSchema;

export const storedWordSchema = resourceBaseSchema.extend({
  type: z.literal('word'),
  syllables: z.array(z.string().min(1)).min(1),
  constituentChars: z.array(z.string().min(1)).min(1),
  formableWithMvpPieces: z.boolean(),
  requiredPieces: z.array(z.string().min(1)).min(1),
  isDemoTarget: z.boolean().optional(),
});

export const storedSentenceSchema = resourceBaseSchema.extend({
  type: z.literal('sentence'),
  wordIds: z.array(z.string().min(1)).min(1),
});

export const brailleGlyphSchema = z.object({
  id: z.string().min(1),
  character: z.string().min(1),
  dots: dotsSchema,
  category: z.enum(['letter', 'accent', 'prefix']),
  prefixKind: braillePrefixSchema.optional(),
  validation: validationStatusSchema,
});

export const brailleTableSchema = z.object({
  meta: z.object({
    system: z.literal('braille-es-grade1'),
    cells: z.literal(6),
    validation: validationStatusSchema,
  }),
  glyphs: z.array(brailleGlyphSchema).min(1),
});

export function formatZodError(path: string, error: z.ZodError): string {
  const issue = error.issues[0];
  const field = issue?.path.join('.') || '(raíz)';
  const message = issue?.message ?? 'error desconocido';
  return `Contenido inválido en ${path}: ${field} — ${message}`;
}

export function parseWithSchema<T>(
  schema: z.ZodType<T>,
  data: unknown,
  path: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(formatZodError(path, result.error));
  }
  return result.data;
}

export function hydrateBraille(
  stored: z.infer<typeof storedBrailleSchema>,
): BrailleSpec {
  return {
    ...stored,
    unicode: renderBraille(stored),
  };
}

export function hydrateResource(
  stored: z.infer<typeof storedResourceSchema>,
): EducationalResource {
  return {
    ...stored,
    braille: hydrateBraille(stored.braille),
  };
}

export function hydrateWord(
  stored: z.infer<typeof storedWordSchema>,
): WordResource {
  return {
    ...stored,
    braille: hydrateBraille(stored.braille),
  };
}

export function hydrateSentence(
  stored: z.infer<typeof storedSentenceSchema>,
): SentenceResource {
  return {
    ...stored,
    braille: hydrateBraille(stored.braille),
  };
}
