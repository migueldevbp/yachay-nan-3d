# Modelo de contenido

El contenido educativo vive en JSON versionado bajo `src/data/`. Añadir una letra, una palabra o un idioma es editar datos, no componentes. `ContentEngine` es la única puerta de consulta. Zod valida al cargar: un campo mal escrito corta la build (`npm run validate:content`).

## Secuencia pedagógica (POR VALIDAR)

`order` no es A=1, B=2. Sigue una propuesta de alfabetización castellana que prioriza vocales y consonantes de trazo y sonido simple:

a, e, i, o, u, m, p, s, l, t, n, d, c, b, r, f, g, h, j, v, ñ, ll, ch, q, y, z, x, k, w

**POR VALIDAR por un especialista en alfabetización.** La RAE ya no trata CH y LL como letras independientes; aquí se conservan como grafemas pedagógicos. Ñ sí es letra.

Mayúsculas y minúsculas comparten el mismo `order` y se distinguen con `caseForm`.

## Piezas del MVP

Solo cinco letras mayúsculas tienen pieza física y `fiducialId` 1-5:

| Letra | fiducialId | modelClass |
| ----- | ---------- | ---------- |
| A     | 1          | letter-A   |
| B     | 2          | letter-B   |
| C     | 3          | letter-C   |
| M     | 4          | letter-M   |
| S     | 5          | letter-S   |

El resto tiene `hasPhysicalPiece: false`.

## Palabras

`requiredPieces` lista las piezas **con duplicados**. CASA es la palabra objetivo de la demo: `['C','A','S','A']`. Con una sola A no se forma. `formableWithMvpPieces` es verdadero solo si el multiconjunto cabe en una A, una B, una C, una M y una S.

No hay `i18n.qu` en esta fase.

## Validación

Ningún recurso está `validated`. `getValidationSummary()` debe devolver validados = 0.
