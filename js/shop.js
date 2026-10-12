// Liste de courses optimisée magasin : français, unités métriques, quantités cumulées, rayons dans l'ordre du parcours.

const DEFAULT_STORE = {
  name: 'Intermarché Super Bourg-en-Bresse',
  address: '56 rue du Stand, 01000 Bourg-en-Bresse',
};

// Parcours type d'un Intermarché : frais à l'entrée, épicerie au centre, boissons puis surgelés en fin de parcours.
const RAYONS = [
  { id: 'fl', label: 'Fruits & légumes', icon: '🥕' },
  { id: 'bl', label: 'Boulangerie', icon: '🥖' },
  { id: 'bo', label: 'Boucherie & volaille', icon: '🥩' },
  { id: 'po', label: 'Poissonnerie', icon: '🐟' },
  { id: 'ch', label: 'Charcuterie & traiteur', icon: '🥓' },
  { id: 'cr', label: 'Crèmerie & œufs', icon: '🥛' },
  { id: 'fr', label: 'Fromages', icon: '🧀' },
  { id: 'ep', label: 'Épicerie salée & conserves', icon: '🥫' },
  { id: 'mo', label: 'Produits du monde', icon: '🌏' },
  { id: 'sa', label: 'Sauces, huiles & condiments', icon: '🫒' },
  { id: 'es', label: 'Épices & bouillons', icon: '🧂' },
  { id: 'su', label: 'Épicerie sucrée & pâtisserie', icon: '🍯' },
  { id: 'bs', label: 'Boissons & vins', icon: '🍷' },
  { id: 'sg', label: 'Surgelés', icon: '❄️' },
];

const rayonLabel = (r) => L('rayons', r);
const intermarcheSearch = (fr) => 'https://www.intermarche.com/recherche/' + encodeURIComponent(fr.split(' (')[0].split(' / ')[0].trim());
const mapsLink = (store) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Intermarché ' + store.address);

// Ingrédient inconnu du dictionnaire (nouveau plat dans l'API) : on devine le rayon.
function ingInfo(en) {
  const k = en.toLowerCase().trim();
  if (ING_FR[k]) return { ...ING_FR[k], en };
  const guess =
    [KW.beef, KW.pork, KW.poultry, KW.lamb].some(r => r.test(k)) ? 'bo'
      : KW.fish.test(k) || KW.seafood.test(k) ? 'po'
        : KW.cheese.test(k) ? 'fr'
          : KW.dairy.test(k) && !KW.dairyNot.test(k) ? 'cr'
            : /powder|ground|dried|seed|spice|seasoning|stock|bouillon/.test(k) ? 'es'
              : /sauce|oil|vinegar|ketchup|mustard|mayo/.test(k) ? 'sa'
                : KW.veg.test(k) || KW.herbs.test(k) ? 'fl'
                  : 'ep';
  const fr = FR[k];
  return { en, fr: fr ? fr.charAt(0).toUpperCase() + fr.slice(1) : en, rayon: guess, pantry: PANTRY.test(k), skip: /^water$|warm water|cold water|boiling water/.test(k) };
}

// ---------- Mesures ----------
const WORD_QTY = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 0.5 };
const UNIT_RX = [
  [/^(kg|kilos?|kilograms?)\b/, 'kg'], [/^(g|gr|grams?|grammes?)\b/, 'g'], [/^(mg)\b/, 'mg'],
  [/^(ml|millilit(?:re|er)s?)\b/, 'ml'], [/^(cl)\b/, 'cl'], [/^(l|lit(?:re|er)s?)\b/, 'l'],
  [/^(lbs?|pounds?)\b/, 'lb'], [/^(fl\.? ?oz)\b/, 'floz'], [/^(oz|ounces?)\b/, 'oz'],
  [/^(cups?)\b/, 'cup'], [/^(tbsp|tbs|tblsp|tbls|tblspn|tablespoons?|tbsps?)\b/, 'cs'], [/^(tsp|teaspoons?|tsps?)\b/, 'cc'],
  [/^(cloves?)\b/, 'gousse'], [/^(cans?|tins?)\b/, 'boîte'], [/^(jars?)\b/, 'bocal'], [/^(bunch(?:es)?)\b/, 'botte'],
  [/^(handfuls?)\b/, 'poignée'], [/^(slices?)\b/, 'tranche'], [/^(sprigs?)\b/, 'brin'], [/^(packets?|packs?|bags?|pots?|tubs?|box(?:es)?)\b/, 'paquet'],
  [/^(heads?|bulbs?)\b/, 'tête'], [/^(sticks?|stalks?)\b/, 'bâton'], [/^(knobs?)\b/, 'noix'], [/^(leaves|leaf)\b/, 'feuille'],
  [/^(pinch(?:es)?|dash(?:es)?|splash|drizzle|sprinkl\w*)\b/, 'pincée'],
];
const COUNT_UNITS = ['pièce', 'gousse', 'boîte', 'bocal', 'botte', 'poignée', 'tranche', 'brin', 'paquet', 'tête', 'bâton', 'noix', 'feuille'];

