# Plan de Implementación: Soft Brutalism & Interfaz Compacta

## Objetivo
Refinar el diseño actual de `apps/platform` para evolucionar de un Neo-brutalismo tradicional a un "Soft Brutalism". Se implementará una estética más compacta, con bordes más finos, paleta de colores suaves (tonos pastel) y una tipografía moderna, basada en el feedback y la imagen de referencia del usuario.

## User Review Required
> [!IMPORTANT]
> Por favor, revisa esta propuesta de plan. Una vez que la apruebes, comenzaremos a aplicar estos cambios directamente en el código base.

## Proposed Changes

### 1. Sistema de Diseño Base (Tokens y Variables CSS)
#### [MODIFY] `globals.css` (apps/platform/src/app/globals.css)
- **Bordes y Sombras:**
  - Reducir el tamaño predeterminado de `--shadow-nb` y `--shadow-nb-sm` (ej. de 4px a 2px, y de 2px a 1px).
  - Aclarar ligeramente el color de `--border` oscuro para suavizar el contraste.
- **Paleta de Colores (Pasteles/Suaves):**
  - Ajustar `--primary` a un tono violeta/lila pastel (inspirado en la referencia).
  - Ajustar `--accent` a un tono verde claro pastel.
  - Ajustar `--background` y `--card` para consolidar un fondo claro o medianamente oscuro dependiendo del modo, pero de manera más limpia.
- **Tipografía:**
  - Modificar las reglas globales para `h1, h2, h3` eliminando el uso forzado de `var(--font-handwritten)` y usar la fuente principal (sans-serif geométrica como Inter).
- **Fondo Sutil:**
  - Reducir drásticamente la opacidad de `--nb-grid-color` y `--nb-margin-color` para que la cuadrícula escolar sea casi casi invisible.

### 2. Estructura y Espaciado del Dashboard
#### [MODIFY] `page.tsx` (apps/platform/src/app/dash/page.tsx)
- **Tipografía:**
  - Remover todas las clases de Tailwind `font-handwritten` que estén aplicadas directamente a los encabezados (ej. `h1`).
- **Paddings y Gaps (Diseño Compacto):**
  - Reducir paddings generales de contenedores principales (ej: `px-6 py-4` -> `px-4 py-3`).
  - Reducir el espaciado entre elementos en los grids o flexboxes (ej: `gap-6` -> `gap-4`).
- **Bordes (Soft Brutalism):**
  - Cambiar dependencias fijas de `border-2` a un borde más sutil `border` en las tarjetas (`Card`), modales y contenedores de Hero, de forma que mantenga el estilo "brutal" pero mucho más ligero.

### 3. Ajuste de Tipografía Global (Si aplica)
#### [MODIFY] `layout.tsx` (apps/platform/src/app/layout.tsx)
- Modificar componentes de UI auxiliares o clases en el body/html si fuerzan la carga o el uso predeterminado de otra fuente de forma que colisione con el nuevo estilo en el Dashboard.

---

## Verification Plan

### Manual Verification
1. Acceder al navegador (aprovechando el servidor en ejecución de Next.js en puerto 3000).
2. Entrar a `/dash` (usando una sesión activa o configurando el entorno local).
3. Validar:
   - Que las tarjetas de métricas ahora se vean más compactas y usen un borde fino con sombra suave.
   - Que el título "Simulador Concurso Docente" posea una tipografía moderna (Inter).
   - Que los colores principales (lila pastel, verde suave) estén presentes en las tarjetas y acentos.
   - Que la cuadrícula de fondo sea altamente transparente e imperceptible a menos que se observe detenidamente.
