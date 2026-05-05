import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Launcher from './components/Launcher.jsx';
import Tooltip from './components/Tooltip.jsx';
import Home from './screens/Home.jsx';
import Chat from './screens/Chat.jsx';
import Eldiagnos from './screens/Eldiagnos.jsx';
import Faq from './screens/Faq.jsx';
import Pricing from './screens/Pricing.jsx';
import LaddboxOffer from './screens/LaddboxOffer.jsx';
import Contact from './screens/Contact.jsx';
import { SAMIFY_LOGO } from './data.js';

// Only Pricing expands the widget (per design decision in conversation history).
const EXPAND_SCREENS = new Set(['pricing']);

export default function Widget() {
  const [open, setOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const [screen, setScreen] = useState('home');
  const [headerTitle, setHeaderTitle] = useState('OLSFORS ELEKTRISKA');
  const [pricingTab, setPricingTab] = useState('laddbox');

  const isHome = screen === 'home';
  const expanded = EXPAND_SCREENS.has(screen);

  const navigate = useCallback((scr, title) => {
    setScreen(scr);
    setHeaderTitle(title || 'OLSFORS ELEKTRISKA');
  }, []);

  const goHome = useCallback(() => {
    setScreen('home');
    setHeaderTitle('OLSFORS ELEKTRISKA');
  }, []);

  const openPricer = useCallback((tab) => {
    setPricingTab(tab);
    setScreen('pricing');
    setHeaderTitle(tab === 'offert' ? 'Priser & offert' : tab === 'sakerhet' ? 'Säkerhet' : 'Priser');
  }, []);

  const onToggleLauncher = useCallback(() => {
    setOpen((o) => !o);
    setTooltipVisible(false);
  }, []);

  const onTooltipOpen = useCallback(() => {
    setOpen(true);
    setTooltipVisible(false);
  }, []);

  const onTooltipClose = useCallback(() => setTooltipVisible(false), []);

  // Hide tooltip permanently once widget has been opened
  useEffect(() => { if (open) setTooltipVisible(false); }, [open]);

  const widgetClasses = [
    open && 'visible',
    expanded && 'expanded',
    isHome && 'is-home'
  ].filter(Boolean).join(' ');

  return (
    <div id="samify-widget-container" style={{ position: 'fixed', bottom: 0, right: 0, width: 0, height: 0, overflow: 'visible', zIndex: 9997 }}>
      <Launcher open={open} onToggle={onToggleLauncher} />

      <div id="samify-widget" className={widgetClasses}>
        <Header title={headerTitle} showBack={!isHome} onBack={goHome} isHome={isHome} />

        <div className="sw-content">
          {screen === 'home' && <Home onNavigate={navigate} onPricer={openPricer} />}
          {screen === 'chat' && <Chat />}
          {screen === 'eldiagnos' && <Eldiagnos onNavigate={navigate} onPricer={openPricer} />}
          {screen === 'faq' && <Faq />}
          {screen === 'pricing' && <Pricing initialTab={pricingTab} onTitleChange={setHeaderTitle} />}
          {screen === 'laddbox-offer' && <LaddboxOffer />}
          {screen === 'contact' && <Contact />}
        </div>

        <div className="sw-footer">
          <a href="https://samify.se" target="_blank" rel="noopener noreferrer">
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.03em' }}>Powered By</span>
            <img src={SAMIFY_LOGO} alt="Samify" style={{ height: 16, width: 'auto', display: 'block' }} />
            <span className="sw-pdot"></span>
          </a>
        </div>
      </div>

      <Tooltip visible={tooltipVisible && !open} onOpen={onTooltipOpen} onClose={onTooltipClose} />
    </div>
  );
}
