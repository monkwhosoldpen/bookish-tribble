# CLAUDE.md

## Project Overview

**React Native Reusables** — a component library bringing shadcn/ui patterns to React Native using Nativewind. Monorepo with a CLI tool, documentation site, and mobile showcase app.

- **Language:** TypeScript 5.9.3 (strict mode)
- **Runtime:** Node >=20.11.0 (pinned 20.11 in .nvmrc)
- **Package Manager:** pnpm 9.1.4
- **Monorepo Orchestration:** Turborepo

## Repository Structure

```
apps/
  cli/          # CLI tool (Effect.ts) for initializing projects and adding components
  docs/         # Documentation site (Next.js 15 + Fumadocs)
  showcase/     # Mobile demo app (Expo 54 + React Native 0.81)
packages/
  registry/     # Component implementations (nativewind, uniwind, new-york themes)
```

## Commands

```bash
# Development
pnpm dev                    # Start all dev servers
pnpm dev:docs               # Docs site only
pnpm dev:showcase           # Mobile showcase only

# Build & Validate
pnpm build                  # Build all apps
pnpm lint                   # ESLint across monorepo
pnpm test                   # Vitest across monorepo

# CLI app specific (from apps/cli/)
pnpm check                  # TypeScript type checking
pnpm lint-fix               # Auto-fix lint issues
pnpm coverage               # Test coverage report
```

## Code Conventions

### TypeScript
- Strict mode with `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`
- Use explicit `import type { ... }` for type-only imports
- Path aliases: `@cli/*` → `./src/*` (CLI), `@/*` → `./src/*` (registry)

### Formatting (Prettier)
- Root: 100 print width, single quotes, trailing commas (es5), tab width 2
- CLI app: 120 print width, double quotes, no semicolons, no trailing commas
- Tailwind plugin enabled with `cva` function support

### Linting (ESLint 9 flat config)
- @typescript-eslint strict rules
- `simple-import-sort` for import ordering
- `sort-destructure-keys` for destructured object keys
- `@effect/eslint-plugin` for Effect.ts patterns (CLI)

### Component Patterns
- Variants defined with CVA (class-variance-authority)
- Nativewind/Tailwind CSS for styling
- `@rn-primitives/*` for base component functionality (27+ packages)
- Platform-specific styles via `Platform.select({ web: '...', native: '...' })`
- Context providers for nested component styling (e.g., `TextClassContext`)

### File Naming
- Components: PascalCase (`Button`, `AlertDialog`)
- Files: kebab-case (`button.tsx`, `alert-dialog.tsx`)
- Functions/variables: camelCase
- Manifest constants: UPPER_SNAKE_CASE

### CLI Architecture (apps/cli)
- Built with Effect.ts for functional, composable async operations
- Services extend `Effect.Service<T>()` with dependency injection
- Commands composed via `Effect.provide` and `Effect.gen` generators
- Bundled with tsup

## CI/CD

GitHub Actions runs on PRs and pushes to main:
1. **Build** — validates `pnpm install`
2. **Types** — `pnpm check`
3. **Lint** — `pnpm lint`
4. **Test** — `pnpm test`

Versioning uses Changesets with beta/next/release npm tags.

## Key Dependencies

| Area | Packages |
|------|----------|
| UI primitives | `@rn-primitives/*` |
| Styling | nativewind, tailwindcss, cva |
| Forms | react-hook-form, @hookform/resolvers |
| Tables | @tanstack/react-table |
| Icons | lucide-react-native |
| CLI framework | effect, @effect/cli, @effect/platform |
| Docs | fumadocs-ui, fumadocs-core, shadcn-cli |
