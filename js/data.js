// Référentiels : options du questionnaire, mots-clés de détection, traductions.

const API = 'https://www.themealdb.com/api/json/v1/1/';
const ING_IMG = (name) => `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name)}-Small.png`;

// ---------- Options du questionnaire ----------
const OBJECTIVES = [
  { id: 'eco', label: 'Faire des économies' },
  { id: 'waste', label: 'Réduire mon gaspillage alimentaire' },
  { id: 'discover', label: 'Découvrir de nouvelles recettes' },
  { id: 'time', label: 'Gagner du temps' },
  { id: 'nutri', label: 'Option Nutri +' },
  { id: 'plan', label: 'Planifier mes repas plus facilement' },
];

const OBJECTIVE_PITCH = {
  eco: ['💸', 'Le dîner a tout bon. Même le prix.', 'On privilégie les plats aux ingrédients abordables : légumineuses, œufs, riz, pommes de terre…'],
  waste: ['♻️', 'Zéro gâchis, zéro prise de tête.', 'Votre menu réutilise les mêmes ingrédients d’un soir à l’autre pour finir les paquets entamés.'],
  discover: ['🌍', 'Un tour du monde dans l’assiette.', 'Plus de 30 pays au menu : on varie les cuisines chaque semaine.'],
  time: ['⏱️', 'Moins de "trop la flemme", plus de "miaaam".', 'On met en avant les recettes rapides. À peine le temps de dire « j’ai faim ».'],
  nutri: ['🥦', 'Dîner réglé. Corps comblé.', 'Des repas plus légers et riches en légumes, adaptés à vos préférences nutritionnelles.'],
  plan: ['🗓️', 'Votre semaine, réglée en un clic.', 'Un menu complet + la liste de courses générée automatiquement.'],
};

const CRAVINGS = [
  { id: 'quick', label: 'Recettes rapides', desc: 'Je fais fissa : moins de 25 minutes, un max de saveurs.' },
  { id: 'chef', label: 'Recettes de chef', desc: 'J’aime les plats dignes d’un resto, prêts en 30 à 60 min.' },
  { id: 'family', label: 'Recettes pour toute la famille', desc: 'Je veux de bons petits plats, pour les petits comme les grands.' },
];

const DIETS = [
  { id: 'all', label: 'Je mange de tout', desc: 'J’aime varier les plaisirs entre viande, poisson et recettes végétariennes.' },
  { id: 'flexi', label: 'Flexitarien', desc: 'Je mange surtout végétarien, avec un peu de viande de temps en temps.' },
  { id: 'veggie', label: 'Végétarien', desc: 'Je ne mange ni viande ni poisson.' },
  { id: 'pesco', label: 'Poisson & Légumes', desc: 'Je raffole des fruits de mer et de poissons.' },
];

const AVOID = [
  { id: 'pork', label: 'Porc', icon: '🥓' },
  { id: 'seafood', label: 'Fruits de mer', icon: '🦐' },
  { id: 'fish', label: 'Poisson', icon: '🐟' },
  { id: 'peanut', label: 'Cacahuètes', icon: '🥜' },
  { id: 'nuts', label: 'Noix', icon: '🌰' },
  { id: 'dairy', label: 'Produits laitiers', icon: '🥛' },
  { id: 'gluten', label: 'Gluten', icon: '🌾' },
  { id: 'egg', label: 'Œufs', icon: '🥚' },
];

const NUTRITION = [
  { id: 'light', label: 'Calorie Smart' },
  { id: 'lowcarb', label: '<40 g glucides' },
  { id: 'protein', label: 'Riche en protéines' },
  { id: 'veg', label: 'Le plein de légumes' },
];