const LIQUID_RX = /lait|crème liquide|crème entière|crème légère|bouillon|fumet|fond |jus|eau|vin|bière|cidre|sauce|huile|vinaigre|coulis|sirop|xérès|saké|mirin|cognac|passata/i;
function cupToMetric(fr, rayon) {
  const f = fr.toLowerCase();
  if (LIQUID_RX.test(f) || rayon === 'bs') return ['ml', 240];
  if (/riz|lentille|quinoa|semoule|boulgour|pois cass|couscous|sarrasin|avoine|polenta/.test(f)) return ['g', 190];
  if (/farine|maïzena|chapelure|fécule|cacao/.test(f)) return ['g', 125];
  if (/sucre/.test(f)) return ['g', 200];
  if (rayon === 'fr' || /parmesan|fromage/.test(f)) return ['g', 100];
  if (/noix|amande|cacahu|pignon|pistache|noisette|cajou|raisins secs/.test(f)) return ['g', 140];
  if (/épinard|roquette|salade|laitue|coriandre|persil|basilic|menthe|aneth|kale|pousses/.test(f)) return ['g', 30];
  if (/petits pois|maïs|haricots|pois chiche/.test(f)) return ['g', 160];
  if (rayon === 'fl') return ['g', 150];
  return ['ml', 240];
}

/** Analyse « 1 1/2 cups chopped » → { v, unit, rest } (unit: g, ml, cs, cc ou unité de comptage) ou { vague, rest }. */
function parseMeasure(measure, info) {
  let s = (measure || '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!s) return { vague: true, rest: '' };
  let v = null;
  const juice = s.match(/(?:juice|zest)(?: and (?:juice|zest))? of (\d+|one|a|half)/);
  if (juice) return { v: +juice[1] || WORD_QTY[juice[1]] || 1, unit: 'pièce', rest: s.replace(juice[0], juice[0].replace(/ of .*/, '')) };
  const q = parseQty(s);
  if (q) { v = q.v; s = q.rest.trim(); }
  else {
    const w = s.match(/^(a|an|one|two|three|four|five|six|half)\b\s*/);
    if (w) { v = WORD_QTY[w[1]]; s = s.slice(w[0].length); }
  }
  s = s.replace(/^[-–]\s*\d+(?:[.,]\d+)?\s*/, '').replace(/^x\s*/, '').trim();
  // « 1 (400ml) can » : on prend la contenance indiquée
  const pack = s.match(/^\((\d+(?:[.,]\d+)?)\s*(g|ml|oz|l|kg)\)\s*/);
  if (pack) {
    const rest = s.slice(pack[0].length).replace(/^(cans?|tins?|jars?|packs?|packets?|bags?)\b\s*/, '');
    return toMetric((v ?? 1) * parseFloat(pack[1].replace(',', '.')), pack[2], rest, info);
  }
  for (const [re, unit] of UNIT_RX) {
    const m = s.match(re);
    if (!m) continue;
    const rest = s.slice(m[0].length).replace(/^\s*\/\s*\d+(?:[.,]\d+)?\s*(oz|g|ml|lbs?|cups?)\b/, '').replace(/^[\s/.)]+/, '');
    if (unit === 'pincée') return { vague: true, rest: s };
    if (v == null) {
      if (['poignée', 'botte', 'noix', 'brin', 'tête', 'paquet'].includes(unit)) v = 1;
      else return { vague: true, rest: s };
    }
    return toMetric(v, unit, rest, info);
  }
  if (v == null) return { vague: true, rest: s };
  return toMetric(v, 'pièce', s, info);
}

