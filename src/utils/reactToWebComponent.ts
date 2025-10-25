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
    connectedCallback(): void {
      const superProto = Object.getPrototypeOf(HansElement.prototype);
      const superConnected = superProto.connectedCallback as
        | (() => void)
        | undefined;
      if (typeof superConnected === 'function') {
        superConnected.call(this);
      }

      this.syncChildren();
      this.addEventListener('slotchange', this.syncChildren);
      const observer = new MutationObserver(() => this.syncChildren());
      observer.observe(this, { childList: true, subtree: true });
    }

    private syncChildren = (): void => {
      const inner = this.innerHTML.trim();
      if (!inner) return;
      const current = (this as unknown as Record<string, unknown>).children;
      if (current !== inner) {
        (this as unknown as Record<string, unknown>).children = inner;
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
