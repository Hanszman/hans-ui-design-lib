# Hans UI Design Library

A **React + TypeScript component library** that serves as the base design system for my personal projects.  
This library provides reusable, styled and documented UI components with a consistent structure and best practices.

---

## 🚀 Features

- ⚛️ **React 19** with **TypeScript** for type safety
- 🎨 **TailwindCSS + SCSS** for styling flexibility
- 📖 **Storybook** for interactive component documentation
- ✅ **Vitest + React Testing Library + JSDOM** for unit and integration testing
- 📊 **Test Coverage (V8)** with HTML reports
- 🧹 **ESLint + Prettier** for code quality and formatting
- ⚡ **Vite** as the bundler for fast builds and DX
- 🌍 Ready to be published and consumed via **npm**
- **Node Version to build this project: 22.18.0 and npm 10.9.3**

---

## 📦 Installation

```bash
npm install hans-ui-design-lib
```

---

## 🛠️ Usage

```tsx
import { Button } from 'hans-ui-design-lib';

function App() {
  return <Button>Click me</Button>;
}
```

---

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
npm test
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

---

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

---

## 🚢 Publishing to npm

Make sure you are logged in to npm:

```bash
npm login
```

Then build and publish:

```bash
npm run build
npm publish
```

---

## 🛠️ Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Storybook**
- **TailwindCSS**
- **SCSS**
- **Vitest**
- **React Testing Library**
- **JSDOM**
- **ESLint (flat config)**
- **Prettier**

---

## 📜 History of commands used to build this project:

```
npm create vite@latest my-ui -- --template react-ts

npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks prettier

npm i -D tailwindcss @tailwindcss/vite

npx storybook@latest init --builder @storybook/builder-vite

npm i -D vitest @testing-library/react @testing-library/jest-dom @types/testing-library\_\_jest-dom jsdom

npm i -D sass
```
