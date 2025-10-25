import './styles/index.css';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';
import { HansButton } from './components/Forms/Button/Button';
import { HansIcon } from './components/Icon/Icon';

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

const HansIconWC = reactToWebComponent(HansIcon, React, ReactDOMtoWC, {
  props: ['name', 'size', 'customClasses'],
});

customElements.define('hans-button', HansButtonWC);
customElements.define('hans-icon', HansIconWC);
