import { fireEvent, render, screen, within } from '@testing-library/react';
import {
  MemoryRouter,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { createAppRouter, routeTree } from '@/app/router';
import { AlphabetPage } from '@/pages/AlphabetPage';
import { NumbersPage } from '@/pages/NumbersPage';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AccessibilityProvider } from '@/modules/accessibility/AccessibilityProvider';
import { getInitialPreferences } from '@/modules/accessibility/presets';
import { STORAGE_KEY } from '@/modules/accessibility/storage';
import alphabetEs from '@/i18n/es/alphabet.json';
import numbersEs from '@/i18n/es/numbers.json';
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

function renderScreen(ui: ReactElement, path = '/alfabeto') {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AccessibilityProvider>
        <I18nProvider>{ui}</I18nProvider>
      </AccessibilityProvider>
    </MemoryRouter>,
  );
}

function renderApp(path: string) {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>{routeTree}</Routes>
    </MemoryRouter>,
  );
}

function renderHash(path: string) {
  window.history.replaceState(null, '', `/#${path}`);
  return render(
    <RouterProvider
      router={createAppRouter()}
      future={{ v7_startTransition: true }}
    />,
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

describe('accesibilidad de recursos', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('axe: 0 violaciones serias en las tres pantallas', async () => {
    const alphabet = renderScreen(<AlphabetPage />);
    await expectNoBlockingAxe(alphabet.container);
    alphabet.unmount();

    const numbers = renderScreen(<NumbersPage />, '/numeros');
    await expectNoBlockingAxe(numbers.container);
    numbers.unmount();

    const detail = renderApp('/recurso/letter-upper-a');
    await expectNoBlockingAxe(detail.container);
  });

  it('el grid del alfabeto se recorre con flechas', () => {
    renderScreen(<AlphabetPage />);
    const grid = screen.getByRole('grid', { name: alphabetEs.gridLabel });
    const links = within(grid).getAllByRole('link');
    expect(links.length).toBe(29);

    links[0]?.focus();
    fireEvent.keyDown(links[0] as HTMLElement, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(links[1]);

    fireEvent.keyDown(links[1] as HTMLElement, { key: 'End' });
    expect(document.activeElement).toBe(links[28]);

    fireEvent.keyDown(links[28] as HTMLElement, { key: 'Home' });
    expect(document.activeElement).toBe(links[0]);
  });

  it('las pestañas se recorren con flechas', () => {
    renderScreen(<AlphabetPage />);
    const tablist = screen.getByRole('tablist', { name: alphabetEs.tabsLabel });
    const upper = within(tablist).getByRole('tab', {
      name: alphabetEs.tabUppercase,
    });
    const lower = within(tablist).getByRole('tab', {
      name: alphabetEs.tabLowercase,
    });

    upper.focus();
    fireEvent.keyDown(upper, { key: 'ArrowRight' });
    expect(lower.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(lower);
  });

  it('recorre el alfabeto completo solo con teclado', () => {
    renderScreen(<AlphabetPage />);
    const grid = screen.getByRole('grid');
    const links = within(grid).getAllByRole('link');
    links[0]?.focus();

    for (let step = 0; step < links.length - 1; step += 1) {
      fireEvent.keyDown(document.activeElement as HTMLElement, {
        key: 'ArrowRight',
      });
    }

    expect(document.activeElement).toBe(links[links.length - 1]);
    expect(links.length).toBe(29);
  });

  it('en Modo Tranquilo el alfabeto es una lista sin grid', () => {
    seedPreferences({ density: 'calm', motion: 'none' });
    renderScreen(<AlphabetPage />);
    expect(screen.queryByRole('grid')).toBeNull();
    expect(
      screen.getByRole('list', { name: alphabetEs.listLabel }),
    ).toBeTruthy();
  });

  it('las 5 letras del MVP muestran el indicador de pieza física', () => {
    renderScreen(<AlphabetPage />);
    expect(screen.getAllByText(alphabetEs.hasPiece)).toHaveLength(5);
  });

  it('/recurso/letter-a-uppercase carga la A por hash', () => {
    renderHash('/recurso/letter-a-uppercase');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Letra A' }),
    ).toBeTruthy();
    expect(
      screen.getByText('A', { selector: '.resource-character' }),
    ).toBeTruthy();
  });

  it('el detalle anuncia el recurso y el foco puede ir al h1', () => {
    renderApp('/recurso/letter-upper-a');
    const heading = screen.getByRole('heading', { level: 1, name: 'Letra A' });
    expect(heading).toBeTruthy();
    expect(document.activeElement).toBe(heading);
    expect(screen.getByText(alphabetEs.practiceTitle)).toBeTruthy();
  });

  it('la página de números tiene el título accesible', () => {
    renderScreen(<NumbersPage />, '/numeros');
    expect(
      screen.getByRole('heading', { level: 1, name: numbersEs.title }),
    ).toBeTruthy();
  });
});
