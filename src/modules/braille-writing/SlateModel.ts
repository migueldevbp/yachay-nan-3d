import {
  DEFAULT_SLATE_CELLS_PER_LINE,
  DEFAULT_SLATE_LINES,
  SLATE_FORMAT_STATUS,
  type SlateCursor,
  type SlateState,
} from '@/modules/braille-writing/types';

export function slateCellKey(line: number, cell: number): string {
  return `${line}:${cell}`;
}

export class SlateModel {
  readonly formatStatus = SLATE_FORMAT_STATUS;
  readonly direction = 'right-to-left' as const;

  private readonly lineCount: number;
  private readonly width: number;
  private cursor: SlateCursor;
  private readonly cells: Map<string, number[]>;
  private history: Array<{ line: number; cell: number; dots: number[] }> = [];

  constructor(
    lines: number = DEFAULT_SLATE_LINES,
    cellsPerLine: number = DEFAULT_SLATE_CELLS_PER_LINE,
  ) {
    this.lineCount = Math.max(1, lines);
    this.width = Math.max(1, cellsPerLine);
    this.cursor = { line: 0, cell: 0 };
    this.cells = new Map();
  }

  getState(): SlateState {
    return {
      lines: this.lineCount,
      cellsPerLine: this.width,
      cursor: { ...this.cursor },
      cells: new Map(this.cells),
      direction: this.direction,
    };
  }

  getCursor(): SlateCursor {
    return { ...this.cursor };
  }

  humanCellNumber(): number {
    return this.cursor.cell + 1;
  }

  humanLineNumber(): number {
    return this.cursor.line + 1;
  }

  visualIndex(cell: number): number {
    return this.width - 1 - cell;
  }

  isRightmost(cell: number): boolean {
    return cell === 0;
  }

  getCell(line: number, cell: number): number[] {
    return [...(this.cells.get(slateCellKey(line, cell)) ?? [])];
  }

  currentDots(): number[] {
    return this.getCell(this.cursor.line, this.cursor.cell);
  }

  punch(writingDot: number): number[] {
    if (writingDot < 1 || writingDot > 6) {
      return this.currentDots();
    }
    const key = slateCellKey(this.cursor.line, this.cursor.cell);
    const current = this.cells.get(key) ?? [];
    this.history.push({
      line: this.cursor.line,
      cell: this.cursor.cell,
      dots: [...current],
    });
    const next = new Set(current);
    if (next.has(writingDot)) {
      next.delete(writingDot);
    } else {
      next.add(writingDot);
    }
    const sorted = [...next].sort((a, b) => a - b);
    this.cells.set(key, sorted);
    return sorted;
  }

  setCurrentDots(dots: number[]): void {
    const key = slateCellKey(this.cursor.line, this.cursor.cell);
    this.cells.set(
      key,
      [...new Set(dots.filter((dot) => dot >= 1 && dot <= 6))].sort(
        (a, b) => a - b,
      ),
    );
  }

  undo(): { dots: number[]; moved: boolean } {
    const last = this.history.pop();
    if (!last) {
      return { dots: this.currentDots(), moved: false };
    }
    this.cursor = { line: last.line, cell: last.cell };
    const key = slateCellKey(last.line, last.cell);
    if (last.dots.length === 0) {
      this.cells.delete(key);
    } else {
      this.cells.set(key, [...last.dots]);
    }
    return { dots: this.getCell(last.line, last.cell), moved: true };
  }

  confirmCell(): { lineWrapped: boolean; atEnd: boolean } {
    const atLastCell = this.cursor.cell >= this.width - 1;
    const atLastLine = this.cursor.line >= this.lineCount - 1;
    if (atLastCell && atLastLine) {
      return { lineWrapped: false, atEnd: true };
    }
    if (atLastCell) {
      this.cursor = { line: this.cursor.line + 1, cell: 0 };
      return { lineWrapped: true, atEnd: false };
    }
    this.cursor = { line: this.cursor.line, cell: this.cursor.cell + 1 };
    return { lineWrapped: false, atEnd: false };
  }

  moveCursor(deltaLine: number, deltaCell: number): void {
    const line = Math.min(
      this.lineCount - 1,
      Math.max(0, this.cursor.line + deltaLine),
    );
    const cell = Math.min(
      this.width - 1,
      Math.max(0, this.cursor.cell + deltaCell),
    );
    this.cursor = { line, cell };
  }

  goTo(line: number, cell: number): void {
    this.cursor = {
      line: Math.min(this.lineCount - 1, Math.max(0, line)),
      cell: Math.min(this.width - 1, Math.max(0, cell)),
    };
  }
}
