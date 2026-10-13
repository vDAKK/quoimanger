// Interface : questionnaire, menu, explorateur, liste de courses.

const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const img = (src, alt = '', cls = '') => `<img src="${esc(src)}" alt="${esc(alt)}" class="${cls}" loading="lazy" onerror="this.style.visibility='hidden'">`;
const med = (thumb) => thumb ? thumb + '/medium' : '';
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

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
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
};

const DEFAULT_PREFS = {
  objectives: [], craving: null, diet: null, avoid: [], nutrition: [],
  cuisines: {}, flavours: {}, proteins: {}, dishes: {}, noIngr: [], nights: 4, portions: 2, lunch: false, lunchPortions: 2, budget: 'none',
};
// Données du menu en plus des dîners : déjeuners (par jour), réglages par repas { id: { p: portions, off: 1 } },
// alternatives choisies { 'idPlat|ingrédient': produit }, produits indisponibles au magasin (noms français).
const emptyWeek = () => ({ lunchIds: [], slots: {}, subs: {}, unavail: [] });
const asWeek = (w) => ({ ...emptyWeek(), ...(w || {}) });

const S = {
  db: [], byId: new Map(), ranked: [], rankedById: new Map(), dbInfo: null,
  prefs: store.get('qm_prefs', null),
  feedback: store.get('qm_feedback', {}),
  planIds: store.get('qm_plan', []),
  planStart: store.get('qm_plan_start', null),
  week: asWeek(store.get('qm_week', null)),
  showPast: false,
  altOpen: null,
  shopMode: store.get('qm_shop_mode', 'rayon'),
  shopFilter: null,
  recipeTab: 'ingr',
  shopChecked: store.get('qm_shop', {}),
  draft: null, step: 0, view: 'menu',
  explore: { q: '', mode: 'fav', quick: false, veggie: false, light: false, mild: false, cheap: false, cuisine: '', limit: 24, fq: '' },
  fridge: store.get('qm_fridge', []), // ingrédients à la maison : [{ k: clé d'achat, en: nom TheMealDB }]
  swapped: new Set(),
  rep: {},
};

const saveLocal = () => {
  store.set('qm_prefs', S.prefs); store.set('qm_feedback', S.feedback);
  store.set('qm_plan', S.planIds); store.set('qm_shop', S.shopChecked);
  store.set('qm_plan_start', S.planStart); store.set('qm_shop_mode', S.shopMode);
  store.set('qm_week', S.week); store.set('qm_fridge', S.fridge);
};
// État partagé avec les autres appareils du foyer.
const sharedState = () => ({
  prefs: S.prefs, feedback: S.feedback, planIds: S.planIds, planStart: S.planStart, shop: S.shopChecked, week: S.week,
  store: store.get('qm_store', null), rayons: store.get('qm_rayons', null),
});
const save = () => { saveLocal(); Sync.push(sharedState()); };

// Un autre appareil du foyer a modifié les données : on les applique ici.
function applyRemote(data, changed = []) {
  if (data.prefs) S.prefs = data.prefs;
  S.feedback = data.feedback || {};
  S.planIds = data.planIds || [];
  S.planStart = data.planStart || null;
  S.week = asWeek(data.week);
  S.shopChecked = data.shop || {};
  if (data.store) store.set('qm_store', data.store); else store.del('qm_store');
  if (data.rayons) store.set('qm_rayons', data.rayons); else store.del('qm_rayons');
  saveLocal();
  if (!S.prefs || !S.db.length) return;
  rerank();
  if (S.draft) return; // questionnaire en cours : on ne l'interrompt pas
  if ($('#nav').hidden) showView('menu'); else refreshCurrent();
  if (changed.some(k => k === 'planIds' || k === 'prefs' || k === 'week')) toast(t('sync_updated'));
}

