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
  eco: ['piggy-bank', 'Le dîner a tout bon. Même le prix.', 'On privilégie les plats aux ingrédients abordables : légumineuses, œufs, riz, pommes de terre…'],
  waste: ['recycle', 'Zéro gâchis, zéro prise de tête.', 'Votre menu réutilise les mêmes ingrédients d’un soir à l’autre pour finir les paquets entamés.'],
  discover: ['earth', 'Un tour du monde dans l’assiette.', 'Plus de 30 pays au menu : on varie les cuisines chaque semaine.'],
  time: ['timer', 'Moins de "trop la flemme", plus de "miaaam".', 'On met en avant les recettes rapides. À peine le temps de dire « j’ai faim ».'],
  nutri: ['carrot', 'Dîner réglé. Corps comblé.', 'Des repas plus légers et riches en légumes, adaptés à vos préférences nutritionnelles.'],
  plan: ['calendar-check', 'Votre semaine, réglée en un clic.', 'Un menu complet + la liste de courses générée automatiquement.'],
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
  { id: 'pork', label: 'Porc', icon: 'ham' },
  { id: 'seafood', label: 'Fruits de mer', icon: 'shell' },
  { id: 'fish', label: 'Poisson', icon: 'fish' },
  { id: 'peanut', label: 'Cacahuètes', icon: 'bean' },
  { id: 'nuts', label: 'Noix', icon: 'nut' },
  { id: 'dairy', label: 'Produits laitiers', icon: 'milk' },
  { id: 'gluten', label: 'Gluten', icon: 'wheat' },
  { id: 'egg', label: 'Œufs', icon: 'egg' },
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
  { id: 'herbs', label: 'Les herbes', icon: 'leaf' },
  { id: 'cheese', label: 'Beaucoup de fromage', icon: 'cheese' },
  { id: 'sweet', label: 'Sucré', icon: 'candy' },
  { id: 'spiced', label: 'Épicé', icon: 'sparkles' },
  { id: 'hot', label: 'Pimenté', icon: 'flame' },
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

