import { useEffect, useState } from 'react';
import OffertFlow from './OffertFlow.jsx';

const TABS = [
  { id: 'laddbox',  label: 'Laddbox',  title: 'Priser' },
  { id: 'sakerhet', label: 'Säkerhet', title: 'Säkerhet' },
  { id: 'offert',   label: 'Offert',   title: 'Priser & offert' }
];

export default function Pricing({ initialTab = 'laddbox', onTitleChange }) {
  const [tab, setTab] = useState(initialTab);

  // If parent updates initialTab (e.g. user re-navigates with another tab), follow it
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  // Notify parent of header title based on active tab
  useEffect(() => {
    const t = TABS.find((x) => x.id === tab);
    if (t && onTitleChange) onTitleChange(t.title);
  }, [tab, onTitleChange]);

  return (
    <div className="sw-screen active">
      <div className="inner-body">
        <div className="section-title">
          <div className="section-title-bar"></div>
          <div className="section-title-text">Priser & offert</div>
        </div>
        <div className="price-toggle">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`price-toggle-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'laddbox' && <LaddboxSet />}
        {tab === 'sakerhet' && <SakerhetSet />}
        {tab === 'offert' && <OffertFlow />}
      </div>
    </div>
  );
}

function LaddboxSet() {
  return (
    <div className="price-set active">
      <div className="price-card featured">
        <div className="price-badge">GRÖNT AVDRAG 50%</div>
        <div className="price-tier">Privat / Villa</div>
        <div className="price-name">Hemmaladdning</div>
        <div className="price-amount">från 7 750 <span>kr</span></div>
        <div className="price-note">Pris efter 50% grönt avdrag på fakturan. Innan avdrag: från 15 500 kr.</div>
        <div className="price-features">
          <div className="price-feature">Uppfyller krav för grönt avdrag</div>
          <div className="price-feature">Passar alla elbilsmärken</div>
          <div className="price-feature">Med eller utan uppkoppling</div>
          <div className="price-feature">Snabb och trygg installation</div>
        </div>
        <a href="https://www.olsforsel.se/laddbox" target="_blank" rel="noopener noreferrer" className="price-cta">
          Läs mer om laddbox →
        </a>
      </div>
      <div className="price-card">
        <div className="price-tier">BRF / Företag</div>
        <div className="price-name">Flerladdning</div>
        <div className="price-amount">Offert <span>kontakta oss</span></div>
        <div className="price-features">
          <div className="price-feature">Lastbalansering för flera bilar</div>
          <div className="price-feature">Skräddarsytt för er fastighet</div>
          <div className="price-feature">Framtidssäker lösning</div>
        </div>
        <a href="https://www.olsforsel.se/kontakt" target="_blank" rel="noopener noreferrer" className="price-cta">Begär offert →</a>
      </div>
    </div>
  );
}

function SakerhetSet() {
  return (
    <div className="price-set active">
      <div className="price-card featured">
        <div className="price-badge">POPULÄRAST</div>
        <div className="price-tier">Bostad / Fastighet</div>
        <div className="price-name">Övervakningssystem</div>
        <div className="price-amount">från 5 000 <span>kr</span></div>
        <div className="price-features">
          <div className="price-feature">En eller flera kameror</div>
          <div className="price-feature">Inomhus och utomhus</div>
          <div className="price-feature">Med eller utan inspelning</div>
          <div className="price-feature">Enkelt att bygga ut</div>
        </div>
        <a href="https://www.olsforsel.se/sakerhet" target="_blank" rel="noopener noreferrer" className="price-cta">
          Läs mer om säkerhet →
        </a>
      </div>
      <div className="price-card">
        <div className="price-tier">Företag / Industri</div>
        <div className="price-name">Komplett säkerhet</div>
        <div className="price-amount">Offert <span>kontakta oss</span></div>
        <div className="price-features">
          <div className="price-feature">Passersystem & larm</div>
          <div className="price-feature">Anpassat er verksamhet</div>
          <div className="price-feature">Dygnet runt-skydd</div>
        </div>
        <a href="https://www.olsforsel.se/kontakt" target="_blank" rel="noopener noreferrer" className="price-cta">Begär offert →</a>
      </div>
    </div>
  );
}
