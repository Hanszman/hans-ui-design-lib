import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import reactToWebcomponent from 'react-to-webcomponent';

type R2WCOptions<T> = {
  props?: (keyof T)[] | Partial<Record<Extract<keyof T, string>, string>>;
  shadow?: boolean | 'open' | 'closed';
  stylesheetHref?: string;
};

export function createWebComponent<T>(
  Component: React.ComponentType<T>,
  options?: R2WCOptions<T>,
): CustomElementConstructor {
  const merged = {
    props: (options as R2WCOptions<object>)?.props ?? [],
    shadow: (options as R2WCOptions<object>)?.shadow ?? 'open',
    stylesheetHref:
      (options as R2WCOptions<object>)?.stylesheetHref ?? undefined,
  } as R2WCOptions<T>;

  const WebBase = reactToWebcomponent(
    Component as React.ComponentType<object>,
    React,
    ReactDOMClient as any,
    {
      props: merged.props as any,
      shadow: merged.shadow as any,
    },
  );

  return class HansElement extends (WebBase as unknown as {
    new (): HTMLElement;
  }) {
    connectedCallback(): void {
      const proto = Object.getPrototypeOf(HansElement.prototype);
      const superConnected = proto.connectedCallback as
        | (() => void)
        | undefined;
      if (typeof superConnected === 'function') superConnected.call(this);

      try {
        const shadow = (this as any).shadowRoot;
        if (shadow && merged.stylesheetHref) {
          if (!shadow.querySelector(`link[href="${merged.stylesheetHref}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = merged.stylesheetHref;
            shadow.prepend(link);
          }
        }
      } catch (e) {
        console.warn('could not inject stylesheet into shadowRoot', e);
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

  const WebComp = createWebComponent(Component, {
    props: [...propsList],
    shadow: 'open',
  });
  customElements.define(tagName, WebComp);
}
