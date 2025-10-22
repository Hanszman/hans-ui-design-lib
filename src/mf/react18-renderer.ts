import React from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

export function react18Renderer<P extends Record<string, unknown>>(
  Component: React.FC<P>,
  props: P,
  container: HTMLElement,
): { render: () => void; unmount: () => void } {
  let root: Root | null = null;

  return {
    render: () => {
      if (!root) {
        root = createRoot(container);
      }
      root.render(React.createElement(Component, props));
    },
    unmount: () => {
      root?.unmount();
    },
  };
}
