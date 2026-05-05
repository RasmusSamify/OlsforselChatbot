// Dev entry — mounted by index.html
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Widget from './Widget.jsx';
import './styles.css';

const mount = document.createElement('div');
document.body.appendChild(mount);

createRoot(mount).render(
  <StrictMode>
    <Widget />
  </StrictMode>
);
