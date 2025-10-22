import React from 'react';
import type { ComponentType } from 'react';
import { react18Renderer } from './react18-renderer';
import reactToWebComponent from 'react-to-webcomponent';
import '../styles/index.css'; // garante que os estilos sejam empacotados no build MF

// importa componentes do seu lib (já existentes)
import { Button } from '../components/Forms/Button/Button';
// import type { ButtonProps } from '../components/Forms/Button/Button.types';

// Tipagem genérica para componentes React
type PropsRecord = Record<string, unknown>;
type ReactComp<P extends PropsRecord = PropsRecord> = ComponentType<P>;

// Wrapper para montar React component dentro do custom element e que converte React component para Web Component
function toWC<P extends PropsRecord>(
  Component: ReactComp<P>,
  tagName: string,
): void {
  const WC = reactToWebComponent(
    Component,
    React,
    react18Renderer as unknown as Parameters<typeof reactToWebComponent>[2],
    { shadow: undefined },
  );
  if (!customElements.get(tagName)) {
    customElements.define(tagName, WC);
  }
}

export function defineWebComponents() {
  toWC(Button, 'hans-button');
  // registrar outros componentes aqui: toWC(OtherComponent, 'hans-other')
}
