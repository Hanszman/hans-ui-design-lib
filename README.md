# Hans UI Design Library

A **React + TypeScript Component Library** that serves as the base design system for personal projects.  
This library provides reusable, styled and documented UI components with a consistent structure and best practices.

## 🚀 Features

- ⚛️ **React 19.1.1** with **TypeScript 5.8.3** for type safety
- 🎨 **TailwindCSS + SCSS** for styling flexibility
- 📖 **Storybook** for interactive component documentation
- ✅ **Vitest + React Testing Library + JSDOM** for unit and integration testing
- 📊 **Test Coverage (V8)** with HTML reports
- 🧹 **ESLint + Prettier** for code quality and formatting
- ⚡ **Vite** as the bundler for fast builds and DX
- 🌍 Ready to be published and consumed via **npm**
- 📖 Documentation ready to be used (deployed by **Vercel**) at https://hans-ui-design-lib.vercel.app/
- **Node Version to build this project: 22.18.0 and npm 10.9.3**

## 📦 Installation

```bash
npm install hans-ui-design-lib
```

## 🛠️ Usage

In a root file of your application, define:

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
import { Button } from 'hans-ui-design-lib';

<Button label="Button" />;
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
npm run build-storybook
```

## 🚢 Publishing to npm

Make sure you are logged in to npm:

```bash
npm login
```

Then build and publish:

```bash
npm run build
npm run publish:[UPDATE-TYPE]
```

UPDATE-TYPES: patch | minor | major

## 🛠️ Tech Stack

- **React 19.1.1**
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