function renderSyncPill() {
  const pill = $('#sync-pill');
  if (!pill) return;
  pill.hidden = !Sync.code;
  pill.dataset.status = Sync.status;
  pill.title = Sync.status === 'off' ? '' : t('pill_' + Sync.status);
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
    <h1>${t('loading_title')}</h1>
    <p class="sub" id="load-msg">${t('loading_msg')}</p>
    <div class="bar"><div id="load-bar"></div></div>
  </div>`;
  try {
    const info = await loadDatabase((done, total, n) => {
      $('#load-bar').style.width = (done / total * 100) + '%';
      $('#load-msg').textContent = t('loading_count', { n, d: done, t: total });
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
    if (info.source === 'snapshot') toast(t('api_fallback'));
  } catch (e) {
    app.innerHTML = `<div class="empty"><h2>${t('load_error')}</h2><p class="sub">${esc(e.message)}</p>
      <button class="btn primary" onclick="location.reload()">${t('retry')}</button></div>`;
    return;
  }
  applyStaticI18n();
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
  // recettes récentes de l'API absentes des traductions embarquées : noms traduits en arrière-plan
  translateNames(S.db).then(n => n && refreshCurrent());
}

async function joinHousehold(code, fromLink = false) {
  const fallback = () => { if (!fromLink) return; if (S.prefs) { rerank(); showView('menu'); } else startWizard(); };
  if (S.prefs && !confirm(t('join_confirm'))) { fallback(); return; }
  try {
    toast(t('joining'));
    const data = await Sync.join(code);
    S.draft = null;
    applyRemote(data, []);
    if (S.prefs) { showView('menu'); toast(t('joined_ok')); }
    else startWizard();
  } catch (e) {
    toast(e.message || t('join_fail'));
    fallback();
  }
}

function rerank() {
  S.ranked = rankAll(S.db, S.prefs, S.feedback);
  S.rankedById = new Map(S.ranked.map(r => [r.m.id, r]));
}

// ---------- Repas de la semaine ----------
const lunchOn = () => !!(S.prefs && S.prefs.lunch);
const rankedOf = (id) => S.rankedById.get(id) || (S.byId.get(id) && { m: S.byId.get(id), score: null, reasons: [] });
const defaultPortions = (kind) => (kind === 'lunch' ? S.prefs.lunchPortions || S.prefs.portions : S.prefs.portions);

/** Tous les repas du menu, jour par jour (midi puis soir) : { m, kind, day, id, portions, off, past }. */
function weekSlots() {
  const out = [], hour = new Date().getHours();
  const lunches = lunchOn() ? S.week.lunchIds : [];
  const days = Math.max(S.planIds.length, lunches.length);
  for (let day = 0; day < days; day++) {
    for (const kind of ['lunch', 'dinner']) {
      const id = kind === 'lunch' ? lunches[day] : S.planIds[day];
      const r = id && rankedOf(id);
      if (!r) continue;
      const o = S.week.slots[id] || {}, diff = dayInfo(day).diff;
      out.push({ ...r, kind, day, id, off: !!o.off, portions: o.p || defaultPortions(kind),
        past: diff < 0 || (diff === 0 && kind === 'lunch' && hour >= 15) });
    }
  }
  return out;
}
const activeSlots = () => weekSlots().filter(s => !s.off);
// repas à acheter : les repas passés (hier, ou ce midi une fois l'après-midi entamée) sortent de la liste
const shopSlots = () => activeSlots().filter(s => S.showPast || !s.past);
const slotOf = (id) => weekSlots().find(s => s.id === id) || null;
const inWeek = (id) => S.planIds.includes(id) || (lunchOn() && S.week.lunchIds.includes(id));

/** Recalcule les repas vides de la semaine (les plats déjà présents et non exclus sont gardés). */
function fillWeek(reset = false) {
  const layout = [];
  const days = reset ? S.prefs.nights : Math.max(S.prefs.nights, S.planIds.length);
  for (let day = 0; day < days; day++) {
    if (lunchOn()) layout.push({ kind: 'lunch', day, id: reset ? null : S.week.lunchIds[day] });
    layout.push({ kind: 'dinner', day, id: reset ? null : S.planIds[day] });
  }
  // un repas exclu (« je ne mange pas ») reste à sa place mais ne compte pas dans l'optimisation
  const opt = layout.filter(x => !(x.id && S.week.slots[x.id] && S.week.slots[x.id].off));
  const res = buildPlan(S.ranked, S.prefs, opt.map(x => x.kind), opt.map(x => (x.id && rankedOf(x.id)) || null), { exclude: blockedMeals() });
  opt.forEach((x, i) => { x.id = res[i] ? res[i].m.id : x.id; });
  const dinners = [], lunches = [];
  layout.forEach(x => ((x.kind === 'lunch' ? lunches : dinners)[x.day] = x.id || ''));
  S.planIds = dinners.filter(Boolean);
  if (lunchOn()) S.week.lunchIds = lunches;
}

function newPlan() {
  S.week = { ...emptyWeek(), subs: {} };
  fillWeek(true);
  S.planStart = todayISO();
  S.shopChecked = {};
  S.swapped = new Set();
  save();
}

// Libellé d'un repas : « Ce soir », « Demain midi », « Jeudi soir »…
function slotLabel(s) {
  const d = dayInfo(s.day);
  if (s.kind === 'lunch') return d.diff === 0 ? t('today_lunch') : t('day_lunch', { d: d.label });
  return lunchOn() && d.diff !== 0 ? t('day_dinner', { d: d.label }) : d.label;
}
const slotKindLabel = (s) => (s.kind === 'lunch' ? t('lunch') : t('dinner'));

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
  S.draft.noIngr = S.draft.noIngr || [];
  S.step = 0;
  $('#nav').hidden = true;
  $('#wizard-bar').hidden = false;
  document.body.classList.add('wizard');
  renderStep();
}

const voteBtns = (key, id) => {
  const v = S.draft[key][id];
  return `<div class="thumbs">
    <button class="thumb up ${v === 1 ? 'on' : ''}" data-action="vote" data-key="${key}" data-val="${id}" data-dir="1" aria-label="${t('like')}">${ICON.up}</button>
    <button class="thumb down ${v === -1 ? 'on' : ''}" data-action="vote" data-key="${key}" data-val="${id}" data-dir="-1" aria-label="${t('dislike')}">${ICON.down}</button>
  </div>`;
};

const STEPS = [
  {
    title: () => t('s1_title'), sub: () => t('s1_sub'),
    valid: d => d.objectives.length > 0,
    render: d => `<div class="grid two">${OBJECTIVES.map(o =>
      `<button class="opt ${d.objectives.includes(o.id) ? 'on' : ''}" data-action="toggle" data-key="objectives" data-val="${o.id}" data-max="3">${L('objectives', o)}</button>`).join('')}</div>
      ${!S.prefs && Sync.available ? `<section class="join-first">
        <div class="sync-head"><span class="sync-ico">${icon('users')}</span><div><b>${t('have_household')}</b><small>${t('have_household_sub')}</small></div></div>
        <div class="join-row"><input id="join-code" placeholder="XXXXX-XXXXX" autocomplete="off" autocapitalize="characters"><button class="btn" data-action="sync-join">${t('join')}</button></div>
      </section>` : ''}`,
  },
  {
    title: () => t('s2_title'),
    render: d => {
      const ids = d.objectives.length ? d.objectives : ['eco', 'time', 'nutri'];
      return `<div class="pitch">${ids.map(id => {
        const [ico, title, p] = pitchFor(id);
        return `<div class="row"><span class="ico">${icon(ico)}</span><div><b>${title}</b><p>${p}</p></div></div>`;
      }).join('')}
      <div class="row"><span class="ico">${icon('book-open')}</span><div><b>${t('s2_db_title', { n: S.db.length })}</b><p>${t('s2_db_desc')}</p></div></div></div>`;
    },
  },
  {
    title: () => t('s3_title'),
    valid: d => !!d.craving,
    render: d => `<div class="grid three">${CRAVINGS.map(c => `
      <button class="opt img-card ${d.craving === c.id ? 'on' : ''}" data-action="pick" data-key="craving" data-val="${c.id}">
        ${img(S.rep.craving[c.id], L('cravings', c))}
        <div class="body"><div class="title">${L('cravings', c)}</div><div class="desc">${L('cravings', c, 'desc')}</div></div>
      </button>`).join('')}</div>`,
  },
  {
    title: () => t('s4_title'),
    valid: d => !!d.diet,
    render: d => `<div class="grid four">${DIETS.map(c => `
      <button class="opt img-card ${d.diet === c.id ? 'on' : ''}" data-action="pick" data-key="diet" data-val="${c.id}">
        ${img(S.rep.diet[c.id], L('diets', c))}
        <div class="body"><div class="title">${L('diets', c)}</div><div class="desc">${L('diets', c, 'desc')}</div></div>
      </button>`).join('')}</div>`,
  },
  {
    title: () => t('s5_title'), sub: () => t('s5_sub'),
    render: d => `<div class="grid tiles">
      <button class="opt center" data-action="skip-avoid">${t('skip')}</button>
      ${AVOID.map(a => `<button class="opt ${d.avoid.includes(a.id) ? 'on' : ''}" data-action="toggle" data-key="avoid" data-val="${a.id}">
        <span class="icon">${icon(a.icon)}</span>${L('avoid', a)}</button>`).join('')}</div>
      <h3 class="seg-label">${t('s5_no_ingr')}</h3>
      <div class="ingr-chips">${NO_INGR.map(x => noIngrChip(x, d.noIngr.includes(x.id), 'toggle', 'data-key="noIngr" data-val="' + x.id + '"')).join('')}</div>`,
  },
  {
    title: () => t('s6_title'), sub: () => t('s6_sub'),
    render: d => `<div class="split"><div class="grid two">${NUTRITION.map(n =>
      `<button class="opt slim ${d.nutrition.includes(n.id) ? 'on' : ''}" data-action="toggle" data-key="nutrition" data-val="${n.id}">${L('nutrition', n)}</button>`).join('')}</div>
      ${S.rep.nutrition ? img(S.rep.nutrition.replace('/medium', ''), '', 'hero') : ''}</div>`,
  },
  {
    title: () => t('s7_title'),
    render: () => `<div class="grid votes">${CUISINES.map(c => `
      <div class="vote">${img(S.rep.cuisine[c.id], L('cuisines', c))}<div class="name">${L('cuisines', c)}</div>${voteBtns('cuisines', c.id)}</div>`).join('')}</div>`,
  },
  {
    title: () => t('s8_title'),
    render: () => `<div class="grid votes small">${FLAVOURS.map(f => `
      <div class="vote tile"><div class="emoji">${icon(f.icon)}</div><div class="name">${L('flavours', f)}</div>${voteBtns('flavours', f.id)}</div>`).join('')}</div>`,
  },
  {
    title: () => t('s9_title'),
    render: d => {
      const hidden = d.diet === 'veggie' ? ['beef', 'pork', 'poultry', 'lamb', 'fish', 'seafood'] : d.diet === 'pesco' ? ['beef', 'pork', 'poultry', 'lamb'] : [];
      return `<div class="grid votes small">${PROTEINS.filter(p => !hidden.includes(p.id) && !d.avoid.includes(p.id)).map(p => `
        <div class="vote tile">${img(ING_IMG(p.img), L('proteins', p), 'ing')}<div class="name">${L('proteins', p)}</div>${voteBtns('proteins', p.id)}</div>`).join('')}</div>`;
    },
  },
  {
    title: () => t('s10_title'),
    render: () => `<div class="grid votes">${DISH_TYPES.map(d => `
      <div class="vote">${img(S.rep.dish[d.id], L('dishes', d))}<div class="name">${L('dishes', d)}</div>${voteBtns('dishes', d.id)}</div>`).join('')}</div>`,
  },
  {
    title: () => t('s11_title'),
    render: d => `<div class="grid two">${NIGHTS.map(n =>
      `<button class="opt slim ${d.nights === n.id ? 'on' : ''}" data-action="pick" data-key="nights" data-val="${n.id}" data-num="1">${L('nights', n)}</button>`).join('')}</div>
      <div class="seg-label">${t('portions_per_dinner')}</div>
      <div class="seg">${[1, 2, 3, 4, 5, 6].map(v => `<button class="${d.portions === v ? 'on' : ''}" data-action="pick" data-key="portions" data-val="${v}" data-num="1">${v}</button>`).join('')}</div>
      <div class="seg-label">${t('dinners_per_week')}</div>
      <div class="seg">${[1, 2, 3, 4, 5, 6, 7].map(v => `<button class="${d.nights === v ? 'on' : ''}" data-action="pick" data-key="nights" data-val="${v}" data-num="1">${v}</button>`).join('')}</div>
      <div class="seg-label">${t('lunch_too')}</div>
      <div class="seg">
        <button class="${!d.lunch ? 'on' : ''}" data-action="pick" data-key="lunch" data-val="" data-bool="1">${t('no')}</button>
        <button class="${d.lunch ? 'on' : ''}" data-action="pick" data-key="lunch" data-val="1" data-bool="1">${t('yes_lunch')}</button>
      </div>
      <div class="seg-label">${t('budget_q')}</div>
      <div class="grid two budget-opts">${BUDGETS.map(b => `<button class="opt slim ${(d.budget || 'none') === b.id ? 'on' : ''}" data-action="pick" data-key="budget" data-val="${b.id}">${budgetLabel(b)}</button>`).join('')}</div>
      ${d.lunch ? `<div class="seg-label">${t('portions_per_lunch')}</div>
      <div class="seg">${[1, 2, 3, 4, 5, 6].map(v => `<button class="${(d.lunchPortions || d.portions) === v ? 'on' : ''}" data-action="pick" data-key="lunchPortions" data-val="${v}" data-num="1">${v}</button>`).join('')}</div>` : ''}`,
  },
];

function renderStep() {
  const st = STEPS[S.step];
  app.innerHTML = `<div class="step-head"><h1>${st.title()}</h1>${st.sub ? `<p class="sub">${st.sub()}</p>` : ''}</div>${st.render(S.draft)}`;
  $('#step-count').hidden = false;
  $('#step-count').textContent = `${S.step + 1} / ${STEPS.length}`;
  $('#progress-fill').style.width = ((S.step + 1) / STEPS.length * 100) + '%';
  $('#btn-back').style.visibility = S.step === 0 && !S.prefs ? 'hidden' : 'visible';
  $('#btn-back').textContent = S.step === 0 ? t('cancel') : t('back');
  $('#btn-next').disabled = st.valid ? !st.valid(S.draft) : false;
  $('#btn-next').textContent = S.step === STEPS.length - 1 ? t('see_menu') : t('next');
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
  toast(t('n_match', { n: S.ranked.length }));
}

function prevStep() {
  if (S.step === 0) { if (S.prefs) { $('#wizard-bar').hidden = true; showView('menu'); } return; }
  S.step--; renderStep(); window.scrollTo(0, 0);
}

$('#btn-next').addEventListener('click', nextStep);
$('#btn-back').addEventListener('click', prevStep);

function wizardClick(el) {
  const d = S.draft, { action, key, val } = el.dataset;
  if (action === 'sync-join') { handleAction(el); return; }
  if (action === 'pick') d[key] = el.dataset.num ? +val : el.dataset.bool ? !!val : val;
  else if (action === 'toggle') {
    const list = d[key];
    const i = list.indexOf(val);
    if (i >= 0) list.splice(i, 1);
    else {
      const max = +el.dataset.max || Infinity;
      if (list.length >= max) { toast(t('max_choices', { n: max })); return; }
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
  const sh = buildShopping(shopSlots(), S.week.subs);
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
  const name = capitalize(weekdayName(d));
  return {
    label: diff === 0 ? t('tonight') : diff === 1 ? t('tomorrow') : name,
    short: weekdayShort(d), num: d.getDate(), diff,
  };
}


function tagsFor(m, max = 4, basics = true) {
  const f = m.f, out = [];
  if (basics) {
    out.push(`<span class="tag">${ICON.clock}${fmtMinutes(f.time)}</span>`);
    out.push(`<span class="tag">${esc(cuisineLabel(f.cuisine))}</span>`);
  }
  out.push(`<span class="tag ${budgetMax(S.prefs || {}) && mealPrice(m) > budgetMax(S.prefs) ? 'red' : ''}">${icon('piggy-bank')}${t('per_part', { p: fmtEuro(mealPrice(m)) })}</span>`);
  out.push(`<span class="tag" title="${t('kcal_title')}">${icon('zap')}≈ ${t('kcal', { n: mealKcal(m) })}</span>`);
  if (f.isVeggie) out.push(`<span class="tag green">${icon('leaf')}${t('tag_veg')}</span>`);
  else if (f.main !== 'veg') out.push(`<span class="tag">${esc(proteinLabel(f.main))}</span>`);
  if (f.hot >= 2) out.push(`<span class="tag red">${icon('flame')}${t('tag_hot')}</span>`);
  if (f.spiced >= 3) out.push(`<span class="tag">${icon('sparkles')}${t('b_spiced')}</span>`);
  if (f.sweet >= 3) out.push(`<span class="tag">${icon('candy')}${t('b_sweet')}</span>`);
  if (f.cheese >= 2) out.push(`<span class="tag">${icon('cheese')}${t('b_cheese')}</span>`);
  if (f.heavy === 0) out.push(`<span class="tag green">${t('tag_light')}</span>`);
  if (f.overnight) out.push(`<span class="tag">${icon('moon')}${t('tag_overnight')}</span>`);
  return out.length ? `<div class="tags">${out.slice(0, max).join('')}</div>` : '';
}

// ----- Ma semaine -----
function renderMenu() {
  const all = weekSlots(), active = all.filter(x => !x.off);
  const P = S.prefs;
  const h = new Date().getHours();
  const hello = h < 5 || h >= 18 ? t('hello_evening') : h < 12 ? t('hello_morning') : t('hello_afternoon');
  const totalTime = active.reduce((sum, x) => sum + x.m.f.time, 0);
  const featIdx = Math.max(0, all.findIndex(x => !x.off && !x.past));
  const feat = all[featIdx];
  const toBuy = shopSlots();
  const sh = toBuy.length ? buildShopping(toBuy, S.week.subs) : null;
  const left = sh ? sh.byRayon.flatMap(g => g.items).filter(it => !S.shopChecked[it.key]).length : 0;
  const ps = planShopping(active);
  const optOn = P.optimizeShopping !== false;
  const baseline = optOn && active.length > 1 ? baselineDistinct(S.ranked, P, active.map(x => x.kind)) : 0;
  const nDin = active.filter(x => x.kind === 'dinner').length, nLun = active.length - nDin;
  const days = Math.max(P.nights, S.planIds.length);
  let missing = Math.max(0, P.nights - S.planIds.length);
  if (lunchOn()) for (let d = 0; d < days; d++) if (!S.byId.has(S.week.lunchIds[d])) missing++;
  let lastDay = -1;

  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">${hello}</p>
      <h1>${t('your_week')}</h1>
      <div class="stats">
        ${lunchOn() ? `<span>${t('stat_lunches', { n: nLun })}</span>` : ''}
        <span>${t('stat_dinners', { n: nDin })}</span>
        <span>${t('stat_time', { t: fmtMinutes(totalTime) })}</span>
        ${active.length ? `<span>${icon('shopping-cart')}${t('stat_ingr', { n: ps.distinct })}</span>` : ''}
        ${active.length ? `<span>${icon('piggy-bank')}≈ <b>${fmtEuro(weekCost(active))}</b></span>` : ''}
      </div>
      ${S.ranked.strictCount != null ? `<p class="quick-note">${icon('ban')}${t('too_strict', { n: S.ranked.strictCount })}</p>` : ''}
      ${P.craving === 'quick' && active.some(x => x.m.f.time > 25) ? `<p class="quick-note">${icon('timer')}${t('quick_relaxed', { n: Math.max(...active.map(x => x.m.f.time)) })}</p>` : ''}
    </section>

    ${feat ? `
    <article class="feature ${feat.off ? 'off' : ''}" data-action="open" data-id="${feat.id}">
      ${img(med(feat.m.thumb), mealName(feat.m))}
      <div class="feature-shade"></div>
      ${tileBadges(feat.m, 'feature-badges')}
      <div class="feature-body">
        <span class="pill lime">${icon(feat.kind === 'lunch' ? 'sun' : 'moon')}${slotLabel(feat)}</span>
        <h2>${esc(mealName(feat.m))}</h2>
        ${tagsFor(feat.m, 4)}
        <div class="feature-actions">
          <span class="btn lime">${t('see_recipe')} ${ICON.chev}</span>
          <button class="btn glass" data-action="swap" data-id="${feat.id}" title="${t('change_dish')}" aria-label="${t('change_dish')}">${ICON.swap}<span class="lbl"> ${t('change')}</span></button>
          <button class="btn glass" data-action="slot" data-id="${feat.id}" title="${t('slot_settings')}" aria-label="${t('slot_settings')}">${feat.off ? icon('ban') : `${ICON.user} ${feat.portions}`}</button>
        </div>
      </div>
    </article>` : `<div class="empty"><div class="empty-ico">${icon('utensils')}</div><h2>${t('no_dinner_title')}</h2><p class="sub">${t('no_dinner_sub')}</p></div>`}

    ${all.length > 1 ? `
    <h2 class="section-title">${t('on_menu')}</h2>
    <div class="day-list">${all.map((x, i) => {
      if (i === featIdx) return '';
      const row = slotRow(x, x.day !== lastDay, ps.shared);
      lastDay = x.day;
      return row;
    }).join('')}</div>` : ''}

    ${active.length > 1 ? `
    <button class="opt-card ${optOn ? 'on' : ''}" data-action="toggle-opt" role="switch" aria-checked="${optOn}">
      <span class="opt-ico">${icon('recycle')}</span>
      <span class="opt-txt"><b>${t('opt_title')}</b><small>${!optOn ? t('opt_off') : baseline > ps.distinct ? t('opt_saving', { n: ps.distinct, b: baseline }) : t('opt_n', { n: ps.distinct })}</small></span>
      <span class="switch"><i></i></span>
    </button>` : ''}

    ${active.length ? budgetCard(active) : ''}

    ${all.length ? `
    <button class="cta-card" data-action="goto" data-view="shop">
      <span class="cta-ico">${ICON.cart}</span>
      <span><b>${t('shop_list')}</b><small>${left ? t('items_to_buy', { n: left, r: toBuy.length }) : t('all_in_cart')}</small></span>
      ${ICON.chev}
    </button>` : ''}

    ${Sync.available && !Sync.code ? `
    <button class="cta-card light" data-action="goto" data-view="prefs">
      <span class="cta-ico">${icon('users')}</span><span><b>${t('multi_device')}</b><small>${t('multi_device_sub')}</small></span>${ICON.chev}
    </button>` : ''}

    <div class="menu-tools">
      ${missing ? `<button class="btn" data-action="fill">${ICON.plus} ${t('add_meals', { n: missing })}</button>` : ''}
      <button class="btn" data-action="toggle-lunch">${icon('sun')} ${lunchOn() ? t('remove_lunches') : t('add_lunches')}</button>
      <button class="btn" data-action="regen">${ICON.dice} ${t('new_week')}</button>
      <button class="btn" data-action="goto" data-view="explore">${t('browse_recipes')}</button>
    </div>
    <p class="source-note">${t('menu_hint')}</p>`;
}

