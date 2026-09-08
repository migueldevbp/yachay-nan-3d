import type { EducationalResource } from '@/types/content';

export type ChannelId =
  | 'character'
  | 'braille'
  | 'word'
  | 'image'
  | 'sign'
  | 'phoneme'
  | 'speech';

export type ResourceCardVariant = 'compact' | 'detailed' | 'recognition';

export type RecognitionSource = 'model' | 'fiducial' | 'manual';

export type ResourceAction =
  | { type: 'listen' }
  | { type: 'open'; id: string }
  | { type: 'practice'; id: string };

export interface ResourceCardProps {
  resource: EducationalResource;
  variant: ResourceCardVariant;
  channels?: Partial<Record<ChannelId, boolean>>;
  onAction?: (action: ResourceAction) => void;
  autoAnnounce?: boolean;
  /**
   * Fase 12: confianza del reconocedor. Aquí puede llegar undefined.
   */
  confidence?: number;
  /**
   * Fase 12: origen de la detección. Aquí puede llegar undefined.
   */
  source?: RecognitionSource;
}

export interface ChannelFlags {
  character: boolean;
  braille: boolean;
  word: boolean;
  image: boolean;
  sign: boolean;
  phoneme: boolean;
  speech: boolean;
}
