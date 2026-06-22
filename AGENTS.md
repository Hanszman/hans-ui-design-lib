# AGENTS.md - hans-ui-design-lib

## Project purpose

`hans-ui-design-lib` is the shared React + TypeScript design system used as the visual base for personal projects, especially `hans-portfolio-app`.

It ships components in two ways:

- npm package for React consumers.
- CDN/web components for non-React consumers such as Angular.

The library must stay reusable, documented in Storybook, fully typed, accessible and safe to consume through both React and web component entrypoints.

## Tech stack

- React `19.2.4`
- TypeScript `5.8.3`
- Vite
- Storybook `9`
- TailwindCSS `4` + SCSS
- Vitest + React Testing Library + JSDOM
- ESLint flat config + Prettier
- `react-icons`
- `react-to-webcomponent`
- `@ungap/custom-elements`
- `echarts` for charting

Use Node `24.14.1` and npm `11.11.0`.

## Mandatory quality bar

Every change must follow:

- Clean Code
- DRY
- KISS
- YAGNI
- SRP
- SOLID
- clear naming
- small public APIs
- small components
- reusable composition
- reusable and composable components
- no unnecessary abstraction
- no hidden behavior

Required validation before a task is done:

- `npm run lint`
- `npm run test:coverage`
- `npm run build`
- `npm run build:cdn`
- `npm run build:storybook`

Coverage must stay at `100%` statements, branches, functions and lines for relevant files. Lint must pass with no errors and no warnings. Builds must pass. Storybook behavior must stay valid for all changed components.

Known external warnings, such as unrelated React `act(...)` warnings in existing tests, should not be expanded or ignored silently if the touched scope can fix them safely.

## Core folder structure

- `src/components/` contains every exported component.
- `src/components/Forms/` groups form-oriented primitives such as Button, Input, Dropdown, SelectOption, Toggle and DatePicker.
- `src/components/<Component>/` is the default component folder.
- `src/components/<Component>/helpers/` contains helper functions, helper types and helper tests for that component.
- `src/components/<Component>/<ChildComponent>/` contains subcomponents that are specific to the parent component.
- `src/styles/` contains global reset, theme colors, Tailwind entry and the global style imports.
- `src/theme/` contains the runtime theme API and theme tests.
- `src/utils/` contains cross-cutting utility infrastructure, such as React to web component conversion.
- `src/index.ts` is the public package export surface.
- `src/index-wc.ts` is the CDN/Web Components registration entrypoint for Angular and framework-agnostic consumers.
- `src/styles/index.css` imports every component stylesheet and global styling layer.

## Component file pattern

Each reusable component should normally have these six files:

- `<Component>.tsx`
- `<Component>.types.ts`
- `<Component>.test.tsx`
- `<Component>.stories.tsx`
- `<Component>.mdx`
- `<component>.scss`

Examples:

- `Button.tsx`, `Button.types.ts`, `Button.test.tsx`, `Button.stories.tsx`, `Button.mdx`, `button.scss`
- `Table.tsx`, `Table.types.ts`, `Table.test.tsx`, `Table.stories.tsx`, `Table.mdx`, `table.scss`

If a component requires helpers, add:

- `helpers/<Component>.helper.ts`
- `helpers/<Component>.helper.types.ts` when helper-specific types are needed
- `helpers/<Component>.helper.test.ts`

If a component becomes large, move a coherent internal piece into a subcomponent folder under the parent component. Follow the same local file pattern for the child:

- `<Child>.tsx`
- `<Child>.types.ts` when needed
- `<Child>.test.tsx`
- `<child>.scss`

Use `Table/TableBody`, `Table/TableHeader`, `Kanban/KanbanColumn`, `Kanban/KanbanItem`, `Toggle/ToggleSwitch` and `Toggle/ToggleSegmented` as examples.

## What belongs in TSX, types and helpers

Component `.tsx` files should focus on:

- rendering
- composition
- props consumption
- accessibility wiring
- refs
- controlled/uncontrolled state wiring when it is truly component state
- calls into helpers for derived logic

Component `.types.ts` files should contain:

- public prop types
- exported value types
- public event/action types
- enum-like unions that define the component contract

Helper files should contain:

- class name builders
- inline style builders
- reusable predicates
- event handler factories
- data mappers
- DOM orchestration
- calculations
- sorting/filtering logic
- logic used inside `useEffect`, `useLayoutEffect`, or similar hooks
- constants that support component behavior

Do not keep large functions, complex constants, nested mappers, or effect bodies inline inside `.tsx` when they can be named and tested in helpers. The component should read as a clean shell around behavior that is easy to test directly.

If a helper or child component needs specific types, create a local `*.helper.types.ts` or child `*.types.ts` instead of placing ad hoc interfaces inside implementation files.

## Styling conventions

- Use SCSS with Tailwind utilities.
- Prefer Tailwind via `@apply` where the utility expresses the rule clearly.
- Use plain SCSS only when Tailwind is not adequate for the rule.
- Use design tokens and CSS variables. Avoid hardcoded colors unless they are part of an intentional token definition.
- Keep component styles local to the component stylesheet.
- Global resets, theme colors and Tailwind layers belong in `src/styles/`.
- Every component stylesheet must be imported by `src/styles/index.css` when the component is part of the public library.

## Documentation and Storybook

Every component must be documented in Storybook:

