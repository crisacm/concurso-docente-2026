## Propósito

Este archivo es la fuente de verdad operativa para agentes IA que trabajen en este codebase. Para contexto del proyecto, arquitectura, setup y normativa, leer el [README.md](./README.md).

---

## Contexto del dominio

Simulador del concurso docente colombiano 2026 con IA. Monorepo Turborepo con dos apps: `platform` (Next.js 16, app principal) y `landing` (Astro 5). Backend con Supabase (auth + db). Dirigido a docentes del sector público colombiano que preparan el concurso de méritos.

---

## Monorepo: rutas críticas

| App / Package | Path | Descripción | Puerto (dev) |
|---------------|------|-------------|--------------|
| `@repo/platform` | `apps/platform/` | Next.js — simulador, auth, dashboard | :3000 |
| `@repo/landing` | `apps/landing/` | Astro — landing page pública | :4321 |
| `@repo/config-ts` | `packages/config-ts/` | tsconfig base compartida | — |

---

## Convenciones de código

- **TypeScript estricto:** sin `any`. Usar tipos explícitos o `unknown`.
- **Componentes funcionales:** hooks sobre clases.
- **Server vs Client:** pages son Server Components; UI interactiva en `*PageClient.tsx` (Client Components).
- **Naming:** PascalCase para componentes, camelCase para funciones/variables, kebab-case para archivos.
- **JSDoc:** solo donde la lógica no sea autoevidente.
- **Dependencias internas:** usar `"workspace:*"` (nunca `"*"`).

---

## Flujo de trabajo obligatorio para agentes

```
1. Explorar  → Leer los archivos relevantes antes de cualquier cambio.
2. Planear   → Si el task tiene más de 2 pasos no triviales, entrar en plan mode.
3. Preguntar → Si hay ambigüedad, preguntar antes de asumir.
4. Ejecutar  → Implementar con tests donde aplique.
5. Verificar → Correr lint/typecheck antes de considerar el task completo.
```

---

## Reglas

### MUST
- Usar `workspace:*` para dependencias internas entre packages del monorepo.
- Commits atómicos con Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Leer el archivo antes de editarlo.
- Preguntar si el requerimiento es ambiguo antes de implementar.

### MUST NOT
- Usar `any` en TypeScript.
- Force push (`--force`) en ninguna rama.
- Crear archivos innecesarios.
- Asumir sin verificar — siempre explorar primero.

---

## Testing

- Framework: **Vitest** + Testing Library.
- Cobertura mínima: **80%** para código crítico.
- No over-mocking: testear comportamiento real, no implementación.
- Correr tests antes de considerar un cambio completo.

---

## MCP Context7

Usar Context7 para obtener documentación actualizada de:

- Next.js, React, Astro
- TailwindCSS v4, Shadcn UI
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Vitest, Zod, Recharts

**Proceso:**
1. Identificar la tecnología que necesita investigación.
2. Consultar a través de Context7.
3. Verificar versiones y breaking changes.
4. Integrar en la implementación.

Priorizar Context7 sobre conocimiento previo del modelo. Si Context7 no tiene la información, solicitar al usuario antes de proceder con suposiciones.

---

## Variables de entorno

Ver [README.md — Variables de entorno](./README.md#variables-de-entorno) para instrucciones de configuración. No duplicar aquí.
