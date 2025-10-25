import './styles/index.css';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';
import { HansButton } from './components/Forms/Button/Button';
import { HansIcon } from './components/Icon/Icon';
import { HansButtonPropsList } from './components/Forms/Button/Button.types';
import { HansIconPropsList } from './components/Icon/Icon.types';

const ReactDOMtoWC = ReactDOM as unknown as Parameters<
  typeof reactToWebComponent
>[2];

const HansButtonWC = reactToWebComponent(HansButton, React, ReactDOMtoWC, {
  props: HansButtonPropsList,
});

const HansIconWC = reactToWebComponent(HansIcon, React, ReactDOMtoWC, {
  props: HansIconPropsList,
});

customElements.define('hans-button', HansButtonWC);
customElements.define('hans-icon', HansIconWC);
