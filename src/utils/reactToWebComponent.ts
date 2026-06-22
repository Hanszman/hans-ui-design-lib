import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import type { R2WCOptions } from '@r2wc/core';
import reactToWebcomponent from 'react-to-webcomponent';

type shadowOptions = 'open' | 'closed' | undefined;

type ReactToWebComponentProps<T extends object> =
  | readonly Exclude<Extract<keyof T, string>, 'container'>[]
  | R2WCOptions<T>['props'];

type ReactToWebComponentEvents<T extends object> =
  | readonly Exclude<Extract<keyof T, string>, 'container'>[]
  | R2WCOptions<T>['events'];

type ReactToWebComponentOptions<T extends object> = {
  props?: ReactToWebComponentProps<T>;
  events?: ReactToWebComponentEvents<T>;
  shadow?: shadowOptions;
  stylesheetHref?: string;
};

type NormalizedPropDefinitions = Readonly<Record<string, string | undefined>>;

const SHADOW_BRIDGE_EVENT_TYPES = ['mousedown', 'click'] as const;

const getDefaultStylesheetHref = (): string | undefined => {
  const envUrl = `${import.meta.env.VITE_HANS_UI_URL}${import.meta.env.VITE_HANS_UI_STYLESHEET_FILE}`;

  if (typeof document === 'undefined') {
    return envUrl || undefined;
  }

  const currentScript = document.currentScript as HTMLScriptElement | null;
  const scriptSrc = currentScript?.src;

  if (!scriptSrc) {
    return envUrl || undefined;
  }

  try {
    return new URL(import.meta.env.VITE_HANS_UI_STYLESHEET_FILE, scriptSrc).toString();
  } catch {
    return envUrl || undefined;
  }
};

const cloneReadonlyList = <T>(items: readonly T[]): T[] => [...items];

const toKebabCase = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const normalizeProps = <T extends object>(
  props?:
    | ReactToWebComponentProps<T>
    | ReactToWebComponentOptions<object>['props'],
): R2WCOptions<object>['props'] =>
  Array.isArray(props)
    ? cloneReadonlyList(props as readonly string[])
    : (props as R2WCOptions<object>['props']);

const normalizeEvents = <T extends object>(
  events?:
    | ReactToWebComponentEvents<T>
    | ReactToWebComponentOptions<object>['events'],
): R2WCOptions<object>['events'] =>
  Array.isArray(events)
    ? cloneReadonlyList(events as readonly string[])
    : (events as R2WCOptions<object>['events']);

const getDeclaredPropNames = <T extends object>(
  props?: ReactToWebComponentProps<T>,
): readonly string[] => {
  if (!props) return [];
  if (Array.isArray(props)) return props as readonly string[];
  return Object.keys(props as Record<string, unknown>);
};

const createPropAliasMap = <T extends object>(
  props?: ReactToWebComponentProps<T>,
): ReadonlyMap<string, string> => {
  const propNames = getDeclaredPropNames(props);
  const aliases = new Map<string, string>();

  for (const propName of propNames) {
    aliases.set(propName, propName);
    aliases.set(propName.toLowerCase(), propName);
    aliases.set(toKebabCase(propName), propName);
  }

  return aliases;
};

const createPropTypeMap = <T extends object>(
  props?: ReactToWebComponentProps<T>,
): NormalizedPropDefinitions => {
  if (!props) return {};
  if (Array.isArray(props)) {
    return Object.fromEntries(
      props.map((propName) => [propName, 'string']),
    );
  }

  return props as NormalizedPropDefinitions;
};

const normalizeWebComponentProps = <T extends object>(
  rawProps: Record<string, unknown>,
  propAliases: ReadonlyMap<string, string>,
): T => {
  const normalizedProps: Record<string, unknown> = { ...rawProps };

  for (const [rawKey, rawValue] of Object.entries(rawProps)) {
    const canonicalKey = propAliases.get(rawKey);
    if (!canonicalKey || canonicalKey === rawKey) continue;
    if (typeof normalizedProps[canonicalKey] === 'undefined') {
      normalizedProps[canonicalKey] = rawValue;
    }
    delete normalizedProps[rawKey];
  }

  return normalizedProps as T;
};

const parseWebComponentAttributeValue = (
  value: string,
  propType: string | undefined,
): unknown => {
  if (propType === 'boolean') {
    return value !== 'false';
  }

  if (propType === 'number') {
    const parsedNumber = Number(value);
    return Number.isNaN(parsedNumber) ? value : parsedNumber;
  }

  if (propType === 'json') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
};

const syncAliasedAttributesToProperties = (
  element: HTMLElement,
  propAliases: ReadonlyMap<string, string>,
  propTypes: NormalizedPropDefinitions,
  attributeName?: string,
): void => {
  const aliasesToSync = attributeName
    ? [[attributeName, propAliases.get(attributeName)]]
    : Array.from(propAliases.entries());

  for (const [alias, canonical] of aliasesToSync) {
    if (!canonical || alias === canonical) continue;
    if (!element.hasAttribute(alias)) continue;

    const rawValue = element.getAttribute(alias);
    if (rawValue === null) continue;

    (
      element as HTMLElement & Record<string, unknown>
    )[canonical] = parseWebComponentAttributeValue(
      rawValue,
      propTypes[canonical],
    );
  }
};

const eventStartedInsideShadow = (
  event: Event,
  shadow: ShadowRoot,
): boolean =>
  event.composedPath().some((target) => {
    return target instanceof Node && shadow.contains(target);
  });

