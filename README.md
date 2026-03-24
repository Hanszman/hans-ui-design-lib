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
- 📖 Documentation ready to be used (deployed by **Vercel**) at https://hans-ui-design-lib-doc.vercel.app/
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
      href="https://hans-ui-design-lib-cdn.vercel.app/hans-ui-design-lib.css"
    />
    <script src="https://hans-ui-design-lib-cdn.vercel.app/hans-ui-web-components.js"></script>
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
