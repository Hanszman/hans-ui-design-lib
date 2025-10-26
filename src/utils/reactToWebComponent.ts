/// <reference types="vite/client" />
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import reactToWebcomponent from 'react-to-webcomponent';

type ShadowOptions = 'open' | 'closed' | undefined;

export type ReactToWebComponentOptions<T> = {
  props?: (keyof T)[] | Partial<Record<Extract<keyof T, string>, string>>;
  shadow?: ShadowOptions;
  stylesheetHref?: string;
};

class HansElement extends HTMLElement {
  private readonly stylesheetHref?: string;

  constructor(stylesheetHref?: string) {
    super();
    this.stylesheetHref = stylesheetHref;
  }

  connectedCallback(): void {
    const shadow = (this as HTMLElement & { shadowRoot?: ShadowRoot })
      .shadowRoot;
    if (!shadow || !this.stylesheetHref) return;

    const exists = shadow.querySelector(`link[href="${this.stylesheetHref}"]`);
    if (exists) return;

    try {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = this.stylesheetHref;
      shadow.prepend(link);
    } catch (error) {
      console.warn('could not inject stylesheet into shadowRoot', error);
    }
  }
}

export function createWebComponent<T>(
  Component: React.ComponentType<T>,
  options?: ReactToWebComponentOptions<T>,
): CustomElementConstructor {
  const elementOptions: Required<ReactToWebComponentOptions<T>> = {
    props: (options?.props ?? []) as (keyof T)[],
    shadow: options?.shadow ?? 'open',
    stylesheetHref: options?.stylesheetHref ?? '',
  };

  const BaseElement = reactToWebcomponent(
    Component as React.ComponentType<object>,
    React,
    ReactDOMClient as unknown as Parameters<typeof reactToWebcomponent>[2],
    {
      props: elementOptions.props as string[],
      shadow: elementOptions.shadow,
    },
  ) as unknown as { new (): HTMLElement };

  return class HansReactElement extends HansElement {
    private readonly BaseCtor = BaseElement;

    constructor() {
      super(elementOptions.stylesheetHref);
      const instance = new this.BaseCtor();
      Object.setPrototypeOf(this, Object.getPrototypeOf(instance));
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
    stylesheetHref: stylesheetUrl ?? '',
  });

  customElements.define(tagName, WebComp);
}
