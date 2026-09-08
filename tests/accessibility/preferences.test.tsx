import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Announcer } from '@/components/ui/Announcer';
import { CaptionBanner } from '@/components/ui/CaptionBanner';
import { AccessibilityProvider } from '@/modules/accessibility/AccessibilityProvider';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';
import { STORAGE_KEY } from '@/modules/accessibility/storage';
import { MEDIA_QUERIES } from '@/modules/accessibility/presets';

function stubMatchMedia(matches: Record<string, boolean>) {
  window.matchMedia = (query: string) =>
    ({
      matches: Boolean(matches[query]),
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    }) as MediaQueryList;
}

function Harness() {
  const {
    preferences,
    setPreference,
    toggleQuietMode,
    quietModeActive,
    say,
    resetPreferences,
  } = useAccessibility();

  return (
    <div>
      <p data-testid="theme">{preferences.theme}</p>
      <p data-testid="motion">{preferences.motion}</p>
      <p data-testid="density">{preferences.density}</p>
      <p data-testid="quiet">{String(quietModeActive)}</p>
      <p data-testid="options">{preferences.optionsPerActivity}</p>
      <button type="button" onClick={() => setPreference('theme', 'dark')}>
        tema oscuro
      </button>
      <button
        type="button"
        onClick={() => setPreference('theme', 'high-contrast')}
      >
        alto contraste
      </button>
      <button type="button" onClick={() => setPreference('textScale', 200)}>
        texto 200
      </button>
      <button type="button" onClick={() => setPreference('motion', 'none')}>
        sin movimiento
      </button>
      <button type="button" onClick={() => setPreference('density', 'calm')}>
        densidad calmada
      </button>
      <button type="button" onClick={toggleQuietMode}>
        modo tranquilo
      </button>
      <button type="button" onClick={() => say('Mensaje de prueba')}>
        anunciar
      </button>
      <button
        type="button"
        onClick={() => {
          setPreference('captions', false);
        }}
      >
        apagar subtítulos
      </button>
      <button type="button" onClick={resetPreferences}>
        restablecer
      </button>
      <Announcer />
      <CaptionBanner />
    </div>
  );
}

function renderHarness() {
  return render(
    <AccessibilityProvider>
      <Harness />
    </AccessibilityProvider>,
  );
}

describe('preferencias de accesibilidad', () => {
  beforeEach(() => {
    window.localStorage.clear();
    stubMatchMedia({});
  });

  afterEach(() => {
    stubMatchMedia({});
  });

  it('lee valores iniciales desde media queries', () => {
    stubMatchMedia({
      [MEDIA_QUERIES.moreContrast]: true,
      [MEDIA_QUERIES.reducedMotion]: true,
    });

    renderHarness();

    expect(document.documentElement.dataset.theme).toBe('high-contrast');
    expect(document.documentElement.dataset.motion).toBe('reduced');
    expect(screen.getByTestId('theme').textContent).toBe('high-contrast');
  });

  it('prefers-color-scheme oscuro aplica tema dark si no hay alto contraste', () => {
    stubMatchMedia({
      [MEDIA_QUERIES.dark]: true,
    });

    renderHarness();

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('cada cambio escribe el data-* correcto en html', () => {
    renderHarness();

    fireEvent.click(screen.getByRole('button', { name: 'alto contraste' }));
    expect(document.documentElement.dataset.theme).toBe('high-contrast');

    fireEvent.click(screen.getByRole('button', { name: 'texto 200' }));
    expect(document.documentElement.dataset.textScale).toBe('200');

    fireEvent.click(screen.getByRole('button', { name: 'sin movimiento' }));
    expect(document.documentElement.dataset.motion).toBe('none');

    fireEvent.click(screen.getByRole('button', { name: 'densidad calmada' }));
    expect(document.documentElement.dataset.density).toBe('calm');
  });

  it('persiste y rehidrata las preferencias', () => {
    const { unmount } = renderHarness();

    fireEvent.click(screen.getByRole('button', { name: 'tema oscuro' }));
    fireEvent.click(screen.getByRole('button', { name: 'texto 200' }));

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeTruthy();
    unmount();

    renderHarness();

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.textScale).toBe('200');
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('Modo Tranquilo aplica y revierte sin perder ajustes previos', () => {
    renderHarness();

    fireEvent.click(screen.getByRole('button', { name: 'tema oscuro' }));
    fireEvent.click(screen.getByRole('button', { name: 'modo tranquilo' }));

    expect(screen.getByTestId('quiet').textContent).toBe('true');
    expect(document.documentElement.dataset.motion).toBe('none');
    expect(document.documentElement.dataset.density).toBe('calm');
    expect(screen.getByTestId('options').textContent).toBe('2');
    expect(screen.getByTestId('theme').textContent).toBe('dark');

    fireEvent.click(screen.getByRole('button', { name: 'modo tranquilo' }));

    expect(screen.getByTestId('quiet').textContent).toBe('false');
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.dataset.density).toBe('standard');
    expect(document.documentElement.dataset.motion).toBe('full');
  });

  it('say() publica en aria-live y en el banner de subtítulos', async () => {
    renderHarness();

    fireEvent.click(screen.getByRole('button', { name: 'anunciar' }));

    expect(document.querySelector('.caption-banner__text')?.textContent).toBe(
      'Mensaje de prueba',
    );

    await waitFor(() => {
      expect(document.getElementById('announcer-polite')?.textContent).toBe(
        'Mensaje de prueba',
      );
    });
  });

  it('sin subtítulos, say() sigue anunciando en aria-live', async () => {
    renderHarness();

    fireEvent.click(screen.getByRole('button', { name: 'apagar subtítulos' }));
    fireEvent.click(screen.getByRole('button', { name: 'anunciar' }));

    expect(document.querySelector('.caption-banner')).toBeNull();

    await waitFor(() => {
      expect(document.getElementById('announcer-polite')?.textContent).toBe(
        'Mensaje de prueba',
      );
    });
  });
});
