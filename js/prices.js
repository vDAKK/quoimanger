// Estimation du coût des recettes (€), à partir de prix moyens en supermarché (France) par kg, litre ou pièce.
// C'est un ordre de grandeur pour comparer et tenir un budget, pas un ticket de caisse.

// Règles par produit (nom français normalisé) : kg = €/kg (ou €/L), pc = € la pièce, w = poids d'une pièce (g).
const PRICE_RULES = [
  // en premier : ces noms contiennent souvent celui d'une viande ou d'un produit plus cher
  [/bouillon|fond de|fumet|cube/, { kg: 1.5, w: 10 }], [/lait de coco|crème de coco/, { kg: 5 }], [/nouilles aux œufs/, { kg: 6 }],
  // boucherie & volaille
  [/haché/, { kg: 12 }], [/faux-filet|filet de bœuf|onglet|bavette|steak|escalope de bœuf/, { kg: 26, w: 180 }],
  [/bœuf|veau|queue de bœuf/, { kg: 16, w: 200 }], [/blancs? de poulet|escalope de dinde/, { kg: 13, w: 150 }],
  [/cuisses? de poulet|hauts? de cuisse|pilons|ailes de poulet/, { kg: 7, w: 200 }], [/poulet/, { kg: 9, w: 1400 }],
  [/dinde/, { kg: 12, w: 150 }], [/canard/, { kg: 18, w: 300 }], [/agneau|chèvre/, { kg: 22, w: 200 }],
  [/porc|échine|travers/, { kg: 10, w: 150 }], [/foies de volaille|rognons/, { kg: 8 }],
  // charcuterie
  [/lardons|bacon|poitrine fumée/, { kg: 12, w: 15 }], [/jambon cru|parme|serrano|ibérique/, { kg: 35, w: 15 }],
  [/jambon/, { kg: 16, w: 40 }], [/chorizo/, { kg: 18, w: 15 }], [/saucisse|merguez|kabanos/, { kg: 10, w: 100 }],
  [/tofu|tempeh/, { kg: 10 }], [/pâte (feuilletée|brisée|filo)|feuilles de brick/, { kg: 6, w: 230 }],
  // poissonnerie
  [/saumon fumé/, { kg: 35 }], [/saumon|truite/, { kg: 25, w: 140 }], [/thon/, { kg: 28, w: 140 }],
  [/crevettes|gambas/, { kg: 24, w: 20 }], [/moules|coques|palourdes|bulots/, { kg: 7 }], [/homard|crabe/, { kg: 35, w: 500 }],
  [/calamar|seiche|poulpe/, { kg: 16 }], [/sardines \(boîte\)|anchois/, { kg: 14 }], [/sardine|maquereau|hareng/, { kg: 11, w: 80 }],
  [/cabillaud|lotte|bar|dorade|vivaneau/, { kg: 24, w: 150 }], [/poisson|merlu|églefin|haddock|morue/, { kg: 17, w: 150 }],
  // crèmerie & fromages
  [/œufs?/, { pc: 0.32 }], [/beurre/, { kg: 10, w: 10 }], [/^lait/, { kg: 1.2 }],
  [/crème/, { kg: 5 }], [/yaourt|fromage blanc|lait ribot/, { kg: 3 }], [/parmesan|pecorino|comté|gruyère/, { kg: 24 }],
  [/mozzarella|ricotta|mascarpone|cottage|fromage frais/, { kg: 10, w: 125 }], [/feta|chèvre|brebis|halloumi|paneer/, { kg: 15 }],
  [/cheddar|emmental|gouda|fromage râpé|fromage/, { kg: 13 }],
  // fruits & légumes
  [/oignons? nouveaux|ciboule|ciboulette/, { pc: 1.3, w: 100 }], [/échalote/, { kg: 5, w: 30 }], [/oignon/, { kg: 2, w: 150 }],
  [/^ail$|gousse d'ail/, { kg: 9, w: 50 }], [/gingembre/, { kg: 9, w: 30 }],
  [/pommes? de terre/, { kg: 1.6, w: 170 }], [/patates? douces?/, { kg: 3, w: 300 }], [/carotte/, { kg: 1.6, w: 100 }],
  [/tomates? cerises?/, { kg: 7, w: 12 }], [/tomate/, { kg: 3.5, w: 120 }], [/poivron/, { kg: 4.5, w: 170 }],
  [/courgette/, { kg: 3, w: 250 }], [/aubergine/, { kg: 3.5, w: 300 }], [/champignon|pleurote/, { kg: 7, w: 20 }],
  [/épinards|kale|pak choï|blettes/, { kg: 8 }], [/salade|laitue|sucrine|roquette|jeunes pousses|iceberg/, { pc: 1.3, w: 300, kg: 9 }],
  [/brocoli|chou-fleur/, { kg: 3.5, w: 500 }], [/chou/, { kg: 2, w: 1000 }], [/poireau/, { kg: 3, w: 250 }],
  [/céleri/, { kg: 3, w: 400 }], [/fenouil/, { kg: 4, w: 300 }], [/concombre/, { pc: 1, w: 350 }], [/avocat/, { pc: 1.2, w: 200 }],
  [/citrons? verts?/, { pc: 0.45, w: 70 }], [/citron/, { pc: 0.5, w: 100 }], [/orange/, { pc: 0.5, w: 200 }],
  [/piment|jalapeño/, { kg: 15, w: 10 }], [/persil|coriandre fraîche|basilic|menthe fraîche|aneth frais|thym frais|estragon|sauge|romarin/, { kg: 35, w: 30 }],
  [/haricots verts|pois gourmands|haricots plats/, { kg: 6 }], [/courge|potiron|butternut/, { kg: 2.5, w: 1200 }],
  [/mangue|ananas/, { pc: 2, w: 400 }], [/pomme|poire/, { kg: 3, w: 180 }], [/banane/, { kg: 2.2, w: 120 }], [/betterave|navet|panais|radis/, { kg: 3, w: 150 }],
  [/épis de maïs/, { pc: 1, w: 250 }], [/petits pois|fèves|edamame/, { kg: 4 }],
  // épicerie
  [/^riz|riz basmati|riz thaï/, { kg: 2.8 }], [/spaghetti|penne|linguine|tagliatelles|rigatoni|farfalle|macaronis|pâtes|lasagne/, { kg: 2.2 }],
  [/nouilles|vermicelles/, { kg: 6 }], [/semoule|boulgour|quinoa|polenta/, { kg: 3.5 }], [/farine|maïzena|fécule/, { kg: 1.2 }],
  [/sucre/, { kg: 1.6 }], [/lentilles|pois cassés/, { kg: 3.5 }], [/pois chiches|haricots (blancs|rouges|noirs)|haricots en boîte|cornilles|borlotti/, { kg: 3 }],
  [/tomates (concassées|pelées|en dés)|coulis|sauce tomate|passata/, { kg: 2.5 }], [/concentré de tomate/, { kg: 8 }],
[/huile d'olive/, { kg: 10 }], [/huile/, { kg: 4 }], [/vinaigre/, { kg: 4 }],
  [/sauce soja|sauce d'huître|nuoc|hoisin|sriracha|worcestershire|ketchup|moutarde|mayonnaise/, { kg: 7 }],
  [/miel|sirop/, { kg: 12 }], [/chocolat|cacao/, { kg: 14 }], [/amandes|noix|noisettes|pignons|pistaches|cacahuètes|cajou/, { kg: 20 }],
  [/raisins secs|abricots secs|pruneaux|dattes|cranberries/, { kg: 10 }], [/olives|câpres|cornichons/, { kg: 10 }],
  [/pain|baguette|ciabatta|pita|naan|burger|brioche/, { kg: 4.5, w: 250 }], [/tortillas|galettes/, { kg: 7, w: 40 }],
  [/vin|xérès|cidre|bière|cognac/, { kg: 6 }], [/sel|poivre/, { kg: 4 }],
];
// Prix par défaut de chaque rayon (€/kg ou €/L) quand aucune règle ne correspond.
const RAYON_PRICE = { fl: 3.5, bl: 4.5, bo: 13, po: 20, ch: 14, cr: 4, fr: 14, ep: 4, mo: 9, sa: 7, es: 35, su: 6, bs: 6, sg: 6 };
// Poids (g) des unités de comptage des recettes.
const UNIT_G = { gousse: 5, boîte: 400, bocal: 300, botte: 40, poignée: 30, tranche: 30, brin: 2, paquet: 250, noix: 10, feuille: 1 };

function priceRule(info) {
  const n = normFr(info.fr);
  const r = PRICE_RULES.find(([rx]) => rx.test(n));
  return r ? r[1] : { kg: RAYON_PRICE[info.rayon] ?? 5 };
}

/** Coût (€) d'un ingrédient pour la quantité indiquée dans la recette. */
function ingredientCost(measure, info) {
  const rule = priceRule(info);
  const p = parseMeasure(measure, info);
  if (p.vague) return info.pantry ? 0.02 : 0.15; // « selon goût », « une pincée »…
  // poids d'une pièce : une gousse de cardamome ou une feuille de laurier ne pèsent qu'un gramme
  const pieceG = rule.w || (info.rayon === 'es' ? 1 : 120);
  const perKg = rule.kg ?? (rule.pc / (pieceG / 1000));
  if (p.unit === 'pièce') return rule.pc != null ? p.v * rule.pc : p.v * pieceG / 1000 * perKg;
  const grams = p.unit === 'g' || p.unit === 'ml' ? p.v
    : p.unit === 'cs' ? p.v * 15 : p.unit === 'cc' ? p.v * 5
      : p.unit === 'tête' ? p.v * (rule.w || 400) : p.unit === 'bâton' ? p.v * (/cannelle/i.test(info.fr) ? 3 : 40)
        : p.v * (UNIT_G[p.unit] ?? 100);
  return grams / 1000 * perKg;
}

/** Coût estimé d'une portion (les recettes de la base sont prévues pour ~4 personnes). */
function mealPrice(m) {
  if (m.f.price == null) {
    let c = 0;
    for (const i of m.ingr) {
      const info = ingInfo(i.n);
      if (!info.skip) c += Math.min(ingredientCost(i.m, info), 25); // garde-fou contre une mesure aberrante
    }
    m.f.price = Math.round(c / BASE_SERVINGS * 100) / 100;
  }
  return m.f.price;
}

const fmtEuro = (v) => v.toLocaleString(langInfo().locale, { style: 'currency', currency: 'EUR', minimumFractionDigits: v < 10 ? 2 : 0, maximumFractionDigits: v < 10 ? 2 : 0 });

// Budgets proposés, en € par portion.
const BUDGETS = [
  { id: 'tight', max: 2.5 }, { id: 'medium', max: 4 }, { id: 'comfy', max: 6 }, { id: 'none', max: null },
];
const budgetMax = (P) => (BUDGETS.find(b => b.id === P.budget) || {}).max ?? null;
