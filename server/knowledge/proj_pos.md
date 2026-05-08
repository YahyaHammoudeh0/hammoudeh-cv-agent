# POS / Swift POS (synthesized from manifest)
Source: /Users/yahya/Documents/POS/package.json (and /Users/yahya/Documents/POS2/package.json)

Synthesized from manifest, no top-level README found.

Project name: `swift-pos`. A private Turborepo monorepo for a POS system. Uses pnpm workspaces (packageManager: pnpm@10.27.0) and requires Node >= 20. Built with Next.js 15.5.9 and TypeScript 5.7.2 via Turbo (^2.3.0).

Top-level scripts (delegated to Turbo):
- `dev` / `build` / `lint` / `test` / `test:watch`
- Database scripts: `db:generate`, `db:push`, `db:studio` (uses `pnpm --filter @pos/db studio`)

`onlyBuiltDependencies` includes `sharp`, `@parcel/watcher`, `@swc/core`, `@sentry/cli`, suggesting image processing, watch tooling, SWC compiler, and Sentry error tracking are part of the stack.

POS2 has identical manifest content (likely a sibling/working copy of the same Swift POS project).
