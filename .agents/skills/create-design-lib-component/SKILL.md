---
name: create-design-lib-component
description: Create or extend a reusable React component in hans-ui-design-lib for both npm/React and CDN/Web Component consumers. Use when adding a new visual primitive, form control, composite library component, component prop, state, event, helper, Storybook story, MDX documentation, or public component export.
---

# Create a Design Library Component

## Prepare

1. Read `.agents/AGENTS.md`, `README.md`, the nearest component with similar behavior, `src/index.ts`, `src/index-wc.ts`, and `src/styles/index.css`.
2. Inspect `git status --short` and preserve unrelated changes.
3. Verify that an existing primitive cannot be extended cleanly before adding another public API.
4. Define React props, Web Component attributes/properties/events, accessibility behavior, controlled state, and meaningful visual states before coding.

## Place the component

- Use `src/components/<Component>/` by default.
- Put form primitives under `src/components/Forms/<Component>/`.
- Put a parent-only child under `src/components/<Parent>/<Child>/`.
- Put reusable behavior local to the component in `helpers/` rather than in the TSX body.

## Create the component set

Normally create:

- `<Component>.tsx`
- `<Component>.types.ts`
- `<Component>.test.tsx`
- `<Component>.stories.tsx`
- `<Component>.mdx`
- `<component>.scss`

Add helper implementation, helper types, and helper tests only when behavior warrants them. Do not create empty scaffolding.

## Implement the public API

- Keep TSX focused on rendering, composition, props, refs, accessibility, and calls to tested helpers.
- Keep public prop/value/event unions in the types file.
- Define and maintain the component `PropsList` metadata used by the Web Component bridge.
- Treat HTML attributes as strings at the bridge boundary where applicable; test boolean, numeric, object, array, and event mapping behavior relevant to the component.
- Support React and Web Component consumption without relying on React-only projected composition.
- Use semantic HTML, keyboard support, focus behavior, ARIA names/states, disabled/loading behavior, and cleanup appropriate to the control.
- Keep controlled and uncontrolled behavior explicit; do not hide synchronization side effects.
- Use SCSS with Tailwind `@apply` and existing design tokens. Add the stylesheet to `src/styles/index.css`.

## Expose both entrypoints

1. Export the component and intentional public types from `src/index.ts`.
2. Register the custom element in `src/index-wc.ts` when the component is available to Angular/plain HTML.
3. Pass callback prop names to `registerReactAsWebComponent` so they emit DOM custom events.
4. Do not export internal helpers unless they are a deliberate public API.

## Document and test

- Add practical Storybook stories for variants, sizes, colors, loading, disabled, empty, error, long content, and interaction states that exist.
- Explain purpose, props, usage, edge cases, accessibility, and Web Component syntax in MDX.
- Test visible behavior, events, accessibility, controlled/uncontrolled paths, edge cases, helper branches, DOM cleanup, and Web Component-sensitive metadata.
- Maintain 100% statements, branches, functions, and lines.

## Validate

```powershell
rtk npm run lint
rtk npm run test:coverage
rtk npm run build
rtk npm run build:cdn
rtk npm run build:storybook
```

Fix warnings in the touched scope. Do not publish or bump a release unless the user explicitly includes release/deployment in the request.
