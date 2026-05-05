// Production embed entry — auto-mounts on script load.
// CSS is imported as inline string and injected into a <style> tag at runtime
// so the entire widget ships as a single widget.js file with no separate CSS.
import { createRoot } from 'react-dom/client';
import Widget from './Widget.jsx';
import css from './styles.css?inline';

(function () {
  if (document.getElementById('samify-widget-mount')) return;

  const style = document.createElement('style');
  style.dataset.samifyWidget = 'true';
  style.textContent = css;
  document.head.appendChild(style);

  const mount = document.createElement('div');
  mount.id = 'samify-widget-mount';
  document.body.appendChild(mount);

  createRoot(mount).render(<Widget />);
})();
