**ESTADO: POR VALIDAR. El método de enseñanza de escritura con regleta y punzón, el mapeo de posiciones, el formato de regleta por defecto y la secuencia de lecciones deben ser revisados por un especialista en tiflotecnología o en enseñanza de braille (CONADIS, CERCIL, o un docente de aula de recursos) antes de usarse con estudiantes. Ningún contenido de este módulo debe presentarse como validado sin esa revisión documentada, con nombre y fecha.**

## Para qué sirve este módulo

Enseña a **escribir** braille, no solo a reconocerlo:

1. Regleta y punzón — escritura invertida, de derecha a izquierda.
2. Máquina Perkins / teclado de 6 puntos — escritura directa, de izquierda a derecha.

La pantalla es secundaria. Un estudiante puede completar las lecciones con teclado, subtítulos y `aria-live`, con los ojos cerrados. La voz real (síntesis) llega en la Fase 07; hoy `say()` ya publica en lector de pantalla y subtítulos.

## El espejo

El punzón perfora desde atrás. Las columnas se intercambian: 1↔4, 2↔5, 3↔6. La A (punto 1 al leer) se perfora **arriba a la derecha**. Implementación: `src/modules/braille-writing/mirroring.ts`. No se duplica `BrailleEngine`.

## Formato de regleta

Por defecto el modelo usa **4 líneas × 27 celdas**. Ese número varía según el fabricante. Está por validar. La práctica en pantalla usa una regleta reducida para no saturar el teclado.

## Progreso

Las lecciones emiten `onActivityComplete({ mode, correct, total })` con el mismo contrato que la Fase 05. No hay persistencia (Fase 15).

## Visión futura: leer la hoja con la cámara

**No está implementado.** Reconocer relieve braille en una foto, sin contraste de tinta, es un problema abierto: la cámara ve un papel casi uniforme. Hasta que exista un método fiable (luz rasante controlada, sensor táctil o una pieza 3D con alto contraste), la comprobación se hace reescribiendo en la regleta virtual o con un docente.

## Dudas para un especialista en tiflotecnología

- ¿El formato 4×27 coincide con las regletas que usa el aula en Pasco?
- ¿El mapeo SDF/JKL (posición física, no número de lectura) es el que conviene enseñar, o se prefiere solo 1-6 de escritura?
- ¿La ventana de acorde de 150 ms de la Perkins se siente natural?
- ¿CH y LL se escriben como dos celdas también a mano?
- ¿La secuencia de lecciones (vocales → m p s l → sílabas → mamá/papá/sol/luna) encaja con el método del aula de recursos?
