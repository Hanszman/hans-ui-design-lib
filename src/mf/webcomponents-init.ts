import React from 'react';
import { createRoot } from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';
import '../styles/index.css';

// importa componentes do seu lib (já existentes)
import { Button } from '../components/Forms/Button/Button';
// import type { ButtonProps } from '../components/Forms/Button/Button.types';

// wrapper para montar React component dentro do custom element
function toWC(Component: any, tagName: string) {
  // convert react component para webcomponent
  const WC = reactToWebComponent(Component, React, createRoot as any);
  if (!customElements.get(tagName)) {
    customElements.define(tagName, WC);
  }
}

export function defineWebComponents() {
  toWC(Button, 'hans-button');
  // ... register outros componentes
}
