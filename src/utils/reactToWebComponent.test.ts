import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import {
  createPropAliasMap,
  createWebComponent,
  getObservedAttributeList,
  normalizeWebComponentProps,
  parseWebComponentAttributeValue,
  registerReactAsWebComponent,
} from './reactToWebComponent';

describe('reactToWebComponent', () => {
  const withStylesheetEnv = (
    nextUrl: string | undefined,
    nextFile: string | undefined,
    callback: () => void,
  ) => {
    const previousUrl = import.meta.env.VITE_HANS_UI_URL;
    const previousFile = import.meta.env.VITE_HANS_UI_STYLESHEET_FILE;

    import.meta.env.VITE_HANS_UI_URL = nextUrl;
    import.meta.env.VITE_HANS_UI_STYLESHEET_FILE = nextFile;

    try {
      callback();
    } finally {
      import.meta.env.VITE_HANS_UI_URL = previousUrl;
      import.meta.env.VITE_HANS_UI_STYLESHEET_FILE = previousFile;
    }
  };

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

  it('Should parse observed attribute lists safely', () => {
    expect(getObservedAttributeList(['value', 'left-icon'])).toEqual([
      'value',
      'left-icon',
    ]);
    expect(getObservedAttributeList('value')).toEqual([]);
  });

  it('Should parse typed web component attribute values safely', () => {
    expect(parseWebComponentAttributeValue('true', 'boolean')).toBe(true);
    expect(parseWebComponentAttributeValue('false', 'boolean')).toBe(false);
    expect(parseWebComponentAttributeValue('12', 'number')).toBe(12);
    expect(parseWebComponentAttributeValue('abc', 'number')).toBe('abc');
    expect(parseWebComponentAttributeValue('{"label":"Angular"}', 'json')).toEqual({
      label: 'Angular',
    });
    expect(parseWebComponentAttributeValue('{oops', 'json')).toBe('{oops');
    expect(parseWebComponentAttributeValue('plain', 'string')).toBe('plain');
  });

  it('Should create empty prop aliases when no props are declared', () => {
    expect(Array.from(createPropAliasMap())).toEqual([]);
  });

  it('Should normalize aliased raw props without overwriting canonical values', () => {
    const propAliases = createPropAliasMap({ leftIcon: 'string', inputId: 'string' });

    expect(
      normalizeWebComponentProps(
        {
          'left-icon': 'FaSearch',
          inputid: 'skills-search',
        },
        propAliases,
      ),
    ).toEqual({
      leftIcon: 'FaSearch',
      inputId: 'skills-search',
    });

    expect(
      normalizeWebComponentProps(
        {
          leftIcon: 'LuSearch',
          'left-icon': 'FaSearch',
        },
        propAliases,
      ),
    ).toEqual({
      leftIcon: 'LuSearch',
    });
  });

  it('Should create a Web Component from a React Component', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const WebComp = createWebComponent(Dummy);
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

  it('Should normalize lowercase and kebab-case attribute names to declared camelCase props', async () => {
    type DummyProps = {
      inputId?: string;
      leftIcon?: string;
    };
    const Dummy: React.FC<DummyProps> = ({ inputId = 'missing-id', leftIcon = 'missing-icon' }) =>
      React.createElement('div', null, `${inputId}-${leftIcon}`);
    const tag = 'camel-props-element';
    const WebComp = createWebComponent(Dummy, {
      props: {
        inputId: 'string',
        leftIcon: 'string',
      },
      shadow: 'open',
    });
    customElements.define(tag, WebComp);

    const lowerCaseInstance = document.createElement(tag);
    lowerCaseInstance.setAttribute('inputid', 'skills-search');
    lowerCaseInstance.setAttribute('lefticon', 'FaSearch');

    await act(async () => {
      document.body.appendChild(lowerCaseInstance);
      await Promise.resolve();
    });

    expect(lowerCaseInstance.shadowRoot?.textContent).toContain(
      'skills-search-FaSearch',
    );

    const kebabCaseInstance = document.createElement(tag);
    kebabCaseInstance.setAttribute('input-id', 'projects-search');
    kebabCaseInstance.setAttribute('left-icon', 'FaSearch');

    await act(async () => {
      document.body.appendChild(kebabCaseInstance);
      await Promise.resolve();
    });

    expect(kebabCaseInstance.shadowRoot?.textContent).toContain(
      'projects-search-FaSearch',
    );
  });

  it('Should ignore unknown aliased attributes during attribute sync', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'unknown-attribute-element';
    const WebComp = createWebComponent(Dummy, {
      props: { leftIcon: 'string' },
      shadow: 'open',
    });
    customElements.define(tag, WebComp);

    const instance = document.createElement(tag) as HTMLElement & {
      attributeChangedCallback: (
        name: string,
        oldValue: string | null,
        newValue: string | null,
      ) => void;
    };

    expect(() => {
      instance.attributeChangedCallback('ghost-prop', null, 'value');
    }).not.toThrow();
  });

  it('Should skip aliased sync when the host reports a null attribute value', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'null-attribute-element';
    const WebComp = createWebComponent(Dummy, {
      props: { leftIcon: 'string' },
      shadow: 'open',
    });
    customElements.define(tag, WebComp);

    const instance = document.createElement(tag) as HTMLElement & {
      attributeChangedCallback: (
        name: string,
        oldValue: string | null,
        newValue: string | null,
      ) => void;
      leftIcon?: string;
    };

    Object.defineProperty(instance, 'hasAttribute', {
      configurable: true,
      value: vi.fn(() => true),
    });
    Object.defineProperty(instance, 'getAttribute', {
      configurable: true,
      value: vi.fn(() => null),
    });

    expect(() => {
      instance.attributeChangedCallback('left-icon', null, 'FaSearch');
    }).not.toThrow();
    expect(instance.getAttribute).toHaveBeenCalledWith('left-icon');
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

  it('Should register without document using the stylesheet env fallback', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'no-document-element';
    const originalDocument = globalThis.document;

    Object.defineProperty(globalThis, 'document', {
      value: undefined,
      configurable: true,
    });

    expect(() => {
      registerReactAsWebComponent(tag, Dummy, []);
    }).not.toThrow();

    Object.defineProperty(globalThis, 'document', {
      value: originalDocument,
      configurable: true,
    });

    expect(customElements.get(tag)).toBeDefined();
  });

  it('Should return undefined stylesheet fallback without document when env is empty', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'no-document-empty-env-element';
    const originalDocument = globalThis.document;

    Object.defineProperty(globalThis, 'document', {
      value: undefined,
      configurable: true,
    });

    withStylesheetEnv('', '', () => {
      expect(() => {
        registerReactAsWebComponent(tag, Dummy, []);
      }).not.toThrow();
    });

    Object.defineProperty(globalThis, 'document', {
      value: originalDocument,
      configurable: true,
    });

    expect(customElements.get(tag)).toBeDefined();
  });

  it('Should return undefined stylesheet fallback when currentScript has no src and env is empty', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'missing-script-src-element';
    const originalCurrentScript = document.currentScript;

    Object.defineProperty(document, 'currentScript', {
      configurable: true,
      value: null,
    });

    withStylesheetEnv('', '', () => {
      expect(() => {
        registerReactAsWebComponent(tag, Dummy, []);
      }).not.toThrow();
    });

    Object.defineProperty(document, 'currentScript', {
      configurable: true,
      value: originalCurrentScript,
    });

    expect(customElements.get(tag)).toBeDefined();
  });

  it('Should fallback to the env stylesheet when currentScript src is invalid', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'invalid-script-src-element';
    const originalCurrentScript = document.currentScript;

    Object.defineProperty(document, 'currentScript', {
      configurable: true,
      value: { src: '::not-a-valid-url::' },
    });

    expect(() => {
      registerReactAsWebComponent(tag, Dummy, []);
    }).not.toThrow();

    Object.defineProperty(document, 'currentScript', {
      configurable: true,
      value: originalCurrentScript,
    });

    expect(customElements.get(tag)).toBeDefined();
  });

  it('Should return undefined stylesheet fallback when currentScript src is invalid and env is empty', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'invalid-script-src-empty-env-element';
    const originalCurrentScript = document.currentScript;

    Object.defineProperty(document, 'currentScript', {
      configurable: true,
      value: { src: '::not-a-valid-url::' },
    });

    withStylesheetEnv('', '', () => {
      expect(() => {
        registerReactAsWebComponent(tag, Dummy, []);
      }).not.toThrow();
    });

    Object.defineProperty(document, 'currentScript', {
      configurable: true,
      value: originalCurrentScript,
    });

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


