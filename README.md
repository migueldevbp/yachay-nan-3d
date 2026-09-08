# YACHAY ÑAN 3D

Plataforma web educativa inclusiva y multisensorial. Conecta piezas físicas impresas en 3D (letras con Braille en relieve) con una aplicación que las reconoce por cámara y responde por texto, audio, Braille en pantalla, imagen y lengua de señas.

Corre **100 % en el navegador**, servida como sitio estático. No hay backend.

**Estado actual: Fase 04 de 17.** Navegación completa, layout accesible e internacionalización español / quechua (quechua pendiente de validación).

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- Tailwind CSS 3 con tokens en variables CSS
- React Router 6 en modo hash (`createHashRouter`)
- Vitest + Testing Library + jsdom
- ESLint + Prettier + eslint-plugin-jsx-a11y
- GitHub Actions → GitHub Pages

## Instalar

Requisito: Node.js 20 o superior.

```bash
npm install
```

## Correr en local

```bash
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`).

Otros scripts:

| Script                     | Qué hace                               |
| -------------------------- | -------------------------------------- |
| `npm run build`            | Typecheck + empaquetado de producción  |
| `npm run preview`          | Sirve la carpeta `dist/`               |
| `npm run lint`             | ESLint (cero warnings permitidos)      |
| `npm run lint:fix`         | ESLint con correcciones automáticas    |
| `npm run typecheck`        | TypeScript sin emitir archivos         |
| `npm run validate:content` | Valida JSON educativo con Zod          |
| `npm run test`             | Vitest en modo CI                      |
| `npm run test:a11y`        | Tests de accesibilidad (axe + diálogo) |
| `npm run test:watch`       | Vitest en modo watch                   |
| `npm run format`           | Prettier                               |

## Desplegar

El flujo `.github/workflows/deploy.yml` construye y publica en GitHub Pages en cada push a `main`.

Pasos manuales (una sola vez):

1. El repositorio en GitHub debe llamarse `yachay-nan-3d` (o actualizar `GITHUB_PAGES_BASE` en `vite.config.ts`).
2. Settings → Pages → Source: **GitHub Actions**.
3. Empujar `main`. El job `quality` corre lint, typecheck y tests; si pasa, `deploy` publica el sitio.

Detalle en [docs/deployment.md](docs/deployment.md).

## Estado de honestidad

### YA FUNCIONA

- Esqueleto React + Vite + TypeScript + Tailwind
- Layout semántico con skip link, foco visible y anunciador `aria-live`
- Preferencias de acceso globales (tema, texto, movimiento, sonido, voz, subtítulos, Braille, señas, densidad, ritmo, idioma)
- Panel de ajustes persistente y Modo Tranquilo (con snapshot)
- Canal único `say()`: lector de pantalla + subtítulos + punto de extensión de voz
- Primitivos UI propios (botón, diálogo, toggle, radios, slider, badge)
- Modelo de datos educativo en JSON, tabla Braille español (por validar) y ContentEngine
- Landing con las 13 secciones, páginas placeholder honestas y estado del proyecto
- Internacionalización propia es/qu (sin i18next); quechua vacío a la espera de validación
- Lint, typecheck, tests de humo, i18n, enrutado y axe
- Despliegue automático a GitHub Pages

### EN DESARROLLO

- Cámara, visión, voz real, Braille en pantalla y lengua de señas
- Actividades, progreso y catálogo de quechua validado

### VISIÓN FUTURA

- Reconocimiento de piezas 3D con Braille en relieve, 100 % en el navegador
- Respuesta multisensorial coordinada (texto, audio, Braille, imagen, señas)
- Uso en dispositivos modestos y con conectividad intermitente
- Cumplimiento WCAG 2.1 AA como requisito de arquitectura, no como capa final

## Documentación

- [Arquitectura](docs/architecture.md)
- [Accesibilidad](docs/accessibility.md)
- [Internacionalización](docs/i18n.md)
- [Modelo de contenido](docs/content-model.md)
- [Braille](docs/braille.md)
- [Despliegue](docs/deployment.md)
- [Hoja de ruta](docs/roadmap.md)

## Licencia

[MIT](LICENSE)