// Regroupement des pays TheMealDB en grandes cuisines.
const CUISINES = [
  { id: 'chinese', label: 'Chinoise', countries: ['China'] },
  { id: 'indian', label: 'Indienne', countries: ['India', 'Bangladesh'] },
  { id: 'french', label: 'Française', countries: ['France', 'Belgium'] },
  { id: 'italian', label: 'Italienne', countries: ['Italy'] },
  { id: 'medit', label: 'Méditerranéenne', countries: ['Spain', 'Greece', 'Portugal', 'Turkey', 'Croatia', 'Albania', 'Andorra', 'Morocco', 'Tunisia', 'Algeria', 'Egypt'] },
  { id: 'mideast', label: 'Moyen-Orient', countries: ['Syria', 'Saudi Arabia', 'Afghanistan', 'Armenia', 'Azerbaijan'] },
  { id: 'american', label: 'Américaine', countries: ['United States', 'Canada', 'Australia'] },
  { id: 'latino', label: 'Mexicaine & Latino', countries: ['Mexico', 'Brazil', 'Colombia', 'Argentina', 'Venezuela', 'Uruguay', 'Chile', 'Costa Rica', 'Cuba'] },
  { id: 'thai', label: 'Thaïe', countries: ['Thailand'] },
  { id: 'japanese', label: 'Japonaise', countries: ['Japan'] },
  { id: 'seasia', label: 'Asie du Sud-Est', countries: ['Vietnam', 'Malaysia', 'Philippines', 'Cambodia', 'Laos'] },
  { id: 'caribbean', label: 'Caraïbes & Afrique', countries: ['Jamaica', 'Barbados', 'Dominica', 'Aruba', 'Antigua and Barbuda', 'Cayman Islands', 'Bahamas', 'Kenya', 'Botswana', 'Angola'] },
  { id: 'europe', label: 'Europe du Nord & de l’Est', countries: ['United Kingdom', 'Ireland', 'Netherlands', 'Norway', 'Denmark', 'Estonia', 'Poland', 'Russia', 'Ukraine', 'Slovakia', 'Bulgaria', 'Austria'] },
];
const COUNTRY_TO_CUISINE = {};
CUISINES.forEach(c => c.countries.forEach(p => (COUNTRY_TO_CUISINE[p] = c.id)));
// Anciennes valeurs strArea → pays (au cas où strCountry manque).
const AREA_TO_COUNTRY = {
  Chinese: 'China', Indian: 'India', French: 'France', Italian: 'Italy', Spanish: 'Spain', Greek: 'Greece', Portuguese: 'Portugal',
  Turkish: 'Turkey', Croatian: 'Croatia', Moroccan: 'Morocco', Tunisian: 'Tunisia', Algerian: 'Algeria', Egyptian: 'Egypt',
  Syrian: 'Syria', 'Saudi Arabian': 'Saudi Arabia', American: 'United States', Canadian: 'Canada', Australian: 'Australia',
  Mexican: 'Mexico', Argentina: 'Argentina', Venezuela: 'Venezuela', Uruguayan: 'Uruguay', Thai: 'Thailand', Japanese: 'Japan',
  Vietnamese: 'Vietnam', Malaysian: 'Malaysia', Filipino: 'Philippines', Jamaican: 'Jamaica', Kenyan: 'Kenya', British: 'United Kingdom',
  Irish: 'Ireland', Dutch: 'Netherlands', Netherlands: 'Netherlands', Norway: 'Norway', Polish: 'Poland', Russian: 'Russia',
  Ukrainian: 'Ukraine', Slovakia: 'Slovakia',
};

const FLAVOURS = [
  { id: 'herbs', label: 'Les herbes', icon: '🌿' },
  { id: 'cheese', label: 'Beaucoup de fromage', icon: '🧀' },
  { id: 'sweet', label: 'Sucré', icon: '🍯' },
  { id: 'spiced', label: 'Épicé', icon: '🫙' },
  { id: 'hot', label: 'Pimenté', icon: '🌶️' },
];

const PROTEINS = [
  { id: 'beef', label: 'Bœuf', img: 'Beef' },
  { id: 'pork', label: 'Porc', img: 'Pork' },
  { id: 'poultry', label: 'Volaille', img: 'Chicken' },
  { id: 'lamb', label: 'Agneau', img: 'Lamb' },
  { id: 'fish', label: 'Poisson', img: 'Salmon' },
  { id: 'seafood', label: 'Fruits de mer', img: 'Prawns' },
  { id: 'plant', label: 'Protéines végétales', img: 'Tofu' },
  { id: 'egg', label: 'Œufs', img: 'Eggs' },
];

const DISH_TYPES = [
  { id: 'pasta', label: 'Pâtes' },
  { id: 'soup', label: 'Soupes ou mijotés' },
  { id: 'oven', label: 'Plats au four / Gratins' },
  { id: 'wok', label: 'Sautés / Woks' },
  { id: 'plate', label: 'Plat + accompagnement' },
  { id: 'curry', label: 'Currys' },
  { id: 'rice', label: 'Riz & Bowls' },
  { id: 'salad', label: 'Salades' },
  { id: 'pizza', label: 'Pizzas & Tartes' },
  { id: 'wrap', label: 'Wraps & Tacos' },
  { id: 'sandwich', label: 'Sandwichs' },
  { id: 'burger', label: 'Burgers' },
];