// Ingrédients qu'on peut refuser (« je n'aime pas ») : regex sur le nom anglais TheMealDB, `not` pour les faux positifs.
// Les autres ingrédients se choisissent par recherche (id « i:nom anglais »).
const NO_INGR = [
  ['pepper', 'Poivrons', 'Bell peppers', '甜椒', 'Red Pepper', /\b(red|green|yellow|orange|bell|sweet|romano|mixed) peppers?\b|\bpeppers\b|capsicum|pimiento/, /chil|jalap|scotch|cayenne|black|white|szechuan|sichuan|corn|flake/],
  ['mushroom', 'Champignons', 'Mushrooms', '蘑菇', 'Mushrooms', /mushroom|shiitake|porcini|chanterelle|\bceps?\b|enoki/],
  ['aubergine', 'Aubergine', 'Aubergine', '茄子', 'Aubergine', /aubergine|egg ?plant|brinjal/],
  ['courgette', 'Courgette', 'Courgette', '西葫芦', 'Courgettes', /courgette|zucchini/],
  ['cauliflower', 'Chou-fleur', 'Cauliflower', '花椰菜', 'Cauliflower', /cauliflower/],
  ['broccoli', 'Brocoli', 'Broccoli', '西兰花', 'Broccoli', /broccoli|tenderstem/],
  ['sprouts', 'Choux de Bruxelles', 'Brussels sprouts', '抱子甘蓝', 'Brussels Sprouts', /brussels? sprout/],
  ['cabbage', 'Chou', 'Cabbage', '卷心菜', 'Cabbage', /cabbage|sauerkraut|coleslaw|\bkale\b/],
  ['spinach', 'Épinards', 'Spinach', '菠菜', 'Spinach', /spinach/],
  ['celery', 'Céleri', 'Celery', '芹菜', 'Celery', /celery|celeriac/, /salt|seed/],
  ['fennel', 'Fenouil', 'Fennel', '茴香', 'Fennel', /fennel/, /seed|powder|ground/],
  ['beetroot', 'Betterave', 'Beetroot', '甜菜根', 'Beetroot', /beetroot|\bbeets?\b/],
  ['olives', 'Olives', 'Olives', '橄榄', 'Black Olives', /\bolives?\b/, /oil/],
  ['onion', 'Oignon', 'Onion', '洋葱', 'Onion', /onion|shallot|scallion/, /powder|salt/],
  ['garlic', 'Ail', 'Garlic', '大蒜', 'Garlic', /garlic/, /powder|salt/],
  ['coriander', 'Coriandre fraîche', 'Fresh coriander', '香菜', 'Coriander', /coriander|cilantro/, /seed|ground|powder/],
  ['mint', 'Menthe', 'Mint', '薄荷', 'Mint', /\bmint\b/],
  ['dill', 'Aneth', 'Dill', '莳萝', 'Dill', /\bdill\b/],
  ['tomato', 'Tomate', 'Tomato', '番茄', 'Tomatoes', /tomato|passata/],
  ['avocado', 'Avocat', 'Avocado', '牛油果', 'Avocado', /avocado|guacamole/],
  ['cucumber', 'Concombre', 'Cucumber', '黄瓜', 'Cucumber', /cucumber/],
  ['peas', 'Petits pois', 'Peas', '豌豆', 'Peas', /\bpeas\b/, /split|sugar snap|black.?eyed/],
  ['greenbeans', 'Haricots verts', 'Green beans', '四季豆', 'Green Beans', /(green|french|runner|string) beans?/],
  ['leek', 'Poireau', 'Leek', '韭葱', 'Leek', /\bleeks?\b/],
  ['sweetpotato', 'Patate douce', 'Sweet potato', '红薯', 'Sweet Potatoes', /sweet potato/],
  ['squash', 'Courge / potiron', 'Squash / pumpkin', '南瓜', 'Butternut Squash', /squash|pumpkin|butternut/],
  ['radish', 'Radis', 'Radish', '萝卜', 'Radish', /\bradish/],
  ['turnip', 'Navet / panais', 'Turnip / parsnip', '芜菁 / 欧防风', 'Turnips', /turnip|parsnip|swede|rutabaga/],
  ['artichoke', 'Artichaut', 'Artichoke', '洋蓟', 'Artichoke', /artichoke/],
  ['asparagus', 'Asperges', 'Asparagus', '芦笋', 'Asparagus', /asparagus/],
  ['okra', 'Gombo', 'Okra', '秋葵', 'Okra', /okra/],
  ['corn', 'Maïs', 'Sweetcorn', '玉米', 'Sweetcorn', /sweetcorn|\bcorn\b|corn on the cob/, /flour|starch|meal|tortilla|oil|syrup/],
  ['capers', 'Câpres', 'Capers', '刺山柑', 'Capers', /caper/],
  ['coconut', 'Noix de coco', 'Coconut', '椰子', 'Coconut Milk', /coconut/],
  ['raisins', 'Raisins secs', 'Raisins', '葡萄干', 'Raisins', /raisin|sultana|currants?\b/],
  ['chickpeas', 'Pois chiches', 'Chickpeas', '鹰嘴豆', 'Chickpeas', /chickpea|garbanzo|hummus/],
  ['lentils', 'Lentilles', 'Lentils', '扁豆', 'Lentils', /lentil|\bdal\b|dhal/],
  ['beans', 'Haricots secs', 'Dried beans', '芸豆', 'Kidney Beans', /kidney bean|black bean|cannellini|butter bean|haricot|pinto|borlotti|baked beans|white beans|broad bean|fava|black.?eyed/],
  ['ginger', 'Gingembre', 'Ginger', '姜', 'Ginger', /ginger/],
  ['goatcheese', 'Fromage de chèvre', 'Goat’s cheese', '山羊奶酪', 'Goats Cheese', /goat.?s? cheese|chevre|chèvre/],
  ['bluecheese', 'Fromage bleu', 'Blue cheese', '蓝纹奶酪', 'Stilton Cheese', /stilton|gorgonzola|roquefort|blue cheese|dolcelatte/],
  ['anchovy', 'Anchois', 'Anchovies', '凤尾鱼', 'Anchovy Fillet', /anchov/],
  ['offal', 'Abats', 'Offal', '内脏', 'Chicken Livers', /liver|kidney\b|kidneys|tripe|heart\b|tongue|sweetbread|gizzard|black pudding/],
  ['tofu', 'Tofu', 'Tofu', '豆腐', 'Tofu', /tofu/],
].map(([id, label, en, zh, img, rx, not]) => ({ id, label, en, zh, img, rx, not }));
const NO_INGR_BY_ID = new Map(NO_INGR.map(x => [x.id, x]));

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

