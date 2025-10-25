import React from 'react';
import * as ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

type PropTypeLiteral =
  | 'string'
  | 'number'
  | 'boolean'
  | 'function'
  | 'method'
  | 'json';

type R2WCPropSchema<P> = Partial<
  Record<Exclude<Extract<keyof P, string>, 'container'>, PropTypeLiteral>
>;

type ReactComponentWithProps<P> = React.ComponentType<P> & {
  defaultProps?: Partial<P>;
};

function inferPropTypeLiteral(value: unknown): PropTypeLiteral {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'function') return 'function';
  if (value === null || value === undefined) return 'string';
  return 'json';
}

function buildPropSchemaFromDefaultProps<P extends object>(
  component: ReactComponentWithProps<P>,
): R2WCPropSchema<P> {
  const schema = {} as R2WCPropSchema<P>;
  const defaults = component.defaultProps ?? ({} as Partial<P>);
  const keys = Object.keys(defaults) as Array<
    Exclude<Extract<keyof P, string>, 'container'>
  >;

  keys.forEach((k) => {
    const val = (defaults as Record<string, unknown>)[k];
    schema[k] = inferPropTypeLiteral(val);
  });

  if (!('children' in schema)) {
    (schema as Record<string, PropTypeLiteral>)['children'] = 'string';
  }

  return schema;
}

class WebComponentChildrenHelper extends HTMLElement {
  private observer?: MutationObserver;

  connectedCallback(): void {
    this.setupObserver();
  }

  disconnectedCallback(): void {
    this.observer?.disconnect();
  }

  protected setupObserver(): void {
    this.updateChildren();
    this.observer = new MutationObserver(() => this.updateChildren());
    this.observer.observe(this, { childList: true, subtree: true });
  }

  protected updateChildren(): void {
    const inner = this.innerHTML.trim();
    if (!inner) return;

    const maybeR2WC = this as unknown as {
      props?: Record<string, unknown>;
      requestUpdate?: () => void;
    };

    maybeR2WC.props = {
      ...(maybeR2WC.props ?? {}),
      children: React.createElement('span', {
        dangerouslySetInnerHTML: { __html: inner },
      }),
    };

    maybeR2WC.requestUpdate?.();
  }
}

export function registerHansComponent<P extends object>(
  tagName: string,
  ReactComponent: ReactComponentWithProps<P>,
): void {
  const propSchema = buildPropSchemaFromDefaultProps(ReactComponent);

  type R2WCOptions = Parameters<typeof reactToWebComponent>[3];

  const options = {
    props: propSchema,
  } as unknown as R2WCOptions;

  const ReactDOMtoWC = ReactDOM as unknown as Parameters<
    typeof reactToWebComponent
  >[2];

  const BaseWC = reactToWebComponent<P>(
    ReactComponent,
    React,
    ReactDOMtoWC,
    options,
  );

  class HansWC extends (BaseWC as unknown as { new (): HTMLElement }) {}

  Object.setPrototypeOf(HansWC.prototype, WebComponentChildrenHelper.prototype);

  if (!customElements.get(tagName)) {
    customElements.define(tagName, HansWC);
  }
}
