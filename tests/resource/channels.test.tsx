import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceCard } from '@/components/resource/ResourceCard';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AccessibilityProvider } from '@/modules/accessibility/AccessibilityProvider';
import { getInitialPreferences } from '@/modules/accessibility/presets';
import { STORAGE_KEY } from '@/modules/accessibility/storage';
import { contentEngine } from '@/modules/content';
import type { ReactElement } from 'react';

function seedPreferences(
  patch: Partial<ReturnType<typeof getInitialPreferences>>,
) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      preferences: { ...getInitialPreferences(), ...patch },
      quietMode: { active: false, snapshot: null },
    }),
  );
}

function renderCard(ui: ReactElement) {
  return render(
    <AccessibilityProvider>
      <I18nProvider>{ui}</I18nProvider>
    </AccessibilityProvider>,
  );
}

describe('canales de ResourceCard', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('con speech, sound e imágenes apagados sigue teniendo carácter, palabra y Braille', () => {
    seedPreferences({
      speech: false,
      sound: false,
      braille: true,
      signLanguage: false,
    });

    const letterA = contentEngine.getById('letter-upper-a');
    expect(letterA).toBeTruthy();
    if (!letterA) {
      return;
    }

    renderCard(<ResourceCard resource={letterA} variant="detailed" />);

    expect(
      screen.getByText('A', { selector: '.resource-character' }),
    ).toBeTruthy();
    expect(screen.getByText('árbol')).toBeTruthy();
    expect(screen.getByText(/En Braille:/)).toBeTruthy();
    expect(screen.getByText(/punto 1/)).toBeTruthy();
    expect(screen.queryByRole('img', { name: 'Dibujo de un árbol' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Escuchar' })).toBeNull();
  });

  it('los números muestran dos celdas Braille (signo de número + dígito)', () => {
    const numberOne = contentEngine.getById('number-1');
    expect(numberOne).toBeTruthy();
    if (!numberOne) {
      return;
    }

    const { container } = renderCard(
      <ResourceCard resource={numberOne} variant="detailed" />,
    );

    const cells = container.querySelectorAll('.braille-string .braille-cell');
    expect(cells.length).toBe(2);
    expect(screen.getByText(/En Braille:/)).toBeTruthy();
  });
});
