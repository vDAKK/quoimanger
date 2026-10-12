// Interface : questionnaire, menu, explorateur, liste de courses.

const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const img = (src, alt = '', cls = '') => `<img src="${esc(src)}" alt="${esc(alt)}" class="${cls}" loading="lazy" onerror="this.style.visibility='hidden'">`;
const med = (thumb) => thumb ? thumb + '/medium' : '';
const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const fmtMinutes = (n) => n < 60 ? `${n} min` : `${Math.floor(n / 60)} h${n % 60 ? ' ' + String(n % 60).padStart(2, '0') : ''}`;

const ICON = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20.5" r="1"/><circle cx="17" cy="20.5" r="1"/></svg>',
  dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 10v11H3V10h4Zm0 0 4-8a3 3 0 0 1 3 3v4h5.5a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18.1 21H7"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M17 14V3h4v11h-4Zm0 0-4 8a3 3 0 0 1-3-3v-4H4.5a2 2 0 0 1-2-2.3l1.4-8A2 2 0 0 1 5.9 3H17"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h13l-3-3M20 17H7l3 3"/></svg>',
};

const DEFAULT_PREFS = {
  objectives: [], craving: null, diet: null, avoid: [], nutrition: [],
  cuisines: {}, flavours: {}, proteins: {}, dishes: {}, nights: 4, portions: 2,
};

const S = {
  db: [], byId: new Map(), ranked: [], rankedById: new Map(), dbInfo: null,
  prefs: store.get('qm_prefs', null),
  feedback: store.get('qm_feedback', {}),
  planIds: store.get('qm_plan', []),
  planStart: store.get('qm_plan_start', null),
  shopMode: store.get('qm_shop_mode', 'rayon'),
  shopFilter: null,
  recipeTab: 'ingr',
  shopChecked: store.get('qm_shop', {}),
  draft: null, step: 0, view: 'menu',
  explore: { q: '', quick: false, veggie: false, cuisine: '', limit: 24 },
  swapped: new Set(),
  rep: {},
};

const saveLocal = () => {
  store.set('qm_prefs', S.prefs); store.set('qm_feedback', S.feedback);
  store.set('qm_plan', S.planIds); store.set('qm_shop', S.shopChecked);
  store.set('qm_plan_start', S.planStart); store.set('qm_shop_mode', S.shopMode);
};
// État partagé avec les autres appareils du foyer.
const sharedState = () => ({
  prefs: S.prefs, feedback: S.feedback, planIds: S.planIds, planStart: S.planStart, shop: S.shopChecked,
  store: store.get('qm_store', null), rayons: store.get('qm_rayons', null),
});
const save = () => { saveLocal(); Sync.push(sharedState()); };

// Un autre appareil du foyer a modifié les données : on les applique ici.
function applyRemote(data, changed = []) {
  if (data.prefs) S.prefs = data.prefs;
  S.feedback = data.feedback || {};
  S.planIds = data.planIds || [];
  S.planStart = data.planStart || null;
  S.shopChecked = data.shop || {};
  if (data.store) store.set('qm_store', data.store); else store.del('qm_store');
  if (data.rayons) store.set('qm_rayons', data.rayons); else store.del('qm_rayons');
  saveLocal();
  if (!S.prefs || !S.db.length) return;
  rerank();
  if (S.draft) return; // questionnaire en cours : on ne l'interrompt pas
  if ($('#nav').hidden) showView('menu'); else refreshCurrent();
  if (changed.some(k => k === 'planIds' || k === 'prefs')) toast('🔄 Menu mis à jour depuis l’autre téléphone');
}

function renderSyncPill() {
  const pill = $('#sync-pill');
  if (!pill) return;
  pill.hidden = !Sync.code;
  pill.dataset.status = Sync.status;
  pill.title = { online: 'Foyer synchronisé', offline: 'Hors connexion : synchro au retour du réseau', connecting: 'Connexion…', error: 'Erreur de synchronisation', off: '' }[Sync.status] || '';
  if (S.view === 'prefs' && !S.draft && $('#sync-card')) $('#sync-card').outerHTML = syncCard();
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast.timer); toast.timer = setTimeout(() => (t.hidden = true), 2200);
}

// ---------- Démarrage ----------
async function boot() {
  app.innerHTML = `<div class="loading">
    <h1>On prépare la cuisine…</h1>
    <p class="sub" id="load-msg">Récupération de la base de plats TheMealDB</p>
    <div class="bar"><div id="load-bar"></div></div>
  </div>`;
  try {
    const info = await loadDatabase((done, total, n) => {
      $('#load-bar').style.width = (done / total * 100) + '%';
      $('#load-msg').textContent = `${n} plats récupérés (${done}/${total})`;
    });
    S.dbInfo = info;
    const seenNames = new Set();
    S.db = info.meals.filter(m => {
      const k = m.name.toLowerCase().replace(/[^a-z]/g, '');
      if (seenNames.has(k)) return false;
      seenNames.add(k); return true;
    }).map(enrich);
    S.byId = new Map(S.db.map(m => [m.id, m]));
    computeRepresentatives();
    if (info.source === 'snapshot') toast('API injoignable : copie locale utilisée');
  } catch (e) {
    app.innerHTML = `<div class="empty"><h2>Impossible de charger la base de plats</h2><p class="sub">${esc(e.message)}</p>
      <button class="btn primary" onclick="location.reload()">Réessayer</button></div>`;
    return;
  }
  Sync.onRemote = applyRemote;
  Sync.onStatus = renderSyncPill;
  if (Sync.code && Sync.available) Sync.connect();
  renderSyncPill();

  // Lien d'invitation : …#foyer=XXXXX-XXXXX
  const invite = (location.hash.match(/foyer=([A-Za-z0-9-]+)/) || [])[1];
  if (invite) history.replaceState(null, '', location.pathname);
  if (invite && Sync.available && Sync.normalize(invite) !== Sync.code) { await joinHousehold(invite, true); return; }

  if (S.prefs) { rerank(); if (!S.planIds.length) newPlan(); showView('menu'); }
  else startWizard();
}

async function joinHousehold(code, fromLink = false) {
  const fallback = () => { if (!fromLink) return; if (S.prefs) { rerank(); showView('menu'); } else startWizard(); };
  if (S.prefs && !confirm('Rejoindre ce foyer ? Vos préférences et votre menu seront remplacés par ceux du foyer partagé.')) { fallback(); return; }
  try {
    toast('Connexion au foyer…');
    const data = await Sync.join(code);
    S.draft = null;
    applyRemote(data, []);
    if (S.prefs) { showView('menu'); toast('✅ Foyer rejoint : vous partagez maintenant les mêmes données'); }
    else startWizard();
  } catch (e) {
    toast(e.message || 'Impossible de rejoindre le foyer');
    fallback();
  }
}

function rerank() {
  S.ranked = rankAll(S.db, S.prefs, S.feedback);
  S.rankedById = new Map(S.ranked.map(r => [r.m.id, r]));
}

function newPlan() {
  const plan = buildPlan(S.ranked, S.prefs, S.prefs.nights);
  S.planIds = plan.map(p => p.m.id);
  S.planStart = todayISO();
  S.shopChecked = {};
  S.swapped = new Set();
  save();
}

