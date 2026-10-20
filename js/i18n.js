// Traductions FR / EN / 中文. La langue est propre à chaque appareil (non synchronisée avec le foyer).

const LANGS = [
  { id: 'fr', label: 'Français', short: 'FR', locale: 'fr-FR', translate: 'fr' },
  { id: 'en', label: 'English', short: 'EN', locale: 'en-GB', translate: null },
  { id: 'zh', label: '中文', short: '中文', locale: 'zh-CN', translate: 'zh-CN' },
];

function detectLang() {
  const saved = store.get('qm_lang', null);
  if (LANGS.some(l => l.id === saved)) return saved;
  const nav = (navigator.language || 'fr').toLowerCase();
  return nav.startsWith('zh') ? 'zh' : nav.startsWith('fr') ? 'fr' : 'en';
}
let LANG = detectLang();
const langInfo = () => LANGS.find(l => l.id === LANG);
document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : LANG;

const pl = (n, one, many) => (n > 1 ? many : one);

const STR = {
  fr: {
    have_household: 'Déjà utilisé sur un autre appareil ?', have_household_sub: 'Entrez le code du foyer (Profil → Foyer partagé sur l’autre appareil) pour retrouver le même menu sans refaire le questionnaire.',
    multi_device: 'Utiliser l’app sur plusieurs téléphones', multi_device_sub: 'Créez un foyer partagé pour avoir le même menu et la même liste partout.',
    stat_ingr: v => `<b>${v.n}</b> ingrédients`, opt_title: 'Courses optimisées',
    opt_saving: v => `${v.n} ingrédients à acheter au lieu de ~${v.b} : les recettes de la semaine partagent leurs ingrédients.`,
    opt_n: v => `${v.n} ingrédients à acheter : les recettes de la semaine partagent un maximum d’ingrédients.`,
    opt_off: 'Désactivé : les recettes sont choisies sans chercher à partager les ingrédients.',
    plan_recomputed: 'Menu recalculé', shared_n: v => `${v.n} en commun`, shared_title: 'Aussi utilisé dans une autre recette de la semaine',
    budget_title: 'Budget', budget_q: 'Budget par portion', budget_tight: 'Petit budget', budget_medium: 'Budget moyen', budget_comfy: 'Confort', budget_none: 'Sans limite',
    budget_avg: v => `${v.p} par part en moyenne`, budget_target: v => `objectif ≤ ${v.m} par part (≈ ${v.w} la semaine)`,
    budget_over: v => `${v.n} ${pl(v.n, 'plat dépasse', 'plats dépassent')} le budget : touchez pour l’ajuster`, per_part: v => `${v.p}/part`,
    price_note: 'Prix estimés à partir de prix moyens en supermarché : un ordre de grandeur, pas un ticket de caisse.',
    cook: 'Cuisiner', cook_step: v => `Étape ${v.i} / ${v.n}`, prev_step: 'Précédente', next_step: 'Étape suivante', cook_done: 'Terminé',
    cook_bravo: 'Bon appétit !', start_timer: v => `Minuteur ${v.t}`, timer_label: v => `Étape ${v.s} · ${v.t}`, timer_over: 'Terminé',
    timer_stop: 'Arrêter le minuteur', timer_ended: v => `Minuteur terminé : ${v.l}`,
    shop_note_search: v => `La loupe cherche le produit sur ${v.s}.`, search_on: v => `Chercher sur ${v.s}`,
    store_find_title: 'Choisir mon magasin', store_find_ph: 'Ville ou code postal', near_me: 'Autour de moi', locating: 'Localisation…',
    searching_stores: 'Recherche des supermarchés…', no_store: 'Aucun supermarché trouvé dans les 8 km.', store_err: 'Recherche impossible pour le moment, réessayez.',
    place_unknown: 'Ville ou code postal introuvable.', geo_denied: 'Localisation indisponible : tapez une ville ou un code postal.',
    drive_found: 'Drive disponible', drive_likely: 'Drive proposé par l’enseigne (à confirmer pour ce magasin)', drive_likely_short: 'Drive probable',
    drive_none: 'Pas de drive pour cette enseigne', drive_unknown: 'Drive inconnu', drive_btn: v => `Drive ${v.c}`, change_store: 'Changer de magasin',
    store_chosen: 'Magasin choisi', store_chosen_drive: v => `Magasin choisi : drive ${v.c} configuré`, osm_credit: 'Magasins : © contributeurs OpenStreetMap.',
    too_strict: v => `Seulement ${v.n} plats respectent toutes vos préférences « pas pour moi » : quelques plats en enfreignent une. Assouplissez le profil pour plus de choix.`,
    quick_relaxed: v => `Pas assez de recettes de moins de 25 min avec vos goûts : certains plats vont jusqu’à ${v.n} min.`,
    unavailable: 'Indisponible au magasin', unavail_confirm: v => `${v.x} est introuvable ? On le remplace par une alternative, ou on change les recettes qui l’utilisent.`,
    unavail_alt: v => `${v.x} indisponible : remplacé par ${v.y}`, unavail_swap: v => `${v.n} ${pl(v.n, 'recette changée', 'recettes changées')}`,
    unavail_none: 'Pas de recette de remplacement trouvée', unavail_list: v => `Indisponibles : ${v.l}`, reset: 'Réinitialiser',
    today_lunch: 'Ce midi', day_lunch: v => `${v.d} midi`, day_dinner: v => `${v.d} soir`, lunch: 'Midi', dinner: 'Soir',
    pick_title: 'Ajouter au menu', pick_sub: 'Choisissez le jour et le repas', pick_now: v => `Au menu : ${v.s}`, pick_day: 'Quel jour ?', pick_meal: 'Quel repas ?',
    pick_free: 'Ce repas est libre.', pick_replace: v => `Remplace : ${v.x}`, pick_swap: v => `Échange de place avec : ${v.x}`, pick_same: 'Le plat est déjà prévu à ce repas.',
    pick_lunch_on: 'Les midis seront ajoutés au menu.', placed: v => `Ajouté : ${v.s}`, cat_side: 'Entrées & accomp.', cat_breakfast: 'Petit-déj', cat_dessert: 'Desserts',
    lunch_too: 'Repas du midi aussi ?', no: 'Non', yes_lunch: 'Oui, midi et soir', portions_per_lunch: 'Portions par déjeuner',
    stat_lunches: v => `<b>${v.n}</b> ${pl(v.n, 'déjeuner', 'déjeuners')}`, add_meals: v => `Compléter (${v.n} repas)`,
    add_lunches: 'Ajouter les midis', remove_lunches: 'Retirer les midis', lunches_added: 'Midis ajoutés au menu', lunches_removed: 'Midis retirés du menu',
    slot_settings: 'Portions et options du repas', slot_off_short: 'Je ne mange pas ce repas · retiré des courses',
    portions_hint: 'Les quantités des courses suivent', slot_eat: 'Je mange ce repas',
    slot_on_sub: 'Décochez si vous ne mangez pas ici ce jour-là : la recette sort de la liste de courses.',
    slot_off_sub: 'Exclu : la recette ne compte plus dans la liste de courses.', slot_removed: 'Repas exclu des courses', slot_restored: 'Repas remis au menu',
    or_alts: v => `ou : ${v.a}`, past_hidden: v => `${v.n} ${pl(v.n, 'repas passé masqué', 'repas passés masqués')} de la liste`,
    past_shown: v => `${v.n} ${pl(v.n, 'repas passé affiché', 'repas passés affichés')}`, hide: 'Masquer', show: 'Afficher',
    n_meals: v => `${v.n} repas`, week_lunch_value: v => `+ midis · ${v.p} pers.`,
    instead_of: v => `au lieu de : ${v.x}`, buy_as: v => `dans les courses : ${v.x}`, photo: 'Photo', disliked_minor: 'vous n’aimez pas : un peu seulement, facultatif', alternatives: 'Alternatives', replace_with: 'Remplacer par :',
    alt_hint: 'Le bouton à droite d’un ingrédient propose des alternatives : la liste de courses suit.',
    nav_menu: 'Semaine', nav_recipes: 'Recettes', nav_shop: 'Courses', nav_profile: 'Profil',
    loading_title: 'On prépare la cuisine…', loading_msg: 'Récupération de la base de plats TheMealDB',
    loading_count: v => `${v.n} plats récupérés (${v.d}/${v.t})`, api_fallback: 'API injoignable : copie locale utilisée',
    load_error: 'Impossible de charger la base de plats', retry: 'Réessayer',
    sync_updated: 'Menu mis à jour depuis l’autre téléphone', household_pill: 'Foyer',
    st_online: '● Synchronisé', st_offline: '● Hors connexion — synchro au retour du réseau', st_connecting: '● Connexion…', st_error: '● Erreur de synchronisation',
    pill_online: 'Foyer synchronisé', pill_offline: 'Hors connexion : synchro au retour du réseau', pill_connecting: 'Connexion…', pill_error: 'Erreur de synchronisation',
    join_confirm: 'Rejoindre ce foyer ? Vos préférences et votre menu seront remplacés par ceux du foyer partagé.',
    joining: 'Connexion au foyer…', joined_ok: 'Foyer rejoint : vous partagez maintenant les mêmes données', join_fail: 'Impossible de rejoindre le foyer',
    code_invalid: 'Code invalide (format XXXXX-XXXXX)', code_unknown: 'Aucun foyer avec ce code',
    like: 'J’aime', dislike: 'Pas pour moi',
    s1_title: 'Quels sont vos objectifs ?', s1_sub: 'Choisissez jusqu’à 3 objectifs.',
    s2_title: 'Ça tombe bien, on a ce qu’il faut.', s2_db_title: v => `${v.n} plats du monde entier.`, s2_db_desc: 'Récupérés en direct depuis la base TheMealDB, et triés rien que pour vous.',
    s3_title: 'Qu’est-ce qui vous fait envie ?', s4_title: 'Quel est votre profil alimentaire ?',
    s5_title: 'Des ingrédients à éviter ?', s5_sub: 'Vous pouvez passer cette section si vous ne voulez pas y répondre.', skip: 'Passer',
    s6_title: 'Des préférences côté nutrition ?', s6_sub: 'Facultatif — plusieurs choix possibles.',
    s7_title: 'Vos cuisines préférées ?', s8_title: 'Des saveurs qui vous font craquer ?', s9_title: 'Quelles protéines vous font envie ?',
    s10_title: 'À quoi ressemble votre dîner idéal ?', s11_title: 'Combien de soirs par semaine ?',
    portions_per_dinner: 'Portions par dîner', dinners_per_week: 'Dîners par semaine',
    cancel: 'Annuler', back: 'Retour', next: 'Continuer', see_menu: 'Voir mon menu',
    n_match: v => `${v.n} plats correspondent à votre profil`, max_choices: v => `${v.n} choix maximum`,
    hello_evening: 'Bonsoir', hello_morning: 'Bonjour', hello_afternoon: 'Bon après-midi', your_week: 'Votre semaine',
    stat_dinners: v => `<b>${v.n}</b> ${pl(v.n, 'dîner', 'dîners')}`, stat_people: v => `<b>${v.n}</b> pers.`, stat_time: v => `<b>${v.t}</b> en cuisine`,
    tonight: 'Ce soir', tomorrow: 'Demain', see_recipe: 'Voir la recette', change: 'Changer', change_dish: 'Changer ce plat',
    no_dinner_title: 'Aucun dîner prévu', no_dinner_sub: 'Générez une semaine ou ajoutez des recettes depuis l’onglet Recettes.',
    on_menu: 'Au menu cette semaine', shop_list: 'Liste de courses',
    items_to_buy: v => `${v.n} ${pl(v.n, 'article', 'articles')} à acheter pour ${v.r} recettes`, all_in_cart: 'Tout est dans le caddie ',
    add_dinners: v => `Ajouter ${v.n} dîner(s)`, new_week: 'Nouvelle semaine', browse_recipes: 'Parcourir les recettes',
    menu_hint: 'Touchez un plat pour voir la recette, et le bouton portions pour l’ajuster, l’exclure ou en changer.',
    recipes_for_you: v => `${v.n} recettes pour vous`, recipes_title: 'Recettes', search_ph: 'Plat, ingrédient : poulet, curry, feta…',
    quick: 'Rapide', veggie: 'Végé', all: 'Toutes', result_count: v => `${v.n} recettes · triées selon vos goûts`,
    more_recipes: 'Voir plus de recettes', no_recipe_title: 'Aucune recette', no_recipe_sub: 'Essayez un autre mot ou retirez un filtre.',
    in_week: 'Déjà dans ma semaine', add_week: 'Ajouter à ma semaine',
    shop_title: 'Courses', in_cart: v => `<b>${v.d}/${v.t}</b> dans le caddie`, for_recipes: 'Pour ces recettes', for_recipes_hint: '— touchez-en une pour filtrer',
    all_short: 'Tout', only_of: v => `Uniquement les ingrédients de <b>${v.name}</b> — voir la recette`,
    by_aisle: 'Par rayon', by_recipe: 'Par recette', recipe_word: 'Recette', pantry_title: 'À vérifier dans vos placards',
    pantry_sub: 'Basiques souvent déjà à la maison. Cochez ce que vous avez.', share_list: 'Partager la liste',
    keep_awake: 'Garder l’écran allumé', awake_on: 'Écran maintenu allumé', uncheck_all: 'Tout décocher',
    itinerary: 'Itinéraire', drive: 'Drive', store_settings: 'Magasin & rayons',
    nothing_to_buy: 'Rien à acheter', nothing_to_buy_sub: 'Ajoutez des dîners à votre semaine pour générer la liste.',
    shop_note: v => `Quantités en g / ml pour ${v.p} pers., cumulées entre recettes. Rayons dans l’ordre d’un parcours de supermarché type (modifiable).`,
    n_recipes: v => `${v.n} recettes`, as_needed: 'selon besoin', search_store: 'Chercher sur intermarche.com',
    list_title: 'Liste de courses', pantry_check: 'À VÉRIFIER DANS LES PLACARDS',
    wake_off: 'Mise en veille réactivée', wake_unavailable: 'Non disponible sur ce navigateur (nécessite HTTPS)', wake_on: 'L’écran restera allumé pendant vos courses', wake_fail: 'Impossible de garder l’écran allumé',
    store_settings_title: 'Magasin & rayons', store_name: 'Nom du magasin', address: 'Adresse', aisle_order: 'Ordre des rayons',
    aisle_order_sub: 'Classez les rayons dans l’ordre où vous les croisez dans votre magasin.', save: 'Enregistrer', reset_default: 'Revenir au parcours par défaut',
    store_saved: 'Magasin enregistré', default_restored: 'Parcours par défaut rétabli', up: 'Monter', down: 'Descendre', less: 'Moins', more: 'Plus',
    your_tastes: 'Vos goûts', profile_title: 'Profil', redo_quiz: 'Refaire le questionnaire', redo_quiz_sub: 'Vos réponses actuelles sont pré-remplies',
    row_objectives: 'Objectifs', row_craving: 'Envie', row_diet: 'Profil alimentaire', row_avoid: 'À éviter', row_nutrition: 'Nutrition',
    row_cuisines: 'Cuisines', row_flavours: 'Saveurs', row_proteins: 'Protéines', row_dishes: 'Plats', row_week: 'Semaine', row_rated: 'Plats notés', row_lang: 'Langue',
    week_value: v => `${v.n} dîners · ${v.p} pers.`, rated_value: v => `${v.l} aimés · ${v.d} écartés`,
    reset_feedback: 'Effacer mes notes de plats', refresh_db: 'Mettre à jour la base', reset_all: 'Tout réinitialiser',
    base_note: v => `Base : ${v.n} plats, ${v.src}`, src_api: 'téléchargée depuis TheMealDB', src_cache: 'en cache (TheMealDB)', src_snapshot: 'copie locale de secours',
    household: 'Foyer partagé', sync_off: 'Synchronisation pas encore configurée', sync_off_sub: 'Une fois Firebase configuré, vous pourrez partager menu et courses avec un autre téléphone.',
    share_household: 'Partager avec mon foyer', share_household_sub: 'Même menu, mêmes courses, sur plusieurs téléphones',
    create_household: 'Créer un foyer partagé', join: 'Rejoindre', household_code: 'Code du foyer', invite_phone: 'Inviter l’autre téléphone',
    household_help: 'L’autre personne ouvre le lien reçu (ou saisit le code dans Profil) : vous partagez alors préférences, menu, notes et liste de courses en temps réel.',
    leave_household: 'Quitter le foyer', household_created: 'Foyer créé ! Invitez l’autre téléphone', create_fail: 'Création impossible : vérifiez la connexion',
    enter_code: 'Entrez le code du foyer', invite_text: v => `Rejoins notre foyer sur QuoiManger pour partager le menu et la liste de courses : ${v.link} (code : ${v.code})`,
    invite_copied: 'Lien d’invitation copié', leave_confirm: 'Quitter le foyer partagé ? Les données restent sur ce téléphone mais ne seront plus synchronisées.',
    reset_feedback_confirm: 'Effacer tous les plats aimés / écartés ?', feedback_cleared: 'Notes effacées', reset_all_confirm: 'Supprimer vos préférences, votre menu et vos notes ?',
    f_time: 'Temps', f_cuisine: 'Cuisine', f_ingredients: 'Ingrédients', f_portions: 'Portions', for_you: 'Pour vous :',
    tab_ingr: 'Ingrédients', tab_steps: v => `Préparation · ${v.n} étapes`, ingr_for: v => `pour ${v.n} pers.`, prep: 'Préparation',
    in_english: 'en anglais', translate: 'traduire', tap_step: 'Touchez une étape pour la cocher.', in_my_week: 'Dans ma semaine', add_to_week: 'Ajouter à ma semaine', video: 'Vidéo',
    no_alternative: 'Plus d’alternative disponible', new_week_toast: 'Nouvelle semaine générée', new_dish: 'Nouveau plat proposé',
    added_to_week: v => `Ajouté à votre semaine (${v.day})`, disliked: 'Noté : on ne vous le proposera plus', list_copied: 'Liste copiée', copy_fail: 'Copie impossible dans ce navigateur',
    tag_veg: 'Végé', tag_hot: 'Pimenté', tag_light: 'Léger', tag_overnight: 'Prévoir la veille',
    language: 'Langue', other: 'Autre', vegetables: 'Légumes',
    r_ready: v => `Prêt en ~${v.n} min`, r_chef: 'Recette digne d’un resto', r_family: 'Parfait pour toute la famille', r_nomeat: 'Recette sans viande',
    r_seafood: 'Poisson & fruits de mer', r_light: 'Léger (Calorie Smart)', r_lowcarb: 'Pauvre en glucides', r_protein: 'Riche en protéines',
    r_veg: v => `${v.n} légumes`, r_cuisine: v => `Cuisine ${v.c.toLowerCase()}`, r_budget: 'Petit budget', r_time: 'Gain de temps', r_few: v => `Seulement ${v.n} ingrédients`, r_liked: 'Vous avez aimé ce plat',
    kcal: v => `${v.n} kcal`, kcal_title: 'Calories estimées par portion',
    b_hot: 'Pimenté', b_spiced: 'Épicé', b_sweet: 'Sucré', b_cheese: 'Fromage', b_veg: 'Végé', b_quick: 'Rapide', b_fav: 'Favori',
    tab_fav: 'Favoris', tab_forme: 'Pour moi', tab_all: 'Toute la base', tab_fridge: 'Mon frigo',
    fav_add: 'Favori', fav_added: 'Ajouté aux favoris', fav_removed: 'Retiré des favoris',
    no_fav_title: 'Pas encore de favoris', no_fav_sub: 'Touchez le cœur d’une recette pour la retrouver ici.', see_for_me: 'Voir les recettes pour moi', see_all: 'Parcourir toute la base',
    all_count: v => `${v.n} recettes dans la base · les plus adaptées à vos goûts en premier`, fav_count: v => `${v.n} favori${v.n > 1 ? 's' : ''}`, out_of_taste: 'Hors de vos goûts',
    f_light: 'Léger', f_mild: 'Pas pimenté', f_cheap: 'Petit budget', no_ingr_btn: v => (v.n ? `Sans… (${v.n})` : 'Sans…'),
    no_ingr_title: 'Ingrédients que je n’aime pas', no_ingr_sub: 'Les plats dont c’est un ingrédient principal ne vous seront plus proposés. Un peu en garniture reste possible.',
    no_ingr_search: 'Autre ingrédient : fenouil, câpres…', no_ingr_saved: v => (v.n ? `Préférences enregistrées · ${v.n} plat(s) remplacé(s) dans la semaine` : 'Préférences enregistrées'),
    row_no_ingr: 'Je n’aime pas', s5_no_ingr: 'Et les ingrédients que vous n’aimez pas ?', no_ingr_edit: 'Choisir les ingrédients que je n’aime pas',
    fridge_sub: 'Ajoutez ce que vous avez sous la main : on propose les plats qui demandent le moins de courses.',
    fridge_ph: 'Ajouter : poulet, courgette, riz…', fridge_clear: 'Vider le frigo', fridge_have: v => `${v.h}/${v.t} ingrédients`, fridge_all: 'Vous avez tout !',
    fridge_missing: v => `Manque : ${v.l}`, fridge_none_title: 'Votre frigo est vide', fridge_none_sub: 'Ajoutez quelques ingrédients pour voir ce que vous pouvez cuisiner.',
    fridge_basics: 'Sel, huile, sucre, farine, épices courantes… sont considérés comme déjà dans vos placards.',
  },

  en: {
    have_household: 'Already using it on another device?', have_household_sub: 'Enter the household code (Profile → Shared household on the other device) to get the same menu without redoing the questionnaire.',
    multi_device: 'Use the app on several phones', multi_device_sub: 'Create a shared household to get the same menu and list everywhere.',
    stat_ingr: v => `<b>${v.n}</b> ingredients`, opt_title: 'Smart shopping',
    opt_saving: v => `${v.n} ingredients to buy instead of ~${v.b}: this week’s recipes share their ingredients.`,
    opt_n: v => `${v.n} ingredients to buy: this week’s recipes share as many ingredients as possible.`,
    opt_off: 'Off: recipes are chosen without trying to share ingredients.',
    plan_recomputed: 'Menu recalculated', shared_n: v => `${v.n} shared`, shared_title: 'Also used in another recipe this week',
    budget_title: 'Budget', budget_q: 'Budget per serving', budget_tight: 'Tight budget', budget_medium: 'Medium budget', budget_comfy: 'Comfortable', budget_none: 'No limit',
    budget_avg: v => `${v.p} per serving on average`, budget_target: v => `target ≤ ${v.m} per serving (≈ ${v.w} for the week)`,
    budget_over: v => `${v.n} ${pl(v.n, 'dish is', 'dishes are')} over budget: tap to adjust`, per_part: v => `${v.p}/serving`,
    price_note: 'Prices are estimated from average supermarket prices: a ballpark, not a receipt.',
    cook: 'Cook', cook_step: v => `Step ${v.i} / ${v.n}`, prev_step: 'Previous', next_step: 'Next step', cook_done: 'Done',
    cook_bravo: 'Enjoy your meal!', start_timer: v => `${v.t} timer`, timer_label: v => `Step ${v.s} · ${v.t}`, timer_over: 'Done',
    timer_stop: 'Stop timer', timer_ended: v => `Timer finished: ${v.l}`,
    shop_note_search: v => `The magnifier searches the product on ${v.s}.`, search_on: v => `Search on ${v.s}`,
    store_find_title: 'Choose my store', store_find_ph: 'Town or postcode', near_me: 'Near me', locating: 'Locating…',
    searching_stores: 'Looking for supermarkets…', no_store: 'No supermarket found within 8 km.', store_err: 'Search unavailable right now, try again.',
    place_unknown: 'Town or postcode not found.', geo_denied: 'Location unavailable: type a town or postcode.',
    drive_found: 'Drive available', drive_likely: 'The chain offers drive pick-up (check for this store)', drive_likely_short: 'Drive likely',
    drive_none: 'No drive for this chain', drive_unknown: 'Drive unknown', drive_btn: v => `${v.c} drive`, change_store: 'Change store',
    store_chosen: 'Store selected', store_chosen_drive: v => `Store selected: ${v.c} drive set up`, osm_credit: 'Stores: © OpenStreetMap contributors.',
    too_strict: v => `Only ${v.n} dishes match all your “not for me” choices: a few dishes break one. Loosen your profile for more choice.`,
    quick_relaxed: v => `Not enough sub-25-minute recipes for your tastes: some dishes take up to ${v.n} min.`,
    unavailable: 'Not available in store', unavail_confirm: v => `Can’t find ${v.x}? We’ll use an alternative, or change the recipes that need it.`,
    unavail_alt: v => `${v.x} unavailable: replaced with ${v.y}`, unavail_swap: v => `${v.n} ${pl(v.n, 'recipe', 'recipes')} changed`,
    unavail_none: 'No replacement recipe found', unavail_list: v => `Unavailable: ${v.l}`, reset: 'Reset',
    today_lunch: 'Lunch today', day_lunch: v => `${v.d} lunch`, day_dinner: v => `${v.d} dinner`, lunch: 'Lunch', dinner: 'Dinner',
    pick_title: 'Add to menu', pick_sub: 'Choose the day and the meal', pick_now: v => `On the menu: ${v.s}`, pick_day: 'Which day?', pick_meal: 'Which meal?',
    pick_free: 'This meal is free.', pick_replace: v => `Replaces: ${v.x}`, pick_swap: v => `Swaps places with: ${v.x}`, pick_same: 'This dish is already planned for that meal.',
    pick_lunch_on: 'Lunches will be added to the menu.', placed: v => `Added: ${v.s}`, cat_side: 'Starters & sides', cat_breakfast: 'Breakfast', cat_dessert: 'Desserts',
    lunch_too: 'Lunches too?', no: 'No', yes_lunch: 'Yes, lunch and dinner', portions_per_lunch: 'Servings per lunch',
    stat_lunches: v => `<b>${v.n}</b> ${pl(v.n, 'lunch', 'lunches')}`, add_meals: v => `Fill in (${v.n} ${pl(v.n, 'meal', 'meals')})`,
    add_lunches: 'Add lunches', remove_lunches: 'Remove lunches', lunches_added: 'Lunches added to the menu', lunches_removed: 'Lunches removed from the menu',
    slot_settings: 'Servings and meal options', slot_off_short: 'Not eating this meal · removed from shopping',
    portions_hint: 'Shopping quantities follow', slot_eat: 'I’m eating this meal',
    slot_on_sub: 'Untick if you won’t eat here that day: the recipe leaves the shopping list.',
    slot_off_sub: 'Skipped: the recipe no longer counts in the shopping list.', slot_removed: 'Meal removed from shopping', slot_restored: 'Meal back on the menu',
    or_alts: v => `or: ${v.a}`, past_hidden: v => `${v.n} past ${pl(v.n, 'meal', 'meals')} hidden from the list`,
    past_shown: v => `${v.n} past ${pl(v.n, 'meal', 'meals')} shown`, hide: 'Hide', show: 'Show',
    n_meals: v => `${v.n} ${pl(v.n, 'meal', 'meals')}`, week_lunch_value: v => `+ lunches · ${v.p} ${pl(v.p, 'person', 'people')}`,
    instead_of: v => `instead of: ${v.x}`, buy_as: v => `on the list as: ${v.x}`, photo: 'Photo', disliked_minor: 'you don’t like it: only a little, optional', alternatives: 'Alternatives', replace_with: 'Replace with:',
    alt_hint: 'The button next to an ingredient offers alternatives: the shopping list follows.',
    nav_menu: 'Week', nav_recipes: 'Recipes', nav_shop: 'Shopping', nav_profile: 'Profile',
    loading_title: 'Getting the kitchen ready…', loading_msg: 'Fetching the TheMealDB recipe database',
    loading_count: v => `${v.n} dishes fetched (${v.d}/${v.t})`, api_fallback: 'API unreachable: using the offline copy',
    load_error: 'Could not load the recipe database', retry: 'Retry',
    sync_updated: 'Menu updated from the other phone', household_pill: 'Home',
    st_online: '● Synced', st_offline: '● Offline — will sync when back online', st_connecting: '● Connecting…', st_error: '● Sync error',
    pill_online: 'Household synced', pill_offline: 'Offline: will sync when back online', pill_connecting: 'Connecting…', pill_error: 'Sync error',
    join_confirm: 'Join this household? Your preferences and menu will be replaced by the shared household’s.',
    joining: 'Connecting to the household…', joined_ok: 'Joined: you now share the same data', join_fail: 'Could not join the household',
    code_invalid: 'Invalid code (format XXXXX-XXXXX)', code_unknown: 'No household with this code',
    like: 'Like', dislike: 'Not for me',
    s1_title: 'What are your goals?', s1_sub: 'Pick up to 3 goals.',
    s2_title: 'Good news, we’ve got you covered.', s2_db_title: v => `${v.n} dishes from around the world.`, s2_db_desc: 'Fetched live from TheMealDB and ranked just for you.',
    s3_title: 'What are you in the mood for?', s4_title: 'What’s your eating style?',
    s5_title: 'Any ingredients to avoid?', s5_sub: 'You can skip this section if you prefer.', skip: 'Skip',
    s6_title: 'Any nutrition preferences?', s6_sub: 'Optional — pick as many as you like.',
    s7_title: 'Your favourite cuisines?', s8_title: 'Which flavours do you love?', s9_title: 'Which proteins do you fancy?',
    s10_title: 'What does your ideal dinner look like?', s11_title: 'How many evenings a week?',
    portions_per_dinner: 'Servings per dinner', dinners_per_week: 'Dinners per week',
    cancel: 'Cancel', back: 'Back', next: 'Continue', see_menu: 'See my menu',
    n_match: v => `${v.n} dishes match your profile`, max_choices: v => `${v.n} choices max`,
    hello_evening: 'Good evening', hello_morning: 'Good morning', hello_afternoon: 'Good afternoon', your_week: 'Your week',
    stat_dinners: v => `<b>${v.n}</b> ${pl(v.n, 'dinner', 'dinners')}`, stat_people: v => `<b>${v.n}</b> ${pl(v.n, 'person', 'people')}`, stat_time: v => `<b>${v.t}</b> cooking`,
    tonight: 'Tonight', tomorrow: 'Tomorrow', see_recipe: 'See recipe', change: 'Swap', change_dish: 'Swap this dish',
    no_dinner_title: 'No dinners planned', no_dinner_sub: 'Generate a week or add recipes from the Recipes tab.',
    on_menu: 'On the menu this week', shop_list: 'Shopping list',
    items_to_buy: v => `${v.n} ${pl(v.n, 'item', 'items')} to buy for ${v.r} recipes`, all_in_cart: 'Everything is in the trolley ',
    add_dinners: v => `Add ${v.n} dinner(s)`, new_week: 'New week', browse_recipes: 'Browse recipes',
    menu_hint: 'Tap a dish to see the recipe, and the servings button to adjust, skip or swap it.',
    recipes_for_you: v => `${v.n} recipes for you`, recipes_title: 'Recipes', search_ph: 'Dish, ingredient: chicken, curry, feta…',
    quick: 'Quick', veggie: 'Veggie', all: 'All', result_count: v => `${v.n} recipes · sorted by your taste`,
    more_recipes: 'Show more recipes', no_recipe_title: 'No recipes', no_recipe_sub: 'Try another word or remove a filter.',
    in_week: 'Already in my week', add_week: 'Add to my week',
    shop_title: 'Shopping', in_cart: v => `<b>${v.d}/${v.t}</b> in the trolley`, for_recipes: 'For these recipes', for_recipes_hint: '— tap one to filter',
    all_short: 'All', only_of: v => `Only the ingredients of <b>${v.name}</b> — see recipe`,
    by_aisle: 'By aisle', by_recipe: 'By recipe', recipe_word: 'Recipe', pantry_title: 'Check your cupboards',
    pantry_sub: 'Basics you probably already have. Tick what you’ve got.', share_list: 'Share the list',
    keep_awake: 'Keep screen on', awake_on: 'Screen kept on', uncheck_all: 'Untick all',
    itinerary: 'Directions', drive: 'Drive', store_settings: 'Store & aisles',
    nothing_to_buy: 'Nothing to buy', nothing_to_buy_sub: 'Add dinners to your week to build the list.',
    shop_note: v => `Quantities in g / ml for ${v.p} people, combined across recipes. Aisles follow a typical supermarket layout (editable).`,
    n_recipes: v => `${v.n} recipes`, as_needed: 'as needed', search_store: 'Search on intermarche.com',
    list_title: 'Shopping list', pantry_check: 'CHECK YOUR CUPBOARDS',
    wake_off: 'Screen sleep re-enabled', wake_unavailable: 'Not available in this browser (requires HTTPS)', wake_on: 'Your screen will stay on while you shop', wake_fail: 'Could not keep the screen on',
    store_settings_title: 'Store & aisles', store_name: 'Store name', address: 'Address', aisle_order: 'Aisle order',
    aisle_order_sub: 'Order the aisles the way you walk through your store.', save: 'Save', reset_default: 'Back to the default layout',
    store_saved: 'Store saved', default_restored: 'Default layout restored', up: 'Move up', down: 'Move down', less: 'Less', more: 'More',
    your_tastes: 'Your tastes', profile_title: 'Profile', redo_quiz: 'Retake the questionnaire', redo_quiz_sub: 'Your current answers are pre-filled',
    row_objectives: 'Goals', row_craving: 'Mood', row_diet: 'Eating style', row_avoid: 'Avoid', row_nutrition: 'Nutrition',
    row_cuisines: 'Cuisines', row_flavours: 'Flavours', row_proteins: 'Proteins', row_dishes: 'Dishes', row_week: 'Week', row_rated: 'Rated dishes', row_lang: 'Language',
    week_value: v => `${v.n} dinners · ${v.p} people`, rated_value: v => `${v.l} liked · ${v.d} hidden`,
    reset_feedback: 'Clear my dish ratings', refresh_db: 'Refresh the database', reset_all: 'Reset everything',
    base_note: v => `Database: ${v.n} dishes, ${v.src}`, src_api: 'downloaded from TheMealDB', src_cache: 'cached (TheMealDB)', src_snapshot: 'offline backup copy',
    household: 'Shared household', sync_off: 'Sync not configured yet', sync_off_sub: 'Once Firebase is set up, you can share the menu and shopping list with another phone.',
    share_household: 'Share with my household', share_household_sub: 'Same menu, same shopping list, on several phones',
    create_household: 'Create a shared household', join: 'Join', household_code: 'Household code', invite_phone: 'Invite the other phone',
    household_help: 'The other person opens the link (or types the code in Profile): you then share preferences, menu, ratings and shopping list in real time.',
    leave_household: 'Leave household', household_created: 'Household created! Invite the other phone', create_fail: 'Could not create it: check your connection',
    enter_code: 'Enter the household code', invite_text: v => `Join our household on QuoiManger to share the menu and shopping list: ${v.link} (code: ${v.code})`,
    invite_copied: 'Invite link copied', leave_confirm: 'Leave the shared household? Data stays on this phone but will no longer sync.',
    reset_feedback_confirm: 'Clear all liked / hidden dishes?', feedback_cleared: 'Ratings cleared', reset_all_confirm: 'Delete your preferences, menu and ratings?',
    f_time: 'Time', f_cuisine: 'Cuisine', f_ingredients: 'Ingredients', f_portions: 'Servings', for_you: 'For you:',
    tab_ingr: 'Ingredients', tab_steps: v => `Method · ${v.n} steps`, ingr_for: v => `for ${v.n} ${pl(v.n, 'person', 'people')}`, prep: 'Method',
    in_english: '', translate: '', tap_step: 'Tap a step to tick it off.', in_my_week: 'In my week', add_to_week: 'Add to my week', video: 'Video',
    no_alternative: 'No other option available', new_week_toast: 'New week generated', new_dish: 'New dish suggested',
    added_to_week: v => `Added to your week (${v.day})`, disliked: 'Noted: we won’t suggest it again', list_copied: 'List copied', copy_fail: 'Copy not possible in this browser',
    tag_veg: 'Veggie', tag_hot: 'Spicy', tag_light: 'Light', tag_overnight: 'Prep the day before',
    language: 'Language', other: 'Other', vegetables: 'Vegetables',
    r_ready: v => `Ready in ~${v.n} min`, r_chef: 'Restaurant-worthy', r_family: 'Great for the whole family', r_nomeat: 'Meat-free',
    r_seafood: 'Fish & seafood', r_light: 'Light (Calorie Smart)', r_lowcarb: 'Low carb', r_protein: 'High protein',
    r_veg: v => `${v.n} vegetables`, r_cuisine: v => `${v.c} cuisine`, r_budget: 'Budget-friendly', r_time: 'Time-saver', r_few: v => `Only ${v.n} ingredients`, r_liked: 'You liked this dish',
    kcal: v => `${v.n} kcal`, kcal_title: 'Estimated calories per serving',
    b_hot: 'Hot', b_spiced: 'Spiced', b_sweet: 'Sweet', b_cheese: 'Cheesy', b_veg: 'Veggie', b_quick: 'Quick', b_fav: 'Favourite',
    tab_fav: 'Favourites', tab_forme: 'For me', tab_all: 'Whole database', tab_fridge: 'My fridge',
    fav_add: 'Favourite', fav_added: 'Added to favourites', fav_removed: 'Removed from favourites',
    no_fav_title: 'No favourites yet', no_fav_sub: 'Tap the heart on a recipe to find it here.', see_for_me: 'See recipes for me', see_all: 'Browse the whole database',
    all_count: v => `${v.n} recipes in the database · best matches first`, fav_count: v => `${v.n} favourite${v.n > 1 ? 's' : ''}`, out_of_taste: 'Outside your tastes',
    f_light: 'Light', f_mild: 'Not hot', f_cheap: 'Budget', no_ingr_btn: v => (v.n ? `Without… (${v.n})` : 'Without…'),
    no_ingr_title: 'Ingredients I don’t like', no_ingr_sub: 'Dishes where it’s a main ingredient won’t be suggested any more. A little as a garnish is still fine.',
    no_ingr_search: 'Other ingredient: fennel, capers…', no_ingr_saved: v => (v.n ? `Preferences saved · ${v.n} dish(es) replaced this week` : 'Preferences saved'),
    row_no_ingr: 'I don’t like', s5_no_ingr: 'And ingredients you don’t like?', no_ingr_edit: 'Choose ingredients I don’t like',
    fridge_sub: 'Add what you have at hand: we suggest the dishes that need the least shopping.',
    fridge_ph: 'Add: chicken, courgette, rice…', fridge_clear: 'Empty the fridge', fridge_have: v => `${v.h}/${v.t} ingredients`, fridge_all: 'You have everything!',
    fridge_missing: v => `Missing: ${v.l}`, fridge_none_title: 'Your fridge is empty', fridge_none_sub: 'Add a few ingredients to see what you can cook.',
    fridge_basics: 'Salt, oil, sugar, flour, common spices… are assumed to be in your cupboards.',
  },

  zh: {
    have_household: '已在其他设备上使用？', have_household_sub: '输入家庭代码（在另一台设备的「我的 → 共享家庭」中查看），无需重新填写问卷即可同步菜单。',
    multi_device: '在多部手机上使用', multi_device_sub: '创建共享家庭，所有设备上都是同一份菜单和购物清单。',
    stat_ingr: v => `<b>${v.n}</b> 种食材`, opt_title: '精简采购',
    opt_saving: v => `只需购买 ${v.n} 种食材（原本约 ${v.b} 种）：本周菜谱共用食材。`,
    opt_n: v => `需购买 ${v.n} 种食材：本周菜谱尽量共用食材。`,
    opt_off: '已关闭：选菜时不考虑共用食材。',
    plan_recomputed: '菜单已重新生成', shared_n: v => `共用 ${v.n} 种`, shared_title: '本周其他菜谱也会用到',
    budget_title: '预算', budget_q: '每份预算', budget_tight: '经济', budget_medium: '中等', budget_comfy: '宽裕', budget_none: '不限',
    budget_avg: v => `平均每份 ${v.p}`, budget_target: v => `目标每份 ≤ ${v.m}（本周约 ${v.w}）`,
    budget_over: v => `${v.n} 道菜超出预算：点击调整`, per_part: v => `${v.p}/份`,
    price_note: '价格根据超市平均价格估算，仅供参考。',
    cook: '开始做菜', cook_step: v => `第 ${v.i} / ${v.n} 步`, prev_step: '上一步', next_step: '下一步', cook_done: '完成',
    cook_bravo: '祝你用餐愉快！', start_timer: v => `计时 ${v.t}`, timer_label: v => `第 ${v.s} 步 · ${v.t}`, timer_over: '时间到',
    timer_stop: '停止计时', timer_ended: v => `计时结束：${v.l}`,
    shop_note_search: v => `放大镜可在 ${v.s} 搜索商品。`, search_on: v => `在 ${v.s} 搜索`,
    store_find_title: '选择我的超市', store_find_ph: '城市或邮编', near_me: '附近的超市', locating: '正在定位…',
    searching_stores: '正在查找超市…', no_store: '8 公里内没有找到超市。', store_err: '暂时无法搜索，请重试。',
    place_unknown: '找不到该城市或邮编。', geo_denied: '无法定位：请输入城市或邮编。',
    drive_found: '支持 Drive 自提', drive_likely: '该连锁提供 Drive 自提（请确认此门店）', drive_likely_short: '可能支持自提',
    drive_none: '该连锁不提供 Drive 自提', drive_unknown: '自提情况未知', drive_btn: v => `${v.c} 自提`, change_store: '更换超市',
    store_chosen: '已选择超市', store_chosen_drive: v => `已选择超市：已设置 ${v.c} 自提`, osm_credit: '超市数据：© OpenStreetMap 贡献者。',
    too_strict: v => `只有 ${v.n} 道菜完全符合你的「不喜欢」设置：部分菜品会违反其中一项。放宽偏好可获得更多选择。`,
    quick_relaxed: v => `符合你口味的 25 分钟以内菜谱不够：部分菜品最长需要 ${v.n} 分钟。`,
    unavailable: '超市缺货', unavail_confirm: v => `找不到${v.x}？我们会换成替代食材，或更换用到它的菜谱。`,
    unavail_alt: v => `${v.x}缺货：已换成${v.y}`, unavail_swap: v => `已更换 ${v.n} 道菜`,
    unavail_none: '没有找到可替换的菜谱', unavail_list: v => `缺货：${v.l}`, reset: '重置',
    today_lunch: '今天午餐', day_lunch: v => `${v.d}午餐`, day_dinner: v => `${v.d}晚餐`, lunch: '午餐', dinner: '晚餐',
    pick_title: '加入菜单', pick_sub: '选择日期和餐次', pick_now: v => `已在菜单：${v.s}`, pick_day: '哪一天？', pick_meal: '哪一餐？',
    pick_free: '这一餐还空着。', pick_replace: v => `替换：${v.x}`, pick_swap: v => `与之交换位置：${v.x}`, pick_same: '这道菜已经安排在这一餐。',
    pick_lunch_on: '将为菜单添加午餐。', placed: v => `已加入：${v.s}`, cat_side: '前菜和配菜', cat_breakfast: '早餐', cat_dessert: '甜点',
    lunch_too: '也安排午餐吗？', no: '不用', yes_lunch: '要，午餐和晚餐', portions_per_lunch: '每顿午餐份数',
    stat_lunches: v => `<b>${v.n}</b> 顿午餐`, add_meals: v => `补全（${v.n} 顿）`,
    add_lunches: '添加午餐', remove_lunches: '移除午餐', lunches_added: '已添加午餐', lunches_removed: '已移除午餐',
    slot_settings: '份数和用餐选项', slot_off_short: '这顿不吃 · 已从购物清单移除',
    portions_hint: '购物数量随之调整', slot_eat: '我吃这顿',
    slot_on_sub: '如果当天这顿不在家吃，请关闭：菜谱会从购物清单中移除。',
    slot_off_sub: '已排除：该菜谱不再计入购物清单。', slot_removed: '已从购物清单移除', slot_restored: '已恢复到菜单',
    or_alts: v => `或：${v.a}`, past_hidden: v => `已隐藏 ${v.n} 顿过去的餐`,
    past_shown: v => `正在显示 ${v.n} 顿过去的餐`, hide: '隐藏', show: '显示',
    n_meals: v => `${v.n} 顿`, week_lunch_value: v => `+ 午餐 · ${v.p} 人`,
    instead_of: v => `代替：${v.x}`, buy_as: v => `清单中为：${v.x}`, photo: '照片', disliked_minor: '你不喜欢：用量很少，可省略', alternatives: '替代食材', replace_with: '替换为：',
    alt_hint: '食材右侧的按钮可选择替代品，购物清单会同步更新。',
    nav_menu: '本周', nav_recipes: '菜谱', nav_shop: '购物', nav_profile: '我的',
    loading_title: '正在准备厨房…', loading_msg: '正在获取 TheMealDB 菜谱库',
    loading_count: v => `已获取 ${v.n} 道菜（${v.d}/${v.t}）`, api_fallback: '无法连接接口：使用离线副本',
    load_error: '无法加载菜谱库', retry: '重试',
    sync_updated: '菜单已从另一部手机更新', household_pill: '家庭',
    st_online: '● 已同步', st_offline: '● 离线 — 联网后自动同步', st_connecting: '● 连接中…', st_error: '● 同步出错',
    pill_online: '家庭已同步', pill_offline: '离线：联网后自动同步', pill_connecting: '连接中…', pill_error: '同步出错',
    join_confirm: '加入这个家庭？你的偏好和菜单将被共享家庭的数据替换。',
    joining: '正在连接家庭…', joined_ok: '已加入：你们现在共享同一份数据', join_fail: '无法加入家庭',
    code_invalid: '代码无效（格式 XXXXX-XXXXX）', code_unknown: '没有使用此代码的家庭',
    like: '喜欢', dislike: '不适合我',
    s1_title: '你的目标是什么？', s1_sub: '最多选择 3 个目标。',
    s2_title: '正好，我们都能满足你。', s2_db_title: v => `来自世界各地的 ${v.n} 道菜。`, s2_db_desc: '实时取自 TheMealDB，并为你专门排序。',
    s3_title: '你想吃什么样的？', s4_title: '你的饮食习惯是？',
    s5_title: '有需要避免的食材吗？', s5_sub: '如果不想回答，可以跳过这一部分。', skip: '跳过',
    s6_title: '有营养方面的偏好吗？', s6_sub: '可选 — 可多选。',
    s7_title: '你喜欢的菜系？', s8_title: '让你心动的口味？', s9_title: '你想吃哪些蛋白质？',
    s10_title: '你理想的晚餐是什么样的？', s11_title: '每周做几晚饭？',
    portions_per_dinner: '每顿晚餐份数', dinners_per_week: '每周晚餐数',
    cancel: '取消', back: '返回', next: '继续', see_menu: '查看我的菜单',
    n_match: v => `${v.n} 道菜符合你的口味`, max_choices: v => `最多选 ${v.n} 项`,
    hello_evening: '晚上好', hello_morning: '早上好', hello_afternoon: '下午好', your_week: '本周菜单',
    stat_dinners: v => `<b>${v.n}</b> 顿晚餐`, stat_people: v => `<b>${v.n}</b> 人`, stat_time: v => `下厨 <b>${v.t}</b>`,
    tonight: '今晚', tomorrow: '明天', see_recipe: '查看菜谱', change: '换一道', change_dish: '换一道菜',
    no_dinner_title: '还没有安排晚餐', no_dinner_sub: '生成一周菜单，或在「菜谱」中添加。',
    on_menu: '本周菜单', shop_list: '购物清单',
    items_to_buy: v => `${v.r} 道菜需购买 ${v.n} 件商品`, all_in_cart: '全部已放入购物车 ',
    add_dinners: v => `添加 ${v.n} 顿晚餐`, new_week: '换一周菜单', browse_recipes: '浏览菜谱',
    menu_hint: '点击菜品查看菜谱，点击份数按钮可调整、排除或更换。',
    recipes_for_you: v => `为你推荐 ${v.n} 道菜`, recipes_title: '菜谱', search_ph: '菜名或食材：鸡肉、咖喱、奶酪…',
    quick: '快手', veggie: '素食', all: '全部', result_count: v => `${v.n} 道菜 · 按你的口味排序`,
    more_recipes: '查看更多菜谱', no_recipe_title: '没有找到菜谱', no_recipe_sub: '换个关键词或取消筛选试试。',
    in_week: '已在本周菜单', add_week: '加入本周菜单',
    shop_title: '购物', in_cart: v => `购物车 <b>${v.d}/${v.t}</b>`, for_recipes: '所需菜谱', for_recipes_hint: '— 点击可筛选',
    all_short: '全部', only_of: v => `仅显示 <b>${v.name}</b> 的食材 — 查看菜谱`,
    by_aisle: '按货架', by_recipe: '按菜谱', recipe_word: '菜谱', pantry_title: '检查家中常备',
    pantry_sub: '家里可能已有的基础调料，有的请勾选。', share_list: '分享清单',
    keep_awake: '保持屏幕常亮', awake_on: '屏幕保持常亮', uncheck_all: '全部取消勾选',
    itinerary: '路线', drive: 'Drive 自提', store_settings: '超市与货架',
    nothing_to_buy: '无需购买', nothing_to_buy_sub: '向本周添加晚餐即可生成清单。',
    shop_note: v => `数量以克/毫升计，按 ${v.p} 人份合并计算。货架顺序参照超市常见布局（可修改）。`,
    n_recipes: v => `${v.n} 道菜`, as_needed: '适量', search_store: '在 intermarche.com 搜索',
    list_title: '购物清单', pantry_check: '检查家中常备',
    wake_off: '已恢复自动锁屏', wake_unavailable: '此浏览器不支持（需要 HTTPS）', wake_on: '购物期间屏幕将保持常亮', wake_fail: '无法保持屏幕常亮',
    store_settings_title: '超市与货架', store_name: '超市名称', address: '地址', aisle_order: '货架顺序',
    aisle_order_sub: '按你在超市中经过货架的顺序排列。', save: '保存', reset_default: '恢复默认顺序',
    store_saved: '超市已保存', default_restored: '已恢复默认顺序', up: '上移', down: '下移', less: '减少', more: '增加',
    your_tastes: '你的口味', profile_title: '我的', redo_quiz: '重新填写问卷', redo_quiz_sub: '已预填你当前的答案',
    row_objectives: '目标', row_craving: '想吃', row_diet: '饮食习惯', row_avoid: '忌口', row_nutrition: '营养',
    row_cuisines: '菜系', row_flavours: '口味', row_proteins: '蛋白质', row_dishes: '菜式', row_week: '每周', row_rated: '已评价', row_lang: '语言',
    week_value: v => `${v.n} 顿晚餐 · ${v.p} 人`, rated_value: v => `喜欢 ${v.l} · 排除 ${v.d}`,
    reset_feedback: '清除我的菜品评价', refresh_db: '更新菜谱库', reset_all: '全部重置',
    base_note: v => `菜谱库：${v.n} 道菜，${v.src}`, src_api: '下载自 TheMealDB', src_cache: '已缓存（TheMealDB）', src_snapshot: '离线备份',
    household: '共享家庭', sync_off: '尚未配置同步', sync_off_sub: '配置 Firebase 后，即可与另一部手机共享菜单和购物清单。',
    share_household: '与家人共享', share_household_sub: '多部手机，同一份菜单和购物清单',
    create_household: '创建共享家庭', join: '加入', household_code: '家庭代码', invite_phone: '邀请另一部手机',
    household_help: '对方打开收到的链接（或在「我的」中输入代码）：即可实时共享偏好、菜单、评价和购物清单。',
    leave_household: '退出家庭', household_created: '家庭已创建！邀请另一部手机吧', create_fail: '创建失败：请检查网络',
    enter_code: '请输入家庭代码', invite_text: v => `加入我们在 QuoiManger 的家庭，共享菜单和购物清单：${v.link}（代码：${v.code}）`,
    invite_copied: '邀请链接已复制', leave_confirm: '退出共享家庭？数据会保留在本机，但不再同步。',
    reset_feedback_confirm: '清除所有喜欢/排除的菜品？', feedback_cleared: '评价已清除', reset_all_confirm: '删除你的偏好、菜单和评价？',
    f_time: '时间', f_cuisine: '菜系', f_ingredients: '食材', f_portions: '份数', for_you: '推荐理由：',
    tab_ingr: '食材', tab_steps: v => `做法 · ${v.n} 步`, ingr_for: v => `${v.n} 人份`, prep: '做法',
    in_english: '英文原文', translate: '翻译成中文', tap_step: '点击步骤即可勾选。', in_my_week: '已在本周', add_to_week: '加入本周菜单', video: '视频',
    no_alternative: '没有其他可选菜品', new_week_toast: '已生成新一周菜单', new_dish: '已为你换了一道菜',
    added_to_week: v => `已加入本周菜单（${v.day}）`, disliked: '已记录：不会再推荐', list_copied: '清单已复制', copy_fail: '此浏览器无法复制',
    tag_veg: '素食', tag_hot: '辣', tag_light: '清淡', tag_overnight: '需提前一天准备',
    language: '语言', other: '其他', vegetables: '蔬菜',
    r_ready: v => `约 ${v.n} 分钟完成`, r_chef: '餐厅级菜品', r_family: '适合全家', r_nomeat: '无肉',
    r_seafood: '鱼和海鲜', r_light: '低卡', r_lowcarb: '低碳水', r_protein: '高蛋白',
    r_veg: v => `${v.n} 种蔬菜`, r_cuisine: v => v.c, r_budget: '省钱', r_time: '省时', r_few: v => `仅需 ${v.n} 种食材`, r_liked: '你喜欢过这道菜',
    kcal: v => `${v.n} 千卡`, kcal_title: '每份估算热量',
    b_hot: '辣', b_spiced: '香料味', b_sweet: '甜', b_cheese: '奶酪', b_veg: '素食', b_quick: '快手', b_fav: '收藏',
    tab_fav: '收藏', tab_forme: '为我推荐', tab_all: '全部菜谱', tab_fridge: '我的冰箱',
    fav_add: '收藏', fav_added: '已加入收藏', fav_removed: '已取消收藏',
    no_fav_title: '还没有收藏', no_fav_sub: '点菜谱上的爱心，就能在这里找到。', see_for_me: '查看为我推荐的菜谱', see_all: '浏览全部菜谱',
    all_count: v => `共 ${v.n} 道菜 · 最合口味的排在前面`, fav_count: v => `${v.n} 个收藏`, out_of_taste: '不合你的口味',
    f_light: '清淡', f_mild: '不辣', f_cheap: '省钱', no_ingr_btn: v => (v.n ? `不要…（${v.n}）` : '不要…'),
    no_ingr_title: '我不喜欢的食材', no_ingr_sub: '以这些食材为主料的菜将不再推荐，少量配料仍可接受。',
    no_ingr_search: '其他食材：茴香、刺山柑…', no_ingr_saved: v => (v.n ? `已保存 · 本周替换了 ${v.n} 道菜` : '已保存'),
    row_no_ingr: '不喜欢', s5_no_ingr: '还有你不喜欢的食材吗？', no_ingr_edit: '选择我不喜欢的食材',
    fridge_sub: '添加手头已有的食材：优先推荐需要买得最少的菜。',
    fridge_ph: '添加：鸡肉、西葫芦、米饭…', fridge_clear: '清空冰箱', fridge_have: v => `${v.h}/${v.t} 种食材`, fridge_all: '食材齐全！',
    fridge_missing: v => `还缺：${v.l}`, fridge_none_title: '冰箱是空的', fridge_none_sub: '添加一些食材，看看能做什么菜。',
    fridge_basics: '盐、油、糖、面粉、常用香料…默认家里已有。',
  },
};

