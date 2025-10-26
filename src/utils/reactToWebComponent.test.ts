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
    const Dummy = () => React.createElement('div', null, 'Hello');
    const WebComp = createWebComponent(Dummy, { shadow: 'open' });

    expect(WebComp).toBeTypeOf('function');
    const instance = new (WebComp as any)();
    expect(instance).toBeInstanceOf(HTMLElement);
  });

  it('deve registrar um componente React como custom element', () => {
    const Dummy = () => React.createElement('div', null, 'Hello');
    const tag = 'dummy-element';

    registerReactAsWebComponent(tag, Dummy, ['title']);
    expect(customElements.get(tag)).toBeDefined();
  });

  it('não deve registrar novamente um custom element já existente', () => {
    const Dummy = () => React.createElement('div', null, 'Hello');
    const tag = 'existing-element';
    customElements.define(tag, class extends HTMLElement {});

    registerReactAsWebComponent(tag, Dummy, []);
    expect(customElements.get(tag)).toBeDefined();
  });

  it('deve injetar stylesheet quando stylesheetHref é fornecido', () => {
    const Dummy = () => React.createElement('div');
    const href = 'https://example.com/style.css';

    const WebComp = createWebComponent(Dummy, { stylesheetHref: href });
    const instance = new (WebComp as any)();

    const shadow = instance.attachShadow({ mode: 'open' });
    instance.connectedCallback();

    const link = shadow.querySelector(`link[href="${href}"]`);
    expect(link).not.toBeNull();
  });

  it('não deve injetar stylesheet se já existir', () => {
    const Dummy = () => React.createElement('div');
    const href = 'https://example.com/style.css';

    const WebComp = createWebComponent(Dummy, { stylesheetHref: href });
    const instance = new (WebComp as any)();

    const shadow = instance.attachShadow({ mode: 'open' });
    const existingLink = document.createElement('link');
    existingLink.href = href;
    shadow.appendChild(existingLink);

    instance.connectedCallback();

    const links = shadow.querySelectorAll(`link[href="${href}"]`);
    expect(links.length).toBe(1);
  });
});
