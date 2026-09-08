import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { AccessibilityPanel } from '@/components/settings/AccessibilityPanel';
import { AccessibilityProvider } from '@/modules/accessibility/AccessibilityProvider';
import { Announcer } from '@/components/ui/Announcer';
import { Button } from '@/components/ui/Button';
import { CaptionBanner } from '@/components/ui/CaptionBanner';
import { Card } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { IconButton } from '@/components/ui/IconButton';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Toggle } from '@/components/ui/Toggle';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';

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

describe('axe en componentes UI', () => {
  it('Button', async () => {
    const { container } = render(<Button>Guardar</Button>);
    await expectNoBlockingAxe(container);
  });

  it('IconButton', async () => {
    const { container } = render(
      <IconButton aria-label="Cerrar">×</IconButton>,
    );
    await expectNoBlockingAxe(container);
  });

  it('Card', async () => {
    const { container } = render(
      <Card>
        <h2>Tarjeta</h2>
        <p>Contenido de ejemplo.</p>
      </Card>,
    );
    await expectNoBlockingAxe(container);
  });

  it('Toggle', async () => {
    const { container } = render(
      <Toggle
        label="Sonido"
        description="Ruidos de la interfaz"
        checked
        onChange={() => {}}
      />,
    );
    await expectNoBlockingAxe(container);
  });

  it('RadioGroup', async () => {
    const { container } = render(
      <RadioGroup
        legend="Apariencia"
        name="axe-theme"
        value="light"
        options={[
          { value: 'light', label: 'Clara' },
          { value: 'dark', label: 'Oscura' },
        ]}
        onChange={() => {}}
      />,
    );
    await expectNoBlockingAxe(container);
  });

  it('Slider', async () => {
    const { container } = render(
      <Slider
        label="Velocidad"
        min={0.6}
        max={1.2}
        step={0.2}
        value={1}
        onChange={() => {}}
      />,
    );
    await expectNoBlockingAxe(container);
  });

  it('Select', async () => {
    const { container } = render(
      <Select
        label="Idioma"
        value="es"
        options={[
          { value: 'es', label: 'Español' },
          { value: 'qu', label: 'Quechua' },
        ]}
        onChange={() => {}}
      />,
    );
    await expectNoBlockingAxe(container);
  });

  it('StatusBadge', async () => {
    const { container } = render(
      <>
        <StatusBadge status="validated" />
        <StatusBadge status="pending" />
        <StatusBadge status="draft" />
        <StatusBadge status="mock" />
        <StatusBadge status="real" />
      </>,
    );
    await expectNoBlockingAxe(container);
  });

  it('VisuallyHidden', async () => {
    const { container } = render(
      <button type="button">
        <VisuallyHidden>Cerrar</VisuallyHidden>×
      </button>,
    );
    await expectNoBlockingAxe(container);
  });

  it('Dialog abierto', async () => {
    const { container } = render(
      <Dialog open title="Ejemplo" onClose={() => {}}>
        <p>Contenido del diálogo.</p>
        <Button>Continuar</Button>
      </Dialog>,
    );
    await waitFor(() => {
      expect(document.querySelector('dialog')?.hasAttribute('open')).toBe(true);
    });
    await expectNoBlockingAxe(container);
  });

  it('CaptionBanner', async () => {
    const { container } = render(
      <AccessibilityProvider>
        <CaptionBanner />
      </AccessibilityProvider>,
    );
    await expectNoBlockingAxe(container);
  });

  it('Announcer', async () => {
    const { container } = render(
      <AccessibilityProvider>
        <Announcer />
      </AccessibilityProvider>,
    );
    await expectNoBlockingAxe(container);
  });

  it('panel de ajustes', async () => {
    const { container } = render(
      <AccessibilityProvider>
        <AccessibilityPanel open onClose={() => {}} />
        <Announcer />
      </AccessibilityProvider>,
    );
    await waitFor(() => {
      expect(document.querySelector('dialog')?.hasAttribute('open')).toBe(true);
    });
    await expectNoBlockingAxe(container);
  });
});
