import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dialog } from '@/components/ui/Dialog';

function DialogHost() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir diálogo
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Ejemplo">
        <button type="button">Primera acción</button>
        <button type="button">Última acción</button>
      </Dialog>
    </div>
  );
}

describe('Dialog', () => {
  it('atrapa el foco con Tab entre el primero y el último control', () => {
    render(<DialogHost />);

    const trigger = screen.getByRole('button', { name: 'Abrir diálogo' });
    fireEvent.click(trigger);

    const dialog = document.querySelector('dialog');
    expect(dialog).not.toBeNull();

    const close = screen.getByRole('button', { name: 'Cerrar' });
    const last = screen.getByRole('button', { name: 'Última acción' });

    last.focus();
    fireEvent.keyDown(dialog as HTMLElement, { key: 'Tab' });
    expect(document.activeElement).toBe(close);
  });

  it('Escape cierra el diálogo', () => {
    render(<DialogHost />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir diálogo' }));

    expect(screen.getByRole('heading', { name: 'Ejemplo' })).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(document.querySelector('dialog')?.hasAttribute('open')).toBe(false);
  });

  it('devuelve el foco al disparador al cerrar', async () => {
    render(<DialogHost />);
    const trigger = screen.getByRole('button', { name: 'Abrir diálogo' });
    trigger.focus();
    fireEvent.click(trigger);

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));

    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });
});