/** Texte traduit ; `v` = variables pour les textes dynamiques. Retombe sur le français si une clé manque. */
function t(key, v = {}) {
  const s = (STR[LANG] && STR[LANG][key]) ?? STR.fr[key];
  if (s == null) return key;
  return typeof s === 'function' ? s(v) : s;
}

// Libellés des options (le français vit dans data.js ; ici l'anglais et le chinois).
const OPT_I18N = {
  objectives: {
    eco: ['Save money', '省钱'], waste: ['Reduce food waste', '减少食物浪费'], discover: ['Discover new recipes', '发现新菜谱'],
    time: ['Save time', '节省时间'], nutri: ['Nutri+ option', '营养加强'], plan: ['Plan my meals more easily', '更轻松地规划餐食'],
  },
  pitch: {
    eco: [['Dinner wins on every count. Even price.', 'We favour dishes with affordable ingredients: pulses, eggs, rice, potatoes…'], ['晚餐样样好，价格也好。', '优先推荐实惠食材的菜：豆类、鸡蛋、米饭、土豆…']],
    waste: [['Zero waste, zero hassle.', 'Your menu reuses the same ingredients from one evening to the next to finish open packs.'], ['零浪费，零烦恼。', '菜单会在几晚之间复用相同食材，把开封的食材用完。']],
    discover: [['A world tour on your plate.', 'Over 30 countries on the menu: we vary the cuisines every week.'], ['餐桌上的环球之旅。', '30 多个国家的菜：每周变换菜系。']],
    time: [['Less “can’t be bothered”, more “yum”.', 'We put quick recipes first. Barely time to say “I’m hungry”.'], ['少点「懒得做」，多点「真好吃」。', '优先推荐快手菜，刚说「饿了」就能开饭。']],
    nutri: [['Dinner sorted. Body happy.', 'Lighter, veg-packed meals tailored to your nutrition preferences.'], ['晚餐搞定，身体满意。', '根据你的营养偏好，推荐更清淡、蔬菜更多的餐食。']],
    plan: [['Your week, sorted in one tap.', 'A complete menu + an automatically generated shopping list.'], ['一键搞定一周。', '完整菜单 + 自动生成的购物清单。']],
  },
  cravings: {
    quick: [['Quick recipes', 'In a hurry: under 25 minutes, maximum flavour.'], ['快手菜', '赶时间：25 分钟以内，美味不打折。']],
    chef: [['Chef’s recipes', 'I love restaurant-worthy dishes, ready in 30 to 60 min.'], ['大厨菜', '喜欢餐厅级菜品，30 到 60 分钟完成。']],
    family: [['Family recipes', 'Good, tasty dishes for kids and grown-ups alike.'], ['家常菜', '大人小孩都爱吃的美味家常菜。']],
  },
  diets: {
    all: [['I eat everything', 'I like mixing meat, fish and vegetarian recipes.'], ['什么都吃', '喜欢肉类、鱼类和素食轮换着吃。']],
    flexi: [['Flexitarian', 'Mostly vegetarian, with a little meat now and then.'], ['弹性素食', '以素食为主，偶尔吃点肉。']],
    veggie: [['Vegetarian', 'I eat neither meat nor fish.'], ['素食', '不吃肉也不吃鱼。']],
    pesco: [['Fish & veg', 'I love seafood and fish.'], ['鱼素', '爱吃鱼和海鲜。']],
  },
  avoid: {
    pork: ['Pork', '猪肉'], seafood: ['Seafood', '海鲜'], fish: ['Fish', '鱼'], peanut: ['Peanuts', '花生'],
    nuts: ['Nuts', '坚果'], dairy: ['Dairy', '乳制品'], gluten: ['Gluten', '麸质'], egg: ['Eggs', '鸡蛋'],
  },
  nutrition: { light: ['Calorie Smart', '低卡'], lowcarb: ['<40 g carbs', '碳水 <40 克'], protein: ['High protein', '高蛋白'], veg: ['Veg-packed', '多蔬菜'] },
  cuisines: {
    chinese: ['Chinese', '中餐'], indian: ['Indian', '印度菜'], french: ['French', '法国菜'], italian: ['Italian', '意大利菜'],
    medit: ['Mediterranean', '地中海菜'], mideast: ['Middle Eastern', '中东菜'], american: ['American', '美式'],
    latino: ['Mexican & Latin', '墨西哥及拉美菜'], thai: ['Thai', '泰国菜'], japanese: ['Japanese & Korean', '日韩料理'],
    seasia: ['South-East Asian', '东南亚菜'], caribbean: ['Caribbean & African', '加勒比及非洲菜'], europe: ['Northern & Eastern European', '北欧及东欧菜'],
  },
  flavours: { herbs: ['Herbs', '香草'], cheese: ['Lots of cheese', '多奶酪'], sweet: ['Sweet', '甜'], spiced: ['Spiced', '香料味'], hot: ['Hot & spicy', '辣'] },
  proteins: {
    beef: ['Beef', '牛肉'], pork: ['Pork', '猪肉'], poultry: ['Poultry', '禽肉'], lamb: ['Lamb', '羊肉'],
    fish: ['Fish', '鱼'], seafood: ['Seafood', '海鲜'], plant: ['Plant protein', '植物蛋白'], egg: ['Eggs', '鸡蛋'],
  },
  dishes: {
    pasta: ['Pasta', '意面'], soup: ['Soups & stews', '汤和炖菜'], oven: ['Bakes & gratins', '烤菜和焗菜'], wok: ['Stir-fries', '炒菜'],
    plate: ['Main + side', '主菜 + 配菜'], curry: ['Curries', '咖喱'], rice: ['Rice & bowls', '米饭和碗饭'], salad: ['Salads', '沙拉'],
    pizza: ['Pizzas & tarts', '披萨和咸派'], wrap: ['Wraps & tacos', '卷饼和塔可'], sandwich: ['Sandwiches', '三明治'], burger: ['Burgers', '汉堡'],
  },
  nights: { 2: ['1–2 evenings a week', '每周 1–2 晚'], 4: ['3–4 evenings a week', '每周 3–4 晚'], 6: ['5–6 evenings a week', '每周 5–6 晚'], 7: ['Every evening', '每晚'] },
  rayons: {
    fl: ['Fruit & veg', '蔬菜水果'], bl: ['Bakery', '面包'], bo: ['Butcher & poultry', '肉类禽类'], po: ['Fish counter', '水产'],
    ch: ['Deli & ready meals', '熟食冷切'], cr: ['Dairy & eggs', '乳制品和蛋'], fr: ['Cheese', '奶酪'], ep: ['Groceries & tins', '粮油罐头'],
    mo: ['World foods', '异国食品'], sa: ['Sauces, oils & condiments', '酱料油醋'], es: ['Spices & stock', '香料和高汤'],
    su: ['Sweet & baking', '甜品烘焙'], bs: ['Drinks & wine', '饮料酒水'], sg: ['Frozen', '冷冻食品'],
  },
};

