import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { createAppRouter } from '@/app/router';

function renderApp() {
  return render(
    <RouterProvider
      router={createAppRouter()}
      future={{ v7_startTransition: true }}
    />,
  );
}

describe('humo de la aplicación', () => {
  it('renderiza main, un h1 y el skip link', () => {
    renderApp();

    expect(document.querySelector('main')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();

    const skipLink = screen.getByRole('link', {
      name: 'Saltar al contenido principal',
    });
    expect(skipLink).toBeTruthy();

    const tabbable = Array.from(
      document.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    expect(tabbable[0]).toBe(skipLink);

    skipLink.click();
    expect(document.activeElement?.id).toBe('contenido');
  });

  it('tiene un título de documento no vacío', () => {
    renderApp();

    expect(document.title.trim().length).toBeGreaterThan(0);
  });
});
