import React from 'react';
import * as ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'function'
  | 'method'
  | 'json';

type R2WCOptions<T> = {
  props?: (keyof T)[] | Partial<Record<Extract<keyof T, string>, PropType>>;
};

const ReactDOMtoWC = ReactDOM as unknown as Parameters<
  typeof reactToWebComponent
>[2];

function createWebComponent<T>(
  Component: React.ComponentType<T>,
  options?: R2WCOptions<T>,
): CustomElementConstructor {
  const BaseWC = reactToWebComponent(
    Component as React.ComponentType<object>,
    React,
    ReactDOMtoWC,
    options as R2WCOptions<object>,
  );

  class HansElement extends (BaseWC as unknown as { new (): HTMLElement }) {
    private observer?: MutationObserver;

    connectedCallback(): void {
      const proto = Object.getPrototypeOf(HansElement.prototype);
      const superConnected = proto.connectedCallback as
        | (() => void)
        | undefined;
      if (typeof superConnected === 'function') superConnected.call(this);

      this.syncChildren();
      this.observer = new MutationObserver(() => this.syncChildren());
      this.observer.observe(this, { childList: true, subtree: true });
    }

    disconnectedCallback(): void {
      this.observer?.disconnect();
    }

    private syncChildren = (): void => {
      const nodes = Array.from(this.childNodes);
      if (!nodes.length) return;

      const convertNodeToReact = (node: Node): React.ReactNode => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const props: Record<string, unknown> = {};
          for (const { name, value } of Array.from(el.attributes)) {
            props[name] = value;
          }
          const children = Array.from(el.childNodes).map(convertNodeToReact);

          return React.createElement(
            el.tagName.toLowerCase(),
            props,
            ...children,
          );
        }
        return null;
      };

      const reactChildren = nodes.map(convertNodeToReact).filter(Boolean);
      const nextChildren =
        reactChildren.length === 1 ? reactChildren[0] : reactChildren;

      const current = (this as unknown as Record<string, unknown>).children;
      if (current !== nextChildren) {
        (this as unknown as Record<string, unknown>).children = nextChildren;
      }
    };
  }

  return HansElement;
}

export function registerReactAsWebComponent<T>(
  tagName: string,
  Component: React.ComponentType<T>,
  propsList: readonly (keyof T)[],
): void {
  if (customElements.get(tagName)) return;

  const WebComponent = createWebComponent(Component, { props: [...propsList] });
  customElements.define(tagName, WebComponent);
}
