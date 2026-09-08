import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import type { ReactElement } from 'react';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AccessibilityProvider } from '@/modules/accessibility/AccessibilityProvider';
import { Announcer } from '@/components/ui/Announcer';
import { CaptionBanner } from '@/components/ui/CaptionBanner';
import { STORAGE_KEY } from '@/modules/accessibility/storage';
import { getInitialPreferences } from '@/modules/accessibility/presets';
import { VOICE_COMMAND_EVENT } from '@/modules/braille-writing';
import { BrailleWriting } from '@/pages/braille/BrailleWriting';
import { LearnMirror } from '@/pages/braille/writing/LearnMirror';
import { SlatePractice } from '@/pages/braille/writing/SlatePractice';
import { PerkinsPractice } from '@/pages/braille/writing/PerkinsPractice';
import { DictationMode } from '@/pages/braille/writing/DictationMode';
import { PhysicalPractice } from '@/pages/braille/writing/PhysicalPractice';
import brailleEs from '@/i18n/es/braille.json';
import commonEs from '@/i18n/es/common.json';

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
        <I18nProvider>
          {ui}
          <CaptionBanner />
          <Announcer />
        </I18nProvider>
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

function liveText() {
  return (
    document.getElementById('announcer-polite')?.textContent ??
    document.getElementById('announcer-assertive')?.textContent ??
    ''
  );
}

function punch(keys: string[]) {
  for (const key of keys) {
    fireEvent.keyDown(window, { key });
  }
  fireEvent.keyDown(window, { key: ' ' });
}

describe('escritura Braille a ojos cerrados', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('axe: 0 violaciones serias en las cinco pantallas', async () => {
    const screens = [
      <LearnMirror key="m" />,
      <SlatePractice key="s" />,
      <PerkinsPractice key="p" />,
      <DictationMode key="d" />,
      <PhysicalPractice key="f" />,
    ];
    for (const ui of screens) {
      const view = renderScreen(ui);
      await expectNoBlockingAxe(view.container);
      view.unmount();
    }
  });

  it('completa la lección de vocales solo con teclado', async () => {
    renderScreen(<SlatePractice lessonId={3} />);
    expect(screen.getByText('a')).toBeTruthy();

    punch(['j']);
    await waitFor(() => {
      expect(screen.getByText('e')).toBeTruthy();
    });

    punch(['j', 'd']);
    await waitFor(() => {
      expect(screen.getByText('i')).toBeTruthy();
    });

    punch(['s', 'k']);
    await waitFor(() => {
      expect(screen.getByText('o')).toBeTruthy();
    });

    punch(['j', 'l', 'd']);
    await waitFor(() => {
      expect(screen.getByText('u')).toBeTruthy();
    });

    punch(['j', 'l', 'f']);
    await waitFor(() => {
      expect(screen.getAllByText(/Lección terminada/).length).toBeGreaterThan(0);
    });
    await waitFor(() => {
      expect(liveText().length).toBeGreaterThan(0);
    });
  });

  it('la misma lección se entiende con speech: false', async () => {
    seedPreferences({ speech: false, sound: false, captions: true });
    renderScreen(<SlatePractice lessonId={3} />);
    punch(['j']);
    await waitFor(() => {
      expect(screen.getByText('e')).toBeTruthy();
    });
    await waitFor(() => {
      expect(
        document.querySelector('.caption-banner__text')?.textContent?.length,
      ).toBeGreaterThan(0);
      expect(liveText().length).toBeGreaterThan(0);
    });
  });

  it('escribir A sin invertir se diagnostica como espejo', async () => {
    renderScreen(<SlatePractice lessonId={3} />);
    fireEvent.click(screen.getByRole('button', { name: brailleEs.pos1 }));
    fireEvent.click(screen.getByRole('button', { name: brailleEs.confirm }));
    await waitFor(() => {
      expect(screen.getAllByText(brailleEs.voiceMirrored).length).toBeGreaterThan(
        0,
      );
    });
    expect(screen.getByText('a')).toBeTruthy();
  });

  it('la A se anuncia arriba a la derecha', async () => {
    renderScreen(<SlatePractice lessonId={3} />);
    fireEvent.keyDown(window, { key: 'j' });
    await waitFor(() => {
      expect(screen.getByRole('img', { name: brailleEs.pos4 })).toBeTruthy();
    });
    await waitFor(() => {
      const spoken = `${liveText()} ${document.querySelector('.caption-banner__text')?.textContent ?? ''}`;
      expect(spoken).toMatch(/Punto 1 de lectura/i);
    });
  });

  it('el acorde Perkins F+J registra una sola celda 1-4', async () => {
    renderScreen(<PerkinsPractice />);
    fireEvent.keyDown(window, { key: 'f' });
    fireEvent.keyDown(window, { key: 'j' });
    fireEvent.keyUp(window, { key: 'f' });
    fireEvent.keyUp(window, { key: 'j' });
    await waitFor(
      () => {
        expect(screen.getByText(brailleEs.modeSlate)).toBeTruthy();
      },
      { timeout: 800 },
    );
    expect(screen.queryByText(brailleEs.voiceIncorrect)).toBeNull();
  });

  it('la regleta física avanza con espacio y con comando de voz', async () => {
    renderScreen(<PhysicalPractice />);
    expect(screen.getAllByText(/letra m/i).length).toBeGreaterThan(0);
    fireEvent.keyDown(window, { key: ' ' });
    await waitFor(() => {
      expect(screen.getAllByText(/letra a/i).length).toBeGreaterThan(0);
    });
    window.dispatchEvent(
      new CustomEvent(VOICE_COMMAND_EVENT, { detail: 'listo' }),
    );
    await waitFor(() => {
      expect(screen.getAllByText(brailleEs.physicalDone).length).toBeGreaterThan(
        0,
      );
    });
  });

  it('el badge POR VALIDAR está visible en escritura', () => {
    renderScreen(<BrailleWriting />);
    expect(screen.getByText(commonEs.statusPending)).toBeTruthy();
    expect(screen.getByText(brailleEs.writingValidationNote)).toBeTruthy();
    expect(
      screen.getByRole('link', { name: brailleEs.writingValidationLink }),
    ).toBeTruthy();
  });

  it('MirrorExplainer describe el estado en texto', () => {
    renderScreen(<LearnMirror />);
    fireEvent.click(screen.getByRole('button', { name: brailleEs.next }));
    fireEvent.click(screen.getByRole('button', { name: brailleEs.next }));
    expect(screen.getByText(brailleEs.mirrorStep3Body)).toBeTruthy();
    expect(
      screen.getByText(brailleEs.mirrorReading, { selector: 'p' }),
    ).toBeTruthy();
    expect(screen.getByText(/punto/i)).toBeTruthy();
  });
});

