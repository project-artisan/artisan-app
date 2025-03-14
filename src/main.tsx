import './styles/global.scss';
import './styles/global.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

// Ensure React is available in the global scope
window.React = React;

const container = document.querySelector('#root');
const root = createRoot(container as HTMLElement);

root.render(
    <App />
);
