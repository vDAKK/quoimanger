// Génère js/recipes-extra.js à partir des recettes maison de data/recipes/*.txt.
// Usage : node tools/build-recipes.js   (Node 18+, réseau nécessaire pour les nouvelles photos)
//
// Format d'une recette :
//   # Nom anglais | Nom français | 中文名
//   @ Catégorie | Pays | Minutes | Photo | Tags,séparés,par,virgules
//   - Ingrédient (nom TheMealDB) : quantité pour 4
//   1. Étape (en anglais, traduite à l'affichage comme les recettes TheMealDB)
// Photo : « en:Titre d'article », « fr:Titre d'article » (image principale de l'article) ou « File:Nom.jpg » (Commons).
// Les photos trouvées (URL, auteur, licence) sont gardées dans data/recipes/photos.json : seules les nouvelles sont cherchées.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data', 'recipes');
const PHOTOS = path.join(SRC, 'photos.json');
const OUT = path.join(ROOT, 'js', 'recipes-extra.js');
const WIDTH = 960;
const UA = 'QuoiManger/1.0 (recipe app; build script)';

// référentiels de l'app (pays, ingrédients connus)
const ctx = { window: {}, console };
vm.createContext(ctx);
for (const f of ['data.js', 'ingredients-fr.js', 'ingredients-zh.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', f), 'utf8').replace(/^(const|let) /gm, 'var '), ctx, { filename: f });
}
const CATS = ['Beef', 'Chicken', 'Lamb', 'Pork', 'Seafood', 'Vegetarian', 'Vegan', 'Pasta', 'Miscellaneous', 'Side', 'Starter'];

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function parse(file) {
  const out = [];
  let r = null;
  const fail = (msg) => { throw new Error(`${path.basename(file)} : ${r ? r.name + ' : ' : ''}${msg}`); };
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('//')) continue;
    if (line.startsWith('# ')) {
      const [name, fr, zh] = line.slice(2).split('|').map(s => s.trim());
      if (!fr || !zh) fail('noms français et chinois manquants');
      r = { name, fr, zh, ingr: [], steps: [] };
      out.push(r);
    } else if (!r) fail('ligne hors recette : ' + line);
    else if (line.startsWith('@ ')) {
      const [cat, country, time, photo, tags] = line.slice(2).split('|').map(s => s.trim());
      Object.assign(r, { cat, country, time: +time, photo, tags: (tags || '').split(',').map(s => s.trim()).filter(Boolean) });
    } else if (line.startsWith('- ')) {
      const i = line.indexOf(':');
      if (i < 0) fail('ingrédient sans quantité : ' + line);
      r.ingr.push({ n: line.slice(2, i).trim(), m: line.slice(i + 1).trim() });
    } else if (/^\d+\.\s/.test(line)) r.steps.push(line.replace(/^\d+\.\s*/, ''));
    else fail('ligne inattendue : ' + line);
  }
  return out;
}

function check(r, errors, unknown) {
  const e = (msg) => errors.push(`${r.name} : ${msg}`);
  if (!CATS.includes(r.cat)) e('catégorie inconnue ' + r.cat);
  if (!ctx.COUNTRY_TO_CUISINE[r.country]) e('pays sans cuisine ' + r.country);
  if (!(r.time >= 5 && r.time <= 300)) e('durée invalide');
  if (!r.photo) e('photo manquante');
  if (r.ingr.length < 3) e('trop peu d’ingrédients');
  if (r.steps.length < 2) e('trop peu d’étapes');
  for (const i of r.ingr) if (!ctx.ING_FR[i.n.toLowerCase()]) unknown.add(i.n.toLowerCase());
}

const sleep = (ms) => new Promise(ok => setTimeout(ok, ms));

// Les API Wikimedia limitent le débit : requêtes groupées (50 titres), une à la fois, avec pause.
async function api(host, params) {
  const url = `https://${host}/w/api.php?` + new URLSearchParams({ format: 'json', formatversion: '2', maxlag: '5', ...params });
  for (let attempt = 0; ; attempt++) {
    await sleep(1500 * 2 ** attempt);
    let res;
    try { res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) }); }
    catch (e) { if (attempt >= 4) throw e; continue; }
    if (res.ok) return res.json();
    if (attempt >= 4 || ![429, 503].includes(res.status)) throw new Error(`HTTP ${res.status} ${url}`);
  }
}

/** query sur une liste de titres, par lots de 50 ; renvoie titre demandé → page (redirections suivies). */
async function queryTitles(host, titles, params) {
  const out = new Map();
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    const j = await api(host, { action: 'query', redirects: '1', ...params, titles: batch.join('|') });
    const q = j.query || {};
    const alias = new Map();
    for (const x of [...(q.normalized || []), ...(q.redirects || [])]) alias.set(x.from, x.to);
    const byTitle = new Map((q.pages || []).map(p => [p.title, p]));
    for (const t of batch) {
      let k = t;
      for (let n = 0; n < 3 && alias.has(k); n++) k = alias.get(k);
      out.set(t, byTitle.get(k));
    }
  }
  return out;
}

