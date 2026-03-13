# Plan de Implementación: Rollout "Soft Brutalism" al resto de la aplicación

## Objetivo
Replicar el rediseño "Soft Brutalism" implementado exitosamente en el Dashboard a las demás páginas de `apps/platform`. Esto incluye la eliminación de bordes gruesos (`border-2`), corrección de tipografía manuscrita (`font-handwritten`), atenuación de sombras de alto contraste y compactación de paddings, respetando el nuevo estándar limpio y simétrico en todo el sitio.

## User Review Required
> [!IMPORTANT]
> Revisa los archivos que serán modificados. Una vez que lo apruebes, comenzaremos la ejecución del reemplazo de clases de Tailwind a lo largo de toda la aplicación.

## Proposed Changes

### 1. Vistas de Autenticación y Placeholder
#### [MODIFY] `auth/signin/page.tsx` (apps/platform/src/app/auth/signin/page.tsx)
- Reemplazar `border-2 border-foreground` por `border border-foreground/30` en el botón de "Continuar con Google".

#### [MODIFY] `record/page.tsx` (apps/platform/src/app/record/page.tsx)
- Reducir `border-2` a `border border-foreground/30` en el contenedor del ícono principal (`Clock`).
- Cambiar la sombra a `shadow-[var(--shadow-nb-sm)]`.

### 2. Flujo de Configuración de Simulacro (Setup)
#### [MODIFY] `sim/setup/SimPageClient.tsx` (apps/platform/src/app/sim/setup/SimPageClient.tsx)
- **Hero Card:** Cambiar `border-2` a `border border-foreground/30`. Ajustar `px-6 py-4` a `px-5 py-4` (compactar).
- **Controladores (Botones volver / settings):** Modificar a bordes finos y suavizar `bg-primary-foreground/20`.
- **Tipografía:** Eliminar `font-handwritten` del `h1`.

#### [MODIFY] `sim/setup/SimConfigForm.tsx` (apps/platform/src/app/sim/setup/SimConfigForm.tsx)
- **Pills de paso (1, 2, 3):** Cambiar de `border-2` a `border border-foreground/30`.
- **Tarjetas de Perfil y Cantidad de preguntas:** Cambiar de `border-2` absoluto a un `border` sencillo, suavizando los oscuros inactivos de `border-foreground/30` a `border-foreground/10`.
- Reducir paddings (`py-5` a `py-4`) para hacer el grid de opciones más compacto.

### 3. Flujo Activo de Examen (Simulador)
#### [MODIFY] `sim/exam/QuizCard.tsx` (apps/platform/src/app/sim/exam/QuizCard.tsx)
- **Contenedores de Progreso:** Cambiar bordes globales gruesos a bordes finos de `border`.
- **Card principal de la Pregunta:** Reemplazar el `border-2` brutalista por un diseño flat.
- **Botones de Opciones (A, B, C, D):** Ajustar las clases en el `.map` para que el renderizado de la opción seleccionada tenga un borde más fino `border` o reaccione con sombras tenues.

### 4. Flujo de Resultados
#### [MODIFY] `sim/result/ResultPageClient.tsx` (apps/platform/src/app/sim/result/ResultPageClient.tsx)
- **Hero Card y Circular Chart:** Modificar `border-2` por `border border-foreground/30`. Eliminar `font-handwritten` de `h1`.
- **AreaCards:** Quitar `border-2` al componente base (que dibuja el progreso interno). Modificar la renderización dinámica `var(--shadow-nb)` haciéndola SM por defecto.

### 5. Componente Compartido
#### [MODIFY] `components/Topbar.tsx` (apps/platform/src/components/Topbar.tsx)
- **Botones aislados:** (Botón de "Home", Selector de Tema "Sun/Moon", Pill de Usuario): Eliminar dependencias a `border-2` y cambiar por `border border-foreground/30`.

---

## Verification Plan

### Automated/Manual Verification
1. Utilizar una subagente de navegación asíncrona (con el simulador local activo en `localhost:3000`).
2. Recorrer sucesivamente las rutas afectadas (una vez aplicados los cambios):
   - `/sim/setup` (Para probar la vista de setup)
   - `/sim/result` (Para comprobar el diseño del final)
3. Extraer capturas (`browser_subagent`) para atestiguar la compactación y consistencia del diseño.
