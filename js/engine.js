// Moteur : chargement de la base, enrichissement des plats, scoring personnalisé, menu et courses.

const DB_CACHE_KEY = 'qm_db_v2';
const DB_TTL = 7 * 24 * 3600 * 1000;
const BASE_SERVINGS = 4; // la plupart des recettes TheMealDB sont pour ~4 personnes

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota / navigation privée */ } },
  del(k) { try { localStorage.removeItem(k); } catch { } },
};

// ---------- Chargement ----------
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = () => reject(new Error('Impossible de charger ' + src));
    document.head.appendChild(s);
  });
}

function normalizeMeal(r) {
  if (r.ingr) return r; // déjà normalisé (snapshot)
  const ingr = [];
  for (let i = 1; i <= 20; i++) {
    const n = (r['strIngredient' + i] || '').trim();
    if (n) ingr.push({ n, m: (r['strMeasure' + i] || '').trim() });
  }
  return {
    id: r.idMeal, name: r.strMeal, cat: r.strCategory || '', country: r.strCountry || AREA_TO_COUNTRY[r.strArea] || r.strArea || '',
    instr: r.strInstructions || '', thumb: r.strMealThumb || '', tags: (r.strTags || '').split(',').map(t => t.trim()).filter(Boolean),
    yt: r.strYoutube || '', src: r.strSource || '', ingr,
  };
}