const planEntries = () => S.planIds.map(id => S.rankedById.get(id) || (S.byId.get(id) && { m: S.byId.get(id), score: null, reasons: [] })).filter(Boolean);

// Images représentatives pour le questionnaire, tirées de la base elle-même.
function computeRepresentatives() {
  const mains = S.db.filter(m => m.f.isDinner && !m.f.isSide && m.thumb);
  const best = (filter, key) => {
    const list = mains.filter(filter);
    if (!list.length) return '';
    list.sort((a, b) => key(b) - key(a));
    return med(list[0].thumb);
  };
  S.rep.craving = {
    quick: best(m => m.f.time <= 20 && m.f.veg >= 2, m => m.f.veg - m.f.heavy),
    chef: best(m => m.f.types.includes('plate'), m => m.f.chef * 2 - m.f.offal * 5 + m.f.veg),
    family: best(m => m.f.types.includes('pasta') || m.f.types.includes('pizza'), m => m.f.family),
  };
  S.rep.diet = {
    all: best(m => m.f.main === 'beef', m => m.f.veg + m.f.chef),
    flexi: best(m => m.f.isVeggie && m.f.proteins.has('plant'), m => m.f.veg),
    veggie: best(m => m.f.isVeggie, m => m.f.veg * 2 - m.f.heavy),
    pesco: best(m => m.f.main === 'fish', m => m.f.veg),
  };
  S.rep.cuisine = {};
  CUISINES.forEach(c => (S.rep.cuisine[c.id] = best(m => m.f.cuisine === c.id, m => m.f.chef + m.f.veg - m.f.offal * 5)));
  S.rep.dish = {};
  DISH_TYPES.forEach(d => (S.rep.dish[d.id] = best(m => m.f.types[0] === d.id, m => m.f.veg - m.f.offal * 5 + (m.f.types.length === 1 ? 3 : 0))));
  S.rep.nutrition = best(m => m.f.veg >= 4 && m.f.heavy <= 1 && m.f.main === 'fish', m => m.f.veg);
  // préchargement pour un questionnaire fluide
  [S.rep.craving, S.rep.diet, S.rep.cuisine, S.rep.dish].forEach(o => Object.values(o).forEach(src => src && (new Image().src = src)));
}

// ---------- Questionnaire ----------
function startWizard(fromPrefs = false) {
  S.draft = JSON.parse(JSON.stringify(fromPrefs && S.prefs ? S.prefs : DEFAULT_PREFS));
  S.step = 0;
  $('#nav').hidden = true;
  $('#wizard-bar').hidden = false;
  document.body.classList.add('wizard');
  renderStep();
}

const voteBtns = (key, id) => {
  const v = S.draft[key][id];
  return `<div class="thumbs">
    <button class="thumb up ${v === 1 ? 'on' : ''}" data-action="vote" data-key="${key}" data-val="${id}" data-dir="1" aria-label="J’aime">${ICON.up}</button>
    <button class="thumb down ${v === -1 ? 'on' : ''}" data-action="vote" data-key="${key}" data-val="${id}" data-dir="-1" aria-label="Je n’aime pas">${ICON.down}</button>
  </div>`;
};

const STEPS = [
  {
    title: 'Quels sont vos objectifs ?', sub: 'Choisissez jusqu’à 3 objectifs.',
    valid: d => d.objectives.length > 0,
    render: d => `<div class="grid two">${OBJECTIVES.map(o =>
      `<button class="opt ${d.objectives.includes(o.id) ? 'on' : ''}" data-action="toggle" data-key="objectives" data-val="${o.id}" data-max="3">${o.label}</button>`).join('')}</div>`,
  },
  {
    title: 'Ça tombe bien, on a ce qu’il faut.',
    render: d => {
      const ids = d.objectives.length ? d.objectives : ['eco', 'time', 'nutri'];
      return `<div class="pitch">${ids.map(id => {
        const [ico, t, p] = OBJECTIVE_PITCH[id];
        return `<div class="row"><span class="ico">${ico}</span><div><b>${t}</b><p>${p}</p></div></div>`;
      }).join('')}
      <div class="row"><span class="ico">📚</span><div><b>${S.db.length} plats du monde entier.</b><p>Récupérés en direct depuis la base TheMealDB, et triés rien que pour vous.</p></div></div></div>`;
    },
  },
  {
    title: 'Qu’est-ce qui vous fait envie ?',
    valid: d => !!d.craving,
    render: d => `<div class="grid three">${CRAVINGS.map(c => `
      <button class="opt img-card ${d.craving === c.id ? 'on' : ''}" data-action="pick" data-key="craving" data-val="${c.id}">
        ${img(S.rep.craving[c.id], c.label)}
        <div class="body"><div class="title">${c.label}</div><div class="desc">${c.desc}</div></div>
      </button>`).join('')}</div>`,
  },
  {
    title: 'Quel est votre profil alimentaire ?',
    valid: d => !!d.diet,
    render: d => `<div class="grid four">${DIETS.map(c => `
      <button class="opt img-card ${d.diet === c.id ? 'on' : ''}" data-action="pick" data-key="diet" data-val="${c.id}">
        ${img(S.rep.diet[c.id], c.label)}
        <div class="body"><div class="title">${c.label}</div><div class="desc">${c.desc}</div></div>
      </button>`).join('')}</div>`,
  },
  {
    title: 'Des ingrédients à éviter ?', sub: 'Vous pouvez passer cette section si vous ne voulez pas y répondre.',
    render: d => `<div class="grid tiles">
      <button class="opt center" data-action="skip-avoid">Passer</button>
      ${AVOID.map(a => `<button class="opt ${d.avoid.includes(a.id) ? 'on' : ''}" data-action="toggle" data-key="avoid" data-val="${a.id}">
        <span class="icon">${a.icon}</span>${a.label}</button>`).join('')}</div>`,
  },
  {
    title: 'Des préférences côté nutrition ?', sub: 'Facultatif — plusieurs choix possibles.',
    render: d => `<div class="split"><div class="grid two">${NUTRITION.map(n =>
      `<button class="opt slim ${d.nutrition.includes(n.id) ? 'on' : ''}" data-action="toggle" data-key="nutrition" data-val="${n.id}">${n.label}</button>`).join('')}</div>
      ${S.rep.nutrition ? img(S.rep.nutrition.replace('/medium', ''), '', 'hero') : ''}</div>`,
  },
  {
    title: 'Vos cuisines préférées ?',
    render: () => `<div class="grid votes">${CUISINES.map(c => `
      <div class="vote">${img(S.rep.cuisine[c.id], c.label)}<div class="name">${c.label}</div>${voteBtns('cuisines', c.id)}</div>`).join('')}</div>`,
  },
  {
    title: 'Des saveurs qui vous font craquer ?',
    render: () => `<div class="grid votes small">${FLAVOURS.map(f => `
      <div class="vote tile"><div class="emoji">${f.icon}</div><div class="name">${f.label}</div>${voteBtns('flavours', f.id)}</div>`).join('')}</div>`,
  },
  {
    title: 'Quelles protéines vous font envie ?',
    render: d => {
      const hidden = d.diet === 'veggie' ? ['beef', 'pork', 'poultry', 'lamb', 'fish', 'seafood'] : d.diet === 'pesco' ? ['beef', 'pork', 'poultry', 'lamb'] : [];
      return `<div class="grid votes small">${PROTEINS.filter(p => !hidden.includes(p.id) && !d.avoid.includes(p.id)).map(p => `
        <div class="vote tile">${img(ING_IMG(p.img), p.label, 'ing')}<div class="name">${p.label}</div>${voteBtns('proteins', p.id)}</div>`).join('')}</div>`;
    },
  },
  {
    title: 'À quoi ressemble votre dîner idéal ?',
    render: () => `<div class="grid votes">${DISH_TYPES.map(t => `
      <div class="vote">${img(S.rep.dish[t.id], t.label)}<div class="name">${t.label}</div>${voteBtns('dishes', t.id)}</div>`).join('')}</div>`,
  },
  {
    title: 'Combien de soirs par semaine ?',
    render: d => `<div class="grid two">${NIGHTS.map(n =>
      `<button class="opt slim ${d.nights === n.id ? 'on' : ''}" data-action="pick" data-key="nights" data-val="${n.id}" data-num="1">${n.label}</button>`).join('')}</div>
      <div class="seg-label">Portions par dîner</div>
      <div class="seg">${[1, 2, 3, 4, 5, 6].map(v => `<button class="${d.portions === v ? 'on' : ''}" data-action="pick" data-key="portions" data-val="${v}" data-num="1">${v}</button>`).join('')}</div>
      <div class="seg-label">Dîners par semaine</div>
      <div class="seg">${[1, 2, 3, 4, 5, 6, 7].map(v => `<button class="${d.nights === v ? 'on' : ''}" data-action="pick" data-key="nights" data-val="${v}" data-num="1">${v}</button>`).join('')}</div>`,
  },
];

