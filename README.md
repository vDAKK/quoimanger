# QuoiManger

Menu de la semaine personnalisé, façon HelloFresh, à partir de la base gratuite [TheMealDB](https://www.themealdb.com) (~790 plats).

## Lancer

Ouvrir `index.html` dans un navigateur. Aucune installation.

Sur téléphone (même Wi-Fi) : lancer `python -m http.server 8080 --bind 0.0.0.0` dans ce dossier, puis ouvrir `http://<IP-du-PC>:8080` sur le téléphone et faire « Ajouter à l'écran d'accueil ».
Pour une vraie PWA installable et utilisable hors-ligne (service worker), héberger le dossier en HTTPS (GitHub Pages, Netlify…).

## Fonctionnement

1. **Chargement** : les ~790 plats sont téléchargés depuis l'API TheMealDB (26 requêtes, une par lettre), puis mis en cache 7 jours dans le navigateur. Sans réseau, l'app utilise la copie locale `js/meals-snapshot.js`.
2. **Enrichissement** (`js/engine.js`) : pour chaque plat, l'app déduit de ses ingrédients et de ses instructions le temps estimé, les protéines, les allergènes, le type de plat, les saveurs (herbes, fromage, sucré, épicé, pimenté), le côté léger ou riche, les glucides, le coût et le côté « familial ».
3. **Questionnaire** (11 étapes) : objectifs, envie, profil alimentaire, ingrédients à éviter, nutrition, cuisines, saveurs, protéines, types de plats, nombre de soirs et de portions.
4. **Scoring** : les allergènes, le régime et tous les « pas pour moi » (cuisines, saveurs, types de plats, protéines) excluent un plat ; s'il reste moins de 30 plats, les plats exclus reviennent avec un fort malus et un message le signale. « Recettes rapides » impose une durée maximale par repas (25 min, élargie par paliers si besoin). Tout le reste ajoute ou retire des points. Le menu est ensuite tiré en variant les cuisines, les protéines et les types de plats. Avec l'objectif anti-gaspi, les plats qui partagent des ingrédients sont favorisés.
   **Courses optimisées** (activé par défaut) : chaque produit acheté coûte des points ; l'optimiseur (glouton + amélioration locale, plusieurs essais, évaluation incrémentale) choisit les plats qui partagent leurs ingrédients. Les ingrédients interchangeables (`ALT_FAMILIES` dans `js/data.js` : oignon / échalote, crème fraîche / liquide, coupes de poulet…) comptent pour un seul achat. Résultat : environ 50 % d'ingrédients différents en moins.
   **Midis** : option du questionnaire ou bouton « Ajouter les midis » ; le midi favorise les plats rapides et légers. Chaque repas a ses portions et peut être exclu (« je ne mange pas ce repas ») via le bouton 👤 : il sort alors de la liste de courses.
   **Alternatives** : bouton ↔ sur un ingrédient de la fiche recette pour choisir un produit de remplacement ; la liste de courses suit et regroupe les alternatives sur une ligne (« ou : … »).
5. **Courses** (magasin au choix, Intermarché Bourg-en-Bresse par défaut) : tout est traduit en français et converti en g, ml et cuillères. Les quantités sont cumulées entre recettes et classées dans l'ordre des rayons d'un parcours Intermarché type (ordre et magasin modifiables). Les basiques de placard sont mis à part, et une loupe ouvre la recherche du produit sur intermarche.com.
   **Budget** : coût estimé par part (`js/prices.js` : prix moyens en supermarché par kg / litre / pièce) affiché sur les fiches, la semaine et les courses. Le budget choisi (≤ 2,50 / 4 / 6 € par part) pénalise les plats plus chers et écarte ceux qui le dépassent de plus de 50 % ; il cède avant les préférences « pas pour moi » si le choix devient trop maigre.
   **Mode cuisine** : bouton « Cuisiner » de la fiche recette : une étape à la fois en grand, ingrédients à portée de main, minuteurs proposés quand l'étape cite une durée (alerte sonore et vibration), écran maintenu allumé.
   **Choix du magasin** : « Changer de magasin » cherche les supermarchés autour d'une ville / d'un code postal ou de la position (OpenStreetMap : Nominatim + Overpass). L'enseigne choisie configure la recherche produit (loupe) et le lien drive ; le drive est « disponible » quand un point drive de l'enseigne est référencé à moins de 3 km, « probable » sinon pour les enseignes qui en proposent.
   **Indisponible au magasin** : le bouton barré d'un article le remplace par une alternative de la même famille, sinon change les recettes qui l'utilisent ; les plats proposés ensuite évitent ce produit pour la semaine. (Remplir automatiquement le caddie drive n'est pas possible : Intermarché n'a pas d'API publique et son site bloque les robots.)
   Les repas passés (jours précédents, et le midi du jour à partir de 15 h) sont masqués de la liste de courses.
6. **Apprentissage** : 👍 favorise un plat, 👎 l'exclut définitivement.

## Langues

Français, English, 中文 : détection automatique selon le téléphone, changement via le bouton 🌐 (choix propre à chaque appareil, les données du foyer restent communes). Les noms des recettes sont traduits dans `js/recipe-names.js`. Les instructions (et les noms des recettes ajoutées ensuite à l'API) sont traduites à la volée via Google Traduction à l'ouverture, puis gardées en cache sur l'appareil ; à défaut, un lien ouvre la traduction.

## Fichiers

- `js/ingredients-fr.js` : 810 ingrédients → nom français + rayon
- `js/shop.js` : conversion des mesures, liste de courses par rayon
- `js/recipe-names.js` : noms des recettes en français et en chinois
- `js/i18n.js` : textes de l'interface en FR / EN / 中文
- `js/ingredients-zh.js` : noms chinois des ingrédients
- `js/data.js` : options du questionnaire, mots-clés de détection, traductions FR des ingrédients
- `js/engine.js` : chargement, enrichissement, scoring, menu, liste de courses
- `js/app.js` : interface
- `js/meals-snapshot.js` : copie locale de secours de la base

## Foyer partagé

Les règles Firestore autorisent le champ `week` (midis, portions et exclusions par repas, alternatives choisies) : recoller `firestore.rules` dans la console Firebase après mise à jour.
