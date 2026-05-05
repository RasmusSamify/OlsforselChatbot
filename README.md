# Olsfors Elektriska — Widget

Embeddable chat- och offert-widget för [Olsfors Elektriska](https://www.olsforsel.se), byggd av [Samify](https://samify.se).

## Funktioner

- **Chat** via Zapier-baserad AI-assistent
- **Eldiagnos** — 4-stegs riskanalys med poängsatt resultat (akut / värd att kolla / inget akut) och dynamiska CTA:er
- **Priser & offert** — flikbaserade priser för Laddbox och Säkerhet, plus interaktivt offert-flöde med villkorade frågor (kategori → typ → tidshorisont → fritext → kontaktuppgifter → mailto-sammanfattning)
- **Vanliga frågor**, kontaktuppgifter, kundomdömen från reco.se
- Mobil-responsiv (480px och 360px breakpoints)
- Olsfors brand: röd accent, mörk navy, premium cream-bakgrund

## Stack

- React 18 + Vite 5
- Vanilla CSS (med variabler), scoped under `#samify-widget-container`
- Inga externa CSS-frameworks
- Bundlas som ett `dist-embed/widget.js` (IIFE med inline-CSS) för drop-in på kundsajt

## Utveckling

```bash
npm install
npm run dev
```

Öppnar dev-server på `http://localhost:5173` med widgeten monterad i en demosida.

## Bygg embed-bundle

```bash
npm run build:embed
```

Producerar `dist-embed/widget.js` (~530 KB / ~160 KB gzippat) — en självcontained IIFE-bundle med React + alla styles inlinade. Läggs upp på CDN och embeddas på kundsajt med:

```html
<script src="https://cdn.example.com/olsfors-widget.js"></script>
```

Widgeten auto-monterar sig själv när scriptet laddas — ingen ytterligare HTML/JS behövs.

## Struktur

```
src/
├── Widget.jsx           Huvud-shell (state + screen routing)
├── main.jsx             Dev entry — mounts <Widget /> i demosidan
├── embed.jsx            Production entry — auto-mount + CSS-injection
├── data.js              Konstanter: FAQ, ELDIAGNOS_QS, OFFERT_FLOW, REVIEWS
├── styles.css           Hela stylen (scoped under #samify-widget-container)
├── components/
│   ├── Header.jsx       Logo + brand-band (synlig på home)
│   ├── Launcher.jsx     Pulserande chat-bubbla
│   ├── Tooltip.jsx      Initial popup
│   └── Icons.jsx        Lucide-style SVG-ikoner
└── screens/
    ├── Home.jsx         Asymmetrisk grid + reviews + quick-CTA
    ├── Chat.jsx         Zapier embed
    ├── Eldiagnos.jsx    Quiz-flow
    ├── Faq.jsx
    ├── Pricing.jsx      Tabs: Laddbox / Säkerhet / Offert
    ├── OffertFlow.jsx   Multi-step villkorad form
    ├── LaddboxOffer.jsx
    └── Contact.jsx
```

## Brand

- Primary navy: `#1a1a2e`
- Olsfors-röd: `#c0392b`
- Success grön: `#16a34a`
- Cream bg: `#faf7f3` → `#f0eae3`

---

Byggt med **♥** av [Samify](https://samify.se).
