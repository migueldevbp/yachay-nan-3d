**ESTADO: POR VALIDAR. Esta tabla se basa en el Braille español de 6 puntos, grado 1. Debe ser revisada y aprobada por un especialista en Braille o por CONADIS antes de usarse como material educativo con estudiantes. Ningún dato aquí debe presentarse como validado hasta que exista esa revisión documentada, con nombre del revisor y fecha.**

Fuente de datos: `src/data/braille/spanish-grade1.json`. El Unicode **no** se escribe a mano: `src/utils/braille.ts` calcula `0x2800 + suma de 2^(punto-1)`.

Numeración de puntos:

```
1  4
2  5
3  6
```

Prefijos:

- Signo de número: puntos 3-4-5-6 (precede a cada dígito).
- Signo de mayúscula: puntos 4-6 (precede a la letra).

Los dígitos 1-9 son signo de número + letras a-i. El 0 es signo de número + j. Por eso el número 1 ocupa **dos celdas**.

CH y LL, en esta fase, se modelan como dos celdas (c+h, l+l), no como un signo único. Eso también está por validar.

Todos los registros de la tabla y de los recursos educativos llevan `validation: pending_validation`. La interfaz (Fase 05) debe mostrar `StatusBadge` pending en la sección Braille. No se marca `validated` sin acta de revisión.
