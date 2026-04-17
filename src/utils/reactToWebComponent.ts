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

const SHADOW_BRIDGE_EVENT_TYPES = ['mousedown', 'click'] as const;

const cloneReadonlyList = <T>(items: readonly T[]): T[] => [...items];

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

  const BaseElement = reactToWebcomponent(
    Component as React.ComponentType<object>,
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
  }) {
    private readonly handleShadowBridgeEvent = (event: Event): void => {
      if (event instanceof MouseEvent) bridgeShadowHostEvent(this, event);
    };

    connectedCallback(): void {
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

  const stylesheetUrl = `${import.meta.env.VITE_HANS_UI_URL}${import.meta.env.VITE_HANS_UI_STYLESHEET_FILE}`;
  const WebComp = createWebComponent(Component, {
    props: normalizeProps(propsList) as ReactToWebComponentProps<T>,
    events: normalizeEvents(eventsList) as ReactToWebComponentEvents<T>,
    shadow: 'open',
    stylesheetHref: stylesheetUrl,
  });

  customElements.define(tagName, WebComp);
}
