import { ChatIcon, CloseIcon } from './Icons.jsx';

export default function Launcher({ open, onToggle }) {
  return (
    <button
      id="samify-launcher"
      className={open ? 'open' : ''}
      onClick={onToggle}
      aria-label={open ? 'Stäng support' : 'Öppna support'}
    >
      <span className="pulse"></span>
      <span className="si-chat" style={{ display: open ? 'none' : 'flex' }}>
        <ChatIcon size={26} strokeWidth={2} />
      </span>
      <span className="si-close" style={{ display: open ? 'block' : 'none' }}>
        <CloseIcon size={22} />
      </span>
    </button>
  );
}
