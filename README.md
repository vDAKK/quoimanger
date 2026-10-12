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
4. **Scoring** : les allergènes, le régime et les protéines refusées excluent un plat. Tout le reste ajoute ou retire des points. Le menu est ensuite tiré en variant les cuisines, les protéines et les types de plats. Avec l'objectif anti-gaspi, les plats qui partagent des ingrédients sont favorisés.
5. **Courses (Intermarché Bourg-en-Bresse)** : tout est traduit en français et converti en g, ml et cuillères. Les quantités sont cumulées entre recettes et classées dans l'ordre des rayons d'un parcours Intermarché type (ordre et magasin modifiables). Les basiques de placard sont mis à part, et une loupe ouvre la recherche du produit sur intermarche.com.
6. **Apprentissage** : 👍 favorise un plat, 👎 l'exclut définitivement.

## Fichiers

- `js/ingredients-fr.js` : 810 ingrédients → nom français + rayon
- `js/shop.js` : conversion des mesures, liste de courses par rayon
- `js/data.js` : options du questionnaire, mots-clés de détection, traductions FR des ingrédients
- `js/engine.js` : chargement, enrichissement, scoring, menu, liste de courses
- `js/app.js` : interface
- `js/meals-snapshot.js` : copie locale de secours de la base