/** Libellé traduit d'une option : `L('cuisines', item)` ; `field` = 'label' ou 'desc'. */
function L(group, item, field = 'label') {
  if (!item) return '';
  if (LANG === 'fr') return item[field] ?? '';
  const tr = (OPT_I18N[group] || {})[item.id];
  if (!tr) return item[field] ?? '';
  const i = LANG === 'en' ? 0 : 1;
  const v = tr[i];
  if (Array.isArray(v)) return field === 'desc' ? v[1] : v[0];
  return field === 'desc' ? (item.desc ?? '') : v;
}

function pitchFor(id) {
  const [ico, ft, fp] = OBJECTIVE_PITCH[id];
  if (LANG === 'fr') return [ico, ft, fp];
  const [tt, tp] = OPT_I18N.pitch[id][LANG === 'en' ? 0 : 1];
  return [ico, tt, tp];
}

// ---------- Unités, durées, jours ----------
const UNIT_I18N = {
  fr: { cs: 'c. à soupe', cc: 'c. à café', pinch: '1 pincée' },
  en: { cs: 'tbsp', cc: 'tsp', pinch: 'a pinch' },
  zh: { cs: '汤匙', cc: '茶匙', pinch: '少许' },
};
const COUNT_I18N = {
  en: { gousse: ['clove', 'cloves'], boîte: ['can', 'cans'], bocal: ['jar', 'jars'], botte: ['bunch', 'bunches'], poignée: ['handful', 'handfuls'],
    tranche: ['slice', 'slices'], brin: ['sprig', 'sprigs'], paquet: ['pack', 'packs'], tête: ['head', 'heads'], bâton: ['stick', 'sticks'], noix: ['knob', 'knobs'], feuille: ['leaf', 'leaves'] },
  zh: { gousse: '瓣', boîte: '罐', bocal: '瓶', botte: '把', poignée: '把', tranche: '片', brin: '枝', paquet: '包', tête: '头', bâton: '根', noix: '块', feuille: '片' },
};
function unitWord(unit, n) {
  if (LANG === 'fr') return n > 1 && unit !== 'noix' ? (unit === 'bocal' ? 'bocaux' : unit + 's') : unit;
  if (LANG === 'en') { const w = COUNT_I18N.en[unit]; return w ? (n > 1 ? w[1] : w[0]) : unit; }
  return COUNT_I18N.zh[unit] || unit;
}
const unitSpoon = (k) => UNIT_I18N[LANG][k];
const headsApprox = (n) => LANG === 'zh' ? `（约 ${n} 头）` : LANG === 'en' ? `(≈ ${n} ${n > 1 ? 'heads' : 'head'})` : `(≈ ${n} tête${n > 1 ? 's' : ''})`;
const decimalSep = () => (LANG === 'fr' ? ',' : '.');

