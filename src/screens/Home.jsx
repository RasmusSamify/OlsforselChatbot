import { useEffect, useState } from 'react';
import { ChatIcon, BoltIcon, DollarIcon, HelpCircleIcon, PhoneIcon, StarIcon } from '../components/Icons.jsx';
import { REVIEWS, RECO_URL, PHONE } from '../data.js';

export default function Home({ onNavigate, onPricer }) {
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewFading, setReviewFading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setReviewFading(true);
      setTimeout(() => {
        setReviewIdx((i) => (i + 1) % REVIEWS.length);
        setReviewFading(false);
      }, 250);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const review = REVIEWS[reviewIdx];

  return (
    <div className="sw-screen active">
      <div className="home-body">

        <div className="tile-grid">
          {/* Featured: chatbot */}
          <button className="tile featured area-chat" onClick={() => onNavigate('chat', 'Chatta med oss')}>
            <div className="tile-icon-wrap">
              <ChatIcon size={22} />
            </div>
            <div className="tile-content">
              <div className="tile-label">Fråga oss direkt</div>
              <div className="tile-live">
                <span className="tile-live-dots">
                  <span className="tile-live-dot"></span>
                  <span className="tile-live-dot"></span>
                  <span className="tile-live-dot"></span>
                </span>
                <span className="tile-live-text">AI-assistent · live nu</span>
              </div>
            </div>
            <div className="tile-arrow">›</div>
          </button>

          {/* Eldiagnos: tall featured card */}
          <button className="tile area-eldiagnos" onClick={() => onNavigate('eldiagnos', 'Eldiagnos')}>
            <span className="tile-badge">2 MIN</span>
            <div className="tile-icon-wrap">
              <BoltIcon size={20} />
            </div>
            <div className="tile-label">Eldiagnos</div>
            <div className="tile-sub">4 frågor om er el</div>
            <div className="tile-cta">Gratis riskanalys ›</div>
          </button>

          {/* Priser & offert (top right) */}
          <button className="tile area-priser" onClick={() => onPricer('laddbox')}>
            <div className="tile-icon-wrap"><DollarIcon /></div>
            <div className="tile-label">Priser & offert</div>
            <div className="tile-sub">Fr. 7 750 kr</div>
          </button>

          {/* FAQ (bottom right) */}
          <button className="tile area-faq" onClick={() => onNavigate('faq', 'Vanliga frågor')}>
            <div className="tile-icon-wrap"><HelpCircleIcon /></div>
            <div className="tile-label">Vanliga frågor</div>
            <div className="tile-sub">Snabba svar</div>
          </button>
        </div>

        {/* Reviews */}
        <div className="reviews-strip">
          <div className="reviews-head">
            <div className="reviews-rating">
              <span className="reviews-rating-num">4,8</span>
              <span className="reviews-stars">
                <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
              </span>
            </div>
            <a href={RECO_URL} target="_blank" rel="noopener noreferrer" className="reviews-source">
              reco.se ›
            </a>
          </div>
          <div className="review-quote" style={{ opacity: reviewFading ? 0 : 1 }}>{review.quote}</div>
          <div className="review-author" style={{ opacity: reviewFading ? 0 : 1 }}>
            {review.author} <span>· {review.loc}</span>
          </div>
        </div>

        <div className="quick-cta">
          <button className="btn accent" onClick={() => onNavigate('contact', 'Kontakt')}>
            <PhoneIcon size={14} />
            Kontakt
          </button>
          <button className="btn success" onClick={() => onPricer('offert')}>
            <ChatIcon size={14} />
            Skicka förfrågan
          </button>
        </div>

      </div>
    </div>
  );
}
