# Accesibilidad — YACHAY ÑAN 3D

Objetivo declarado: **WCAG 2.1 nivel AA**. La accesibilidad no es una capa final: gobierna cómo se comporta toda la aplicación.

No existe un “modo discapacidad”. Existen preferencias de acceso que cualquier persona activa. Un estudiante sordo y uno sin discapacidad usan la misma pantalla; cambia qué canales están activos.

## Canal único de mensajes (`say()`)

**Regla obligatoria.** Toda comunicación del sistema al usuario, en esta fase y en las siguientes, pasa por `say(mensaje)` (`src/hooks/useAnnouncer.ts`).

`say()` hace tres cosas a la vez:

1. Publica el texto en la región `aria-live` (`#announcer-polite` o `#announcer-assertive`).
2. Lo muestra en el `CaptionBanner` si los subtítulos están activos.
3. Lo enviará al motor de voz cuando exista (`FASE 07: SpeechProvider`). Hoy el punto de extensión está vacío a propósito: no se reproduce audio sin que la persona lo pida (`speech` nace en `false`).

Prohibido anunciar por otro camino (otro `aria-live`, `alert()`, TTS suelto, consola). Así el mismo código sirve a quien usa lector de pantalla y a quien lee subtítulos.

## Preferencias

Los valores viven en `AccessibilityPreferences`. `applyPreferences` solo escribe atributos en `<html>`; el CSS reacciona. No hay estilos condicionales en JavaScript.

| Preferencia          | Qué hace                                                               |
| -------------------- | ---------------------------------------------------------------------- |
| `theme`              | Clara, oscura o alto contraste (`data-theme`)                          |
| `textScale`          | 100 / 125 / 150 / 200 % (`data-text-scale`, `--font-size-base` en rem) |
| `motion`             | Animación completa, poca o ninguna (`data-motion`)                     |
| `sound`              | Ruidos cortos de interfaz. No es voz                                   |
| `speech`             | Voz en alto. Por defecto apagada                                       |
| `speechRate`         | Velocidad futura de la voz (0.6–1.2)                                   |
| `captions`           | Subtítulos persistentes. Por defecto encendidos                        |
| `signLanguage`       | Canal de señas cuando haya video                                       |
| `braille`            | Braille en pantalla cuando haya contenido. Por defecto encendido       |
| `density`            | Espaciado estándar o calmado (`data-density`)                          |
| `instructionLength`  | Instrucciones cortas o completas                                       |
| `optionsPerActivity` | 2, 3 o 4 respuestas a la vez                                           |
| `confirmNavigation`  | Pedir confirmación al salir de una pantalla                            |
| `language`           | `es` o `qu` (se guarda; i18n es Fase 04)                               |

Valores iniciales inteligentes: `prefers-reduced-motion`, `prefers-color-scheme` y `prefers-contrast: more`. El **Modo Tranquilo** aplica de golpe movimiento nulo, sin sonido, densidad calmada, instrucciones cortas, 2 opciones y confirmación de navegación; al desactivarlo se restauran los ajustes previos (snapshot).

## Foco visible

Está **prohibido** `outline: none` o `outline: 0` sin un reemplazo visible. La regla global es:

```css
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
```

El skip link es el primer control. Los primitivos de UI tienen área táctil mínima de 44×44 CSS px (`--touch-min`).

## Nunca solo color

Estados, errores y badges combinan color + ícono o color + texto. `StatusBadge` no comunica el estado únicamente con el color.

## Tests de accesibilidad

```bash
npm run test        # incluye preferencias, diálogo y axe
npm run test:a11y   # solo tests de accesibilidad y diálogo
```

`axe-ui.test.tsx` corre axe sobre cada primitivo y sobre el panel. Falla si hay violaciones **serious** o **critical**.

## Auditoría manual pendiente

| Entorno                                    | Fecha | Resultado | Notas |
| ------------------------------------------ | ----- | --------- | ----- |
| Solo teclado (Tab, Enter, Escape, flechas) |       |           |       |
| Zoom 200 % (texto y navegador)             |       |           |       |
| NVDA + Firefox                             |       |           |       |
| VoiceOver + Safari                         |       |           |       |
| Alto contraste + movimiento nulo           |       |           |       |
