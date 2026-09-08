export type WritingInstrument = 'slate' | 'perkins' | 'physical';

export type WritingScreen =
  | 'mirror'
  | 'slate'
  | 'perkins'
  | 'dictation'
  | 'physical';

export interface SlateCursor {
  line: number;
  cell: number;
}

export interface SlateState {
  lines: number;
  cellsPerLine: number;
  cursor: SlateCursor;
  cells: Map<string, number[]>;
  direction: 'right-to-left';
}

export type WritingErrorKind =
  | 'missing_dots'
  | 'extra_dots'
  | 'mirrored'
  | 'wrong_letter'
  | 'reversed_order';

export interface CellDiagnosis {
  ok: boolean;
  kind?: WritingErrorKind;
  expectedReading: number[];
  actualReading: number[];
  expectedSlate: number[];
  actualSlate: number[];
  writtenLetter?: string;
  expectedLetter?: string;
  missingReading: number[];
  extraReading: number[];
  missingSlate: number[];
  extraSlate: number[];
  mirrorPair?: [string, string];
}

export interface SequenceDiagnosis {
  ok: boolean;
  kind?: WritingErrorKind;
  cells: CellDiagnosis[];
}

export interface TargetCell {
  label: string;
  readingDots: number[];
}

export const SLATE_FORMAT_STATUS = 'pending_validation' as const;
export const DEFAULT_SLATE_LINES = 4;
export const DEFAULT_SLATE_CELLS_PER_LINE = 27;
export const PERKINS_CHORD_MS = 150;
export const VOICE_COMMAND_EVENT = 'yachay:stt';