function fmtMinutes(n) {
  if (LANG === 'zh') return n < 60 ? `${n} 分钟` : `${Math.floor(n / 60)} 小时${n % 60 ? ' ' + (n % 60) + ' 分' : ''}`;
  if (LANG === 'en') return n < 60 ? `${n} min` : `${Math.floor(n / 60)} h${n % 60 ? ' ' + String(n % 60).padStart(2, '0') : ''}`;
  return n < 60 ? `${n} min` : `${Math.floor(n / 60)} h${n % 60 ? ' ' + String(n % 60).padStart(2, '0') : ''}`;
}
const weekdayName = (d) => new Intl.DateTimeFormat(langInfo().locale, { weekday: 'long' }).format(d);
const weekdayShort = (d) => {
  const s = new Intl.DateTimeFormat(langInfo().locale, { weekday: 'short' }).format(d).replace('.', '');
  return LANG === 'zh' ? s : s.slice(0, 3).toUpperCase();
};
const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

// Précisions des mesures (« chopped », « large »…) en chinois ; l'anglais garde le texte d'origine.
const DESC_ZH = [
  [/finely chopped|finely diced/g, '切碎'], [/roughly chopped|coarsely chopped/g, '粗切'], [/chopped|minced/g, '切碎'],
  [/thinly sliced|finely sliced|sliced thinly/g, '切薄片'], [/sliced/g, '切片'], [/diced|cubed/g, '切丁'], [/grated/g, '擦碎'],
  [/crushed/g, '压碎'], [/beaten/g, '打散'], [/peeled/g, '去皮'], [/halved/g, '切半'], [/quartered/g, '切四瓣'],
  [/shredded/g, '切丝'], [/drained/g, '沥干'], [/rinsed/g, '冲洗'], [/softened/g, '软化'], [/melted/g, '融化'], [/cooked/g, '熟的'],
  [/boneless/g, '去骨'], [/skinless/g, '去皮'], [/large/g, '大'], [/medium/g, '中'], [/small/g, '小'], [/whole/g, '整个'], [/fresh/g, '新鲜'], [/frozen/g, '冷冻'],
  [/to taste|as required|as needed/g, '适量'], [/to serve|for serving/g, '装盘用'], [/garnish|to garnish/g, '装饰用'], [/for frying/g, '油炸用'],
  [/pinch(es)?/g, '少许'], [/dash(es)?|splash/g, '少许'], [/drizzle/g, '少许'], [/handful/g, '一把'],
  [/^zest and juice$/g, '皮和汁'], [/^juice$/g, '汁'], [/^zest$/g, '皮'], [/leaves/g, '叶'], [/sprigs?/g, '枝'], [/optional/g, '可选'], [/\band\b/g, '和'], [/\bof\b/g, ''],
];
const descZh = (s) => DESC_ZH.reduce((x, [re, zh]) => x.replace(re, zh), s || '').replace(/\s+/g, ' ').trim();