// Coût estimé d'un ensemble de repas (portions comprises).
const weekCost = (slots) => slots.reduce((sum, x) => sum + mealPrice(x.m) * x.portions, 0);
const budgetLabel = (b) => b.max ? `${t('budget_' + b.id)} · ≤ ${fmtEuro(b.max)}` : t('budget_none');

function budgetCard(active) {
  const cost = weekCost(active), parts = active.reduce((n, x) => n + x.portions, 0);
  const max = budgetMax(S.prefs), avg = cost / Math.max(1, parts);
  const over = max ? active.filter(x => mealPrice(x.m) > max).length : 0;
  const pct = max ? Math.min(100, avg / max * 100) : 0;
  return `<button class="opt-card budget-card ${max ? (avg > max ? 'over' : 'on') : ''}" data-action="budget">
      <span class="opt-ico">${icon('piggy-bank')}</span>
      <span class="opt-txt"><b>${t('budget_title')} ≈ ${fmtEuro(cost)}</b>
        <small>${t('budget_avg', { p: fmtEuro(avg) })}${max ? ' · ' + t('budget_target', { m: fmtEuro(max), w: fmtEuro(max * parts) }) : ' · ' + t('budget_none')}</small>
        ${max ? `<span class="budget-bar"><i style="width:${pct}%"></i></span>` : ''}
        ${over ? `<small class="budget-over">${t('budget_over', { n: over })}</small>` : ''}</span>
      ${ICON.chev}
    </button>`;
}

function openBudgetSheet() {
  modalId = null;
  const cur = S.prefs.budget || 'none';
  $('#modal-body').innerHTML = `
    <div class="sheet-top"><button class="back" data-action="close-modal">${ICON.back} ${t('back')}</button><b>${t('budget_title')}</b><span></span></div>
    <div class="recipe-body settings">
      <p class="sub">${t('budget_q')}</p>
      <div class="budget-list">${BUDGETS.map(b => `<button class="lang-opt ${cur === b.id ? 'on' : ''}" data-action="set-budget" data-id="${b.id}"><span>${budgetLabel(b)}</span>${cur === b.id ? ICON.check : ''}</button>`).join('')}</div>
      <p class="sub">${t('price_note')}</p>
    </div>`;
  showSheet();
}

function slotRow(x, showDate, shared = new Set()) {
  const m = x.m, d = dayInfo(x.day);
  let common = 0; if (!x.off) freshKeys(m).forEach(k => shared.has(k) && common++);
  const meta = x.off ? t('slot_off_short')
    : `${fmtMinutes(m.f.time)} · ${t('kcal', { n: mealKcal(m) })} · ${esc(cuisineLabel(m.f.cuisine))}${m.f.isVeggie ? ` · <span class="veg">${icon('leaf')}</span>` : ''}${common ? ` · <span class="common">${icon('recycle')}${t('shared_n', { n: common })}</span>` : ''}`;
  return `<div class="day-row ${x.off ? 'off' : ''} ${x.past ? 'past' : ''}">
    <div class="day-date ${d.diff === 0 ? 'today' : ''} ${showDate ? '' : 'ghost'}"><span>${d.short}</span><b>${d.num}</b></div>
    <button class="day-card" data-action="open" data-id="${m.id}">
      ${img(m.thumb ? m.thumb + '/small' : '', mealName(m))}
      ${x.off ? '' : `<span class="day-badges">${badgeList(m).slice(0, 3).map(badgeIcon).join('')}</span>`}
      <span class="day-txt">${lunchOn() ? `<em class="kind ${x.kind}">${icon(x.kind === 'lunch' ? 'sun' : 'moon')}${slotKindLabel(x)}</em>` : ''}<b>${esc(mealName(m))}</b><small>${meta}</small></span>
    </button>
    <button class="por-btn" data-action="slot" data-id="${m.id}" title="${t('slot_settings')}" aria-label="${t('slot_settings')}">${x.off ? icon('ban') : `${ICON.user}<b>${x.portions}</b>`}</button>
  </div>`;
}

// Réglages d'un repas : portions, « je ne mange pas ce repas », changer de plat.
let sheetSlot = null;
function openSlotSheet(id) {
  const x = slotOf(id);
  if (!x) return;
  modalId = null; sheetSlot = id;
  $('#modal-body').innerHTML = `
    <div class="sheet-top"><button class="back" data-action="close-modal">${ICON.back} ${t('back')}</button><b>${slotLabel(x)}</b><span></span></div>
    <div class="recipe-body settings slot-sheet">
      <button class="recipe-head" data-action="open" data-id="${id}">${img(x.m.thumb ? x.m.thumb + '/small' : '', '')}
        <span><small>${slotKindLabel(x)}</small><b>${esc(mealName(x.m))}</b></span><em>${t('recipe_word')} ${ICON.chev}</em></button>
      <div class="slot-line ${x.off ? 'disabled' : ''}">
        <span><b>${t('f_portions')}</b><small>${t('portions_hint')}</small></span>
        <span class="stepper"><button data-action="slot-portions" data-id="${id}" data-dir="-1" aria-label="${t('less')}">−</button><b>${x.portions}</b><button data-action="slot-portions" data-id="${id}" data-dir="1" aria-label="${t('more')}">+</button></span>
      </div>
      <button class="opt-card ${x.off ? '' : 'on'}" data-action="slot-off" data-id="${id}" role="switch" aria-checked="${!x.off}">
        <span class="opt-ico">${icon(x.kind === 'lunch' ? 'sun' : 'moon')}</span>
        <span class="opt-txt"><b>${t('slot_eat')}</b><small>${x.off ? t('slot_off_sub') : t('slot_on_sub')}</small></span>
        <span class="switch"><i></i></span>
      </button>
      <div class="prefs-actions"><button class="btn" data-action="swap" data-id="${id}">${ICON.swap} ${t('change_dish')}</button></div>
    </div>`;
  showSheet();
}

// ----- Recettes -----
// Onglets : favoris (par défaut), recettes pour moi, toute la base, ou ce qu'on peut cuisiner avec son frigo.
const EXPLORE_TABS = [['fav', 'heart'], ['forme', 'smile'], ['all', 'book-open'], ['fridge', 'refrigerator']];
const favIds = () => Object.keys(S.feedback).filter(id => S.feedback[id] === 1 && S.byId.has(id)).reverse();
const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function exploreBase() {
  const mode = S.explore.mode;
  if (mode === 'fav') return favIds().map(rankedOf);
  if (mode === 'all') {
    const rest = S.db.filter(m => !S.rankedById.has(m.id)).sort((a, b) => mealName(a).localeCompare(mealName(b)))
      .map(m => ({ m, score: null, reasons: [], out: true }));
    return [...S.ranked, ...rest];
  }
  return S.ranked;
}

function exploreResults() {
  const E = S.explore;
  if (E.mode === 'fridge') return fridgeResults();
  const q = fold(E.q.trim());
  let list = exploreBase();
  if (q) list = list.filter(({ m }) => fold(m.name + ' ' + mealName(m) + ' ' + cuisineLabel(m.f.cuisine) + ' ' + m.country + ' ' + m.ingr.map(i => i.n + ' ' + trIng(i.n)).join(' ')).includes(q));
  if (E.quick) list = list.filter(({ m }) => m.f.time <= 30);
  if (E.veggie) list = list.filter(({ m }) => m.f.isVeggie);
  if (E.light) list = list.filter(({ m }) => mealKcal(m) <= 550);
  if (E.mild) list = list.filter(({ m }) => m.f.hot === 0);
  if (E.cheap) list = list.filter(({ m }) => mealPrice(m) <= 2.5);
  if (E.cuisine) list = list.filter(({ m }) => m.f.cuisine === E.cuisine);
  return list;
}

// Pictos d'un plat : pimenté, épicé, sucré, fromage, végé, rapide.
function badgeList(m) {
  const f = m.f, b = [];
  if (f.hot >= 2) b.push(['flame', 'b_hot', 'hot']);
  if (f.spiced >= 3) b.push(['sparkles', 'b_spiced', 'spiced']);
  if (f.sweet >= 3) b.push(['candy', 'b_sweet', 'sweet']);
  if (f.cheese >= 2) b.push(['cheese', 'b_cheese', 'cheese']);
  if (f.isVeggie) b.push(['leaf', 'b_veg', 'veg']);
  if (f.time <= 25) b.push(['timer', 'b_quick', 'quick']);
  return b;
}
const badgeIcon = ([ico, k, cls]) => `<i class="bdg ${cls}" title="${t(k)}" aria-label="${t(k)}">${icon(ico)}</i>`;
// Pictos posés sur une photo (vignettes, plat du jour), avec les calories.
function tileBadges(m, cls = 'tile-badges') {
  const b = badgeList(m);
  return `<span class="${cls}">${b.slice(0, 4).map(badgeIcon).join('')}<i class="bdg kcal" title="${t('kcal_title')}">${t('kcal', { n: mealKcal(m) })}</i></span>`;
}

function recipeTile(r) {
  const m = r.m, inPlan = inWeek(m.id), pct = r.out ? null : matchPct(r.score), fav = S.feedback[m.id] === 1;
  const sub = r.fridge
    ? `<small class="fridge-line ${r.fridge.miss.length ? '' : 'ok'}">${r.fridge.miss.length ? esc(t('fridge_missing', { l: r.fridge.miss.slice(0, 3).join(', ') + (r.fridge.miss.length > 3 ? '…' : '') })) : ICON.check + t('fridge_all')}</small>`
    : `<small>${fmtMinutes(m.f.time)} · ${esc(cuisineLabel(m.f.cuisine))}${r.out ? ` · <span class="out">${t('out_of_taste')}</span>` : ''}</small>`;
  return `<article class="tile ${r.out ? 'is-out' : ''}" data-action="open" data-id="${m.id}">
    <div class="tile-pic">${img(med(m.thumb), mealName(m))}
      ${r.fridge ? `<span class="tile-match">${t('fridge_have', { h: r.fridge.have, t: r.fridge.total })}</span>` : pct ? `<span class="tile-match">${pct} %</span>` : ''}
      <button class="tile-fav ${fav ? 'on' : ''}" data-action="like" data-id="${m.id}" aria-label="${t('fav_add')}" aria-pressed="${fav}">${icon('heart')}</button>
      ${tileBadges(m)}
      <button class="tile-add ${inPlan ? 'on' : ''}" data-action="${inPlan ? 'noop' : 'add'}" data-id="${m.id}" aria-label="${inPlan ? t('in_week') : t('add_week')}">${inPlan ? ICON.check : ICON.plus}</button>
    </div>
    <div class="tile-body"><b>${esc(mealName(m))}</b>${sub}</div>
  </article>`;
}

