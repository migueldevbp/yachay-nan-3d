import { describe, expect, it } from 'vitest';
import { SlateModel } from '@/modules/braille-writing';

describe('SlateModel', () => {
  it('la celda 0 es la más a la derecha', () => {
    const slate = new SlateModel(2, 4);
    expect(slate.isRightmost(0)).toBe(true);
    expect(slate.visualIndex(0)).toBe(3);
    expect(slate.visualIndex(3)).toBe(0);
  });

  it('el cursor avanza de derecha a izquierda', () => {
    const slate = new SlateModel(2, 3);
    expect(slate.getCursor()).toEqual({ line: 0, cell: 0 });
    slate.confirmCell();
    expect(slate.getCursor()).toEqual({ line: 0, cell: 1 });
    slate.confirmCell();
    expect(slate.getCursor()).toEqual({ line: 0, cell: 2 });
  });

  it('al terminar la línea salta a la siguiente por la derecha', () => {
    const slate = new SlateModel(2, 2);
    slate.confirmCell();
    const wrap = slate.confirmCell();
    expect(wrap.lineWrapped).toBe(true);
    expect(slate.getCursor()).toEqual({ line: 1, cell: 0 });
    expect(slate.isRightmost(slate.getCursor().cell)).toBe(true);
  });

  it('deshace la última perforación y no sale de los límites', () => {
    const slate = new SlateModel(1, 2);
    slate.punch(4);
    slate.punch(2);
    expect(slate.currentDots()).toEqual([2, 4]);
    slate.undo();
    expect(slate.currentDots()).toEqual([4]);
    slate.moveCursor(0, 8);
    expect(slate.getCursor().cell).toBe(1);
    slate.moveCursor(-3, -3);
    expect(slate.getCursor()).toEqual({ line: 0, cell: 0 });
  });

  it('en el extremo de la regleta no inventa otra línea', () => {
    const slate = new SlateModel(1, 1);
    const end = slate.confirmCell();
    expect(end.atEnd).toBe(true);
    expect(slate.getCursor()).toEqual({ line: 0, cell: 0 });
  });
});
