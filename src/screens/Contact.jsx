import { PhoneIcon, MailIcon, GlobeIcon, FacebookIcon } from '../components/Icons.jsx';
import { PHONE, PHONE_HREF, EMAIL } from '../data.js';

export default function Contact() {
  return (
    <div className="sw-screen active">
      <div className="inner-body">
        <div className="section-title">
          <div className="section-title-bar"></div>
          <div className="section-title-text">Kontakta oss</div>
        </div>
        <div className="contact-card">
          <div className="contact-head">
            <div className="contact-av">OE</div>
            <div>
              <div className="contact-name">Olsfors Elektriska AB</div>
              <div className="contact-role">Elektriker · Olsfors & Västra Götaland</div>
            </div>
          </div>
          <div className="contact-links">
            <a href={PHONE_HREF} className="contact-link">
              <PhoneIcon size={13} /> {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="contact-link">
              <MailIcon size={13} /> {EMAIL}
            </a>
            <a href="https://www.olsforsel.se" target="_blank" rel="noopener noreferrer" className="contact-link">
              <GlobeIcon size={13} /> olsforsel.se
            </a>
            <a href="https://www.facebook.com/olsforsel" target="_blank" rel="noopener noreferrer" className="contact-link">
              <FacebookIcon size={13} /> Facebook
            </a>
          </div>
        </div>
        <div className="contact-card">
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Adress
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-mute)', lineHeight: 1.8 }}>
            Boråsvägen 16<br />
            517 71 Olsfors<br />
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Org.nr 556149-4138</span>
          </div>
        </div>
      </div>
    </div>
  );
}