// URL d'image stable : domaine principal, sans paramètres de suivi
const cleanUrl = (u) => u.split('?')[0].replace('//thumb.wikimedia.org/', '//upload.wikimedia.org/');
const strip = (html) => (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/**
 * Photos des recettes : fichier Commons (libre) avec URL de vignette, auteur et licence.
 * specs : liste de « lang:Article » ou « File:Nom ». Renvoie spec → photo ou Error.
 */
async function findPhotos(specs) {
  const res = new Map(), fileOf = new Map();
  // 1. image principale des articles, par Wikipédia
  const byLang = {};
  for (const s of specs) {
    if (s.startsWith('File:')) fileOf.set(s, s.slice(5));
    else { const [lang, ...rest] = s.split(':'); (byLang[lang] = byLang[lang] || []).push([s, rest.join(':')]); }
  }
  for (const [lang, list] of Object.entries(byLang)) {
    const pages = await queryTitles(`${lang}.wikipedia.org`, list.map(x => x[1]), { prop: 'pageimages', piprop: 'name' });
    for (const [s, title] of list) {
      const p = pages.get(title);
      if (p && p.pageimage) fileOf.set(s, p.pageimage); else res.set(s, new Error('pas d’image pour cet article'));
    }
  }
  // 2. informations du fichier sur Commons (les images non libres, hébergées par chaque Wikipédia, n'y sont pas)
  const files = [...new Set(fileOf.values())];
  const infos = await queryTitles('commons.wikimedia.org', files.map(f => 'File:' + f), { prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: String(WIDTH) });
  for (const [s, f] of fileOf) {
    const p = infos.get('File:' + f);
    const info = p && p.imageinfo && p.imageinfo[0];
    if (!info) { res.set(s, new Error('fichier absent de Commons : ' + f)); continue; }
    const meta = info.extmetadata || {};
    res.set(s, {
      thumb: cleanUrl(info.thumburl || info.url),
      page: info.descriptionurl,
      artist: strip(meta.Artist && meta.Artist.value).slice(0, 80),
      license: strip(meta.LicenseShortName && meta.LicenseShortName.value),
    });
  }
  return res;
}

async function main() {
  const files = fs.readdirSync(SRC).filter(f => f.endsWith('.txt')).sort();
  const recipes = files.flatMap(f => parse(path.join(SRC, f)));
  const errors = [], unknown = new Set(), ids = new Set();
  for (const r of recipes) {
    r.id = 'qm-' + slug(r.name);
    if (ids.has(r.id)) errors.push('recette en double : ' + r.name);
    ids.add(r.id);
    check(r, errors, unknown);
  }
  if (unknown.size) errors.push('ingrédients absents de js/ingredients-fr.js : ' + [...unknown].sort().join(', '));
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

  const photos = fs.existsSync(PHOTOS) ? JSON.parse(fs.readFileSync(PHOTOS, 'utf8')) : {};
  const missing = [];
  const todo = recipes.filter(r => !(photos[r.id] && photos[r.id].spec === r.photo));
  const found = todo.length ? await findPhotos([...new Set(todo.map(r => r.photo))]) : new Map();
  for (const r of todo) {
    const ph = found.get(r.photo);
    if (ph instanceof Error || !ph) { missing.push(`${r.name} (${r.photo}) : ${ph ? ph.message : 'introuvable'}`); delete photos[r.id]; }
    else photos[r.id] = { spec: r.photo, ...ph };
  }
  for (const id of Object.keys(photos)) if (!ids.has(id)) delete photos[id];
  fs.writeFileSync(PHOTOS, JSON.stringify(photos, null, 1) + '\n');

  const meals = recipes.map(r => {
    const ph = photos[r.id];
    return {
      id: r.id, name: r.name, cat: r.cat, country: r.country, instr: r.steps.join('\r\n'), thumb: ph ? cleanUrl(ph.thumb) : '',
      tags: r.tags, yt: '', src: '', ingr: r.ingr, time: r.time,
      ...(ph ? { photo: { page: ph.page, artist: ph.artist, license: ph.license } } : {}),
    };
  });
  const names = recipes.map(r => `${r.id}|${r.fr}|${r.zh}`).join('\n');
  fs.writeFileSync(OUT, `// Recettes maison (en plus de TheMealDB). Fichier généré par tools/build-recipes.js depuis data/recipes/*.txt : ne pas modifier.
// Photos : Wikimedia Commons (auteur et licence affichés sur la fiche).
window.EXTRA_MEALS = ${JSON.stringify(meals)};
\`${names}\`.split('\\n').forEach(line => { const [id, fr, zh] = line.split('|'); RECIPE_NAMES[id] = { fr, zh }; });
`);
  console.log(`${meals.length} recettes, ${meals.filter(m => m.thumb).length} avec photo → ${path.relative(ROOT, OUT)}`);
  if (missing.length) console.warn('\nSans photo :\n' + missing.join('\n'));
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { parse, SRC };
