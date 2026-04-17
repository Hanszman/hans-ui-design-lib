import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import {
  createWebComponent,
  registerReactAsWebComponent,
} from './reactToWebComponent';

describe('reactToWebComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    customElements.define = vi.fn(customElements.define);
  });

  afterEach(async () => {
    await act(async () => {
      document.body.replaceChildren();
      await Promise.resolve();
    });
  });

  it('Should create a Web Component from a React Component', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const WebComp = createWebComponent(Dummy, { shadow: 'open' });
    const tag = 'dummy-test';
    customElements.define(tag, WebComp);
    const instance = document.createElement(tag);

    expect(instance).toBeInstanceOf(HTMLElement);
  });

  it('Should register a React Component as a custom element', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'dummy-element';

    registerReactAsWebComponent(
      tag,
      Dummy as React.ComponentType<{ title: string }>,
      ['title'],
    );

    expect(customElements.get(tag)).toBeDefined();
  });

  it('Should register a custom element with typed props definition', () => {
    const Dummy: React.FC<{ active?: boolean }> = ({ active }) =>
      React.createElement('div', null, active ? 'active' : 'inactive');
    const tag = 'typed-props-element';

    registerReactAsWebComponent(tag, Dummy, { active: 'boolean' });

    expect(customElements.get(tag)).toBeDefined();
  });

  it('Should support typed properties and custom events for framework consumers', async () => {
    type DummyProps = {
      checked?: boolean;
      items?: { label: string }[];
      onChange?: (checked: boolean) => void;
    };
    const Dummy: React.FC<DummyProps> = ({ checked, items = [], onChange }) =>
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => onChange?.(!checked),
        },
        `${checked ? 'on' : 'off'}-${items.length}`,
      );
    const tag = 'typed-event-element';
    const WebComp = createWebComponent(Dummy, {
      props: {
        checked: 'boolean',
        items: undefined,
      },
      events: ['onChange'],
      shadow: 'open',
    });
    customElements.define(tag, WebComp);

    const instance = document.createElement(tag) as HTMLElement & {
      checked: boolean;
      items: { label: string }[];
    };
    const changeSpy = vi.fn();

    instance.checked = false;
    instance.items = [{ label: 'Alpha' }];
    instance.addEventListener('change', (event) =>
      changeSpy((event as CustomEvent<boolean>).detail),
    );
    await act(async () => {
      document.body.appendChild(instance);
      await Promise.resolve();
    });

    expect(instance.shadowRoot?.textContent).toContain('off-1');

    await act(async () => {
      instance.checked = true;
      await Promise.resolve();
    });

    expect(instance.shadowRoot?.textContent).toContain('on-1');

    await act(async () => {
      instance.shadowRoot?.querySelector('button')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      );
      await Promise.resolve();
    });

    expect(changeSpy).toHaveBeenCalledWith(false);
  });

  it('Should support custom event options when registering framework events', async () => {
    type DummyProps = {
      onNotify?: (message: string) => void;
    };
    const Dummy: React.FC<DummyProps> = ({ onNotify }) =>
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => onNotify?.('ready'),
        },
        'Notify',
      );
    const tag = 'event-options-element';
    const WebComp = createWebComponent(Dummy, {
      props: {},
      events: {
        onNotify: {
          bubbles: true,
          composed: true,
        },
      },
      shadow: 'open',
    });
    customElements.define(tag, WebComp);

    const instance = document.createElement(tag);
    const notifySpy = vi.fn();

    instance.addEventListener('notify', (event) =>
      notifySpy({
        bubbles: event.bubbles,
        composed: event.composed,
        detail: (event as CustomEvent<string>).detail,
      }),
    );

    await act(async () => {
      document.body.appendChild(instance);
      await Promise.resolve();
    });

    await act(async () => {
      instance.shadowRoot?.querySelector('button')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      );
      await Promise.resolve();
    });

    expect(notifySpy).toHaveBeenCalledWith({
      bubbles: true,
      composed: true,
      detail: 'ready',
    });
  });

  it('Should bridge host clicks to shadow targets rendered outside the host box', async () => {
    type DummyProps = {
      onNotify?: (message: string) => void;
    };
    const Dummy: React.FC<DummyProps> = ({ onNotify }) =>
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => onNotify?.('outside-shadow-target'),
        },
        'Floating action',
      );
    const tag = 'shadow-bridge-element';
    const WebComp = createWebComponent(Dummy, {
      events: ['onNotify'],
      shadow: 'open',
    });
    customElements.define(tag, WebComp);

    const instance = document.createElement(tag);
    const notifySpy = vi.fn();

    instance.addEventListener('notify', (event) =>
      notifySpy((event as CustomEvent<string>).detail),
    );

    await act(async () => {
      document.body.appendChild(instance);
      await Promise.resolve();
    });

    const button = instance.shadowRoot?.querySelector('button');
    Object.defineProperty(instance.shadowRoot, 'elementFromPoint', {
      configurable: true,
      value: () => button,
    });

    await act(async () => {
      instance.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: 10,
          clientY: 20,
        }),
      );
      await Promise.resolve();
    });

    expect(notifySpy).toHaveBeenCalledWith('outside-shadow-target');
  });

  it('Should not bridge clicks when the event already started inside the shadow root', async () => {
    type DummyProps = {
      onNotify?: (message: string) => void;
    };
    const Dummy: React.FC<DummyProps> = ({ onNotify }) =>
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => onNotify?.('inside-shadow-target'),
        },
        'Inner action',
      );
    const tag = 'shadow-bridge-inside-element';
    const WebComp = createWebComponent(Dummy, {
      events: ['onNotify'],
      shadow: 'open',
    });
    customElements.define(tag, WebComp);

    const instance = document.createElement(tag);
    const notifySpy = vi.fn();

    instance.addEventListener('notify', (event) =>
      notifySpy((event as CustomEvent<string>).detail),
    );

    await act(async () => {
      document.body.appendChild(instance);
      await Promise.resolve();
    });

    const button = instance.shadowRoot?.querySelector('button');
    const elementFromPoint = vi.fn(() => button);
    Object.defineProperty(instance.shadowRoot, 'elementFromPoint', {
      configurable: true,
      value: elementFromPoint,
    });

    await act(async () => {
      button?.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          composed: true,
        }),
      );
      await Promise.resolve();
    });

    expect(elementFromPoint).not.toHaveBeenCalled();
    expect(notifySpy).toHaveBeenCalledTimes(1);
    expect(notifySpy).toHaveBeenCalledWith('inside-shadow-target');
  });

  it('Should ignore host clicks when there is no shadow target under the pointer', async () => {
    type DummyProps = {
      onNotify?: (message: string) => void;
    };
    const Dummy: React.FC<DummyProps> = ({ onNotify }) =>
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => onNotify?.('not-expected'),
        },
        'Ignored action',
      );
    const tag = 'shadow-bridge-empty-element';
    const WebComp = createWebComponent(Dummy, {
      events: ['onNotify'],
      shadow: 'open',
    });
    customElements.define(tag, WebComp);

    const instance = document.createElement(tag);
    const notifySpy = vi.fn();

    instance.addEventListener('notify', (event) =>
      notifySpy((event as CustomEvent<string>).detail),
    );

    await act(async () => {
      document.body.appendChild(instance);
      await Promise.resolve();
    });

    Object.defineProperty(instance.shadowRoot, 'elementFromPoint', {
      configurable: true,
      value: () => document.body,
    });

    await act(async () => {
      instance.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
      await Promise.resolve();
    });

    expect(notifySpy).not.toHaveBeenCalled();
  });

  it('Should ignore host clicks when shadow elementFromPoint is unavailable', async () => {
    const Dummy: React.FC = () =>
      React.createElement('button', { type: 'button' }, 'Unavailable target');
    const tag = 'shadow-bridge-unavailable-element';
    const WebComp = createWebComponent(Dummy, { shadow: 'open' });
    customElements.define(tag, WebComp);

    const instance = document.createElement(tag);

    await act(async () => {
      document.body.appendChild(instance);
      await Promise.resolve();
    });

    Object.defineProperty(instance.shadowRoot, 'elementFromPoint', {
      configurable: true,
      value: undefined,
    });

    expect(() => {
      instance.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    }).not.toThrow();
  });

  it('Should not register again a custom element that already exists', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'existing-element';
    customElements.define(tag, class extends HTMLElement {});

    registerReactAsWebComponent(tag, Dummy, []);

    expect(customElements.get(tag)).toBeDefined();
  });
  it('Should inject stylesheet when stylesheetHref is given', async () => {
    const Dummy: React.FC = () => React.createElement('div');
    const href = 'https://example.com/style.css';
    const tag = 'styled-element';
    const WebComp = createWebComponent(Dummy, { stylesheetHref: href });
    customElements.define(tag, WebComp);
    const instance = document.createElement(tag) as HTMLElement & {
      connectedCallback: () => void;
    };
    await act(async () => {
      instance.connectedCallback();
      await Promise.resolve();
    });
    const shadow = instance.shadowRoot!;
    const link = shadow.querySelector(`link[href="${href}"]`);

    expect(link).not.toBeNull();
  });

  it('Should not inject stylesheet if already exists', async () => {
    const Dummy: React.FC = () => React.createElement('div');
    const href = 'https://example.com/style.css';
    const tag = 'already-styled';
    const WebComp = createWebComponent(Dummy, { stylesheetHref: href });
    customElements.define(tag, WebComp);
    const instance = document.createElement(tag) as HTMLElement & {
      connectedCallback: () => void;
    };
    const shadow =
      instance.shadowRoot ?? instance.attachShadow({ mode: 'open' });
    const existingLink = document.createElement('link');
    existingLink.href = href;

    shadow.appendChild(existingLink);
    await act(async () => {
      instance.connectedCallback();
      await Promise.resolve();
    });

    const links = shadow.querySelectorAll(`link[href="${href}"]`);
    expect(links.length).toBe(1);
  });

  it('Should log warning if stylesheet injection fails', async () => {
    const Dummy: React.FC = () => React.createElement('div');
    const href = 'https://example.com/style.css';
    const tag = 'error-element';
    const WebComp = createWebComponent(Dummy, { stylesheetHref: href });
    customElements.define(tag, WebComp);
    const instance = document.createElement(tag) as HTMLElement & {
      connectedCallback: () => void;
    };
    const fakeShadow = {
      prepend: () => {
        throw new Error('mock error');
      },
      querySelector: () => null,
    } as unknown as ShadowRoot;

    Object.defineProperty(instance, 'shadowRoot', {
      get: () => fakeShadow,
      configurable: true,
    });
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await act(async () => {
      instance.connectedCallback();
      await Promise.resolve();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'could not inject stylesheet into shadowRoot',
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
