# Hoja de ruta

Diecisiete fases. Cada una deja el sitio compilando, testeado y desplegable. No se adelanta trabajo de fases posteriores.

| Fase | Nombre                                                                       | Estado     |
| ---- | ---------------------------------------------------------------------------- | ---------- |
| 01   | Fundación: tooling, accesibilidad base y GitHub Pages                        | Completada |
| 02   | Sistema de diseño accesible, preferencias globales y canal único de mensajes | Completada |
| 03   | Modelo de datos educativo, tabla Braille español y motor de contenido        | Completada |
| 04   | Internacionalización español / quechua (`src/i18n`)                          | Completada |
| 05   | Braille accesible: celda SVG, referencia y práctica                          | Completada |
| 05B  | Escritura Braille: regleta (espejo) y máquina Perkins                        | Completada |
| 06   | Alfabeto en pantalla                                                         | Completada |
| 07   | Cámara (captura en el navegador)                                             | Pendiente  |
| 08   | Visión: reconocimiento de piezas 3D                                          | Pendiente  |
| 09   | Voz y audio                                                                  | Pendiente  |
| 10   | Lengua de señas                                                              | Pendiente  |
| 11   | Motor de actividades                                                         | Pendiente  |
| 12   | Números y sílabas                                                            | Pendiente  |
| 13   | Palabras y oraciones                                                         | Pendiente  |
| 14   | Progreso del aprendiz                                                        | Pendiente  |
| 15   | Uso offline y conectividad intermitente                                      | Pendiente  |
| 16   | Rendimiento en dispositivos modestos                                         | Pendiente  |
| 17   | Auditoría WCAG 2.1 AA y cierre de lanzamiento                                | Pendiente  |

La Fase 03 deja el contenido en JSON validado con Zod y consultable vía `ContentEngine`. El detalle está en [content-model.md](content-model.md) y [braille.md](braille.md).

La Fase 04 deja la aplicación navegable (hash router), el layout accesible y las cadenas de interfaz en `src/i18n/es` + `src/i18n/qu`. El quechua está vacío a propósito hasta validación. Detalle en [i18n.md](i18n.md).

La Fase 05 deja el Braille usable en pantalla: celda SVG con nombre accesible, tabla de referencia (por validar) y práctica letra ↔ Braille completable con teclado. Detalle en [braille.md](braille.md).

La Fase 05B enseña a escribir: regleta con espejo (derecha a izquierda) y Perkins sin espejo, guiadas por `say()`. El método está por validar. Detalle en [braille-writing.md](braille-writing.md).

La Fase 06 deja la `ResourceCard` multimodal (independiente de si el recurso viene del catálogo o, en la Fase 12, de la cámara), el explorador de alfabeto con grid ARIA y el de números con las dos celdas Braille. La ficha `/#/recurso/:id` anuncia el recurso y enlaza actividades futuras. No hay imágenes ni señas en el JSON: la tarjeta no las inventa.