function renderExploreTabs() {
  const nFav = favIds().length;
  $('#explore-tabs').innerHTML = EXPLORE_TABS.map(([id, ico]) =>
    `<button class="${S.explore.mode === id ? 'on' : ''}" data-action="explore-mode" data-id="${id}">${icon(ico)}<span>${t('tab_' + id)}${id === 'fav' && nFav ? ` <em>${nFav}</em>` : ''}</span></button>`).join('');
}

function renderExplorePanel() {
  const E = S.explore;
  if (E.mode === 'fridge') { $('#explore-panel').innerHTML = fridgePanel(); bindIngrSearch('#fridge-q', '#fridge-sugg', 'fridge-add'); return; }
  const nNo = (S.prefs.noIngr || []).length;
  $('#explore-panel').innerHTML = `
    <div class="search">
      ${ICON.search}
      <input type="search" id="q" placeholder="${t('search_ph')}" value="${esc(E.q)}" autocomplete="off">
    </div>
    <div class="chip-row filters-row">
      ${[['quick', 'timer'], ['veggie', 'leaf'], ['light', 'zap'], ['mild', 'snowflake'], ['cheap', 'piggy-bank']].map(([k, ico]) =>
        `<button class="toggle ${E[k] ? 'on' : ''}" data-action="filter" data-key="${k}">${icon(ico)}${t(k === 'quick' || k === 'veggie' ? k : 'f_' + k)}</button>`).join('')}
      <button class="toggle ${nNo ? 'on' : ''}" data-action="no-ingr">${icon('ban')}${t('no_ingr_btn', { n: nNo })}</button>
    </div>
    <div class="chip-row filters-row">
      <button class="toggle ${!E.cuisine ? 'on' : ''}" data-action="cuisine" data-id="">${t('all')}</button>
      ${CUISINES.map(c => `<button class="toggle ${E.cuisine === c.id ? 'on' : ''}" data-action="cuisine" data-id="${c.id}">${L('cuisines', c)}</button>`).join('')}
    </div>`;
  $('#q').addEventListener('input', e => { E.q = e.target.value; E.limit = 24; renderExploreResults(); });
}

function renderExploreResults() {
  const E = S.explore, list = exploreResults();
  renderExploreTabs();
  let empty = `<div class="empty"><div class="empty-ico">${icon('search')}</div><h2>${t('no_recipe_title')}</h2><p class="sub">${t('no_recipe_sub')}</p></div>`;
  if (E.mode === 'fav' && !favIds().length) empty = `<div class="empty"><div class="empty-ico">${icon('heart')}</div><h2>${t('no_fav_title')}</h2><p class="sub">${t('no_fav_sub')}</p>
    <div class="menu-tools"><button class="btn primary" data-action="explore-mode" data-id="forme">${t('see_for_me')}</button><button class="btn" data-action="explore-mode" data-id="all">${t('see_all')}</button></div></div>`;
  if (E.mode === 'fridge' && !S.fridge.length) empty = `<div class="empty"><div class="empty-ico">${icon('refrigerator')}</div><h2>${t('fridge_none_title')}</h2><p class="sub">${t('fridge_none_sub')}</p></div>`;
  const count = E.mode === 'fav' ? t('fav_count', { n: list.length }) : E.mode === 'all' ? t('all_count', { n: list.length }) : E.mode === 'fridge' ? '' : t('result_count', { n: list.length });
  $('#explore-results').innerHTML = list.length
    ? `${count ? `<p class="result-count">${count}</p>` : ''}
       <div class="tiles">${list.slice(0, E.limit).map(recipeTile).join('')}</div>
       ${list.length > E.limit ? `<div class="more"><button class="btn" data-action="more">${t('more_recipes')}</button></div>` : ''}`
    : empty;
}

function renderExplore() {
  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">${t('recipes_for_you', { n: S.ranked.length })}</p>
      <h1>${t('recipes_title')}</h1>
    </section>
    <div class="seg-toggle explore-tabs" id="explore-tabs"></div>
    <div id="explore-panel"></div>
    <div id="explore-results"></div>`;
  renderExplorePanel();
  renderExploreResults();
}

// ----- Ingrédients : recherche dans toute la base (frigo, « je n'aime pas ») -----
let ALL_INGR = null;
function allIngredients() {
  if (!ALL_INGR) {
    const c = new Map();
    for (const m of S.db) for (const i of m.ingr) { const k = i.n.toLowerCase().trim(); c.set(k, (c.get(k) || 0) + 1); }
    ALL_INGR = [...c].sort((a, b) => b[1] - a[1]).map(([en]) => ({ en, label: trIng(en) }));
  }
  return ALL_INGR;
}
function searchIngredients(q, skip = new Set()) {
  q = fold(q.trim());
  if (!q) return [];
  const seen = new Set();
  return allIngredients().filter(x => {
    if (skip.has(x.en) || !(fold(x.label).includes(q) || x.en.includes(q))) return false;
    const k = fold(x.label);
    if (seen.has(k)) return false;
    seen.add(k); return true;
  }).slice(0, 12);
}
// Champ de recherche d'ingrédient : propositions affichées sous le champ, sans perdre le focus.
function bindIngrSearch(input, box, action, skip = () => new Set()) {
  const el = $(input);
  const show = () => {
    $(box).innerHTML = searchIngredients(el.value, skip()).map(x =>
      `<button class="chip" data-action="${action}" data-en="${esc(x.en)}">${ICON.plus}${esc(x.label)}</button>`).join('');
  };
  el.addEventListener('input', show);
  el.addEventListener('keydown', e => { if (e.key === 'Enter') { const first = $(box + ' button'); if (first) handleAction(first); } });
  show();
}

// ----- Mon frigo -----
function fridgePanel() {
  return `<section class="fridge">
      <p class="sub">${t('fridge_sub')}</p>
      <div class="search">${ICON.search}<input type="search" id="fridge-q" placeholder="${t('fridge_ph')}" autocomplete="off"></div>
      <div class="ingr-sugg" id="fridge-sugg"></div>
      ${S.fridge.length ? `<div class="fridge-items">${S.fridge.map(x => `<button class="chip on" data-action="fridge-del" data-k="${esc(x.k)}">${img(ING_IMG(x.en), '')}${esc(trIng(x.en))}${icon('x')}</button>`).join('')}</div>
        <button class="btn ghost small" data-action="fridge-clear">${icon('rotate-ccw')} ${t('fridge_clear')}</button>` : ''}
      <p class="source-note">${t('fridge_basics')}</p>
    </section>`;
}

/** Plats classés par nombre d'ingrédients à acheter en plus de ce qu'il y a dans le frigo. */
function fridgeResults() {
  if (!S.fridge.length) return [];
  const have = new Set(S.fridge.map(x => x.k));
  const out = [];
  for (const r of S.ranked) {
    const keys = freshKeys(r.m);
    if (keys.size < 4 || r.m.f.isSide) continue; // un vrai plat, pas un condiment
    let n = 0; keys.forEach(k => have.has(k) && n++);
    if (!n) continue;
    const miss = [], seen = new Set();
    for (const i of r.m.ingr) {
      const info = ingInfo(i.n);
      if (info.skip || info.pantry) continue;
      const k = buyKey(info);
      if (!have.has(k) && !seen.has(k)) { seen.add(k); miss.push(trIng(i.n)); }
    }
    out.push({ ...r, fridge: { have: n, total: keys.size, miss } });
  }
  // d'abord les plats qui utilisent le plus ce qu'on a, chaque ingrédient manquant coûtant un peu moins qu'un ingrédient utilisé
  const val = (r) => r.fridge.have - r.fridge.miss.length * 0.7;
  return out.sort((a, b) => val(b) - val(a) || b.score - a.score);
}

// ----- Ingrédients que je n'aime pas -----
let noIngrDraft = null;
const noIngrLabel = (id) => {
  if (id.startsWith('i:')) return trIng(id.slice(2));
  const x = NO_INGR_BY_ID.get(id);
  return x ? (LANG === 'fr' ? x.label : LANG === 'en' ? x.en : x.zh) : id;
};
const noIngrChip = (x, on, action, attrs = `data-id="${x.id}"`) =>
  `<button class="chip ingr-chip ${on ? 'on' : ''}" data-action="${action}" ${attrs}>${img(ING_IMG(x.img), '')}${esc(noIngrLabel(x.id))}</button>`;

function openNoIngrSheet() {
  noIngrDraft = noIngrDraft || [...(S.prefs.noIngr || [])];
  modalId = null;
  const custom = noIngrDraft.filter(id => id.startsWith('i:'));
  $('#modal-body').innerHTML = `
    <div class="sheet-top"><button class="back" data-action="close-modal">${ICON.back} ${t('back')}</button><b>${t('no_ingr_title')}</b><span></span></div>
    <div class="recipe-body settings">
      <p class="sub">${t('no_ingr_sub')}</p>
      <div class="ingr-chips">${NO_INGR.map(x => noIngrChip(x, noIngrDraft.includes(x.id), 'noingr-toggle')).join('')}</div>
      <div class="search" style="margin-top:18px">${ICON.search}<input type="search" id="noingr-q" placeholder="${t('no_ingr_search')}" autocomplete="off"></div>
      <div class="ingr-sugg" id="noingr-sugg"></div>
      ${custom.length ? `<div class="fridge-items">${custom.map(id => `<button class="chip on" data-action="noingr-toggle" data-id="${esc(id)}">${img(ING_IMG(id.slice(2)), '')}${esc(noIngrLabel(id))}${icon('x')}</button>`).join('')}</div>` : ''}
      <div class="prefs-actions"><button class="btn primary" data-action="noingr-save">${t('save')}</button></div>
    </div>`;
  showSheet();
  bindIngrSearch('#noingr-q', '#noingr-sugg', 'noingr-add', () => new Set(custom.map(id => id.slice(2))));
}

/** Enregistre les ingrédients refusés et remplace les plats de la semaine qui en contiennent. */
function saveNoIngr() {
  S.prefs.noIngr = noIngrDraft;
  noIngrDraft = null;
  rerank();
  let n = 0;
  for (const x of weekSlots()) if (dislikedIngr(x.m, S.prefs.noIngr) && swapAt(x.id)) n++;
  save(); closeModal();
  toast(t('no_ingr_saved', { n }));
  if (S.view === 'explore') renderExplorePanel();
  refreshCurrent();
}

// ----- Courses -----
const slotShort = (x) => `${dayInfo(x.day).short.toLowerCase()}${lunchOn() ? ' ' + t(x.kind === 'lunch' ? 'lunch' : 'dinner').toLowerCase() : ''}`;

// Recettes qui utilisent l'ingrédient : noms si 1–2 recettes, sinon pastilles photo compactes.
function recipeChips(it) {
  const ids = [...it.meals].filter(id => S.byId.has(id));
  if (ids.length <= 2) return `<span class="uses">${ids.map(id => {
    const m = S.byId.get(id), x = slotOf(id);
    return `<button class="use" data-action="open" data-id="${id}" title="${esc(mealName(m))}">${img(m.thumb ? m.thumb + '/small' : '', '')}<span>${x ? slotShort(x) + ' · ' : ''}${esc(shortName(mealName(m)))}</span></button>`;
  }).join('')}</span>`;
  return `<span class="uses stack">${ids.map(id => {
    const m = S.byId.get(id), x = slotOf(id);
    return `<button class="ava" data-action="open" data-id="${id}" title="${x ? slotLabel(x) + ' · ' : ''}${esc(mealName(m))}">${img(m.thumb ? m.thumb + '/small' : '', mealName(m))}</button>`;
  }).join('')}<span class="stack-txt">${t('n_recipes', { n: ids.length })}</span></span>`;
}
const shortName = (n) => n.length > 22 ? n.slice(0, 20).trim() + '…' : n;

function shopRow(it, qty = it.qty, withUses = true) {
  const done = !!S.shopChecked[it.key];
  return `<div class="shop-item ${done ? 'done' : ''}">
    <label class="tick"><input type="checkbox" data-action="check" data-key="${esc(it.key)}" ${done ? 'checked' : ''}><span class="box">${ICON.check}</span></label>
    <div class="shop-txt">
      <div class="shop-line"><b>${esc(it.label)}</b><span class="qty">${esc(qty)}</span></div>
      ${it.alts && it.alts.length ? `<span class="alts">${icon('arrow-left-right')}${esc(t('or_alts', { a: it.alts.join(', ') }))}</span>` : ''}
      ${withUses ? recipeChips(it) : ''}
    </div>
    <button class="find unav" data-action="unavail" data-key="${esc(it.key)}" title="${t('unavailable')}" aria-label="${t('unavailable')} : ${esc(it.label)}">${icon('ban')}</button>
    ${productSearch(it.fr) ? `<a class="find" href="${productSearch(it.fr)}" target="_blank" rel="noopener" title="${t('search_on', { s: storeChain(getStore()).site })}" aria-label="${t('search_on', { s: storeChain(getStore()).site })} : ${esc(it.label)}">${ICON.search}</a>` : ''}
  </div>`;
}

function renderShop() {
  const allSlots = activeSlots();
  const plan = shopSlots();
  const pastCount = allSlots.filter(x => x.past).length;
  const sh = buildShopping(plan, S.week.subs);
  const st = getStore();
  const all = sh.byRayon.flatMap(g => g.items);
  const doneCount = all.filter(it => S.shopChecked[it.key]).length;
  const sortDone = (items) => [...items].sort((x, y) => !!S.shopChecked[x.key] - !!S.shopChecked[y.key]);
  const filt = S.shopFilter && plan.some(x => x.id === S.shopFilter) ? S.shopFilter : null;
  const keep = (it) => !filt || it.meals.has(filt);
  const people = [...new Set(plan.map(x => x.portions))];

  let body = '';
  if (S.shopMode === 'recipe') {
    body = plan.filter(x => !filt || x.id === filt).map(x => {
      const factor = x.portions / BASE_SERVINGS;
      const seen = new Set();
      const rows = x.m.ingr.map(ing => {
        const info = boughtInfo(x.id, ing.n, S.week.subs); if (info.skip) return '';
        const it = sh.byKey.get(buyKey(info)); if (!it || seen.has(it.key)) return '';
        seen.add(it.key);
        return shopRow(it, measureFr(ing.m, factor, ing.n) || t('as_needed'), false);
      }).join('');
      return `<section class="shop-sec">
        <button class="recipe-head" data-action="open" data-id="${x.id}">${img(x.m.thumb ? x.m.thumb + '/small' : '', '')}
          <span><small>${slotLabel(x)} · ${t('stat_people', { n: x.portions }).replace(/<\/?b>/g, '')}</small><b>${esc(mealName(x.m))}</b></span><em>${t('recipe_word')} ${ICON.chev}</em></button>
        ${rows}
      </section>`;
    }).join('');
  } else {
    body = sh.byRayon.map(g => {
      const items = g.items.filter(keep);
      if (!items.length) return '';
      return `<section class="shop-sec">
        <h3><span class="ray-ico">${icon(g.rayon.icon)}</span>${rayonLabel(g.rayon)}<span class="count">${items.filter(it => !S.shopChecked[it.key]).length || ICON.check}</span></h3>
        ${sortDone(items).map(it => shopRow(it)).join('')}
      </section>`;
    }).join('');
    const pantry = sh.pantry.filter(keep);
    if (pantry.length) body += `<details class="shop-sec pantry"><summary><span class="ray-ico">${icon('house')}</span>${t('pantry_title')}<span class="count">${pantry.length}</span></summary>
      <p class="sub">${t('pantry_sub')}</p>${sortDone(pantry).map(it => shopRow(it)).join('')}</details>`;
  }

  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">${icon('store')} ${esc(st.name)}</p>
      <h1>${t('shop_title')}</h1>
    </section>
    ${(S.week.unavail || []).length ? `<div class="filter-note unavail-note">${icon('ban')}<span>${t('unavail_list', { l: esc(S.week.unavail.map(unavailLabel).join(', ')) })}</span><button data-action="unavail-reset">${t('reset')}</button></div>` : ''}
    ${pastCount ? `<button class="filter-note past-note" data-action="show-past"><span>${S.showPast ? t('past_shown', { n: pastCount }) : t('past_hidden', { n: pastCount })}</span><em>${S.showPast ? t('hide') : t('show')}</em></button>` : ''}
    ${plan.length ? `
    <div class="shop-bar">
      <div class="shop-progress"><div style="width:${all.length ? doneCount / all.length * 100 : 0}%"></div></div>
      <div class="shop-bar-row">
        <span>${t('in_cart', { d: doneCount, t: all.length })}</span>
        <span>${t('n_meals', { n: plan.length })} · ≈ ${fmtEuro(weekCost(plan))}</span>
      </div>
    </div>

    <p class="mini-title">${t('for_recipes')} <small>${t('for_recipes_hint')}</small></p>
    <div class="recipe-strip">
      <button class="strip-all ${!filt ? 'on' : ''}" data-action="shop-filter" data-id="">${t('all_short')}</button>
      ${plan.map(x => `<button class="strip-item ${filt === x.id ? 'on' : ''}" data-action="shop-filter" data-id="${x.id}">
        ${img(x.m.thumb ? x.m.thumb + '/small' : '', '')}<small>${slotLabel(x)}</small><span>${esc(shortName(mealName(x.m)))}</span></button>`).join('')}
    </div>
    ${filt ? `<button class="filter-note" data-action="open" data-id="${filt}"><span>${t('only_of', { name: esc(mealName(S.byId.get(filt))) })}</span>${ICON.chev}</button>` : ''}

    <div class="seg-toggle">
      <button class="${S.shopMode !== 'recipe' ? 'on' : ''}" data-action="shop-mode" data-id="rayon">${t('by_aisle')}</button>
      <button class="${S.shopMode === 'recipe' ? 'on' : ''}" data-action="shop-mode" data-id="recipe">${t('by_recipe')}</button>
    </div>

    <div class="shop">${body}</div>

    <div class="shop-tools">
      <button class="btn" data-action="share">${icon('share-2')} ${t('share_list')}</button>
      <button class="btn ${wakeLock ? 'lime' : ''}" data-action="wake">${icon('lightbulb')} ${wakeLock ? t('awake_on') : t('keep_awake')}</button>
      <button class="btn" data-action="uncheck">${icon('rotate-ccw')} ${t('uncheck_all')}</button>
    </div>
    ${storeCard(st)}`
      : `<div class="empty"><div class="empty-ico">${icon('shopping-cart')}</div><h2>${t('nothing_to_buy')}</h2><p class="sub">${t('nothing_to_buy_sub')}</p></div>`}
    <p class="source-note">${t('shop_note', { p: people.join(' / ') || S.prefs.portions })}${storeChain(st).site ? ' ' + t('shop_note_search', { s: storeChain(st).site }) : ''}</p>`;
}

