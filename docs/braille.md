**ESTADO: POR VALIDAR. Esta tabla se basa en el Braille español de 6 puntos, grado 1. Debe ser revisada y aprobada por un especialista en Braille o por CONADIS antes de usarse como material educativo con estudiantes. Ningún dato aquí debe presentarse como validado hasta que exista esa revisión documentada, con nombre del revisor y fecha.**

Fuente de datos: `src/data/braille/spanish-grade1.json`. El Unicode **no** se escribe a mano: `src/utils/braille.ts` calcula `0x2800 + suma de 2^(punto-1)`. El módulo de interfaz (`src/modules/braille`) reutiliza esas funciones; no las duplica.

Numeración de puntos:

```
1  4
2  5
3  6
```

Prefijos:

- Signo de número: puntos 3-4-5-6 (precede a cada dígito).
- Signo de mayúscula: puntos 4-6 (precede a la letra).

Los dígitos 1-9 son signo de número + letras a-i. El 0 es signo de número + j. Por eso el número 1 ocupa **dos celdas**. `textToBraille('A5')` produce cuatro celdas: signo de mayúscula, a, signo de número, e.

CH y LL se modelan como dos celdas (c+h, l+l), no como un signo único. Eso también está por validar.

## Interfaz (Fase 05)

La página `/#/braille` tiene tres pantallas. La celda nunca es solo un dibujo: SVG + `aria-label` descriptivo + texto de puntos + `say()`.

- Un estudiante ciego la estudia por lector de pantalla y por el canal `say()`.
- Un estudiante vidente ve el código y puede acompañar.
- Docente y familia aprenden a leer las piezas físicas.

El `StatusBadge` de **Por validar** es permanente en la referencia. No se marca `validated` sin acta de revisión.

## Escritura (Fase 05B)

La ruta `/#/braille/escritura` enseña regleta (espejo) y Perkins. Detalle y estado **por validar** en [braille-writing.md](braille-writing.md). Reutiliza `BrailleEngine`, `BrailleCell` y `say()`.

## Progreso (punto de extensión, Fase 15)

`BraillePractice` emite `onActivityComplete({ mode, correct, total })` al terminar una tanda. No guarda nada en el dispositivo. El módulo de progreso de la Fase 15 debe suscribirse a ese evento.

## Dudas para un especialista

- ¿CH y LL deben ser un signo de una celda en Braille español grado 1, o dos celdas como ahora?
- ¿El signo de mayúscula (puntos 4-6) y el de número (3-4-5-6) coinciden con la norma que usará el aula en Pasco?
- ¿Las vocales acentuadas y la ü de esta tabla coinciden con el código que se enseña en el Perú?
