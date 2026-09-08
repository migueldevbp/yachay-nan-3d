import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { BrailleExplorer } from '@/pages/braille/BrailleExplorer';
import { BrailleReference } from '@/pages/braille/BrailleReference';
import { BraillePractice } from '@/pages/braille/BraillePractice';
import { BraillePage } from '@/pages/BraillePage';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AccessibilityProvider } from '@/modules/accessibility/AccessibilityProvider';
import { STORAGE_KEY } from '@/modules/accessibility/storage';
import { getInitialPreferences } from '@/modules/accessibility/presets';
import commonEs from '@/i18n/es/common.json';
import brailleEs from '@/i18n/es/braille.json';
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

function renderScreen(ui: ReactElement) {
  return render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AccessibilityProvider>
        <I18nProvider>{ui}</I18nProvider>
      </AccessibilityProvider>
    </MemoryRouter>,
  );
}

async function expectNoBlockingAxe(container: HTMLElement) {
  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: false },
    },
  });
  const blocking = results.violations.filter(
    (violation) =>
      violation.impact === 'critical' || violation.impact === 'serious',
  );
  expect(blocking).toEqual([]);
}

describe('accesibilidad Braille', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('axe: 0 violaciones serias en las tres pantallas', async () => {
    const explorer = renderScreen(<BrailleExplorer />);
    await expectNoBlockingAxe(explorer.container);
    explorer.unmount();

    const reference = renderScreen(<BrailleReference />);
    await expectNoBlockingAxe(reference.container);
    reference.unmount();

    const practice = renderScreen(<BraillePractice />);
    await expectNoBlockingAxe(practice.container);
  });

  it('completa un ejercicio solo con teclado', () => {
    renderScreen(<BraillePractice />);
    fireEvent.click(
      screen.getByRole('button', { name: brailleEs.startPractice }),
    );

    const pointOne = screen.getByRole('button', { name: 'Punto 1' });
    fireEvent.keyDown(pointOne, { key: '1' });
    fireEvent.keyDown(pointOne, { key: 'Enter' });

    expect(screen.getAllByText(brailleEs.correct).length).toBeGreaterThan(0);
  });

  it('el ejercicio se entiende con speech: false', () => {
    seedPreferences({ speech: false, sound: false });
    renderScreen(<BraillePractice />);
    fireEvent.click(
      screen.getByRole('button', { name: brailleEs.startPractice }),
    );
    fireEvent.keyDown(screen.getByRole('button', { name: 'Punto 1' }), {
      key: '1',
    });
    fireEvent.click(screen.getByRole('button', { name: brailleEs.confirm }));
    expect(screen.getAllByText(brailleEs.correct).length).toBeGreaterThan(0);
    expect(screen.queryByText(brailleEs.incorrect)).toBeNull();
  });

  it('el badge POR VALIDAR es visible en la referencia', () => {
    renderScreen(<BrailleReference />);
    expect(screen.getByText(commonEs.statusPending)).toBeTruthy();
    expect(screen.getByText(brailleEs.validationNote)).toBeTruthy();
    expect(
      screen.getByRole('link', { name: brailleEs.validationLink }),
    ).toBeTruthy();
  });

  it('en Modo Tranquilo el explorador muestra una letra por pantalla', () => {
    seedPreferences({ density: 'calm', motion: 'none' });
    renderScreen(<BrailleExplorer />);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(
      screen.getByRole('button', { name: brailleEs.previous }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: brailleEs.next })).toBeTruthy();
    expect(document.querySelector('.braille-explorer--calm')).not.toBeNull();
  });

  it('la página Braille tiene las tres pestañas', () => {
    renderScreen(<BraillePage />);
    const tablist = screen.getByRole('tablist');
    expect(
      within(tablist).getByRole('tab', { name: brailleEs.tabExplorer }),
    ).toBeTruthy();
    expect(
      within(tablist).getByRole('tab', { name: brailleEs.tabReference }),
    ).toBeTruthy();
    expect(
      within(tablist).getByRole('tab', { name: brailleEs.tabPractice }),
    ).toBeTruthy();
  });
});