const getShadowTargetFromHostEvent = (
  host: HTMLElement,
  event: MouseEvent,
): Element | null => {
  const shadow = host.shadowRoot;
  if (!shadow || eventStartedInsideShadow(event, shadow)) return null;

  const elementFromPoint = shadow.elementFromPoint;
  if (!elementFromPoint) return null;

  const target = elementFromPoint.call(
    shadow,
    event.clientX,
    event.clientY,
  );

  if (!(target instanceof Element) || !shadow.contains(target)) return null;
  return target;
};

const createForwardedMouseEvent = (event: MouseEvent): MouseEvent =>
  new MouseEvent(event.type, {
    bubbles: true,
    button: event.button,
    buttons: event.buttons,
    cancelable: event.cancelable,
    clientX: event.clientX,
    clientY: event.clientY,
    composed: true,
    ctrlKey: event.ctrlKey,
    detail: event.detail,
    metaKey: event.metaKey,
    screenX: event.screenX,
    screenY: event.screenY,
    shiftKey: event.shiftKey,
  });

const bridgeShadowHostEvent = (
  host: HTMLElement,
  event: MouseEvent,
): void => {
  const target = getShadowTargetFromHostEvent(host, event);
  if (!target) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  target.dispatchEvent(createForwardedMouseEvent(event));
};

export function createWebComponent<T extends object>(
  Component: React.ComponentType<T>,
  options?: ReactToWebComponentOptions<T>,
): CustomElementConstructor {
  const elementOptions = {
    props: (options as ReactToWebComponentOptions<object>)?.props ?? [],
    events: (options as ReactToWebComponentOptions<object>)?.events ?? [],
    shadow: (options as ReactToWebComponentOptions<object>)?.shadow ?? 'open',
    stylesheetHref:
      (options as ReactToWebComponentOptions<object>)?.stylesheetHref ??
      undefined,
  } as ReactToWebComponentOptions<T>;
  const propAliases = createPropAliasMap(elementOptions.props);
  const propTypes = createPropTypeMap(elementOptions.props);
  const WrappedComponent: React.FC<object> = (rawProps) =>
    React.createElement(
      Component as React.ComponentType<object>,
      normalizeWebComponentProps(rawProps, propAliases),
    );

  const BaseElement = reactToWebcomponent(
    WrappedComponent,
    React,
    ReactDOMClient as unknown as Parameters<typeof reactToWebcomponent>[2],
    {
      props: normalizeProps(elementOptions.props),
      events: normalizeEvents(elementOptions.events),
      shadow: elementOptions.shadow as shadowOptions,
    },
  );

  return class HansElement extends (BaseElement as unknown as {
    new (): HTMLElement;
    observedAttributes?: string[];
  }) {
    static get observedAttributes(): string[] {
      const baseAttributes = Array.isArray((BaseElement as { observedAttributes?: string[] }).observedAttributes)
        ? (BaseElement as { observedAttributes?: string[] }).observedAttributes ?? []
        : [];

      return Array.from(
        new Set([
          ...baseAttributes,
          ...Array.from(propAliases.keys()).filter((alias) => alias.includes('-')),
          ...Array.from(propAliases.keys()).filter((alias) => alias === alias.toLowerCase()),
        ]),
      );
    }

    private readonly handleShadowBridgeEvent = (event: Event): void => {
      if (event instanceof MouseEvent) bridgeShadowHostEvent(this, event);
    };

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null,
    ): void {
      const elementPrototype = Object.getPrototypeOf(HansElement.prototype);
      const superAttributeChanged = elementPrototype.attributeChangedCallback as
        | ((attributeName: string, previousValue: string | null, nextValue: string | null) => void)
        | undefined;

      syncAliasedAttributesToProperties(this, propAliases, propTypes, name);

      if (typeof superAttributeChanged === 'function') {
        superAttributeChanged.call(this, name, oldValue, newValue);
      }
    }

    connectedCallback(): void {
      syncAliasedAttributesToProperties(this, propAliases, propTypes);

      const elementPrototype = Object.getPrototypeOf(HansElement.prototype);
      const superConnected = elementPrototype.connectedCallback as
        | (() => void)
        | undefined;
      if (typeof superConnected === 'function') superConnected.call(this);

      SHADOW_BRIDGE_EVENT_TYPES.forEach((eventType) => {
        this.addEventListener(eventType, this.handleShadowBridgeEvent, true);
      });

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

    disconnectedCallback(): void {
      SHADOW_BRIDGE_EVENT_TYPES.forEach((eventType) => {
        this.removeEventListener(
          eventType,
          this.handleShadowBridgeEvent,
          true,
        );
      });

      const elementPrototype = Object.getPrototypeOf(HansElement.prototype);
      const superDisconnected = elementPrototype.disconnectedCallback as
        | (() => void)
        | undefined;
      if (typeof superDisconnected === 'function') superDisconnected.call(this);
    }
  };
}

export function registerReactAsWebComponent<T extends object>(
  tagName: string,
  Component: React.ComponentType<T>,
  propsList: ReactToWebComponentProps<T>,
  eventsList: ReactToWebComponentEvents<T> = [],
): void {
  if (customElements.get(tagName)) return;

  const WebComp = createWebComponent(Component, {
    props: normalizeProps(propsList) as ReactToWebComponentProps<T>,
    events: normalizeEvents(eventsList) as ReactToWebComponentEvents<T>,
    shadow: 'open',
    stylesheetHref: getDefaultStylesheetHref(),
  });

  customElements.define(tagName, WebComp);
}
