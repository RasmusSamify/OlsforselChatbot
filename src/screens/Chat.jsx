import { useEffect } from 'react';
import { ZAPIER_CHATBOT_ID } from '../data.js';

// Zapier's web component is loaded once globally on first mount.
// `is-popup="false"` keeps it embedded inside our screen.
export default function Chat() {
  useEffect(() => {
    if (document.querySelector('script[data-zapier-interfaces]')) return;
    const s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
    s.dataset.zapierInterfaces = 'true';
    document.head.appendChild(s);
  }, []);

  return (
    <div className="sw-screen sw-screen-chat active">
      <zapier-interfaces-chatbot-embed
        is-popup="false"
        chatbot-id={ZAPIER_CHATBOT_ID}
        height="100%"
        width="100%"
      ></zapier-interfaces-chatbot-embed>
    </div>
  );
}