// ---------- Ingrédients interchangeables ----------
// Chaque famille regroupe des produits (noms français du dictionnaire) qui peuvent se remplacer dans une recette.
// Sert à proposer des alternatives et, avec les courses optimisées, à n'acheter qu'un seul produit pour toute la famille.
const ALT_FAMILIES = [
  ['onion', 'Oignons', 'Oignons rouges', 'Échalotes'],
  ['spring', 'Oignons nouveaux', 'Ciboulette'],
  ['garlic', 'Ail', 'Ail en poudre'],
  ['ginger', 'Gingembre frais', 'Gingembre en purée', 'Gingembre moulu'],
  ['lemon', 'Citrons', 'Citrons verts', 'Jus de citron', 'Citrons verts (jus)', 'Citrons (zeste)'],
  ['orange', 'Oranges', 'Jus d’orange', 'Oranges (zeste)'],
  ['tomato', 'Tomates', 'Tomates en grappe', 'Tomates olivettes', 'Tomates cœur de bœuf', 'Tomates cerises', 'Tomates cerises allongées'],
  ['tintomato', 'Tomates concassées (boîte)', 'Tomates en dés (boîte)', 'Tomates pelées (boîte)', 'Coulis de tomate', 'Sauce tomate'],
  ['pepper', 'Poivron rouge', 'Poivrons rouges', 'Poivron vert', 'Poivron jaune', 'Poivrons tricolores', 'Poivron rouge pointu'],
  ['chilli', 'Piment rouge', 'Piment vert', 'Piments oiseau', 'Piment antillais', 'Piment habanero', 'Jalapeños'],
  ['potato', 'Pommes de terre', 'Pommes de terre charlotte', 'Pommes de terre farineuses', 'Pommes de terre grenaille', 'Pommes de terre nouvelles', 'Pommes de terre rouges'],
  ['squash', 'Courge', 'Courge butternut', 'Potiron'],
  ['aubergine', 'Aubergine', 'Aubergines', 'Mini aubergines'],
  ['beetroot', 'Betterave', 'Betteraves', 'Betteraves cuites'],
  ['greenbean', 'Haricots verts', 'Haricots plats', 'Pois gourmands'],
  ['mushroom', 'Champignons de Paris', 'Champignons bruns', 'Champignons des bois', 'Pleurotes', 'Champignons shiitaké'],
  ['salad', 'Laitue', 'Sucrine', 'Salade iceberg', 'Jeunes pousses de salade', 'Roquette'],
  ['cabbage', 'Chou blanc', 'Chou vert', 'Chou pointu', 'Chou frisé', 'Chou chinois'],
  ['greens', 'Épinards frais', 'Chou kale', 'Épinards (callaloo)', 'Pak choï', 'Mini pak choï'],
  ['herb', 'Persil frais', 'Coriandre fraîche'],
  ['thyme', 'Thym', 'Thym frais'],
  ['dill', 'Aneth frais', 'Aneth séché'],
  ['mint', 'Menthe fraîche', 'Menthe séchée'],
  ['oregano', 'Origan', 'Origan séché', 'Herbes italiennes', 'Marjolaine'],
  ['cumin', 'Cumin', 'Graines de cumin'],
  ['coriander', 'Coriandre moulue', 'Graines de coriandre'],
  ['cinnamon', 'Cannelle', 'Cannelle en bâton'],
  ['paprika', 'Paprika', 'Paprika fumé', 'Paprika fumé doux', 'Paprika fumé fort'],
  ['chillipowder', 'Piment en poudre', 'Piment fort en poudre', 'Piment de Cayenne', 'Flocons de piment'],
  ['curry', 'Curry en poudre', 'Garam masala'],
  ['currypaste', 'Pâte de curry rouge', 'Pâte de curry vert', 'Pâte de curry panang', 'Pâte de curry massaman', 'Pâte de curry Madras'],
  ['stock', 'Bouillon de volaille', 'Bouillon de volaille (cubes)', 'Bouillon de légumes', 'Bouillon de légumes (cubes)', 'Bouillon (cubes)', 'Bouillon de bœuf', 'Bouillon de bœuf (cubes)', 'Fond de bœuf'],
  ['mustard', 'Moutarde', 'Moutarde de Dijon', 'Moutarde forte', 'Moutarde à l’ancienne'],
  ['cream', 'Crème fraîche', 'Crème fraîche épaisse', 'Crème épaisse', 'Crème entière liquide', 'Crème liquide', 'Crème liquide légère'],
  ['yogurt', 'Yaourt nature', 'Yaourt entier', 'Yaourt à la grecque', 'Fromage blanc'],
  ['butter', 'Beurre', 'Beurre doux', 'Beurre demi-sel'],
  ['milk', 'Lait entier', 'Lait demi-écrémé'],
  ['eggs', 'Œufs', 'Œufs plein air'],
  ['hardcheese', 'Parmesan', 'Pecorino'],
  ['meltcheese', 'Emmental', 'Gruyère / comté râpé', 'Comté affiné', 'Fromage râpé', 'Cheddar', 'Cheddar affiné', 'Cheddar râpé', 'Gouda', 'Fromage à pâte pressée'],
  ['freshcheese', 'Fromage frais', 'Fromage frais à tartiner', 'Ricotta', 'Mascarpone', 'Cottage cheese'],
  ['feta', 'Feta', 'Feta douce / fromage frais', 'Fromage de brebis frais', 'Fromage de chèvre'],
  ['coconut', 'Lait de coco', 'Crème de coco'],
  ['chicken', 'Poulet', 'Blancs de poulet', 'Hauts de cuisse de poulet', 'Cuisses de poulet', 'Pilons de poulet'],
  ['mince', 'Bœuf haché', 'Bœuf haché 5 %', 'Steak haché 5 %', 'Viande hachée'],
  ['stewbeef', 'Bœuf', 'Bœuf à braiser', 'Paleron de bœuf', 'Jarret de bœuf', 'Poitrine de bœuf'],
  ['steak', 'Bavette', 'Bavette de bœuf', 'Faux-filet', 'Onglet / hampe', 'Filet de bœuf', 'Escalope de bœuf'],
  ['lamb', 'Agneau', 'Épaule d’agneau', 'Gigot d’agneau', 'Souris d’agneau', 'Viande de chèvre / agneau'],
  ['pork', 'Porc', 'Échine de porc', 'Échine de porc en tranches', 'Côtes de porc'],
  ['bacon', 'Bacon / lardons', 'Lardons', 'Poitrine fumée'],
  ['ham', 'Jambon', 'Jambon blanc', 'Jambon fumé', 'Jambon de dinde'],
  ['curedham', 'Jambon cru', 'Jambon de Parme', 'Jambon serrano', 'Jambon ibérique'],
  ['sausage', 'Saucisses', 'Saucisse de porc', 'Saucisses italiennes', 'Porc haché / chair à saucisse'],
  ['whitefish', 'Cabillaud', 'Filet de poisson blanc', 'Filets de poisson blanc', 'Merlu', 'Églefin / haddock', 'Lotte', 'Filets de bar', 'Vivaneau / dorade'],
  ['oilyfish', 'Saumon', 'Truite'],
  ['prawn', 'Crevettes', 'Crevettes tigrées', 'Crevettes tigrées crues', 'Gambas', 'Gambas crues', 'Crevettes crues surgelées'],
  ['tofu', 'Tofu ferme', 'Tofu mariné'],
  ['rice', 'Riz', 'Riz basmati', 'Riz thaï / jasmin'],
  ['pasta', 'Spaghetti', 'Linguine', 'Tagliatelles', 'Penne', 'Rigatoni', 'Paccheri / rigatoni', 'Farfalle', 'Macaronis'],
  ['noodles', 'Nouilles', 'Nouilles aux œufs', 'Nouilles udon'],
  ['ricenoodles', 'Nouilles de riz', 'Nouilles de riz plates', 'Vermicelles de riz'],
  ['beans', 'Haricots blancs', 'Haricots blancs (boîte)', 'Haricots de Lima', 'Haricots de Lima / haricots blancs', 'Haricots borlotti', 'Haricots rouges', 'Haricots pinto / rouges', 'Haricots en boîte', 'Haricots noirs', 'Haricots cornilles'],
  ['lentils', 'Lentilles', 'Lentilles brunes', 'Lentilles vertes du Puy', 'Lentilles corail'],
  ['chickpeas', 'Pois chiches', 'Pois chiches (boîte)'],
  ['peas', 'Petits pois', 'Petits pois surgelés'],
  ['corn', 'Maïs (boîte)', 'Épis de maïs'],
  ['olives', 'Olives noires', 'Olives noires dénoyautées', 'Olives vertes'],
  ['bread', 'Pain', 'Baguette', 'Pain baguette', 'Pain de campagne', 'Ciabatta', 'Pain complet'],
  ['tortilla', 'Tortillas de blé', 'Tortillas de maïs'],
  ['pastry', 'Pâte brisée', 'Pâte feuilletée'],
  ['honey', 'Miel', 'Miel liquide', 'Sirop d’érable'],
  ['whitewine', 'Vin blanc', 'Vin blanc sec', 'Vin de cuisine'],
  ['apple', 'Pommes', 'Pommes à cuire'],
].map(([id, ...members]) => ({ id, members }));
