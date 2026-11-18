/* SolarAI Analytics, web del servicio: idioma (EN/ES), gráficos con los datos de la demo, tabla de pérdidas y formulario.
   Los datos son INVENTADOS (planta ficticia, 12 ene – 10 feb): no corresponden a ninguna planta real. */
(() => {
'use strict';

/* ---------- datos de la demo ---------- */
// [día, esperada MWh, exportada MWh, precio medio con sol AUD/MWh]; null = día sin datos válidos
const DAILY = [
  ['2026-01-12',234,221,69.5],['2026-01-13',454,426,-31.4],['2026-01-14',475,447,46.7],['2026-01-15',473,454,47.7],['2026-01-16',346,333,30.8],['2026-01-17',null,null,null],['2026-01-18',398,376,28.1],['2026-01-19',458,439,54.0],['2026-01-20',467,438,41.3],['2026-01-21',305,0,28.9],['2026-01-22',264,250,26.7],['2026-01-23',299,281,-3.3],['2026-01-24',328,315,20.8],['2026-01-25',411,397,27.3],['2026-01-26',267,248,4.6],['2026-01-27',null,null,null],['2026-01-28',257,240,105.6],['2026-01-29',276,266,13.2],['2026-01-30',400,382,12.4],['2026-01-31',340,139,-51.5],['2026-02-01',287,129,-42.9],['2026-02-02',396,379,61.3],['2026-02-03',254,240,28.4],['2026-02-04',419,260,-5.2],['2026-02-05',329,306,37.8],['2026-02-06',465,443,81.1],['2026-02-07',382,369,20.2],['2026-02-08',319,301,11.8],['2026-02-09',356,345,35.6],['2026-02-10',421,404,61.5]];
// energía perdida y su valor por banda de valor de mercado (RRP·MLF + LGC): <0, 0–50, 50–100, >100 AUD/MWh
const BANDS = { mwh: [538.4, 563.4, 100.2, 50.0], aud: [0, 7234, 5902, 5902] };
// pérdidas por causa: MWh y AUD a precio de mercado (la tarifa plana es MWh × 70)
const LOSSES = [
  { k: 'other', mwh: 294.22, aud: 6914.2 }, { k: 'curtail', mwh: 313.0, aud: 6573.0 }, { k: 'outage', mwh: 513.32, aud: 2515.3 }, { k: 'inverter', mwh: 43.82, aud: 1665.2 }, { k: 'dc', mwh: 56.34, aud: 969.0 }, { k: 'tracker', mwh: 25.04, aud: 388.1 }, { k: 'clip', mwh: 6.26, aud: 13.1 }];
const TARIFF = 70;
// totales oficiales del análisis (la suma de filas redondeadas difiere en ±1)
const TOTAL = { mwh: 1252.0, aud: 19037.9 };

/* ---------- textos en español (el inglés vive en el HTML) ---------- */
const ES = {
  nav1: 'El análisis', nav2: 'Valor de mercado', nav3: 'Qué recibe', nav5: 'Preguntas', nav6: 'HeliOS', navCta: 'Solicitar un análisis',
  tK: 'Nuestro producto · HeliOS', tH: 'Del análisis a la operación diaria: <em>HeliOS</em>.',
  tL: 'HeliOS es nuestra plataforma de O&M para plantas solares: la planta en 3D reproducida desde el SCADA, órdenes de trabajo, inventario y garantías, una app para los técnicos y Apollo, un asistente de IA que conoce cada seguidor.',
  tOpen: 'Conocer HeliOS', h1: 'Su planta solar pierde energía. Le mostramos dónde, por qué y <em>cuánto vale de verdad</em>.',
  lede: 'Tomamos las exportaciones SCADA de su planta, modelamos lo que debería producir cada bloque y rendimos cuentas de cada megavatio-hora perdido: qué equipo, qué día, qué causa y cuánto costó al precio de mercado de ese intervalo de cinco minutos.',
  cta1: 'Solicitar un análisis', cta2: 'Conocer HeliOS', heroT: 'Planta demo · energía diaria', heroP: '12 ene – 10 feb',
  lgExp: 'Esperada (planta sana, mismo clima)', lgAct: 'Exportada', hf1: 'perdidos en 28 días de datos', hf2: 'de la energía que debió producir',
  hf3v: '19,0k AUD', hf3: 'a precios de mercado AEMO', qK: 'El análisis', qH: 'Tres preguntas, respondidas con sus propios datos.', q1t: 'Modelo de planta',
  q1h: '¿Cuánto debió producir la planta?',
  q1p: 'Un modelo físico calibrado con sus bloques más sanos, alimentado con la irradiancia, la temperatura y la luz trasera que vio realmente cada bloque.',
  q2t: 'Pérdidas', q2h: '¿Adónde se fue la energía que falta?',
  q2p: 'Una cascada de la energía esperada a la exportada: paradas, curtailment, inversores, buses DC, seguidores, clipping y el resto sin explicar.',
  q3t: 'Fallas y eventos', q3h: '¿Qué pasó, cuándo y en qué equipo?',
  q3p: 'Cada episodio detectado automáticamente, con inicio, duración, energía perdida y su valor, hasta un solo bus DC o seguidor.',
  mK: 'Por qué importa el valor de mercado', mH: 'No todos los megavatios-hora perdidos <em>cuestan lo mismo</em>.',
  mL: 'En el periodo de la demo, el 43 % de la energía perdida cayó en intervalos en que el mercado no pagaba nada por ella. Valorar cada MWh a una tarifa plana habría exagerado el daño más de cuatro veces y mandado al equipo de mantenimiento tras el problema equivocado.',
  cmp1t: 'A una tarifa plana de 70 AUD/MWh', cmp1v: '87,6k AUD', cmp1s: 'todos los MWh perdidos valen lo mismo', cmp2t: 'A precios AEMO de 5 minutos',
  cmp2v: '19,0k AUD', cmp2s: 'precio spot + LGC, con suelo en cero', bT: 'Energía perdida y su valor, por precio de mercado', bU: 'parte del total',
  bRead: '<strong>Cómo leerlo:</strong> el 43 % de la energía perdida cayó a precios negativos y no valía nada, mientras que el 4 %, perdido con precios sobre 100 AUD/MWh, concentró el 31 % del valor. Dos de las paradas de planta ocurrieron a unos −45 AUD/MWh: lo más probable es que la planta se detuviera por precio, no por una falla.',
  dK: 'Qué recibe', dH: 'Un informe para el directorio y un dashboard para el equipo.',
  dL: 'Los dos salen del mismo análisis y muestran las mismas cifras, así que la conversación con su contratista de O&M parte de hechos que todos pueden revisar.',
  r1t: 'Informe escrito · PDF', r1h: 'Los hallazgos, ordenados por lo que valen.',
  r1p: 'Ocho páginas con su logo en la portada: cifras principales, acciones recomendadas por prioridad, el modelo de energía, las pérdidas y su valor de mercado, desviaciones, equipos y el pronóstico a 30 años. Lo revisamos con usted junto a nuestro analista.',
  r1a: 'Pedir un informe de ejemplo', r2t: 'Dashboard en HeliOS', r2h: 'Todas las vistas del análisis, para explorar.',
  r2p: 'Resumen, pérdidas y costo, desviaciones, eventos, seguidores y DC, estaciones meteorológicas y pronóstico a largo plazo, con un selector entre valor de mercado y su tarifa.',
  r2a: 'Ver HeliOS', sK: 'Método', sH: 'De su exportación SCADA a una lista de acciones por prioridad.',
  sL: 'Sin hardware ni software que instalar. Trabajamos con las exportaciones que su SCADA ya produce.', s1h: 'Usted comparte los datos',
  s1p: 'Exportaciones SCADA, el layout de la planta y, si lo tiene, la simulación energética del diseño. Basta una carpeta segura.',
  s2h: 'Los limpiamos y revisamos',
  s2p: 'Fuera las lecturas malas y congeladas, estaciones contrastadas entre sí, y los huecos marcados en vez de rellenados.', s3h: 'Modelamos y valoramos',
  s3p: 'La planta modelada bloque a bloque, cada pérdida ubicada y explicada, y cada una valorada a precio de mercado o a su tarifa.', s4h: 'Se lo explicamos',
  s4p: 'Entregamos el informe y el dashboard, y una sesión con nuestro analista para acordar las primeras acciones.', fK: 'Preguntas',
  fH: 'Antes de enviarnos datos.', f1q: '¿Tenemos que instalar algo?',
  f1a: 'No. Trabajamos con las exportaciones que su sistema SCADA ya produce. Nada se conecta a la red de su planta.', f2q: '¿Cuántos datos necesitan?',
  f2a: 'Un mes de datos de cinco minutos basta para un primer diagnóstico. Un año completo permite separar los efectos estacionales y calibrar el pronóstico de largo plazo con más confianza.',
  f4q: '¿Qué pasa con nuestros datos?',
  f4a: 'Se usan solo para su análisis y nunca se publican. Cualquier cifra que mostremos fuera de su empresa, como la demo de esta página, proviene de una planta ficticia con datos generados por nosotros.',
  cK: 'Contacto', cH: 'Cuéntenos sobre su planta.',
  cL: 'Díganos qué le gustaría entender y le propondremos el análisis adecuado. Respondemos en dos días hábiles.', cM: 'O escríbanos directamente',
  fName: 'Nombre', fCompany: 'Empresa', fEmail: 'Correo de trabajo', fSize: 'Capacidad de la planta', fType: 'Interés', o1: 'Menos de 50 MW',
  o4: 'Más de 300 MW', o5: 'Cartera de plantas', t1: 'Diagnóstico de desempeño', t2: 'Análisis mensual', t3: 'Aún no lo sé',
  fMsg: '¿Qué le gustaría entender?', fMsgPh: 'Por ejemplo: por qué bajó nuestro PR, cuánto nos cuesta el curtailment o cómo funcionan nuestros seguidores',
  fSend: 'Enviar consulta', foot: '© 2026 SolarAI Analytics. Las cifras de la demo son de una planta ficticia.'
};
// textos que solo usa el script
const T = {
  en: { cause: { curtail: 'Curtailment', other: 'Other / unexplained', outage: 'Plant outages', dc: 'DC buses', inverter: 'Inverters', tracker: 'Trackers', clip: 'Clipping' },
        months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        exp: 'Expected', act: 'Exported', lost: 'Lost', price: 'Price with sun', nodata: 'No valid data this day',
        ann1: 'Stopped at negative prices', ann2: 'Curtailed', rowE: 'Energy lost', rowV: 'Value at market',
        bands: ['Below 0 · worth nothing', '0–50 AUD/MWh', '50–100', 'Above 100'],
        tipShare: (p, v, u) => `${p} % of the total · ${v} ${u}`,
        missing: f => `Missing: ${f}.`, badMail: 'Check the email address: it needs an @ and a domain.',
        sending: 'Sending…', sent: 'Thanks. We will reply within two business days.', fail: 'Could not send. Try again or write to hello@solarai.com.au.',
        noGL: 'This browser cannot show 3D (WebGL is off). Open the viewer on a computer to see the replay.', twinTitle: '3D replay of a day at the demo plant',
        noEndpoint: 'This form is not connected to an inbox yet.' },
  es: { cause: { curtail: 'Curtailment', other: 'Otras / sin explicar', outage: 'Paradas de planta', dc: 'Buses DC', inverter: 'Inversores', tracker: 'Seguidores', clip: 'Clipping' },
        months: ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],
        exp: 'Esperada', act: 'Exportada', lost: 'Perdida', price: 'Precio con sol', nodata: 'Día sin datos válidos',
        ann1: 'Parada con precios negativos', ann2: 'Curtailment', rowE: 'Energía perdida', rowV: 'Valor de mercado',
        bands: ['Bajo 0 · sin valor', '0–50 AUD/MWh', '50–100', 'Sobre 100'],
        tipShare: (p, v, u) => `${p} % del total · ${v} ${u}`,
        missing: f => `Falta: ${f}.`, badMail: 'Revise el correo: necesita una @ y un dominio.',
        sending: 'Enviando…', sent: 'Gracias. Responderemos en dos días hábiles.', fail: 'No se pudo enviar. Inténtelo de nuevo o escriba a hello@solarai.com.au.',
        noGL: 'Este navegador no puede mostrar 3D (WebGL está desactivado). Abra el visor en un computador para ver la reproducción.', twinTitle: 'Reproducción 3D de un día en la planta demo',
        noEndpoint: 'Este formulario aún no está conectado a un buzón.' }
};
const COL = { curtail: '--c-curtail', other: '--c-other', outage: '--c-outage', dc: '--c-dc', inverter: '--c-inverter', tracker: '--c-tracker', clip: '--c-clip' };
const BAND_COL = ['var(--v0)', 'var(--v1)', 'var(--v2)', 'var(--v3)'];
const BAND_INK = ['#eef2f8', '#eef2f8', '#1a1006', '#1a1006'];   // texto sobre cada segmento (contraste ≥ 4.5:1)

let lang = 'en';
const t = () => T[lang];

/* número con separador de miles fijo por idioma (Intl en español no agrupa 4 cifras, y queremos 5.137 igual que 13.151) */
function fmt(n, dec = 0) {
  const [i, d] = Math.abs(n).toFixed(dec).split('.');
  const th = lang === 'es' ? '.' : ',', dp = lang === 'es' ? ',' : '.';
  return (n < 0 ? '−' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, th) + (d ? dp + d : '');
}
function dayLabel(iso, long) {
  const [, m, d] = iso.split('-').map(Number);
  return long && lang === 'en' ? `${d} ${t().months[m - 1]}` : `${d} ${t().months[m - 1]}`;
}

/* ---------- idioma ---------- */
const EN = {};   // textos originales del HTML, para volver al inglés
const store = {
  get() { try { return JSON.parse(localStorage.getItem('sai.lang')); } catch { return null; } },
  set(v) { try { localStorage.setItem('sai.lang', JSON.stringify(v)); } catch { /* sin almacenamiento: no pasa nada */ } }
};
function captureEn() {
  document.querySelectorAll('[data-i18n]').forEach(el => { EN[el.dataset.i18n] = el.textContent; });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { EN[el.dataset.i18nHtml] = el.innerHTML; });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { EN[el.dataset.i18nPh] = el.placeholder; });
  document.querySelectorAll('[data-href-es]').forEach(el => { el.dataset.hrefEn = el.getAttribute('href'); });
}
function applyLang(l) {
  lang = l === 'es' ? 'es' : 'en';
  const dict = lang === 'es' ? ES : EN;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { const v = dict[el.dataset.i18n]; if (v) el.textContent = v; });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { const v = dict[el.dataset.i18nHtml]; if (v) el.innerHTML = v; });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { const v = dict[el.dataset.i18nPh]; if (v) el.placeholder = v; });
  document.querySelectorAll('[data-href-es]').forEach(el => el.setAttribute('href', lang === 'es' ? el.dataset.hrefEs : el.dataset.hrefEn));
  document.querySelectorAll('[data-n]').forEach(el => { el.textContent = fmt(+el.dataset.n, +(el.dataset.d || 0)); });
  document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  document.title = lang === 'es' ? 'SolarAI Analytics · Análisis de desempeño de plantas solares' : 'SolarAI Analytics · Performance analysis for solar farms';
  renderDaily(); renderBands(); renderTable();
  relangTwin();
}