// Carte du magasin : itinéraire, drive configuré selon l'enseigne, changement de magasin.
function storeCard(st) {
  const c = storeChain(st);
  const drive = c.drive ? (st.drive === 'found' ? t('drive_found') : t('drive_likely')) : t('drive_none');
  return `<div class="store-card">
      <div class="store-info"><span class="store-logo">${icon('store')}</span><div><b>${esc(st.name)}</b><span>${esc(st.address)}</span>
        <small class="drive-state ${c.drive ? (st.drive === 'found' ? 'ok' : 'maybe') : ''}">${icon('car')} ${drive}</small></div></div>
      <div class="store-links">
        <a class="btn small" href="${mapsLink(st)}" target="_blank" rel="noopener">${icon('map-pin')} ${t('itinerary')}</a>
        ${c.drive ? `<a class="btn small" href="${c.drive}" target="_blank" rel="noopener">${icon('car')} ${t('drive_btn', { c: c.name })}</a>` : ''}
        <button class="btn small" data-action="store-finder">${icon('search')} ${t('change_store')}</button>
        <button class="btn small" data-action="shop-settings">${icon('settings')} ${t('store_settings')}</button>
      </div>
    </div>`;
}

// Choix du magasin : recherche par ville / code postal ou autour de moi, via OpenStreetMap.
let storeResults = [], storeQuery = '', storeStatus = '';
function openStoreFinder() {
  modalId = null;
  $('#modal-body').innerHTML = `
    <div class="sheet-top"><button class="back" data-action="close-modal">${ICON.back} ${t('back')}</button><b>${t('store_find_title')}</b><span></span></div>
    <div class="recipe-body settings store-finder">
      <div class="join-row"><input id="store-q" placeholder="${t('store_find_ph')}" value="${esc(storeQuery)}" autocomplete="postal-code"><button class="btn" data-action="store-find">${icon('search')}</button></div>
      <button class="btn" data-action="store-geo">${icon('map-pin')} ${t('near_me')}</button>
      ${storeStatus ? `<p class="sub">${storeStatus}</p>` : ''}
      <div class="store-results">${storeResults.map((r, i) => {
        const c = CHAINS.find(x => x.id === r.chain);
        return `<button class="store-result" data-action="store-pick" data-idx="${i}">
          <span class="store-logo">${icon('store')}</span>
          <span class="sr-txt"><b>${esc(r.name)}</b><small>${esc(r.address || '')}${r.address ? ' · ' : ''}${r.km < 1 ? Math.round(r.km * 1000) + ' m' : r.km.toFixed(1).replace('.', decimalSep()) + ' km'}</small>
            <small class="drive-state ${r.drive === 'found' ? 'ok' : r.drive ? 'maybe' : ''}">${icon('car')} ${r.drive === 'found' ? t('drive_found') : r.drive ? t('drive_likely_short') : c && c.id !== 'other' ? t('drive_none') : t('drive_unknown')}</small></span>
          ${ICON.chev}</button>`;
      }).join('')}</div>
      <p class="source-note">${t('osm_credit')}</p>
    </div>`;
  showSheet();
  const input = $('#store-q');
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleAction($('[data-action=store-find]')); });
}

async function searchStores(at) {
  storeStatus = t('searching_stores'); storeResults = []; openStoreFinder();
  try {
    storeResults = await findStores(at);
    storeStatus = storeResults.length ? '' : t('no_store');
  } catch { storeStatus = t('store_err'); }
  openStoreFinder();
}

let wakeLock = null;
async function toggleWakeLock() {
  if (wakeLock) { await wakeLock.release().catch(() => {}); wakeLock = null; toast(t('wake_off')); return; }
  if (!('wakeLock' in navigator)) { toast(t('wake_unavailable')); return; }
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => { wakeLock = null; });
    toast(t('wake_on'));
  } catch { toast(t('wake_fail')); }
}

let rayonDraft = null;
function openShopSettings(order = getRayonOrder(), st = getStore()) {
  rayonDraft = order;
  modalId = null;
  $('#modal-body').innerHTML = `
    <div class="sheet-top"><button class="back" data-action="close-modal">${ICON.back} ${t('back')}</button><b>${t('store_settings_title')}</b><span></span></div>
    <div class="recipe-body settings">
      <label class="field">${t('store_name')}<input id="st-name" value="${esc(st.name)}"></label>
      <label class="field">${t('address')}<input id="st-address" value="${esc(st.address)}"></label>
      <h3 style="margin-top:22px">${t('aisle_order')}</h3>
      <p class="sub">${t('aisle_order_sub')}</p>
      <ol class="rayon-list">${order.map((id, i) => {
        const r = RAYONS.find(x => x.id === id);
        return `<li><span>${icon(r.icon)} ${rayonLabel(r)}</span>
          <button data-action="rayon-move" data-idx="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="${t('up')}">${icon('chevron-up')}</button>
          <button data-action="rayon-move" data-idx="${i}" data-dir="1" ${i === order.length - 1 ? 'disabled' : ''} aria-label="${t('down')}">${icon('chevron-down')}</button></li>`;
      }).join('')}</ol>
      <div class="prefs-actions">
        <button class="btn primary" data-action="shop-settings-save">${t('save')}</button>
        <button class="btn ghost" data-action="shop-settings-reset">${t('reset_default')}</button>
      </div>
    </div>`;
  showSheet();
}