async function fetchAllMeals(onProgress) {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const byId = new Map();
  let done = 0;
  // 6 requêtes en parallèle max pour rester gentil avec l’API
  const queue = [...letters];
  async function worker() {
    while (queue.length) {
      const l = queue.shift();
      const res = await fetch(`${API}search.php?f=${l}`);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const j = await res.json();
      (j.meals || []).forEach(m => byId.set(m.idMeal, normalizeMeal(m)));
      onProgress && onProgress(++done, letters.length, byId.size);
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  return [...byId.values()];
}

async function loadDatabase(onProgress, force = false) {
  const cached = store.get(DB_CACHE_KEY);
  if (!force && cached && Date.now() - cached.at < DB_TTL && cached.meals.length) {
    return { meals: cached.meals, source: 'cache', at: cached.at };
  }
  try {
    const meals = await fetchAllMeals(onProgress);
    if (meals.length < 50) throw new Error('Base incomplète');
    store.set(DB_CACHE_KEY, { at: Date.now(), meals });
    return { meals, source: 'api', at: Date.now() };
  } catch (e) {
    console.warn('API indisponible, utilisation de la copie locale', e);
    if (cached && cached.meals.length) return { meals: cached.meals, source: 'cache', at: cached.at };
    if (!window.MEALS_SNAPSHOT) await loadScript('js/meals-snapshot.js');
    return { meals: window.MEALS_SNAPSHOT, source: 'snapshot', at: null };
  }
}

// ---------- Enrichissement ----------
const count = (list, re, not) => list.filter(n => re.test(n) && !(not && not.test(n))).length;
const TRACE = new RegExp(KW.meatTrace.source + '|' + KW.fishTrace.source, 'i');
const EGG_NOT = /egg ?plant/i;
const TECHNIQUE = /deglaze|reduce by|emulsif|flamb|confit|blind bake|julienne|sous[- ]vide|temper|caramelis|braise|béchamel|bechamel|roux|beurre blanc|hollandaise|rest the meat|baste|fold in|sear/i;
const HOURS = /(\d+(?:\.\d+)?|an?|one|two|three|four)\s*(?:(?:-|to|–)\s*(\d+(?:\.\d+)?))?\s*(?:hours?|hrs?)\b/gi;
const MINS = /(\d+)\s*(?:(?:-|to|–)\s*(\d+))?\s*(?:min|mins|minutes)\b/gi;
const WORDNUM = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4 };

function estimateTime(m) {
  let cook = 0;
  for (const x of m.instr.matchAll(MINS)) cook += Math.min(+(x[2] || x[1]), 120);
  for (const x of m.instr.matchAll(HOURS)) {
    const h = +(x[2] || WORDNUM[x[1].toLowerCase()] || x[1]);
    if (h > 0 && h < 12) cook += h * 60;
  }
  const prep = 5 + m.ingr.length * 1.2;
  if (!cook) cook = Math.min(60, m.instr.length / 45);
  const total = prep + Math.min(cook, 300) * 0.75;
  return Math.max(10, Math.round(total / 5) * 5);
}

function detectTypes(m) {
  const text = m.name + ' ' + m.tags.join(' ');
  const types = Object.keys(DISH_RX).filter(t => DISH_RX[t].test(text));
  if (m.cat === 'Pasta' && !types.includes('pasta')) types.push('pasta');
  if (m.tags.some(t => /soup|stew|casserole|warming/i.test(t)) && !types.includes('soup')) types.push('soup');
  if (m.tags.includes('Curry') && !types.includes('curry')) types.push('curry');
  if (!types.length) {
    if (/\bwok\b|stir[- ]fry/i.test(m.instr)) types.push('wok');
    else if (/preheat (the )?oven|heat (the )?oven to/i.test(m.instr) && /bake|roast/i.test(m.instr)) types.push('oven');
    else types.push('plate');
  }
  return types;
}

function enrich(m) {
  const names = m.ingr.map(i => i.n.toLowerCase());
  const mains = names.filter(n => !TRACE.test(n));
  const f = {};
  const prot = new Set();
  for (const p of ['beef', 'pork', 'poultry', 'lamb', 'fish', 'seafood', 'plant']) if (count(mains, KW[p])) prot.add(p);
  if (count(mains, KW.egg, EGG_NOT)) prot.add('egg');
  const catMap = { Beef: 'beef', Chicken: 'poultry', Lamb: 'lamb', Goat: 'lamb', Pork: 'pork' };
  if (catMap[m.cat]) prot.add(catMap[m.cat]);
  if (m.cat === 'Seafood' && !prot.has('fish') && !prot.has('seafood')) prot.add('fish');
  f.proteins = prot;
  const ORDER = ['beef', 'lamb', 'pork', 'poultry', 'seafood', 'fish', 'plant'];
  const eggDish = prot.has('egg') && /egg|omelet|frittata|shakshuka|tortilla española|quiche/i.test(m.name);
  f.main = catMap[m.cat] || ORDER.find(p => prot.has(p)) || (eggDish ? 'egg' : 'veg');

  const landMeat = ['beef', 'pork', 'poultry', 'lamb'].some(p => prot.has(p)) || count(names, KW.meatTrace) > 0;
  const sea = prot.has('fish') || prot.has('seafood') || count(names, KW.fishTrace) > 0;
  f.isVeggie = !landMeat && !sea;
  f.isPesco = !landMeat;
  f.isMeat = landMeat;

  f.allergens = new Set();
  if (count(names, KW.pork)) f.allergens.add('pork');
  if (count(names, KW.seafood) || /oyster sauce|shrimp paste|dried shrimp/i.test(names.join('|'))) f.allergens.add('seafood');
  if (count(names, KW.fish) || /fish sauce|fish stock|anchov|worcestershire|bonito|dashi/i.test(names.join('|'))) f.allergens.add('fish');
  if (count(names, KW.peanut)) f.allergens.add('peanut');
  if (count(names, KW.nuts, /nutmeg|coconut|peanut|butternut|doughnut/i)) f.allergens.add('nuts');
  if (count(names, KW.dairy, KW.dairyNot)) f.allergens.add('dairy');
  if (count(names, KW.gluten, KW.glutenNot)) f.allergens.add('gluten');
  if (count(names, KW.egg, EGG_NOT)) f.allergens.add('egg');

  f.time = estimateTime(m);
  f.overnight = /overnight|the day before/i.test(m.instr);
  f.herbs = count(names, KW.herbs);
  f.cheese = count(names, KW.cheese) + (m.tags.some(t => /chees|cheas/i.test(t)) ? 2 : 0);
  f.sweet = count(names, KW.sweet, /vinegar/i) + (m.tags.some(t => /sweet|glazed/i.test(t)) ? 2 : 0);
  f.spiced = count(names, KW.spiced);
  f.hot = count(names, KW.hot, KW.hotNot) + (m.tags.some(t => /spicy|chilli/i.test(t)) ? 2 : 0);
  f.veg = count(names, KW.veg, /oil|stock|sauce|paste|powder|vinegar|ketchup|puree|flakes/i);
  f.heavy = count(names, KW.heavy, KW.dairyNot) + (/deep[- ]fr|fry until (golden|crisp)/i.test(m.instr) ? 2 : 0) + (m.tags.some(t => /calorific|unhealthy|highfat/i.test(t)) ? 2 : 0);
  // le nom compte aussi : certaines fiches oublient le riz ou les pâtes dans les ingrédients
  f.carbs = count(names, KW.carb, /vinegar|wine|flour|noodle soup/i) + (KW.carb.test(m.name) || /arepa|pasta|pizza|burger|sandwich|\bpie\b/i.test(m.name) ? 1 : 0);
  f.cost = m.ingr.length * 0.4 + count(names, KW.pricey) * 2.5 - count(names, KW.cheap) * 0.8;
  f.offal = count(names, KW.offal) + (KW.offal.test(m.name) ? 1 : 0);
  f.types = detectTypes(m);
  f.chef = (m.ingr.length >= 12) + (m.instr.length > 1800) + TECHNIQUE.test(m.instr) + (f.time >= 30 && f.time <= 90) + (f.types.includes('plate'));
  let fam = 0;
  if (f.types.some(t => ['pasta', 'pizza', 'burger', 'oven', 'wrap', 'sandwich'].includes(t))) fam += 2;
  if (['Chicken', 'Pasta', 'Beef'].includes(m.cat)) fam += 1;
  if (f.hot >= 2) fam -= 3;
  if (f.offal) fam -= 4;
  if (f.spiced >= 5) fam -= 1;
  if (f.time > 90) fam -= 2;
  f.family = fam;
  f.isDinner = !['Dessert', 'Breakfast'].includes(m.cat);
  f.isSide = ['Side', 'Starter'].includes(m.cat);
  f.isStarter = m.cat === 'Starter';
  // aptitude au déjeuner : rapide, léger, salades / sandwichs / bols / soupes
  let lunch = f.time <= 25 ? 8 : f.time <= 35 ? 4 : f.time > 60 ? -10 : 0;
  if (f.overnight) lunch -= 10;
  if (f.types.some(t => ['salad', 'sandwich', 'wrap', 'rice', 'soup', 'burger'].includes(t))) lunch += 6;
  if (f.heavy >= 4) lunch -= 4;
  f.lunch = lunch;
  f.cuisine = COUNTRY_TO_CUISINE[m.country] || 'other';
  m.f = f;
  return m;
}

// ---------- Scoring ----------
const cuisineLabel = (id) => { const c = CUISINES.find(x => x.id === id); return c ? L('cuisines', c) : t('other'); };
const proteinLabel = (id) => { const p = PROTEINS.find(x => x.id === id); return p ? L('proteins', p) : t('vegetables'); };
const dishLabel = (id) => { const d = DISH_TYPES.find(x => x.id === id); return d ? L('dishes', d) : id; };
const GROUP_SRC = { proteins: PROTEINS, flavours: FLAVOURS, dishes: DISH_TYPES };
// Les raisons sont stockées sous forme de clés [clé, variables] et traduites à l'affichage.
function reasonText(r) {
  if (r[0] === 'lbl') return L(r[1].g, GROUP_SRC[r[1].g].find(x => x.id === r[1].id));
  if (r[0] === 'r_cuisine') return t('r_cuisine', { c: cuisineLabel(r[1].id) });
  return t(r[0], r[1]);
}

/** Renvoie { score, reasons } ou null si le plat est exclu par les préférences. */
function scoreMeal(m, P, feedback = {}) {
  const f = m.f;
  if (!f.isDinner) return null;
  if (feedback[m.id] === -1) return null;
  for (const a of P.avoid) if (f.allergens.has(a)) return null;
  if (P.diet === 'veggie' && !f.isVeggie) return null;
  if (P.diet === 'pesco' && !f.isPesco) return null;
  for (const p of f.proteins) if (P.proteins[p] === -1 && ['beef', 'pork', 'poultry', 'lamb', 'fish', 'seafood'].includes(p)) return null;

  let s = 50;
  const why = [];
  const add = (pts, reason) => { s += pts; if (reason && pts > 0) why.push([pts, reason]); };

  if (f.isSide) add(-12);
  if (f.offal) add(-8);

  // Envie
  if (P.craving === 'quick') {
    if (f.time <= 25) add(16, ['r_ready', { n: f.time }]); else if (f.time <= 35) add(8, ['r_ready', { n: f.time }]); else if (f.time > 60) add(-15);
    if (f.overnight) add(-10);
  } else if (P.craving === 'chef') {
    add(f.chef * 4, f.chef >= 3 ? ['r_chef'] : null);
    if (f.time < 20) add(-5);
  } else if (P.craving === 'family') {
    add(f.family * 4, f.family >= 2 ? ['r_family'] : null);
  }

  // Profil alimentaire
  if (P.diet === 'flexi') add(f.isMeat ? -10 : 8, f.isMeat ? null : ['r_nomeat']);
  if (P.diet === 'pesco' && (f.proteins.has('fish') || f.proteins.has('seafood'))) add(10, ['r_seafood']);

  // Nutrition
  if (P.nutrition.includes('light')) add(-f.heavy * 4 + (f.heavy === 0 ? 8 : 0), f.heavy === 0 ? ['r_light'] : null);
  if (P.nutrition.includes('lowcarb')) add(f.carbs === 0 ? 12 : -f.carbs * 6, f.carbs === 0 ? ['r_lowcarb'] : null);
  if (P.nutrition.includes('protein')) {
    const rich = ['beef', 'pork', 'poultry', 'lamb', 'fish', 'seafood', 'plant'].some(p => f.proteins.has(p));
    add(rich ? 10 : -6, rich ? ['r_protein'] : null);
  }
  if (P.nutrition.includes('veg')) add(Math.min(f.veg, 5) * 3 - 3, f.veg >= 4 ? ['r_veg', { n: f.veg }] : null);

  // Cuisines
  const c = P.cuisines[f.cuisine];
  if (c === 1) add(12, ['r_cuisine', { id: f.cuisine }]);
  if (c === -1) add(-25);

  // Protéines aimées
  const likedProt = [...f.proteins].filter(p => P.proteins[p] === 1);
  if (likedProt.length) add(10, ['lbl', { g: 'proteins', id: likedProt.includes(f.main) ? f.main : likedProt[0] }]);
  if (f.proteins.has('plant') && P.proteins.plant === -1) add(-12);
  if (f.proteins.has('egg') && P.proteins.egg === -1) add(-8);

  // Saveurs
  const flv = { herbs: f.herbs >= 2, cheese: f.cheese >= 2, sweet: f.sweet >= 2, spiced: f.spiced >= 3, hot: f.hot >= 1 };
  for (const [k, on] of Object.entries(flv)) {
    if (!on) continue;
    if (P.flavours[k] === 1) add(6, ['lbl', { g: 'flavours', id: k }]);
    if (P.flavours[k] === -1) add(k === 'hot' ? -25 : -14);
  }

  // Types de plat
  for (const t of f.types) {
    if (P.dishes[t] === 1) add(10, ['lbl', { g: 'dishes', id: t }]);
    if (P.dishes[t] === -1) add(-20);
  }

  // Objectifs
  if (P.objectives.includes('eco')) add(-f.cost * 1.6 + 8, f.cost < 4 ? ['r_budget'] : null);
  if (P.objectives.includes('time')) add(f.time <= 30 ? 8 : f.time > 60 ? -8 : 0, f.time <= 30 ? ['r_time'] : null);
  if (P.objectives.includes('nutri')) add(Math.min(f.veg, 4) * 2 - f.heavy * 2, null);
  if (P.objectives.includes('plan')) add(m.ingr.length <= 10 ? 4 : 0, m.ingr.length <= 10 ? ['r_few', { n: m.ingr.length }] : null);

  // Retours de l’utilisateur
  if (feedback[m.id] === 1) add(18, ['r_liked']);

  why.sort((a, b) => b[0] - a[0]);
  return { score: s, reasons: why.slice(0, 3).map(w => w[1]) };
}

function rankAll(meals, P, feedback) {
  const out = [];
  for (const m of meals) {
    const r = scoreMeal(m, P, feedback);
    if (r) out.push({ m, ...r });
  }
  return out.sort((a, b) => b.score - a.score);
}

// ---------- Familles d'ingrédients interchangeables ----------
const normFr = (s) => s.toLowerCase().replace(/’/g, "'").trim();
let FAMILY = null; // nom français normalisé → famille

/** Famille d'alternatives d'un produit (ou null). Chaque famille a `items` : produits du dictionnaire { fr, en, rayon, pantry }. */
function familyOf(fr) {
  if (!FAMILY) {
    FAMILY = new Map();
    const byFr = new Map();
    for (const [en, v] of Object.entries(ING_FR)) if (!byFr.has(normFr(v.fr))) byFr.set(normFr(v.fr), { ...v, en });
    for (const fam of ALT_FAMILIES) {
      fam.items = fam.members.map(fr => byFr.get(normFr(fr))).filter(Boolean);
      if (fam.items.length > 1) fam.items.forEach(it => FAMILY.set(normFr(it.fr), fam));
    }
  }
  return FAMILY.get(normFr(fr)) || null;
}
const altItem = (fr) => { const fam = familyOf(fr); return fam ? fam.items.find(it => normFr(it.fr) === normFr(fr)) : null; };

/** Clé d'achat d'un produit : toute une famille d'alternatives compte pour un seul achat. */
function buyKey(info) {
  const fam = info.pantry ? null : familyOf(info.fr);
  return fam ? 'fam:' + fam.id : normFr(info.fr);
}

// ---------- Menu de la semaine ----------
// Ingrédients à acheter pour un plat : synonymes et alternatives regroupés, placard exclu.
function freshKeys(m) {
  if (!m.f.fresh) {
    m.f.fresh = new Set();
    for (const i of m.ingr) {
      const info = ingInfo(i.n);
      if (!info.skip && !info.pantry) m.f.fresh.add(buyKey(info));
    }
  }
  return m.f.fresh;
}

// Poids d'un ingrédient différent supplémentaire, en points de score : plus il est élevé, plus le menu mutualise les courses.
const shoppingWeight = (P) => (P.optimizeShopping === false ? 0 : P.objectives.includes('waste') ? 12 : 9);

function pairPenalty(a, b, P) {
  let p = 0;
  if (a.f.cuisine === b.f.cuisine) p += P.objectives.includes('discover') ? 14 : 7;
  if (a.f.main === b.f.main) p += 6;
  if (a.f.types[0] === b.f.types[0]) p += 5;
  if (P.diet === 'flexi' && a.f.isMeat && b.f.isMeat) p += 15;
  // quasi-doublons (mêmes ingrédients ou même nom) : on ne veut pas deux fois le même plat dans la semaine
  const fa = freshKeys(a), fb = freshKeys(b);
  let inter = 0; fa.forEach(k => fb.has(k) && inter++);
  const jaccard = inter / Math.max(1, fa.size + fb.size - inter);
  if (jaccard > 0.55 || sameDish(a.name, b.name)) p += 80;
  return p;
}

const dishWords = (n) => n.toLowerCase().replace(/chakchouka|chakchuka|shakshuka|shakshouka/g, 'shakshuka').replace(/[^a-z ]/g, ' ').split(/\s+/).filter(w => w.length > 3).map(w => w.slice(0, 6));
function sameDish(x, y) {
  const a = new Set(dishWords(x)), b = dishWords(y);
  if (!a.size || !b.length) return false;
  const common = b.filter(w => a.has(w)).length;
  return common / Math.min(a.size, b.length) >= 1 || common / Math.max(a.size, b.length) >= 0.75;
}

// Bonus d'un plat selon le créneau : le midi favorise le rapide et le léger ; une entrée ne fait pas un dîner.
const slotBonus = (m, kind) => (kind === 'lunch' ? m.f.lunch : m.f.isStarter ? -1e6 : 0);

/**
 * Choisit un plat par créneau (kinds : 'dinner' | 'lunch') en maximisant goûts + variété − λ × ingrédients différents.
 * fixed[i] : plat imposé au créneau i (ou null). opts : lambda, noJitter, jitter, runs, exclude (ids interdits).
 * Évaluation incrémentale : changer un plat ne recalcule que ses paires et ses ingrédients.
 */
function buildPlan(ranked, P, kinds, fixed = [], opts = {}) {
  const lambda = opts.lambda ?? shoppingWeight(P);
  const jitterAmp = opts.noJitter ? 0 : (opts.jitter ?? 10); // un peu d'aléatoire pour varier d'une semaine à l'autre
  const exclude = opts.exclude || new Set();
  const n = kinds.length;
  const fixedList = kinds.map((_, i) => fixed[i] || null);
  const fixedIds = new Set(fixedList.filter(Boolean).map(r => r.m.id));
  const lunchy = kinds.includes('lunch');
  // accompagnements exclus (entrées acceptées le midi) : on cherche des plats principaux
  const pool = ranked.filter(r => (!r.m.f.isSide || (lunchy && r.m.f.isStarter)) && !exclude.has(r.m.id) && !fixedIds.has(r.m.id))
    .slice(0, Math.max(120, n * 12));
  const items = [...fixedList.filter(Boolean), ...pool];
  const M = items.length;
  const keyId = new Map();
  const keys = items.map(r => [...freshKeys(r.m)].map(k => (keyId.has(k) ? keyId.get(k) : (keyId.set(k, keyId.size), keyId.size - 1))));
  // un vrai repas a un minimum d'ingrédients frais : sans ça l'optimiseur préférerait des plats « vides »
  const base = items.map((r, j) => (r.score ?? 0) - (keys[j].length < 5 ? (5 - keys[j].length) * 8 : 0));
  const pairC = new Float64Array(M * M).fill(NaN);
  const pair = (a, b) => {
    let v = pairC[a * M + b];
    if (v !== v) { v = pairPenalty(items[a].m, items[b].m, P); pairC[a * M + b] = pairC[b * M + a] = v; }
    return v;
  };
  const fixedIdx = []; let fi = 0;
  fixedList.forEach((r, i) => { if (r) fixedIdx[i] = fi++; });
  const free = kinds.map((_, i) => i).filter(i => !fixedList[i]);

  function run(randomize) {
    const jit = items.map(() => Math.random() * jitterAmp);
    const val = (j, i) => base[j] + jit[j] + slotBonus(items[j].m, kinds[i]);
    const pick = new Array(n).fill(-1), used = new Uint8Array(M), cnt = new Int32Array(keyId.size);
    const place = (i, j) => { pick[i] = j; used[j] = 1; for (const k of keys[j]) cnt[k]++; };
    const unplace = (i) => { const j = pick[i]; pick[i] = -1; used[j] = 0; for (const k of keys[j]) cnt[k]--; };
    // gain à mettre le plat j dans le créneau i (vide)
    const gain = (i, j) => {
      let g = val(j, i);
      for (let x = 0; x < n; x++) if (pick[x] >= 0 && x !== i) g -= pair(j, pick[x]);
      for (const k of keys[j]) if (!cnt[k]) g -= lambda;
      return g;
    };
    fixedList.forEach((r, i) => r && place(i, fixedIdx[i]));
    const order = randomize ? [...free].sort(() => Math.random() - 0.5) : free;
    for (const i of order) {
      const cands = [];
      for (let j = 0; j < M; j++) if (!used[j]) cands.push([gain(i, j), j]);
      if (!cands.length) break;
      cands.sort((a, b) => b[0] - a[0]);
      place(i, cands[randomize ? Math.floor(Math.random() * Math.min(3, cands.length)) : 0][1]);
    }
    // amélioration locale : on remplace un plat à la fois tant que la valeur du menu augmente
    for (let pass = 0; pass < 8; pass++) {
      let improved = false;
      for (const i of free) {
        if (pick[i] < 0) continue;
        const cur = pick[i];
        unplace(i);
        let best = cur, bv = gain(i, cur) + 0.01;
        for (let j = 0; j < M; j++) if (!used[j] && j !== cur) { const g = gain(i, j); if (g > bv) { bv = g; best = j; } }
        place(i, best);
        if (best !== cur) improved = true;
      }
      if (!improved) break;
    }
    let total = 0;
    for (let i = 0; i < n; i++) if (pick[i] >= 0) { total += val(pick[i], i); for (let x = 0; x < i; x++) if (pick[x] >= 0) total -= pair(pick[i], pick[x]); }
    total -= lambda * cnt.reduce((a, c) => a + (c > 0), 0);
    return { pick, total };
  }

  const runs = opts.noJitter ? 1 : (opts.runs ?? 4);
  let best = null;
  for (let k = 0; k < runs; k++) {
    const r = run(k > 0);
    if (!best || r.total > best.total) best = r;
  }
  return best.pick.map(j => (j >= 0 ? items[j] : null));
}

/** Meilleur remplaçant pour le créneau `index` (les autres plats restent en place). */
function pickReplacement(ranked, P, kinds, current, index, excluded) {
  const fixed = current.map((r, i) => (i === index ? null : r));
  return buildPlan(ranked, P, kinds, fixed, { exclude: excluded, jitter: 8, runs: 1 })[index];
}

/** Statistiques d'achats d'un menu : nombre d'ingrédients différents et ingrédients partagés par au moins 2 plats. */
function planShopping(plan) {
  const count = new Map();
  plan.forEach(r => freshKeys(r.m).forEach(k => count.set(k, (count.get(k) || 0) + 1)));
  const shared = new Set([...count].filter(([, c]) => c > 1).map(([k]) => k));
  return { distinct: count.size, shared };
}

// Référence « menu non optimisé » : mêmes goûts, sans chercher à mutualiser les ingrédients (déterministe).
let baselineCache = { key: '', value: 0 };
function baselineDistinct(ranked, P, kinds) {
  const key = JSON.stringify([P, kinds, ranked.length, ranked[0] && ranked[0].m.id]);
  if (baselineCache.key !== key) {
    baselineCache = { key, value: planShopping(buildPlan(ranked, P, kinds, [], { lambda: 0, noJitter: true }).filter(Boolean)).distinct };
  }
  return baselineCache.value;
}

// ---------- Quantités & courses ----------
function parseQty(str) {
  const s = str.trim();
  const m = s.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?|½|¼|¾)/);
  if (!m) return null;
  const raw = m[1].replace(',', '.');
  let v;
  if (raw === '½') v = 0.5; else if (raw === '¼') v = 0.25; else if (raw === '¾') v = 0.75;
  else if (raw.includes(' ')) { const [a, b] = raw.split(/\s+/); const [x, y] = b.split('/'); v = +a + x / y; }
  else if (raw.includes('/')) { const [x, y] = raw.split('/'); v = x / y; }
  else v = +raw;
  return { v, rest: s.slice(m[0].length) };
}

function fmtQty(v) {
  if (v >= 10) return String(Math.round(v));
  const fr = [[0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.66, '⅔'], [0.75, '¾']];
  const whole = Math.floor(v), dec = v - whole;
  const f = fr.find(([d]) => Math.abs(dec - d) < 0.06);
  if (dec < 0.06) return String(whole || 1);
  if (f) return (whole ? whole + ' ' : '') + f[1];
  return String(Math.round(v * 10) / 10).replace('.', decimalSep());
}

function trIng(name) {
  const k = name.toLowerCase();
  if (LANG !== 'fr') return ingLabel(name, name);
  const fr = FR[k];
  if (fr) return fr.charAt(0).toUpperCase() + fr.slice(1);
  return ING_FR[k] ? ING_FR[k].fr : name;
}
