export default function LaddboxOffer() {
  return (
    <div className="sw-screen active">
      <div className="inner-body">
        <div className="section-title">
          <div className="section-title-bar"></div>
          <div className="section-title-text">Laddbox · vårt erbjudande</div>
        </div>
        <a
          href="https://www.olsforsel.se/laddbox"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}
        >
          <img
            src="https://static.wixstatic.com/media/fe5ae4_8d6c80a85b29435687eae9b1b8aa4696~mv2.png/v1/fill/w_496,h_389,fp_0.50_0.43,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3box.png"
            alt="Laddbox erbjudande"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </a>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1.5 }}>
            Laddbox med dynamisk lastbalansering, installerad och klar
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--red)', letterSpacing: '-0.02em' }}>
            Från 7 750:-<span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>*</span>
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text)' }}>
            Körklar med snabb och säker laddning!
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-mute)', lineHeight: 1.65 }}>
            Vi installerar laddboxar som uppfyller alla krav för att nyttja skatteavdraget för grön teknik. Det innebär att du kan få <strong>50% i prisavdrag</strong> för arbete och material direkt på fakturan.
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-dim)', lineHeight: 1.5, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
            *Priset 7 750:- är med 50% avdrag på fakturan.
          </div>
        </div>
        <a href="https://www.olsforsel.se/laddbox" target="_blank" rel="noopener noreferrer" className="btn">
          Gå till laddbox-sidan →
        </a>
      </div>
    </div>
  );
}
