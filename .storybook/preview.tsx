import React from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import '../src/styles/index.css';

const withThemeProvider: Decorator = (StoryFn, context) => {
  const theme = context.globals?.theme ?? 'combination1';

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <StoryFn />;
};

export const decorators: Decorator[] = [withThemeProvider];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Tema global da UI',
    defaultValue: 'combination1',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'combination1', title: 'Combination 1' },
        { value: 'combination2', title: 'Combination 2' },
        { value: 'combination3', title: 'Combination 3' },
      ],
      showName: true,
    },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    test: { disable: true },
  },
};

export default preview;