function toMetric(v, unit, rest, info) {
  // l'ail se compte en gousses (1 c. à café d'ail haché ≈ 1 gousse)
  if (info.fr === 'Ail') {
    if (unit === 'pièce' || unit === 'cc') return { v, unit: 'gousse', rest };
    if (unit === 'cs') return { v: v * 3, unit: 'gousse', rest };
  }
  switch (unit) {
    case 'kg': return { v: v * 1000, unit: 'g', rest };
    case 'mg': return { vague: true, rest };
    case 'cl': return { v: v * 10, unit: 'ml', rest };
    case 'l': return { v: v * 1000, unit: 'ml', rest };
    case 'lb': return { v: v * 453.6, unit: 'g', rest };
    case 'oz': return LIQUID_RX.test(info.fr) ? { v: v * 29.6, unit: 'ml', rest } : { v: v * 28.35, unit: 'g', rest };
    case 'floz': return { v: v * 29.6, unit: 'ml', rest };
    case 'cup': { const [u, f] = cupToMetric(info.fr, info.rayon); return { v: v * f, unit: u, rest }; }
    default: return { v, unit, rest };
  }
}

const roundMetric = (v) => v < 20 ? Math.max(5, Math.round(v / 5) * 5) : v < 200 ? Math.round(v / 10) * 10 : Math.ceil(v / 50) * 50;
function fmtMetric(v, unit) {
  if (unit === 'g') { const r = roundMetric(v); return r >= 1000 ? (r / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' kg' : r + ' g'; }
  if (unit === 'ml') { const r = roundMetric(v); return r >= 1000 ? (r / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' L' : r + ' ml'; }
  if ((unit === 'cs' && v < 0.07) || (unit === 'cc' && v < 0.2)) return unitSpoon('pinch');
  if (unit === 'cs' || unit === 'cc') return fmtQty(v) + ' ' + unitSpoon(unit);
  return null;
}
const plural = (unit, n) => unitWord(unit, n);
function fmtCount(v, unit, round) {
  const n = round ? Math.max(1, Math.ceil(v - 0.01)) : v;
  const txt = round ? String(n) : fmtQty(n);
  return unit === 'pièce' ? txt : `${txt} ${plural(unit, n)}`;
}

// Petit lexique pour traduire les précisions des mesures (« chopped », « large »…).
const DESC_FR = [
  [/finely chopped|finely diced/g, 'finement haché'], [/roughly chopped|coarsely chopped/g, 'grossièrement haché'], [/chopped|minced/g, 'haché'],
  [/thinly sliced|finely sliced|sliced thinly/g, 'en fines tranches'], [/sliced/g, 'émincé'], [/diced|cubed/g, 'en dés'], [/grated/g, 'râpé'],
  [/crushed/g, 'écrasé'], [/beaten/g, 'battu'], [/peeled/g, 'pelé'], [/halved/g, 'coupé en deux'], [/quartered/g, 'en quartiers'],
  [/shredded/g, 'effiloché'], [/drained/g, 'égoutté'], [/rinsed/g, 'rincé'], [/softened/g, 'ramolli'], [/melted/g, 'fondu'], [/cooked/g, 'cuit'],
  [/large/g, 'gros'], [/medium/g, 'moyen'], [/small/g, 'petit'], [/whole/g, 'entier'], [/fresh/g, 'frais'], [/frozen/g, 'surgelé'],
  [/to taste|as required|as needed/g, 'selon goût'], [/to serve|for serving/g, 'pour servir'], [/garnish|to garnish/g, 'pour décorer'],
  [/for frying/g, 'pour la friture'], [/pinch(es)?/g, 'pincée'], [/dash(es)?|splash/g, 'trait'], [/drizzle/g, 'filet'],
  [/handful/g, 'poignée'], [/^juice$/g, 'le jus'], [/^zest$/g, 'le zeste'], [/^zest and juice$/g, 'zeste et jus'], [/juice of/g, 'jus de'], [/zest of/g, 'zeste de'], [/zest and juice of/g, 'zeste et jus de'], [/\band\b/g, 'et'], [/\bof\b/g, 'de'],
  [/boneless/g, 'désossé'], [/skinless/g, 'sans peau'], [/cut into/g, 'coupé en'], [/cubes/g, 'cubes'], [/pieces/g, 'morceaux'], [/strips/g, 'lanières'],
  [/wedges/g, 'quartiers'], [/rings/g, 'rondelles'], [/divided/g, 'en plusieurs fois'], [/room temperature/g, 'à température ambiante'], [/deseeded|seeded/g, 'épépiné'],
  [/leaves/g, 'feuilles'], [/sprigs?/g, 'brins'], [/topping/g, 'garniture'], [/optional/g, 'facultatif'],
];
const descFr = (s) => {
  if (LANG === 'en') return (s || '').replace(/\s+/g, ' ').trim();
  if (LANG === 'zh') return descZh(s);
  return DESC_FR.reduce((x, [re, fr]) => x.replace(re, fr), s || '').replace(/\s+/g, ' ').trim();
};

/** Mesure d'une recette, convertie en métrique et ajustée au nombre de portions (affichage dans la fiche recette). */
function measureFr(measure, factor, en) {
  const info = ingInfo(en);
  const p = parseMeasure(measure, info);
  if (p.vague) return descFr(p.rest) || '';
  const v = p.v * factor;
  const main = fmtMetric(v, p.unit) || (p.unit === 'pièce' ? fmtQty(v) : `${fmtQty(v)} ${plural(p.unit, v)}`);
  const rest = descFr(p.rest);
  return rest ? `${main} · ${rest}` : main;
}

// ---------- Liste de courses ----------
function buildShopping(plan, portions) {
  const factor = portions / BASE_SERVINGS;
  const items = new Map();
  for (const { m } of plan) {
    for (const i of m.ingr) {
      const info = ingInfo(i.n);
      if (info.skip) continue;
      const key = info.fr.toLowerCase();
      // la clé reste le nom français (partagée entre appareils du foyer), seul l'affichage change de langue
      if (!items.has(key)) items.set(key, { key, fr: info.fr, label: ingLabel(info.en, info.fr), rayon: info.rayon, pantry: info.pantry, totals: {}, vague: false, meals: new Set() });
      const it = items.get(key);
      it.meals.add(m.id);
      const p = parseMeasure(i.m, info);
      if (p.vague) { it.vague = true; continue; }
      it.totals[p.unit] = (it.totals[p.unit] || 0) + p.v * factor;
    }
  }
  for (const it of items.values()) {
    const parts = [];
    for (const u of ['g', 'ml']) if (it.totals[u]) parts.push(fmtMetric(it.totals[u], u));
    for (const u of COUNT_UNITS) if (it.totals[u]) parts.push(fmtCount(it.totals[u], u, true));
    for (const u of ['cs', 'cc']) if (it.totals[u]) parts.push(fmtMetric(it.totals[u], u));
    if (it.totals.gousse >= 4 && it.fr === 'Ail') parts.push(headsApprox(Math.ceil(it.totals.gousse / 10)));
    it.qty = parts.length ? parts.join(' + ') : t('as_needed');
  }
  const order = getRayonOrder();
  const all = [...items.values()];
  const byRayon = order.map(id => ({
    rayon: RAYONS.find(r => r.id === id),
    items: all.filter(it => it.rayon === id && !it.pantry).sort((a, b) => a.label.localeCompare(b.label, langInfo().locale)),
  })).filter(g => g.items.length);
  const pantry = all.filter(it => it.pantry).sort((a, b) => a.label.localeCompare(b.label, langInfo().locale));
  return { byRayon, pantry, count: all.length - pantry.length };
}

function getRayonOrder() {
  const saved = store.get('qm_rayons', null);
  const ids = RAYONS.map(r => r.id);
  if (!saved) return ids;
  return [...saved.filter(id => ids.includes(id)), ...ids.filter(id => !saved.includes(id))];
}
const getStore = () => ({ ...DEFAULT_STORE, ...store.get('qm_store', {}) });

function shoppingText(sh, checked, storeInfo) {
  const lines = [`🛒 ${t('list_title')} — ${storeInfo.name}`, ''];
  for (const g of sh.byRayon) {
    const todo = g.items.filter(it => !checked[it.key]);
    if (!todo.length) continue;
    lines.push(`${g.rayon.icon} ${rayonLabel(g.rayon).toUpperCase()}`);
    todo.forEach(it => lines.push(`☐ ${it.label} — ${it.qty}`));
    lines.push('');
  }
  const p = sh.pantry.filter(it => !checked[it.key]);
  if (p.length) lines.push(t('pantry_check'), p.map(it => it.label).join(', '));
  return lines.join('\n').trim();
}
