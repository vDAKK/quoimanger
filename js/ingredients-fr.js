// Dictionnaire ingrédients TheMealDB → nom français + rayon Intermarché.
// Format : anglais;français;rayon   (rayon suivi de * = produit de placard, à vérifier avant d'acheter)
// Rayons : fl fruits & légumes · bl boulangerie · bo boucherie & volaille · po poissonnerie · ch charcuterie & traiteur
//          cr crèmerie & œufs · fr fromages · ep épicerie salée · sa sauces, huiles & condiments · es épices & bouillons
//          mo produits du monde · su épicerie sucrée & pâtisserie · bs boissons & vins · sg surgelés
const INGREDIENTS_FR_RAW = `
achiote paste;Pâte de rocou;mo
achiote seeds;Graines de rocou;mo
ackee;Akée (conserve);mo
alinos sauce;Sauce aliños;mo
all purpose flour;Farine T45;su*
all-purpose seasoning;Assaisonnement tout usage;es
allspice;Piment de la Jamaïque;es
allspice berries;Baies de piment de la Jamaïque;es
almond essence;Arôme amande;su
almond milk;Lait d'amande;cr
almonds;Amandes;su
ancho chillies;Piments ancho séchés;mo
anchovy fillet;Filets d'anchois;ep
apple cider vinegar;Vinaigre de cidre;sa*
apples;Pommes;fl
apricot;Abricots;fl
apricot jam;Confiture d'abricot;su
arborio rice;Riz arborio (risotto);ep
asparagus;Asperges;fl
aubergine;Aubergine;fl
avocado;Avocat;fl
baby aubergine;Mini aubergines;fl
baby lettuce leaves;Jeunes pousses de salade;fl
baby new potatoes;Pommes de terre grenaille;fl
baby pak koi;Mini pak choï;fl
baby plum tomatoes;Tomates cerises allongées;fl
baby squid;Petits calamars;po
bacon;Bacon / lardons;ch
bacon lardon;Lardons;ch
baguette;Baguette;bl
baking powder;Levure chimique;su*
balsamic vinegar;Vinaigre balsamique;sa*
bamboo shoot;Pousses de bambou;mo
banana;Bananes;fl
banana leaves;Feuilles de bananier;mo
banana pepper;Piments doux;fl
barbeque sauce;Sauce barbecue;sa
barramundi;Filet de poisson blanc;po
basil;Basilic frais;fl
basil leaves;Basilic frais;fl
basmati rice;Riz basmati;ep
bay leaf;Laurier;es*
bay leaves;Laurier;es*
bean sprouts;Pousses de soja;fl
beef;Bœuf;bo
beef brisket;Poitrine de bœuf;bo
beef cutlet;Escalope de bœuf;bo
beef fillet;Filet de bœuf;bo
beef flank steak;Bavette de bœuf;bo
beef gravy;Fond de sauce brune;es
beef shin;Jarret de bœuf;bo
beef stock;Bouillon de bœuf;es
beef stock concentrate;Fond de bœuf;es
beef stock cubes;Bouillon de bœuf (cubes);es
beef tenderloin;Filet de bœuf;bo
beef tomatoes;Tomates cœur de bœuf;fl
beer;Bière;bs
beetroot;Betterave;fl
beets;Betteraves;fl
bicarbonate of soda;Bicarbonate de soude;su*
birds-eye chillies;Piments oiseau;fl
biryani masala;Épices biryani;mo
black beans;Haricots noirs;ep
black eyed peas;Haricots cornilles;ep
black olives;Olives noires;ep
black pepper;Poivre noir;es*
black pudding;Boudin noir;ch
black treacle;Mélasse;su
boiling water;Eau;-
bok choi;Pak choï;fl
borlotti beans;Haricots borlotti;ep
bouillon cubes;Bouillon (cubes);es
bouquet garni;Bouquet garni;es
bowtie pasta;Farfalle;ep
bramley apples;Pommes à cuire;fl
brandy;Cognac / brandy;bs
bread;Pain;bl
bread flour;Farine à pain T65;su
bread rolls;Petits pains;bl
breadcrumbs;Chapelure;ep
breadfruit;Fruit à pain;mo
brie;Brie;fr
broad beans;Fèves;sg
broccoli;Brocoli;fl
brown lentils;Lentilles brunes;ep
brown rice;Riz complet;ep
brown rice noodle;Nouilles de riz complet;mo
brown sugar;Sucre roux;su
bryndza cheese;Fromage de brebis frais;fr
buckwheat;Sarrasin;ep
bulgur wheat;Boulgour;ep
bun;Pains burger;bl
butter;Beurre;cr
butter beans;Haricots de Lima / haricots blancs;ep
buttermilk;Lait ribot;cr
butternut squash;Courge butternut;fl
cabbage;Chou vert;fl
cabbage leaves;Chou vert;fl
cacao;Cacao en poudre;su
cajun;Épices cajun;es
callaloo;Épinards (callaloo);fl
can of chickpeas;Pois chiches (boîte);ep
canned beans;Haricots en boîte;ep
canned tomatoes;Tomates pelées (boîte);ep
cannellini beans;Haricots blancs (boîte);ep
canola oil;Huile de colza;sa*
capers;Câpres;ep
caraway seed;Graines de carvi;es
cardamom;Cardamome;es
carrot;Carottes;fl
carrots;Carottes;fl
casabe;Galettes de manioc;mo
cashew nuts;Noix de cajou;su
cashews;Noix de cajou;su
cassaba;Manioc;mo
cassava;Manioc;mo
cassava flour;Farine de manioc;mo
caster sugar;Sucre en poudre;su*
cauliflower;Chou-fleur;fl
cayenne pepper;Piment de Cayenne;es
celeriac;Céleri-rave;fl
celery;Céleri branche;fl
celery salt;Sel de céleri;es
challots;Échalotes;fl
charlotte potatoes;Pommes de terre charlotte;fl
cheddar cheese;Cheddar;fr
cheese;Fromage râpé;fr
cheese curds;Fromage en grains;fr
cherry;Cerises;fl
cherry tomatoes;Tomates cerises;fl
chestnut mushroom;Champignons bruns;fl
chestnuts;Châtaignes;ep
chicken;Poulet;bo
chicken bouillon powder;Bouillon de volaille;es
chicken breast;Blancs de poulet;bo
chicken breasts;Blancs de poulet;bo
chicken drumsticks;Pilons de poulet;bo
chicken legs;Cuisses de poulet;bo
chicken liver;Foies de volaille;bo
chicken stock;Bouillon de volaille;es
chicken stock cube;Bouillon de volaille (cubes);es
chicken thighs;Hauts de cuisse de poulet;bo
chicken wings;Ailes de poulet;bo
chickpea flour;Farine de pois chiche;mo
chickpeas;Pois chiches;ep
chili powder;Piment en poudre;es
chilli;Piment rouge;fl
chilli bean paste;Pâte de piment (doubanjiang);mo
chilli flakes;Flocons de piment;es
chilli oil;Huile pimentée;mo
chilli powder;Piment en poudre;es
chilli sauce;Sauce piquante;sa
chimichurri sauce;Sauce chimichurri;sa
chinese broccoli;Brocoli chinois;mo
chinese cabbage;Chou chinois;fl
chinese five spice powder;Cinq-épices;mo
chinese leaf;Chou chinois;fl
chinese long beans;Haricots kilomètre;mo
chinese sesame sauce;Pâte de sésame;mo
chives;Ciboulette;fl
chopped chive;Ciboulette;fl
chopped onion;Oignons;fl
chopped parsley;Persil frais;fl
chopped tomatoes;Tomates concassées (boîte);ep
chorizo;Chorizo;ch
chuck roast;Paleron de bœuf;bo
ciabatta;Ciabatta;bl
cider;Cidre;bs
cider vinegar;Vinaigre de cidre;sa*
cilantro;Coriandre fraîche;fl
cilantro leaves;Coriandre fraîche;fl
cinnamon;Cannelle;es
cinnamon stick;Cannelle en bâton;es
clams;Palourdes;po
clear honey;Miel liquide;su
clotted cream;Crème épaisse;cr
clove;Clous de girofle;es
cloves;Clous de girofle;es
coarse salt;Gros sel;es*
coco sugar;Sucre de coco;su
cocoa;Cacao en poudre;su
coconut;Noix de coco râpée;su
coconut cream;Crème de coco;mo
coconut milk;Lait de coco;mo
coconut oil;Huile de coco;sa
cod;Cabillaud;po
codfish bulljaw;Morue salée;po
colby jack cheese;Cheddar râpé;fr
cold water;Eau;-
conchs;Bulots / coquillages;po
cooked beetroot;Betteraves cuites;fl
cooked chestnut;Châtaignes cuites;ep
cooking wine;Vin de cuisine;bs
coriander;Coriandre fraîche;fl
coriander leaves;Coriandre fraîche;fl
coriander seeds;Graines de coriandre;es
corn arepa filled with mozarella cheese;Galettes de maïs (arepas);mo
corn flour;Maïzena;su*
corn on the cob;Épis de maïs;fl
corn tortillas;Tortillas de maïs;mo
corned beef;Corned-beef;ep
cornmeal;Polenta / semoule de maïs;ep
cornstarch;Maïzena;su*
cottage cheese;Cottage cheese;cr
courgettes;Courgettes;fl
couscous;Semoule de couscous;ep
crab meay;Chair de crabe;ep
cranberry;Cranberries séchées;su
cream;Crème liquide;cr
cream cheese;Fromage frais à tartiner;cr
creamed corn;Maïs à la crème (boîte);mo
creme fraiche;Crème fraîche;cr
crusty bread;Pain de campagne;bl
cuban bread;Pain baguette;bl
cubed feta cheese;Feta;fr
cucumber;Concombre;fl
cumin;Cumin;es
cumin seeds;Graines de cumin;es
curry powder;Curry en poudre;es
daikon radish;Radis blanc (daikon);fl
dark beer;Bière brune;bs
dark brown sugar;Sucre brun / vergeoise;su
dark soy sauce;Sauce soja foncée;mo
deli ham;Jambon blanc;ch
desiccated coconut;Noix de coco râpée;su
diced tomatoes;Tomates en dés (boîte);ep
dijon mustard;Moutarde de Dijon;sa*
dill;Aneth frais;fl
dill pickles;Cornichons;ep
doner meat;Viande kebab;ch
doubanjiang;Pâte de piment (doubanjiang);mo
double cream;Crème entière liquide;cr
dried apricots;Abricots secs;su
dried chillies;Piments séchés;es
dried dill;Aneth séché;es
dried leaves of summer savoury;Sarriette séchée;es
dried mint;Menthe séchée;es
dried oregano;Origan séché;es*
dried red chillies;Piments rouges séchés;es
dried shrimp;Crevettes séchées;mo
dried sorrel;Oseille séchée;mo
dried white beans;Haricots blancs secs;ep
dried white corn;Maïs blanc séché;mo
dried white navy beans;Haricots blancs secs;ep
dry sherry;Xérès sec;bs
dry white wine;Vin blanc sec;bs
duck legs;Cuisses de canard;bo
duck sauce;Sauce aigre-douce;mo
edamame beans;Edamames;sg
egg;Œufs;cr
egg noodles;Nouilles aux œufs;mo
egg plants;Aubergines;fl
egg roll wrappers;Feuilles de brick / rouleaux de printemps;mo
egg rolls;Nems;sg
egg wash;Œufs;cr
egg white;Œufs;cr
egg yolks;Œufs;cr
eggs;Œufs;cr
emmentaler cheese;Emmental;fr
enchilada sauce;Sauce enchilada;mo
english mustard;Moutarde forte;sa*
evaporated milk;Lait concentré non sucré;su
extra virgin olive oil;Huile d'olive vierge extra;sa*
fajita seasoning;Épices fajitas;mo
falafel;Falafels;ch
farfalle;Farfalle;ep
farine;Farine T45;su*
farmers cheese;Fromage blanc;cr
fast action yeast;Levure de boulanger sèche;su
feather blade beef;Paleron de bœuf;bo
fennel;Fenouil;fl
fennel bulb;Fenouil;fl
fennel seeds;Graines de fenouil;es
fenugreek;Fenugrec;mo
fermented black beans;Haricots noirs fermentés;mo
feta;Feta;fr
fettuccine;Tagliatelles;ep
fillet of steak;Filet de bœuf;bo
filo pastry;Pâte filo;ch
fish fillet;Filets de poisson blanc;po
fish sauce;Sauce nuoc-mâm;mo
fish stock;Fumet de poisson;es
five spice powder;Cinq-épices;mo
flank steak;Bavette;bo
flat rice noodles;Nouilles de riz plates;mo
flax eggs;Graines de lin;ep
flour;Farine T45;su*
flour tortilla;Tortillas de blé;mo
floury potatoes;Pommes de terre farineuses;fl
free-range egg, beaten;Œufs plein air;cr
freekeh;Freekeh / blé vert;mo
french lentils;Lentilles vertes du Puy;ep
fresh basil;Basilic frais;fl
fresh thyme;Thym frais;fl
freshly chopped parsley;Persil frais;fl
fried ripe bananas;Bananes plantain;fl
fries;Frites surgelées;sg
frogs legs;Cuisses de grenouille;sg
fromage frais;Fromage frais;cr
frozen peas;Petits pois surgelés;sg
frozen seafood mix;Cocktail de fruits de mer surgelé;sg
full fat yogurt;Yaourt entier;cr
galangal;Galanga;mo
galangal paste;Pâte de galanga;mo
garam masala;Garam masala;es
garlic;Ail;fl
garlic bulb;Ail;fl
garlic clove;Ail;fl
garlic granules;Ail en poudre;es
garlic powder;Ail en poudre;es
garlic sauce;Sauce à l'ail;sa
german sausages;Saucisses de Francfort;ch
ghee;Ghee / beurre clarifié;mo
ginger;Gingembre frais;fl
ginger cordial;Sirop de gingembre;bs
ginger garlic paste;Pâte ail-gingembre;mo
ginger paste;Gingembre en purée;mo
glutinous rice;Riz gluant;mo
gnocchi;Gnocchis;ch
goat meat;Viande de chèvre / agneau;bo
goats cheese;Fromage de chèvre;fr
gochujang;Gochujang;mo
golden caster sugar;Sucre blond;su*
goose fat;Graisse d'oie;ep
gouda cheese;Gouda;fr
granulated sugar;Sucre en poudre;su*
grape tomatoes;Tomates cerises;fl
grapefruit;Pamplemousse;fl
great northern beans;Haricots blancs (boîte);ep
greek yogurt;Yaourt à la grecque;cr
green beans;Haricots verts;fl
green chilli;Piment vert;fl
green olives;Olives vertes;ep
green papaya;Papaye verte;mo
green pepper;Poivron vert;fl
green red lentils;Lentilles corail;ep
green salsa;Salsa verde;mo
ground allspice;Piment de la Jamaïque moulu;es
ground annatto;Rocou en poudre;mo
ground beef;Bœuf haché;bo
ground black pepper;Poivre noir;es*
ground cardomom;Cardamome moulue;es
ground cinnamon;Cannelle;es
ground clove;Girofle moulu;es
ground coriander;Coriandre moulue;es
ground cumin;Cumin;es
ground ginger;Gingembre moulu;es
ground mahleb;Mahlab;mo
ground mustard;Moutarde en poudre;es
ground nut oil;Huile d'arachide;sa*
ground nutmeg;Noix de muscade;es
ground onion;Oignon en poudre;es
ground pork;Porc haché / chair à saucisse;bo
ground turmeric;Curcuma;es
gruyere;Gruyère / comté râpé;fr
gruyere cheese;Gruyère / comté râpé;fr
gruyère;Gruyère / comté râpé;fr
habanero pepper;Piment habanero;fl
haddock;Églefin / haddock;po
hake;Merlu;po
halloumi;Halloumi;fr
ham;Jambon;ch
hard taco shells;Coques à tacos;mo
haricot beans;Haricots blancs;ep
harissa spice;Harissa;mo
heavy cream;Crème entière liquide;cr
herring;Harengs;po
high heat cooking oil;Huile de tournesol;sa*
hind shank;Jarret de bœuf;bo
hispi (sweetheart) cabbage;Chou pointu;fl
hoisin sauce;Sauce hoisin;mo
honey;Miel;su
horseradish;Raifort;sa
hot beef stock;Bouillon de bœuf;es
hot chilli powder;Piment fort en poudre;es
hot mint;Menthe fraîche;fl
hot smoked flaked salmon;Saumon fumé à chaud;po
hot smoked paprika;Paprika fumé fort;es
hotsauce;Sauce piquante;sa
hummus;Houmous;ch
iceberg lettuce;Salade iceberg;fl
icing sugar;Sucre glace;su
instant yeast;Levure de boulanger sèche;su
italian fennel sausages;Saucisses italiennes;ch
italian seasoning;Herbes italiennes;es
jalapeno;Jalapeños;mo
jamaican curry powder;Curry jamaïcain / colombo;mo
jamón ibérico;Jambon ibérique;ch
jasmine rice;Riz thaï / jasmin;ep
jerk;Assaisonnement jerk;mo
jersey royal potatoes;Pommes de terre nouvelles;fl
jerusalem artichokes;Topinambours;fl
jumbo shrimp;Gambas;po
juniper berries;Baies de genièvre;es
kabanos sausages;Saucisses kabanos;ch
kabse spice;Épices kabsa;mo
kaffir lime leaves;Feuilles de combava;mo
kale;Chou kale;fl
kampot pepper;Poivre de Kampot;es
khus khus;Graines de pavot;es
kidney beans;Haricots rouges;ep
kielbasa;Saucisse fumée polonaise;ch
kimchi;Kimchi;mo
king prawns;Gambas;po
kosher salt;Gros sel;es*
lamb;Agneau;bo
lamb fat;Graisse d'agneau;bo
lamb kidney;Rognons d'agneau;bo
lamb leg;Gigot d'agneau;bo
lamb loin chops;Côtelettes d'agneau;bo
lamb mince;Agneau haché;bo
lamb shanks;Souris d'agneau;bo
lamb shoulder;Épaule d'agneau;bo
lamb stock;Fond d'agneau / bouillon;es
lard;Saindoux;ep
lasagne sheets;Feuilles de lasagne;ep
lean minced beef;Bœuf haché 5 %;bo
lean minced steak;Steak haché 5 %;bo
leek;Poireaux;fl
lemon;Citrons;fl
lemon juice;Jus de citron;fl
lemon zest;Citrons (zeste);fl
lemongrass;Citronnelle;mo
lemongrass stalks;Citronnelle;mo
lemons;Citrons;fl
lentils;Lentilles;ep
lettuce;Laitue;fl
light raisins;Raisins secs blonds;su
lima beans;Haricots de Lima;ep
lime;Citrons verts;fl
lime juice;Citrons verts (jus);fl
lime leaves;Feuilles de combava;mo
linguine pasta;Linguine;ep
little gem lettuce;Sucrine;fl
lobster;Homard;po
longan;Longanes (boîte);mo
macaroni;Macaronis;ep
mackerel;Maquereau;po
madras paste;Pâte de curry Madras;mo
makrut lime leaves;Feuilles de combava;mo
malt vinegar;Vinaigre de malt;sa*
manchego;Manchego;fr
mango;Mangue;fl
maple syrup;Sirop d'érable;su
marinated tofu;Tofu mariné;ch
marjoram;Marjolaine;es
mascarpone;Mascarpone;cr
massaman curry paste;Pâte de curry massaman;mo
mature cheddar;Cheddar affiné;fr
mayonnaise;Mayonnaise;sa
melted butter;Beurre;cr
merguez;Merguez;bo
milk;Lait demi-écrémé;cr
minced beef;Bœuf haché;bo
minced garlic;Ail;fl
minced pork;Porc haché / chair à saucisse;bo
mincemeat;Viande hachée;bo
mint;Menthe fraîche;fl
mirin;Mirin;mo
mixed beef cuts;Bœuf à braiser;bo
mixed grain;Mélange de céréales;ep
mixed peppers;Poivrons tricolores;fl
molasses;Mélasse;su
monkfish;Lotte;po
monterey jack cheese;Cheddar râpé;fr
morcilla;Boudin noir;ch
morning glory;Liseron d'eau;mo
mozzarella;Mozzarella;fr
mozzarella balls;Mozzarella;fr
mulukhiyah;Corète potagère;mo
mung bean paste;Pâte de haricots mungo;mo
mung bean sprouts;Pousses de soja;fl
muscovado sugar;Sucre muscovado;su
mushrooms;Champignons de Paris;fl
mussels;Moules;po
mustard;Moutarde;sa*
mustard powder;Moutarde en poudre;es
mustard seeds;Graines de moutarde;es
naan bread;Pains naan;mo
napa cabbage;Chou chinois;fl
natural yoghurt;Yaourt nature;cr
new potatoes;Pommes de terre nouvelles;fl
noodles;Nouilles;mo
nutmeg;Noix de muscade;es
oats;Flocons d'avoine;ep
oil;Huile;sa*
olive oil;Huile d'olive;sa*
onion;Oignons;fl
onion salt;Sel à l'oignon;es
onions;Oignons;fl
orange;Oranges;fl
orange juice;Jus d'orange;bs
orange zest;Oranges (zeste);fl
oregano;Origan;es*
oxtail;Queue de bœuf;bo
oyster mushrooms;Pleurotes;fl
oyster sauce;Sauce d'huître;mo
oysters;Huîtres;po
paccheri pasta;Paccheri / rigatoni;ep
padron peppers;Piments padrón;fl
paella rice;Riz rond à paella;ep
pak choi;Pak choï;fl
palm hearts;Cœurs de palmier;ep
palm sugar;Sucre de palme;mo
panang curry paste;Pâte de curry panang;mo
pandan leaves;Feuilles de pandan;mo
paneer;Paneer / halloumi;fr
panquehue cheese;Fromage à pâte pressée;fr
paprika;Paprika;es
parma ham;Jambon de Parme;ch
parmesan;Parmesan;fr
parmesan cheese;Parmesan;fr
parmigiano-reggiano;Parmesan;fr
parsley;Persil frais;fl
parsnips;Panais;fl
passata;Coulis de tomate;ep
peanut butter;Beurre de cacahuète;su
peanut oil;Huile d'arachide;sa*
peanuts;Cacahuètes;ep
pear;Poire;fl
peas;Petits pois;sg
pecorino;Pecorino;fr
penne rigate;Penne;ep
pepper;Poivre;es*
peppercorns;Poivre en grains;es*
petit pois;Petits pois;sg
phyllo dough;Pâte filo;ch
pickle juice;Jus de cornichons;ep
pickled garlics;Ail mariné;mo
pickled grape leaves;Feuilles de vigne;mo
pickled scallion head brine;Saumure d'oignons marinés;mo
pickled scallion heads;Petits oignons marinés;ep
pico de gallo sauce;Salsa pico de gallo;mo
pigs trotters;Pieds de porc;bo
pilchards;Sardines (boîte);ep
pimento stuffed olives;Olives farcies;ep
pine nuts;Pignons de pin;su
pineapple chunks;Ananas (boîte);ep
pineapple juice;Jus d'ananas;bs
pinto beans;Haricots pinto / rouges;ep
pistachio;Pistaches;su
pita bread;Pains pita;bl
pitted black olives;Olives noires dénoyautées;ep
plain flour;Farine T45;su*
plantain;Bananes plantain;fl
plum sauce;Sauce aux prunes;mo
plum tomatoes;Tomates olivettes;fl
polish kabanos;Saucisses kabanos;ch
pomegranate;Grenade;fl
pomegranate molasses;Mélasse de grenade;mo
poppy seeds;Graines de pavot;es
pork;Porc;bo
pork back ribs;Travers de porc;bo
pork belly slices;Poitrine de porc;bo
pork chops;Côtes de porc;bo
pork knuckle;Jarret de porc;bo
pork shoulder;Échine de porc;bo
pork shoulder steaks;Échine de porc en tranches;bo
pork tenderloin;Filet mignon de porc;bo
potato starch;Fécule de pomme de terre;su
potatoes;Pommes de terre;fl
prahok;Pâte de poisson fermenté;mo
prawns;Crevettes;po
pretzels;Bretzels;ep
prosciutto;Jambon cru;ch
prunes;Pruneaux;su
puff pastry;Pâte feuilletée;ch
pul biber;Piment d'Alep;mo
pumpkin;Potiron;fl
pumpkin puree;Purée de potiron;ep
purple sprouting broccoli;Brocoli;fl
queso fresco;Feta douce / fromage frais;fr
quinoa;Quinoa;ep
radish;Radis;fl
rainbow trout;Truite;po
raisins;Raisins secs;su
rapeseed oil;Huile de colza;sa*
ras el hanout;Ras el hanout;es
raw frozen prawns;Crevettes crues surgelées;sg
raw king prawns;Gambas crues;po
raw tiger prawns;Crevettes tigrées crues;po
raw vegetables;Légumes crus variés;fl
ready rolled shortcrust pastry;Pâte brisée;ch
red cabbage;Chou rouge;fl
red chilli;Piment rouge;fl
red chilli flakes;Flocons de piment;es
red chilli powder;Piment en poudre;es
red curry paste;Pâte de curry rouge;mo
red onions;Oignons rouges;fl
red pepper;Poivron rouge;fl
red pepper flakes;Flocons de piment;es
red pepper paste;Pâte de poivron (biber salçası);mo
red pepper sauce;Sauce au poivron;sa
red potatoes;Pommes de terre rouges;fl
red snapper;Vivaneau / dorade;po
red wine;Vin rouge;bs
red wine vinegar;Vinaigre de vin rouge;sa*
refried beans;Haricots frits (refried beans);mo
rice;Riz;ep
rice flour;Farine de riz;mo
rice flour pancakes;Galettes de riz;mo
rice noodles;Nouilles de riz;mo
rice paper sheets;Galettes de riz;mo
rice stick noodles;Nouilles de riz;mo
rice vermicelli;Vermicelles de riz;mo
rice vinegar;Vinaigre de riz;mo
rice wine;Vin de riz / saké de cuisine;mo
ricotta;Ricotta;cr
rigatoni;Rigatoni;ep
roasted peanut;Cacahuètes grillées;ep
roasted pepper;Poivrons grillés (bocal);ep
roasted vegetables;Légumes grillés;sg
rocket;Roquette;fl
romano pepper;Poivron rouge pointu;fl
rose water;Eau de rose;mo
rosemary;Romarin;fl
runner beans;Haricots plats;fl
russet potato;Pommes de terre;fl
rye;Seigle;ep
rye bread;Pain de seigle;bl
rye flour;Farine de seigle;su
rye grain;Grains de seigle;ep
saffron;Safran;es
sage;Sauge;fl
sake;Saké;mo
salmon;Saumon;po
salsa;Salsa;mo
salsa lizano;Sauce Lizano;mo
salt;Sel;es*
salt cod;Morue salée;po
salted butter;Beurre demi-sel;cr
sardines;Sardines;po
sauerkraut;Choucroute;ch
sausages;Saucisses;bo
savoy cabbage;Chou frisé;fl
sazon;Assaisonnement sazón;mo
sazon goya with azafran;Assaisonnement sazón;mo
scallions;Oignons nouveaux;fl
scotch bonnet;Piment antillais;fl
sea bass fillets;Filets de bar;po
sea salt;Sel de mer;es*
seafood stock;Fumet de poisson;es
seasoned rice vinegar;Vinaigre de riz;mo
seasoning;Assaisonnement;es*
seeds;Graines (mélange);ep
self-raising flour;Farine à gâteaux;su
semi-skimmed milk;Lait demi-écrémé;cr
semolina;Semoule fine;ep
semolina flour;Semoule fine;ep
serrano ham;Jambon serrano;ch
sesame seed;Graines de sésame;mo
sesame seed burger buns;Pains burger;bl
sesame seed oil;Huile de sésame;mo
shallots;Échalotes;fl
shaoxing wine;Vin de Shaoxing;mo
shelled hazelnuts;Noisettes;su
sherry;Xérès;bs
sherry vinegar;Vinaigre de Xérès;sa*
shiitake mushrooms;Champignons shiitaké;fl
shortcrust pastry;Pâte brisée;ch
shortening;Graisse végétale;ep
shredded meat;Bœuf effiloché;bo
shredded mexican cheese;Fromage râpé;fr
shredded monterey jack cheese;Cheddar râpé;fr
shrimp;Crevettes;po
shrimp paste;Pâte de crevettes;mo
shrimp stock;Fumet de crustacés;es
sichuan pepper;Poivre de Sichuan;mo
silken tofu;Tofu soyeux;ch
single cream;Crème liquide légère;cr
sirloin steak;Faux-filet;bo
sirloin steak tips;Faux-filet;bo
sirop de liège;Sirop de Liège;su
skirty steak;Onglet / hampe;bo
small potatoes;Pommes de terre grenaille;fl
smoked haddock;Haddock fumé;po
smoked ham;Jambon fumé;ch
smoked paprika;Paprika fumé;es
smoky aïoli;Aïoli;sa
smoky paprika;Paprika fumé;es
snow peas;Pois gourmands;fl
soda water;Eau gazeuse;bs
sorrel jam;Confiture d'oseille;mo
sour cream;Crème fraîche épaisse;cr
sour pork sausage;Saucisse de porc;ch
soured cream and chive dip;Sauce crème-ciboulette;ch
soy sauce;Sauce soja;sa*
soya bean;Edamame / soja;sg
soya milk;Lait de soja;cr
spaghetti;Spaghetti;ep
spinach;Épinards frais;fl
spring onions;Oignons nouveaux;fl
squash;Courge;fl
squid;Calamars;po
sriracha;Sriracha;mo
stale bread;Pain rassis;bl
star anise;Anis étoilé;es
starch;Maïzena;su*
sticky rice flour;Farine de riz gluant;mo
stilton cheese;Bleu (stilton / fourme);fr
stir-fry vegetables;Légumes pour wok;sg
stout;Bière brune;bs
strained yoghurt;Yaourt à la grecque;cr
streaky bacon;Poitrine fumée;ch
strong white bread flour;Farine à pain T65;su
strong wholemeal flour;Farine complète;su
suet;Graisse de bœuf;bo
sugar;Sucre en poudre;su*
sugar snap peas;Pois gourmands;fl
sumac;Sumac;mo
summer savoury;Sarriette;es
sun-dried tomatoes;Tomates séchées;ep
sunflower oil;Huile de tournesol;sa*
sushi rice;Riz à sushi;mo
swede;Rutabaga;fl
sweet chilli sauce;Sauce chili douce;mo
sweet peppadew peppers;Piments doux (bocal);ep
sweet potatoes;Patates douces;fl
sweet red peppers;Poivrons rouges;fl
sweet smoked paprika;Paprika fumé doux;es
sweetcorn;Maïs (boîte);ep
swiss cheese;Emmental;fr
szechuan peppercorns;Poivre de Sichuan;mo
tabasco sauce;Tabasco;sa
tagliatelle;Tagliatelles;ep
tahini;Tahin (crème de sésame);mo
tahini paste;Tahin (crème de sésame);mo
tamarind ball;Tamarin;mo
tamarind paste;Pâte de tamarin;mo
tapioca;Tapioca;su
taro;Taro;mo
tarragon leaves;Estragon frais;fl
tempeh;Tempeh;ch
tempura flour;Farine à tempura;mo
thai chilli jam;Confit de piment thaï;mo
thai fish sauce;Sauce nuoc-mâm;mo
thai green curry paste;Pâte de curry vert;mo
thai red curry paste;Pâte de curry rouge;mo
thyme;Thym;es*
tiger prawns;Crevettes tigrées;po
tinned tomatos;Tomates pelées (boîte);ep
toast;Pain de mie;bl
tobasco sauce;Tabasco;sa
tofu;Tofu ferme;ch
tomato;Tomates;fl
tomato ketchup;Ketchup;sa
tomato puree;Concentré de tomate;ep
tomato purée;Concentré de tomate;ep
tomato sauce;Sauce tomate;ep
tomatoes;Tomates;fl
toor dal;Lentilles toor dal;mo
tortellini;Tortellini;ch
tortillas;Tortillas de blé;mo
trout;Truite;po
truffle oil;Huile de truffe;sa
tuna;Thon;po
turkey;Dinde;bo
turkey ham;Jambon de dinde;ch
turkey mince;Dinde hachée;bo
turmeric;Curcuma;es
turmeric powder;Curcuma;es
turnips;Navets;fl
udon noodles;Nouilles udon;mo
unsalted beef stock;Bouillon de bœuf;es
unsalted butter;Beurre doux;cr
unsalted peanuts;Cacahuètes non salées;ep
unsweetened coconut milk;Lait de coco;mo
vanilla;Vanille;su
vanilla extract;Extrait de vanille;su
vanilla pod;Gousse de vanille;su
veal;Veau;bo
vegan butter;Margarine végétale;cr
vegan white wine vinegar;Vinaigre de vin blanc;sa*
vegetable oil;Huile de tournesol;sa*
vegetable stock;Bouillon de légumes;es
vegetable stock cube;Bouillon de légumes (cubes);es
vegetables;Légumes variés;fl
vermicelli pasta;Vermicelles;ep
vermicelli rice noodles;Vermicelles de riz;mo
vinaigrette dressing;Vinaigrette;sa
vine leaves;Feuilles de vigne;mo
vine tomatoes;Tomates en grappe;fl
vinegar;Vinaigre blanc;sa*
västerbottensost cheese;Comté affiné;fr
walnuts;Cerneaux de noix;su
warm water;Eau;-
water;Eau;-
water chestnut;Châtaignes d'eau;mo
whipping cream;Crème entière liquide;cr
white asparagus;Asperges blanches;fl
white bread;Pain de mie;bl
white bread mix;Préparation pain blanc;su
white cabbage;Chou blanc;fl
white fish;Filets de poisson blanc;po
white fish fillets;Filets de poisson blanc;po
white sauerkraut;Choucroute;ch
white vinegar;Vinaigre blanc;sa*
white wine;Vin blanc;bs
white wine vinegar;Vinaigre de vin blanc;sa*
white yam;Igname;mo
whole black peppercorns;Poivre en grains;es*
whole milk;Lait entier;cr
whole wheat;Blé complet;ep
wholegrain bread;Pain complet;bl
wholegrain mustard;Moutarde à l'ancienne;sa
wild garlic leaves;Ail des ours;fl
wild mushrooms;Champignons des bois;fl
wonton skin;Feuilles à wonton;mo
wood ear mushrooms;Champignons noirs séchés;mo
worcestershire sauce;Sauce Worcestershire;sa
yautia;Malanga;mo
yeast;Levure de boulanger;su
yellow masarepa;Farine de maïs précuite;mo
yellow pepper;Poivron jaune;fl
yellow split peas;Pois cassés;ep
yogurt;Yaourt nature;cr
yuca;Manioc;mo
zapallo squash;Courge;fl
zucchini;Courgettes;fl
`;

const ING_FR = {};
INGREDIENTS_FR_RAW.trim().split('\n').forEach(line => {
  const [en, fr, code] = line.split(';');
  ING_FR[en] = { fr, rayon: code.replace('*', ''), pantry: code.endsWith('*') || code === '-', skip: code === '-' };
});
