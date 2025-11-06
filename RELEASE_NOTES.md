# v0.2.0 – Map gating y CoursePanel

Fecha: 2025-11-06

## Resumen
- Gating del mapa por curso: el `WorldMap` solo se muestra en capítulos de Historia.
- Nuevo `CoursePanel` para Matemática, Comunicación y Ciencia en el lobby.
- Armonización de estilos: uso de variables de marca en Leaflet, globales y WorldMap.
- Desactivación de telemetría de Next (`NEXT_TELEMETRY_DISABLED=1`).
- Preparación para despliegue en Vercel con `vercel.json`.

## Cambios principales
- `app/page.tsx`:
  - Se agregó el componente `CoursePanel`.
  - Lógica en `GameLobby` para detectar curso por bimestre y mostrar `WorldMap` solo en capítulos de Historia.
  - Sin cambios en la lógica de juego, avance de capítulos ni bancos de preguntas.
- `components/WorldMap.tsx`:
  - Ajustes menores de estilos para coherencia visual.
- `styles/leaflet.css` y `app/globals.css`:
  - Sustitución de colores hardcodeados por `var(--brand-...)`.
- `vercel.json`:
  - Configuración mínima para Next.js y desactivar telemetría.

## Deployment
- Plataforma: Vercel (integración GitHub, branch `main`).
- Pasos:
  1) Importar el repo desde GitHub.
  2) Confirmar framework Next.js y root `/`.
  3) Deploy automático en cada push a `main`.
- URL: usar el botón “Visit” del proyecto en Vercel. (Ejemplo: `https://history-game-<id>.vercel.app`).

## QA checklist
- Lobby:
  - Historia (Bimestre II): se muestra `WorldMap`.
  - Matemática/Comunicación/Ciencia (Bimestres I/III/IV): se muestra `CoursePanel`.
- Juego:
  - Modal de capítulo completado aparece al aprobar.
  - Auto-avance en 3 segundos (cancelable) al siguiente capítulo.
  - Pantalla de “Bimestre completado” al terminar todos los capítulos.
- Estilos:
  - Controles de zoom y popups de Leaflet usan paleta de marca.

## Notas y próximos pasos
- Mejorar `CoursePanel` con gráficos/animaciones por curso.
- Añadir metas por capítulo y breve descripción del tema.
- Activar Preview Deployments y protección de `main`.
- Crear dominio personalizado en Vercel si aplica.

## Tag
- `v0.2.0-map-panel`: Map gating + CoursePanel, estilos armonizados, telemetry off.