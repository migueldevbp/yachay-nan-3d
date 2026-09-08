# Arquitectura — YACHAY ÑAN 3D

Sitio estático. Sin backend. Todo el código corre en el navegador.

## Capas

```
┌──────────────────────────────────────────────────────────┐
│  Páginas y componentes de UI                             │
│  src/pages  src/components/*                             │
├──────────────────────────────────────────────────────────┤
│  Hooks de presentación                                   │
│  src/hooks                                               │
├──────────────────────────────────────────────────────────┤
│  Módulos de dominio                                      │
│  content · activities · vision · speech · sign-language  │
│  progress · accessibility                                │
├──────────────────────────────────────────────────────────┤
│  Adaptadores (services)                                  │
│  Cámara, reconocimiento, síntesis de voz, almacenamiento │
│  Ninguna librería de terceros se importa fuera de aquí   │
├──────────────────────────────────────────────────────────┤
│  APIs del navegador / WASM / modelos en public/          │
└──────────────────────────────────────────────────────────┘
```

Los datos educativos viven en `src/data/*` y los assets estáticos en `public/`. Las cadenas de interfaz irán a `src/i18n/es` y `src/i18n/qu`.

## Regla de adaptadores

Ningún componente de UI importa una librería de visión, voz o almacenamiento de forma directa.

La UI habla con hooks o módulos. Los módulos hablan con `src/services`. Solo los servicios conocen `getUserMedia`, modelos de visión, Web Speech, `localStorage` u otras APIs concretas.

Si una fase necesita TensorFlow.js, un motor TTS u otra dependencia pesada, se instala y se encapsula en un adaptador. Cambiar de motor no debe obligar a reescribir botones ni páginas.

## Enrutado

GitHub Pages no reescribe rutas del servidor. Se usa `createHashRouter`: las URLs son `.../yachay-nan-3d/#/` y `.../yachay-nan-3d/#/lo-que-sea`. El skip link no usa el hash como ancla de ruta; mueve el foco a `#contenido` por JavaScript para no pelear con el router.

## Tokens y estilos

Todos los colores, radios, tamaños y duraciones salen de variables CSS en `src/styles/tokens.css`. En componentes se usa `var(--...)` o las clases de Tailwind mapeadas a esas variables. No hay colores literales en la UI.

Selectores `[data-theme="high-contrast"]`, `[data-motion="reduced"]` y `[data-density="calm"]` están reservados para la Fase 02. No hay lógica de modos todavía.

## Foco visible (norma del proyecto)

Está **prohibido** usar `outline: none` o `outline: 0` sin un reemplazo visible. La regla global es:

```css
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
```

Si un control necesita otro anillo, debe seguir siendo perceptible y cumplir contraste.

## Accesibilidad de base (Fase 01)

- `lang="es"` en el documento
- Un solo `<h1>` por página
- Skip link como primer elemento enfocable
- Región `#announcer` con `aria-live="polite"` para anuncios futuros
- Contraste de texto por defecto ≥ 4.5:1
- `prefers-reduced-motion: reduce` acorta animaciones y transiciones

## Convenciones de código

- TypeScript en modo `strict`, con `noUncheckedIndexedAccess`, `noUnusedLocals` y `noUnusedParameters`
- Alias `@/` → `src/`
- Componentes funcionales. Sin librerías de UI de terceros
- Tests junto a `tests/`. El de humo cubre estructura semántica, no lógica educativa
- Commits en español o conventional commits; esta fundación usa `chore(setup): ...`
- No introducir dependencias fuera de las de la fase en curso sin justificarlas