function renderStep() {
  const st = STEPS[S.step];
  app.innerHTML = `<div class="step-head"><h1>${st.title}</h1>${st.sub ? `<p class="sub">${st.sub}</p>` : ''}</div>${st.render(S.draft)}`;
  $('#step-count').hidden = false;
  $('#step-count').textContent = `${S.step + 1} / ${STEPS.length}`;
  $('#progress-fill').style.width = ((S.step + 1) / STEPS.length * 100) + '%';
  $('#btn-back').style.visibility = S.step === 0 && !S.prefs ? 'hidden' : 'visible';
  $('#btn-back').textContent = S.step === 0 ? 'Annuler' : 'Retour';
  $('#btn-next').disabled = st.valid ? !st.valid(S.draft) : false;
  $('#btn-next').textContent = S.step === STEPS.length - 1 ? 'Voir mon menu' : 'Continuer';
}

function nextStep() {
  if (S.step < STEPS.length - 1) { S.step++; renderStep(); window.scrollTo(0, 0); return; }
  // Fin du questionnaire
  S.prefs = S.draft;
  S.draft = null;
  $('#wizard-bar').hidden = true;
  rerank();
  newPlan();
  showView('menu');
  toast(`${S.ranked.length} plats correspondent à votre profil`);
}

function prevStep() {
  if (S.step === 0) { if (S.prefs) { $('#wizard-bar').hidden = true; showView('menu'); } return; }
  S.step--; renderStep(); window.scrollTo(0, 0);
}

$('#btn-next').addEventListener('click', nextStep);
$('#btn-back').addEventListener('click', prevStep);

function wizardClick(el) {
  const d = S.draft, { action, key, val } = el.dataset;
  if (action === 'pick') d[key] = el.dataset.num ? +val : val;
  else if (action === 'toggle') {
    const list = d[key];
    const i = list.indexOf(val);
    if (i >= 0) list.splice(i, 1);
    else {
      const max = +el.dataset.max || Infinity;
      if (list.length >= max) { toast(`${max} choix maximum`); return; }
      list.push(val);
    }
  } else if (action === 'vote') {
    const dir = +el.dataset.dir;
    if (d[key][val] === dir) delete d[key][val]; else d[key][val] = dir;
  } else if (action === 'skip-avoid') { d.avoid = []; nextStep(); return; }
  const y = window.scrollY;
  renderStep();
  window.scrollTo(0, y);
}

// ---------- Vues principales ----------
function showView(v) {
  S.view = v;
  $('#nav').hidden = false;
  $('#wizard-bar').hidden = true;
  $('#step-count').hidden = true;
  document.body.classList.remove('wizard');
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  ({ menu: renderMenu, explore: renderExplore, shop: renderShop, prefs: renderPrefs })[v]();
  updateCartBadge();
  app.classList.remove('enter'); void app.offsetWidth; app.classList.add('enter');
  window.scrollTo(0, 0);
}

function updateCartBadge() {
  const badge = $('#cart-badge');
  if (!badge || !S.prefs) return;
  const sh = buildShopping(planEntries(), S.prefs.portions);
  const left = sh.byRayon.flatMap(g => g.items).filter(it => !S.shopChecked[it.key]).length;
  badge.textContent = left;
  badge.hidden = !left;
}

function matchPct(score) {
  if (score == null || !S.ranked.length) return null;
  const max = S.ranked[0].score, min = S.ranked[S.ranked.length - 1].score;
  return Math.round(55 + 44 * (score - min) / Math.max(1, max - min));
}

// Jour associé à chaque dîner du menu, à partir de la date de création du menu.
function dayInfo(idx) {
  const start = S.planStart ? new Date(S.planStart + 'T12:00:00') : new Date();
  const d = new Date(start); d.setDate(start.getDate() + idx);
  const diff = Math.round((new Date(d.toDateString()) - new Date(new Date().toDateString())) / 86400000);
  const name = DAYS[d.getDay()];
  return {
    label: diff === 0 ? 'Ce soir' : diff === 1 ? 'Demain' : name,
    short: name.slice(0, 3).toUpperCase(), num: d.getDate(), diff,
  };
}

const planIndexOf = (id) => S.planIds.indexOf(id);

function tagsFor(m, max = 4, basics = true) {
  const f = m.f, out = [];
  if (basics) {
    out.push(`<span class="tag">${ICON.clock}${fmtMinutes(f.time)}</span>`);
    out.push(`<span class="tag">${esc(cuisineLabel(f.cuisine))}</span>`);
  }
  if (f.isVeggie) out.push('<span class="tag green">🌱 Végé</span>');
  else if (f.main !== 'veg') out.push(`<span class="tag">${esc(proteinLabel(f.main))}</span>`);
  if (f.hot >= 2) out.push('<span class="tag red">🌶️ Pimenté</span>');
  if (f.heavy === 0) out.push('<span class="tag green">Léger</span>');
  if (f.overnight) out.push('<span class="tag">🌙 Prévoir la veille</span>');
  return out.length ? `<div class="tags">${out.slice(0, max).join('')}</div>` : '';
}

