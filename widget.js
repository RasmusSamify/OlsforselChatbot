(function() {
  if (document.getElementById('samify-widget-container')) return;

  // Zapier chatbot embed
  var zapierScript = document.createElement('script');
  zapierScript.type = 'module';
  zapierScript.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
  document.head.appendChild(zapierScript);

  // Fonts
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap';
  document.head.appendChild(link);

  // CSS
  var style = document.createElement('style');
  style.textContent = `
    #samify-widget-container, #samify-widget-container * { font-family: 'Montserrat', sans-serif; box-sizing: border-box; }

    #samify-widget-container {
      --ink: #1a1a2e;
      --ink-2: #0f1023;
      --red: #c0392b;
      --red-dark: #9c2b20;
      --bg: #f7f7f8;
      --bg-elev: #f0f0f4;
      --text: #111118;
      --text-mute: #6b6b7b;
      --text-dim: #a0a0b0;
      --border: #e8e8ec;
      --border-mid: #c8c8d0;
      --green: #16a34a;
      --amber: #d97706;
    }

    /* === LAUNCHER === */
    #samify-launcher {
      position: fixed; bottom: 24px; right: 24px;
      width: 64px; height: 64px; border-radius: 50%;
      background: var(--ink); border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 28px rgba(0,0,0,0.28);
      transition: transform 0.2s, background 0.2s;
      z-index: 9999;
    }
    #samify-launcher:hover { transform: scale(1.07); background: var(--red); }
    #samify-launcher.open .si-chat { display: none; }
    #samify-launcher.open .si-close { display: block !important; }
    #samify-launcher .pulse {
      position: absolute; inset: 0; border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(192,57,43,0.5);
      animation: pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite;
    }
    #samify-launcher.open .pulse { display: none; }
    @keyframes pulseRing {
      0% { box-shadow: 0 0 0 0 rgba(192,57,43,0.45); }
      70% { box-shadow: 0 0 0 18px rgba(192,57,43,0); }
      100% { box-shadow: 0 0 0 0 rgba(192,57,43,0); }
    }

    /* === WIDGET SHELL === */
    #samify-widget {
      position: fixed; bottom: 100px; right: 24px;
      width: 388px; height: 640px;
      border-radius: 18px;
      box-shadow: 0 12px 50px rgba(0,0,0,0.18), 0 2px 10px rgba(0,0,0,0.08);
      background: #fff;
      display: flex; flex-direction: column;
      overflow: hidden;
      transform: scale(0.92) translateY(16px);
      opacity: 0; pointer-events: none;
      transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease, width 0.3s ease, height 0.3s ease, bottom 0.3s ease;
      z-index: 9998;
    }
    #samify-widget.visible { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    #samify-widget.expanded { width: 540px; height: 800px; bottom: 24px; }
    @media (max-width: 580px) {
      #samify-widget { width: calc(100vw - 16px); right: 8px; }
      #samify-widget.expanded { width: calc(100vw - 16px); height: calc(100vh - 100px); right: 8px; }
    }

    /* === HEADER WRAP === unified brand zone with continuous red glow */
    .sw-header-wrap {
      position: relative;
      background: linear-gradient(180deg, var(--ink) 0%, var(--ink-2) 100%);
      flex-shrink: 0;
      overflow: hidden;
    }
    .sw-header-wrap::before {
      content: ''; position: absolute; top: -90px; right: -70px;
      width: 260px; height: 260px; border-radius: 50%;
      background: radial-gradient(circle, rgba(192,57,43,0.30) 0%, rgba(192,57,43,0.10) 35%, transparent 65%);
      pointer-events: none; z-index: 0;
    }
    .sw-header-wrap::after {
      content: ''; position: absolute; left: 0; bottom: 0; height: 2px; width: 100%;
      background: linear-gradient(90deg, var(--red) 0%, var(--red) 28%, transparent 28%);
      z-index: 2;
    }

    /* === HEADER === logo + status row */
    .sw-header {
      padding: 14px 18px 8px;
      display: flex; align-items: center; gap: 12px;
      z-index: 1; position: relative;
    }
    .sw-back {
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
      width: 30px; height: 30px; border-radius: 50%;
      display: none; align-items: center; justify-content: center;
      color: #fff; font-size: 17px; line-height: 1; transition: all 0.15s;
      flex-shrink: 0; padding: 0;
    }
    .sw-back.show { display: flex; }
    .sw-back:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.2); }

    /* Logo sits directly on the dark gradient — red Elkedjan logo pops naturally */
    .sw-logo-wrap {
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      padding: 0;
    }
    .sw-logo-wrap img {
      height: 32px; width: auto; display: block;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
    }

    .sw-header-right {
      display: flex; flex-direction: column; gap: 1px; min-width: 0;
      margin-left: auto; align-items: flex-end;
    }
    .sw-title {
      font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.9);
      letter-spacing: 0.04em; text-transform: uppercase;
    }
    .sw-status {
      font-size: 10px; color: rgba(255,255,255,0.55); display: flex;
      align-items: center; gap: 5px; font-weight: 600;
      letter-spacing: 0.04em;
    }
    .sw-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,0.9); animation: dotPulse 2s ease-in-out infinite; }
    @keyframes dotPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* === BRAND BAND === only visible on home */
    .sw-brand-band {
      padding: 4px 18px 14px;
      position: relative; z-index: 1;
      color: #fff;
    }
    #samify-widget:not(.is-home) .sw-brand-band { display: none; }
    .brand-band-title {
      font-size: 19px; font-weight: 900; line-height: 1.1;
      letter-spacing: -0.02em; margin-bottom: 12px;
    }
    .brand-band-title .red { color: var(--red); }
    .brand-band-stats {
      display: flex; gap: 14px;
      padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);
    }
    .brand-stat { flex: 1; }
    .brand-stat-num { font-weight: 800; font-size: 15px; line-height: 1; color: #fff; letter-spacing: -0.02em; }
    .brand-stat-lbl { font-weight: 600; font-size: 8.5px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-top: 4px; }

    /* === SCREEN AREA === warm cream w/ Olsfors-red accents */
    .sw-content { flex: 1; overflow: hidden; position: relative; min-height: 0; }
    .sw-screen {
      position: absolute; inset: 0;
      overflow-y: auto; overflow-x: hidden;
      background:
        radial-gradient(ellipse 320px 240px at 100% 100%, rgba(192,57,43,0.16) 0%, rgba(192,57,43,0.05) 26%, transparent 52%),
        radial-gradient(ellipse 200px 160px at 0% 100%, rgba(192,57,43,0.06) 0%, transparent 42%),
        radial-gradient(ellipse 200px 140px at 0% 0%, rgba(26,26,46,0.03) 0%, transparent 40%),
        linear-gradient(180deg, #faf7f3 0%, #f0eae3 100%);
      display: none; flex-direction: column;
    }
    .sw-screen.active { display: flex; }

    /* === SECTION TITLE === */
    .section-title { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
    .section-title-bar { height: 3px; width: 24px; background: var(--red); border-radius: 2px; }
    .section-title-text { font-weight: 800; font-size: 14px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text); }

    /* === BUTTONS === */
    .btn {
      width: 100%; padding: 10px 14px;
      border-radius: 9px;
      font-size: 13px; font-weight: 700; letter-spacing: 0.01em;
      cursor: pointer; border: 1.5px solid var(--ink);
      background: var(--ink); color: #fff;
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      text-decoration: none; transition: all 0.15s;
      box-sizing: border-box;
    }
    .btn:hover { background: var(--ink-2); transform: translateY(-1px); }
    .btn:active { transform: scale(0.98); }
    .btn.accent { background: var(--red); border-color: var(--red); }
    .btn.accent:hover { background: var(--red-dark); border-color: var(--red-dark); }
    .btn.success { background: #16a34a; border-color: #16a34a; color: #fff; }
    .btn.success:hover { background: #15803d; border-color: #15803d; }
    .btn.ghost { background: transparent; border: 1.5px solid var(--border-mid); color: var(--text); }
    .btn.ghost:hover { background: #fff; border-color: var(--ink); color: var(--ink); }
    .btn svg { width: 14px; height: 14px; }

    /* === HOME HERO === flows seamlessly from header */
    .home-hero {
      position: relative;
      background: linear-gradient(180deg, var(--ink) 0%, var(--ink-2) 100%);
      color: #fff;
      padding: 2px 18px 14px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .home-hero::before {
      content: ''; position: absolute; top: -60px; right: -50px;
      width: 180px; height: 180px; border-radius: 50%;
      background: radial-gradient(circle, rgba(192,57,43,0.22) 0%, transparent 65%);
      pointer-events: none;
    }
    .home-hero::after {
      content: ''; position: absolute; left: 0; bottom: 0; height: 2px; width: 100%;
      background: linear-gradient(90deg, var(--red) 0%, var(--red) 28%, transparent 28%);
    }
    .home-hero-title {
      font-size: 19px; font-weight: 900; line-height: 1.1;
      letter-spacing: -0.02em; margin-bottom: 12px;
      position: relative; z-index: 1;
    }
    .home-hero-title .red { color: var(--red); }
    .home-hero-stats {
      display: flex; gap: 14px;
      padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);
      position: relative; z-index: 1;
    }
    .home-hero-stat { flex: 1; }
    .home-hero-stat-num { font-weight: 800; font-size: 15px; line-height: 1; color: #fff; letter-spacing: -0.02em; }
    .home-hero-stat-lbl { font-weight: 600; font-size: 8.5px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-top: 4px; }

    /* === HOME GRID === asymmetric for visual rhythm */
    .home-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
    .tile-grid {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      grid-template-areas:
        "chat chat"
        "eldiagnos priser"
        "eldiagnos faq";
      gap: 8px;
    }
    .tile.area-chat { grid-area: chat; }
    .tile.area-eldiagnos { grid-area: eldiagnos; }
    .tile.area-priser { grid-area: priser; }
    .tile.area-faq { grid-area: faq; }

    .tile {
      position: relative;
      background: linear-gradient(180deg, #ffffff 0%, #fffaf7 100%);
      border: 1px solid rgba(192,57,43,0.10);
      border-radius: 12px; padding: 11px 12px;
      display: flex; flex-direction: column; align-items: flex-start;
      gap: 3px; cursor: pointer; text-align: left;
      transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
      font-family: inherit; color: inherit;
      box-shadow: 0 1px 2px rgba(20,20,32,0.03);
      overflow: hidden;
    }
    .tile::before {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 2px;
      background: var(--red);
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .tile:hover {
      border-color: var(--red);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(192,57,43,0.10), 0 2px 4px rgba(20,20,32,0.06);
    }
    .tile:hover::before { transform: scaleX(1); }
    .tile:active { transform: scale(0.98); }
    .tile-icon-wrap {
      width: 30px; height: 30px; border-radius: 8px;
      background: rgba(192,57,43,0.08);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 4px;
      transition: background 0.18s;
    }
    .tile:hover .tile-icon-wrap { background: var(--red); }
    .tile-icon-wrap svg { stroke: var(--red); transition: stroke 0.18s; opacity: 0.85; }
    .tile:hover .tile-icon-wrap svg { stroke: #fff; opacity: 1; }
    .tile-label { font-size: 12.5px; font-weight: 800; color: var(--text); letter-spacing: -0.005em; }
    .tile-sub { font-size: 10px; color: var(--text-dim); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    .tile-badge {
      position: absolute; top: 10px; right: 10px;
      font-size: 8.5px; font-weight: 800; background: var(--red); color: #fff;
      padding: 3px 7px; border-radius: 20px; letter-spacing: 0.08em;
    }

    /* Wide tile (full row) — used by FAQ */
    .tile.wide { flex-direction: row; align-items: center; gap: 12px; padding: 12px 14px; }
    .tile.wide .tile-icon-wrap { margin-bottom: 0; flex-shrink: 0; }
    .tile.wide-arrow { margin-left: auto; color: var(--text-dim); font-size: 18px; font-weight: 300; }

    /* Eldiagnos — tall featured tile, premium accent */
    .tile.area-eldiagnos {
      padding: 14px 14px 12px;
      gap: 4px;
      background:
        radial-gradient(circle at 100% 0%, rgba(192,57,43,0.08) 0%, transparent 55%),
        #fff;
      border-color: rgba(192,57,43,0.18);
    }
    .tile.area-eldiagnos:hover {
      border-color: var(--red);
      box-shadow: 0 6px 18px rgba(192,57,43,0.12), 0 2px 4px rgba(20,20,32,0.06);
    }
    .tile.area-eldiagnos .tile-icon-wrap {
      width: 36px; height: 36px; border-radius: 10px;
      background: rgba(192,57,43,0.10);
      margin-bottom: auto;
    }
    .tile.area-eldiagnos .tile-icon-wrap svg { stroke: var(--red); }
    .tile.area-eldiagnos:hover .tile-icon-wrap { background: var(--red); }
    .tile.area-eldiagnos:hover .tile-icon-wrap svg { stroke: #fff; }
    .tile.area-eldiagnos .tile-label { font-size: 14px; margin-top: 6px; }
    .tile.area-eldiagnos .tile-cta {
      font-size: 10.5px; font-weight: 800; color: var(--red);
      letter-spacing: 0.04em; text-transform: uppercase;
      margin-top: 6px; display: flex; align-items: center; gap: 4px;
    }

    /* Featured chat tile */
    .tile.featured {
      background: linear-gradient(135deg, var(--ink) 0%, var(--ink-2) 100%);
      border-color: var(--ink);
      color: #fff;
      flex-direction: row; align-items: center; gap: 14px;
      padding: 14px 16px;
      overflow: hidden;
    }
    .tile.featured::before {
      content: ''; position: absolute; top: -30px; right: -30px;
      width: 120px; height: 120px; border-radius: 50%;
      background: radial-gradient(circle, rgba(192,57,43,0.22) 0%, transparent 70%);
    }
    .tile.featured:hover { background: linear-gradient(135deg, #14152a 0%, #08091a 100%); border-color: var(--red); transform: translateY(-1px); }
    .tile.featured .tile-icon-wrap { background: rgba(255,255,255,0.1); width: 40px; height: 40px; }
    .tile.featured .tile-icon-wrap svg { stroke: #fff; }
    .tile.featured:hover .tile-icon-wrap { background: var(--red); }
    .tile.featured .tile-label { color: #fff; font-size: 14px; }
    .tile.featured .tile-sub { color: rgba(255,255,255,0.55); }
    .tile.featured .tile-content { flex: 1; min-width: 0; position: relative; z-index: 1; }
    .tile.featured .tile-arrow { margin-left: auto; color: rgba(255,255,255,0.5); font-size: 22px; font-weight: 300; position: relative; z-index: 1; }

    .tile-live { display: inline-flex; align-items: center; gap: 6px; margin-top: 4px; }
    .tile-live-dots { display: inline-flex; gap: 3px; align-items: center; }
    .tile-live-dot { width: 5px; height: 5px; background: #22c55e; border-radius: 50%; animation: chatPulse 1.4s ease-in-out infinite; }
    .tile-live-dot:nth-child(2) { animation-delay: 0.2s; }
    .tile-live-dot:nth-child(3) { animation-delay: 0.4s; }
    .tile-live-text { font-weight: 700; font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.7); }
    @keyframes chatPulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    /* === REVIEWS STRIP === */
    .reviews-strip {
      background: #fff; border: 1px solid var(--border); border-radius: 12px;
      padding: 11px 13px;
    }
    .reviews-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
    .reviews-rating { display: flex; align-items: center; gap: 7px; }
    .reviews-rating-num { font-size: 16px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
    .reviews-stars { display: inline-flex; gap: 1px; color: #f59e0b; }
    .reviews-stars svg { width: 12px; height: 12px; fill: currentColor; }
    .reviews-source { font-size: 9.5px; font-weight: 700; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; }
    .review-quote { font-size: 12px; color: var(--text-mute); line-height: 1.55; font-style: italic; }
    .review-author { font-size: 10.5px; font-weight: 700; color: var(--text); margin-top: 6px; }
    .review-author span { color: var(--text-dim); font-weight: 500; }

    /* === QUICK CTA === */
    .quick-cta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

    /* === INNER SCREENS === */
    .inner-body { padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 10px; }

    /* === CHAT === */
    #sw-chat zapier-interfaces-chatbot-embed { flex: 1; width: 100% !important; height: 100% !important; border: none; display: block; }

    /* === FAQ === */
    .faq-item { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: #fff; }
    .faq-q { width: 100%; text-align: left; background: none; border: none; padding: 13px 15px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; font-weight: 700; color: var(--text); transition: background 0.1s; gap: 10px; font-family: inherit; }
    .faq-q:hover { background: var(--bg); }
    .faq-chevron { flex-shrink: 0; transition: transform 0.2s; color: var(--text-dim); }
    .faq-item.open .faq-chevron { transform: rotate(180deg); }
    .faq-a { display: none; padding: 11px 15px 13px; font-size: 12px; color: var(--text-mute); line-height: 1.65; border-top: 1px solid var(--border); }
    .faq-item.open .faq-a { display: block; }

    /* === PRICING === */
    .price-toggle { display: flex; background: var(--border); border-radius: 8px; padding: 3px; margin-bottom: 10px; gap: 3px; }
    .price-toggle-btn { flex: 1; padding: 7px; border: none; background: transparent; border-radius: 6px; font-size: 11.5px; font-weight: 700; color: var(--text-mute); cursor: pointer; transition: all 0.15s; font-family: inherit; }
    .price-toggle-btn.active { background: var(--ink); color: #fff; }
    .price-set { display: none; }
    .price-set.active { display: block; }
    .price-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 14px; margin-bottom: 10px; }
    .price-card.featured { border-color: var(--red); border-width: 1.5px; }
    .price-badge { display: inline-block; font-size: 9.5px; font-weight: 800; background: var(--red); color: #fff; padding: 3px 9px; border-radius: 20px; margin-bottom: 8px; letter-spacing: 0.05em; }
    .price-tier { font-size: 9.5px; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
    .price-name { font-size: 16px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
    .price-amount { font-size: 19px; font-weight: 800; color: var(--ink); letter-spacing: -0.02em; }
    .price-amount span { font-size: 11px; font-weight: 500; color: var(--text-dim); }
    .price-note { font-size: 10.5px; color: var(--text-dim); margin-top: 5px; line-height: 1.5; }
    .price-features { margin-top: 10px; display: flex; flex-direction: column; gap: 5px; }
    .price-feature { font-size: 11.5px; color: var(--text-mute); display: flex; align-items: flex-start; gap: 7px; line-height: 1.4; }
    .price-feature::before { content: '✓'; color: var(--green); font-weight: 800; font-size: 11px; flex-shrink: 0; margin-top: 1px; }
    .price-cta { display: block; width: 100%; margin-top: 12px; padding: 10px; background: var(--ink); color: #fff; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 700; cursor: pointer; text-align: center; transition: background 0.15s; text-decoration: none; box-sizing: border-box; font-family: inherit; }
    .price-cta:hover { background: var(--ink-2); }
    .price-card.featured .price-cta { background: var(--red); }
    .price-card.featured .price-cta:hover { background: var(--red-dark); }

    /* === CONTACT === */
    .contact-card { background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 14px; }
    .contact-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .contact-av { width: 38px; height: 38px; border-radius: 50%; background: var(--bg-elev); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: var(--ink); flex-shrink: 0; }
    .contact-name { font-size: 13px; font-weight: 800; color: var(--text); }
    .contact-role { font-size: 11px; color: var(--text-dim); font-weight: 500; }
    .contact-links { display: flex; flex-direction: column; gap: 4px; }
    .contact-link { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-mute); text-decoration: none; padding: 7px 8px; border-radius: 7px; transition: background 0.1s; }
    .contact-link:hover { background: var(--bg); color: var(--text); }

    /* === ELDIAGNOS QUIZ === */
    .quiz-progress { display: flex; gap: 4px; margin-bottom: 16px; }
    .quiz-progress-step { flex: 1; height: 4px; background: var(--border); border-radius: 2px; transition: background 0.2s; }
    .quiz-progress-step.done { background: var(--ink); }
    .quiz-progress-step.current { background: var(--red); }
    .quiz-question { font-weight: 800; font-size: 17px; line-height: 1.2; letter-spacing: -0.015em; margin-bottom: 6px; color: var(--text); }
    .quiz-hint { color: var(--text-dim); font-size: 11.5px; line-height: 1.5; margin-bottom: 14px; font-weight: 500; }
    .quiz-options { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
    .quiz-option {
      display: flex; align-items: flex-start; gap: 10px;
      background: #fff; border: 1.5px solid var(--border);
      border-radius: 9px; padding: 11px 12px; cursor: pointer;
      text-align: left; font-family: inherit;
      transition: all 0.12s;
    }
    .quiz-option:hover { background: var(--bg-elev); border-color: var(--border-mid); }
    .quiz-option.selected { border-color: var(--red); background: #fff8f7; }
    .quiz-option-check {
      width: 18px; height: 18px; border-radius: 5px;
      border: 2px solid var(--border-mid); flex-shrink: 0;
      background: #fff; position: relative; margin-top: 1px;
      transition: all 0.12s;
    }
    .quiz-option.selected .quiz-option-check {
      border-color: var(--red); background: var(--red);
    }
    .quiz-option.selected .quiz-option-check::after {
      content: ''; position: absolute; left: 4px; top: 1px;
      width: 5px; height: 9px; border: solid #fff;
      border-width: 0 2px 2px 0; transform: rotate(45deg);
    }
    .quiz-option-body { flex: 1; min-width: 0; }
    .quiz-option-label { font-weight: 700; font-size: 12.5px; color: var(--text); letter-spacing: -0.005em; }
    .quiz-option-sub { font-size: 10.5px; color: var(--text-dim); margin-top: 2px; font-weight: 500; line-height: 1.4; }
    .quiz-nav { display: flex; gap: 6px; }
    .quiz-nav .btn { flex: 1; }

    .quiz-result-hero {
      background: #fff; border-radius: 12px; padding: 18px 16px;
      border-left: 4px solid var(--ink);
      border: 1px solid var(--border); border-left-width: 4px;
    }
    .quiz-result-hero.risk-high { border-left-color: var(--red); background: linear-gradient(135deg, #fff8f7 0%, #fff 100%); }
    .quiz-result-hero.risk-med { border-left-color: var(--amber); background: linear-gradient(135deg, #fffbeb 0%, #fff 100%); }
    .quiz-result-hero.risk-low { border-left-color: var(--green); background: linear-gradient(135deg, #f0fdf4 0%, #fff 100%); }
    .quiz-result-label { font-size: 9.5px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px; color: var(--text-dim); }
    .quiz-result-hero.risk-high .quiz-result-label { color: var(--red); }
    .quiz-result-hero.risk-med .quiz-result-label { color: var(--amber); }
    .quiz-result-hero.risk-low .quiz-result-label { color: var(--green); }
    .quiz-result-title { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 8px; line-height: 1.2; }
    .quiz-result-body { font-size: 12.5px; color: var(--text-mute); line-height: 1.6; }

    /* === OFFERT FORM === */
    .offert-intro {
      background: rgba(192,57,43,0.06);
      border: 1px solid rgba(192,57,43,0.15);
      border-radius: 9px; padding: 9px 12px;
      font-size: 11.5px; color: var(--text-mute); line-height: 1.5;
      margin-bottom: 12px; font-weight: 500;
      display: flex; align-items: center; gap: 8px;
    }
    .offert-intro svg { color: var(--red); flex-shrink: 0; }
    .form-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 9px; }
    .form-field-label {
      font-size: 9.5px; font-weight: 800;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--text-dim);
    }
    .form-field-label .req { color: var(--red); }
    .form-field-input {
      width: 100%; padding: 10px 12px;
      border: 1.5px solid var(--border-mid);
      border-radius: 8px;
      font-family: inherit; font-size: 13px; font-weight: 500;
      color: var(--text); background: #fff;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .form-field-input:focus { outline: none; border-color: var(--ink); box-shadow: 0 0 0 3px rgba(20,20,32,0.06); }
    .form-field-input.error { border-color: var(--red); box-shadow: 0 0 0 3px rgba(192,57,43,0.08); }
    .form-field-textarea { min-height: 78px; resize: vertical; line-height: 1.5; }

    .offert-summary {
      background: #fff; border: 1px solid var(--border);
      border-radius: 10px; padding: 4px 14px;
      margin-bottom: 12px;
    }
    .offert-summary-row {
      display: flex; justify-content: space-between; align-items: baseline;
      padding: 9px 0; gap: 12px;
      border-bottom: 1px solid var(--border);
    }
    .offert-summary-row:last-child { border-bottom: none; }
    .offert-summary-row-key {
      color: var(--text-dim); font-weight: 700;
      text-transform: uppercase; font-size: 9px; letter-spacing: 0.12em;
      flex-shrink: 0;
    }
    .offert-summary-row-val {
      color: var(--text); font-weight: 700; text-align: right;
      font-size: 12px;
    }

    /* === PROCESS STEPS === */
    .process-step {
      display: flex; gap: 12px; padding: 12px 14px;
      background: #fff; border: 1px solid var(--border);
      border-radius: 10px;
    }
    .process-step-num {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--ink); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 800; flex-shrink: 0;
    }
    .process-step.featured .process-step-num { background: var(--red); }
    .process-step-body { flex: 1; }
    .process-step-title { font-size: 13px; font-weight: 800; color: var(--text); margin-bottom: 3px; }
    .process-step-desc { font-size: 11.5px; color: var(--text-mute); line-height: 1.5; }

    /* === INFO ROW (used in result/booking) === */
    .info-row {
      display: flex; gap: 12px; align-items: flex-start;
      background: #fff; border: 1px solid var(--border);
      border-radius: 10px; padding: 12px 14px;
    }
    .info-row-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--bg-elev);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; color: var(--ink);
    }
    .info-row-content { flex: 1; }
    .info-row-label { font-size: 9.5px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 3px; }
    .info-row-value { font-size: 13px; font-weight: 800; color: var(--text); }
    .info-row-sub { font-size: 11.5px; color: var(--text-mute); margin-top: 3px; line-height: 1.5; }

    /* === TOOLTIP === */
    #samify-tooltip {
      position: fixed; bottom: 100px; right: 24px;
      background: var(--ink); color: #fff;
      padding: 14px 32px 14px 16px; border-radius: 16px 16px 4px 16px;
      font-size: 13px; font-weight: 500; line-height: 1.55;
      max-width: 260px; cursor: pointer;
      box-shadow: 0 8px 28px rgba(0,0,0,0.22);
      opacity: 0; transform: translateY(8px) scale(0.95);
      transition: opacity 0.3s ease, transform 0.3s ease;
      z-index: 9999; pointer-events: all;
    }
    #samify-tooltip.show { opacity: 1; transform: translateY(0) scale(1); }
    #samify-tooltip::after {
      content: ''; position: absolute; bottom: -8px; right: 20px;
      border-left: 8px solid transparent; border-right: 8px solid transparent;
      border-top: 8px solid var(--ink);
    }
    #samify-tooltip-close { position: absolute; top: 6px; right: 8px; background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 13px; line-height: 1; padding: 4px; }
    #samify-tooltip-close:hover { color: #fff; }

    /* === FOOTER === */
    .sw-footer {
      padding: 9px 14px; border-top: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; background: #fff; z-index: 2; position: relative;
    }
    .sw-footer a { font-size: 11px; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 5px; font-weight: 700; letter-spacing: 0.02em; transition: opacity 0.15s; }
    .sw-footer a:hover { opacity: 0.65; }
    .sw-pdot { width: 6px; height: 6px; border-radius: 50%; background: #7c3aed; display: inline-block; }

    /* Scrollbar polish */
    .sw-screen::-webkit-scrollbar { width: 6px; }
    .sw-screen::-webkit-scrollbar-thumb { background: var(--border-mid); border-radius: 3px; }
    .sw-screen::-webkit-scrollbar-track { background: transparent; }

    /* === MOBILE === smaller phones / tighter touch */
    @media (max-width: 480px) {
      #samify-launcher { right: 14px; bottom: 14px; width: 56px; height: 56px; }
      #samify-launcher svg.si-chat { width: 22px; height: 22px; }

      #samify-widget {
        width: calc(100vw - 12px); right: 6px;
        bottom: 80px; height: calc(100vh - 100px); max-height: calc(100vh - 100px);
      }
      #samify-widget.expanded {
        width: calc(100vw - 12px); right: 6px;
        bottom: 80px; height: calc(100vh - 100px);
      }

      #samify-tooltip {
        right: 14px; bottom: 78px;
        max-width: calc(100vw - 28px);
        font-size: 12.5px; padding: 12px 30px 12px 14px;
      }

      .sw-header { padding: 12px 14px 6px; gap: 10px; }
      .sw-logo-wrap img { height: 28px; }
      .sw-title { font-size: 10px; letter-spacing: 0.03em; }
      .sw-status { font-size: 9.5px; }
      .sw-back { width: 28px; height: 28px; }

      .sw-brand-band { padding: 2px 14px 12px; }
      .brand-band-title { font-size: 17px; line-height: 1.12; margin-bottom: 10px; }
      .brand-band-stats { gap: 10px; padding-top: 9px; }
      .brand-stat-num { font-size: 14px; }
      .brand-stat-lbl { font-size: 8px; letter-spacing: 0.12em; }

      .home-body { padding: 10px; gap: 8px; }
      .tile-grid { gap: 6px; }
      .tile { padding: 10px 11px; min-height: 56px; }
      .tile-icon-wrap { width: 28px; height: 28px; }
      .tile-icon-wrap svg { width: 16px; height: 16px; }
      .tile.featured { padding: 12px 14px; }
      .tile.featured .tile-icon-wrap { width: 36px; height: 36px; }
      .tile.area-eldiagnos { padding: 12px 12px 10px; }
      .tile.area-eldiagnos .tile-icon-wrap { width: 32px; height: 32px; }
      .tile-label { font-size: 12px; }
      .tile-sub { font-size: 9.5px; }

      .reviews-strip { padding: 10px 12px; }
      .review-quote { font-size: 11.5px; }
      .quick-cta { gap: 6px; }
      .btn { padding: 11px 12px; font-size: 12.5px; }

      .inner-body { padding: 14px; gap: 9px; }
      .quiz-question { font-size: 16px; }
      .quiz-option { padding: 10px 11px; }
      .form-field-input { font-size: 13px; padding: 10px 11px; }

      .price-card { padding: 12px; }
      .price-name { font-size: 15px; }
      .price-amount { font-size: 17px; }
    }

    /* === SMALL DEVICES === fall back to single-column grid */
    @media (max-width: 360px) {
      .tile-grid {
        grid-template-columns: 1fr;
        grid-template-areas:
          "chat"
          "eldiagnos"
          "priser"
          "faq";
      }
      .tile.area-eldiagnos { padding: 12px 14px; }
      .brand-band-stats { gap: 8px; }
      .brand-stat-lbl { font-size: 7.5px; }
    }
  `;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'samify-widget-container';
  wrap.style.cssText = 'position:fixed;bottom:0;right:0;width:0;height:0;overflow:visible;z-index:9997;';
  wrap.innerHTML = `
    <button id="samify-launcher" onclick="swToggle()" aria-label="Öppna support">
      <span class="pulse"></span>
      <svg class="si-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="si-close" style="display:none" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div id="samify-widget" class="is-home">
      <div class="sw-header-wrap">
        <div class="sw-header" id="sw-header">
          <button class="sw-back" id="sw-back" onclick="swGoHome()">‹</button>
          <div class="sw-logo-wrap">
            <img src="https://static.wixstatic.com/media/fe5ae4_284ae9bd99a84c3eb1101ed27d9f7a2f~mv2.png/v1/crop/x_1,y_0,w_258,h_98/fill/w_183,h_70,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RGB_Logo_R%C3%B6d_elkedjan.png" alt="Olsfors Elektriska" />
          </div>
          <div class="sw-header-right">
            <div class="sw-title" id="sw-header-title">OLSFORS ELEKTRISKA</div>
            <div class="sw-status"><span class="sw-dot"></span> Online · svar inom 1 min</div>
          </div>
        </div>
        <div class="sw-brand-band">
          <div class="brand-band-title">Trygg el sedan <span class="red">1963</span> i Bollebygd.</div>
          <div class="brand-band-stats">
            <div class="brand-stat">
              <div class="brand-stat-num">60+</div>
              <div class="brand-stat-lbl">år i branschen</div>
            </div>
            <div class="brand-stat">
              <div class="brand-stat-num">EIO</div>
              <div class="brand-stat-lbl">auktoriserad</div>
            </div>
            <div class="brand-stat">
              <div class="brand-stat-num">4,8★</div>
              <div class="brand-stat-lbl">på reco.se</div>
            </div>
          </div>
        </div>
      </div>

      <div class="sw-content">

        <!-- HOME -->
        <div class="sw-screen active" id="sw-home">
          <div class="home-body">

            <div class="tile-grid">
              <!-- Featured: chatbot -->
              <button class="tile featured area-chat" onclick="swNav('sw-chat','Chatta med oss')">
                <div class="tile-icon-wrap">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div class="tile-content">
                  <div class="tile-label">Fråga oss direkt</div>
                  <div class="tile-live">
                    <span class="tile-live-dots">
                      <span class="tile-live-dot"></span>
                      <span class="tile-live-dot"></span>
                      <span class="tile-live-dot"></span>
                    </span>
                    <span class="tile-live-text">AI-assistent · live nu</span>
                  </div>
                </div>
                <div class="tile-arrow">›</div>
              </button>

              <!-- Eldiagnos: tall featured card -->
              <button class="tile area-eldiagnos" onclick="swNav('sw-eldiagnos','Eldiagnos')">
                <span class="tile-badge">2 MIN</span>
                <div class="tile-icon-wrap">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <div class="tile-label">Eldiagnos</div>
                <div class="tile-sub">4 frågor om er el</div>
                <div class="tile-cta">Gratis riskanalys ›</div>
              </button>

              <!-- Priser & offert (top right) -->
              <button class="tile area-priser" onclick="swNavPricer('laddbox')">
                <div class="tile-icon-wrap"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                <div class="tile-label">Priser & offert</div>
                <div class="tile-sub">Fr. 7 750 kr</div>
              </button>

              <!-- FAQ (bottom right) -->
              <button class="tile area-faq" onclick="swNav('sw-faq','Vanliga frågor')">
                <div class="tile-icon-wrap"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <div class="tile-label">Vanliga frågor</div>
                <div class="tile-sub">Snabba svar</div>
              </button>
            </div>

            <!-- Reviews -->
            <div class="reviews-strip">
              <div class="reviews-head">
                <div class="reviews-rating">
                  <span class="reviews-rating-num">4,8</span>
                  <span class="reviews-stars">
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </span>
                </div>
                <a href="https://www.reco.se/olsfors-elektriska-ab" target="_blank" rel="noopener" class="reviews-source" style="text-decoration:none;">reco.se ›</a>
              </div>
              <div class="review-quote" id="review-quote">"Snabba, kunniga och prisvärda. Hjälpte oss med laddbox på två dagar — och förklarade allt på vägen."</div>
              <div class="review-author" id="review-author">Anna L. <span>· Bollebygd</span></div>
            </div>

            <div class="quick-cta">
              <button class="btn accent" onclick="swNav('sw-contact','Kontakt')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Kontakt
              </button>
              <button class="btn success" onclick="swNavPricer('offert')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Skicka förfrågan
              </button>
            </div>

          </div>
        </div>

        <!-- CHAT -->
        <div class="sw-screen" id="sw-chat">
          <zapier-interfaces-chatbot-embed
            is-popup="false"
            chatbot-id="cmmytkwgn00b31339vxo0x9yx"
            height="100%"
            width="100%"
          ></zapier-interfaces-chatbot-embed>
        </div>

        <!-- ELDIAGNOS (NEW) -->
        <div class="sw-screen" id="sw-eldiagnos">
          <div class="inner-body" id="eldiagnos-body"></div>
        </div>

        <!-- FAQ -->
        <div class="sw-screen" id="sw-faq">
          <div class="inner-body">
            <div class="section-title">
              <div class="section-title-bar"></div>
              <div class="section-title-text">Vanliga frågor</div>
            </div>
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

        <!-- PRICING -->
        <div class="sw-screen" id="sw-pricing">
          <div class="inner-body">
            <div class="section-title">
              <div class="section-title-bar"></div>
              <div class="section-title-text">Priser & offert</div>
            </div>
            <div class="price-toggle">
              <button class="price-toggle-btn active" data-tab="laddbox" onclick="swPricingTab('laddbox',this)">Laddbox</button>
              <button class="price-toggle-btn" data-tab="sakerhet" onclick="swPricingTab('sakerhet',this)">Säkerhet</button>
              <button class="price-toggle-btn" data-tab="offert" onclick="swPricingTab('offert',this)">Offert</button>
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
                <button class="price-cta" onclick="swNav('sw-laddbox-offer','Laddbox')">Läs mer om laddbox →</button>
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

            <div id="sw-price-offert" class="price-set"></div>
          </div>
        </div>

        <!-- LADDBOX ERBJUDANDE -->
        <div class="sw-screen" id="sw-laddbox-offer">
          <div class="inner-body">
            <div class="section-title">
              <div class="section-title-bar"></div>
              <div class="section-title-text">Laddbox · vårt erbjudande</div>
            </div>
            <a href="https://www.olsforsel.se/laddbox" target="_blank" style="display:block;border-radius:12px;overflow:hidden;border:1px solid var(--border);">
              <img
                src="https://static.wixstatic.com/media/fe5ae4_8d6c80a85b29435687eae9b1b8aa4696~mv2.png/v1/fill/w_496,h_389,fp_0.50_0.43,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3box.png"
                alt="Laddbox erbjudande"
                style="width:100%;height:auto;display:block;transition:opacity 0.15s;"
                onmouseover="this.style.opacity='0.9'"
                onmouseout="this.style.opacity='1'"
              />
            </a>
            <div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:10px;">
              <div style="font-size:10px;font-weight:800;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;line-height:1.5;">Laddbox med dynamisk lastbalansering, installerad och klar</div>
              <div style="font-size:22px;font-weight:800;color:var(--red);letter-spacing:-0.02em;">Från 7 750:-<span style="font-size:11px;color:var(--text-dim);font-weight:500;">*</span></div>
              <div style="font-size:12.5px;font-weight:800;color:var(--text);">Körklar med snabb och säker laddning!</div>
              <div style="font-size:12px;color:var(--text-mute);line-height:1.65;">Vi installerar laddboxar som uppfyller alla krav för att nyttja skatteavdraget för grön teknik. Det innebär att du kan få <strong>50% i prisavdrag</strong> för arbete och material direkt på fakturan.</div>
              <div style="font-size:10.5px;color:var(--text-dim);line-height:1.5;border-top:1px solid var(--border);padding-top:8px;">*Priset 7 750:- är med 50% avdrag på fakturan.</div>
            </div>
            <a href="https://www.olsforsel.se/laddbox" target="_blank" class="btn">
              Gå till laddbox-sidan →
            </a>
          </div>
        </div>

        <!-- CONTACT -->
        <div class="sw-screen" id="sw-contact">
          <div class="inner-body">
            <div class="section-title">
              <div class="section-title-bar"></div>
              <div class="section-title-text">Kontakta oss</div>
            </div>
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
              <div style="font-size:11px;font-weight:800;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:8px;">Adress</div>
              <div style="font-size:12.5px;color:var(--text-mute);line-height:1.8;">
                Boråsvägen 16<br>
                517 71 Olsfors<br>
                <span style="font-size:11px;color:var(--text-dim);">Org.nr 556149-4138</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="sw-footer">
        <a href="https://samify.se" target="_blank">
          <span style="font-size:10px;font-weight:700;color:var(--text-dim);letter-spacing:0.03em;">Powered By</span>
          <img src="https://samify.se/wp-content/uploads/go-x/u/7c566770-2e09-4b98-98b8-c4afcbbeeeaa/image-160x62.png" alt="Samify" style="height:16px;width:auto;display:block;" />
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

  // ===== ELDIAGNOS QUIZ DATA =====
  var ELDIAGNOS_QS = [
    {
      key: 'age',
      q: 'Hur gammal är fastighetens elinstallation?',
      hint: 'Räkna från senaste totalrenovering om sådan gjorts.',
      options: [
        { v: 'old',     label: 'Före 1985',           sub: 'Sannolikt original eller ej moderniserad', w: 4 },
        { v: 'mid',     label: '1985 – 2005',         sub: 'Mellangenerations installation', w: 2 },
        { v: 'new',     label: 'Efter 2005',          sub: 'Modern standard', w: 0 },
        { v: 'unknown', label: 'Vet ej',              sub: 'Vi hjälper dig kontrollera', w: 2 }
      ]
    },
    {
      key: 'central',
      q: 'Vilken typ av elcentral har du?',
      hint: 'Titta på säkringarna i centralen.',
      options: [
        { v: 'plug',    label: 'Proppsäkringar',      sub: 'Skruvbara porslinssäkringar', w: 4 },
        { v: 'auto',    label: 'Automatsäkringar',    sub: 'Vippbara plastsäkringar', w: 1 },
        { v: 'modern',  label: 'Modern central med jordfelsbrytare', sub: 'Senaste standarden', w: 0 },
        { v: 'unknown', label: 'Vet ej',              sub: 'Vi kollar gärna', w: 2 }
      ]
    },
    {
      key: 'symptoms',
      q: 'Har du sett något av detta?',
      hint: 'Markera alla som stämmer — eller "Inga".',
      multi: true,
      options: [
        { v: 'flicker',  label: 'Blinkande lampor',           sub: 'Speciellt vid hög belastning', w: 2 },
        { v: 'tripping', label: 'Säkringar löser ut',         sub: 'Återkommande utlösningar', w: 3 },
        { v: 'warm',     label: 'Varma kontakter / stickproppar', sub: 'Märkbart varma vid drift', w: 4 },
        { v: 'smell',    label: 'Brännlukt eller rök',        sub: 'Akut symptom — agera direkt', w: 6 },
        { v: 'shock',    label: 'Stötar / kittlande känsla',  sub: 'Vid beröring av apparater', w: 5 },
        { v: 'none',     label: 'Inga av ovanstående',        sub: '', w: 0 }
      ]
    },
    {
      key: 'plans',
      q: 'Funderar du på något av detta framöver?',
      hint: 'Vi hjälper dig planera — markera allt som passar.',
      multi: true,
      options: [
        { v: 'ev',       label: 'Skaffa elbil / laddbox',     sub: 'Vi installerar laddbox från 7 750 kr', w: 0 },
        { v: 'solar',    label: 'Solceller',                  sub: 'Planering till driftsättning', w: 0 },
        { v: 'reno',     label: 'Renovera / bygga om',        sub: 'Eldragning och nya kretsar', w: 0 },
        { v: 'security', label: 'Larm / övervakning',         sub: 'Säkerhetsinstallation', w: 0 },
        { v: 'none',     label: 'Inget akut just nu',         sub: '', w: 0 }
      ]
    }
  ];

  var quizState = { step: 0, answers: {}, error: false };

  function quizScore() {
    var score = 0;
    ELDIAGNOS_QS.forEach(function(q) {
      var a = quizState.answers[q.key];
      if (q.multi) {
        (a || []).forEach(function(v) {
          var opt = q.options.find(function(o) { return o.v === v; });
          if (opt) score += opt.w;
        });
      } else {
        var opt = q.options.find(function(o) { return o.v === a; });
        if (opt) score += opt.w;
      }
    });
    return score;
  }

  function quizResult(score) {
    if (score >= 7) return {
      risk: 'high', label: 'Bör åtgärdas',
      title: 'Vänta inte — boka en kontroll.',
      msg: 'Dina svar pekar på flera tecken på åldrade eller överbelastade installationer. Det kan vara brandrisk. Vi gör en gratis kontroll och säger exakt vad som behöver åtgärdas — utan bindning.',
      cta: 'Ring oss direkt',
      ctaPrimary: 'phone'
    };
    if (score >= 3) return {
      risk: 'med', label: 'Värt en koll',
      title: 'Låt oss titta på det.',
      msg: 'Inget alarmerande — men dina svar tyder på att en översyn vore klok. Vi kommer förbi, kollar elcentralen och ger dig en ärlig bedömning. Kostar inget.',
      cta: 'Boka kontroll',
      ctaPrimary: 'booking'
    };
    return {
      risk: 'low', label: 'Inget akut',
      title: 'Din el ser ut att vara i gott skick.',
      msg: 'Inga tydliga riskindikatorer i dina svar. Tänk på att en periodisk besiktning vart 10–15:e år är god praxis. Hör av dig om något ändras — vi finns här.',
      cta: 'Spara våra uppgifter',
      ctaPrimary: 'contact'
    };
  }

  function renderQuiz() {
    var body = document.getElementById('eldiagnos-body');
    if (!body) return;

    // Result screen
    if (quizState.step >= ELDIAGNOS_QS.length) {
      var score = quizScore();
      var res = quizResult(score);
      var primaryBtn = '';
      if (res.ctaPrimary === 'phone') {
        primaryBtn = '<a href="tel:033295332" class="btn accent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' + res.cta + '</a>'
          + '<button class="btn ghost" data-pricer="offert">Eller skicka förfrågan</button>';
      } else if (res.ctaPrimary === 'booking') {
        primaryBtn = '<button class="btn accent" data-pricer="offert">' + res.cta + '</button>';
      } else {
        primaryBtn = '<button class="btn accent" data-nav="sw-contact" data-title="Kontakt">' + res.cta + '</button>';
      }

      body.innerHTML = ''
        + '<div class="section-title"><div class="section-title-bar"></div><div class="section-title-text">Eldiagnos</div></div>'
        + '<div class="quiz-progress">'
          + ELDIAGNOS_QS.map(function() { return '<div class="quiz-progress-step done"></div>'; }).join('')
        + '</div>'
        + '<div class="quiz-result-hero risk-' + res.risk + '">'
          + '<div class="quiz-result-label">' + res.label + '</div>'
          + '<div class="quiz-result-title">' + res.title + '</div>'
          + '<div class="quiz-result-body">' + res.msg + '</div>'
        + '</div>'
        + '<div class="info-row">'
          + '<div class="info-row-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>'
          + '<div class="info-row-content">'
            + '<div class="info-row-label">Nästa steg</div>'
            + '<div class="info-row-value">Gratis besiktning på plats</div>'
            + '<div class="info-row-sub">Vi kommer hem, kollar din el och ger ärlig bedömning. Inga dolda kostnader.</div>'
          + '</div>'
        + '</div>'
        + '<div style="display:flex;flex-direction:column;gap:6px;">' + primaryBtn + '<button class="btn ghost" onclick="swQuizReset()">Gör om testet</button></div>';

      // Wire result CTAs
      body.querySelectorAll('[data-nav]').forEach(function(b) {
        b.addEventListener('click', function() {
          swNav(b.getAttribute('data-nav'), b.getAttribute('data-title'));
        });
      });
      body.querySelectorAll('[data-pricer]').forEach(function(b) {
        b.addEventListener('click', function() {
          swNavPricer(b.getAttribute('data-pricer'));
        });
      });
      return;
    }

    // Question screen
    var q = ELDIAGNOS_QS[quizState.step];
    var selected = quizState.answers[q.key] || (q.multi ? [] : null);
    var isLast = quizState.step === ELDIAGNOS_QS.length - 1;

    var optsHtml = q.options.map(function(opt) {
      var isSel = q.multi ? selected.indexOf(opt.v) !== -1 : selected === opt.v;
      return ''
        + '<button class="quiz-option ' + (isSel ? 'selected' : '') + '" data-v="' + opt.v + '">'
          + '<div class="quiz-option-check"></div>'
          + '<div class="quiz-option-body">'
            + '<div class="quiz-option-label">' + opt.label + '</div>'
            + (opt.sub ? '<div class="quiz-option-sub">' + opt.sub + '</div>' : '')
          + '</div>'
        + '</button>';
    }).join('');

    var progressHtml = ELDIAGNOS_QS.map(function(_, i) {
      var cls = i < quizState.step ? 'done' : i === quizState.step ? 'current' : '';
      return '<div class="quiz-progress-step ' + cls + '"></div>';
    }).join('');

    body.innerHTML = ''
      + '<div class="section-title"><div class="section-title-bar"></div><div class="section-title-text">Eldiagnos · steg ' + (quizState.step + 1) + '/' + ELDIAGNOS_QS.length + '</div></div>'
      + '<div class="quiz-progress">' + progressHtml + '</div>'
      + '<div class="quiz-question">' + q.q + '</div>'
      + '<div class="quiz-hint">' + q.hint + '</div>'
      + '<div class="quiz-options">' + optsHtml + '</div>'
      + '<div class="quiz-nav">'
        + (quizState.step > 0 ? '<button class="btn ghost" onclick="swQuizBack()">← Tillbaka</button>' : '')
        + '<button class="btn accent" onclick="swQuizNext()" style="' + (quizState.error ? 'background:var(--red-dark);' : '') + '">'
          + (quizState.error ? 'Välj ett alternativ' : (isLast ? 'Se resultat' : 'Nästa →'))
        + '</button>'
      + '</div>';

    // Wire option clicks
    body.querySelectorAll('.quiz-option').forEach(function(el) {
      el.addEventListener('click', function() {
        var v = el.getAttribute('data-v');
        quizToggleOption(q, v);
      });
    });
  }

  function quizToggleOption(q, v) {
    quizState.error = false;
    if (q.multi) {
      var arr = quizState.answers[q.key] || [];
      if (v === 'none') {
        arr = arr.indexOf('none') !== -1 ? [] : ['none'];
      } else {
        arr = arr.filter(function(x) { return x !== 'none'; });
        arr = arr.indexOf(v) !== -1 ? arr.filter(function(x) { return x !== v; }) : arr.concat([v]);
      }
      quizState.answers[q.key] = arr;
    } else {
      quizState.answers[q.key] = v;
    }
    renderQuiz();
  }

  function swQuizNext() {
    var q = ELDIAGNOS_QS[quizState.step];
    var a = quizState.answers[q.key];
    var has = q.multi ? (a || []).length > 0 : !!a;
    if (!has) {
      quizState.error = true;
      renderQuiz();
      setTimeout(function() { quizState.error = false; renderQuiz(); }, 1100);
      return;
    }
    quizState.step++;
    renderQuiz();
  }

  function swQuizBack() {
    if (quizState.step > 0) { quizState.step--; renderQuiz(); }
  }

  function swQuizReset() {
    quizState = { step: 0, answers: {}, error: false };
    renderQuiz();
  }

  // ===== OFFERT FLOW =====
  var OFFERT_FLOW = {
    start: {
      type: 'choice',
      q: 'Vad gäller det?',
      hint: 'Välj kategori — vi anpassar följdfrågorna efter ditt val.',
      field: 'kategori',
      options: [
        { v: 'laddbox',   label: 'Laddbox',           sub: 'Hemmaladdning eller flerfordon',   next: 'laddbox_typ' },
        { v: 'solceller', label: 'Solceller',         sub: 'Planering och installation',       next: 'solceller_typ' },
        { v: 'el',        label: 'Elinstallation',    sub: 'Felsökning, renovering, nybygge',  next: 'el_typ' },
        { v: 'sakerhet',  label: 'Säkerhet & kamera', sub: 'Övervakning eller larm',           next: 'sakerhet_typ' },
        { v: 'industri',  label: 'Industri / företag',sub: 'Entreprenad eller service',        next: 'industri_typ' },
        { v: 'annat',     label: 'Annat',             sub: 'Beskriv själv vad du behöver',     next: 'beskriv' }
      ]
    },
    laddbox_typ: {
      type: 'choice', q: 'För vem?', field: 'typ',
      options: [
        { v: 'villa',   label: 'Villa / privat', sub: 'En laddbox',                    next: 'urgens' },
        { v: 'brf',     label: 'BRF',            sub: 'Flera platser med lastbalansering', next: 'urgens' },
        { v: 'foretag', label: 'Företag',        sub: 'Anställda eller kundparkering', next: 'urgens' }
      ]
    },
    solceller_typ: {
      type: 'choice', q: 'Vilken typ av fastighet?', field: 'typ',
      options: [
        { v: 'villa',   label: 'Villa / privat',     sub: 'Småhus eller fritidsbostad', next: 'urgens' },
        { v: 'foretag', label: 'Företag / fastighet', sub: 'Industri- eller flerbostadshus', next: 'urgens' }
      ]
    },
    el_typ: {
      type: 'choice', q: 'Vad behöver du hjälp med?', field: 'typ',
      options: [
        { v: 'felsok',     label: 'Felsökning',         sub: 'Något fungerar inte', next: 'urgens' },
        { v: 'renovering', label: 'Renovering / utbyggnad', sub: 'Nya kretsar eller dragning', next: 'urgens' },
        { v: 'nybygge',    label: 'Nybyggnation',       sub: 'Hela installationer', next: 'urgens' },
        { v: 'central',    label: 'Byte av elcentral',  sub: 'Modernisering / jordfelsbrytare', next: 'urgens' }
      ]
    },
    sakerhet_typ: {
      type: 'choice', q: 'Vad ska skyddas?', field: 'typ',
      options: [
        { v: 'bostad',  label: 'Bostad',              sub: 'Villa eller lägenhet', next: 'urgens' },
        { v: 'foretag', label: 'Företag / verksamhet', sub: 'Lokaler eller butik',  next: 'urgens' },
        { v: 'utomhus', label: 'Utomhus / fastighet', sub: 'Större område',         next: 'urgens' }
      ]
    },
    industri_typ: {
      type: 'choice', q: 'Vilken typ av uppdrag?', field: 'typ',
      options: [
        { v: 'entreprenad', label: 'Entreprenad',        sub: 'Nybyggnation eller om-/tillbyggnad', next: 'urgens' },
        { v: 'service',     label: 'Service / underhåll', sub: 'Apparatskåp, maskinservice',         next: 'urgens' },
        { v: 'felsok',      label: 'Felsökning',          sub: 'Driftstopp eller akuta fel',          next: 'urgens' }
      ]
    },
    urgens: {
      type: 'choice', q: 'Hur snabbt behöver det ske?', field: 'urgens',
      options: [
        { v: 'akut',   label: 'Akut',                sub: 'Behöver hjälp omgående',     next: 'beskriv' },
        { v: 'snart',  label: 'Inom någon vecka',    sub: '',                            next: 'beskriv' },
        { v: 'planer', label: 'Inom 1–3 månader',    sub: 'Vi planerar i lugn takt',    next: 'beskriv' },
        { v: 'orient', label: 'Bara orientering',    sub: 'Vill veta pris just nu',     next: 'beskriv' }
      ]
    },
    beskriv: {
      type: 'text', q: 'Berätta lite mer',
      hint: 'Valfritt — storlek, plats eller annat som hjälper oss ge bättre offert.',
      field: 'beskrivning',
      placeholder: 'T.ex. "Volvo XC40 Recharge, garage ca 4m från elcentral"',
      next: 'kontakt'
    },
    kontakt: {
      type: 'contact', q: 'Vart återkommer vi?',
      hint: 'Vi hör av oss inom samma dag.',
      fields: [
        { key: 'namn',    label: 'Namn',                    type: 'text',  required: true },
        { key: 'telefon', label: 'Telefon',                  type: 'tel',   required: true },
        { key: 'email',   label: 'Mejl (valfritt)',          type: 'email', required: false },
        { key: 'ort',     label: 'Ort / postnummer (valfritt)', type: 'text', required: false }
      ],
      next: 'klar'
    },
    klar: { type: 'done' }
  };

  var OFFERT_LABELS = {
    kategori: 'Kategori', typ: 'Typ', urgens: 'Tidshorisont',
    beskrivning: 'Beskrivning', namn: 'Namn', telefon: 'Telefon',
    email: 'Mejl', ort: 'Ort'
  };
  var OFFERT_PRETTY = {
    kategori: { laddbox: 'Laddbox', solceller: 'Solceller', el: 'Elinstallation', sakerhet: 'Säkerhet & kamera', industri: 'Industri / företag', annat: 'Annat' },
    typ: {
      villa: 'Villa / privat', brf: 'BRF', foretag: 'Företag',
      felsok: 'Felsökning', renovering: 'Renovering / utbyggnad', nybygge: 'Nybyggnation', central: 'Byte av elcentral',
      bostad: 'Bostad', utomhus: 'Utomhus / fastighet',
      entreprenad: 'Entreprenad', service: 'Service / underhåll'
    },
    urgens: { akut: 'Akut', snart: 'Inom någon vecka', planer: 'Inom 1–3 månader', orient: 'Bara orientering' }
  };

  var OFFERT_STATE = { step: 'start', history: [], answers: {} };

  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function offertPretty(field, val) {
    if (OFFERT_PRETTY[field] && OFFERT_PRETTY[field][val]) return OFFERT_PRETTY[field][val];
    return val;
  }

  function renderOffert() {
    var pane = document.getElementById('sw-price-offert');
    if (!pane) return;
    var s = OFFERT_FLOW[OFFERT_STATE.step];
    if (!s) return;

    if (s.type === 'done') return renderOffertDone(pane);

    var html = ''
      + '<div class="offert-intro">'
        + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
        + 'Bara några snabba frågor — vi återkommer samma dag.'
      + '</div>';

    html += '<div class="quiz-question">' + escHtml(s.q) + '</div>';
    if (s.hint) html += '<div class="quiz-hint">' + escHtml(s.hint) + '</div>';

    if (s.type === 'choice') {
      html += '<div class="quiz-options">';
      s.options.forEach(function(opt) {
        var isSel = OFFERT_STATE.answers[s.field] === opt.v;
        html += '<button class="quiz-option ' + (isSel ? 'selected' : '') + '" data-choice="' + escHtml(opt.v) + '">';
        html += '<div class="quiz-option-check"></div>';
        html += '<div class="quiz-option-body">';
        html += '<div class="quiz-option-label">' + escHtml(opt.label) + '</div>';
        if (opt.sub) html += '<div class="quiz-option-sub">' + escHtml(opt.sub) + '</div>';
        html += '</div></button>';
      });
      html += '</div>';
    } else if (s.type === 'text') {
      html += '<div class="form-field">';
      html += '<textarea class="form-field-input form-field-textarea" id="offert-text" placeholder="' + escHtml(s.placeholder || '') + '">' + escHtml(OFFERT_STATE.answers[s.field] || '') + '</textarea>';
      html += '</div>';
    } else if (s.type === 'contact') {
      s.fields.forEach(function(f) {
        html += '<div class="form-field">';
        html += '<label class="form-field-label" for="offert-' + f.key + '">' + escHtml(f.label) + (f.required ? ' <span class="req">*</span>' : '') + '</label>';
        html += '<input class="form-field-input" type="' + f.type + '" id="offert-' + f.key + '" value="' + escHtml(OFFERT_STATE.answers[f.key] || '') + '"' + (f.required ? ' required' : '') + ' autocomplete="' + (f.key === 'namn' ? 'name' : f.key === 'telefon' ? 'tel' : f.key === 'email' ? 'email' : 'off') + '" />';
        html += '</div>';
      });
    }

    html += '<div class="quiz-nav">';
    if (OFFERT_STATE.history.length > 0) {
      html += '<button class="btn ghost" data-act="back">← Tillbaka</button>';
    }
    if (s.type === 'text') {
      html += '<button class="btn accent" data-act="text-next">Fortsätt →</button>';
    } else if (s.type === 'contact') {
      html += '<button class="btn accent" data-act="contact-submit">Klar — visa sammanfattning →</button>';
    }
    html += '</div>';

    pane.innerHTML = html;

    // Wire handlers
    pane.querySelectorAll('[data-choice]').forEach(function(b) {
      b.addEventListener('click', function() { offertChoose(b.getAttribute('data-choice')); });
    });
    pane.querySelectorAll('[data-act]').forEach(function(b) {
      b.addEventListener('click', function() {
        var act = b.getAttribute('data-act');
        if (act === 'back') offertBack();
        else if (act === 'text-next') offertSubmitText();
        else if (act === 'contact-submit') offertSubmitContact();
      });
    });
  }

  function offertChoose(value) {
    var s = OFFERT_FLOW[OFFERT_STATE.step];
    var opt = s.options.find(function(o) { return o.v === value; });
    if (!opt) return;
    OFFERT_STATE.answers[s.field] = value;
    OFFERT_STATE.history.push(OFFERT_STATE.step);
    OFFERT_STATE.step = opt.next;
    renderOffert();
  }

  function offertSubmitText() {
    var s = OFFERT_FLOW[OFFERT_STATE.step];
    var el = document.getElementById('offert-text');
    OFFERT_STATE.answers[s.field] = el ? el.value.trim() : '';
    OFFERT_STATE.history.push(OFFERT_STATE.step);
    OFFERT_STATE.step = s.next;
    renderOffert();
  }

  function offertSubmitContact() {
    var s = OFFERT_FLOW[OFFERT_STATE.step];
    var hasError = false;
    s.fields.forEach(function(f) {
      var el = document.getElementById('offert-' + f.key);
      if (!el) return;
      var val = el.value.trim();
      el.classList.remove('error');
      if (f.required && !val) { hasError = true; el.classList.add('error'); }
      if (f.type === 'tel' && val && val.replace(/\D/g, '').length < 7) { hasError = true; el.classList.add('error'); }
      if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { hasError = true; el.classList.add('error'); }
      OFFERT_STATE.answers[f.key] = val;
    });
    if (hasError) return;
    OFFERT_STATE.history.push(OFFERT_STATE.step);
    OFFERT_STATE.step = s.next;
    renderOffert();
  }

  function offertBack() {
    if (OFFERT_STATE.history.length === 0) return;
    OFFERT_STATE.step = OFFERT_STATE.history.pop();
    renderOffert();
  }

  function offertReset() {
    OFFERT_STATE = { step: 'start', history: [], answers: {} };
    renderOffert();
  }

  function buildOffertMailto() {
    var a = OFFERT_STATE.answers;
    var subject = 'Offertförfrågan: ' + offertPretty('kategori', a.kategori);
    var body = 'Hej Olsfors Elektriska!\n\nJag har skickat denna förfrågan via er widget:\n\n';
    ['kategori', 'typ', 'urgens', 'beskrivning', 'namn', 'telefon', 'email', 'ort'].forEach(function(k) {
      var v = a[k];
      if (!v) return;
      body += (OFFERT_LABELS[k] || k) + ': ' + offertPretty(k, v) + '\n';
    });
    body += '\nMvh,\n' + (a.namn || '');
    return 'mailto:info@olsforsel.se?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function renderOffertDone(pane) {
    var a = OFFERT_STATE.answers;
    var rows = '';
    ['kategori', 'typ', 'urgens', 'beskrivning', 'namn', 'telefon', 'email', 'ort'].forEach(function(k) {
      if (!a[k]) return;
      rows += '<div class="offert-summary-row">'
        + '<span class="offert-summary-row-key">' + escHtml(OFFERT_LABELS[k]) + '</span>'
        + '<span class="offert-summary-row-val">' + escHtml(offertPretty(k, a[k])) + '</span>'
        + '</div>';
    });

    pane.innerHTML = ''
      + '<div class="quiz-result-hero risk-low">'
        + '<div class="quiz-result-label">Klart</div>'
        + '<div class="quiz-result-title">Tack ' + escHtml((a.namn || '').split(' ')[0]) + '!</div>'
        + '<div class="quiz-result-body">Granska sammanfattningen och skicka iväg via mejl — eller ring oss direkt om det är akut.</div>'
      + '</div>'
      + '<div class="offert-summary" style="margin-top:12px;">' + rows + '</div>'
      + '<div style="display:flex;flex-direction:column;gap:6px;">'
        + '<a href="' + buildOffertMailto() + '" class="btn accent" data-act="send">'
          + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
          + 'Skicka via mejl →'
        + '</a>'
        + '<a href="tel:033295332" class="btn">'
          + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
          + 'Ring 033 29 53 32'
        + '</a>'
        + '<button class="btn ghost" data-act="reset">Börja om</button>'
      + '</div>';

    pane.querySelectorAll('[data-act="reset"]').forEach(function(b) {
      b.addEventListener('click', offertReset);
    });
  }

  // ===== REVIEWS ROTATION =====
  var REVIEWS = [
    { quote: '"Snabba, kunniga och prisvärda. Hjälpte oss med laddbox på två dagar — och förklarade allt på vägen."', author: 'Anna L.', loc: 'Bollebygd' },
    { quote: '"Anlitade dem för komplett elinstallation vid renovering. Proffsigt, ren arbetsplats och allt klart i tid."', author: 'Marcus E.', loc: 'Mölnlycke' },
    { quote: '"Fick hjälp med solceller från första skiss till färdig anläggning. Kan varmt rekommendera Olsfors!"', author: 'Camilla H.', loc: 'Hindås' },
    { quote: '"Rekommenderade rätt laddbox för vår BRF — slipper trångt på elen även när alla laddar samtidigt."', author: 'BRF Skogsbacken', loc: 'Härryda' }
  ];
  var reviewIdx = 0;
  function rotateReview() {
    var qEl = document.getElementById('review-quote');
    var aEl = document.getElementById('review-author');
    if (!qEl || !aEl) return;
    reviewIdx = (reviewIdx + 1) % REVIEWS.length;
    var r = REVIEWS[reviewIdx];
    qEl.style.opacity = '0';
    aEl.style.opacity = '0';
    qEl.style.transition = aEl.style.transition = 'opacity 0.25s';
    setTimeout(function() {
      qEl.textContent = r.quote;
      aEl.innerHTML = r.author + ' <span>· ' + r.loc + '</span>';
      qEl.style.opacity = '1';
      aEl.style.opacity = '1';
    }, 260);
  }
  setInterval(rotateReview, 5500);

  // ===== NAVIGATION =====
  function swToggle() {
    document.getElementById('samify-widget').classList.toggle('visible');
    document.getElementById('samify-launcher').classList.toggle('open');
    swCloseTooltip();
  }

  function swGoHome() {
    document.querySelectorAll('.sw-screen').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('sw-home').classList.add('active');
    document.getElementById('sw-back').classList.remove('show');
    document.getElementById('sw-header-title').textContent = 'OLSFORS ELEKTRISKA';
    var widget = document.getElementById('samify-widget');
    widget.classList.remove('expanded');
    widget.classList.add('is-home');
  }

  var expandScreens = ['sw-pricing'];

  function swNav(screenId, title) {
    document.querySelectorAll('.sw-screen').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById(screenId).classList.add('active');
    document.getElementById('sw-back').classList.add('show');
    document.getElementById('sw-header-title').textContent = title;
    var widget = document.getElementById('samify-widget');
    widget.classList.remove('is-home');
    if (expandScreens.indexOf(screenId) !== -1) widget.classList.add('expanded');
    else widget.classList.remove('expanded');

    // Render quiz when entering
    if (screenId === 'sw-eldiagnos') renderQuiz();

    // Resize chatbot embed after expand transition
    setTimeout(function() {
      var bot = document.querySelector('zapier-interfaces-chatbot-embed');
      if (bot) {
        var h = widget.offsetHeight - document.querySelector('.sw-header').offsetHeight - document.querySelector('.sw-footer').offsetHeight;
        bot.setAttribute('height', h + 'px');
        bot.setAttribute('width', widget.offsetWidth + 'px');
      }
    }, 320);
  }

  function swFaq(btn) { btn.closest('.faq-item').classList.toggle('open'); }

  function swPricingTab(name, btn) {
    document.querySelectorAll('.price-set').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.price-toggle-btn').forEach(function(b) { b.classList.remove('active'); });
    var pane = document.getElementById('sw-price-' + name);
    if (pane) pane.classList.add('active');
    if (btn) btn.classList.add('active');
    if (name === 'offert') renderOffert();
  }

  function swNavPricer(tab) {
    var title = tab === 'offert' ? 'Priser & offert' : tab === 'sakerhet' ? 'Säkerhet' : 'Priser';
    swNav('sw-pricing', title);
    var btn = document.querySelector('.price-toggle-btn[data-tab="' + tab + '"]');
    swPricingTab(tab, btn);
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
  }, 600);

  // Expose to window
  window.swToggle = swToggle;
  window.swGoHome = swGoHome;
  window.swNav = swNav;
  window.swNavPricer = swNavPricer;
  window.swFaq = swFaq;
  window.swPricingTab = swPricingTab;
  window.swCloseTooltip = swCloseTooltip;
  window.swOpenFromTooltip = swOpenFromTooltip;
  window.swQuizNext = swQuizNext;
  window.swQuizBack = swQuizBack;
  window.swQuizReset = swQuizReset;
})();