- `*.stories.tsx` should expose practical interactive examples.
- `*.mdx` should explain purpose, props, common usage, edge cases, sizes, variants, colors, accessibility notes and web component notes when relevant.
- Include examples for all meaningful states and scenarios, not only the happy path.
- If a new prop is added, update stories and MDX in the same change.

Storybook must continue to work after changes:

- `npm run storybook` for local docs.
- `npm run build:storybook` when validating static documentation output.

## React and web component compatibility

This library must work in React and through CDN/web components.

When changing a component:

- preserve React props behavior
- preserve generated web component behavior
- consider how attributes/properties are passed from Angular or plain HTML
- avoid relying on React-only composition if the component needs projected content in web component mode
- keep portal, modal, popup and DOM-related behavior tested in helper tests when possible

For modals and other portal-based components, be careful with body scroll lock, focus, cleanup and projected content. Any DOM orchestration should be helper-backed and covered by tests.

## Exports and public API

When adding a new public component:

1. export the component and public types from `src/index.ts` when it belongs to the React/npm public API
2. import its stylesheet in `src/styles/index.css`
3. register it in `src/index-wc.ts` when it should be available as a Web Component
4. add tests, stories and MDX
5. run the full validation scripts

Do not expose helper internals from `src/index.ts` unless they are intentionally part of the public API.

### React package vs Web Components entrypoints

The library has two public consumption surfaces. Keep them aligned when a component is meant to work in both React and non-React applications.

`src/index.ts` is the React/npm entrypoint:

- Use it for React consumers importing from the package, for example `import { HansButton } from 'hans-ui-design-lib'`.
- Export React components, public prop types, public helper types and public theme utilities.
- Do not register custom elements here.

`src/index-wc.ts` is the CDN/Web Components entrypoint:

- Use it for Angular, plain HTML and other framework consumers that render tags such as `<hans-button>`.
- Import each React component plus its `Props` type and `PropsList` metadata.
- Register each custom element with `registerReactAsWebComponent`.
- Pass event prop names during registration so React callbacks are exposed as DOM custom events to non-React consumers.
- Call `registerHansThemeApi()` so Web Component consumers can use `window.HansUI.setTheme(...)`.
- Do not treat this file as the React export surface; its responsibility is runtime custom-element registration.

When props or events change:

- Update the component `PropsList` so the Web Component wrapper can observe and map new props correctly.
- Update the event names passed to `registerReactAsWebComponent` when callbacks are added, renamed, or removed.
- Validate both public builds with `npm run build` and `npm run build:cdn`.

## Testing standards

- Unit tests live next to the file being tested.
- Helper tests live in the `helpers/` folder.
- Prefer testing helper behavior directly instead of asserting implementation details through large component mounts.
- Test accessibility-relevant behavior, events, controlled/uncontrolled behavior, variants, states, edge cases and cleanup.
- Keep `test:coverage` at `100%`.

## Important scripts

- `npm run dev` - Vite dev server.
- `npm run start` - Vite dev server alias.
- `npm run lint` - ESLint.
- `npm run test` - Vitest run.
- `npm run test:coverage` - Vitest with V8 coverage.
- `npm run build` - package build plus asset copy.
- `npm run build:local` - package build plus local npm tarball.
- `npm run build:cdn` - CDN/web component build.
- `npm run build:cdn-local` - CDN build plus local preview.
- `npm run build:storybook` - static Storybook build.
- `npm run storybook` - local Storybook at port 6006.
- `npm run release:patch`, `npm run release:minor`, `npm run release:major` - validated release flow with version bump, npm build, CDN build, Storybook build and npm publish.
- `npm run publish:patch`, `npm run publish:minor`, `npm run publish:major` - version and publish to npm.

## CDN cache busting and release versioning

The CDN output must be version-aware.

Rules:

- `src/scripts/create-cdn-index.js` must read the current `package.json` version.
- `npm run build:cdn` must generate versioned URLs for both CSS and JS using the same version value.
- the CDN output must keep raw asset URLs available and also expose versioned URLs.
- the CDN output must generate `cdn/version.json` with the current version plus raw, query-versioned and file-versioned asset paths.
- README examples that show CDN usage must document the `?v=` cache-busting parameter and explain that it is based on the release version.

Expected behavior:

- CSS example: `/hans-ui-design-lib.css?v=<package-version>`
- JS example: `/hans-ui-web-components.js?v=<package-version>`
- CSS immutable file: `/hans-ui-design-lib-<package-version>.css`
- JS immutable file: `/hans-ui-web-components-<package-version>.js`
- Manifest: `/version.json`

Release flow:

1. run `npm run release:[patch|minor|major]`
2. lint and coverage validation run first
3. `package.json` version is bumped
4. npm package, CDN bundle and Storybook are rebuilt
5. npm publish runs
6. commit and push the version bump
7. Vercel rebuilds the CDN and serves the new versioned asset URLs

Consumer guidance:

- consumers should pin both CDN assets with the same version
- consumers should never mix CSS from one version with JS from another
- if a consumer wants immutable production assets, it should consume the versioned file names
- if a consumer wants to automate cache invalidation, it can read `version.json` or inject the release version during its own deploy

## Collaboration rules

- Before building a new primitive, check whether an existing component can be extended cleanly.
- Do not make breaking API changes without explicit alignment.
- Keep changes narrow and intentional.
- If a consumer project needs a reusable component or missing generic capability, prefer implementing it here instead of duplicating it in the app.
- If the need is portfolio-specific or other project specific component, it belongs in the other project, not here.