// Nom d'ingrédient dans la langue courante (en : nom TheMealDB d'origine).
function ingLabel(en, frLabel) {
  if (LANG === 'fr') return frLabel;
  if (LANG === 'zh') return ING_ZH[en.toLowerCase()] || capitalize(en);
  return capitalize(en);
}

function setLang(id) {
  if (!LANGS.some(l => l.id === id)) return;
  store.set('qm_lang', id);
  location.reload();
}

// ---------- Recettes traduites ----------
// Noms traduits embarqués (js/recipe-names.js). Les instructions, et les noms des recettes ajoutées ensuite à l'API,
// sont traduits à la volée puis gardés en cache sur l'appareil.
const RECIPE_CACHE_KEY = 'qm_tr_' + LANG;
const recipeCache = LANG === 'en' ? {} : store.get(RECIPE_CACHE_KEY, {});
const GTX_LANG = { fr: 'fr', zh: 'zh-CN' };

const mealName = (m) => (LANG !== 'en' && ((RECIPE_NAMES[m.id] || {})[LANG] || (recipeCache[m.id] || [])[0])) || m.name;
const mealInstr = (m) => (LANG !== 'en' && (recipeCache[m.id] || [])[1]) || m.instr;
const needsTranslation = (m) => LANG !== 'en' && !!m && !!m.instr && !(recipeCache[m.id] || [])[1];