// ----- Profil -----
function renderPrefs() {
  const P = S.prefs;
  const list = (ids, src, g) => ids.length ? ids.map(id => { const it = src.find(x => x.id === id); return it ? L(g, it) : id; }).join(', ') : '—';
  const votes = (obj, src, dir, g) => list(Object.keys(obj).filter(k => obj[k] === dir), src, g);
  const vote = (obj, src, g) => {
    const up = esc(votes(obj, src, 1, g)), down = esc(votes(obj, src, -1, g));
    return `${up !== '—' ? `<span class="vote-line">${icon('thumbs-up')} ${up}</span>` : ''}${down !== '—' ? `<span class="vote-line">${icon('thumbs-down')} ${down}</span>` : ''}` || '—';
  };
  const rows = [
    ['target', t('row_objectives'), esc(list(P.objectives, OBJECTIVES, 'objectives'))],
    ['smile', t('row_craving'), esc(list([P.craving].filter(Boolean), CRAVINGS, 'cravings'))],
    ['salad', t('row_diet'), esc(list([P.diet].filter(Boolean), DIETS, 'diets'))],
    ['ban', t('row_avoid'), esc(list(P.avoid, AVOID, 'avoid'))],
    ['thumbs-down', t('row_no_ingr'), esc((P.noIngr || []).map(noIngrLabel).join(', ') || '—')],
    ['dumbbell', t('row_nutrition'), esc(list(P.nutrition, NUTRITION, 'nutrition'))],
    ['earth', t('row_cuisines'), vote(P.cuisines, CUISINES, 'cuisines')],
    ['flame', t('row_flavours'), vote(P.flavours, FLAVOURS, 'flavours')],
    ['drumstick', t('row_proteins'), vote(P.proteins, PROTEINS, 'proteins')],
    ['chef-hat', t('row_dishes'), vote(P.dishes, DISH_TYPES, 'dishes')],
    ['calendar', t('row_week'), t('week_value', { n: P.nights, p: P.portions }) + (P.lunch ? '<br>' + t('week_lunch_value', { p: P.lunchPortions || P.portions }) : '')],
    ['piggy-bank', t('budget_title'), budgetLabel(BUDGETS.find(b => b.id === (P.budget || 'none')))],
    ['star', t('row_rated'), t('rated_value', { l: Object.values(S.feedback).filter(v => v === 1).length, d: Object.values(S.feedback).filter(v => v === -1).length })],
  ];
  const info = S.dbInfo;
  const srcLabel = t('src_' + info.source);
  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">${t('your_tastes')}</p>
      <h1>${t('profile_title')}</h1>
    </section>
    <button class="cta-card" data-action="edit-prefs">
      <span class="cta-ico">${icon('pencil')}</span><span><b>${t('redo_quiz')}</b><small>${t('redo_quiz_sub')}</small></span>${ICON.chev}
    </button>
    <button class="cta-card light" data-action="no-ingr"><span class="cta-ico">${icon('ban')}</span><span><b>${t('no_ingr_title')}</b><small>${esc((P.noIngr || []).map(noIngrLabel).join(', ')) || t('no_ingr_edit')}</small></span>${ICON.chev}</button>
    <button class="cta-card light" data-action="goto-fav"><span class="cta-ico">${icon('heart')}</span><span><b>${t('tab_fav')}</b><small>${t('fav_count', { n: favIds().length })}</small></span>${ICON.chev}</button>
    <button class="cta-card light" data-action="lang"><span class="cta-ico">${icon('globe')}</span><span><b>${t('language')}</b><small>${langInfo().label}</small></span>${ICON.chev}</button>
    ${syncCard()}
    <div class="prefs">${rows.map(([ico, k, v]) => `<div class="row"><span class="row-ico">${icon(ico)}</span><div><b>${k}</b><div>${v}</div></div></div>`).join('')}</div>
    <div class="prefs-actions">
      <button class="btn" data-action="reset-feedback">${t('reset_feedback')}</button>
      <button class="btn" data-action="refresh-db">${t('refresh_db')}</button>
      <button class="btn ghost" data-action="reset-all">${t('reset_all')}</button>
    </div>
    <p class="source-note">${t('base_note', { n: S.db.length, src: srcLabel })}${info.at ? ' — ' + new Date(info.at).toLocaleString(langInfo().locale) : ''}.</p>`;
}

function syncCard() {
  if (!Sync.available) return `<section id="sync-card" class="sync-card">
    <div class="sync-head"><span class="sync-ico">${icon('users')}</span><div><b>${t('household')}</b><small>${t('sync_off')}</small></div></div>
    <p class="sub">${t('sync_off_sub')}</p></section>`;
  if (!Sync.code) return `<section id="sync-card" class="sync-card">
    <div class="sync-head"><span class="sync-ico">${icon('users')}</span><div><b>${t('share_household')}</b><small>${t('share_household_sub')}</small></div></div>
    <button class="btn primary" data-action="sync-create">${t('create_household')}</button>
    <div class="join-row"><input id="join-code" placeholder="XXXXX-XXXXX" autocomplete="off" autocapitalize="characters"><button class="btn" data-action="sync-join">${t('join')}</button></div>
  </section>`;
  const label = Sync.status === 'off' ? '' : t('st_' + Sync.status);
  return `<section id="sync-card" class="sync-card on">
    <div class="sync-head"><span class="sync-ico">${icon('users')}</span><div><b>${t('household')}</b><small class="st-${Sync.status}">${label}</small></div></div>
    <div class="code-box"><span>${t('household_code')}</span><b>${Sync.code}</b></div>
    <button class="btn primary" data-action="sync-share">${icon('share-2')} ${t('invite_phone')}</button>
    <p class="sub">${t('household_help')}</p>
    <button class="btn ghost" data-action="sync-leave">${t('leave_household')}</button>
  </section>`;
}

// ---------- Fiche recette ----------
let modalPortions = 2, modalId = null;
const doneSteps = new Set();

function openRecipe(id) {
  if (modalId !== id) { doneSteps.clear(); S.recipeTab = 'ingr'; S.altOpen = null; }
  const x = slotOf(id);
  modalId = id; sheetSlot = null;
  modalPortions = x ? x.portions : S.prefs ? S.prefs.portions : 2;
  renderRecipe();
  showSheet();
  $('.modal-card').scrollTop = 0;
  // recette absente des traductions embarquées : traduite à la volée puis réaffichée
  const m = S.byId.get(id);
  if (needsTranslation(m)) translateMeal(m).then(ok => { if (ok && modalId === id) renderRecipe(); });
}

// Découpe les instructions en étapes numérotées.
function splitSteps(text) {
  const lines = text.replace(/\r/g, '').split(/\n+/).map(l => l.trim()).filter(Boolean)
    .filter(l => !/^(step\s*|étape\s*|步骤\s*)?\d+[.):]?$/i.test(l))
    // lignes de valeurs nutritionnelles (« 445 calories, 24g fat… ») : pas une étape
    .filter(l => !/\d+\s*(calories|kcal|卡路里|千卡)?.*\d+\s*(g|克)?/i.test(l) || l.length > 220);
  let steps = lines.map(l => l.replace(/^(step\s*\d+[.:)]?\s*|étape\s*\d+[.:)]?\s*|步骤\s*\d+[.:)：]?\s*|\d+[.)]\s+)/i, '').trim()).filter(Boolean);
  if (steps.length === 1 && steps[0].length > 400) steps = steps[0].match(/[^.!?。！？]+[.!?。！？]+(\s|$)/g)?.reduce((acc, sentence) => {
    if (!acc.length || acc[acc.length - 1].length > 220) acc.push(sentence.trim()); else acc[acc.length - 1] += ' ' + sentence.trim();
    return acc;
  }, []) || steps;
  return steps;
}

// Ligne d'ingrédient : produit acheté (alternative éventuelle), quantité, et choix d'une alternative.
function ingredientRow(m, i, idx, factor, ctx) {
  const orig = ingInfo(i.n);
  const info = boughtInfo(m.id, i.n, S.week.subs);
  const fam = !orig.pantry && !orig.skip ? familyOf(orig.fr) : null;
  const subbed = !!info.subOf;
  const name = subbed ? ingLabel(info.en, info.fr) : trIng(i.n);
  const it = ctx.sh && ctx.sh.byKey.get(buyKey(info));
  // avec les courses regroupées, on achète parfois un autre produit de la même famille : on le signale
  const buyAs = it && normFr(it.fr) !== normFr(info.fr) ? it.label : null;
  const shared = !info.pantry && !info.skip && ctx.elsewhere.has(buyKey(info));
  const open = S.altOpen === idx;
  return `<li class="${open ? 'open' : ''}">${img(ING_IMG(subbed ? info.en : i.n), '')}
    <span class="ingr-name">${esc(name)}${shared ? ` <span class="shared-tag" title="${t('shared_title')}">${icon('recycle')}</span>` : ''}
      ${subbed ? `<small class="was">${t('instead_of', { x: esc(trIng(i.n)) })}</small>` : ''}
      ${buyAs ? `<small class="was">${icon('shopping-cart')} ${esc(t('buy_as', { x: buyAs }))}</small>` : ''}</span>
    <span class="m">${esc(measureFr(i.m, factor, subbed ? info.en : i.n))}</span>
    ${fam ? `<button class="alt-btn ${subbed ? 'on' : ''}" data-action="alt" data-idx="${idx}" title="${t('alternatives')}" aria-label="${t('alternatives')}">${icon('arrow-left-right')}</button>` : ''}
    ${open ? `<div class="alt-list"><small>${t('replace_with')}</small>${fam.items.map(a => {
      const isOrig = normFr(a.fr) === normFr(orig.fr), on = normFr(a.fr) === normFr(info.fr);
      return `<button class="chip ${on ? 'on' : ''}" data-action="alt-pick" data-idx="${idx}" data-fr="${esc(isOrig ? '' : a.fr)}">${isOrig ? ICON.check : ''}${esc(ingLabel(a.en, a.fr))}</button>`;
    }).join('')}</div>` : ''}
  </li>`;
}

function renderRecipe() {
  const m = S.byId.get(modalId), r = S.rankedById.get(modalId);
  const factor = modalPortions / BASE_SERVINGS;
  const slot = slotOf(m.id), fb = S.feedback[m.id];
  const instr = mealInstr(m);
  const tl = langInfo().translate;
  // lien de secours vers Google Traduction tant que la recette n'est pas traduite
  const translate = tl && instr === m.instr ? `https://translate.google.com/?sl=en&tl=${tl}&op=translate&text=${encodeURIComponent(m.instr.slice(0, 4500))}` : '';
  const steps = splitSteps(instr);
  const tab = S.recipeTab;
  const active = slot ? activeSlots() : [];
  const elsewhere = new Set(); active.filter(x => x.id !== m.id).forEach(x => freshKeys(x.m).forEach(k => elsewhere.add(k)));
  const ctx = { elsewhere, sh: slot && !slot.off ? buildShopping(active, S.week.subs) : null };
  $('#modal-body').innerHTML = `
    <div class="sheet-top floating">
      <button class="back" data-action="close-modal" aria-label="${t('back')}">${ICON.back}<span>${t('back')}</span></button>
      <span></span>
      <div class="top-actions">
        <button class="round-btn fav ${fb === 1 ? 'on' : ''}" data-action="like" data-id="${m.id}" title="${t('fav_add')}" aria-label="${t('fav_add')}" aria-pressed="${fb === 1}">${icon('heart')}</button>
        <button class="round-btn" data-action="dislike" data-id="${m.id}" title="${t('dislike')}" aria-label="${t('dislike')}">${ICON.down}</button>
      </div>
    </div>
    <div class="recipe-hero">${img(m.thumb, mealName(m))}<div class="hero-shade"></div>
      <div class="hero-title">${slot ? `<span class="pill lime">${icon(slot.kind === 'lunch' ? 'sun' : 'calendar')}${slotLabel(slot)}</span>` : ''}<h2>${esc(mealName(m))}</h2>
        ${LANG !== 'en' && mealName(m) !== m.name ? `<small class="orig-name">${esc(m.name)}</small>` : ''}</div>
    </div>
    <div class="recipe-body">
      ${slot && slot.off ? `<button class="filter-note" data-action="slot" data-id="${m.id}"><span>${icon('ban')} ${t('slot_off_short')}</span>${ICON.chev}</button>` : ''}
      <div class="facts">
        <div><span>${t('f_time')}</span><b>${fmtMinutes(m.f.time)}</b></div>
        <div><span>${t('f_cuisine')}</span><b>${esc(cuisineLabel(m.f.cuisine))}</b></div>
        <div><span>${t('f_ingredients')}</span><b>${m.ingr.length}</b></div>
        <div class="fact-portions"><span>${t('f_portions')}</span><span class="stepper small"><button data-action="mportions" data-dir="-1" aria-label="${t('less')}">−</button><b>${modalPortions}</b><button data-action="mportions" data-dir="1" aria-label="${t('more')}">+</button></span></div>
      </div>
      ${tagsFor(m, 9, false)}
      ${r && r.reasons.length ? `<p class="why"><b>${t('for_you')}</b> ${r.reasons.map(x => esc(reasonText(x))).join(' · ')}</p>` : ''}

      <div class="seg-toggle recipe-tabs">
        <button class="${tab === 'ingr' ? 'on' : ''}" data-action="recipe-tab" data-id="ingr">${t('tab_ingr')}</button>
        <button class="${tab === 'steps' ? 'on' : ''}" data-action="recipe-tab" data-id="steps">${t('tab_steps', { n: steps.length })}</button>
      </div>
      <div class="recipe-cols tab-${tab}">
        <div class="col-ingr">
          <h3 class="col-title">${t('tab_ingr')} <small>${t('ingr_for', { n: modalPortions })}</small></h3>
          <ul class="ingr-list">${m.ingr.map((i, idx) => ingredientRow(m, i, idx, factor, ctx)).join('')}</ul>
          <p class="sub">${t('alt_hint')}</p>
        </div>
        <div class="col-steps">
          <h3 class="col-title">${t('prep')} ${translate ? `<small>${t('in_english')} · <a href="${translate}" target="_blank" rel="noopener">${t('translate')}</a></small>` : ''}</h3>
          <ol class="step-list">${steps.map((st, i) => `<li class="${doneSteps.has(i) ? 'done' : ''}" data-action="step" data-idx="${i}"><span class="num">${doneSteps.has(i) ? ICON.check : i + 1}</span><p>${esc(st)}</p></li>`).join('')}</ol>
          <p class="sub">${t('tap_step')}</p>
        </div>
      </div>
    </div>
    <div class="sheet-bar">
      ${slot
        ? `<button class="btn" data-action="swap-open" data-id="${m.id}" aria-label="${t('change_dish')}">${ICON.swap}<span class="lbl">${t('change')}</span></button><button class="btn primary grow" data-action="cook" data-id="${m.id}">${icon('chef-hat')} ${t('cook')}</button>`
        : `<button class="btn" data-action="cook" data-id="${m.id}" aria-label="${t('cook')}">${icon('chef-hat')}<span class="lbl">${t('cook')}</span></button><button class="btn primary grow" data-action="add" data-id="${m.id}">${ICON.plus} ${t('add_to_week')}</button>`}
      ${m.yt ? `<a class="btn icon-only" href="${esc(m.yt)}" target="_blank" rel="noopener" aria-label="${t('video')}">${ICON.play}</a>` : ''}
    </div>`;
}

