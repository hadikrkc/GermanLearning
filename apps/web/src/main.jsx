import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import store from './store';
import { injectStore } from './api/client';
import './assets/less/light-theme.less';
import './index.css';

injectStore(store);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
