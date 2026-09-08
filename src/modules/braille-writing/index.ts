export {
  MIRROR_MAP,
  allSixDotPatterns,
  dotsKey,
  sameDotPattern,
  toReadingDots,
  toSlatePosition,
} from '@/modules/braille-writing/mirroring';
export { SlateModel, slateCellKey } from '@/modules/braille-writing/SlateModel';
export {
  WritingSession,
  expandTarget,
} from '@/modules/braille-writing/WritingSession';
export {
  canAdvanceLesson,
  getWritingLesson,
  getWritingLessons,
  promptsForLesson,
} from '@/modules/braille-writing/lessons';
export type { LessonKind, WritingLesson } from '@/modules/braille-writing/lessons';
export {
  diagnoseReadingCell,
  diagnoseSequence,
  diagnoseSlateCell,
  getDangerousPairs,
  getSymmetricLetters,
  readingDotsForChar,
} from '@/modules/braille-writing/validation';
export {
  PERKINS_KEY_TO_READING,
  SLATE_KEY_TO_WRITING,
  cellStartMessage,
  confirmOkMessage,
  describeWritingPositions,
  diagnosisMessage,
  helpMessage,
  lineEndMessage,
  parseAdvanceCommand,
  positionName,
  punchMessage,
  reviewMessage,
  spell,
} from '@/modules/braille-writing/voiceGuidance';
export type { VoiceT } from '@/modules/braille-writing/voiceGuidance';
export type {
  CellDiagnosis,
  SequenceDiagnosis,
  SlateCursor,
  SlateState,
  TargetCell,
  WritingErrorKind,
  WritingInstrument,
  WritingScreen,
} from '@/modules/braille-writing/types';
export {
  DEFAULT_SLATE_CELLS_PER_LINE,
  DEFAULT_SLATE_LINES,
  PERKINS_CHORD_MS,
  SLATE_FORMAT_STATUS,
  VOICE_COMMAND_EVENT,
} from '@/modules/braille-writing/types';
