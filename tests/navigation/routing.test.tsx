import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import {
  MemoryRouter,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { createAppRouter, routeTree } from '@/app/router';
import { PAGE_ROUTES, ROUTE_PATHS } from '@/app/routes';
import commonEs from '@/i18n/es/common.json';
import errorsEs from '@/i18n/es/errors.json';
import navigationEs from '@/i18n/es/navigation.json';
import aboutEs from '@/i18n/es/about.json';
import alphabetEs from '@/i18n/es/alphabet.json';
import activitiesEs from '@/i18n/es/activities.json';
import brailleEs from '@/i18n/es/braille.json';
import cameraEs from '@/i18n/es/camera.json';
import homeEs from '@/i18n/es/home.json';
import numbersEs from '@/i18n/es/numbers.json';
import privacyEs from '@/i18n/es/privacy.json';
import progressEs from '@/i18n/es/progress.json';
import signsEs from '@/i18n/es/signs.json';
import teacherEs from '@/i18n/es/teacher.json';
import wordsEs from '@/i18n/es/words.json';

const PAGE_TITLES: Record<(typeof PAGE_ROUTES)[number], string> = {
  [ROUTE_PATHS.home]: homeEs.title,
  [ROUTE_PATHS.alphabet]: alphabetEs.title,
  [ROUTE_PATHS.numbers]: numbersEs.title,
  [ROUTE_PATHS.braille]: brailleEs.title,
  [ROUTE_PATHS.signs]: signsEs.title,
  [ROUTE_PATHS.camera]: cameraEs.title,
  [ROUTE_PATHS.activities]: activitiesEs.title,
  [ROUTE_PATHS.words]: wordsEs.title,
  [ROUTE_PATHS.progress]: progressEs.title,
  [ROUTE_PATHS.teacher]: teacherEs.title,
  [ROUTE_PATHS.about]: aboutEs.title,
  [ROUTE_PATHS.privacy]: privacyEs.title,
};

function hashFor(path: string): string {
  return path === '/' ? '#/' : `#${path}`;
}

function renderHash(path: string) {
  window.history.replaceState(null, '', `/${hashFor(path)}`);
  return render(
    <RouterProvider
      router={createAppRouter()}
      future={{ v7_startTransition: true }}
    />,
  );
}

function renderMemory(initialEntry: string) {
  return render(
    <MemoryRouter
      initialEntries={[initialEntry]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>{routeTree}</Routes>
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

describe('enrutado', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
    document.documentElement.lang = 'es';
  });

  it.each(PAGE_ROUTES)('renderiza la página %s', (path) => {
    renderHash(path);
    expect(
      screen.getByRole('heading', { level: 1, name: PAGE_TITLES[path] }),
    ).toBeTruthy();
  });

  it('una ruta inexistente muestra NotFound', () => {
    renderHash('/no-existe');
    expect(
      screen.getByRole('heading', { level: 1, name: errorsEs.notFoundTitle }),
    ).toBeTruthy();
  });

  it('recarga directa con hash #/braille', () => {
    renderHash(ROUTE_PATHS.braille);
    expect(
      screen.getByRole('heading', { level: 1, name: navigationEs.braille }),
    ).toBeTruthy();
  });

  it('al cambiar de ruta el foco va al h1', async () => {
    renderMemory('/');
    fireEvent.click(
      screen.getAllByRole('link', {
        name: navigationEs.braille,
      })[0] as HTMLElement,
    );

    await waitFor(() => {
      const heading = screen.getByRole('heading', {
        level: 1,
        name: navigationEs.braille,
      });
      expect(document.activeElement).toBe(heading);
    });
  });

  it('Modo Tranquilo deja solo las secciones esenciales en la navegación', () => {
    renderHash(ROUTE_PATHS.home);
    fireEvent.click(
      screen.getByRole('button', { name: navigationEs.settings }),
    );
    fireEvent.click(screen.getByRole('radio', { name: /Calmado/i }));

    const nav = screen.getByRole('navigation', { name: commonEs.mainNav });
    expect(
      within(nav).getByRole('link', { name: navigationEs.home }),
    ).toBeTruthy();
    expect(
      within(nav).getByRole('link', { name: navigationEs.alphabet }),
    ).toBeTruthy();
    expect(
      within(nav).getByRole('link', { name: navigationEs.camera }),
    ).toBeTruthy();
    expect(
      within(nav).getByRole('link', { name: navigationEs.activities }),
    ).toBeTruthy();
    expect(
      within(nav).queryByRole('link', { name: navigationEs.braille }),
    ).toBeNull();
    expect(
      within(nav).queryByRole('link', { name: navigationEs.numbers }),
    ).toBeNull();
  });

  it('cambiar a quechua avisa y pone lang=qu', async () => {
    renderHash(ROUTE_PATHS.home);
    fireEvent.change(
      screen.getByRole('combobox', { name: commonEs.language }),
      {
        target: { value: 'qu' },
      },
    );

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('qu');
    });
    expect(screen.getAllByText(commonEs.quechuaWarning).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText(commonEs.statusPending)).toBeTruthy();
  });

  it('axe: 0 violaciones serias en layout, navegación y las 13 páginas', async () => {
    for (const path of PAGE_ROUTES) {
      const { container, unmount } = renderHash(path);
      await expectNoBlockingAxe(container);
      unmount();
    }
  });
});
