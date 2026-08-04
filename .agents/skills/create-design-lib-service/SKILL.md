---
name: create-design-lib-service
description: Create or refactor non-visual services and runtime infrastructure in hans-ui-design-lib. Use for framework-agnostic browser integrations, theme/runtime APIs, reusable stateful orchestration, public utility services, or service-like behavior shared by multiple components while preserving React and CDN compatibility and avoiding unnecessary service layers.
---

# Create a Design Library Service

## Prepare

1. Read `.agents/AGENTS.md`, `README.md`, `src/theme/`, `src/utils/`, affected components, public entrypoints, and tests.
2. Inspect `git status --short` and preserve unrelated work.
3. Define the consumers and public boundary before introducing a service.

## Classify before creating

- Keep pure, stateless cross-cutting conversion in `src/utils/`.
- Keep component-specific calculation or DOM behavior in that component's `helpers/` folder.
- Keep theme behavior in `src/theme/` and extend the existing runtime theme API.
- Use `src/services/<Service>/` only for a genuinely shared, non-visual, stateful or external-runtime orchestration boundary that does not belong to a component, theme, or utility.
- Use a React hook/context only when React lifecycle or composition is essential; do not make a React-only API the sole implementation of a service needed by Web Component consumers.
- Do not add a service merely to wrap one function or rename a utility.

## Create a true service

For a new service folder, normally create:

- `<Service>.service.ts`
- `<Service>.service.types.ts` for meaningful public/internal contracts
- `<Service>.service.test.ts`

Use focused helpers with adjacent tests when calculations or DOM orchestration can be isolated. Avoid empty barrel files.

## Implement

- Keep the core framework-agnostic whenever possible.
- Inject dependencies through constructor arguments or explicit factory parameters instead of importing hidden singletons.
- Make lifecycle, subscription, listener, timer, observer, storage, and DOM cleanup explicit and idempotent.
- Define error behavior and browser/SSR guards; never assume `window` or `document` exists without checking when the build can execute outside the browser.
- Keep public types narrow and avoid `any`, mutable shared globals, and implicit side effects at module import time.
- If the service exposes a browser global such as `window.HansUI`, update the matching global declaration, registration/bootstrap path, and tests.
- Export public services/types from `src/index.ts`. Update `src/index-wc.ts` only when CDN runtime initialization is required; a service is not a custom element.
- Document a public integration API in README or Getting Started documentation. Do not create Storybook stories for a non-visual service unless an interactive visual demonstration genuinely helps.

## Test

- Cover success, failure, unavailable-browser, repeated initialization, disposal, dependency substitution, and all state transitions.
- Restore global objects, fake timers, listeners, observers, and DOM mutations after every test.
- Test framework adapters separately from the framework-agnostic core.
- Maintain 100% statements, branches, functions, and lines.

## Validate

```powershell
rtk npm run lint
rtk npm run test:coverage
rtk npm run build
rtk npm run build:cdn
rtk npm run build:storybook
```

Fix all warnings in scope. Do not bump or publish a release unless explicitly authorized.