// ----- Ma semaine -----
function renderMenu() {
  const plan = planEntries();
  const P = S.prefs;
  const h = new Date().getHours();
  const hello = h < 5 || h >= 18 ? 'Bonsoir' : h < 12 ? 'Bonjour' : 'Bon après-midi';
  const totalTime = plan.reduce((t, r) => t + r.m.f.time, 0);
  const featuredIdx = Math.max(0, plan.findIndex((_, i) => dayInfo(i).diff === 0));
  const feat = plan[featuredIdx];
  const sh = plan.length ? buildShopping(plan, P.portions) : null;
  const left = sh ? sh.byRayon.flatMap(g => g.items).filter(it => !S.shopChecked[it.key]).length : 0;

  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">${hello} 👋</p>
      <h1>Votre semaine</h1>
      <div class="stats">
        <span><b>${plan.length}</b> dîner${plan.length > 1 ? 's' : ''}</span>
        <span><b>${P.portions}</b> pers.</span>
        <span><b>${fmtMinutes(totalTime)}</b> en cuisine</span>
      </div>
    </section>

    ${feat ? `
    <article class="feature" data-action="open" data-id="${feat.m.id}">
      ${img(med(feat.m.thumb), feat.m.name)}
      <div class="feature-shade"></div>
      <div class="feature-body">
        <span class="pill lime">${dayInfo(featuredIdx).label === 'Ce soir' ? '🍽️ Ce soir' : dayInfo(featuredIdx).label}</span>
        <h2>${esc(feat.m.name)}</h2>
        ${tagsFor(feat.m, 3)}
        <div class="feature-actions">
          <span class="btn lime">Voir la recette ${ICON.chev}</span>
          <button class="btn glass" data-action="swap" data-idx="${featuredIdx}" title="Proposer un autre plat">${ICON.swap} Changer</button>
        </div>
      </div>
    </article>` : `<div class="empty"><div class="empty-ico">🍽️</div><h2>Aucun dîner prévu</h2><p class="sub">Générez une semaine ou ajoutez des recettes depuis l’onglet Recettes.</p></div>`}

    ${plan.length > 1 ? `
    <h2 class="section-title">Au menu cette semaine</h2>
    <div class="day-list">${plan.map((r, i) => i === featuredIdx ? '' : dayRow(r, i)).join('')}</div>` : ''}

    ${plan.length ? `
    <button class="cta-card" data-action="goto" data-view="shop">
      <span class="cta-ico">${ICON.cart}</span>
      <span><b>Liste de courses</b><small>${left ? `${left} article${left > 1 ? 's' : ''} à acheter pour ${plan.length} recettes` : 'Tout est dans le caddie ✓'}</small></span>
      ${ICON.chev}
    </button>` : ''}

    <div class="menu-tools">
      ${plan.length < P.nights ? `<button class="btn" data-action="fill">${ICON.plus} Ajouter ${P.nights - plan.length} dîner(s)</button>` : ''}
      <button class="btn" data-action="regen">${ICON.dice} Nouvelle semaine</button>
      <button class="btn" data-action="goto" data-view="explore">Parcourir les recettes</button>
    </div>
    <p class="source-note">Touchez un plat pour voir la recette. ⇄ propose un autre plat pour ce jour.</p>`;
}

function dayRow(r, i) {
  const m = r.m, d = dayInfo(i);
  return `<div class="day-row">
    <div class="day-date ${d.diff === 0 ? 'today' : ''}"><span>${d.short}</span><b>${d.num}</b></div>
    <button class="day-card" data-action="open" data-id="${m.id}">
      ${img(m.thumb ? m.thumb + '/small' : '', m.name)}
      <span class="day-txt"><b>${esc(m.name)}</b><small>${fmtMinutes(m.f.time)} · ${esc(cuisineLabel(m.f.cuisine))}${m.f.isVeggie ? ' · 🌱' : ''}</small></span>
    </button>
    <button class="round-btn" data-action="swap" data-idx="${i}" title="Changer ce plat" aria-label="Changer ce plat">${ICON.swap}</button>
  </div>`;
}

// ----- Recettes -----
function exploreResults() {
  const E = S.explore;
  const q = E.q.trim().toLowerCase();
  let list = S.ranked;
  if (q) list = list.filter(({ m }) => (m.name + ' ' + cuisineLabel(m.f.cuisine) + ' ' + m.country + ' ' + m.ingr.map(i => i.n + ' ' + trIng(i.n)).join(' ')).toLowerCase().includes(q));
  if (E.quick) list = list.filter(({ m }) => m.f.time <= 30);
  if (E.veggie) list = list.filter(({ m }) => m.f.isVeggie);
  if (E.cuisine) list = list.filter(({ m }) => m.f.cuisine === E.cuisine);
  return list;
}

function recipeTile(r) {
  const m = r.m, inPlan = S.planIds.includes(m.id), pct = matchPct(r.score);
  return `<article class="tile" data-action="open" data-id="${m.id}">
    <div class="tile-pic">${img(med(m.thumb), m.name)}
      ${pct ? `<span class="tile-match">${pct} %</span>` : ''}
      <button class="tile-add ${inPlan ? 'on' : ''}" data-action="${inPlan ? 'noop' : 'add'}" data-id="${m.id}" aria-label="${inPlan ? 'Déjà dans ma semaine' : 'Ajouter à ma semaine'}">${inPlan ? ICON.check : ICON.plus}</button>
    </div>
    <div class="tile-body"><b>${esc(m.name)}</b><small>${fmtMinutes(m.f.time)} · ${esc(cuisineLabel(m.f.cuisine))}</small></div>
  </article>`;
}

function renderExploreResults() {
  const list = exploreResults();
  $('#explore-results').innerHTML = list.length
    ? `<p class="result-count">${list.length} recettes · triées selon vos goûts</p>
       <div class="tiles">${list.slice(0, S.explore.limit).map(recipeTile).join('')}</div>
       ${list.length > S.explore.limit ? '<div class="more"><button class="btn" data-action="more">Voir plus de recettes</button></div>' : ''}`
    : '<div class="empty"><div class="empty-ico">🔍</div><h2>Aucune recette</h2><p class="sub">Essayez un autre mot ou retirez un filtre.</p></div>';
}

function renderExplore() {
  const E = S.explore;
  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">${S.ranked.length} recettes pour vous</p>
      <h1>Recettes</h1>
    </section>
    <div class="search">
      ${ICON.search}
      <input type="search" id="q" placeholder="Plat, ingrédient : poulet, curry, feta…" value="${esc(E.q)}" autocomplete="off">
    </div>
    <div class="chip-row filters-row">
      <button class="toggle ${E.quick ? 'on' : ''}" data-action="filter" data-key="quick">⏱ Rapide</button>
      <button class="toggle ${E.veggie ? 'on' : ''}" data-action="filter" data-key="veggie">🌱 Végé</button>
      <button class="toggle ${!E.cuisine ? 'on' : ''}" data-action="cuisine" data-id="">Toutes</button>
      ${CUISINES.map(c => `<button class="toggle ${E.cuisine === c.id ? 'on' : ''}" data-action="cuisine" data-id="${c.id}">${c.label}</button>`).join('')}
    </div>
    <div id="explore-results"></div>`;
  renderExploreResults();
  $('#q').addEventListener('input', e => { E.q = e.target.value; E.limit = 24; renderExploreResults(); });
}

