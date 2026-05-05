import { LOGO_URL } from '../data.js';

export default function Header({ title, showBack, onBack, isHome }) {
  return (
    <div className="sw-header-wrap">
      <div className="sw-header">
        <button
          className={`sw-back ${showBack ? 'show' : ''}`}
          onClick={onBack}
          aria-label="Tillbaka"
        >‹</button>
        <div className="sw-logo-wrap">
          <img src={LOGO_URL} alt="Olsfors Elektriska" />
        </div>
        <div className="sw-header-right">
          <div className="sw-title">{title}</div>
          <div className="sw-status"><span className="sw-dot"></span> Online · svar inom 1 min</div>
        </div>
      </div>
      {isHome && (
        <div className="sw-brand-band">
          <div className="brand-band-title">
            Trygg el sedan <span className="red">1963</span> i Bollebygd.
          </div>
          <div className="brand-band-stats">
            <div className="brand-stat">
              <div className="brand-stat-num">60+</div>
              <div className="brand-stat-lbl">år i branschen</div>
            </div>
            <div className="brand-stat">
              <div className="brand-stat-num">EIO</div>
              <div className="brand-stat-lbl">auktoriserad</div>
            </div>
            <div className="brand-stat">
              <div className="brand-stat-num">4,8★</div>
              <div className="brand-stat-lbl">på reco.se</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
