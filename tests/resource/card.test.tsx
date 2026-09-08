import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentProps } from 'react';
import { ResourceCard } from '@/components/resource/ResourceCard';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AccessibilityProvider } from '@/modules/accessibility/AccessibilityProvider';
import { getInitialPreferences } from '@/modules/accessibility/presets';
import { contentEngine } from '@/modules/content';
import alphabetEs from '@/i18n/es/alphabet.json';
import commonEs from '@/i18n/es/common.json';
import type { AccessibilityPreferences } from '@/modules/accessibility/types';
import type { EducationalResource } from '@/types/content';

const { say, getPrefs, setPrefs } = vi.hoisted(() => {
  const base = {
    theme: 'light' as const,
    textScale: 100 as const,
    motion: 'full' as const,
    sound: true,
    speech: true,
    speechRate: 1.0 as const,
    captions: true,
    signLanguage: true,
    braille: true,
    density: 'standard' as const,
    instructionLength: 'full' as const,
    optionsPerActivity: 3 as const,
    confirmNavigation: false,
    language: 'es' as const,
  };
  let prefs: AccessibilityPreferences = { ...base };
  return {
    say: vi.fn(),
    getPrefs: () => prefs,
    setPrefs: (next: AccessibilityPreferences) => {
      prefs = next;
    },
  };
});

vi.mock('@/modules/accessibility/useAccessibility', () => ({
  useAccessibility: () => ({
    preferences: getPrefs(),
    setPreference: vi.fn(),
    resetPreferences: vi.fn(),
    quietModeActive: false,
    toggleQuietMode: vi.fn(),
    say,
    caption: '',
    livePolite: '',
    liveAssertive: '',
  }),
}));

function renderCard(
  resource: EducationalResource,
  props: Partial<ComponentProps<typeof ResourceCard>> = {},
) {
  return render(
    <AccessibilityProvider>
      <I18nProvider>
        <ResourceCard resource={resource} variant="detailed" {...props} />
      </I18nProvider>
    </AccessibilityProvider>,
  );
}

describe('ResourceCard', () => {
  const letterA = contentEngine.getById('letter-upper-a');

  beforeEach(() => {
    say.mockClear();
    setPrefs({
      ...getInitialPreferences(),
      speech: true,
      signLanguage: true,
      braille: true,
      instructionLength: 'full',
    });
  });

  it('renderiza todos los canales disponibles', () => {
    expect(letterA).toBeTruthy();
    if (!letterA) {
      return;
    }
    renderCard(letterA);

    expect(screen.getByText('A', { selector: '.resource-character' })).toBeTruthy();
    expect(screen.getByText('árbol')).toBeTruthy();
    expect(screen.getByText(/En Braille:/)).toBeTruthy();
    expect(screen.getByText(commonEs.statusPending)).toBeTruthy();
    expect(screen.getByText(alphabetEs.signPending)).toBeTruthy();
    expect(screen.getByText('Fonema: a')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: alphabetEs.listen }),
    ).toBeTruthy();
    expect(screen.getByText(alphabetEs.hasPiece)).toBeTruthy();
    expect(screen.queryByRole('img', { name: letterA.associations[0]?.imageAlt })).toBeNull();
  });

  it('oculta los canales desactivados por preferencia', () => {
    if (!letterA) {
      return;
    }
    setPrefs({
      ...getInitialPreferences(),
      speech: false,
      signLanguage: false,
      braille: false,
      instructionLength: 'short',
    });
    renderCard(letterA);

    expect(screen.queryByText(/En Braille:/)).toBeNull();
    expect(screen.queryByText(alphabetEs.signPending)).toBeNull();
    expect(screen.queryByText(/Fonema:/)).toBeNull();
    expect(screen.queryByRole('button', { name: alphabetEs.listen })).toBeNull();
    expect(screen.getByText('A', { selector: '.resource-character' })).toBeTruthy();
    expect(screen.getByText('árbol')).toBeTruthy();
  });

  it('muestra placeholder con badge cuando falta la seña', () => {
    if (!letterA) {
      return;
    }
    renderCard(letterA);
    expect(screen.getByText(commonEs.statusPending)).toBeTruthy();
    expect(screen.getByText(alphabetEs.signPending)).toBeTruthy();
  });

  it('autoAnnounce llama say() una sola vez', () => {
    if (!letterA) {
      return;
    }
    renderCard(letterA, { autoAnnounce: true });
    expect(say).toHaveBeenCalledTimes(1);
    expect(String(say.mock.calls[0]?.[0])).toContain('Letra A');
    expect(String(say.mock.calls[0]?.[0])).toContain('A de árbol');
    expect(String(say.mock.calls[0]?.[0])).toContain('punto 1');
  });

  it('variant recognition acepta confidence y source undefined', () => {
    if (!letterA) {
      return;
    }
    renderCard(letterA, {
      variant: 'recognition',
      confidence: undefined,
      source: undefined,
    });
    expect(screen.getByText('A', { selector: '.resource-character' })).toBeTruthy();
    expect(screen.queryByText(/Confianza:/)).toBeNull();
    expect(screen.queryByText(/Origen:/)).toBeNull();
  });

  it('muestra confianza y origen cuando llegan definidos', () => {
    if (!letterA) {
      return;
    }
    renderCard(letterA, {
      variant: 'recognition',
      confidence: 0.91,
      source: 'fiducial',
    });
    expect(screen.getByText('Confianza: 91 por ciento')).toBeTruthy();
    expect(screen.getByText(alphabetEs.source_fiducial)).toBeTruthy();
  });
});