// ---------- Mode cuisine : une étape à la fois, minuteurs, écran allumé ----------
let cook = null; // { id, step, showIngr }
const timers = []; // { label, end, done }
const TIMER_RX = /(\d+(?:[.,]\d+)?)\s*(?:(?:-|–|to|à|~|至)\s*(\d+(?:[.,]\d+)?))?\s*(minutes?|mins?\b|min\b|heures?|hours?|hrs?\b|h\b|分钟|小时)/gi;

/** Durées (en minutes) citées dans une étape : « 10 minutes », « 1-2 hours », « 20 分钟 »… */
function stepTimers(text) {
  const out = [];
  text = text.replace(/(\d*)\s?½/g, (_, a) => String((+a || 0) + 0.5));
  for (const x of text.matchAll(TIMER_RX)) {
    const v = parseFloat((x[2] || x[1]).replace(',', '.'));
    const mins = Math.round(/^(h|heure|hour|hr|小时)/i.test(x[3]) ? v * 60 : v);
    if (mins > 0 && mins <= 600 && !out.includes(mins)) out.push(mins);
  }
  return out.slice(0, 3);
}

async function keepAwake() {
  if (wakeLock || !('wakeLock' in navigator)) return;
  try { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } catch { /* non supporté */ }
}

function openCook(id) {
  cook = { id, step: 0, showIngr: false };
  modalId = null; sheetSlot = null;
  keepAwake();
  renderCook();
  showSheet();
}

function endCook() {
  if (!cook) return;
  cook = null;
  if (wakeLock) wakeLock.release().catch(() => {});
}

