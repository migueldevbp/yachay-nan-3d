# YACHAY ÑAN 3D

Plataforma web educativa inclusiva y multisensorial. Conecta piezas físicas impresas en 3D (letras con Braille en relieve) con una aplicación que las reconoce por cámara y responde por texto, audio, Braille en pantalla, imagen y lengua de señas.

Corre **100 % en el navegador**, servida como sitio estático. No hay backend.

**Estado actual: Fase 01 de 17.** Solo el esqueleto del proyecto, el tooling y el despliegue a GitHub Pages.

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

| Script               | Qué hace                              |
| -------------------- | ------------------------------------- |
| `npm run build`      | Typecheck + empaquetado de producción |
| `npm run preview`    | Sirve la carpeta `dist/`              |
| `npm run lint`       | ESLint (cero warnings permitidos)     |
| `npm run lint:fix`   | ESLint con correcciones automáticas   |
| `npm run typecheck`  | TypeScript sin emitir archivos        |
| `npm run test`       | Vitest en modo CI                     |
| `npm run test:watch` | Vitest en modo watch                  |
| `npm run format`     | Prettier                              |

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
- Layout semántico con skip link, foco visible y anunciador vacío para lectores de pantalla
- Landing mínima (inicio y página 404)
- Lint, typecheck y test de humo
- Despliegue automático a GitHub Pages (cuando Pages esté activado)

### EN DESARROLLO

- Preferencias de accesibilidad (alto contraste, movimiento, densidad)
- Cámara, visión, voz, Braille en pantalla y lengua de señas
- Contenido educativo (alfabeto, números, sílabas, palabras, oraciones)
- Actividades, progreso e i18n (español / quechua)

### VISIÓN FUTURA

- Reconocimiento de piezas 3D con Braille en relieve, 100 % en el navegador
- Respuesta multisensorial coordinada (texto, audio, Braille, imagen, señas)
- Uso en dispositivos modestos y con conectividad intermitente
- Cumplimiento WCAG 2.1 AA como requisito de arquitectura, no como capa final

## Documentación

- [Arquitectura](docs/architecture.md)
- [Despliegue](docs/deployment.md)
- [Hoja de ruta](docs/roadmap.md)

## Licencia

[MIT](LICENSE)
