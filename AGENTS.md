## Tenologías

- PNPM como gestor de paquetes
- TypeScript (estricto)
- Next.js 15
- React 19
- TailwindCSS v4 con soporte a dark mode
- Shadcn UI (Radix UI + Tailwind)
- Lucide React
- React Hook Form + Zod para validación
- Supabase (Base de datos y Autenticación)
- Vitest + Testing Library
- ESLint con configuración Next.js
- Prettier
- Axios con interceptores
- Zod para esquemas de datos
- React hooks (useState, useEffect, etc.)

## Despliegue y CI/CD

- Configurar para desplegar en Vercel

## Buenas Prácticas

### Código y Calidad

- TypeScript estricto: Sin `any` permitido
- Componentes funcionales: Preferir hooks sobre clases
- Nomenclatura clara: Nomes descriptivos y consistentes
- Documentación: JSDoc para funciones complejas
- Manejo de errores: Try/catch apropiado y mensajes claros
- Investigación constante: Utilizar MCP Context7 para mantener conocimientos actualizados

### Testing

- Pruebas unitarias: Por función/componente
- Pruebas de integración: Entre componentes
- Pruebas E2E: Flujo completo de usuario
- Coverage mínimo: 80% para código crítico
- Mocking apropiado: Sin over-mocking

### Git y Versionado

- Commits atómicos: Un cambio por commit
- Mensajes claros: Convención Conventional Commits (feat, fix, release, docs, etc.)
- Branches feature: `feature/nombre-funcionalidad`
- Pull requests: Revisión obligatoria
- No force push: NUNCA usar `--force`

### Nunca Saltar

- Testing básico: Siempre ejecutar tests antes de hacer cambios

## Notas Finales

- Comunicación constante: Mantener al usuario informado
- Calidad primero: Nunca sacrificar calidad por velocidad
- Documentación viva: Mantener actualizada la documentación
- Pruebas como seguridad: Las pruebas son red de seguridad
- Metodología estricta: Seguir siempre las reglas definidas

## Skills del Proyecto

### Sistema de Skills

Las skills son **instrucciones OBLIGATORIAS** que complementan y enriquecen la metodología principal del proyecto. Deben ser consultadas y seguidas en cada fase del desarrollo a medida de que la tecnología o herramienta se utilice. Están organizadas por categorías y se acceden mediante links a la carpeta `skills/`.

### Tabla de Skills Disponibles

| Categoría     | Skill          | Descripción                           | Link                                         |
| ------------- | -------------- | ------------------------------------- | -------------------------------------------- |
| Lenguaje      | TypeScript     | Programación con TypeScript estricto  | [SKILL.md](./skills/typescript/SKILL.md)     |
| Framework     | Next.js 15     | Framework React con Server Components | [SKILL.md](./skills/nextjs-15/SKILL.md)      |
| Librería      | React 19       | Latest React features and hooks       | [SKILL.md](./skills/react-19/SKILL.md)       |
| Librería      | TailwindCSS v4 | Utility-first CSS framework           | [SKILL.md](./skills/tailwindcss-v4/SKILL.md) |
| Base de Datos | supabase       | Base de datos y Autenticación         | [SKILL.md](./skills/supabase/SKILL.md)       |

### Uso de Skills

- Al crear planes, consultar skills relevantes para tecnologías específicas
- Durante implementación, usar skills como guía para buenas prácticas
- Resolución de problemas, consultar skills para patrones comunes
- Aprendizaje, explorar skills para nuevas tecnologías
- Investigación, utilizar MCP Context7 para obtener información actualizada y complementar las skills

### Regla de Oro: Skills Obligatorias

**SIEMPRE** consultar y aplicar las skills relevantes en cada desarrollo:

- Al iniciar, revisar skills de las tecnologías involucradas
- Durante implementación, seguir patrones y configuraciones de las skills
- Al resolver problemas, consultar soluciones comunes en las skills
- En validación, verificar que se cumplen los estándares de calidad

### Uso de MCP Context7 para Investigación

**SIEMPRE** utilizar MCP Context7 para obtener información actualizada sobre:

- Lenguajes de programación (TypeScript, JavaScript, etc.)
- Frameworks (Next.js, React, Vue, etc.)
- Librerías y herramientas (TailwindCSS, Shadcn, Axios, etc.)
- Mejores prácticas y patrones actuales
- Documentación oficial y versiones más recientes
- Soluciones a problemas específicos

**Proceso de uso de Context7:**

1. Identificar la tecnología que necesita investigación
2. Consultar la documentación oficial a través de Context7
3. Verificar versiones más recientes y cambios de breaking
4. Obtener mejores prácticas y patrones recomendados
5. Integrar la información en la implementación actual

**Context7 como fuente de verdad:**

- Priorizar información de Context7 sobre conocimientos previos
- Verificar que la información esté actualizada y sea relevante
- Documentar cualquier desviación de las prácticas recomendadas

### Estructura de Skills

Cada skill puede contener:

- Configuración inicial de la tecnología
- Buenas prácticas y patrones recomendados
- Ejemplos de código y casos de uso
- Integración con el stack existente
- Soluciones comunes para problemas típicos

### Investigación y Mantenimiento

- Context7 como fuente: Utilizar MCP Context7 para obtener información actualizada
- Verificación de información: Validar que las prácticas recomendadas sean vigentes

## Estructura del Proyecto

```
concurso-docente-2026/
├── public/                        # Archivos estáticos
├── skills/                        # Skills obligatorias del proyecto
│   ├── nextjs-15/
│   ├── react-19/
│   ├── supabase/
│   ├── tailwindcss-v4/
│   └── typescript/
├── src/
│   ├── app/                       # App Router de Next.js 15
│   │   ├── favicon.ico
│   │   ├── globals.css            # Estilos globales (TailwindCSS v4)
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Página raíz
│   ├── components/
│   │   ├── ui/                    # Componentes de UI (Shadcn/Radix)
│   │   └── shared/                # Componentes reutilizables del proyecto
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utilidades y configuraciones de librerías
│   ├── services/                  # Capa de servicios (API, Supabase, Axios)
│   ├── test/
│   │   └── setup.ts               # Setup global de Vitest + Testing Library
│   └── types/                     # Tipos e interfaces TypeScript compartidos
├── .env.local.example             # Template de variables de entorno
├── .prettierrc                    # Configuración de Prettier
├── .prettierignore
├── eslint.config.mjs              # Configuración ESLint (Next.js + TypeScript)
├── next.config.ts                 # Configuración de Next.js
├── tsconfig.json                  # TypeScript estricto
└── vitest.config.ts               # Configuración de Vitest (coverage ≥ 80%)
```

---

## Comandos

### Desarrollo

```bash
# Iniciar servidor de desarrollo con Turbopack
pnpm dev

# Compilar para producción
pnpm build

# Iniciar servidor de producción (requiere build previo)
pnpm start
```

### Calidad de Código

```bash
# Análisis estático con ESLint
pnpm lint

# Verificar tipos con TypeScript
pnpm typecheck

# Formatear código con Prettier
pnpm format

# Verificar formato sin modificar archivos
pnpm format:check
```

### Testing

```bash
# Ejecutar tests en modo watch
pnpm test

# Ejecutar tests con UI interactiva
pnpm test:ui

# Ejecutar tests con reporte de cobertura (mínimo 80%)
pnpm test:coverage
```

### Variables de Entorno

Copiar `.env.local.example` a `.env.local` y completar con las credenciales de Supabase:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=<tu-url-de-supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
```

---

**Esta guía es obligatoria de seguir en cada desarrollo. Cualquier desviación debe ser justificada y documentada.**
