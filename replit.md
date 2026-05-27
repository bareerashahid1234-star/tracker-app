# TrackForge

A premium productivity SaaS app for building custom habit grids, goal trackers, and task systems with analytics, streaks, and sharing.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/trackforge run dev` — run the React frontend (port 22132)
- `pnpm run typecheck` — full typecheck across all packages (run `typecheck:libs` first to build composite libs)
- `pnpm run typecheck:libs` — build composite lib packages (db, api-spec, api-zod, api-client-react)
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` — Clerk auth keys

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, wouter, TanStack Query, Framer Motion, Recharts, Tailwind CSS v4
- Auth: Clerk (Replit-managed)
- API: Express 5, OpenAPI-first with Orval codegen
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Build: esbuild (CJS bundle for API server)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all routes/types)
- `lib/db/src/schema/` — Drizzle DB schema (users, trackers, tracker_items, completions)
- `lib/api-zod/src/generated/` — Generated Zod validators from OpenAPI spec
- `lib/api-client-react/src/generated/` — Generated React Query hooks from OpenAPI spec
- `artifacts/api-server/src/routes/` — Express route handlers (one file per resource)
- `artifacts/trackforge/src/pages/` — React page components
- `artifacts/trackforge/src/components/` — Shared UI components + shadcn/ui
- `artifacts/trackforge/src/index.css` — Theme (dark, purple/violet primary at HSL 270 70% 60%)

## Architecture decisions

- **Contract-first API**: All routes are defined in OpenAPI first, then codegen produces Zod validators (server-side) and React Query hooks (client-side). Never edit generated files.
- **JIT user provisioning**: DB users are upserted on first request via `ON CONFLICT DO UPDATE` to handle concurrent requests safely.
- **Clerk proxy**: Frontend requests to `/api/__clerk` are proxied by the API server to Clerk's backend, keeping auth keys server-side.
- **Share tokens**: Share links use random hex tokens stored in the `trackers.share_token` column. Public route `/share/:token` fetches via `GET /api/share/:token` (no auth required).
- **Enriched tracker responses**: `enrichTracker()` in trackers.ts joins item count, today's completion %, and streak data into every tracker response.

## Product

- **Landing page**: Public marketing page with hero, features grid, and CTA
- **Authentication**: Clerk sign-in/sign-up with dark purple branded UI
- **Dashboard**: Stats (total trackers, today %, streak, productivity score), pinned trackers, recent activity feed
- **Trackers list**: Search, grid/list toggle, tracker cards with today's progress and streaks
- **Tracker detail**: Multi-section dashboard — sidebar nav, per-section layout renderers, DnD reorder, collapsible sections, share/edit actions
- **Tracker create/edit**: Form with title, description, category, mode, icon, color picker
- **Analytics**: Per-tracker bar chart (7 days) + area chart (30 days), all-trackers overview
- **Profile**: Display name, bio editing; Clerk avatar display
- **Share page**: Public read-only tracker view with sections + habit grid

## Section System

Each tracker contains multiple sections (like a Notion dashboard). Each section has:
- `layoutType`: `habit_grid` | `checkbox` | `progress` | `notes` | `counter` | `streak` | `timer`
- `icon`, `color`, `name`, `position` (drag-to-reorder), `isCollapsed`
- Items belong to a section via `section_id` FK on `tracker_items`

DB tables: `tracker_sections` (new), `tracker_items.section_id` (new FK column)
Routes: `artifacts/api-server/src/routes/sections.ts` — full CRUD + reorder
Frontend: `TrackerDetail.tsx` — sidebar nav + all-sections stacked layout + per-section layout renderers

## Gotchas

- Always run `pnpm run typecheck:libs` before `pnpm run typecheck` or the DB/API types won't be built.
- Do NOT edit files in `lib/api-zod/src/generated/` or `lib/api-client-react/src/generated/` — they are auto-generated.
- The `getDbUser()` function in `trackers.ts` uses upsert (`ON CONFLICT DO UPDATE`) and is exported to `analytics.ts` and `sections.ts` — if you add routes that need a DB user, import from there.
- framer-motion `ease` in Variants must use the `Easing` type (not plain strings); omit `ease` or use a bezier array.
- The `useGetCompletionLog` hook does not accept date range params — it returns all completions for the tracker.
- `lib/api-zod/src/index.ts` exports only from `./generated/api` (not types dir) to avoid TS2308 ambiguity.
- sections.ts uses Zod schemas from `@workspace/api-zod` — do NOT import zod directly in api-server routes.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