const NIGHTS = [
  { id: 2, label: '1 à 2 soirs par semaine' },
  { id: 4, label: '3 à 4 soirs par semaine' },
  { id: 6, label: '5 à 6 soirs par semaine' },
  { id: 7, label: 'Toute la semaine' },
];

// ---------- Détection par mots-clés (regex sur le nom des ingrédients, en minuscules) ----------
const rx = (words) => new RegExp('\\b(' + words.join('|') + ')', 'i');

const KW = {
  beef: rx(['beef', 'shredded meat', 'minced meat', 'mince\\b', 'meatball', 'steak', 'sirloin', 'brisket', 'veal', 'oxtail', 'rump', 'bresaola']),
  pork: rx(['pork', 'bacon', 'ham\\b', 'hams\\b', 'chorizo', 'pancetta', 'prosciutto', 'lardon', 'sausage', 'salami', 'gammon', 'lard\\b', 'speck', 'black pudding', 'morcilla', 'pepperoni', 'guanciale']),
  poultry: rx(['chicken', 'turkey', 'duck', 'poussin', 'quail', 'goose']),
  lamb: rx(['lamb', 'mutton', 'goat', 'merguez', 'venison', 'rabbit']),
  fish: rx(['salmon', 'cod\\b', 'codfish', 'tuna', 'haddock', 'mackerel', 'sardine', 'trout', 'sea bass', 'seabass', 'white fish', 'fish fillet', 'fish\\b', 'anchov', 'tilapia', 'halibut', 'monkfish', 'swordfish', 'herring', 'pollock', 'hake', 'sole\\b', 'plaice', 'snapper', 'bream', 'catfish', 'kipper', 'pilchard', 'bacalao', 'saltfish']),
  seafood: rx(['prawn', 'shrimp', 'mussel', 'clam', 'scallop', 'squid', 'crab', 'lobster', 'oyster', 'octopus', 'calamari', 'langoustine', 'cockle', 'crayfish']),
  plant: rx(['tofu', 'tempeh', 'chickpea', 'lentil', 'kidney bean', 'black bean', 'cannellini', 'butter bean', 'broad bean', 'haricot', 'pinto', 'black eyed', 'black-eyed', 'edamame', 'seitan', 'quorn', 'soya', 'soy bean', 'split pea', 'white beans', 'dal\\b', 'mung']),
  egg: rx(['egg\\b', 'eggs\\b', 'egg yolk', 'egg white', 'duck egg']),
  // traces animales (exclues pour végétarien) en plus des protéines ci-dessus
  meatTrace: rx(['chicken stock', 'beef stock', 'lamb stock', 'chicken bouillon', 'beef bouillon', 'gelatin', 'gelatine', 'suet', 'beef gravy', 'chicken fat', 'bone broth', 'dripping']),
  fishTrace: rx(['fish sauce', 'fish stock', 'oyster sauce', 'shrimp paste', 'dried shrimp', 'anchovy', 'worcestershire', 'bonito', 'dashi']),
  peanut: rx(['peanut', 'groundnut', 'ground nut', 'satay']),
  nuts: rx(['almond', 'walnut', 'cashew', 'pecan', 'hazelnut', 'pistachio', 'pine nut', 'macadamia', 'brazil nut', 'chestnut', 'mixed nuts', 'nuts\\b', 'praline', 'marzipan', 'frangipane']),
  dairy: rx(['milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'parmesan', 'mozzarella', 'cheddar', 'feta', 'gruy', 'ricotta', 'mascarpone', 'ghee', 'creme fraiche', 'crème fraîche', 'paneer', 'halloumi', 'buttermilk', 'brie', 'camembert', 'gorgonzola', 'stilton', 'emmental', 'pecorino', 'quark', 'kefir', 'custard', 'raclette', 'comté', 'manchego', 'curd']),
  dairyNot: rx(['coconut milk', 'coconut cream', 'almond milk', 'soy milk', 'soya milk', 'oat milk', 'peanut butter', 'butter bean', 'butternut', 'cream of tartar', 'nut butter', 'cocoa butter', 'bean curd', 'vegan']),
  gluten: rx(['flour', 'bread', 'pasta', 'spaghetti', 'penne', 'macaroni', 'lasagne', 'lasagna', 'linguine', 'tagliatelle', 'fettuccine', 'noodle', 'breadcrumb', 'panko', 'pastry', 'couscous', 'bulgur', 'bulghur', 'barley', 'soy sauce', 'tortilla', 'pitta', 'pita', 'baguette', 'bun\\b', 'buns\\b', 'brioche', 'naan', 'croissant', 'semolina', 'orzo', 'wheat', 'rye', 'gnocchi', 'ravioli', 'biscuit', 'cracker', 'wrap', 'beer', 'ale\\b', 'farfalle', 'fusilli', 'rigatoni', 'vermicelli', 'udon', 'ramen', 'seitan', 'filo', 'yorkshire']),
  glutenNot: rx(['rice noodle', 'rice flour', 'corn flour', 'cornflour', 'gluten-free', 'gluten free', 'rice vermicelli', 'glass noodle', 'tapioca', 'corn tortilla', 'potato flour', 'gram flour', 'chickpea flour', 'buckwheat']),
  herbs: rx(['basil', 'parsley', 'coriander leaves', 'cilantro', 'thyme', 'rosemary', 'mint', 'dill', 'oregano', 'chives', 'sage', 'tarragon', 'marjoram', 'chervil', 'lemongrass', 'herbs', 'bay lea', 'coriander$', 'fresh coriander', 'kaffir', 'lime leaves']),
  cheese: rx(['cheese', 'parmesan', 'mozzarella', 'cheddar', 'feta', 'gruy', 'ricotta', 'mascarpone', 'paneer', 'halloumi', 'brie', 'camembert', 'gorgonzola', 'stilton', 'emmental', 'pecorino', 'manchego', 'comté', 'raclette', 'monterey', 'jack cheese', 'colby', 'queso']),
  sweet: rx(['sugar', 'honey', 'maple', 'syrup', 'sweet chilli', 'jam\\b', 'raisin', 'apricot', 'prune', 'date', 'sultana', 'mango', 'pineapple', 'molasses', 'treacle', 'hoisin', 'teriyaki', 'cranberr', 'chutney', 'marmalade', 'apple', 'caramel']),
  spiced: rx(['cumin', 'garam masala', 'curry', 'turmeric', 'cinnamon', 'cardamom', 'allspice', 'paprika', 'coriander seed', 'ground coriander', 'star anise', 'cloves', 'harissa', 'ras el hanout', 'five spice', 'saffron', 'fenugreek', 'mustard seed', 'fennel seed', 'sumac', 'za\'atar', 'zaatar', 'baharat', 'jerk', 'tandoori', 'tikka', 'masala', 'cajun', 'berbere', 'caraway', 'spice']),
  hot: rx(['chilli', 'chili', 'cayenne', 'jalapeno', 'jalapeño', 'scotch bonnet', 'hot sauce', 'hotsauce', 'sriracha', 'harissa', 'red pepper flake', 'birds-eye', 'bird\'s eye', 'gochujang', 'curry paste', 'tabasco', 'chipotle', 'habanero', 'peri peri', 'piri piri', 'sambal', 'szechuan pepper', 'sichuan pepper', 'gochugaru', 'serrano']),
  hotNot: rx(['sweet chilli', 'chilli flakes, optional']),
  veg: rx(['carrot', 'red pepper', 'green pepper', 'yellow pepper', 'bell pepper', 'orange pepper', 'peppers\\b', 'tomato', 'spinach', 'broccoli', 'courgette', 'zucchini', 'aubergine', 'eggplant', 'egg plant', 'mushroom', 'cabbage', 'kale', 'leek', 'celery', 'cucumber', 'lettuce', 'peas\\b', 'green bean', 'sweetcorn', 'corn\\b', 'cauliflower', 'asparagus', 'beetroot', 'pumpkin', 'squash', 'fennel', 'rocket', 'avocado', 'sprout', 'radish', 'turnip', 'swede', 'celeriac', 'okra', 'chard', 'artichoke', 'bok choy', 'pak choi', 'watercress', 'parsnip', 'sweet potato', 'mangetout', 'sugar snap', 'beans\\b', 'salad', 'kohlrabi', 'endive', 'chicory', 'plantain', 'callaloo', 'shallot', 'red onion', 'olives\\b']),
  heavy: rx(['butter', 'pancetta', 'guanciale', 'mozarella', 'fried', 'double cream', 'heavy cream', 'whipping cream', 'cream\\b', 'cheese', 'cheddar', 'parmesan', 'mozzarella', 'bacon', 'sausage', 'lard', 'pastry', 'suet', 'mayonnaise', 'coconut milk', 'coconut cream', 'sour cream', 'creme fraiche', 'chorizo', 'ghee', 'condensed milk', 'pork belly', 'duck fat', 'dripping', 'sugar', 'syrup']),
  carb: rx(['pasta', 'spaghetti', 'penne', 'macaroni', 'lasagne', 'linguine', 'tagliatelle', 'fettuccine', 'noodle', 'rice\\b', 'basmati', 'jasmine rice', 'arborio', 'paella rice', 'sushi rice', 'potato', 'potatoes', 'bread', 'baguette', 'tortilla', 'pitta', 'pita', 'naan', 'couscous', 'bulgur', 'quinoa', 'pastry', 'bun\\b', 'buns\\b', 'gnocchi', 'orzo', 'polenta', 'cornmeal', 'vermicelli', 'udon', 'ramen', 'plantain', 'yam', 'cassava', 'sweet potato', 'flatbread', 'wrap']),
  pricey: rx(['sirloin', 'fillet steak', 'beef fillet', 'ribeye', 'rib eye', 'rump steak', 'steak', 'lamb', 'salmon', 'king prawn', 'tiger prawn', 'scallop', 'lobster', 'crab', 'saffron', 'pine nut', 'duck', 'venison', 'truffle', 'wine', 'brandy', 'cognac', 'sherry', 'port\\b', 'champagne', 'prosciutto', 'parmesan', 'gruy', 'veal', 'monkfish', 'sea bass', 'halibut', 'tuna steak', 'pistachio', 'cashew', 'macadamia', 'oyster\\b', 'oysters', 'mussels', 'clams', 'chorizo', 'brisket']),
  cheap: rx(['lentil', 'chickpea', 'kidney bean', 'black bean', 'cannellini', 'butter bean', 'beans\\b', 'rice\\b', 'potato', 'pasta', 'spaghetti', 'egg\\b', 'eggs', 'cabbage', 'carrot', 'onion', 'oats', 'tinned tomato', 'chopped tomatoes', 'chicken thigh', 'minced beef', 'ground beef', 'tofu', 'split pea']),
  offal: rx(['liver', 'kidney\\b', 'kidneys', 'tripe', 'heart\\b', 'tongue', 'blood', 'sweetbread', 'trotter', 'oxtail', 'gizzard', 'black pudding']),
};

// Ingrédients de placard ignorés pour la liste de courses « fraîche » et l’anti-gaspillage.
const PANTRY = rx(['salt', 'pepper$', 'black pepper', 'white pepper', 'ground black pepper', 'water', 'oil$', 'olive oil', 'vegetable oil', 'sunflower oil', 'rapeseed oil', 'canola oil', 'sugar', 'flour', 'stock cube', 'baking powder', 'bicarbonate', 'cornstarch', 'cornflour', 'corn flour', 'starch', 'vinegar', 'soy sauce', 'ice']);

// ---------- Détection du type de plat (nom + tags) ----------
const DISH_RX = {
  pasta: /pasta|spaghett|penne|lasagn|linguin|fettucc|tagliatel|macaroni|mac and|mac n|ravioli|gnocchi|carbonara|bolognese|rigatoni|fusilli|orzo|farfalle|pappardelle|tortellini|cannelloni|conchiglie|kugel|pierogi|dumpling/i,
  soup: /soup|stew|casserole|chowder|broth|goulash|chilli con|chili con|tagine|ragout|ragù|pho\b|ramen|bisque|dal\b|daal|dhal|hotpot|hot pot|bourguignon|potage|gumbo|borscht|bouillabaisse|cassoulet|pot-au-feu|pot au feu|braise|feijoada|irish stew|minestrone|jambalaya|laksa|caldo|sopa|bigos|solyanka|harira|cawl|scouse|pörkölt/i,
  oven: /bake|baked|gratin|\bpie\b|roast|lasagn|moussaka|oven|quiche|en croute|wellington|pastitsio|frittata|traybake|tray bake|enchilada|stuffed|shepherd|cottage pie|toad in|tian|cannelloni|parmigiana|souffl/i,
  wok: /stir[- ]?fr|wok|noodle|pad thai|fried rice|chow mein|lo mein|teriyaki|kung pao|sweet and sour|yakisoba|szechuan|sichuan|mapo|pad see|pad kra|char kway|mee goreng|bami|pancit|lo mai|udon|yaki/i,
  plate: /steak|chop|fillet|schnitzel|cutlet|grill|escalope|with .*(mash|chips|fries|potato|rice|salsa|sauce)|and (mash|chips|fries)|kebab|skewer|brochette|meatball|kofta|confit|cordon|katsu|tonkatsu|wings|ribs|jerk|tandoori|piri|peri|souvlaki/i,
  curry: /curry|masala|korma|vindaloo|tikka|biryani|rendang|massaman|madras|jalfrezi|dopiaza|rogan|balti|saag|dhansak|bhuna|pasanda|green curry|red curry|panang/i,
  rice: /rice|risotto|paella|pilaf|pilau|bowl|poke|bibimbap|biryani|jollof|congee|arroz|donburi|kedgeree|nasi|plov|maqluba|kabsa|mandi|sushi|onigiri/i,
  salad: /salad|slaw|tabbouleh|fattoush|ceviche|nicoise|niçoise|larb|som tam/i,
  pizza: /pizza|flatbread|calzone|lahmacun|pide|focaccia|tart\b|tarte|flammekueche|quiche|galette|empanada|börek|borek|pastel/i,
  wrap: /wrap|burrito|fajita|taco|tortilla|quesadilla|shawarma|gyro|enchilada|spring roll|pitta|pita|kati roll|roti|chimichanga|tostada|arepa|nachos/i,
  sandwich: /sandwich|panini|toastie|toast|bánh mì|banh mi|baguette|croque|\broll\b|hot dog|sloppy joe|po'? boy|sub\b|bagel|muffuletta|cubano|bun\b|bao/i,
  burger: /burger/i,
};

// ---------- Traduction FR des ingrédients courants ----------
const FR = {
  'salt': 'sel', 'garlic': 'ail', 'onion': 'oignon', 'onions': 'oignons', 'olive oil': 'huile d’olive', 'water': 'eau', 'vegetable oil': 'huile végétale',
  'pepper': 'poivre', 'black pepper': 'poivre noir', 'parsley': 'persil', 'butter': 'beurre', 'potatoes': 'pommes de terre', 'potato': 'pomme de terre',
  'carrots': 'carottes', 'carrot': 'carotte', 'egg': 'œuf', 'eggs': 'œufs', 'sugar': 'sucre', 'soy sauce': 'sauce soja', 'coriander': 'coriandre',
  'spring onions': 'oignons nouveaux', 'lime': 'citron vert', 'paprika': 'paprika', 'red pepper': 'poivron rouge', 'thyme': 'thym', 'milk': 'lait',
  'garlic clove': 'gousse d’ail', 'ginger': 'gingembre', 'red chilli': 'piment rouge', 'tomato puree': 'concentré de tomate', 'chicken stock': 'bouillon de volaille',
  'plain flour': 'farine', 'flour': 'farine', 'tomato': 'tomate', 'tomatoes': 'tomates', 'lemon': 'citron', 'oil': 'huile', 'bay leaf': 'feuille de laurier',
  'bay leaves': 'feuilles de laurier', 'red onions': 'oignons rouges', 'red onion': 'oignon rouge', 'cumin': 'cumin', 'ground cumin': 'cumin moulu',
  'fish sauce': 'sauce poisson', 'beef': 'bœuf', 'rice': 'riz', 'mint': 'menthe', 'coconut milk': 'lait de coco', 'brown sugar': 'sucre roux',
  'beef stock': 'bouillon de bœuf', 'celery': 'céleri', 'bacon': 'bacon', 'all purpose flour': 'farine', 'vegetable stock': 'bouillon de légumes',
  'shallots': 'échalotes', 'sunflower oil': 'huile de tournesol', 'cucumber': 'concombre', 'cilantro': 'coriandre fraîche', 'chorizo': 'chorizo',
  'chicken thighs': 'hauts de cuisse de poulet', 'sesame seed oil': 'huile de sésame', 'baking powder': 'levure chimique', 'extra virgin olive oil': 'huile d’olive vierge extra',
  'lemon juice': 'jus de citron', 'cornstarch': 'fécule de maïs', 'green chilli': 'piment vert', 'chicken': 'poulet', 'cabbage': 'chou', 'green pepper': 'poivron vert',
  'cayenne pepper': 'piment de Cayenne', 'mustard': 'moutarde', 'leek': 'poireau', 'mushrooms': 'champignons', 'breadcrumbs': 'chapelure', 'mayonnaise': 'mayonnaise',
  'basil': 'basilic', 'scallions': 'oignons verts', 'bread': 'pain', 'cinnamon': 'cannelle', 'dill': 'aneth', 'allspice': 'piment de la Jamaïque',
  'cherry tomatoes': 'tomates cerises', 'greek yogurt': 'yaourt grec', 'nutmeg': 'muscade', 'chicken breast': 'blanc de poulet', 'chicken breasts': 'blancs de poulet',
  'ground beef': 'bœuf haché', 'minced beef': 'bœuf haché', 'white wine': 'vin blanc', 'honey': 'miel', 'sour cream': 'crème aigre', 'scotch bonnet': 'piment antillais',
  'rosemary': 'romarin', 'caster sugar': 'sucre en poudre', 'turmeric': 'curcuma', 'kosher salt': 'gros sel', 'parmesan': 'parmesan', 'parmesan cheese': 'parmesan',
  'red wine vinegar': 'vinaigre de vin rouge', 'yeast': 'levure', 'rice noodles': 'nouilles de riz', 'prawns': 'crevettes', 'king prawns': 'gambas', 'pork': 'porc',
  'chives': 'ciboulette', 'chickpeas': 'pois chiches', 'lamb': 'agneau', 'rice vinegar': 'vinaigre de riz', 'tinned tomatos': 'tomates en conserve',
  'mozzarella': 'mozzarella', 'cloves': 'clous de girofle', 'green beans': 'haricots verts', 'worcestershire sauce': 'sauce Worcestershire',
  'plum tomatoes': 'tomates olivettes', 'basil leaves': 'feuilles de basilic', 'sesame seed': 'graines de sésame', 'oregano': 'origan', 'saffron': 'safran',
  'aubergine': 'aubergine', 'egg yolks': 'jaunes d’œuf', 'lettuce': 'laitue', 'unsalted butter': 'beurre doux', 'feta': 'feta', 'chilli': 'piment',
  'spinach': 'épinards', 'chopped tomatoes': 'tomates concassées', 'oyster sauce': 'sauce d’huître', 'ground ginger': 'gingembre moulu',
  'white wine vinegar': 'vinaigre de vin blanc', 'dried oregano': 'origan séché', 'sea salt': 'sel de mer', 'curry powder': 'curry en poudre',
  'garlic powder': 'ail en poudre', 'peanuts': 'cacahuètes', 'chilli powder': 'piment en poudre', 'chili powder': 'piment en poudre', 'corn flour': 'fécule de maïs',
  'basmati rice': 'riz basmati', 'kidney beans': 'haricots rouges', 'peas': 'petits pois', 'heavy cream': 'crème entière', 'double cream': 'crème entière',
  'courgettes': 'courgettes', 'zucchini': 'courgette', 'pita bread': 'pain pita', 'lamb mince': 'agneau haché', 'avocado': 'avocat', 'cinnamon stick': 'bâton de cannelle',
  'cumin seeds': 'graines de cumin', 'lime juice': 'jus de citron vert', 'jasmine rice': 'riz jasmin', 'raisins': 'raisins secs', 'orange': 'orange',
  'bean sprouts': 'pousses de soja', 'hotsauce': 'sauce piquante', 'tomato ketchup': 'ketchup', 'tomato sauce': 'sauce tomate', 'red wine': 'vin rouge',
  'cardamom': 'cardamome', 'creme fraiche': 'crème fraîche', 'garam masala': 'garam masala', 'cheddar cheese': 'cheddar', 'sweetcorn': 'maïs',
  'dry white wine': 'vin blanc sec', 'yellow pepper': 'poivron jaune', 'thai red curry paste': 'pâte de curry rouge', 'ground pork': 'porc haché',
  'minced pork': 'porc haché', 'vinegar': 'vinaigre', 'chilli flakes': 'flocons de piment', 'raw king prawns': 'gambas crues', 'squid': 'calamar',
  'egg plants': 'aubergines', 'coriander leaves': 'feuilles de coriandre', 'melted butter': 'beurre fondu', 'salmon': 'saumon', 'black olives': 'olives noires',
  'green olives': 'olives vertes', 'sausages': 'saucisses', 'broccoli': 'brocoli', 'white cabbage': 'chou blanc', 'red cabbage': 'chou rouge', 'ham': 'jambon',
  'baguette': 'baguette', 'cheese': 'fromage', 'black beans': 'haricots noirs', 'rocket': 'roquette', 'fennel': 'fenouil', 'ground coriander': 'coriandre moulue',
  'beetroot': 'betterave', 'cannellini beans': 'haricots blancs', 'smoked paprika': 'paprika fumé', 'dijon mustard': 'moutarde de Dijon', 'jalapeno': 'jalapeño',
  'tamarind paste': 'pâte de tamarin', 'sirloin steak': 'faux-filet', 'beef brisket': 'poitrine de bœuf', 'chicken legs': 'cuisses de poulet', 'kale': 'chou kale',
  'balsamic vinegar': 'vinaigre balsamique', 'pumpkin': 'potiron', 'macaroni': 'macaronis', 'yogurt': 'yaourt', 'pine nuts': 'pignons de pin', 'fish stock': 'fumet de poisson',
  'lamb leg': 'gigot d’agneau', 'almonds': 'amandes', 'coconut': 'noix de coco', 'sweet chilli sauce': 'sauce chili douce', 'butter beans': 'haricots de Lima',
  'shrimp': 'crevettes', 'butternut squash': 'courge butternut', 'lemongrass': 'citronnelle', 'spaghetti': 'spaghetti', 'walnuts': 'noix', 'pork shoulder': 'épaule de porc',
  'puff pastry': 'pâte feuilletée', 'salt cod': 'morue salée', 'peanut butter': 'beurre de cacahuète', 'white fish': 'poisson blanc', 'noodles': 'nouilles',
  'star anise': 'anis étoilé', 'coconut cream': 'crème de coco', 'beef fillet': 'filet de bœuf', 'prunes': 'pruneaux', 'passata': 'coulis de tomate',
  'new potatoes': 'pommes de terre nouvelles', 'pork chops': 'côtes de porc', 'clams': 'palourdes', 'asparagus': 'asperges', 'shortcrust pastry': 'pâte brisée',
  'shiitake mushrooms': 'champignons shiitake', 'mussels': 'moules', 'sage': 'sauge', 'lentils': 'lentilles', 'brown lentils': 'lentilles brunes', 'couscous': 'semoule',
  'goats cheese': 'fromage de chèvre', 'tahini': 'tahini', 'cream': 'crème', 'radish': 'radis', 'filo pastry': 'pâte filo', 'orange juice': 'jus d’orange',
  'chicken wings': 'ailes de poulet', 'tofu': 'tofu', 'capers': 'câpres', 'turnips': 'navets', 'smoked haddock': 'haddock fumé', 'cauliflower': 'chou-fleur',
  'mushroom': 'champignon', 'leeks': 'poireaux', 'celeriac': 'céleri-rave', 'gruyère': 'gruyère', 'cod': 'cabillaud', 'tuna': 'thon', 'duck': 'canard',
  'turkey': 'dinde', 'veal': 'veau', 'apple': 'pomme', 'apples': 'pommes', 'mango': 'mangue', 'pineapple': 'ananas', 'sweet potato': 'patate douce',
  'sweet potatoes': 'patates douces', 'parsnips': 'panais', 'quinoa': 'quinoa', 'tortillas': 'tortillas', 'flour tortilla': 'tortilla de blé', 'pancetta': 'pancetta',
  'prosciutto': 'jambon cru', 'chicken thigh': 'haut de cuisse de poulet', 'ricotta': 'ricotta', 'mascarpone': 'mascarpone', 'cashew nuts': 'noix de cajou',
  'whole milk': 'lait entier', 'egg white': 'blanc d’œuf', 'egg yolk': 'jaune d’œuf', 'lamb shoulder': 'épaule d’agneau', 'chicken stock cube': 'cube de bouillon de volaille',
  'vegetable stock cube': 'cube de bouillon de légumes', 'beef stock concentrate': 'bouillon de bœuf', 'sesame seeds': 'graines de sésame', 'ground cinnamon': 'cannelle moulue',
  'ground turmeric': 'curcuma moulu', 'turmeric powder': 'curcuma', 'fennel seeds': 'graines de fenouil', 'mirin': 'mirin', 'sake': 'saké', 'peanut oil': 'huile d’arachide',
  'palm sugar': 'sucre de palme', 'galangal': 'galanga', 'green onions': 'oignons verts', 'mint leaves': 'feuilles de menthe', 'chopped parsley': 'persil haché',
  'dried apricots': 'abricots secs', 'chickpea': 'pois chiche', 'red lentils': 'lentilles corail', 'garlic cloves': 'gousses d’ail', 'minced garlic': 'ail haché',
  'self-raising flour': 'farine à gâteau', 'bread flour': 'farine à pain', 'strong white bread flour': 'farine à pain', 'warm water': 'eau tiède', 'boiling water': 'eau bouillante',
};