// ----- Courses -----
// Recettes qui utilisent l'ingrédient : noms si 1–2 recettes, sinon pastilles photo compactes.
function recipeChips(it) {
  const ids = [...it.meals].filter(id => S.byId.has(id));
  if (ids.length <= 2) return `<span class="uses">${ids.map(id => {
    const m = S.byId.get(id), i = planIndexOf(id);
    return `<button class="use" data-action="open" data-id="${id}" title="${esc(m.name)}">${img(m.thumb ? m.thumb + '/small' : '', '')}<span>${i >= 0 ? dayInfo(i).short.toLowerCase() + ' · ' : ''}${esc(shortName(m.name))}</span></button>`;
  }).join('')}</span>`;
  return `<span class="uses stack">${ids.map(id => {
    const m = S.byId.get(id), i = planIndexOf(id);
    return `<button class="ava" data-action="open" data-id="${id}" title="${i >= 0 ? dayInfo(i).label + ' · ' : ''}${esc(m.name)}">${img(m.thumb ? m.thumb + '/small' : '', m.name)}</button>`;
  }).join('')}<span class="stack-txt">${ids.length} recettes</span></span>`;
}
const shortName = (n) => n.length > 22 ? n.slice(0, 20).trim() + '…' : n;

function shopRow(it, qty = it.qty, withUses = true) {
  const done = !!S.shopChecked[it.key];
  return `<div class="shop-item ${done ? 'done' : ''}">
    <label class="tick"><input type="checkbox" data-action="check" data-key="${esc(it.key)}" ${done ? 'checked' : ''}><span class="box">${ICON.check}</span></label>
    <div class="shop-txt">
      <div class="shop-line"><b>${esc(it.fr)}</b><span class="qty">${esc(qty)}</span></div>
      ${withUses ? recipeChips(it) : ''}
    </div>
    <a class="find" href="${intermarcheSearch(it.fr)}" target="_blank" rel="noopener" title="Chercher sur intermarche.com" aria-label="Chercher ${esc(it.fr)} sur Intermarché">${ICON.search}</a>
  </div>`;
}

