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

  it('Should not register again a custom element that already exists', () => {
    const Dummy: React.FC = () => React.createElement('div', null, 'Hello');
    const tag = 'existing-element';
    customElements.define(tag, class extends HTMLElement {});

    registerReactAsWebComponent(tag, Dummy, []);
    expect(customElements.get(tag)).toBeDefined();
  });
  it('Should inject stylesheet when stylesheetHref is given', () => {
    const Dummy: React.FC = () => React.createElement('div');
    const href = 'https://example.com/style.css';
    const tag = 'styled-element';

    const WebComp = createWebComponent(Dummy, { stylesheetHref: href });
    customElements.define(tag, WebComp);

    const instance = document.createElement(tag) as HTMLElement & {
      connectedCallback: () => void;
    };

    instance.connectedCallback();
    const shadow = instance.shadowRoot!;
    const link = shadow.querySelector(`link[href="${href}"]`);

    expect(link).not.toBeNull();
  });

  it('Should not inject stylesheet if already exists', () => {
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

    instance.connectedCallback();

    const links = shadow.querySelectorAll(`link[href="${href}"]`);
    expect(links.length).toBe(1);
  });
});
