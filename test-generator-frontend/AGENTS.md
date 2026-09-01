<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Strict Instructions for AI Coding Agents

These rules are mandatory for every change in `test-generator-frontend`. Do not weaken them for convenience, “temporary” shortcuts, or prior chat context.

## Stack (do not replace)

- Next.js App Router
- React
- **JavaScript only** (`.js` / `.jsx`) — **never** introduce TypeScript (`.ts` / `.tsx`), interfaces, or type-declaration files for app code
- Tailwind CSS + design tokens in `src/styles/`
- Redux Toolkit Query (RTK Query) for API handling
- NestJS backend (separate package) — integrate via existing frontend services only

## Existing Service / API Layer — DO NOT MODIFY

The NestJS backend integration and RTK Query service layer already exist and **must remain untouched**.

**Never:**

- create another service layer
- move, rename, or reorganize `src/services/` (including `SplitApiSetting.js`, `apiEnpoint.js`, `src/services/api/*`)
- duplicate API logic
- replace RTK Query with Axios, TanStack Query, or custom clients
- change working endpoints, injectEndpoints shapes, or store API wiring for “architecture” reasons
- move backend-related logic into page `features/`

**When a feature needs data:** import existing RTK Query hooks from `@/services/api/*.api` (or existing store slices). Do not invent parallel fetchers.

## Page = Composition Only

`page.js` files compose sections/components. They must **not** contain large UI implementations, business logic, API orchestration, or data processing.

```jsx
import { Hero, FeaturedClasses, Features } from "./features";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedClasses />
      <Features />
    </>
  );
}
```

Route `layout.js` files only wire shared chrome (Header, shells, etc.).

## Feature Ownership

Page-specific UI lives next to the page:

```text
app/(route-group)/…/page.js
app/(route-group)/…/features/
  FeatureName/
    FeatureName.jsx
    index.js
    featureNameData.js   # optional
```

- Used by one page → that page’s `features/`
- Used across multiple pages → `src/components/shared/`
- Primitive design-system pieces → `src/components/ui/`

Do not recreate a global `src/features/` domain tree. Do not create global components without clear multi-page reuse.

### Feature folder convention

```text
FeatureName/
├── FeatureName.jsx
├── index.js
└── featureNameData.js   # only when it improves organization
```

Barrel:

```js
export { FeatureName } from "./FeatureName";
```

Colocate subcomponents, data, and feature-only helpers with the feature.

## Components Layout

```text
src/components/
├── ui/          # Button, Typography, Container, Card, …
└── shared/      # Header, Footer, shells, ChapterSidebar, …
```

- Import UI: `@/components/ui`
- Import shared: `@/components/shared`
- Prefer folder-per-component with `index.js`

## Centralized Typography

All website text must use `src/components/ui/Typography` (variants in `typographyData.js`).

Do **not** invent one-off font sizes, weights, or line heights in components. Prefer:

```jsx
<Typography variant="h1">Title</Typography>
<Typography variant="body">Copy</Typography>
```

Variants include: `display`, `h1`–`h6`, `body`, `bodyLarge`, `bodySmall`, `caption`, `label`, `navigation`, `buttonText`.

`Heading` is a thin compatibility wrapper — prefer `Typography` for new code.

## Design System

Centralize visual decisions in tokens + UI primitives:

- colors, spacing, radius, shadows → `src/styles/`
- buttons, containers, form patterns → `src/components/ui/`

The UI must feel like **one** coherent system, not independently styled sections.

## Visual Design Rules

Ship a professional product UI. Avoid AI-generated aesthetics:

- no generic stock illustrations, random blobs, meaningless glow, glassmorphism spam
- no decorative icons/assets that do not communicate
- no excessive cards, shadows, gradients, or floating shapes
- reuse existing project assets when appropriate
- every visual element needs a clear purpose

## File Size Limit

**No source file may exceed 300 lines** (`.js`, `.jsx`, `.css`).

If approaching the limit: split components, extract data files, or colocate subcomponents. Do not minify/compress code just to pass the limit.

## Code Quality

Remove dead code, unused imports/exports, commented-out leftovers, duplicate components/styles, and pointless wrappers/abstractions.

Prefer simple, readable JavaScript. Add abstractions only for real reuse.

## Naming & Imports

- Components: PascalCase files (`Hero.jsx`)
- Utilities/data: camelCase (`heroData.js`)
- Prefer path aliases: `@/components/ui`, `@/components/shared`, `@/services/api/…`, `@/store/…`, `@/data/…`, `@/constants`, `@/utils`
- Pages import from local `./features` barrels, not deep private paths of other routes

## Creating New Components

1. Decide ownership: page feature vs shared vs ui
2. Follow the feature/ui folder convention + barrel export
3. Use `Typography` and existing UI primitives
4. Keep files ≤300 lines
5. Do not touch `src/services/` or invent a new API layer

## Modifying Architecture

- Restructuring UI/pages is allowed when it improves feature ownership
- Changing the RTK Query / NestJS integration architecture is **not** allowed
- Do not change routes, auth behavior, or user-facing functionality unless the task explicitly requires it
- Preserve existing behavior when moving files — update all imports

## Preserve Functionality

Restructuring is not a rewrite. Keep business logic, API behavior, auth, and interactions working exactly as before unless the user asks otherwise.

## Preserve Commented Code

When editing any file, **do not remove existing commented-out code** unless the user explicitly asks.

- Keep `//`, `/* */`, and `{/* */}` blocks that contain disabled code or notes
- Do not delete comments as part of cleanup, refactoring, or "code quality" passes
- Only remove commented code when the user clearly requests it
- If removal seems necessary, ask first

This rule also lives in `.cursor/rules/preserve-commented-code.mdc` (`alwaysApply: true`).