function renderShop() {
  const plan = planEntries();
  const P = S.prefs;
  const sh = buildShopping(plan, P.portions);
  const st = getStore();
  const all = sh.byRayon.flatMap(g => g.items);
  const doneCount = all.filter(it => S.shopChecked[it.key]).length;
  const sortDone = (items) => [...items].sort((x, y) => !!S.shopChecked[x.key] - !!S.shopChecked[y.key]);
  const filt = S.shopFilter && plan.some(r => r.m.id === S.shopFilter) ? S.shopFilter : null;
  const keep = (it) => !filt || it.meals.has(filt);

  let body = '';
  if (S.shopMode === 'recipe') {
    const factor = P.portions / BASE_SERVINGS;
    const byKey = new Map([...all, ...sh.pantry].map(it => [it.key, it]));
    body = plan.filter(r => !filt || r.m.id === filt).map(r => {
      const i = planIndexOf(r.m.id), d = dayInfo(i);
      const seen = new Set();
      const rows = r.m.ingr.map(ing => {
        const info = ingInfo(ing.n); if (info.skip) return '';
        const it = byKey.get(info.fr.toLowerCase()); if (!it || seen.has(it.key)) return '';
        seen.add(it.key);
        return shopRow(it, measureFr(ing.m, factor, ing.n) || 'selon besoin', false);
      }).join('');
      return `<section class="shop-sec">
        <button class="recipe-head" data-action="open" data-id="${r.m.id}">${img(r.m.thumb ? r.m.thumb + '/small' : '', '')}
          <span><small>${d.label}</small><b>${esc(r.m.name)}</b></span><em>Recette ${ICON.chev}</em></button>
        ${rows}
      </section>`;
    }).join('');
  } else {
    body = sh.byRayon.map(g => {
      const items = g.items.filter(keep);
      if (!items.length) return '';
      return `<section class="shop-sec">
        <h3><span class="ray-ico">${g.rayon.icon}</span>${g.rayon.label}<span class="count">${items.filter(it => !S.shopChecked[it.key]).length || '✓'}</span></h3>
        ${sortDone(items).map(it => shopRow(it)).join('')}
      </section>`;
    }).join('');
    const pantry = sh.pantry.filter(keep);
    if (pantry.length) body += `<details class="shop-sec pantry"><summary><span class="ray-ico">🏠</span>À vérifier dans vos placards<span class="count">${pantry.length}</span></summary>
      <p class="sub">Basiques souvent déjà à la maison. Cochez ce que vous avez.</p>${sortDone(pantry).map(it => shopRow(it)).join('')}</details>`;
  }

  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">🏪 ${esc(st.name)}</p>
      <h1>Courses</h1>
    </section>
    ${plan.length ? `
    <div class="shop-bar">
      <div class="shop-progress"><div style="width:${all.length ? doneCount / all.length * 100 : 0}%"></div></div>
      <div class="shop-bar-row">
        <span><b>${doneCount}/${all.length}</b> dans le caddie</span>
        <span class="stepper small"><button data-action="portions" data-dir="-1" aria-label="Moins">−</button><span>${P.portions} pers.</span><button data-action="portions" data-dir="1" aria-label="Plus">+</button></span>
      </div>
    </div>

    <p class="mini-title">Pour ces recettes <small>— touchez-en une pour filtrer</small></p>
    <div class="recipe-strip">
      <button class="strip-all ${!filt ? 'on' : ''}" data-action="shop-filter" data-id="">Tout</button>
      ${plan.map((r, i) => `<button class="strip-item ${filt === r.m.id ? 'on' : ''}" data-action="shop-filter" data-id="${r.m.id}">
        ${img(r.m.thumb ? r.m.thumb + '/small' : '', '')}<small>${dayInfo(i).label}</small><span>${esc(shortName(r.m.name))}</span></button>`).join('')}
    </div>
    ${filt ? `<button class="filter-note" data-action="open" data-id="${filt}"><span>Uniquement les ingrédients de <b>${esc(S.byId.get(filt).name)}</b> — voir la recette</span>${ICON.chev}</button>` : ''}

    <div class="seg-toggle">
      <button class="${S.shopMode !== 'recipe' ? 'on' : ''}" data-action="shop-mode" data-id="rayon">Par rayon</button>
      <button class="${S.shopMode === 'recipe' ? 'on' : ''}" data-action="shop-mode" data-id="recipe">Par recette</button>
    </div>

    <div class="shop">${body}</div>

    <div class="shop-tools">
      <button class="btn" data-action="share">📤 Partager la liste</button>
      <button class="btn ${wakeLock ? 'lime' : ''}" data-action="wake">🔆 ${wakeLock ? 'Écran maintenu allumé' : 'Garder l’écran allumé'}</button>
      <button class="btn" data-action="uncheck">↺ Tout décocher</button>
    </div>
    <div class="store-card">
      <div class="store-info"><span class="store-logo">🏪</span><div><b>${esc(st.name)}</b><span>${esc(st.address)}</span></div></div>
      <div class="store-links">
        <a class="btn small" href="${mapsLink(st)}" target="_blank" rel="noopener">📍 Itinéraire</a>
        <a class="btn small" href="https://www.intermarche.com/" target="_blank" rel="noopener">🚗 Drive</a>
        <button class="btn small" data-action="shop-settings">⚙️ Magasin & rayons</button>
      </div>
    </div>`
      : '<div class="empty"><div class="empty-ico">🛒</div><h2>Rien à acheter</h2><p class="sub">Ajoutez des dîners à votre semaine pour générer la liste.</p></div>'}
    <p class="source-note">Quantités en g / ml pour ${P.portions} pers., cumulées entre recettes. Rayons dans l’ordre d’un parcours Intermarché type (modifiable). 🔍 = chercher le produit sur intermarche.com.</p>`;
}

let wakeLock = null;
async function toggleWakeLock() {
  if (wakeLock) { await wakeLock.release().catch(() => {}); wakeLock = null; toast('Mise en veille réactivée'); return; }
  if (!('wakeLock' in navigator)) { toast('Non disponible sur ce navigateur (nécessite HTTPS)'); return; }
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => { wakeLock = null; });
    toast('L’écran restera allumé pendant vos courses');
  } catch { toast('Impossible de garder l’écran allumé'); }
}

let rayonDraft = null;
function openShopSettings(order = getRayonOrder(), st = getStore()) {
  rayonDraft = order;
  modalId = null;
  $('#modal-body').innerHTML = `
    <div class="sheet-top"><button class="back" data-action="close-modal">${ICON.back} Retour</button><b>Magasin & rayons</b><span></span></div>
    <div class="recipe-body settings">
      <label class="field">Nom du magasin<input id="st-name" value="${esc(st.name)}"></label>
      <label class="field">Adresse<input id="st-address" value="${esc(st.address)}"></label>
      <h3 style="margin-top:22px">Ordre des rayons</h3>
      <p class="sub">Classez les rayons dans l’ordre où vous les croisez dans votre magasin.</p>
      <ol class="rayon-list">${order.map((id, i) => {
        const r = RAYONS.find(x => x.id === id);
        return `<li><span>${r.icon} ${r.label}</span>
          <button data-action="rayon-move" data-idx="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Monter">↑</button>
          <button data-action="rayon-move" data-idx="${i}" data-dir="1" ${i === order.length - 1 ? 'disabled' : ''} aria-label="Descendre">↓</button></li>`;
      }).join('')}</ol>
      <div class="prefs-actions">
        <button class="btn primary" data-action="shop-settings-save">Enregistrer</button>
        <button class="btn ghost" data-action="shop-settings-reset">Revenir au parcours par défaut</button>
      </div>
    </div>`;
  showSheet();
}

// ----- Profil -----
function renderPrefs() {
  const P = S.prefs;
  const list = (ids, src) => ids.length ? ids.map(id => (src.find(x => x.id === id) || { label: id }).label).join(', ') : '—';
  const votes = (obj, src, dir) => list(Object.keys(obj).filter(k => obj[k] === dir), src);
  const vote = (obj, src) => {
    const up = votes(obj, src, 1), down = votes(obj, src, -1);
    return `${up !== '—' ? '👍 ' + up : ''}${up !== '—' && down !== '—' ? '<br>' : ''}${down !== '—' ? '👎 ' + down : ''}` || '—';
  };
  const rows = [
    ['🎯', 'Objectifs', esc(list(P.objectives, OBJECTIVES))],
    ['😋', 'Envie', esc(list([P.craving].filter(Boolean), CRAVINGS))],
    ['🥗', 'Profil alimentaire', esc(list([P.diet].filter(Boolean), DIETS))],
    ['🚫', 'À éviter', esc(list(P.avoid, AVOID))],
    ['💪', 'Nutrition', esc(list(P.nutrition, NUTRITION))],
    ['🌍', 'Cuisines', vote(P.cuisines, CUISINES)],
    ['🌶️', 'Saveurs', vote(P.flavours, FLAVOURS)],
    ['🍗', 'Protéines', vote(P.proteins, PROTEINS)],
    ['🍝', 'Plats', vote(P.dishes, DISH_TYPES)],
    ['🗓️', 'Semaine', `${P.nights} dîners · ${P.portions} pers.`],
    ['⭐', 'Plats notés', `${Object.values(S.feedback).filter(v => v === 1).length} aimés · ${Object.values(S.feedback).filter(v => v === -1).length} écartés`],
  ];
  const info = S.dbInfo;
  const srcLabel = { api: 'téléchargée depuis TheMealDB', cache: 'en cache (TheMealDB)', snapshot: 'copie locale de secours' }[info.source];
  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">Vos goûts</p>
      <h1>Profil</h1>
    </section>
    <button class="cta-card" data-action="edit-prefs">
      <span class="cta-ico">✏️</span><span><b>Refaire le questionnaire</b><small>Vos réponses actuelles sont pré-remplies</small></span>${ICON.chev}
    </button>
    ${syncCard()}
    <div class="prefs">${rows.map(([ico, k, v]) => `<div class="row"><span class="row-ico">${ico}</span><div><b>${k}</b><div>${v}</div></div></div>`).join('')}</div>
    <div class="prefs-actions">
      <button class="btn" data-action="reset-feedback">Effacer mes notes de plats</button>
      <button class="btn" data-action="refresh-db">Mettre à jour la base</button>
      <button class="btn ghost" data-action="reset-all">Tout réinitialiser</button>
    </div>
    <p class="source-note">Base : ${S.db.length} plats, ${srcLabel}${info.at ? ' — ' + new Date(info.at).toLocaleString('fr-FR') : ''}.</p>`;
}

function syncCard() {
  if (!Sync.available) return `<section id="sync-card" class="sync-card">
    <div class="sync-head"><span class="sync-ico">👨‍👩‍👧</span><div><b>Foyer partagé</b><small>Synchronisation pas encore configurée</small></div></div>
    <p class="sub">Une fois Firebase configuré, vous pourrez partager menu et courses avec un autre téléphone.</p></section>`;
  if (!Sync.code) return `<section id="sync-card" class="sync-card">
    <div class="sync-head"><span class="sync-ico">👨‍👩‍👧</span><div><b>Partager avec mon foyer</b><small>Même menu, mêmes courses, sur plusieurs téléphones</small></div></div>
    <button class="btn primary" data-action="sync-create">Créer un foyer partagé</button>
    <div class="join-row"><input id="join-code" placeholder="XXXXX-XXXXX" autocomplete="off" autocapitalize="characters"><button class="btn" data-action="sync-join">Rejoindre</button></div>
  </section>`;
  const label = { online: '● Synchronisé', offline: '● Hors connexion — synchro au retour du réseau', connecting: '● Connexion…', error: '● Erreur de synchronisation', off: '' }[Sync.status];
  return `<section id="sync-card" class="sync-card on">
    <div class="sync-head"><span class="sync-ico">👨‍👩‍👧</span><div><b>Foyer partagé</b><small class="st-${Sync.status}">${label}</small></div></div>
    <div class="code-box"><span>Code du foyer</span><b>${Sync.code}</b></div>
    <button class="btn primary" data-action="sync-share">📤 Inviter l’autre téléphone</button>
    <p class="sub">L’autre personne ouvre le lien reçu (ou saisit le code dans Profil) : vous partagez alors préférences, menu, notes et liste de courses en temps réel.</p>
    <button class="btn ghost" data-action="sync-leave">Quitter le foyer</button>
  </section>`;
}

