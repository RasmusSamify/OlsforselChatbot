(function() {
  if (document.getElementById('samify-widget-container')) return;

  // Load Zapier chatbot script
  var zapierScript = document.createElement('script');
  zapierScript.type = 'module';
  zapierScript.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
  document.head.appendChild(zapierScript);

  // Fonts
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(link);

  // CSS
  var style = document.createElement('style');
  style.textContent = `
    #samify-widget-container * { font-family: 'Montserrat', sans-serif !important; box-sizing: border-box; }

    #samify-launcher {
      position: fixed; bottom: 24px; right: 24px;
      width: 64px; height: 64px; border-radius: 50%;
      background: #1a1a2e; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      transition: transform 0.2s, background 0.2s;
      z-index: 9999;
    }
    #samify-launcher:hover { transform: scale(1.07); background: #0f3460; }
    #samify-launcher.open .si-chat { display: none; }
    #samify-launcher.open .si-close { display: block !important; }

    #samify-widget {
      position: fixed; bottom: 100px; right: 24px;
      width: 380px; height: 620px;
      border-radius: 18px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08);
      background: #fff;
      display: flex; flex-direction: column;
      overflow: hidden;
      transform: scale(0.92) translateY(16px);
      opacity: 0; pointer-events: none;
      transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease, width 0.3s ease, height 0.3s ease, bottom 0.3s ease;
      z-index: 9998;
    }
    #samify-widget.visible { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    #samify-widget.expanded { width: 520px; height: 780px; bottom: 24px; }
    @media (max-width: 580px) { #samify-widget.expanded { width: calc(100vw - 16px); height: calc(100vh - 100px); right: 8px; } }

    .sw-header {
      background: #1a1a2e; padding: 14px 18px;
      display: flex; align-items: center; gap: 12px;
      flex-shrink: 0;
    }
    .sw-back {
      background: rgba(255,255,255,0.1); border: none; cursor: pointer;
      width: 28px; height: 28px; border-radius: 50%;
      display: none; align-items: center; justify-content: center;
      color: #fff; font-size: 16px; transition: background 0.15s;
      flex-shrink: 0;
    }
    .sw-back.show { display: flex; }
    .sw-back:hover { background: rgba(255,255,255,0.2); }

    .sw-logo-wrap {
      background: #fff; border-radius: 8px; padding: 5px 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .sw-logo-wrap img { height: 28px; width: auto; display: block; }
    .sw-header-right { display: flex; flex-direction: column; gap: 2px; }
    .sw-title { font-size: 13px; font-weight: 700; color: #fff; }
    .sw-status { font-size: 11px; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 4px; margin-top: 1px; }
    .sw-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; }

    .sw-content { flex: 1; overflow: hidden; position: relative; }
    .sw-screen { position: absolute; inset: 0; overflow-y: auto; background: #f7f7f8; display: none; flex-direction: column; }
    .sw-screen.active { display: flex; }

    /* HOME */
    .home-body { padding: 16px; }
    .home-greeting {
      font-size: 12.5px; font-weight: 400; color: #6b6b7b;
      line-height: 1.6; margin-bottom: 14px;
      background: #fff; border-radius: 12px; padding: 12px 14px;
      border: 1px solid #e8e8ec;
    }
    .home-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .home-card {
      background: #fff; border: 1px solid #e8e8ec;
      border-radius: 12px; padding: 14px 12px;
      display: flex; flex-direction: column; align-items: center;
      gap: 7px; cursor: pointer; text-align: center;
      transition: background 0.15s, border-color 0.15s, transform 0.1s;
    }
    .home-card:hover { background: #f0f0f8; border-color: #1a1a2e; transform: translateY(-1px); }
    .home-card:active { transform: scale(0.97); }
    .home-card.wide {
      grid-column: span 2; flex-direction: row;
      justify-content: flex-start; gap: 14px;
      padding: 14px 16px; text-align: left;
      background: #1a1a2e; border-color: #1a1a2e;
    }
    .home-card.wide:hover { background: #0f3460; border-color: #0f3460; }
    .home-card.wide .card-label { color: #fff; }
    .home-card.wide .card-sub { color: rgba(255,255,255,0.55); }
    .home-card.wide .card-icon-wrap {
      width: 40px; height: 40px; border-radius: 10px;
      background: rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .home-card .card-icon-wrap {
      width: 38px; height: 38px; border-radius: 10px; background: #f0f0f8;
      display: flex; align-items: center; justify-content: center;
    }
    .card-icon-wrap svg { stroke: #6b6b7b; }
    .home-card.wide .card-icon-wrap svg { stroke: rgba(255,255,255,0.85); }
    .card-label { font-size: 12px; font-weight: 700; color: #111118; }
    .card-sub { font-size: 10.5px; color: #a0a0b0; font-weight: 400; }
    .wide-arrow { margin-left: auto; color: rgba(255,255,255,0.4); font-size: 20px; font-weight: 300; }

    /* INNER SCREENS */
    .inner-body { padding: 16px; flex: 1; }
    .inner-title { font-size: 13px; font-weight: 700; color: #111118; margin-bottom: 12px; }

    /* CHAT */
    #sw-chat { display: none; flex-direction: column; }
    #sw-chat.active { display: flex; }
    #sw-chat zapier-interfaces-chatbot-embed { flex: 1; width: 100% !important; height: 100% !important; border: none; display: block; }

    /* FAQ */
    .faq-item { border: 1px solid #e8e8ec; border-radius: 10px; margin-bottom: 8px; overflow: hidden; background: #fff; }
    .faq-q { width: 100%; text-align: left; background: none; border: none; padding: 13px 15px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #111118; transition: background 0.1s; gap: 10px; }
    .faq-q:hover { background: #f7f7f8; }
    .faq-chevron { flex-shrink: 0; transition: transform 0.2s; color: #a0a0b0; }
    .faq-item.open .faq-chevron { transform: rotate(180deg); }
    .faq-a { display: none; padding: 11px 15px 13px; font-size: 12px; color: #6b6b7b; line-height: 1.65; border-top: 1px solid #e8e8ec; }
    .faq-item.open .faq-a { display: block; }

    /* PRICING */
    .price-toggle { display: flex; background: #ebebeb; border-radius: 8px; padding: 3px; margin-bottom: 14px; gap: 3px; }
    .price-toggle-btn { flex: 1; padding: 7px; border: none; background: transparent; border-radius: 6px; font-size: 11.5px; font-weight: 600; color: #6b6b7b; cursor: pointer; transition: all 0.15s; }
    .price-toggle-btn.active { background: #1a1a2e; color: #fff; }
    .price-set { display: none; }
    .price-set.active { display: block; }
    .price-card { background: #fff; border: 1px solid #e8e8ec; border-radius: 12px; padding: 14px; margin-bottom: 10px; }
    .price-card.featured { border-color: #c0392b; border-width: 1.5px; }
    .price-badge { display: inline-block; font-size: 9.5px; font-weight: 700; background: #c0392b; color: #fff; padding: 3px 9px; border-radius: 20px; margin-bottom: 8px; letter-spacing: 0.05em; }
    .price-tier { font-size: 9.5px; font-weight: 700; color: #a0a0b0; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
    .price-name { font-size: 16px; font-weight: 700; color: #111118; margin-bottom: 6px; }
    .price-amount { font-size: 19px; font-weight: 700; color: #1a1a2e; letter-spacing: -0.02em; }
    .price-amount span { font-size: 11px; font-weight: 400; color: #a0a0b0; }
    .price-note { font-size: 10.5px; color: #a0a0b0; margin-top: 5px; line-height: 1.5; }
    .price-features { margin-top: 10px; display: flex; flex-direction: column; gap: 5px; }
    .price-feature { font-size: 11.5px; color: #6b6b7b; display: flex; align-items: flex-start; gap: 7px; line-height: 1.4; }
    .price-feature::before { content: '✓'; color: #166534; font-weight: 700; font-size: 11px; flex-shrink: 0; margin-top: 1px; }
    .price-cta { display: block; width: 100%; margin-top: 12px; padding: 10px; background: #1a1a2e; color: #fff; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 700; cursor: pointer; text-align: center; transition: background 0.15s; text-decoration: none; box-sizing: border-box; }
    .price-cta:hover { background: #0f3460; }
    .price-card.featured .price-cta { background: #c0392b; }
    .price-card.featured .price-cta:hover { opacity: 0.88; }

    /* CONTACT */
    .contact-card { background: #fff; border: 1px solid #e8e8ec; border-radius: 10px; padding: 14px; margin-bottom: 8px; }
    .contact-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .contact-av { width: 38px; height: 38px; border-radius: 50%; background: #f0f0f8; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #1a1a2e; flex-shrink: 0; }
    .contact-name { font-size: 13px; font-weight: 700; color: #111118; }
    .contact-role { font-size: 11px; color: #a0a0b0; }
    .contact-links { display: flex; flex-direction: column; gap: 4px; }
    .contact-link { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #6b6b7b; text-decoration: none; padding: 7px 8px; border-radius: 7px; transition: background 0.1s; }
    .contact-link:hover { background: #f7f7f8; color: #111118; }

    /* TOOLTIP */
    #samify-tooltip {
      position: fixed; bottom: 100px; right: 24px;
      background: #1a1a2e; color: #fff;
      padding: 16px 20px 16px 16px; border-radius: 16px 16px 4px 16px;
      font-size: 14px; font-weight: 500; line-height: 1.6;
      max-width: 260px; cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.18);
      opacity: 0; transform: translateY(8px) scale(0.95);
      transition: opacity 0.3s ease, transform 0.3s ease;
      z-index: 9999; pointer-events: all;
    }
    #samify-tooltip.show { opacity: 1; transform: translateY(0) scale(1); }
    #samify-tooltip::after {
      content: ''; position: absolute; bottom: -8px; right: 20px;
      border-left: 8px solid transparent; border-right: 8px solid transparent;
      border-top: 8px solid #1a1a2e;
    }
    #samify-tooltip-close { position: absolute; top: 6px; right: 8px; background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 13px; line-height: 1; padding: 0; }
    #samify-tooltip-close:hover { color: #fff; }

    /* FOOTER */
    .sw-footer { padding: 10px 14px; border-top: 1px solid #e8e8ec; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #fff; }
    .sw-footer a { font-size: 12px; color: #111; text-decoration: none; display: flex; align-items: center; gap: 5px; font-weight: 700; letter-spacing: 0.02em; transition: opacity 0.15s; }
    .sw-footer a:hover { opacity: 0.65; }
    .sw-pdot { width: 6px; height: 6px; border-radius: 50%; background: #7c3aed; display: inline-block; }
  `;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'samify-widget-container';
  wrap.style.cssText = 'position:fixed;bottom:0;right:0;width:0;height:0;overflow:visible;z-index:9997;';
  wrap.innerHTML = `
    <button id="samify-launcher" onclick="swToggle()" aria-label="Öppna support">
      <svg class="si-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="si-close" style="display:none" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div id="samify-widget">
      <div class="sw-header" id="sw-header">
        <button class="sw-back" id="sw-back" onclick="swGoHome()">‹</button>
        <div class="sw-logo-wrap">
          <img src="https://static.wixstatic.com/media/fe5ae4_284ae9bd99a84c3eb1101ed27d9f7a2f~mv2.png/v1/crop/x_1,y_0,w_258,h_98/fill/w_183,h_70,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RGB_Logo_R%C3%B6d_elkedjan.png" alt="Olsfors Elektriska" />
        </div>
        <div class="sw-header-right">
          <div class="sw-title" id="sw-header-title">Olsfors Elektriska</div>
          <div class="sw-status"><span class="sw-dot"></span> Online nu</div>
        </div>
      </div>

      <div class="sw-content">

        <!-- HOME -->
        <div class="sw-screen active" id="sw-home">
          <div class="home-body">
            <div class="home-greeting">Hej! Välkommen till Olsfors Elektriska — din lokala elektriker sedan 1963. Hur kan vi hjälpa dig idag?</div>
            <div class="home-grid">
              <div class="home-card wide" onclick="swNav('sw-chat','Chatta med oss')">
                <div class="card-icon-wrap"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <div>
                  <div class="card-label">Chatta med oss</div>
                  <div class="card-sub">Svar direkt från vår AI</div>
                </div>
                <div class="wide-arrow">›</div>
              </div>
              <div class="home-card" onclick="swNav('sw-faq','Vanliga frågor')">
                <div class="card-icon-wrap"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <div class="card-label">Vanliga frågor</div>
                <div class="card-sub">Snabba svar</div>
              </div>
              <div class="home-card" onclick="swNav('sw-booking','Offertförfrågan')">
                <div class="card-icon-wrap"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                <div class="card-label">Offertförfrågan</div>
                <div class="card-sub">Kostnadsfritt</div>
              </div>
              <div class="home-card" onclick="swNav('sw-pricing','Priser')">
                <div class="card-icon-wrap"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                <div class="card-label">Priser</div>
                <div class="card-sub">Laddbox fr. 7 750 kr</div>
              </div>
              <div class="home-card" onclick="swNav('sw-contact','Kontakt')">
                <div class="card-icon-wrap"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                <div class="card-label">Kontakt</div>
                <div class="card-sub">033 29 53 32</div>
              </div>
            </div>
          </div>
        </div>

        <!-- CHAT -->
        <div class="sw-screen" id="sw-chat">
          <zapier-interfaces-chatbot-embed
            is-popup="false"
            chatbot-id="cml7176g80063a6ttccmada8x"
            height="100%"
            width="100%"
          ></zapier-interfaces-chatbot-embed>
        </div>

        <!-- FAQ -->
        <div class="sw-screen" id="sw-faq">
          <div class="inner-body">
            <div class="inner-title">Vanliga frågor</div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Vad gör Olsfors Elektriska? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Vi är en lokal elektriker med rötter i Olsfors och Bollebygd sedan 1963. Vi hjälper privatpersoner, företag, industri och fastighetsägare med allt inom el — från kortslutningar till kompletta installationer, solceller, laddboxar och smarta hem.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Vilka områden jobbar ni i? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Vi är verksamma i Olsfors, Bollebygd, Mölnlycke, Landvetter, Härryda, Hindås, Sätila, Kinna, Skene, Fritsla, Fristad och kringliggande orter i Västra Götaland.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Installerar ni laddboxar? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Ja! Vi installerar laddboxar för villor, bostadsrättsföreningar och företag. Priset börjar från 7 750 kr (efter 50% grönt avdrag på fakturan). Vi hjälper dig välja rätt box — med eller utan lastbalansering och uppkoppling.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Vad kostar ett övervakningssystem? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Övervakningspaket startar från 5 000 kr. Vi erbjuder allt från en enskild kamera till kompletta system för bostad, fastighet eller verksamhet — inomhus och utomhus, med eller utan inspelning.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Installerar ni solceller? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Ja, vi installerar solceller och hjälper dig med hela lösningen — från planering till driftsättning. Kontakta oss för en kostnadsfri offert anpassad till din fastighet.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Jobbar ni med industri och entreprenad? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Absolut. Vi tar entreprenader av alla storlekar och hjälper industrin med apparatskåp, nyinstallation, felsökning och maskinservice. Vi är med från start till mål.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Hur snabbt kan ni komma? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Vi prioriterar snabba svar och smidiga lösningar. Ring oss på 033 29 53 32 eller skicka in en offertförfrågan via hemsidan så återkommer vi så fort som möjligt.</div>
            </div>
          </div>
        </div>

        <!-- OFFERT -->
        <div class="sw-screen" id="sw-booking">
          <div class="inner-body" style="display:flex;flex-direction:column;gap:12px;">
            <div class="inner-title">Offertförfrågan</div>
            <div style="background:#fff;border:1px solid #e8e8ec;border-radius:12px;padding:18px;text-align:center;">
              <div style="width:48px;height:48px;border-radius:12px;background:#f0f0f8;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1a1a2e" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <div style="font-size:14px;font-weight:700;color:#111118;margin-bottom:6px;">Skicka in en offertförfrågan</div>
              <div style="font-size:12px;color:#6b6b7b;margin-bottom:16px;line-height:1.6;">Berätta vad du behöver hjälp med — vi återkommer snabbt med ett prisförslag utan bindning.</div>
              <a href="https://www.olsforsel.se/kontakt" target="_blank" style="display:block;width:100%;padding:12px;background:#1a1a2e;color:#fff;border-radius:9px;font-size:13px;font-weight:700;text-decoration:none;text-align:center;box-sizing:border-box;">
                Öppna kontaktformulär →
              </a>
            </div>
            <div style="background:#fff;border:1px solid #e8e8ec;border-radius:12px;padding:14px;">
              <div style="font-size:11px;font-weight:700;color:#a0a0b0;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:10px;">Eller nå oss direkt</div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                <a href="tel:033295332" style="display:flex;align-items:center;gap:10px;font-size:12px;color:#6b6b7b;text-decoration:none;padding:6px 8px;border-radius:7px;transition:background 0.1s;" onmouseover="this.style.background='#f7f7f8'" onmouseout="this.style.background='transparent'">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  033 29 53 32
                </a>
                <a href="mailto:info@olsforsel.se" style="display:flex;align-items:center;gap:10px;font-size:12px;color:#6b6b7b;text-decoration:none;padding:6px 8px;border-radius:7px;transition:background 0.1s;" onmouseover="this.style.background='#f7f7f8'" onmouseout="this.style.background='transparent'">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  info@olsforsel.se
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- PRICING -->
        <div class="sw-screen" id="sw-pricing">
          <div class="inner-body">
            <div class="inner-title">Priser</div>
            <div class="price-toggle">
              <button class="price-toggle-btn active" onclick="swPricingTab('laddbox',this)">Laddbox</button>
              <button class="price-toggle-btn" onclick="swPricingTab('sakerhet',this)">Säkerhet</button>
            </div>

            <div id="sw-price-laddbox" class="price-set active">
              <div class="price-card featured">
                <div class="price-badge">GRÖNT AVDRAG 50%</div>
                <div class="price-tier">Privat / Villa</div>
                <div class="price-name">Hemmaladdning</div>
                <div class="price-amount">från 7 750 <span>kr</span></div>
                <div class="price-note">Pris efter 50% grönt avdrag på fakturan. Innan avdrag: från 15 500 kr.</div>
                <div class="price-features">
                  <div class="price-feature">Uppfyller krav för grönt avdrag</div>
                  <div class="price-feature">Passar alla elbilsmärken</div>
                  <div class="price-feature">Med eller utan uppkoppling</div>
                  <div class="price-feature">Snabb och trygg installation</div>
                </div>
                <a href="https://www.olsforsel.se/laddbox" target="_blank" class="price-cta">Läs mer om laddbox →</a>
              </div>
              <div class="price-card">
                <div class="price-tier">BRF / Företag</div>
                <div class="price-name">Flerladdning</div>
                <div class="price-amount">Offert <span>kontakta oss</span></div>
                <div class="price-features">
                  <div class="price-feature">Lastbalansering för flera bilar</div>
                  <div class="price-feature">Skräddarsytt för er fastighet</div>
                  <div class="price-feature">Framtidssäker lösning</div>
                </div>
                <a href="https://www.olsforsel.se/kontakt" target="_blank" class="price-cta">Begär offert →</a>
              </div>
            </div>

            <div id="sw-price-sakerhet" class="price-set">
              <div class="price-card featured">
                <div class="price-badge">POPULÄRAST</div>
                <div class="price-tier">Bostad / Fastighet</div>
                <div class="price-name">Övervakningssystem</div>
                <div class="price-amount">från 5 000 <span>kr</span></div>
                <div class="price-features">
                  <div class="price-feature">En eller flera kameror</div>
                  <div class="price-feature">Inomhus och utomhus</div>
                  <div class="price-feature">Med eller utan inspelning</div>
                  <div class="price-feature">Enkelt att bygga ut</div>
                </div>
                <a href="https://www.olsforsel.se/sakerhet" target="_blank" class="price-cta">Läs mer om säkerhet →</a>
              </div>
              <div class="price-card">
                <div class="price-tier">Företag / Industri</div>
                <div class="price-name">Komplett säkerhet</div>
                <div class="price-amount">Offert <span>kontakta oss</span></div>
                <div class="price-features">
                  <div class="price-feature">Passersystem & larm</div>
                  <div class="price-feature">Anpassat er verksamhet</div>
                  <div class="price-feature">Dygnet runt-skydd</div>
                </div>
                <a href="https://www.olsforsel.se/kontakt" target="_blank" class="price-cta">Begär offert →</a>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTACT -->
        <div class="sw-screen" id="sw-contact">
          <div class="inner-body">
            <div class="inner-title">Kontakta oss</div>
            <div class="contact-card">
              <div class="contact-head">
                <div class="contact-av">OE</div>
                <div>
                  <div class="contact-name">Olsfors Elektriska AB</div>
                  <div class="contact-role">Elektriker · Olsfors & Västra Götaland</div>
                </div>
              </div>
              <div class="contact-links">
                <a href="tel:033295332" class="contact-link">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  033 29 53 32
                </a>
                <a href="mailto:info@olsforsel.se" class="contact-link">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  info@olsforsel.se
                </a>
                <a href="https://www.olsforsel.se" target="_blank" class="contact-link">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  olsforsel.se
                </a>
                <a href="https://www.facebook.com/olsforsel" target="_blank" class="contact-link">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  Facebook
                </a>
              </div>
            </div>
            <div class="contact-card">
              <div style="font-size:11px;font-weight:700;color:#a0a0b0;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:8px;">Adress</div>
              <div style="font-size:12.5px;color:#6b6b7b;line-height:1.8;">
                Boråsvägen 16<br>
                517 71 Olsfors<br>
                <span style="font-size:11px;color:#a0a0b0;">Org.nr 556149-4138</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="sw-footer">
        <a href="https://samify.se" target="_blank" style="flex-direction:row;align-items:center;gap:6px;">
          <span style="font-size:11px;font-weight:700;color:#a0a0b0;letter-spacing:0.03em;">Powered By</span>
          <img src="https://samify.se/wp-content/uploads/go-x/u/7c566770-2e09-4b98-98b8-c4afcbbeeeaa/image-160x62.png" alt="Samify" style="height:18px;width:auto;display:block;" />
          <span class="sw-pdot"></span>
        </a>
      </div>
    </div>

    <div id="samify-tooltip" onclick="swOpenFromTooltip()">
      <button id="samify-tooltip-close" onclick="event.stopPropagation();swCloseTooltip()">✕</button>
      Hej! Behöver du hjälp med el, laddbox eller solceller? Vi på Olsfors Elektriska hjälper dig gärna!
    </div>
  `;
  document.body.appendChild(wrap);

  function swToggle() {
    document.getElementById('samify-widget').classList.toggle('visible');
    document.getElementById('samify-launcher').classList.toggle('open');
    swCloseTooltip();
  }

  function swGoHome() {
    document.querySelectorAll('.sw-screen').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('sw-home').classList.add('active');
    document.getElementById('sw-back').classList.remove('show');
    document.getElementById('sw-header-title').textContent = 'Olsfors Elektriska';
    document.getElementById('samify-widget').classList.remove('expanded');
  }

  var expandScreens = ['sw-chat', 'sw-pricing'];

  function swNav(screenId, title) {
    document.querySelectorAll('.sw-screen').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById(screenId).classList.add('active');
    document.getElementById('sw-back').classList.add('show');
    document.getElementById('sw-header-title').textContent = title;
    var widget = document.getElementById('samify-widget');
    if (expandScreens.indexOf(screenId) !== -1) {
      widget.classList.add('expanded');
    } else {
      widget.classList.remove('expanded');
    }
  }

  function swFaq(btn) { btn.closest('.faq-item').classList.toggle('open'); }

  function swPricingTab(name, btn) {
    document.querySelectorAll('.price-set').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.price-toggle-btn').forEach(function(b) { b.classList.remove('active'); });
    document.getElementById('sw-price-' + name).classList.add('active');
    btn.classList.add('active');
  }

  function swCloseTooltip() {
    var t = document.getElementById('samify-tooltip');
    if (t) { t.classList.remove('show'); setTimeout(function() { t.style.display = 'none'; }, 300); }
  }

  function swOpenFromTooltip() {
    swCloseTooltip();
    document.getElementById('samify-widget').classList.add('visible');
    document.getElementById('samify-launcher').classList.add('open');
  }

  setTimeout(function() {
    var t = document.getElementById('samify-tooltip');
    if (t) t.classList.add('show');
  }, 400);

  window.swToggle = swToggle;
  window.swGoHome = swGoHome;
  window.swNav = swNav;
  window.swFaq = swFaq;
  window.swPricingTab = swPricingTab;
  window.swCloseTooltip = swCloseTooltip;
  window.swOpenFromTooltip = swOpenFromTooltip;
})();
