# Hans UI Design Library

A **React + TypeScript Component Library** that serves as the base design system for personal projects.  
This library provides reusable, styled and documented UI components with a consistent structure and best practices.

## 🚀 Features

- ⚛️ **React 19.2.4** with **TypeScript 5.8.3** for type safety
- 🎨 **TailwindCSS + SCSS** for styling flexibility
- 📖 **Storybook** for interactive component documentation
- ✅ **Vitest + React Testing Library + JSDOM** for unit and integration testing
- 📊 **Test Coverage (V8)** with HTML reports
- 🧹 **ESLint + Prettier** for code quality and formatting
- ⚡ **Vite** as the bundler for fast builds and DX
- 🌍 Ready to be published and consumed via **npm**
- 🚢 Deployed by **Vercel**
- 📖 Documentation ready for consultation at https://hans-ui-design-lib-doc.vercel.app/
- 📦 Package available at https://www.npmjs.com/package/hans-ui-design-lib
- 🛠️ CDN ready to be used at https://hans-ui-design-lib-cdn.vercel.app/
- **Node Version to build this project: 24.14.1 and npm 11.11.0**

## 📦 Installation

```bash
npm install hans-ui-design-lib
```

## 🛠️ Usage

### React:

If you're using React, you have to install the lib with npm (checkout the installation section of this document). In a root file of your application, define:

```tsx
import 'hans-ui-design-lib/style.css';

...

// Put the data-theme combination of your choice in the html or body tags:
// (if you don't choose it, the Fallback is gona be the combination1)
<html data-theme="combination1">
...
</html>
```

Import and use the component you wish passing the props you want:

```tsx
import { HansButton } from 'hans-ui-design-lib';

...
<HansButton label="Button"></HansButton>;
```

The current 5 theme combinations are fully supported and represent the default preset system. But if your project needs a custom semantic palette, you can override the active combination at runtime:

```tsx
import { HansButton, setHansTheme } from 'hans-ui-design-lib';

setHansTheme({
  primary: {
    strong: '#1e3a8a',
    default: '#2563eb',
    neutral: '#bfdbfe',
  },
  secondary: {
    strong: '#9f1239',
    default: '#e11d48',
    neutral: '#fecdd3',
  },
  success: {
    strong: '#166534',
    default: '#22c55e',
    neutral: '#bbf7d0',
  },
  danger: {
    strong: '#991b1b',
    default: '#ef4444',
    neutral: '#fecaca',
  },
  warning: {
    strong: '#92400e',
    default: '#f59e0b',
    neutral: '#fde68a',
  },
  info: {
    strong: '#155e75',
    default: '#06b6d4',
    neutral: '#cffafe',
  },
  base: {
    strong: '#334155',
    default: '#64748b',
    neutral: '#cbd5e1',
  },
  backgroundColor: '#f8fafc',
  textColor: '#0f172a',
});

<HansButton label="Button"></HansButton>;
```

The dynamic object must include the same 23 color slots used by the built-in combinations. You can see more details about the palette customization in our Color System documentation session.

### Others:

If you're using other Technologies like Angular for example, you don't have to install it with npm, you just have to import the CDN links. In the root index.html of your application, define:

```html
<html data-theme="combination1">
  <!-- Put the data-theme combination of your choice in the html or body tags: -->
  <!-- (if you don't choose it, the Fallback is gona be the combination1) -->
  ...
  <head>
    ...
    <link
      rel="stylesheet"
      href="https://hans-ui-design-lib-cdn.vercel.app/hans-ui-design-lib.css?v=1.0.22"
    />
    <script src="https://hans-ui-design-lib-cdn.vercel.app/hans-ui-web-components.js?v=1.0.22"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

If you're using a technology like Angular, probably you're gonna have to declare `CUSTOM_ELEMENTS_SCHEMA` like this in your component:

```ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
...
```

And in your component html you can just call it like this, passing the props you want:

```html
<hans-button label="Button"></hans-button>
```

You can also override the active combination dynamically in CDN/web component usage:

```html
<script>
  window.HansUI.setTheme({
    primary: {
      strong: '#1e3a8a',
      default: '#2563eb',
      neutral: '#bfdbfe',
    },
    secondary: {
      strong: '#9f1239',
      default: '#e11d48',
      neutral: '#fecdd3',
    },
    success: {
      strong: '#166534',
      default: '#22c55e',
      neutral: '#bbf7d0',
    },
    danger: {
      strong: '#991b1b',
      default: '#ef4444',
      neutral: '#fecaca',
    },
    warning: {
      strong: '#92400e',
      default: '#f59e0b',
      neutral: '#fde68a',
    },
    info: {
      strong: '#155e75',
      default: '#06b6d4',
      neutral: '#cffafe',
    },
    base: {
      strong: '#334155',
      default: '#64748b',
      neutral: '#cbd5e1',
    },
    backgroundColor: '#f8fafc',
    textColor: '#0f172a',
  });
</script>
```

## 🧑‍💻 Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/Hanszman/hans-ui-design-lib.git
cd hans-ui-design-lib
npm install
```

Start the dev server:

```bash
npm run dev
```

Run tests:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Lint code:

```bash
npm run lint
```

Build the package:

```bash
npm run build
```

Start the server:

```bash
npm run start
```

## 🚢 Exporting

When developing a component, to export it to the lib, you can add those lines into the files:

```ts
// ./src/index.ts
export * from './components/YourComponent';
```

