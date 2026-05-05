import { useRef, useState } from 'react';
import { ELDIAGNOS_QS, eldiagnosResult, PHONE_HREF } from '../data.js';
import { ShieldIcon, PhoneIcon } from '../components/Icons.jsx';

function scoreAnswers(answers) {
  let score = 0;
  ELDIAGNOS_QS.forEach((q) => {
    const a = answers[q.key];
    if (q.multi) {
      (a || []).forEach((v) => {
        const opt = q.options.find((o) => o.v === v);
        if (opt) score += opt.w;
      });
    } else {
      const opt = q.options.find((o) => o.v === a);
      if (opt) score += opt.w;
    }
  });
  return score;
}

export default function Eldiagnos({ onNavigate, onPricer }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showError, setShowError] = useState(false);
  const errorTimeout = useRef(null);

  const reset = () => {
    setStep(0);
    setAnswers({});
    setShowError(false);
  };

  const toggleOption = (q, v) => {
    setShowError(false);
    setAnswers((prev) => {
      if (q.multi) {
        let arr = prev[q.key] || [];
        if (v === 'none') {
          arr = arr.includes('none') ? [] : ['none'];
        } else {
          arr = arr.filter((x) => x !== 'none');
          arr = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
        }
        return { ...prev, [q.key]: arr };
      }
      return { ...prev, [q.key]: v };
    });
  };

  const onNext = () => {
    const q = ELDIAGNOS_QS[step];
    const a = answers[q.key];
    const has = q.multi ? (a || []).length > 0 : !!a;
    if (!has) {
      setShowError(true);
      clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => setShowError(false), 1100);
      return;
    }
    setStep((s) => s + 1);
  };

  // Result screen
  if (step >= ELDIAGNOS_QS.length) {
    const score = scoreAnswers(answers);
    const res = eldiagnosResult(score);
    return (
      <div className="sw-screen active">
        <div className="inner-body">
          <div className="section-title">
            <div className="section-title-bar"></div>
            <div className="section-title-text">Eldiagnos</div>
          </div>
          <div className="quiz-progress">
            {ELDIAGNOS_QS.map((_, i) => (
              <div key={i} className="quiz-progress-step done"></div>
            ))}
          </div>
          <div className={`quiz-result-hero risk-${res.risk}`}>
            <div className="quiz-result-label">{res.label}</div>
            <div className="quiz-result-title">{res.title}</div>
            <div className="quiz-result-body">{res.msg}</div>
          </div>
          <div className="info-row">
            <div className="info-row-icon"><ShieldIcon size={18} /></div>
            <div className="info-row-content">
              <div className="info-row-label">Nästa steg</div>
              <div className="info-row-value">Gratis besiktning på plats</div>
              <div className="info-row-sub">Vi kommer hem, kollar din el och ger ärlig bedömning. Inga dolda kostnader.</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {res.ctaPrimary === 'phone' ? (
              <>
                <a href={PHONE_HREF} className="btn accent">
                  <PhoneIcon size={14} />
                  {res.cta}
                </a>
                <button className="btn ghost" onClick={() => onPricer('offert')}>
                  Eller skicka förfrågan
                </button>
              </>
            ) : res.ctaPrimary === 'booking' ? (
              <button className="btn accent" onClick={() => onPricer('offert')}>{res.cta}</button>
            ) : (
              <button className="btn accent" onClick={() => onNavigate('contact', 'Kontakt')}>{res.cta}</button>
            )}
            <button className="btn ghost" onClick={reset}>Gör om testet</button>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  const q = ELDIAGNOS_QS[step];
  const selected = answers[q.key] || (q.multi ? [] : null);
  const isLast = step === ELDIAGNOS_QS.length - 1;

  return (
    <div className="sw-screen active">
      <div className="inner-body">
        <div className="section-title">
          <div className="section-title-bar"></div>
          <div className="section-title-text">Eldiagnos · steg {step + 1}/{ELDIAGNOS_QS.length}</div>
        </div>
        <div className="quiz-progress">
          {ELDIAGNOS_QS.map((_, i) => (
            <div key={i} className={`quiz-progress-step ${i < step ? 'done' : i === step ? 'current' : ''}`}></div>
          ))}
        </div>
        <div className="quiz-question">{q.q}</div>
        <div className="quiz-hint">{q.hint}</div>
        <div className="quiz-options">
          {q.options.map((opt) => {
            const isSel = q.multi ? selected.includes(opt.v) : selected === opt.v;
            return (
              <button
                key={opt.v}
                className={`quiz-option ${isSel ? 'selected' : ''}`}
                onClick={() => toggleOption(q, opt.v)}
              >
                <div className="quiz-option-check"></div>
                <div className="quiz-option-body">
                  <div className="quiz-option-label">{opt.label}</div>
                  {opt.sub && <div className="quiz-option-sub">{opt.sub}</div>}
                </div>
              </button>
            );
          })}
        </div>
        <div className="quiz-nav">
          {step > 0 && (
            <button className="btn ghost" onClick={() => setStep((s) => s - 1)}>← Tillbaka</button>
          )}
          <button
            className="btn accent"
            onClick={onNext}
            style={showError ? { background: 'var(--red-dark)' } : {}}
          >
            {showError ? 'Välj ett alternativ' : (isLast ? 'Se resultat' : 'Nästa →')}
          </button>
        </div>
      </div>
    </div>
  );
}
