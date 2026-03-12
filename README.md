# Concurso Docente 2026

Simulador del concurso docente colombiano 2026 con IA, que evalúa la capacidad de aplicar normativa vigente en casos reales de la vida escolar.

---

## ¿Qué es esto?

Aplicación web que permite a docentes prepararse para el concurso de méritos 2026 mediante simulacros generados con IA. Las preguntas y escenarios se construyen a partir de la normativa vigente (decretos, leyes, resoluciones), evaluando competencias en gestión escolar, convivencia, inclusión y carrera docente.

Dirigido a: docentes del sector público colombiano que aspiran a ingresar o ascender en el escalafón.

---

## Características

### Implementadas
- Autenticación con Google OAuth (Supabase)
- Dashboard con estadísticas de desempeño, gráfico de competencias e historial reciente
- Configuración y ejecución de simulacros de examen
- Resultados detallados del simulacro
- Historial de exámenes (placeholder)

### Próximamente
- Generación de preguntas con IA alimentada por normativa
- Retroalimentación por competencia
- Modo repaso por área temática
- Ranking y comparación con otros usuarios

---

## Normativa

La IA usa la siguiente normativa como base de conocimiento:

**Marco General del Servicio Educativo**
- Constitución Política de Colombia (Art. 125 — ingreso por mérito)
- Ley 115 de 1994 · Decreto 1860 de 1994 · Decreto 1075 de 2015
- Resolución 3842 de 2022 (manual de funciones docentes)
- Guía 34 del MEN (gestión institucional)
- Derechos Básicos de Aprendizaje (DBA)

**Carrera Docente y Función Pública**
- Decreto 1278 de 2002 · Ley 909 de 2004 · Ley 1952 de 2019

**Convivencia Escolar y Resolución de Conflictos**
- Ley 1620 de 2013 · Decreto 1965 de 2013 · Decreto 1075 de 2015

**Manual de Convivencia y Gobierno Escolar**
- Ley 115 de 1994 · Decreto 1860 de 1994 · Decreto 1075 de 2015

**Educación Inclusiva**
- Decreto 1421 de 2017 · Ley 1618 de 2013 · Ley 1346 de 2009

**PRAE y Educación Ambiental**
- Decreto 1743 de 1994 · Ley 1549 de 2012 · Ley 115 de 1994

**Participación y Mesas de Trabajo**
- Ley 115 de 1994 · Decreto 1860 de 1994 · Ley 1620 de 2013

---

## Stack tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| Runtime | Node.js + pnpm | pnpm 10.26.2 |
| Monorepo | Turborepo | 2 |
| Frontend principal | Next.js | 16.1.6 |
| UI framework | React | 19.2.3 |
| Landing | Astro | 5 |
| Estilos | TailwindCSS | v4 |
| Componentes | Shadcn UI (Radix + Tailwind) | — |
| Íconos | Lucide React | — |
| Gráficos | Recharts | ^3.7.0 |
| Auth + DB | Supabase (`@supabase/ssr`) | ^0.8.0 |
| Validación | Zod | ^4.3.6 |
| Formularios | React Hook Form | — |
| HTTP | Axios | — |
| Testing | Vitest + Testing Library | ^4.0.18 |
| Linting | ESLint (Next.js config) + Prettier | — |
| Lenguaje | TypeScript (estricto) | — |

---

## Arquitectura del proyecto

```
concurso-docente-2026/
├── apps/
│   ├── platform/          # Next.js 16 — app principal (simulador, auth, dashboard)
│   └── landing/           # Astro 5 — landing page pública
├── packages/
│   └── config-ts/         # tsconfig base compartida (@repo/config-ts)
├── nginx/
│   └── nginx.conf         # Reverse proxy: /app → platform, /landing → landing-svc
├── docker-compose.yml     # platform (:3000) + landing-svc (nginx :80) + proxy (:80)
├── turbo.json             # Tasks: build, dev, lint, typecheck, test
├── pnpm-workspace.yaml
├── AGENTS.md              # Guía operativa para agentes IA
└── CLAUDE.md              # Punto de entrada para Claude Code
```

### Routing en Docker/producción

| URL | Destino |
|-----|---------|
| `/` | Redirect a `/landing` |
| `/landing` | Astro landing (nginx :80) |
| `/app` | Next.js platform (`:3000`) |

El platform se sirve bajo `NEXT_BASE_PATH=/app` y la landing bajo `ASTRO_BASE=/landing`.

---

## Rutas del platform

| Ruta | Estado | Descripción |
|------|--------|-------------|
| `/auth/signin` | Implementado | Login con Google OAuth |
| `/auth/callback` | Implementado | Callback de Supabase auth |
| `/dash` | Implementado | Dashboard: stats, gráfico de competencias, historial |
| `/sim/setup` | Implementado | Configuración del simulacro |
| `/sim/exam` | Implementado (mock) | Examen con preguntas |
| `/sim/result` | Implementado (mock) | Resultados del simulacro |
| `/record` | Placeholder | Historial de exámenes (próximamente) |

Todas las rutas excepto `/auth/signin` requieren sesión activa. Las pages son Server Components que delegan la UI a Client Components (`*PageClient.tsx`).

---

## Setup e instalación

### Prerrequisitos
- Node.js >= 20
- pnpm 10.26.2 (`npm install -g pnpm@10.26.2`)
- Cuenta en [Supabase](https://supabase.com) con proyecto creado

### Pasos

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd concurso-docente-2026

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp apps/platform/.env.local.example apps/platform/.env.local
# Editar apps/platform/.env.local con tus credenciales (ver sección Variables de entorno)

# 4. Iniciar en desarrollo
pnpm dev
```

- Platform disponible en: `http://localhost:3000`
- Landing disponible en: `http://localhost:4321`

---

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia ambas apps en paralelo (platform :3000, landing :4321) |
| `pnpm build` | Build de producción de todas las apps vía Turborepo |
| `pnpm lint` | ESLint en todo el monorepo |
| `pnpm typecheck` | TypeScript type-check en todo el monorepo |
| `pnpm test` | Ejecuta tests con Vitest |

---

## Variables de entorno

Copiar el ejemplo y completar con las credenciales de tu proyecto Supabase:

```bash
cp apps/platform/.env.local.example apps/platform/.env.local
```

```env
# apps/platform/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
```

Obtén estos valores en: **Supabase Dashboard → Project Settings → API**.

---

## Despliegue con Docker

```bash
docker-compose up --build
```

Levanta tres servicios:
- `platform` — Next.js en el puerto 3000
- `landing-svc` — Astro servida con nginx en el puerto 80 (interno)
- `nginx` — Reverse proxy en el puerto 80 (público), enruta `/app` y `/landing`

La aplicación queda disponible en `http://localhost`.

---

## Contribución

- **Commits:** Conventional Commits — `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- **Branches:** `feature/nombre-funcionalidad`, `fix/descripcion-del-bug`
- **Pull requests:** Revisión obligatoria antes de merge
- **No force push:** NUNCA usar `--force` en ramas compartidas
