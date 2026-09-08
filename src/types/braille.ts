import type { ValidationStatus } from '@/types/content';

export type BraillePrefix = 'number' | 'capital';

/**
 * Una celda de 6 puntos, más prefijos y celdas extra (CH, LL, dígitos).
 * `unicode` se deriva en código; no se escribe a mano en JSON.
 */
export interface BrailleSpec {
  dots: number[];
  extraCells?: number[][];
  unicode: string;
  prefixes?: BraillePrefix[];
  validation: ValidationStatus;
}

export type BrailleGlyphCategory = 'letter' | 'accent' | 'prefix';

export interface BrailleGlyph {
  id: string;
  character: string;
  dots: number[];
  category: BrailleGlyphCategory;
  prefixKind?: BraillePrefix;
  validation: ValidationStatus;
}

export interface BrailleTable {
  meta: {
    system: 'braille-es-grade1';
    cells: 6;
    validation: ValidationStatus;
  };
  glyphs: BrailleGlyph[];
}
