import { useState } from 'react';
import { FAQS } from '../data.js';
import { ChevronDownIcon } from '../components/Icons.jsx';

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="sw-screen active">
      <div className="inner-body">
        <div className="section-title">
          <div className="section-title-bar"></div>
          <div className="section-title-text">Vanliga frågor</div>
        </div>
        {FAQS.map((item, i) => (
          <div key={i} className={`faq-item ${openIdx === i ? 'open' : ''}`}>
            <button
              className="faq-q"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              {item.q}
              <ChevronDownIcon />
            </button>
            <div className="faq-a">{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
