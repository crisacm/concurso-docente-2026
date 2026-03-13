# Rediseño Neo-Brutalism — Platform App

Migrar el diseño actual de la plataforma (glassmorphism: transparencias, backdrop-blur, bordes suaves, slate colors) a un estilo **Neo-brutalism sutil** con temática escolar. Inspirado en las imágenes de referencia: bordes gruesos oscuros, sombras duras (sin blur), fondos crema/acartonados, y un patrón de cuaderno cuadriculado de fondo.

> **Alcance:** Solo `apps/platform`. La landing (Astro) queda fuera de este rediseño.

---

## Diseño Visual Propuesto

### Paleta de colores

| Token | Light Mode | Dark Mode | Inspiración |
|---|---|---|---|
| `background` | `#F5F0E8` (crema/cartón) | `#1E293B` (pizarra oscura) | Papel de cuaderno / Pizarra |
| `foreground` | `#2D2D2D` (casi negro) | `#E8E0D4` (crema claro) | Tiza sobre pizarra |
| `card` | `#FFFDF7` (blanco cálido) | `#283548` (azul pizarra) | Hoja de papel |
| `primary` | `#2563EB` (azul escolar) | `#60A5FA` (tiza azul) | Lapicero azul |
| `secondary` | `#F3E8D4` (cartón suave) | `#334155` (pizarra suave) | Cartulina |
| `accent` | `#65A30D` (verde pizarra) | `#86EFAC` (tiza verde) | Tiza verde |
| `destructive` | `#DC2626` (rojo marcador) | `#F87171` (rojo suave) | Marcador rojo |
| `muted` | `#E8DFD0` (beige) | `#374151` (gris pizarra) | Papel envejecido |
| `border` | `#2D2D2D` (oscuro) | `#475569` (gris suave) | Borde de cuaderno |

### Tokens Neo-brutalism

```css
/* Bordes: 2px sólidos oscuros */
--nb-border-width: 2px;

/* Sombra dura: offset sin blur */
--nb-shadow: 4px 4px 0 var(--border);
--nb-shadow-sm: 2px 2px 0 var(--border);

/* Border radius: ligeramente redondeado */
--radius: 0.5rem;  /* 8px */
```

### Tipografía

- **Títulos (h1–h3):** [Architects Daughter](https://fonts.google.com/specimen/Architects+Daughter) — sutil manuscrita, legible
- **Cuerpo:** Inter (sin cambios)
- **Código/timer:** JetBrains Mono (sin cambios)

### Fondo de cuaderno

- Patrón CSS de cuadrícula con líneas sutiles (`repeating-linear-gradient`)
- Línea roja vertical en el margen izquierdo (como cuaderno real)
- Adaptado para ambos temas (líneas más claras en dark mode)

---

## Archivos a modificar

### Design System

| Archivo | Cambios |
|---|---|
| `src/app/layout.tsx` | Agregar fuente Architects Daughter, actualizar clases del body |
| `src/app/globals.css` | Reemplazar paleta completa, agregar tokens NB, fondo cuaderno, estilos headings |

### Componentes shadcn/ui

| Archivo | Cambios |
|---|---|
| `src/components/ui/button.tsx` | border-2, sombra dura, hover con desplazamiento |
| `src/components/ui/card.tsx` | border-2, sombra dura, eliminar transparencias |
| `src/components/ui/dialog.tsx` | border-2, sombra dura, eliminar glassmorphism |
| `src/components/ui/badge.tsx` | border-2 |
| `src/components/ui/input.tsx` | border-2, fondo sólido |
| `src/components/ui/select.tsx` | border-2, fondo sólido, sombra dura |
| `src/components/ui/separator.tsx` | Asegurar coherencia de color |
| `src/components/ui/tabs.tsx` | Ajustar bordes y fondos |

### Componentes compartidos

| Archivo | Cambios |
|---|---|
| `src/components/Topbar.tsx` | Eliminar backdrop-blur, bordes gruesos, fondos sólidos |

### Páginas

| Archivo | Cambios |
|---|---|
| `src/app/page.tsx` | Redirigir a `/auth/signin` o `/dash` |
| `src/app/auth/signin/page.tsx` | Eliminar gradiente radial, card NB, botón Google NB |
| `src/app/dash/page.tsx` | Eliminar blobs, hero NB, stats cards NB |
| `src/app/dash/DashboardChart.tsx` | Adaptar leyenda al tema |
| `src/app/dash/HistorialModal.tsx` | Items con border-2, panel expandido sólido |
| `src/app/sim/setup/SimPageClient.tsx` | Hero card NB, info pill sólida |
| `src/app/sim/setup/SimConfigForm.tsx` | Profile/count cards NB, step badges sólidos |
| `src/app/sim/exam/QuizPageClient.tsx` | Loading/error states NB |
| `src/app/sim/exam/QuizCard.tsx` | Question card NB, opciones NB |
| `src/app/sim/exam/QuizTopbar.tsx` | Pills NB sin blur |
| `src/app/sim/exam/QuizBottombar.tsx` | Botones NB sólidos |
| `src/app/sim/result/ResultPageClient.tsx` | Hero NB, AreaCards NB, CircularProgress |
| `src/app/sim/result/ReviewModal.tsx` | Items NB, explanation box NB |
| `src/app/record/page.tsx` | Eliminar blur blob, icon container NB |

---

## Verificación

1. **Tests existentes:** `cd apps/platform && pnpm test` — no deben romperse (son lógicos, no de UI)
2. **Lint/TypeCheck:** `pnpm lint && pnpm tsc --noEmit`
3. **Revisión visual** de cada página (light + dark) en el navegador
