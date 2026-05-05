export const PHONE = '033 29 53 32';
export const PHONE_HREF = 'tel:033295332';
export const EMAIL = 'info@olsforsel.se';
export const RECO_URL = 'https://www.reco.se/olsfors-elektriska-ab';
export const ZAPIER_CHATBOT_ID = 'cmmytkwgn00b31339vxo0x9yx';

export const LOGO_URL = 'https://static.wixstatic.com/media/fe5ae4_284ae9bd99a84c3eb1101ed27d9f7a2f~mv2.png/v1/crop/x_1,y_0,w_258,h_98/fill/w_183,h_70,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RGB_Logo_R%C3%B6d_elkedjan.png';

export const SAMIFY_LOGO = 'https://samify.se/wp-content/uploads/go-x/u/7c566770-2e09-4b98-98b8-c4afcbbeeeaa/image-160x62.png';

export const FAQS = [
  {
    q: 'Vad gör Olsfors Elektriska?',
    a: 'Vi är en lokal elektriker med rötter i Olsfors och Bollebygd sedan 1963. Vi hjälper privatpersoner, företag, industri och fastighetsägare med allt inom el — från kortslutningar till kompletta installationer, solceller, laddboxar och smarta hem.'
  },
  {
    q: 'Vilka områden jobbar ni i?',
    a: 'Vi är verksamma i Olsfors, Bollebygd, Mölnlycke, Landvetter, Härryda, Hindås, Sätila, Kinna, Skene, Fritsla, Fristad och kringliggande orter i Västra Götaland.'
  },
  {
    q: 'Installerar ni laddboxar?',
    a: 'Ja! Vi installerar laddboxar för villor, bostadsrättsföreningar och företag. Priset börjar från 7 750 kr (efter 50% grönt avdrag på fakturan). Vi hjälper dig välja rätt box — med eller utan lastbalansering och uppkoppling.'
  },
  {
    q: 'Vad kostar ett övervakningssystem?',
    a: 'Övervakningspaket startar från 5 000 kr. Vi erbjuder allt från en enskild kamera till kompletta system för bostad, fastighet eller verksamhet — inomhus och utomhus, med eller utan inspelning.'
  },
  {
    q: 'Installerar ni solceller?',
    a: 'Ja, vi installerar solceller och hjälper dig med hela lösningen — från planering till driftsättning. Kontakta oss för en kostnadsfri offert anpassad till din fastighet.'
  },
  {
    q: 'Jobbar ni med industri och entreprenad?',
    a: 'Absolut. Vi tar entreprenader av alla storlekar och hjälper industrin med apparatskåp, nyinstallation, felsökning och maskinservice. Vi är med från start till mål.'
  },
  {
    q: 'Hur snabbt kan ni komma?',
    a: 'Vi prioriterar snabba svar och smidiga lösningar. Ring oss på 033 29 53 32 eller skicka in en offertförfrågan via hemsidan så återkommer vi så fort som möjligt.'
  }
];

export const ELDIAGNOS_QS = [
  {
    key: 'age',
    q: 'Hur gammal är fastighetens elinstallation?',
    hint: 'Räkna från senaste totalrenovering om sådan gjorts.',
    options: [
      { v: 'old',     label: 'Före 1985',    sub: 'Sannolikt original eller ej moderniserad', w: 4 },
      { v: 'mid',     label: '1985 – 2005',  sub: 'Mellangenerations installation',           w: 2 },
      { v: 'new',     label: 'Efter 2005',   sub: 'Modern standard',                          w: 0 },
      { v: 'unknown', label: 'Vet ej',       sub: 'Vi hjälper dig kontrollera',               w: 2 }
    ]
  },
  {
    key: 'central',
    q: 'Vilken typ av elcentral har du?',
    hint: 'Titta på säkringarna i centralen.',
    options: [
      { v: 'plug',    label: 'Proppsäkringar',                       sub: 'Skruvbara porslinssäkringar', w: 4 },
      { v: 'auto',    label: 'Automatsäkringar',                     sub: 'Vippbara plastsäkringar',     w: 1 },
      { v: 'modern',  label: 'Modern central med jordfelsbrytare',   sub: 'Senaste standarden',          w: 0 },
      { v: 'unknown', label: 'Vet ej',                                sub: 'Vi kollar gärna',             w: 2 }
    ]
  },
  {
    key: 'symptoms',
    q: 'Har du sett något av detta?',
    hint: 'Markera alla som stämmer — eller "Inga".',
    multi: true,
    options: [
      { v: 'flicker',  label: 'Blinkande lampor',              sub: 'Speciellt vid hög belastning', w: 2 },
      { v: 'tripping', label: 'Säkringar löser ut',            sub: 'Återkommande utlösningar',     w: 3 },
      { v: 'warm',     label: 'Varma kontakter / stickproppar', sub: 'Märkbart varma vid drift',     w: 4 },
      { v: 'smell',    label: 'Brännlukt eller rök',           sub: 'Akut symptom — agera direkt',  w: 6 },
      { v: 'shock',    label: 'Stötar / kittlande känsla',     sub: 'Vid beröring av apparater',    w: 5 },
      { v: 'none',     label: 'Inga av ovanstående',           sub: '',                              w: 0 }
    ]
  },
  {
    key: 'plans',
    q: 'Funderar du på något av detta framöver?',
    hint: 'Vi hjälper dig planera — markera allt som passar.',
    multi: true,
    options: [
      { v: 'ev',       label: 'Skaffa elbil / laddbox', sub: 'Vi installerar laddbox från 7 750 kr', w: 0 },
      { v: 'solar',    label: 'Solceller',              sub: 'Planering till driftsättning',          w: 0 },
      { v: 'reno',     label: 'Renovera / bygga om',    sub: 'Eldragning och nya kretsar',            w: 0 },
      { v: 'security', label: 'Larm / övervakning',     sub: 'Säkerhetsinstallation',                 w: 0 },
      { v: 'none',     label: 'Inget akut just nu',     sub: '',                                       w: 0 }
    ]
  }
];

