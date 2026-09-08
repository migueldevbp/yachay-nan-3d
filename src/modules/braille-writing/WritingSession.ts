import { brailleToChar, expandSpec, textToBraille } from '@/modules/braille';
import { toReadingDots, toSlatePosition } from '@/modules/braille-writing/mirroring';
import type { TargetCell } from '@/modules/braille-writing/types';
import {
  diagnoseSequence,
  diagnoseSlateCell,
} from '@/modules/braille-writing/validation';

export function expandTarget(text: string): TargetCell[] {
  const cells: TargetCell[] = [];
  const specs = textToBraille(text);
  let letterIndex = 0;
  const letters = [...text].filter((char) => char.trim().length > 0);

  for (const spec of specs) {
    const expanded = expandSpec(spec);
    for (const cell of expanded) {
      const prefix = spec.prefixes?.[0];
      let label = letters[letterIndex] ?? '';
      if (
        prefix === 'capital' &&
        cell.dots.length === 2 &&
        cell.dots[0] === 4 &&
        cell.dots[1] === 6
      ) {
        label = 'capital';
      } else if (
        prefix === 'number' &&
        cell.dots.join(',') === '3,4,5,6'
      ) {
        label = 'number';
      } else if (label) {
        letterIndex += 1;
      }
      cells.push({ label, readingDots: [...cell.dots] });
    }
  }
  return cells;
}

export class WritingSession {
  readonly target: string;
  readonly cells: TargetCell[];
  private index = 0;
  private readonly writtenReading: number[][] = [];
  private correctCount = 0;

  constructor(target: string) {
    this.target = target;
    this.cells = expandTarget(target);
  }

  get current(): TargetCell | undefined {
    return this.cells[this.index];
  }

  get step(): number {
    return this.index;
  }

  get total(): number {
    return this.cells.length;
  }

  get correct(): number {
    return this.correctCount;
  }

  get done(): boolean {
    return this.index >= this.cells.length;
  }

  writtenLetters(): string[] {
    return this.writtenReading.map((dots) => brailleToChar(dots) ?? '');
  }

  diagnoseSlate(actualSlate: number[]) {
    const current = this.current;
    if (!current) {
      return undefined;
    }
    return diagnoseSlateCell(
      current.readingDots,
      actualSlate,
      current.label.length === 1 ? current.label.toLowerCase() : current.label,
    );
  }

  confirmSlate(actualSlate: number[], commitWrong = false) {
    const diagnosis = this.diagnoseSlate(actualSlate);
    if (!diagnosis) {
      return undefined;
    }
    if (!diagnosis.ok && !commitWrong) {
      return diagnosis;
    }
    this.writtenReading.push(toReadingDots(actualSlate));
    if (diagnosis.ok) {
      this.correctCount += 1;
    }
    this.index += 1;
    return diagnosis;
  }

  confirmReading(actualReading: number[]) {
    return this.confirmSlate(toSlatePosition(actualReading));
  }

  sequenceDiagnosis() {
    return diagnoseSequence(
      this.cells.map((cell) => cell.readingDots),
      this.writtenReading,
    );
  }
}