```css
/* ./src/styles/index.css */
@import '../components/yourComponent.scss';
```

## 📖 Documentation

The components are documented using **Storybook**.

Run Storybook:

```bash
npm run storybook
```

To build the static documentation:

```bash
npm run build:storybook
```

The build is going to generate the folder 'storybook-static' on the root of this application.
Vercel is ready to publish the Storybook documentation with this build command and this folder name.
Whenever you push your commits on 'main' branch, the Vercel deploy will be called.

## 🚢 Publishing to npm

Make sure you are logged in to npm:

```bash
npm login
```

or create a .npmrc file on the root of this application based on .npmrc-example and paste on the file the token you created on npm website.

Then build and publish:

```bash
npm run build
npm run publish:[UPDATE-TYPE]
```

UPDATE-TYPES: patch | minor | major

The build is going to generate the folder 'dist' on root of this application.
The command publish is going to update the npm lib.

To use the lib locally and feed your projects in development, run this command:

```bash
npm run build:local
```

On the consumer project update the package.json with the lib generated '.tgz' file's path on your machine:

"hans-ui-design-lib": "[PATH]/hans-ui-design-lib/dist/hans-ui-design-lib-0.0.52.tgz",

and then run:

```bash
npm install
```

## 🚢 Publishing to CDN

Build and publish:

```bash
npm run build:cdn
```

The build is going to generate the folder 'cdn' on the root of this application.
Vercel is ready to publish the CDN remote entries with this build command and this folder name.
Whenever you push your commits on 'main' branch, the Vercel deploy will be called.
These are the production URL's:

https://hans-ui-design-lib-cdn.vercel.app/hans-ui-design-lib.css

https://hans-ui-design-lib-cdn.vercel.app/hans-ui-web-components.js

These are the versioned production URL's generated from `package.json` during `npm run build:cdn`:

https://hans-ui-design-lib-cdn.vercel.app/hans-ui-design-lib.css?v=<package-version>

https://hans-ui-design-lib-cdn.vercel.app/hans-ui-web-components.js?v=<package-version>

The CDN build also generates immutable versioned file names:

https://hans-ui-design-lib-cdn.vercel.app/hans-ui-design-lib-<package-version>.css

https://hans-ui-design-lib-cdn.vercel.app/hans-ui-web-components-<package-version>.js

The CDN build also generates:

https://hans-ui-design-lib-cdn.vercel.app/version.json

`version.json` contains the current package version plus the raw, query-versioned and file-versioned asset URLs. Consumers can use it as a deterministic source for cache-busting automation.

### CDN cache busting

The `?v=` query string is a cache-busting marker for browsers and CDNs. It is not a runtime option consumed by the library itself.

For production consumers, prefer the versioned file names when you want immutable asset URLs tied to a specific release. Use the `?v=` pattern when you need a stable path plus explicit cache invalidation.

Rules:

- use the same version value for both CSS and JS
- prefer the published `package.json` version
- update the value whenever a new release should invalidate the consumer cache
- do not mix assets from different versions in the same page
- prefer file-versioned URLs for long-lived production integrations
- prefer `version.json` when a deploy pipeline needs to discover the latest published release automatically

Example:

```html
<link
  rel="stylesheet"
  href="https://hans-ui-design-lib-cdn.vercel.app/hans-ui-design-lib.css?v=1.0.22"
/>
<script src="https://hans-ui-design-lib-cdn.vercel.app/hans-ui-web-components.js?v=1.0.22"></script>
```

Or with immutable versioned files:

```html
<link
  rel="stylesheet"
  href="https://hans-ui-design-lib-cdn.vercel.app/hans-ui-design-lib-1.0.22.css"
/>
<script src="https://hans-ui-design-lib-cdn.vercel.app/hans-ui-web-components-1.0.22.js"></script>
```

### Release flow for npm + CDN

The recommended release flow is now:

```bash
npm run release:[UPDATE-TYPE]
```

UPDATE-TYPES: patch | minor | major

What this does:

1. runs lint
2. runs the full coverage suite
3. bumps `package.json` version
4. rebuilds the npm package
5. rebuilds the CDN output
6. rebuilds Storybook
7. publishes the npm package

After that:

1. commit the updated `package.json` and lockfile
2. push `main`
3. Vercel rebuilds the CDN from the new source state
4. `build:cdn` reads the bumped package version automatically
5. `version.json` and `cdn/index.html` expose the new versioned URLs

To run CDN locally and feed your projects in development, run this command:

```bash
npm run build:cdn-local
```

These are the local URL's:

http://localhost:5173/hans-ui-design-lib.css

http://localhost:5173/hans-ui-web-components.js

## 🛠️ Tech Stack

- **React 19.2.4**
- **TypeScript 5.8.3**
- **Vite**
- **Storybook**
- **TailwindCSS**
- **SCSS**
- **Vitest**
- **React Testing Library**
- **JSDOM**
- **ESLint (flat config)**
- **Prettier**

## 📜 History of commands used to build this project:

```bash
npm create vite@latest hans-ui-design-lib -- --template react-ts

npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks prettier

npm i -D tailwindcss @tailwindcss/vite

npx storybook@latest init --builder @storybook/builder-vite

npm i -D vitest @testing-library/react @testing-library/jest-dom @types/testing-library\_\_jest-dom jsdom

npm i -D @vitest/coverage-v8 @vitest/ui

npm i -D sass

npm i -D react-icons

npm i -D react react-dom react-to-webcomponent @ungap/custom-elements
```
