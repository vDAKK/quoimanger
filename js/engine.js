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

// ---------- Menu de la semaine ----------
const freshIngredients = (m) => new Set(m.ingr.map(i => i.n.toLowerCase()).filter(n => !PANTRY.test(n)));

function diversityAdjust(cand, chosen, P) {
  const f = cand.m.f;
  let adj = 0;
  const sameCuisine = chosen.filter(c => c.m.f.cuisine === f.cuisine).length;
  adj -= sameCuisine * (P.objectives.includes('discover') ? 14 : 7);
  const sameMain = chosen.filter(c => c.m.f.main === f.main).length;
  adj -= sameMain * 6;
  const sameType = chosen.filter(c => c.m.f.types[0] === f.types[0]).length;
  adj -= sameType * 5;
  if (P.diet === 'flexi' && f.isMeat) adj -= chosen.filter(c => c.m.f.isMeat).length * 15;
  if (P.objectives.includes('waste') && chosen.length) {
    const mine = freshIngredients(cand.m);
    const shared = new Set();
    chosen.forEach(c => freshIngredients(c.m).forEach(n => mine.has(n) && shared.add(n)));
    adj += Math.min(shared.size * 3, 15);
  }
  return adj;
}

function buildPlan(ranked, P, n, keep = []) {
  // On tire dans le haut du classement avec un peu d’aléatoire pour varier d’une semaine à l’autre.
  const pool = ranked.slice(0, Math.max(60, n * 10)).map(r => ({ ...r, jitter: Math.random() * 10 }));
  const chosen = [...keep];
  while (chosen.length < n && pool.length) {
    let best = -1, bestVal = -Infinity;
    pool.forEach((c, i) => {
      if (chosen.some(x => x.m.id === c.m.id)) return;
      const v = c.score + c.jitter + diversityAdjust(c, chosen, P);
      if (v > bestVal) { bestVal = v; best = i; }
    });
    if (best < 0) break;
    chosen.push(pool.splice(best, 1)[0]);
  }
  return chosen;
}

function pickReplacement(ranked, P, plan, index, excluded) {
  const others = plan.filter((_, i) => i !== index);
  const pool = ranked.filter(r => !plan.some(p => p.m.id === r.m.id) && !excluded.has(r.m.id)).slice(0, 80);
  let best = null, bestVal = -Infinity;
  for (const c of pool) {
    const v = c.score + Math.random() * 8 + diversityAdjust(c, others, P);
    if (v > bestVal) { bestVal = v; best = c; }
  }
  return best;
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
