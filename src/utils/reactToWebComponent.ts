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
  shadow?: boolean | 'open' | 'closed';
};

const ReactDOMtoWC = ReactDOM as unknown as Parameters<
  typeof reactToWebComponent
>[2];

export function createWebComponent<T>(
  Component: React.ComponentType<T>,
  options?: R2WCOptions<T>,
): CustomElementConstructor {
  const mergedOptions = {
    ...(options as R2WCOptions<object>),
    shadow: false as unknown as 'open',
  };

  const BaseWC = reactToWebComponent(
    Component as React.ComponentType<object>,
    React,
    ReactDOMtoWC,
    mergedOptions,
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
        this.updateChildren();
      });
      this.observer.observe(this, { childList: true, subtree: true });
      this.updateChildren();
    }

    disconnectedCallback(): void {
      this.observer?.disconnect();
    }

    private updateChildren() {
      const childNodes = Array.from(this.childNodes);
      // @ts-ignore
      if (this._root && this._root._reactRootContainer) {
        const currentProps = (this as any)._props || {};
        (this as any)._reactRootContainer.render(
          React.createElement(Component as React.ComponentType<any>, {
            ...currentProps,
            children: React.createElement(
              React.Fragment,
              null,
              ...childNodes.map((c) => {
                if (c.nodeType === Node.TEXT_NODE) return c.textContent;
                return React.createElement('span', {
                  dangerouslySetInnerHTML: {
                    __html: (c as HTMLElement).outerHTML,
                  },
                });
              }),
            ),
          }),
        );
      }
    }
  };
}

export function registerReactAsWebComponent<T>(
  tagName: string,
  Component: React.ComponentType<T>,
  propsList: readonly (keyof T)[],
): void {
  if (customElements.get(tagName)) return;

  const WebComponent = createWebComponent(Component, {
    props: [...propsList],
    shadow: false,
  });
  customElements.define(tagName, WebComponent);
}
