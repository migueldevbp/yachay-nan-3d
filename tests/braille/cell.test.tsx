import { useState, type ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrailleCell } from '@/components/braille/BrailleCell';
import { describeCharacter, describeDots } from '@/modules/braille';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AccessibilityProvider } from '@/modules/accessibility/AccessibilityProvider';

function renderCell(ui: ReactElement) {
  return render(
    <AccessibilityProvider>
      <I18nProvider>{ui}</I18nProvider>
    </AccessibilityProvider>,
  );
}

describe('BrailleCell', () => {
  it('anuncia la letra A como punto 1 y no menciona puntos vacíos', () => {
    renderCell(<BrailleCell dots={[1]} label={describeCharacter('a', 'es')} />);
    const image = screen.getByRole('img');
    const name = image.getAttribute('aria-label') ?? '';
    expect(name).toMatch(/punto 1/);
    expect(name).not.toMatch(/punto 2/);
    expect(name).not.toMatch(/vacío/);
    expect(describeDots([1], 'es')).toBe('punto 1');
  });

  it('en modo interactivo alterna puntos con teclado 1-6', () => {
    function Host() {
      const [dots, setDots] = useState<number[]>([]);
      return <BrailleCell dots={dots} interactive onDotsChange={setDots} />;
    }
    renderCell(<Host />);

    const pointOne = screen.getByRole('button', { name: 'Punto 1' });
    fireEvent.keyDown(pointOne, { key: '1' });
    fireEvent.keyDown(pointOne, { key: '4' });
    expect(
      screen
        .getByRole('button', { name: 'Punto 1' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      screen
        .getByRole('button', { name: 'Punto 4' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('los puntos inactivos no aparecen en el nombre accesible', () => {
    renderCell(<BrailleCell dots={[1, 5]} />);
    const name = screen.getByRole('img').getAttribute('aria-label') ?? '';
    expect(name).toBe('puntos 1 y 5');
    expect(name).not.toMatch(/2/);
    expect(name).not.toMatch(/3/);
    expect(name).not.toMatch(/4/);
    expect(name).not.toMatch(/6/);
  });

  it('cada punto interactivo es un botón con aria-pressed', () => {
    renderCell(<BrailleCell dots={[1]} interactive />);
    const pointOne = screen.getByRole('button', { name: 'Punto 1' });
    expect(pointOne.getAttribute('aria-pressed')).toBe('true');
    const pointTwo = screen.getByRole('button', { name: 'Punto 2' });
    expect(pointTwo.getAttribute('aria-pressed')).toBe('false');
  });
});