export function eldiagnosResult(score) {
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

export const OFFERT_FLOW = {
  start: {
    type: 'choice',
    q: 'Vad gäller det?',
    hint: 'Välj kategori — vi anpassar följdfrågorna efter ditt val.',
    field: 'kategori',
    options: [
      { v: 'laddbox',   label: 'Laddbox',           sub: 'Hemmaladdning eller flerfordon',    next: 'laddbox_typ' },
      { v: 'solceller', label: 'Solceller',         sub: 'Planering och installation',        next: 'solceller_typ' },
      { v: 'el',        label: 'Elinstallation',    sub: 'Felsökning, renovering, nybygge',   next: 'el_typ' },
      { v: 'sakerhet',  label: 'Säkerhet & kamera', sub: 'Övervakning eller larm',            next: 'sakerhet_typ' },
      { v: 'industri',  label: 'Industri / företag',sub: 'Entreprenad eller service',         next: 'industri_typ' },
      { v: 'annat',     label: 'Annat',             sub: 'Beskriv själv vad du behöver',      next: 'beskriv' }
    ]
  },
  laddbox_typ: {
    type: 'choice', q: 'För vem?', field: 'typ',
    options: [
      { v: 'villa',   label: 'Villa / privat', sub: 'En laddbox',                          next: 'urgens' },
      { v: 'brf',     label: 'BRF',            sub: 'Flera platser med lastbalansering',   next: 'urgens' },
      { v: 'foretag', label: 'Företag',        sub: 'Anställda eller kundparkering',       next: 'urgens' }
    ]
  },
  solceller_typ: {
    type: 'choice', q: 'Vilken typ av fastighet?', field: 'typ',
    options: [
      { v: 'villa',   label: 'Villa / privat',     sub: 'Småhus eller fritidsbostad',     next: 'urgens' },
      { v: 'foretag', label: 'Företag / fastighet', sub: 'Industri- eller flerbostadshus', next: 'urgens' }
    ]
  },
  el_typ: {
    type: 'choice', q: 'Vad behöver du hjälp med?', field: 'typ',
    options: [
      { v: 'felsok',     label: 'Felsökning',         sub: 'Något fungerar inte',              next: 'urgens' },
      { v: 'renovering', label: 'Renovering / utbyggnad', sub: 'Nya kretsar eller dragning',  next: 'urgens' },
      { v: 'nybygge',    label: 'Nybyggnation',       sub: 'Hela installationer',              next: 'urgens' },
      { v: 'central',    label: 'Byte av elcentral',  sub: 'Modernisering / jordfelsbrytare',  next: 'urgens' }
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
      { v: 'felsok',      label: 'Felsökning',          sub: 'Driftstopp eller akuta fel',         next: 'urgens' }
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
      { key: 'namn',    label: 'Namn',                       type: 'text',  required: true },
      { key: 'telefon', label: 'Telefon',                    type: 'tel',   required: true },
      { key: 'email',   label: 'Mejl (valfritt)',             type: 'email', required: false },
      { key: 'ort',     label: 'Ort / postnummer (valfritt)', type: 'text',  required: false }
    ],
    next: 'klar'
  },
  klar: { type: 'done' }
};

export const OFFERT_LABELS = {
  kategori: 'Kategori', typ: 'Typ', urgens: 'Tidshorisont',
  beskrivning: 'Beskrivning', namn: 'Namn', telefon: 'Telefon',
  email: 'Mejl', ort: 'Ort'
};

export const OFFERT_PRETTY = {
  kategori: { laddbox: 'Laddbox', solceller: 'Solceller', el: 'Elinstallation', sakerhet: 'Säkerhet & kamera', industri: 'Industri / företag', annat: 'Annat' },
  typ: {
    villa: 'Villa / privat', brf: 'BRF', foretag: 'Företag',
    felsok: 'Felsökning', renovering: 'Renovering / utbyggnad', nybygge: 'Nybyggnation', central: 'Byte av elcentral',
    bostad: 'Bostad', utomhus: 'Utomhus / fastighet',
    entreprenad: 'Entreprenad', service: 'Service / underhåll'
  },
  urgens: { akut: 'Akut', snart: 'Inom någon vecka', planer: 'Inom 1–3 månader', orient: 'Bara orientering' }
};

export function offertPretty(field, val) {
  if (OFFERT_PRETTY[field] && OFFERT_PRETTY[field][val]) return OFFERT_PRETTY[field][val];
  return val;
}

export const REVIEWS = [
  { quote: '"Snabba, kunniga och prisvärda. Hjälpte oss med laddbox på två dagar — och förklarade allt på vägen."', author: 'Anna L.', loc: 'Bollebygd' },
  { quote: '"Anlitade dem för komplett elinstallation vid renovering. Proffsigt, ren arbetsplats och allt klart i tid."', author: 'Marcus E.', loc: 'Mölnlycke' },
  { quote: '"Fick hjälp med solceller från första skiss till färdig anläggning. Kan varmt rekommendera Olsfors!"', author: 'Camilla H.', loc: 'Hindås' },
  { quote: '"Rekommenderade rätt laddbox för vår BRF — slipper trångt på elen även när alla laddar samtidigt."', author: 'BRF Skogsbacken', loc: 'Härryda' }
];
