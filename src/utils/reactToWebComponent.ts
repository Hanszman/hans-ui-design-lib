import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import reactToWebcomponent from 'react-to-webcomponent';

type shadowOptions = 'open' | 'closed' | undefined;

type ReactToWebComponentOptions<T> = {
  props?: (keyof T)[] | Partial<Record<Extract<keyof T, string>, string>>;
  shadow?: shadowOptions;
  stylesheetHref?: string;
};

export function createWebComponent<T>(
  Component: React.ComponentType<T>,
  options?: ReactToWebComponentOptions<T>,
): CustomElementConstructor {
  const elementOptions = {
    props: (options as ReactToWebComponentOptions<object>)?.props ?? [],
    shadow: (options as ReactToWebComponentOptions<object>)?.shadow ?? 'open',
    stylesheetHref:
      (options as ReactToWebComponentOptions<object>)?.stylesheetHref ??
      undefined,
  } as ReactToWebComponentOptions<T>;

  const BaseElement = reactToWebcomponent(
    Component as React.ComponentType<object>,
    React,
    ReactDOMClient as unknown as Parameters<typeof reactToWebcomponent>[2],
    {
      props: elementOptions.props as string[],
      shadow: elementOptions.shadow as shadowOptions,
    },
  );

  return class HansElement extends (BaseElement as unknown as {
    new (): HTMLElement;
  }) {
    connectedCallback(): void {
      const elementPrototype = Object.getPrototypeOf(HansElement.prototype);
      const superConnected = elementPrototype.connectedCallback as
        | (() => void)
        | undefined;
      if (typeof superConnected === 'function') superConnected.call(this);

      try {
        const shadow = (this as HTMLElement & { shadowRoot?: ShadowRoot })
          .shadowRoot;
        if (shadow && elementOptions.stylesheetHref) {
          if (
            !shadow.querySelector(
              `link[href="${elementOptions.stylesheetHref}"]`,
            )
          ) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = elementOptions.stylesheetHref;
            shadow.prepend(link);
          }
        }
      } catch (error) {
        console.warn('could not inject stylesheet into shadowRoot', error);
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

  const stylesheetUrl = `${import.meta.env.VITE_HANS_UI_URL}${import.meta.env.VITE_HANS_UI_STYLESHEET_FILE}`;
  const WebComp = createWebComponent(Component, {
    props: [...propsList],
    shadow: 'open',
    stylesheetHref: stylesheetUrl,
  });

  customElements.define(tagName, WebComp);
}
