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

export class HansWebComponentBase extends HTMLElement {
  private observer?: MutationObserver;

  constructor() {
    super();
    this.syncInitialChildren();
  }

  connectedCallback(): void {
    this.observeChildrenChanges();
  }

  disconnectedCallback(): void {
    this.observer?.disconnect();
  }

  private syncInitialChildren(): void {
    const html = this.innerHTML?.trim();
    if (!html) return;

    const target = this as unknown as {
      props?: Record<string, unknown>;
      requestUpdate?: () => void;
    };

    target.props = {
      ...(target.props ?? {}),
      children: React.createElement('span', {
        dangerouslySetInnerHTML: { __html: html },
      }),
    };
  }

  private observeChildrenChanges(): void {
    this.observer = new MutationObserver(() => this.updateChildren());
    this.observer.observe(this, { childList: true, subtree: true });
  }

  private updateChildren(): void {
    const html = this.innerHTML?.trim();
    const target = this as unknown as {
      props?: Record<string, unknown>;
      requestUpdate?: () => void;
    };
    target.props = {
      ...(target.props ?? {}),
      children: html
        ? React.createElement('span', {
            dangerouslySetInnerHTML: { __html: html },
          })
        : undefined,
    };
    target.requestUpdate?.();
  }
}

export function registerHansComponent<P extends object>(
  tagName: string,
  ReactComponent: ReactComponentWithProps<P>,
): void {
  const propSchema = buildPropSchemaFromDefaultProps(ReactComponent);

  const options = {
    props: propSchema,
    shadow: false,
  } as unknown as Parameters<typeof reactToWebComponent>[3];

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
  Object.setPrototypeOf(HansWC.prototype, HansWebComponentBase.prototype);

  if (!customElements.get(tagName)) {
    customElements.define(tagName, HansWC);
  }
}