async function gtxTranslate(text) {
  const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${GTX_LANG[LANG]}&dt=t`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: 'q=' + encodeURIComponent(text),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return (await res.json())[0].filter(Boolean).map(x => x[0] || '').join('');
}
const saveRecipeCache = () => store.set(RECIPE_CACHE_KEY, recipeCache);

/** Traduit nom + instructions d'une recette ; renvoie true si la traduction a réussi. */
async function translateMeal(m) {
  if (!needsTranslation(m)) return false;
  try {
    const name = (recipeCache[m.id] || [])[0] || (RECIPE_NAMES[m.id] ? null : (await gtxTranslate(m.name)).trim());
    let instr = '';
    for (let i = 0; i < m.instr.length; i += 4000) instr += await gtxTranslate(m.instr.slice(i, i + 4000));
    recipeCache[m.id] = [name, instr.trim()];
    saveRecipeCache();
    return true;
  } catch (e) { console.warn('Traduction impossible', e); return false; }
}

/** Traduit en lot les noms de recettes qui n'en ont pas ; renvoie le nombre de noms traduits. */
async function translateNames(meals) {
  if (LANG === 'en') return 0;
  const todo = meals.filter(m => !RECIPE_NAMES[m.id] && !recipeCache[m.id]);
  let n = 0;
  for (let i = 0; i < todo.length; i += 40) {
    const batch = todo.slice(i, i + 40);
    try {
      const out = (await gtxTranslate(batch.map(m => m.name.replace(/\n/g, ' ')).join('\n'))).split('\n');
      if (out.length !== batch.length) continue;
      batch.forEach((m, j) => { recipeCache[m.id] = [out[j].trim(), null]; n++; });
    } catch { break; }
  }
  if (n) saveRecipeCache();
  return n;
}
