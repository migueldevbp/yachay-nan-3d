# Hoja de ruta

Diecisiete fases. Cada una deja el sitio compilando, testeado y desplegable. No se adelanta trabajo de fases posteriores.

| Fase | Nombre                                                                       | Estado     |
| ---- | ---------------------------------------------------------------------------- | ---------- |
| 01   | Fundación: tooling, accesibilidad base y GitHub Pages                        | Completada |
| 02   | Sistema de diseño accesible, preferencias globales y canal único de mensajes | Completada |
| 03   | Sistema de componentes UI propios (sin librerías de UI)                      | Pendiente  |
| 04   | Internacionalización español / quechua (`src/i18n`)                          | Pendiente  |
| 05   | Módulo de contenido y alfabeto                                               | Pendiente  |
| 06   | Braille en pantalla                                                          | Pendiente  |
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

La Fase 02 ya rellena `[data-theme]`, `[data-motion]`, `[data-density]` y `[data-text-scale]` en `src/styles/tokens.css`. El detalle de preferencias y `say()` está en [accessibility.md](accessibility.md).
