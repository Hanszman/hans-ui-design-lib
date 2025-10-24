import './styles/index.css';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';
import { HansButton } from './components/Forms/Button/Button';

const ReactDOMtoWC = ReactDOM as unknown as Parameters<
  typeof reactToWebComponent
>[2];

const HansButtonWC = reactToWebComponent(HansButton, React, ReactDOMtoWC, {
  props: [
    'label',
    'size',
    'color',
    'variant',
    'buttonType',
    'customClasses',
    'disabled',
    'children',
  ],
});

customElements.define('hans-button', HansButtonWC);
