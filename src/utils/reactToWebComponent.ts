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

export function createWebComponent<T>(
  Component: React.ComponentType<T>,
  options?: R2WCOptions<T>,
): CustomElementConstructor {
  const BaseWC = reactToWebComponent(
    Component as React.ComponentType<object>,
    React,
    ReactDOMtoWC,
    options as R2WCOptions<object>,
  );

  return class HansElement extends (BaseWC as unknown as {
    new (): HTMLElement;
  }) {
    private observer?: MutationObserver;

    connectedCallback(): void {
      const proto = Object.getPrototypeOf(HansElement.prototype);
      const superConnected = proto.connectedCallback as
        | (() => void)
        | undefined;
      if (typeof superConnected === 'function') superConnected.call(this);

      this.observer = new MutationObserver(() => {
        this.dispatchEvent(new Event('slotchange', { bubbles: true }));
      });
      this.observer.observe(this, { childList: true, subtree: true });
    }

    disconnectedCallback(): void {
      this.observer?.disconnect();
    }
  };
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
