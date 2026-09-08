import type { BrailleSpec } from '@/types/braille';
import type { VisionSpec } from '@/types/vision';

export type ResourceType =
  'letter' | 'number' | 'syllable' | 'word' | 'sentence';

export type CaseForm = 'uppercase' | 'lowercase' | 'none';

export type ValidationStatus = 'validated' | 'pending_validation' | 'draft';

export type LanguageCode = 'es' | 'qu';

export interface ResourceAssociation {
  word: string;
  imageUrl?: string;
  imageAlt: string;
}

export interface SignResource {
  assetUrl: string;
  assetType: 'image' | 'video' | 'lottie';
  signLanguage: 'LSP';
  description: string;
  validation: ValidationStatus;
}

export interface ResourceMedia {
  imageUrl?: string;
  imageAlt?: string;
  audioUrl?: string;
  sign?: SignResource;
  piece3dUrl?: string;
}

export interface LocalizedResource {
  name: string;
  instruction: string;
  instructionShort: string;
  example?: string;
  validation: ValidationStatus;
}

export interface EducationalResource {
  id: string;
  type: ResourceType;
  character: string;
  caseForm: CaseForm;
  order: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  phoneme?: string;
  braille: BrailleSpec;
  associations: ResourceAssociation[];
  media: ResourceMedia;
  vision: VisionSpec;
  i18n: Partial<Record<LanguageCode, LocalizedResource>>;
  tags: string[];
  relatedIds: string[];
  validation: ValidationStatus;
}

export interface WordResource extends EducationalResource {
  type: 'word';
  syllables: string[];
  constituentChars: string[];
  formableWithMvpPieces: boolean;
  requiredPieces: string[];
  isDemoTarget?: boolean;
}

export type Word = WordResource;

export interface SentenceResource extends EducationalResource {
  type: 'sentence';
  wordIds: string[];
}

export interface ValidationSummary {
  validated: number;
  pending: number;
  draft: number;
}
