import './styles/index.css';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';
import { Button } from './components/Forms/Button/Button';

const HansButton = reactToWebComponent(
  Button,
  React,
  ReactDOM as unknown as Parameters<typeof reactToWebComponent>[2],
);

customElements.define('hans-button', HansButton);
