import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Base path de GitHub Pages.
 *
 * GitHub Pages publica el sitio en https://<usuario>.github.io/<repo>/.
 * Vite usa `base` para prefijar assets y enlaces. Si este repositorio
 * cambia de nombre, actualiza SOLO esta constante para que coincida
 * con el slug del repo (incluidas las barras).
 *
 * En desarrollo se usa '/' para que `npm run dev` sirva en la raíz.
 */
const GITHUB_PAGES_BASE = '/yachay-nan-3d/';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? GITHUB_PAGES_BASE : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: true,
  },
}));
