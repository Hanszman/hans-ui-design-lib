import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import {
  createWebComponent,
  registerReactAsWebComponent,
} from './reactToWebComponent';

describe('reactToWebComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    customElements.define = vi.fn(customElements.define);
  });

  it('deve criar um web component a partir de um componente React', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const WebComp = createWebComponent(Dummy, { shadow: 'open' });

    const tag = 'dummy-test';
    customElements.define(tag, WebComp);
    const instance = document.createElement(tag);

    expect(instance).toBeInstanceOf(HTMLElement);
  });

  it('deve registrar um componente React como custom element', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'dummy-element';

    registerReactAsWebComponent(
      tag,
      Dummy as React.ComponentType<{ title: string }>,
      ['title'],
    );

    expect(customElements.get(tag)).toBeDefined();
  });

  it('não deve registrar novamente um custom element já existente', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'existing-element';
    customElements.define(tag, class extends HTMLElement {});

    registerReactAsWebComponent(tag, Dummy, []);
    expect(customElements.get(tag)).toBeDefined();
  });

  it('deve injetar stylesheet quando stylesheetHref é fornecido', () => {
    const Dummy: React.FC = () => React.createElement('div');
    const href = 'https://example.com/style.css';
    const tag = 'styled-element';

    const WebComp = createWebComponent(Dummy, { stylesheetHref: href });
    customElements.define(tag, WebComp);

    const instance = document.createElement(tag) as HTMLElement & {
      connectedCallback: () => void;
      shadowRoot?: ShadowRoot;
      attachShadow: (opts: { mode: 'open' }) => ShadowRoot;
    };

    const shadow = instance.attachShadow({ mode: 'open' });
    instance.connectedCallback();

    const link = shadow.querySelector(`link[href="${href}"]`);
    expect(link).not.toBeNull();
  });

  it('não deve injetar stylesheet se já existir', () => {
    const Dummy: React.FC = () => React.createElement('div');
    const href = 'https://example.com/style.css';
    const tag = 'already-styled';

    const WebComp = createWebComponent(Dummy, { stylesheetHref: href });
    customElements.define(tag, WebComp);

    const instance = document.createElement(tag) as HTMLElement & {
      connectedCallback: () => void;
      shadowRoot?: ShadowRoot;
      attachShadow: (opts: { mode: 'open' }) => ShadowRoot;
    };

    const shadow = instance.attachShadow({ mode: 'open' });
    const existingLink = document.createElement('link');
    existingLink.href = href;
    shadow.appendChild(existingLink);

    instance.connectedCallback();

    const links = shadow.querySelectorAll(`link[href="${href}"]`);
    expect(links.length).toBe(1);
  });
});