const fmtClock = (ms) => { const sec = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`; };
const timersHtml = () => timers.map((tm, i) => `<div class="timer ${tm.done ? 'done' : ''}">${icon('timer')}<span>${esc(tm.label)}</span><b>${tm.done ? t('timer_over') : fmtClock(tm.end - Date.now())}</b><button data-action="timer-stop" data-idx="${i}" aria-label="${t('timer_stop')}">${tm.done ? ICON.check : '×'}</button></div>`).join('');

function renderCook() {
  const m = S.byId.get(cook.id);
  const steps = splitSteps(mealInstr(m));
  const i = Math.min(cook.step, steps.length - 1);
  const factor = modalPortions / BASE_SERVINGS;
  $('#modal-body').innerHTML = `
    <div class="sheet-top"><button class="back" data-action="cook-exit">${ICON.back} ${t('back')}</button><b>${t('cook_step', { i: i + 1, n: steps.length })}</b>
      <button class="round-btn ${cook.showIngr ? 'on' : ''}" data-action="cook-ingr" title="${t('tab_ingr')}" aria-label="${t('tab_ingr')}">${icon('salad')}</button></div>
    <div class="cook">
      <div class="cook-progress"><i style="width:${(i + 1) / steps.length * 100}%"></i></div>
      <p class="cook-name">${esc(mealName(m))} · ${t('ingr_for', { n: modalPortions })}</p>
      ${cook.showIngr ? `<ul class="cook-ingr">${m.ingr.map(g => { const info = boughtInfo(m.id, g.n, S.week.subs); return `<li><span>${esc(info.subOf ? ingLabel(info.en, info.fr) : trIng(g.n))}</span><span class="m">${esc(measureFr(g.m, factor, info.subOf ? info.en : g.n))}</span></li>`; }).join('')}</ul>` : ''}
      <p class="cook-text">${esc(steps[i] || '')}</p>
      ${stepTimers(steps[i] || '').map(d => `<button class="btn lime cook-timer-btn" data-action="timer-start" data-min="${d}" data-step="${i + 1}">${icon('timer')} ${t('start_timer', { t: fmtMinutes(d) })}</button>`).join('')}
      <div class="cook-timers" id="cook-timers">${timersHtml()}</div>
    </div>
    <div class="sheet-bar">
      <button class="btn" data-action="cook-prev" ${i === 0 ? 'disabled' : ''} aria-label="${t('prev_step')}">${ICON.back}<span class="lbl">${t('prev_step')}</span></button>
      ${i < steps.length - 1
        ? `<button class="btn primary grow" data-action="cook-next">${t('next_step')} ${ICON.chev}</button>`
        : `<button class="btn primary grow" data-action="cook-done">${ICON.check} ${t('cook_done')}</button>`}
    </div>`;
}

// Fin d'un minuteur : vibration + trois bips, même si le mode cuisine est fermé.
function ring(tm) {
  tm.done = true;
  toast(t('timer_ended', { l: tm.label }));
  if (navigator.vibrate) navigator.vibrate([400, 200, 400, 200, 400]);
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.5, 1].forEach(at => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880; g.gain.value = 0.25;
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + at); o.stop(ctx.currentTime + at + 0.3);
    });
  } catch { /* pas de son */ }
}
setInterval(() => {
  if (!timers.length) return;
  timers.forEach(tm => { if (!tm.done && tm.end <= Date.now()) ring(tm); });
  const box = $('#cook-timers');
  if (box) box.innerHTML = timersHtml();
}, 1000);

// Feuille modale avec gestion du bouton « retour » du téléphone.
function showSheet() {
  $('#modal').hidden = false;
  document.body.classList.add('no-scroll');
  if (!(history.state && history.state.sheet)) history.pushState({ sheet: 1 }, '');
}
function hideSheet() {
  $('#modal').hidden = true; modalId = null; sheetSlot = null;
  endCook();
  document.body.classList.remove('no-scroll');
}
function closeModal() {
  if (history.state && history.state.sheet) history.back(); else hideSheet();
}
window.addEventListener('popstate', () => { if (!$('#modal').hidden) hideSheet(); });

// ---------- Langue ----------
function openLangSheet() {
  modalId = null;
  $('#modal-body').innerHTML = `
    <div class="sheet-top"><button class="back" data-action="close-modal">${ICON.back} ${t('back')}</button><b>Langue · Language · 语言</b><span></span></div>
    <div class="recipe-body settings lang-list">${LANGS.map(l => `
      <button class="lang-opt ${l.id === LANG ? 'on' : ''}" data-action="set-lang" data-id="${l.id}"><span>${l.label}</span>${l.id === LANG ? ICON.check : ''}</button>`).join('')}
    </div>`;
  showSheet();
}

// Textes fixes de index.html (onglets, pastille du foyer, bouton de langue).
function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  const lb = $('#lang-btn'); if (lb) lb.lastChild.textContent = langInfo().short;
}

// ---------- Actions ----------
function refreshCurrent() {
  if (S.draft) return;
  const y = window.scrollY;
  if (S.view === 'explore') renderExploreResults();
  else ({ menu: renderMenu, shop: renderShop, prefs: renderPrefs })[S.view]();
  window.scrollTo(0, y);
  if (cook) renderCook();
  else if (modalId) renderRecipe();
  else if (sheetSlot) openSlotSheet(sheetSlot);
  updateCartBadge();
}

/** Remplace le plat d'un repas ; renvoie l'id du nouveau plat (ou null). */
function swapAt(id) {
  const list = weekSlots().filter(x => !x.off || x.id === id);
  const idx = list.findIndex(x => x.id === id);
  if (idx < 0) return null;
  S.swapped.add(id);
  const rep = pickReplacement(S.ranked, S.prefs, list.map(x => x.kind), list, idx, new Set([...S.swapped, ...weekSlots().map(x => x.id), ...blockedMeals()]));
  if (!rep) { toast(t('no_alternative')); return null; }
  const x = list[idx];
  (x.kind === 'lunch' ? S.week.lunchIds : S.planIds)[x.day] = rep.m.id;
  // les réglages du repas (portions, exclusion) suivent le nouveau plat
  if (S.week.slots[id]) { S.week.slots[rep.m.id] = S.week.slots[id]; delete S.week.slots[id]; }
  dropSubs(id);
  useAlternatives(rep.m);
  save();
  return rep.m.id;
}

// ---------- Produits indisponibles ----------
const unavailSet = () => new Set(S.week.unavail || []);
const isUnavail = (fr, un = unavailSet()) => un.has(normFr(fr));
// alternative disponible pour un produit indisponible (de préférence un produit déjà dans la liste de courses)
function availableAlt(fr, un, prefer = new Set()) {
  const fam = familyOf(fr);
  if (!fam) return null;
  const ok = fam.items.filter(a => !un.has(normFr(a.fr)));
  return ok.find(a => prefer.has(normFr(a.fr))) || ok[0] || null;
}
/** Plats impossibles à cuisiner : un ingrédient indisponible sans alternative disponible. */
function blockedMeals() {
  const un = unavailSet(), out = new Set();
  if (!un.size) return out;
  for (const r of S.ranked) {
    if (r.m.ingr.some(i => { const info = ingInfo(i.n); return !info.skip && un.has(normFr(info.fr)) && !availableAlt(info.fr, un); })) out.add(r.m.id);
  }
  return out;
}
/** Remplace par une alternative les ingrédients indisponibles d'un plat ; renvoie false si l'un n'a pas d'alternative. */
function useAlternatives(m, prefer) {
  const un = unavailSet();
  let ok = true;
  for (const i of m.ingr) {
    const info = boughtInfo(m.id, i.n, S.week.subs);
    if (info.skip || !un.has(normFr(info.fr))) continue;
    const alt = availableAlt(info.fr, un, prefer);
    const k = m.id + '|' + i.n;
    if (!alt) { ok = false; continue; }
    if (normFr(alt.fr) === normFr(ingInfo(i.n).fr)) delete S.week.subs[k]; else S.week.subs[k] = alt.fr;
  }
  return ok;
}
/** Un article de la liste est introuvable au magasin : alternative si possible, sinon on change les recettes concernées. */
function markUnavailable(it) {
  S.week.unavail = [...new Set([...(S.week.unavail || []), normFr(it.fr)])];
  const sh = buildShopping(shopSlots(), S.week.subs);
  const prefer = new Set([...sh.byKey.values()].flatMap(x => [...x.members.keys()].map(normFr)));
  const toSwap = [];
  for (const x of shopSlots()) if (it.meals.has(x.id) && !useAlternatives(x.m, prefer)) toSwap.push(x.id);
  let swapped = 0;
  for (const id of toSwap) if (swapAt(id)) swapped++;
  delete S.shopChecked[it.key];
  save();
  const after = buildShopping(shopSlots(), S.week.subs).byKey.get(it.key);
  if (toSwap.length) toast(swapped === toSwap.length ? t('unavail_swap', { n: swapped }) : t('unavail_none'));
  else toast(t('unavail_alt', { x: it.label, y: after ? after.label : '' }));
}
const unavailLabel = (fr) => { const a = altItem(fr) || Object.entries(ING_FR).map(([en, v]) => ({ ...v, en })).find(v => normFr(v.fr) === fr); return a ? ingLabel(a.en, a.fr) : fr; };
const dropSubs = (id) => Object.keys(S.week.subs).forEach(k => k.startsWith(id + '|') && delete S.week.subs[k]);
const slotOpts = (id) => (S.week.slots[id] = S.week.slots[id] || {});

async function handleAction(el) {
  const { action, id, idx, view } = el.dataset;
  switch (action) {
    case 'home': if (S.prefs && !S.draft) showView('menu'); break;
    case 'goto': showView(view); break;
    case 'goto-fav': S.explore.mode = 'fav'; showView('explore'); break;
    case 'open': openRecipe(id); break;
    case 'close-modal': closeModal(); break;
    case 'regen': newPlan(); renderMenu(); updateCartBadge(); toast(t('new_week_toast')); break;
    case 'fill': fillWeek(); save(); renderMenu(); updateCartBadge(); break;
    case 'swap': {
      const newId = swapAt(id);
      if (newId && sheetSlot) sheetSlot = newId;
      refreshCurrent(); if (newId) toast(t('new_dish')); break;
    }
    case 'slot': openSlotSheet(id); break;
    case 'slot-portions': {
      const x = slotOf(id);
      slotOpts(id).p = Math.min(12, Math.max(1, x.portions + +el.dataset.dir));
      save(); refreshCurrent(); break;
    }
    case 'slot-off': {
      const o = slotOpts(id);
      if (o.off) delete o.off; else o.off = 1;
      save(); refreshCurrent(); toast(o.off ? t('slot_removed') : t('slot_restored')); break;
    }
    case 'toggle-lunch':
      S.prefs.lunch = !lunchOn();
      S.week.lunchIds = [];
      if (S.prefs.lunch) { S.prefs.lunchPortions = S.prefs.lunchPortions || S.prefs.portions; fillWeek(); }
      save(); renderMenu(); updateCartBadge(); toast(S.prefs.lunch ? t('lunches_added') : t('lunches_removed')); break;
    case 'show-past': S.showPast = !S.showPast; renderShop(); updateCartBadge(); break;
    case 'budget': openBudgetSheet(); break;
    case 'set-budget':
      S.prefs.budget = id; rerank(); newPlan(); closeModal(); renderMenu(); updateCartBadge(); toast(t('plan_recomputed')); break;
    case 'cook': openCook(id); break;
    case 'cook-exit': { const back = cook.id; endCook(); openRecipe(back); break; }
    case 'cook-ingr': cook.showIngr = !cook.showIngr; renderCook(); break;
    case 'cook-prev': cook.step = Math.max(0, cook.step - 1); renderCook(); $('.modal-card').scrollTop = 0; break;
    case 'cook-next': cook.step++; renderCook(); $('.modal-card').scrollTop = 0; break;
    case 'cook-done': endCook(); closeModal(); toast(t('cook_bravo')); break;
    case 'timer-start': {
      const mins = +el.dataset.min;
      timers.push({ label: t('timer_label', { s: el.dataset.step, t: fmtMinutes(mins) }), end: Date.now() + mins * 60000, done: false });
      $('#cook-timers').innerHTML = timersHtml();
      break;
    }
    case 'timer-stop': timers.splice(+idx, 1); if ($('#cook-timers')) $('#cook-timers').innerHTML = timersHtml(); break;
    case 'unavail': {
      const it = buildShopping(shopSlots(), S.week.subs).byKey.get(el.dataset.key);
      if (it && confirm(t('unavail_confirm', { x: it.label }))) { markUnavailable(it); refreshCurrent(); }
      break;
    }
    case 'unavail-reset': S.week.unavail = []; save(); renderShop(); break;
    case 'alt': S.altOpen = S.altOpen === +idx ? null : +idx; renderRecipe(); break;
    case 'alt-pick': {
      const ing = S.byId.get(modalId).ingr[+idx], k = modalId + '|' + ing.n;
      if (el.dataset.fr) S.week.subs[k] = el.dataset.fr; else delete S.week.subs[k];
      S.altOpen = null; save();
      const y = $('.modal-card').scrollTop; refreshCurrent(); $('.modal-card').scrollTop = y; break;
    }
    case 'add':
      if (!inWeek(id)) {
        if (!S.planIds.length) S.planStart = todayISO();
        S.planIds.push(id); save();
        toast(t('added_to_week', { day: dayInfo(S.planIds.length - 1).label.toLowerCase() }));
      }
      refreshCurrent(); break;
    case 'noop': break;
    case 'swap-open': {
      const newId = swapAt(id);
      if (newId) { refreshCurrent(); openRecipe(newId); toast(t('new_dish')); }
      break;
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
      save(); rerank(); refreshCurrent(); toast(S.feedback[id] === 1 ? t('fav_added') : t('fav_removed')); break;
    case 'dislike': {
      S.feedback[id] = -1;
      rerank();
      if (inWeek(id)) swapAt(id);
      save();
      if (modalId === id) closeModal();
      toast(t('disliked'));
      refreshCurrent(); break;
    }
    case 'filter': S.explore[el.dataset.key] = !S.explore[el.dataset.key]; S.explore.limit = 24; el.classList.toggle('on'); renderExploreResults(); break;
    case 'cuisine':
      S.explore.cuisine = id; S.explore.limit = 24;
      document.querySelectorAll('[data-action=cuisine]').forEach(b => b.classList.toggle('on', b === el));
      renderExploreResults(); break;
    case 'more': S.explore.limit += 24; renderExploreResults(); break;
    case 'explore-mode': S.explore.mode = id; S.explore.limit = 24; renderExplorePanel(); renderExploreResults(); break;
    case 'no-ingr': noIngrDraft = null; openNoIngrSheet(); break;
    case 'noingr-toggle': case 'noingr-add': {
      const v = action === 'noingr-add' ? 'i:' + el.dataset.en : id;
      noIngrDraft = noIngrDraft.includes(v) ? noIngrDraft.filter(x => x !== v) : [...noIngrDraft, v];
      const y = $('.modal-card').scrollTop; openNoIngrSheet(); $('.modal-card').scrollTop = y;
      if (action === 'noingr-add') $('#noingr-q').focus();
      break;
    }
    case 'noingr-save': saveNoIngr(); break;
    case 'fridge-add': case 'fridge-del': case 'fridge-clear': {
      if (action === 'fridge-add') {
        const k = buyKey(ingInfo(el.dataset.en));
        if (!S.fridge.some(x => x.k === k)) S.fridge.push({ k, en: el.dataset.en });
      } else S.fridge = action === 'fridge-clear' ? [] : S.fridge.filter(x => x.k !== el.dataset.k);
      saveLocal(); S.explore.limit = 24; renderExplorePanel(); renderExploreResults();
      if (action === 'fridge-add') $('#fridge-q').focus();
      break;
    }
    case 'mportions': {
      modalPortions = Math.min(12, Math.max(1, modalPortions + +el.dataset.dir));
      // recette de la semaine : les portions sont mémorisées pour ce repas (et la liste de courses suit)
      if (slotOf(modalId)) { slotOpts(modalId).p = modalPortions; save(); refreshCurrent(); } else renderRecipe();
      break;
    }
    case 'check': return; // géré par l’évènement change
    case 'uncheck': S.shopChecked = {}; save(); renderShop(); break;
    case 'share': {
      const text = shoppingText(buildShopping(shopSlots(), S.week.subs), S.shopChecked, getStore());
      if (navigator.share) { try { await navigator.share({ title: t('list_title'), text }); } catch { } break; }
      try { await navigator.clipboard.writeText(text); toast(t('list_copied')); } catch { toast(t('copy_fail')); }
      break;
    }
    case 'wake': await toggleWakeLock(); renderShop(); break;
    case 'shop-settings': openShopSettings(); break;
    case 'store-finder': storeStatus = ''; openStoreFinder(); break;
    case 'store-find': {
      storeQuery = $('#store-q').value.trim();
      if (!storeQuery) break;
      storeStatus = t('searching_stores'); openStoreFinder();
      try {
        const at = await geocode(storeQuery);
        if (!at) { storeStatus = t('place_unknown'); openStoreFinder(); break; }
        await searchStores(at);
      } catch { storeStatus = t('store_err'); openStoreFinder(); }
      break;
    }
    case 'store-geo':
      if (!navigator.geolocation) { toast(t('geo_denied')); break; }
      storeStatus = t('locating'); openStoreFinder();
      navigator.geolocation.getCurrentPosition(
        p => searchStores({ lat: p.coords.latitude, lon: p.coords.longitude }),
        () => { storeStatus = t('geo_denied'); openStoreFinder(); },
        { timeout: 15000, maximumAge: 600000 });
      break;
    case 'store-pick': {
      const r = storeResults[+idx];
      if (!r) break;
      const { km, ...picked } = r;
      store.set('qm_store', { ...picked, address: picked.address || storeQuery });
      save(); closeModal(); renderShop();
      toast(r.drive ? t('store_chosen_drive', { c: CHAINS.find(c => c.id === r.chain).name }) : t('store_chosen'));
      break;
    }
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
      store.set('qm_store', { ...getStore(), name: $('#st-name').value.trim() || DEFAULT_STORE.name, address: $('#st-address').value.trim() || DEFAULT_STORE.address });
      rayonDraft = null; save(); closeModal(); renderShop(); toast(t('store_saved')); break;
    case 'shop-settings-reset':
      store.del('qm_rayons'); store.del('qm_store'); rayonDraft = null; save(); closeModal(); renderShop(); toast(t('default_restored')); break;
    case 'edit-prefs': startWizard(true); break;
    case 'lang': openLangSheet(); break;
    case 'toggle-opt':
      S.prefs.optimizeShopping = S.prefs.optimizeShopping === false;
      newPlan(); renderMenu(); updateCartBadge(); toast(t('plan_recomputed')); break;
    case 'set-lang': setLang(id); break;
    case 'sync-create':
      try { el.disabled = true; await Sync.create(sharedState()); renderPrefs(); toast(t('household_created')); }
      catch (e) { console.warn(e); toast(t('create_fail')); el.disabled = false; }
      break;
    case 'sync-join': {
      const v = $('#join-code').value.trim();
      if (!v) { toast(t('enter_code')); break; }
      await joinHousehold(v);
      break;
    }
    case 'sync-share': {
      const text = t('invite_text', { link: Sync.inviteLink(), code: Sync.code });
      if (navigator.share) { try { await navigator.share({ title: 'QuoiManger', text }); } catch { } break; }
      try { await navigator.clipboard.writeText(text); toast(t('invite_copied')); } catch { toast(Sync.code); }
      break;
    }
    case 'sync-leave':
      if (confirm(t('leave_confirm'))) { Sync.leave(); renderPrefs(); }
      break;
    case 'reset-feedback':
      if (confirm(t('reset_feedback_confirm'))) { S.feedback = {}; save(); rerank(); renderPrefs(); toast(t('feedback_cleared')); }
      break;
    case 'refresh-db':
      store.del(DB_CACHE_KEY); location.reload(); break;
    case 'reset-all':
      if (confirm(t('reset_all_confirm'))) {
        ['qm_prefs', 'qm_feedback', 'qm_plan', 'qm_shop', 'qm_week'].forEach(k => store.del(k)); location.reload();
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
  navigator.serviceWorker.register('sw.js').then(reg => reg.update()).catch(() => {});
  // nouvelle version installée (PWA déjà ouverte) : on recharge une fois, sauf pendant le questionnaire
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (sessionStorage.getItem('qm_reloaded') || S.draft) return;
      sessionStorage.setItem('qm_reloaded', '1');
      location.reload();
    });
  }
  // revenir sur l'app (PWA en arrière-plan) vérifie aussi les mises à jour
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') navigator.serviceWorker.getRegistration().then(r => r && r.update()).catch(() => {});
  });
}

boot();
