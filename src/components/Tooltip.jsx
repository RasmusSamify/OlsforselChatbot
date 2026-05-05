import { useEffect, useState } from 'react';

export default function Tooltip({ visible, onOpen, onClose }) {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowing(false);
      return;
    }
    const t = setTimeout(() => setShowing(true), 600);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      id="samify-tooltip"
      className={showing ? 'show' : ''}
      onClick={onOpen}
    >
      <button
        id="samify-tooltip-close"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Stäng"
      >✕</button>
      Hej! Behöver du hjälp med el, laddbox eller solceller? Vi på Olsfors Elektriska hjälper dig gärna!
    </div>
  );
}
