import React from 'react';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
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
  // convert react component para webcomponent
  // reactToWebComponent aceita o component + React + optional renderer.
  // Passamos um renderer fortemente tipado (acima) — não usamos `any`.
  /**
   * ⚠️ A tipagem de `react-to-webcomponent` espera uma função "render" antiga do ReactDOM,
   * não o novo `createRoot`. Como `createRoot` é a API recomendada, a gente apenas
   * faz um cast explícito de tipo sem usar `any`.
   */
  const renderer = createRoot as unknown as Parameters<
    typeof reactToWebComponent
  >[2];
  const WC = reactToWebComponent(Component, React, renderer);
  if (!customElements.get(tagName)) {
    customElements.define(tagName, WC);
  }
}

export function defineWebComponents() {
  toWC(Button, 'hans-button');
  // registrar outros componentes aqui: toWC(OtherComponent, 'hans-other')
}
