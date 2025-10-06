/** @type {import('tailwindcss').Config} */
export default defineConfig({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx,css,scss,stories.tsx}',
    './.storybook/**/*.{js,ts,jsx,tsx,mdx,css,scss,stories.tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