// ---------- Fiche recette ----------
let modalPortions = 2, modalId = null;
const doneSteps = new Set();

function openRecipe(id) {
  if (modalId !== id) { doneSteps.clear(); S.recipeTab = 'ingr'; }
  modalId = id; modalPortions = S.prefs ? S.prefs.portions : 2;
  renderRecipe();
  showSheet();
  $('.modal-card').scrollTop = 0;
}

// Découpe les instructions en étapes numérotées.
function splitSteps(text) {
  const lines = text.replace(/\r/g, '').split(/\n+/).map(l => l.trim()).filter(Boolean)
    .filter(l => !/^(step\s*)?\d+[.):]?$/i.test(l));
  let steps = lines.map(l => l.replace(/^(step\s*\d+[.:)]?\s*|\d+[.)]\s+)/i, '').trim()).filter(Boolean);
  if (steps.length === 1 && steps[0].length > 400) steps = steps[0].match(/[^.!?]+[.!?]+(\s|$)/g)?.reduce((acc, sentence) => {
    if (!acc.length || acc[acc.length - 1].length > 220) acc.push(sentence.trim()); else acc[acc.length - 1] += ' ' + sentence.trim();
    return acc;
  }, []) || steps;
  return steps;
}

function renderRecipe() {
  const m = S.byId.get(modalId), r = S.rankedById.get(modalId);
  const factor = modalPortions / BASE_SERVINGS;
  const pIdx = planIndexOf(m.id), fb = S.feedback[m.id];
  const translate = `https://translate.google.com/?sl=en&tl=fr&op=translate&text=${encodeURIComponent(m.instr.slice(0, 4500))}`;
  const steps = splitSteps(m.instr);
  const tab = S.recipeTab;
  $('#modal-body').innerHTML = `
    <div class="sheet-top floating">
      <button class="back" data-action="close-modal" aria-label="Retour">${ICON.back}<span>Retour</span></button>
      <span></span>
      <div class="top-actions">
        <button class="round-btn ${fb === 1 ? 'on' : ''}" data-action="like" data-id="${m.id}" title="J’aime" aria-label="J’aime">${ICON.up}</button>
        <button class="round-btn" data-action="dislike" data-id="${m.id}" title="Pas pour moi" aria-label="Pas pour moi">${ICON.down}</button>
      </div>
    </div>
    <div class="recipe-hero">${img(m.thumb, m.name)}<div class="hero-shade"></div>
      <div class="hero-title">${pIdx >= 0 ? `<span class="pill lime">🗓️ ${dayInfo(pIdx).label}</span>` : ''}<h2>${esc(m.name)}</h2></div>
    </div>
    <div class="recipe-body">
      <div class="facts">
        <div><span>Temps</span><b>${fmtMinutes(m.f.time)}</b></div>
        <div><span>Cuisine</span><b>${esc(cuisineLabel(m.f.cuisine))}</b></div>
        <div><span>Ingrédients</span><b>${m.ingr.length}</b></div>
        <div class="fact-portions"><span>Portions</span><span class="stepper small"><button data-action="mportions" data-dir="-1" aria-label="Moins">−</button><b>${modalPortions}</b><button data-action="mportions" data-dir="1" aria-label="Plus">+</button></span></div>
      </div>
      ${tagsFor(m, 6, false)}
      ${r && r.reasons.length ? `<p class="why"><b>Pour vous :</b> ${r.reasons.map(esc).join(' · ')}</p>` : ''}

      <div class="seg-toggle recipe-tabs">
        <button class="${tab === 'ingr' ? 'on' : ''}" data-action="recipe-tab" data-id="ingr">Ingrédients</button>
        <button class="${tab === 'steps' ? 'on' : ''}" data-action="recipe-tab" data-id="steps">Préparation · ${steps.length} étapes</button>
      </div>
      <div class="recipe-cols tab-${tab}">
        <div class="col-ingr">
          <h3 class="col-title">Ingrédients <small>pour ${modalPortions} pers.</small></h3>
          <ul class="ingr-list">${m.ingr.map(i => `<li>${img(ING_IMG(i.n), '')}<span class="ingr-name">${esc(trIng(i.n))}</span><span class="m">${esc(measureFr(i.m, factor, i.n))}</span></li>`).join('')}</ul>
        </div>
        <div class="col-steps">
          <h3 class="col-title">Préparation <small>en anglais · <a href="${translate}" target="_blank" rel="noopener">traduire 🇫🇷</a></small></h3>
          <ol class="step-list">${steps.map((t, i) => `<li class="${doneSteps.has(i) ? 'done' : ''}" data-action="step" data-idx="${i}"><span class="num">${doneSteps.has(i) ? ICON.check : i + 1}</span><p>${esc(t)}</p></li>`).join('')}</ol>
          <p class="sub">Touchez une étape pour la cocher.</p>
        </div>
      </div>
    </div>
    <div class="sheet-bar">
      ${pIdx >= 0
        ? `<button class="btn" data-action="swap-open" data-idx="${pIdx}" aria-label="Changer ce plat">${ICON.swap}<span class="lbl">Changer</span></button><button class="btn primary grow" data-action="close-modal">${ICON.check} Dans ma semaine</button>`
        : `<button class="btn primary grow" data-action="add" data-id="${m.id}">${ICON.plus} Ajouter à ma semaine</button>`}
      ${m.yt ? `<a class="btn icon-only" href="${esc(m.yt)}" target="_blank" rel="noopener" aria-label="Vidéo">${ICON.play}</a>` : ''}
    </div>`;
}

// Feuille modale avec gestion du bouton « retour » du téléphone.
function showSheet() {
  $('#modal').hidden = false;
  document.body.classList.add('no-scroll');
  if (!(history.state && history.state.sheet)) history.pushState({ sheet: 1 }, '');
}
function hideSheet() {
  $('#modal').hidden = true; modalId = null;
  document.body.classList.remove('no-scroll');
}
function closeModal() {
  if (history.state && history.state.sheet) history.back(); else hideSheet();
}
window.addEventListener('popstate', () => { if (!$('#modal').hidden) hideSheet(); });

// ---------- Actions ----------
function refreshCurrent() {
  if (S.draft) return;
  const y = window.scrollY;
  if (S.view === 'explore') renderExploreResults();
  else ({ menu: renderMenu, shop: renderShop, prefs: renderPrefs })[S.view]();
  window.scrollTo(0, y);
  if (modalId) renderRecipe();
  updateCartBadge();
}

function swapAt(idx) {
  const plan = planEntries();
  S.swapped.add(S.planIds[idx]);
  const rep = pickReplacement(S.ranked, S.prefs, plan, idx, S.swapped);
  if (!rep) { toast('Plus d’alternative disponible'); return; }
  S.planIds[idx] = rep.m.id;
  save();
}

