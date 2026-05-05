import { useState } from 'react';
import { OFFERT_FLOW, OFFERT_LABELS, offertPretty, EMAIL, PHONE, PHONE_HREF } from '../data.js';
import { InfoIcon, MailIcon, PhoneIcon } from '../components/Icons.jsx';

const SUMMARY_FIELDS = ['kategori', 'typ', 'urgens', 'beskrivning', 'namn', 'telefon', 'email', 'ort'];

function buildMailto(answers) {
  const subject = 'Offertförfrågan: ' + offertPretty('kategori', answers.kategori || '');
  let body = 'Hej Olsfors Elektriska!\n\nJag har skickat denna förfrågan via er widget:\n\n';
  SUMMARY_FIELDS.forEach((k) => {
    const v = answers[k];
    if (!v) return;
    body += (OFFERT_LABELS[k] || k) + ': ' + offertPretty(k, v) + '\n';
  });
  body += '\nMvh,\n' + (answers.namn || '');
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function OffertFlow() {
  const [stepId, setStepId] = useState('start');
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  const step = OFFERT_FLOW[stepId];

  const goNext = (next, fieldUpdates = {}) => {
    setAnswers((a) => ({ ...a, ...fieldUpdates }));
    setHistory((h) => [...h, stepId]);
    setStepId(next);
    setErrors({});
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setStepId(prev);
    setErrors({});
  };

  const reset = () => {
    setStepId('start');
    setHistory([]);
    setAnswers({});
    setErrors({});
  };

  // === DONE ===
  if (step.type === 'done') {
    return (
      <div>
        <div className="quiz-result-hero risk-low">
          <div className="quiz-result-label">Klart</div>
          <div className="quiz-result-title">Tack {(answers.namn || '').split(' ')[0]}!</div>
          <div className="quiz-result-body">
            Granska sammanfattningen och skicka iväg via mejl — eller ring oss direkt om det är akut.
          </div>
        </div>
        <div className="offert-summary" style={{ marginTop: 12 }}>
          {SUMMARY_FIELDS.map((k) => answers[k] && (
            <div key={k} className="offert-summary-row">
              <span className="offert-summary-row-key">{OFFERT_LABELS[k]}</span>
              <span className="offert-summary-row-val">{offertPretty(k, answers[k])}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <a href={buildMailto(answers)} className="btn accent">
            <MailIcon size={14} />
            Skicka via mejl →
          </a>
          <a href={PHONE_HREF} className="btn">
            <PhoneIcon size={14} />
            Ring {PHONE}
          </a>
          <button className="btn ghost" onClick={reset}>Börja om</button>
        </div>
      </div>
    );
  }

  // === SHARED INTRO ===
  const intro = (
    <div className="offert-intro">
      <InfoIcon size={14} />
      Bara några snabba frågor — vi återkommer samma dag.
    </div>
  );

  // === CHOICE STEP ===
  if (step.type === 'choice') {
    return (
      <div>
        {intro}
        <div className="quiz-question">{step.q}</div>
        {step.hint && <div className="quiz-hint">{step.hint}</div>}
        <div className="quiz-options">
          {step.options.map((opt) => {
            const isSel = answers[step.field] === opt.v;
            return (
              <button
                key={opt.v}
                className={`quiz-option ${isSel ? 'selected' : ''}`}
                onClick={() => goNext(opt.next, { [step.field]: opt.v })}
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
        {history.length > 0 && (
          <div className="quiz-nav">
            <button className="btn ghost" onClick={goBack}>← Tillbaka</button>
          </div>
        )}
      </div>
    );
  }

  // === TEXT STEP ===
  if (step.type === 'text') {
    return (
      <div>
        {intro}
        <div className="quiz-question">{step.q}</div>
        {step.hint && <div className="quiz-hint">{step.hint}</div>}
        <div className="form-field">
          <textarea
            className="form-field-input form-field-textarea"
            placeholder={step.placeholder}
            value={answers[step.field] || ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [step.field]: e.target.value }))}
          />
        </div>
        <div className="quiz-nav">
          <button className="btn ghost" onClick={goBack}>← Tillbaka</button>
          <button className="btn accent" onClick={() => goNext(step.next)}>Fortsätt →</button>
        </div>
      </div>
    );
  }

  // === CONTACT STEP ===
  if (step.type === 'contact') {
    const submit = () => {
      const newErrors = {};
      step.fields.forEach((f) => {
        const val = (answers[f.key] || '').trim();
        if (f.required && !val) newErrors[f.key] = true;
        if (f.type === 'tel' && val && val.replace(/\D/g, '').length < 7) newErrors[f.key] = true;
        if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) newErrors[f.key] = true;
      });
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      goNext(step.next);
    };

    return (
      <div>
        {intro}
        <div className="quiz-question">{step.q}</div>
        {step.hint && <div className="quiz-hint">{step.hint}</div>}
        {step.fields.map((f) => (
          <div key={f.key} className="form-field">
            <label className="form-field-label" htmlFor={`offert-${f.key}`}>
              {f.label}{f.required && <span className="req"> *</span>}
            </label>
            <input
              id={`offert-${f.key}`}
              className={`form-field-input ${errors[f.key] ? 'error' : ''}`}
              type={f.type}
              value={answers[f.key] || ''}
              autoComplete={
                f.key === 'namn' ? 'name' :
                f.key === 'telefon' ? 'tel' :
                f.key === 'email' ? 'email' : 'off'
              }
              onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
            />
          </div>
        ))}
        <div className="quiz-nav">
          <button className="btn ghost" onClick={goBack}>← Tillbaka</button>
          <button className="btn accent" onClick={submit}>Klar — visa sammanfattning →</button>
        </div>
      </div>
    );
  }

  return null;
}