/* ---------- tooltip compartido ---------- */
const tip = document.getElementById('tip');
function showTip(html, host, x, y) {
  tip.innerHTML = html;
  const hb = host.getBoundingClientRect();
  tip.classList.add('on');
  const w = tip.offsetWidth, h = tip.offsetHeight;
  let left = hb.left + window.scrollX + x - w / 2;
  left = Math.max(window.scrollX + 8, Math.min(left, window.scrollX + document.documentElement.clientWidth - w - 8));
  tip.style.left = left + 'px';
  tip.style.top = (hb.top + window.scrollY + y - h - 12) + 'px';
}
const hideTip = () => tip.classList.remove('on');
const row = (a, b) => `<div class="r"><span>${a}</span><span>${b}</span></div>`;

const NS = 'http://www.w3.org/2000/svg';
function el(name, attrs, parent) {
  const n = document.createElementNS(NS, name);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}
// barra con el extremo de datos redondeado (4px) y apoyada en la línea base
function barPath(x, y, w, h, r = 4) {
  if (h <= 0) return '';
  r = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

/* ---------- gráfico diario: esperada vs exportada ---------- */
function renderDaily() {
  const host = document.getElementById('c-daily');
  if (!host) return;
  host.textContent = '';
  const W = 520, H = 230, L = 38, R = 4, TOP = 34, B = 24, ymax = 700;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' }, host);
  const pw = (W - L - R) / DAILY.length, y = v => TOP + (H - TOP - B) * (1 - v / ymax);
  const g = el('g', { class: 'grid' }, svg), ax = el('g', { class: 'axis' }, svg);
  [0, 200, 400, 600].forEach(v => {
    el('line', { x1: L, x2: W - R, y1: y(v), y2: y(v) }, g);
    el('text', { x: L - 6, y: y(v) + 3.5, 'text-anchor': 'end' }, ax).textContent = fmt(v);
  });
  el('text', { x: 0, y: TOP - 16 }, ax).textContent = 'MWh';
  DAILY.forEach(([d], i) => {
    if (i % 5) return;
    el('text', { x: L + pw * (i + .5), y: H - 5, 'text-anchor': 'middle' }, ax).textContent = dayLabel(d);
  });
  DAILY.forEach(([d, e, a, p], i) => {
    const x0 = L + pw * i, col = el('g', { class: 'col' }, svg);
    if (e == null) {
      el('line', { x1: x0 + pw / 2, x2: x0 + pw / 2, y1: y(0) - 10, y2: y(0), stroke: 'var(--rule-2)', 'stroke-dasharray': '2 2' }, col);
    } else {
      const we = pw * .76, wa = pw * .42;
      el('path', { class: 'e', d: barPath(x0 + (pw - we) / 2, y(e), we, y(0) - y(e), 3), fill: 'var(--exp)', stroke: 'var(--exp-line)', 'stroke-width': .8 }, col);
      if (a > 0) el('path', { d: barPath(x0 + (pw - wa) / 2, y(a), wa, y(0) - y(a), 2), fill: 'var(--act)' }, col);
    }
    const hit = el('rect', { class: 'hit', x: x0, y: TOP - 8, width: pw, height: H - TOP - B + 8 }, col);
    const show = () => {
      col.classList.add('on');
      const sx = host.clientWidth / W;
      const html = e == null ? `<b>${dayLabel(d, true)}</b>${t().nodata}` :
        `<b>${dayLabel(d, true)}</b>${row(t().exp, fmt(e) + ' MWh')}${row(t().act, fmt(a) + ' MWh')}${row(t().lost, fmt(e - a) + ' MWh')}${row(t().price, fmt(p, 1) + ' AUD/MWh')}`;
      showTip(html, host, (x0 + pw / 2) * sx, y(e == null ? 60 : e) * sx);
    };
    hit.addEventListener('pointerenter', show);
    hit.addEventListener('pointerleave', () => { col.classList.remove('on'); hideTip(); });
  });
  // anotaciones: solo las dos que cuentan la historia
  const ann = el('g', { class: 'ann' }, svg);
  const mark = (i0, i1, text, anchorEnd) => {
    const xa = L + pw * i0 + 2, xb = L + pw * (i1 + 1) - 2, yy = TOP - 10;
    el('line', { x1: xa, x2: xb, y1: yy, y2: yy }, ann);
    el('line', { x1: xa, x2: xa, y1: yy, y2: yy + 4 }, ann);
    el('line', { x1: xb, x2: xb, y1: yy, y2: yy + 4 }, ann);
    el('text', { x: anchorEnd ? xb : xa, y: yy - 5, 'text-anchor': anchorEnd ? 'end' : 'start' }, ann).textContent = text;
  };
  mark(19, 20, t().ann1, true);
  mark(23, 23, t().ann2, false);
}

/* ---------- bandas de precio: energía perdida vs valor ---------- */
function renderBands() {
  const host = document.getElementById('c-bands'), leg = document.getElementById('bands-legend');
  if (!host) return;
  host.textContent = ''; leg.textContent = '';
  t().bands.forEach((b, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<i style="background:${BAND_COL[i]}"></i>`;
    li.appendChild(document.createTextNode(b));
    leg.appendChild(li);
  });
  const W = Math.max(280, Math.round(host.clientWidth || 560)), rowH = 46, LBL = 22, gap = 26, H = 2 * (LBL + rowH) + gap + (BANDS.aud[0] === 0 ? 22 : 0);
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' }, host);
  [['mwh', t().rowE, 'MWh'], ['aud', t().rowV, 'AUD']].forEach(([key, label, unit], r) => {
    const vals = BANDS[key], tot = vals.reduce((s, v) => s + v, 0), shown = key === 'mwh' ? TOTAL.mwh : TOTAL.aud, y0 = r * (LBL + rowH + gap);
    const lt = el('text', { x: 0, y: y0 + 14, class: 'row-lbl', fill: 'var(--ink)' }, svg);
    lt.textContent = `${label} · ${fmt(shown)} ${unit}`;
    lt.setAttribute('style', 'font:600 13px var(--f-sans)');
    let x = 0;
    vals.forEach((v, i) => {
      const w = W * v / tot;
      if (w <= 0) return;
      const gw = Math.max(w - 2, 1);               // 2px de papel entre segmentos
      const seg = el('rect', { x, y: y0 + LBL, width: gw, height: rowH, rx: 3, fill: BAND_COL[i] }, svg);
      const pct = Math.round(100 * v / tot);
      if (gw > 44) {
        const tx = el('text', { x: x + 10, y: y0 + LBL + rowH / 2 + 5, fill: BAND_INK[i] }, svg);
        tx.textContent = pct + ' %';
        tx.setAttribute('style', 'font:500 14px var(--f-mono);pointer-events:none');
      }
      const cx = x + gw / 2;
      seg.style.cursor = 'default';
      seg.addEventListener('pointerenter', () => {
        const sx = host.clientWidth / W;
        showTip(`<b>${t().bands[i]}</b>${t().tipShare(pct, fmt(v), unit)}`, host, cx * sx, (y0 + LBL) * sx);
      });
      seg.addEventListener('pointerleave', hideTip);
      x += w;
    });
    if (vals[0] === 0) {   // el tramo negativo no vale nada: se marca con texto para que no "desaparezca"
      const z = el('text', { x: 0, y: y0 + LBL + rowH + 16, fill: 'var(--ink-3)' }, svg);
      z.textContent = lang === 'es' ? '0 % del valor bajo 0 AUD/MWh' : '0 % of the value below 0 AUD/MWh';
      z.setAttribute('style', 'font:400 11.5px var(--f-sans)');
    }
  });
}

/* ---------- tabla de pérdidas ---------- */
function renderTable() {
  const tb = document.getElementById('loss-rows');
  if (!tb) return;
  const max = Math.max(...LOSSES.map(r => r.aud));
  tb.innerHTML = LOSSES.map(r => `<tr>
      <td><span class="dot" style="background:var(${COL[r.k]})"></span>${t().cause[r.k]}</td>
      <td>${fmt(r.mwh, r.mwh < 10 ? 1 : 0)}</td>
      <td>${fmt(r.mwh * TARIFF)}</td>
      <td><span class="bar-cell"><i style="width:${Math.max(2, 70 * r.aud / max).toFixed(0)}px;background:var(${COL[r.k]})"></i>${fmt(r.aud)}</span></td>
      <td>${fmt(r.aud / r.mwh, 1)}</td></tr>`).join('');
  const f = document.querySelectorAll('tfoot td');
  const { mwh, aud } = TOTAL;
  if (f.length === 5) { f[1].textContent = fmt(mwh); f[2].textContent = fmt(mwh * TARIFF); f[3].textContent = fmt(aud); f[4].textContent = fmt(aud / mwh, 1); }
}

/* ---------- formulario: valida, envía a FormSubmit y nunca finge un envío ---------- */
function wireForm() {
  const form = document.getElementById('enquiry'), msg = document.getElementById('f-out');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.className = 'form-msg';
    const bad = [...form.querySelectorAll('[required]')].find(x => !x.value.trim() || !x.checkValidity());
    if (bad) {
      msg.classList.add('warn');
      msg.textContent = bad.type === 'email' && bad.value.trim() ? t().badMail : t().missing(bad.closest('label').querySelector('span').textContent.trim());
      bad.focus(); return;
    }
    const endpoint = form.dataset.endpoint;
    if (!endpoint) { msg.classList.add('warn'); msg.textContent = t().noEndpoint; return; }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; msg.textContent = t().sending;
    const data = new FormData(form); data.append('language', lang);
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || String(j.success) === 'false') throw new Error(j.message || String(r.status));
      form.reset(); msg.classList.add('ok'); msg.textContent = t().sent;
    } catch {
      msg.classList.add('warn'); msg.textContent = t().fail;
    } finally { btn.disabled = false; }
  });
}

/* ---------- gemelo 3D ----------
   El visor (WebGL) pesa: se crea el iframe solo cuando la sección se acerca a la pantalla
   y se le pide que deje de dibujar cuando sale de la vista. */
const stage = document.getElementById('stage');
let twin = null, twinOn = false;
function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); }
  catch { return false; }
}
function twinSrc() { return stage.dataset.src + (lang === 'es' ? '&lang=es' : ''); }
function twinSay(v) { if (twin && twin.contentWindow) twin.contentWindow.postMessage({ sai: v }, location.origin); }
function mountTwin() {
  if (twin || !stage) return;
  if (!hasWebGL()) { document.getElementById('stage-msg').textContent = t().noGL; return; }
  twin = document.createElement('iframe');
  twin.title = t().twinTitle;
  twin.src = twinSrc();
  twin.addEventListener('load', () => { document.getElementById('stage-msg').hidden = true; if (!twinOn) twinSay('pause'); });
  stage.append(twin);
}
function relangTwin() {   // el visor toma el idioma al cargar: si ya está montado, se recarga en el nuevo idioma
  if (!twin) return;
  twin.title = t().twinTitle;
  if (twin.getAttribute('src') !== twinSrc()) { document.getElementById('stage-msg').hidden = false; twin.src = twinSrc(); }
}
function wireTwin() {
  if (!stage) return;
  if (!('IntersectionObserver' in window)) { twinOn = true; mountTwin(); return; }
  new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) mountTwin(); }, { rootMargin: '400px 0px' }).observe(stage);
  new IntersectionObserver(es => { const v = es.some(e => e.isIntersecting); if (v !== twinOn) { twinOn = v; twinSay(v ? 'play' : 'pause'); } }, { threshold: 0.05 }).observe(stage);
}

/* ---------- arranque ---------- */
captureEn();
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => { store.set(b.dataset.lang); applyLang(b.dataset.lang); }));
window.addEventListener('scroll', hideTip, { passive: true });
let rz, lastW = innerWidth;   // el gráfico de bandas se dibuja a tamaño real: se redibuja si cambia el ancho
window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (innerWidth !== lastW) { lastW = innerWidth; renderBands(); } }, 150); });
wireForm();
wireTwin();
const q =new URLSearchParams(location.search).get('lang');
applyLang(q || store.get() || (navigator.language || '').slice(0, 2));
})();