async function handleAction(el) {
  const { action, id, idx, view } = el.dataset;
  switch (action) {
    case 'home': if (S.prefs && !S.draft) showView('menu'); break;
    case 'goto': showView(view); break;
    case 'open': openRecipe(id); break;
    case 'close-modal': closeModal(); break;
    case 'regen': newPlan(); renderMenu(); updateCartBadge(); toast('Nouvelle semaine générée'); break;
    case 'fill': {
      const kept = planEntries();
      S.planIds = buildPlan(S.ranked, S.prefs, S.prefs.nights, kept).map(p => p.m.id);
      save(); renderMenu(); updateCartBadge(); break;
    }
    case 'swap': swapAt(+idx); refreshCurrent(); toast('Nouveau plat proposé'); break;
    case 'remove': S.planIds.splice(+idx, 1); save(); refreshCurrent(); break;
    case 'add':
      if (!S.planIds.includes(id)) {
        if (!S.planIds.length) S.planStart = todayISO();
        S.planIds.push(id); save();
        toast(`Ajouté à votre semaine (${dayInfo(S.planIds.length - 1).label.toLowerCase()})`);
      }
      refreshCurrent(); break;
    case 'noop': break;
    case 'swap-open': {
      swapAt(+idx);
      const newId = S.planIds[+idx];
      refreshCurrent(); openRecipe(newId); toast('Nouveau plat proposé'); break;
    }
    case 'shop-filter': S.shopFilter = id || null; renderShop(); break;
    case 'shop-mode': S.shopMode = id; save(); renderShop(); break;
    case 'recipe-tab': S.recipeTab = id; renderRecipe(); break;
    case 'step': {
      const i = +idx; if (doneSteps.has(i)) doneSteps.delete(i); else doneSteps.add(i);
      const y = $('.modal-card').scrollTop; renderRecipe(); $('.modal-card').scrollTop = y; break;
    }
    case 'like':
      S.feedback[id] = S.feedback[id] === 1 ? undefined : 1;
      if (S.feedback[id] === undefined) delete S.feedback[id];
      save(); rerank(); refreshCurrent(); break;
    case 'dislike': {
      S.feedback[id] = -1;
      const i = S.planIds.indexOf(id);
      rerank();
      if (i >= 0) swapAt(i);
      save();
      if (modalId === id) closeModal();
      toast('Noté : on ne vous le proposera plus');
      refreshCurrent(); break;
    }
    case 'filter': S.explore[el.dataset.key] = !S.explore[el.dataset.key]; S.explore.limit = 24; el.classList.toggle('on'); renderExploreResults(); break;
    case 'cuisine':
      S.explore.cuisine = id; S.explore.limit = 24;
      document.querySelectorAll('[data-action=cuisine]').forEach(b => b.classList.toggle('on', b === el));
      renderExploreResults(); break;
    case 'more': S.explore.limit += 24; renderExploreResults(); break;
    case 'portions':
      S.prefs.portions = Math.min(12, Math.max(1, S.prefs.portions + +el.dataset.dir)); save(); renderShop(); break;
    case 'mportions':
      modalPortions = Math.min(12, Math.max(1, modalPortions + +el.dataset.dir)); renderRecipe(); break;
    case 'check': return; // géré par l’évènement change
    case 'uncheck': S.shopChecked = {}; save(); renderShop(); break;
    case 'share': {
      const text = shoppingText(buildShopping(planEntries(), S.prefs.portions), S.shopChecked, getStore());
      if (navigator.share) { try { await navigator.share({ title: 'Liste de courses', text }); } catch { } break; }
      try { await navigator.clipboard.writeText(text); toast('Liste copiée'); } catch { toast('Copie impossible dans ce navigateur'); }
      break;
    }
    case 'wake': await toggleWakeLock(); renderShop(); break;
    case 'shop-settings': openShopSettings(); break;
    case 'rayon-move': {
      const order = [...rayonDraft], i = +idx, j = i + +el.dataset.dir;
      [order[i], order[j]] = [order[j], order[i]];
      const y = $('.modal-card').scrollTop;
      openShopSettings(order, { name: $('#st-name').value, address: $('#st-address').value });
      $('.modal-card').scrollTop = y;
      break;
    }
    case 'shop-settings-save':
      store.set('qm_rayons', rayonDraft);
      store.set('qm_store', { name: $('#st-name').value.trim() || DEFAULT_STORE.name, address: $('#st-address').value.trim() || DEFAULT_STORE.address });
      rayonDraft = null; save(); closeModal(); renderShop(); toast('Magasin enregistré'); break;
    case 'shop-settings-reset':
      store.del('qm_rayons'); store.del('qm_store'); rayonDraft = null; save(); closeModal(); renderShop(); toast('Parcours par défaut rétabli'); break;
    case 'edit-prefs': startWizard(true); break;
    case 'sync-create':
      try { el.disabled = true; await Sync.create(sharedState()); renderPrefs(); toast('Foyer créé ! Invitez l’autre téléphone'); }
      catch (e) { console.warn(e); toast('Création impossible : vérifiez la connexion'); el.disabled = false; }
      break;
    case 'sync-join': {
      const v = $('#join-code').value.trim();
      if (!v) { toast('Entrez le code du foyer'); break; }
      await joinHousehold(v);
      break;
    }
    case 'sync-share': {
      const text = `Rejoins notre foyer sur QuoiManger pour partager le menu et la liste de courses : ${Sync.inviteLink()} (code : ${Sync.code})`;
      if (navigator.share) { try { await navigator.share({ title: 'QuoiManger', text }); } catch { } break; }
      try { await navigator.clipboard.writeText(text); toast('Lien d’invitation copié'); } catch { toast(Sync.code); }
      break;
    }
    case 'sync-leave':
      if (confirm('Quitter le foyer partagé ? Les données restent sur ce téléphone mais ne seront plus synchronisées.')) { Sync.leave(); renderPrefs(); }
      break;
    case 'reset-feedback':
      if (confirm('Effacer tous les plats aimés / écartés ?')) { S.feedback = {}; save(); rerank(); renderPrefs(); toast('Notes effacées'); }
      break;
    case 'refresh-db':
      store.del(DB_CACHE_KEY); location.reload(); break;
    case 'reset-all':
      if (confirm('Supprimer vos préférences, votre menu et vos notes ?')) {
        ['qm_prefs', 'qm_feedback', 'qm_plan', 'qm_shop'].forEach(k => store.del(k)); location.reload();
      }
      break;
  }
}

document.addEventListener('click', (e) => {
  const navBtn = e.target.closest('#nav button');
  if (navBtn) { showView(navBtn.dataset.view); return; }
  const el = e.target.closest('[data-action]');
  if (!el) return;
  if (el.tagName === 'A' && el.dataset.action === 'home') e.preventDefault();
  if (S.draft && app.contains(el)) { wizardClick(el); return; }
  handleAction(el);
});

document.addEventListener('change', (e) => {
  if (e.target.dataset.action === 'check') {
    const k = e.target.dataset.key;
    if (e.target.checked) S.shopChecked[k] = true; else delete S.shopChecked[k];
    save();
    const y = window.scrollY; renderShop(); window.scrollTo(0, y); updateCartBadge();
  }
});

document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

boot();
