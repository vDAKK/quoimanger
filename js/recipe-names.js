// Noms des recettes TheMealDB en français et en chinois. Format : id|français|中文
// Les recettes ajoutées ensuite à l'API sont traduites à la volée (voir i18n.js).
const RECIPE_NAMES_RAW = `
53483|Acarajé : beignets de cornille farcis aux crevettes|阿卡拉热：虾馅黑眼豆炸饼
53527|Huile de rocou (aceite achiotado)|胭脂树籽油
53262|Kebab d’Adana|阿达纳烤肉串
53373|Rouleaux impériaux au air fryer|空气炸锅春卷
53158|Patatas bravas au air fryer|空气炸锅西班牙辣味土豆
53525|Ají de aguacate (sauce colombienne pimentée à l’avocat)|哥伦比亚牛油果辣酱
53169|Ajo blanco (soupe froide à l’ail et aux amandes)|西班牙白蒜冷汤
53138|Alfajores|阿尔法霍雷斯夹心饼
53284|Pain berbère bouzgene et sauce aux poivrons grillés|阿尔及利亚柏柏尔面包配烤椒酱
53282|Carottes à l’algérienne|阿尔及利亚风味胡萝卜
53288|Flafla algérienne (salade de poivrons)|阿尔及利亚彩椒沙拉
53281|Kefta algérienne (boulettes de viande)|阿尔及利亚肉丸
53529|Almojábanas (pain colombien au fromage)|哥伦比亚奶酪面包
53495|Amok trey – curry de poisson cambodgien|柬埔寨鱼肉阿莫克咖喱
53430|Petit-déjeuner d’Antigua (chop up et morue salée)|安提瓜早餐（蔬菜泥配咸鱼）
53111|Biscuits Anzac|澳新军团饼干
53049|Apam balik (crêpe malaisienne aux cacahuètes)|曼煎糕
52893|Crumble pommes et mûres|苹果黑莓酥粒
53380|Gâteau aux pommes|苹果蛋糕
52768|Tarte aux pommes frangipane|苹果杏仁奶油挞
53575|Tarte aux pommes|苹果派
53568|Pops de tarte aux pommes|苹果派棒
53389|Purée pommes et pommes de terre (hete bliksem)|荷兰苹果土豆泥
53276|Eton mess abricot et loukoum|杏子土耳其软糖伊顿麦斯
53439|Arepa|阿瑞巴玉米饼
53334|Arepa pabellón|帕韦利翁阿瑞巴
53329|Arepa pelúa|牛肉丝奶酪阿瑞巴
53392|Arnhemse meisjes (biscuits feuilletés d’Arnhem)|阿纳姆女孩酥饼
53406|Figues farcies aux noix et sirop de figue|核桃酿无花果配无花果糖浆
53156|Arroz al horno (riz au four)|西班牙烤饭
53147|Riz aux gambas et calamars|大虾鱿鱼饭
53522|Arroz con leche (riz au lait)|拉美米布丁
53133|Asado|阿根廷烤肉
53278|Aubergines grillées au houmous|鹰嘴豆泥烤茄子
53267|Salade de semoule aux aubergines|茄子古斯米沙拉
53099|Burgers à l’australienne|澳式汉堡
53425|Pudding de tapioca laotien aux bananes|老挝香蕉西米布丁
53127|Kransekake norvégien traditionnel|传统挪威花环塔
53107|Dip d’avocat et pommes de terre nouvelles|牛油果蘸酱配新土豆
53050|Ayam percik (poulet grillé malaisien)|马来西亚椰浆烤鸡
53094|Baba ganoush|中东茄子泥
53396|Baghlaw-e-khanagi (baklava afghan maison)|阿富汗家常果仁蜜饼
53481|Moqueca de crevettes de Bahia|巴伊亚椰汁炖虾
53496|Bai sach chrouk – porc grillé et riz|柬埔寨烤猪肉饭
52807|Baingan bharta (purée d’aubergine épicée)|印度烟熏茄子泥
53456|Pain salé de la Barbade|巴巴多斯咸面包
53460|Pain sucré de la Barbade|巴巴多斯甜面包
53559|Brie rôti et confiture d’oseille|烤布里奶酪配酸模果酱
52959|Saumon au four, fenouil et tomates|茴香番茄烤三文鱼
53548|Frites de manioc au four|烤木薯条
52767|Tarte Bakewell|贝克韦尔挞
53279|Baklava aux noix épicées, ricotta et chocolat|香料坚果乳清干酪巧克力果仁蜜饼
53440|Balchi di pisca (croquettes de poisson)|库拉索炸鱼丸
53441|Banane au four (banana den forno)|烤香蕉
52855|Pancakes à la banane|香蕉松饼
53239|Salade de crevettes bang bang|棒棒虾沙拉
53451|Curry de poisson bangladais au daikon|孟加拉白萝卜咖喱鱼
53457|Pepperpot de la Barbade|巴巴多斯辣炖肉
53242|Brioches vapeur au porc barbecue|叉烧包
53103|Barramundi aux épices marocaines|摩洛哥香料尖吻鲈
52894|Gâteau Battenberg|巴腾堡蛋糕
52995|Sloppy joes au porc barbecue|烧烤猪肉邋遢乔汉堡
52848|Potée haricots et saucisses|豆子香肠炖锅
52928|Queues de castor (BeaverTails)|海狸尾炸面饼
53366|Sauté de bœuf au brocoli|西兰花炒牛肉
52874|Tourte au bœuf et à la moutarde|芥末牛肉派
52878|Tourte au bœuf et aux huîtres|牛肉生蚝派
53071|Bœuf asado|阿萨多牛肉
52997|Bols banh mi au bœuf, mayo sriracha, carotte et concombre mariné|越式牛肉碗配是拉差蛋黄酱、胡萝卜和腌黄瓜
52904|Bœuf bourguignon|勃艮第红酒炖牛肉
52812|Pot-au-feu de poitrine de bœuf|焖牛胸肉
53070|Caldereta de bœuf|菲律宾炖牛肉
52873|Ragoût de bœuf aux boulettes|牛肉面团炖菜
53317|Empanadas au bœuf|牛肉馅饼
52952|Lo mein au bœuf|牛肉捞面
53421|Bœuf lok lak|柬埔寨洛拉克牛肉
53359|Mandi de bœuf|也门焖牛肉饭
53068|Mechado de bœuf|菲律宾番茄炖牛肉
53238|Phở au bœuf|越南牛肉河粉
53469|Ragoût de bœuf au potiron|南瓜炖牛肉
53053|Rendang de bœuf|仁当牛肉
52834|Bœuf Stroganoff|俄式酸奶油牛肉
52824|Rôti de bœuf du dimanche|周日烤牛肉
52803|Bœuf Wellington|惠灵顿牛排
53307|Choucroute de betterave et chou rouge|甜菜红甘蓝酸菜
53313|Latkes à la betterave|甜菜根土豆饼
53316|Pancakes à la betterave|甜菜根松饼
53078|Soupe de betterave (bortsch)|罗宋汤
53463|Boulettes liégeoises au sirop de Liège|列日糖浆肉丸
53468|Stoemp belge|比利时蔬菜土豆泥
53466|Waterzooi de poulet belge|比利时奶油炖鸡
53453|Curry de poulet bengali aux pommes de terre|孟加拉土豆咖喱鸡
53013|Big Mac|巨无霸汉堡
53018|Bigos (ragoût du chasseur)|波兰猎人炖肉
53300|Bigos (ragoût polonais du chasseur)|波兰猎人炖菜
53580|Modak au jaggery|印度粗糖莫达克甜饺
53069|Bistek (bœuf mariné philippin)|菲律宾酱汁牛排
52979|Bitterballen (boulettes néerlandaises)|荷兰炸肉丸
53482|Feijoada (ragoût de haricots noirs et viandes)|巴西黑豆炖肉
53546|Soupe de haricots noirs|黑豆汤
53536|Potée de haricots noirs|黑豆炖锅
52891|Fool aux mûres|黑莓奶油冻
53080|Blinis|俄式薄煎饼
53100|Friands myrtille et citron|蓝莓柠檬费南雪
53401|Bolani aux pommes de terre|阿富汗土豆馅饼
53438|Bolita di keshi (boulettes au fromage)|库拉索奶酪球
53311|Bortsch|罗宋汤
53385|Boterkoek (gâteau au beurre néerlandais)|荷兰黄油蛋糕
52914|Pommes boulangère|面包师土豆
53036|Petit-déjeuner au boxty|爱尔兰土豆饼早餐
52826|Chili de bœuf braisé|辣味焖牛肉
53305|Chou farci braisé|焖酿卷心菜
53485|Gâteau brésilien aux carottes|巴西胡萝卜蛋糕
53476|Pão de queijo (pain brésilien au fromage)|巴西奶酪面包
53475|Brigadeiros (truffes brésiliennes au chocolat)|巴西巧克力球
52792|Pudding pain et beurre|面包黄油布丁
53076|Omelette au pain|面包煎蛋
53533|Steak pané (lomo de res apanado)|哥伦比亚炸牛排
53458|Fruit à pain sauce au beurre|黄油酱面包果
53454|Fruit à pain sauce au beurre (variante)|黄油酱面包果（另一做法）
53562|Tacos au fruit à pain|面包果塔可
52965|Pommes de terre du petit-déjeuner|早餐土豆
52913|Brie en croûte de prosciutto et brioche|意式火腿布里欧修包布里奶酪
52842|Soupe brocoli et stilton|西兰花斯蒂尔顿奶酪汤
52940|Poulet mijoté à la jamaïcaine (brown stew)|牙买加红烧鸡
53126|Brun lapskaus (ragoût norvégien bœuf et légumes)|挪威牛肉蔬菜炖
53190|Bryndzové halušky (gnocchis slovaques au fromage de brebis)|斯洛伐克羊奶酪面疙瘩
52961|Budino di ricotta|意式乳清干酪布丁
53492|Salade verte bulgare|保加利亚绿沙拉
53493|Biscuits bulgares au miel|保加利亚蜂蜜饼干
53060|Burek|布雷克酥饼
53077|Soupe au chou (chtchi)|俄式白菜汤
53488|Chou au bœuf haché|牛肉末炒卷心菜
53256|Cacık (yaourt concombre)|土耳其黄瓜酸奶
53544|Glace à l’espresso Café La Llave|拉亚韦浓缩咖啡冰淇淋
52819|Tacos de poisson aux épices cajun|卡真香料鱼肉塔可
53361|Callaloo et morue salée|苋菜炒咸鱼
52939|Callaloo à la jamaïcaine|牙买加风味苋菜
53428|Crevettes grillées sauce crue aux oignons verts|烤虾配葱酱
53418|Liseron d’eau sauté au porc, soja fermenté et ail (Cambodge)|柬埔寨豆豉蒜炒空心菜肉末
53420|Gaufres cambodgiennes (num poum)|柬埔寨华夫饼
52923|Tartelettes au beurre canadiennes|加拿大黄油挞
53141|Carbonada criolla|阿根廷克里奥炖肉
53360|Boules de tamarin des Caraïbes|加勒比罗望子糖球
53576|Beignets carotte et haricots|胡萝卜豆子炸饼
52897|Gâteau aux carottes|胡萝卜蛋糕
52976|Ghoriba aux noix de cajou|腰果摩洛哥酥饼
53564|Pain de manioc|木薯面包
53508|Gâteau de manioc|木薯糕
53330|Pizza au manioc|木薯披萨
53507|Salade de pommes de terre façon Caïmans|开曼风味土豆沙拉
53510|Homard façon Caïmans|开曼风味龙虾
53055|Ćevapi (saucisses grillées)|巴尔干烤肉肠
52969|Chakchouka|北非番茄炖蛋
53310|Hallah|哈拉面包
53290|Börek au fromage|奶酪酥饼
53442|Bâtonnets au fromage|奶酪条
52898|Chelsea buns|切尔西面包卷
53016|Sandwich façon Chick-fil-A|福来鸡式炸鸡三明治
53161|Riz au poulet et chorizo en cocotte|鸡肉西班牙辣肠焖饭
52846|Potée poulet et champignons|鸡肉蘑菇炖锅
52796|Poulet Alfredo primavera|阿尔弗雷多鸡肉蔬菜意面
53459|Roti au poulet et pommes de terre|鸡肉土豆罗蒂
52934|Poulet basquaise|巴斯克风味鸡
52956|Congee au poulet|鸡肉粥
52850|Couscous au poulet|鸡肉古斯米
52765|Gratin d’enchiladas au poulet|鸡肉卷饼焗菜
52818|Mac and cheese au poulet fajita|法士达鸡肉芝士通心粉
53367|Riz sauté au poulet|鸡肉炒饭
52875|Tourte poulet, jambon et poireaux|鸡肉火腿韭葱派
52795|Poulet handi|印度罐焖鸡
53531|Poulet à l’orange (pollo a la naranja)|橙汁鸡
52831|Poulet karaage|日式炸鸡块
53455|Pâté de foies de volaille|鸡肝酱
53565|Sucettes de poulet (chicken lollipop)|鸡翅棒棒糖
53358|Mandi de poulet|也门焖鸡饭
52920|Poulet Marengo|马伦哥烩鸡
52879|Parmentier de poulet|鸡肉土豆泥焗
53011|Salade grecque au poulet et quinoa|鸡肉藜麦希腊沙拉
53549|Salade de poulet aux champignons et bacon|蘑菇培根鸡肉沙拉
53218|Shawarma de poulet et sauce yaourt ail-herbes maison|鸡肉沙威玛配自制蒜香草本酸奶酱
53261|Ailes de poulet au cumin, citron et ail|孜然柠檬蒜香鸡翅
53186|Poulet au safran, raisins secs et pignons|藏红花葡萄干松子鸡
52870|Fajitas aux pois chiches|鹰嘴豆法士达
53166|Ragoût pois chiches, chorizo et épinards|鹰嘴豆辣肠菠菜炖菜
53516|Dobladitas chiliennes|智利折叠面饼
53514|Empanada chilienne|智利馅饼
53513|Sopaipillas chiliennes|智利南瓜炸饼
53265|Côtelettes d’agneau piment-gingembre|辣椒姜味羊排
52839|Linguine aux crevettes et piment|辣味虾仁扁意面
53365|Poulet à l’orange chinois|中式陈皮橙子鸡
53372|Œufs brouillés sautés à la tomate (Chine)|番茄炒蛋
52910|Tartelettes aux pommes de Chinon|希农苹果挞
53319|Sandwich chivito|奇维托牛排三明治
53063|Chivito uruguayen|乌拉圭奇维托三明治
52856|Tarte aux noix de pécan et pépites de chocolat|巧克力豆山核桃派
53320|Alfajores au chocolat|巧克力阿尔法霍雷斯
52853|Mousse chocolat-avocat|巧克力牛油果慕斯
52966|Carrés croustillants chocolat-caramel|巧克力焦糖脆块
53170|Churros au chocolat, sauce chocolat et caramel salé|巧克力吉事果配巧克力咸焦糖酱
53101|Carrés chocolat-coco|巧克力椰子方块
53324|Empanadas au chocolat|巧克力馅饼
52776|Gâteau au chocolat|巧克力蛋糕
52860|Brownies chocolat-framboise|巧克力覆盆子布朗尼
52905|Soufflé au chocolat|巧克力舒芙蕾
53289|Chorba hamra bel frik (soupe algérienne agneau, tomate et freekeh)|阿尔及利亚羊肉番茄青麦汤
53136|Choripán|阿根廷香肠面包
53168|Soupe chorizo et pois chiches|辣肠鹰嘴豆汤
53157|Salade de chorizo et œuf mollet|辣肠溏心蛋沙拉
53185|Salade chorizo et tomates|辣肠番茄沙拉
53159|Omelette chorizo, pommes de terre et fromage|辣肠土豆奶酪煎蛋饼
53542|Chorreadas (crêpes de maïs du Costa Rica)|哥斯达黎加玉米煎饼
52990|Gâteau de Noël|圣诞蛋糕
52788|Flapjack au pudding de Noël|圣诞布丁燕麦棒
52989|Trifle au pudding de Noël|圣诞布丁乳脂松糕
53283|Chtitha batata (ragoût algérien de pommes de terre)|阿尔及利亚土豆炖菜
53528|Côtes de porc à la créole (chuletas de cerdo)|克里奥尔酱猪排
53153|Churros|吉事果
53116|Brioches à la cannelle|肉桂卷
53462|Biscuits roulés à la cannelle|肉桂卷饼干
52840|Chaudrée de palourdes|蛤蜊浓汤
53154|Ragoût palourdes, chorizo et haricots blancs|蛤蜊辣肠白豆炖菜
52988|Pudding de Noël classique|经典圣诞布丁
53555|Salade de pommes de terre classique|经典土豆沙拉
53343|Tourtière classique|经典加拿大肉派
53446|Bouillon clair aux quenelles de semoule|粗麦面疙瘩清汤
53524|Natilla à la noix de coco|椰子奶冻
53477|Quindim à la noix de coco|巴西椰子蛋黄布丁
53037|Porc mijoté au cidre|苹果酒炖猪肉
53561|Œufs mimosa à la morue|鳕鱼魔鬼蛋
53523|Buñuelos colombiens|哥伦比亚奶酪球
53526|Pommes de terre farcies à la colombienne|哥伦比亚酿土豆
53505|Beignets de lambi|海螺炸饼
53512|Ragoût de lambi|炖海螺
52832|Coq au vin|红酒烩鸡
52977|Čorba (soupe balkanique)|巴尔干浓汤
53431|Épis de maïs au citron vert, piment vert et beurre de coco|青柠青椒椰子黄油烤玉米
52998|Corned-beef au chou|咸牛肉卷心菜
53350|Corned-beef au chou à la jamaïcaine|牙买加风味咸牛肉卷心菜
53096|Hachis de corned-beef|咸牛肉土豆碎
53291|Cornes de gazelle|羚羊角酥
53490|Poivrons farcis cottage cheese et feta|茅屋奶酪菲达酿甜椒
52779|Tarte au fromage frais|奶油奶酪挞
53480|Sauce verte crémeuse à l’ají|奶油阿吉青酱
53532|Velouté de maïs|奶油玉米汤
53569|Smoothie crémeux à la mangue|芒果奶昔
53530|Poulet crémeux à la moutarde|奶油芥末鸡
52841|Velouté de tomates|奶油番茄汤
53148|Crème catalane|加泰罗尼亚焦糖布丁
53072|Aubergines croustillantes|脆皮茄子
53419|Poisson frit croustillant au gingembre et soja fermenté|姜丝豆豉脆炸鱼
52999|Saucisses croustillantes et légumes verts|脆皮香肠配绿叶菜
53058|Ragoût de haricots croate|克罗地亚炖豆
53056|Peka d’agneau croate|克罗地亚铁盖焖羊肉
52830|Tacos de poulet au four à la mijoteuse|慢炖锅烤鸡肉塔可
53547|Sandwich cubain|古巴三明治
53309|Salade concombre et fenouil|黄瓜茴香沙拉
53098|Tourte du Cumberland|坎伯兰肉派
53473|Épinards au curry du Botswana|博茨瓦纳咖喱菠菜
52785|Dal fry|印度炒扁豆
53556|Pain de seigle danois|丹麦黑麦面包
53338|Carrés aux dattes|椰枣方块
53411|Dolma japrak (feuilles de vigne farcies)|酿葡萄叶
53563|Pain mastiff de la Dominique|多米尼克马斯蒂夫面包
53571|Rough cake à la noix de coco de la Dominique|多米尼克椰子粗糕
53567|Bakes dominicains|多米尼克炸面饼
53193|Nouilles de l’ivrogne (pad kee mao)|泰式醉面
52907|Confit de canard|油封鸭
53137|Dulce de leche|牛奶焦糖酱
53543|Cheesecake au dulce de leche sur biscuits Maria|牛奶焦糖芝士蛋糕（玛利亚饼干底）
52899|Cake de Dundee|邓迪蛋糕
53386|Tarte aux pommes néerlandaise|荷兰苹果派
53393|Beignets néerlandais|荷兰甜甜圈
53379|Poffertjes (mini-pancakes néerlandais)|荷兰迷你松饼
53387|Ontbijtkoek (pain d’épices néerlandais)|荷兰香料早餐蛋糕
53382|Stroopwafel néerlandaise|荷兰焦糖华夫饼
53285|Dziriat (tartelettes algériennes aux amandes)|阿尔及利亚杏仁挞
53143|Poulet à l’espagnole facile|简易西班牙鸡
53486|Soupe de haricots blancs facile|简易白豆汤
52888|Eccles cakes|埃克尔斯酥饼
52955|Soupe aux œufs battus (egg drop)|蛋花汤
53370|Egg foo young (omelette chinoise)|芙蓉蛋
53073|Aubergines adobo|阿斗波茄子
53031|Fatteh égyptienne|埃及法特
53134|Empanadas|恩潘纳达馅饼
53518|Empanadas frites au fromage|奶酪炸馅饼
52895|Petit-déjeuner anglais|英式早餐
53149|Ensaïmada|马略卡螺旋面包
52944|Poisson escovitch|牙买加醋腌炸鱼
52791|Eton mess|伊顿麦斯
53557|Ailes de poulet extra croustillantes|超脆鸡翅
53254|Ezme (salade turque pimentée)|土耳其辣番茄沙拉
53139|Fainá (galette de pois chiches)|鹰嘴豆薄饼
53266|Falafels|法拉费
53091|Pita falafel sauce tahini|芝麻酱法拉费皮塔三明治
53123|Fårikål (plat national norvégien)|挪威羊肉卷心菜
53188|Fašírky (boulettes slovaques)|斯洛伐克炸肉饼
53092|Fasoliyyeh bi z-zayt (haricots verts syriens à l’huile d’olive)|叙利亚橄榄油四季豆
52919|Gratin dauphinois au fenouil|茴香焗土豆
53030|Feteer meshaltet (feuilleté égyptien)|埃及千层酥饼
53064|Fettuccine Alfredo|阿尔弗雷多宽面
52835|Fettuccine Alfredo (variante)|阿尔弗雷多宽面（另一做法）
53342|Figgy duff (pudding aux raisins)|葡萄干布丁
53399|Firni (crème de riz afghane)|阿富汗米奶冻
53043|Fofos de poisson|鱼肉炸丸
52802|Hachis de poisson (fish pie)|鱼肉派
53079|Soupe de poisson (oukha)|俄式鱼汤
52918|Ragoût de poisson à la rouille|鱼肉炖配鲁耶酱
53122|Fiskesuppe (soupe de poisson crémeuse norvégienne)|挪威奶油鱼汤
52906|Flamiche|韭葱挞
53322|Flan|焦糖布丁
53341|Flapper pie|弗拉珀奶油派
53464|Hochepot flamand|佛兰德斯炖菜
53413|Flija (crêpe à étages)|阿尔巴尼亚千层饼
52815|Lentilles à la française, ail et thym|蒜香百里香法式扁豆
52915|Omelette française|法式煎蛋卷
52996|Poulet à l’oignon façon soupe à l’oignon, carottes rôties et purée|法式洋葱鸡配烤胡萝卜和土豆泥
52903|Soupe à l’oignon|法式洋葱汤
53061|Sardines fraîches|新鲜沙丁鱼
53178|Calamars frits|炸鱿鱼圈
53572|Banane cocoy frite|炸可可伊香蕉
53509|Crabe frit|炸螃蟹
53553|Frikadeller (boulettes danoises)|丹麦肉丸
53465|Cuisses de grenouille au beurre d’ail|蒜香黄油田鸡腿
52957|Viennoiseries fruits et fromage frais|水果奶油奶酪早餐酥
53025|Foul médamès|埃及蚕豆泥
52896|Full English breakfast|全套英式早餐
53131|Fyrstekake – gâteau du prince norvégien|挪威王子蛋糕
53541|Gallo pinto (riz aux haricots)|加洛平托豆饭
53144|Gambas al ajillo (crevettes à l’ail)|西班牙蒜香虾
52764|Garides saganaki (crevettes à la grecque)|希腊番茄菲达烤虾
53180|Crevettes à l’ail et au xérès|雪利酒蒜香虾
52951|Poulet du général Tso|左宗棠鸡
53381|Gevulde speculaas (spéculoos fourré)|夹心焦糖香料饼
53012|Gigantes plaki (haricots géants au four)|希腊烤巨豆
53578|Gaufres au pain d’épices|姜饼华夫饼
53021|Gołąbki (chou farci)|波兰卷心菜卷
53346|Glace Grape-Nuts|葡萄坚果冰淇淋
53274|Aubergines grillées sauce sésame|芝麻酱烤茄子
53272|Galettes de pain à la poêle|平底锅烤饼
53255|Aubergines grillées, pois chiches épicés et sauce aux noix|烤茄子配香辣鹰嘴豆和核桃酱
53478|Maïs grillé mayo à l’ail et fromage râpé|蒜香蛋黄酱芝士烤玉米
53074|Aubergines grillées au lait de coco|椰奶烤茄子
52829|Sandwich grillé au mac and cheese|芝士通心粉烤三明治
53041|Sardines grillées à la portugaise|葡式烤沙丁鱼
53450|Grits (bouillie de maïs)|玉米粗粥
53397|Haft mewa (compote aux sept fruits secs)|阿富汗七果甜汤
53179|Croquetas au jambon|火腿可乐饼
53035|Colcannon au jarret de porc|猪肘卷心菜土豆泥
53452|Handesh – galettes bangladaises farine de riz et mélasse de dattes|孟加拉米粉椰枣糖蛋糕
53340|Hodge podge (potée de légumes d’été)|夏季蔬菜炖
52967|Mandazi maison|自制东非炸面包
52993|Poulet miel-balsamique, brocoli croustillant et pommes de terre|蜂蜜香醋鸡配脆西兰花和土豆
53579|Biscuits au miel|蜂蜜饼干
52773|Saumon teriyaki au miel|蜂蜜照烧三文鱼
53007|Cheesecake au yaourt et miel|蜂蜜酸奶芝士蛋糕
52954|Soupe aigre-piquante|酸辣汤
52787|Fudge au chocolat chaud|热巧克力软糖
53258|Wrap d’agneau au cumin, salade croquante et mayo épicée|孜然羊肉卷配脆沙拉和辣蛋黄酱
53269|Houmous|鹰嘴豆泥
53552|Hveder (petits pains danois)|丹麦小麦面包
53253|Imam bayildi, agneau au barbecue et tzatziki|伊玛目晕倒酿茄子配烤羊肉和酸奶黄瓜酱
52781|Ragoût irlandais|爱尔兰炖菜
53436|Jajek (soupe froide au yaourt)|酸奶黄瓜冷汤
53339|Biscuits jam jam|果酱夹心饼干
52890|Roulé à la confiture (jam roly-poly)|果酱卷布丁
53351|Beignets de banane jamaïcains|牙买加香蕉炸饼
52938|Chaussons jamaïcains au bœuf|牙买加牛肉饼
53353|Boulettes de pâte bouillies jamaïcaines|牙买加水煮面团
53363|Bouillie de maïs jamaïcaine|牙买加玉米粥
53345|Poulet au curry jamaïcain|牙买加咖喱鸡
53354|Curry de chèvre jamaïcain|牙买加咖喱羊肉
53362|Crevettes au curry jamaïcain|牙买加咖喱虾
53355|Festival jamaïcain (beignet sucré)|牙买加甜面团
53356|Beignets de pâte frits jamaïcains|牙买加炸面团
53352|Riz aux haricots jamaïcain à l’Instant Pot|牙买加电压力锅豆饭
53349|Crevettes poivrées jamaïcaines|牙买加胡椒虾
53357|Riz aux pois rouges jamaïcain|牙买加红豆饭
53348|Spice bun jamaïcain|牙买加香料面包
53364|Chou vapeur jamaïcain|牙买加蒸卷心菜
53344|Pudding de patate douce jamaïcain|牙买加红薯布丁
53145|Croquetas jamón et ail des ours|伊比利亚火腿野蒜可乐饼
53033|Riz japonais (gohan)|日式米饭
53034|Katsudon japonais|日式炸猪排盖饭
52937|Poulet jerk, riz et pois|牙买加烟熏辣鸡配豆饭
53335|Jiggs dinner (potée de Terre-Neuve)|纽芬兰咸牛肉炖菜
53220|Kabsa|卡布萨焖饭
53398|Kadu borani (courge au yaourt)|阿富汗南瓜酸奶
52971|Kafteji (légumes frits tunisiens)|突尼斯炸蔬菜杂烩
52769|Kapsalon|荷兰理发店烤肉薯条
53125|Karbonader (steaks hachés) aux oignons caramélisés|焦糖洋葱挪威牛肉饼
53445|Kaspressknödel (galettes au fromage)|奥地利奶酪团子
52820|Curry japonais au poulet katsu|日式炸鸡咖喱
52887|Kedgeree|英式咖喱鱼饭
53449|Kelem dolmasi (chou farci)|阿塞拜疆酿卷心菜
52974|Keleya zaara (agneau mijoté)|阿尔及利亚炖羊肉
52813|Poulet frit façon Kentucky|肯德基式炸鸡
53112|Curry de bœuf kényan|肯尼亚咖喱牛肉
53494|Banitsa céto|生酮保加利亚馅饼
52859|Tarte au citron vert (key lime pie)|青柠派
53502|Banh xeo khmer – crêpe salée cambodgienne|柬埔寨咸煎饼
53286|Khobz el dar (pain algérien à la semoule)|阿尔及利亚粗麦面包
52868|Curry de haricots rouges|红芸豆咖喱
53216|Knafeh|库纳法
53257|Burgers de kefta|肉丸汉堡
53027|Koshari|埃及杂豆饭
53434|Koulenje (biscuits sucrés)|库连杰甜饼
53015|Donut façon Krispy Kreme|可颂甜甜圈
53408|Pain au bicarbonate kulaç|库拉奇苏打面包
52978|Kumpir (pomme de terre farcie turque)|土耳其烤土豆
52945|Poulet kung pao|宫保鸡丁
52946|Crevettes kung pao|宫保虾球
53414|Biscuits au beurre kurabie|库拉比黄油饼干
53128|Gâteau de Kvæfjord « meilleur du monde »|挪威“世界最好”蛋糕
53412|Lakra me mish (ragoût de chou et viande)|卷心菜炖肉
53407|Lakror me kungull (tourte à la courgette)|阿尔巴尼亚西葫芦馅饼
52821|Nouilles laksa aux gambas|叻沙大虾面
53277|Boulettes d’agneau aux abricots|杏子羊肉丸
53009|Souvlaki d’agneau au citron|柠檬羊肉串
52877|Tourte agneau et pommes de terre|羊肉土豆派
52805|Biryani d’agneau|羊肉香饭
53083|Plov à l’agneau (pilaf)|羊肉手抓饭
52808|Rogan josh d’agneau|红咖喱羊肉
52843|Tajine d’agneau|塔吉锅炖羊肉
52782|Agneau aux tomates et épices douces|番茄香料炖羊肉
53010|Burgers d’agneau au tzatziki|酸奶黄瓜酱羊肉汉堡
53104|Lamingtons|拉明顿蛋糕
52884|Hotpot du Lancashire|兰开夏炖锅
53427|Naem khao laotien (salade de riz croustillant)|老挝脆米沙拉
53426|Som pak laotien (chou fermenté)|老挝酸菜
53424|Gâteau laotien banane plantain et coco (sans farine)|老挝椰子芭蕉烤糕（无面粉）
52987|Sandwichs lasagne|千层面三明治
52844|Lasagnes|千层面
53570|Flan à la mangue en couches|芒果千层布丁
52973|Soupe leblebi (pois chiches tunisiens)|突尼斯鹰嘴豆汤
53519|Leche asada (flan chilien)|智利烤牛奶布丁
53437|Gigot d’agneau à l’arménienne|亚美尼亚风味烤羊腿
53211|Ragoût de bœuf à la citronnelle et nouilles|香茅炖牛肉配面条
53467|Salade liégeoise|列日沙拉
53146|Locro|洛克罗炖菜
52947|Tofu mapo|麻婆豆腐
53461|Gratin de macaronis|焗通心粉派
53504|Pudding aux macaronis|通心粉布丁
52900|Cake de Madère|马德拉蛋糕
53472|Madombi : boulettes du Botswana|博茨瓦纳面团子
53474|Magwinya : beignets du Botswana|博茨瓦纳炸面球
53221|Maamoul (biscuits de l’Aïd)|开斋节枣泥饼
53433|Mango chow (mangue pimentée)|辣拌芒果
53538|Salsa tropicale à la mangue|热带芒果莎莎酱
53515|Manjar (dulce de leche)|智利牛奶焦糖
53402|Mantu (raviolis afghans)|阿富汗蒸饺
52827|Curry massaman au bœuf|马沙文咖喱牛肉
53400|Mastawa (agneau et riz)|阿富汗羊肉米饭
53140|Matambre a la pizza|披萨风味牛腩
52865|Matar paneer (petits pois et fromage)|豌豆奶酪咖喱
53132|Mazariner – tartelettes scandinaves aux amandes|斯堪的纳维亚杏仁小挞
52968|Mbuzi choma (chèvre rôtie)|肯尼亚烤羊肉
52880|Scotch pie de McSingh|麦克辛格苏格兰肉派
53423|Miang nem (bouchées laotiennes)|老挝生菜包
52777|Salade de pâtes méditerranéenne|地中海意面沙拉
53048|Mee goreng mamak (nouilles sautées)|马来炒面
53086|Migas|西班牙面包丁炒
53135|Milanesa|米兰式炸肉排
52991|Mince pies|圣诞百果馅饼
52876|Tourte au bœuf haché|牛肉末派
53304|Mini-bundt cakes|迷你咕咕霍夫
53560|Mini-petits pains au beurre|迷你黄油小面包
53109|Mini-tourtes bœuf-piment|迷你辣牛肉派
53336|Haricots au four à la mélasse|糖蜜焗豆
52927|Smoked meat de Montréal|蒙特利尔烟熏牛肉
53047|Soupe de carottes marocaine|摩洛哥胡萝卜汤
53006|Moussaka|穆萨卡
53029|Mouloukhiya|埃及黄麻菜汤
53403|Muraba-e-kadu (confiture de potiron)|阿富汗南瓜果酱
52864|Rotolo champignons et châtaignes|蘑菇栗子意面卷
53059|Soupe aux champignons et sarrasin|荞麦蘑菇汤
53038|Champ à la moutarde|芥末葱香土豆泥
53223|Mutabbaq (crêpe farcie)|阿拉伯酿薄饼
52924|Barres Nanaimo|纳奈莫条
53377|Chou chinois aux crevettes séchées|虾米炒大白菜
53051|Nasi lemak|椰浆饭
52858|Cheesecake new-yorkais|纽约芝士蛋糕
53347|Glace rhum-raisin sans sorbetière|免搅拌朗姆葡萄干冰淇淋
53497|Nom banh chok – soupe de nouilles cambodgienne|柬埔寨米线汤
53245|Bol de nouilles en salade|凉拌面碗
53117|Smørrebrød nordique aux asperges et crème de raifort|北欧芦笋辣根奶油开放三明治
53129|Krumkake norvégien|挪威卷饼
53121|Lefse norvégien aux pommes de terre|挪威土豆薄饼
53500|Num ansom – gâteau de riz gluant|柬埔寨粽子
53422|Num e (boules de riz gluant au sirop et crème de coco)|椰浆糖浆糯米球
53501|Num pang – sandwich baguette cambodgien|柬埔寨法棍三明治
52851|Curry de poulet aux noix|坚果咖喱鸡
53331|Pancakes à l’avoine|燕麦松饼
53551|Trifle danois aux pommes à l’ancienne|丹麦传统苹果松糕
53554|Tartine ouverte aux pommes de terre|土豆开放三明治
52810|Osso-buco à la milanaise|米兰炖小牛胫
52943|Queue de bœuf aux fèves|蚕豆炖牛尾
53487|Soupe aux pleurotes|平菇汤
53417|Pa amb tomàquet (pain à la tomate)|加泰罗尼亚番茄面包
52774|Pad see ew|泰式酱油炒河粉
53191|Pad thaï|泰式炒河粉
53150|Pimientos de padrón|帕德龙小青椒
53151|Paella|西班牙海鲜饭
53537|Pain de yuca|木薯面包
53152|Merlu poêlé, bouillon de haricots blancs et chorizo|香煎无须鳕配白豆辣肠汤
53192|Curry panang au poulet (kaeng panang gai)|帕能咖喱鸡
52854|Pancakes|美式松饼
53534|Papas chorreadas (pommes de terre sauce crème et fromage)|奶油芝士酱土豆
53573|Salade de papaye|青木瓜沙拉
53429|Paracuca (cacahuètes grillées)|焦糖烤花生
52902|Parkin (pain d’épices à l’avoine)|英式燕麦姜饼
53333|Mousse aux fruits de la passion|百香果慕斯
53520|Pastel de choclo (gratin de maïs chilien)|智利玉米派
53517|Pastel de papas (hachis parmentier chilien)|智利土豆派
53017|Paszteciki (chaussons polonais)|波兰肉馅卷
53172|Patatas bravas|西班牙辣味土豆
52930|Pâté chinois|魁北克牧羊人派
52862|Grunt pêche-myrtille|桃子蓝莓炖面团
52861|Cheesecake au beurre de cacahuète|花生酱芝士蛋糕
52958|Biscuits au beurre de cacahuète|花生酱饼干
52916|Tarte Tatin aux poires|梨子反烤挞
53471|Galettes phaphatha|博茨瓦纳平底锅面包
53539|Picadillo de vainicas (haricots verts au picadillo)|四季豆碎肉
53292|Piernik (pain d’épices polonais)|波兰姜饼
53019|Pierogi (raviolis polonais)|波兰饺子
52837|Puttanesca aux pilchards|沙丁鱼烟花女意面
53039|Poulet piri-piri et coleslaw|霹雳辣鸡配凉拌卷心菜
53293|Gâteau à la pistache|开心果蛋糕
53224|Gâteau et cupcakes chocolat-pistache façon kunafa|开心果库纳法巧克力蛋糕和纸杯蛋糕
53160|Pisto con huevos (ratatouille espagnole aux œufs)|西班牙蔬菜杂烩配蛋
53014|Margherita façon Pizza Express|玛格丽特披萨
53566|Roulés au plantain|芭蕉卷
53295|Gâteau polonais chocolat-noix|波兰巧克力核桃蛋糕
53298|Beignets polonais (pączki)|波兰甜甜圈
53299|Galettes de viande polonaises (kotlety)|波兰肉饼
53162|Pollo en pepitoria (poulet sauce aux amandes)|杏仁蛋黄酱炖鸡
53540|Pollo en salsa (poulet en sauce)|酱汁炖鸡
53022|Naleśniki (crêpes polonaises)|波兰薄煎饼
53297|Salade de grenade|石榴沙拉
53301|Goulash de porc à la choucroute|酸菜炖猪肉
52847|Cassoulet au porc|猪肉什锦砂锅
53306|Bortsch aux travers de porc|猪肋排罗宋汤
53521|Porotos granados (ragoût chilien de haricots)|智利鲜豆炖菜
53044|Porc grillé à la portugaise (febras assadas)|葡式烤猪肉片
53046|Pastéis de nata|葡式蛋挞
53045|Caldeirada de peixe (ragoût de poisson portugais)|葡式炖鱼
53042|Prego portugais au piri-piri vert|葡式牛排面包配青霹雳酱
53323|Postre chajá (gâteau meringué uruguayen)|乌拉圭恰哈蛋糕
52780|Gratin de pommes de terre au poulet|鸡肉焗土豆
53489|Moussaka aux pommes de terre|土豆穆萨卡
53081|Salade Olivier (salade russe)|俄式土豆沙拉
52932|Pouding chômeur|魁北克失业者布丁
53280|Poulet rôti à l’algérienne|阿尔及利亚烤鸡
52804|Poutine|肉汁奶酪薯条
53499|Prahok ktis – dip porc et coco|柬埔寨椰浆鱼酱肉末蘸酱
52922|Bisque crevettes et fenouil|鲜虾茴香浓汤
53244|Salade crevettes et nouilles, échalotes croustillantes|脆葱虾仁拌面
53200|Sauté de crevettes|炒虾仁
53174|Crevettes sauce romesco|罗曼斯科酱虾
53410|Presh me oriz (gratin poireaux et riz)|韭葱米饭焗菜
52921|Gâteau d’omelettes provençal|普罗旺斯千层蛋饼
52857|Tarte au potiron|南瓜派
53230|Tempura de brocoli violet et nuoc cham|紫芽西兰花天妇罗配越南鱼露酱
53574|Tarte quark et rhubarbe|夸克奶酪大黄派
53173|Gaspacho express|快手西班牙冷汤
53108|Calamars sel et poivre express|快手椒盐鱿鱼
53383|Ramen à l’œuf mollet|溏心蛋拉面
52933|Rappie pie (râpure acadienne)|阿卡迪亚土豆鸡肉派
53303|Mousse à la framboise|覆盆子慕斯
53124|Raspeballer (boulettes norvégiennes de pommes de terre)|挪威土豆团子
52908|Ratatouille|普罗旺斯炖菜
52809|Poisson masala recheado|果阿酿香料鱼
53204|Brochettes de poulet au curry rouge|红咖喱鸡肉串
53115|Pickles d’oignons rouges|腌红洋葱
52941|Soupe de pois rouges|红豆汤
52811|Ribollita|托斯卡纳面包蔬菜汤
53506|Riz aux haricots|豆饭
53227|Raviolis en feuilles de riz|米纸饺子
52783|Rigatoni sauce saucisse au fenouil|茴香香肠酱水管面
53273|Aubergine rôtie, chèvre et pain plat grillé|烤茄子配山羊奶酪和烤饼
52942|Paella fenouil et aubergine rôtis|烤茴香茄子海鲜饭
53268|Poulet rôti sauce crémeuse aux noix|奶油核桃酱烤鸡
52816|Aubergine rôtie au tahini, pignons et lentilles|芝麻酱松子扁豆烤茄子
52901|Rock cakes|英式岩石蛋糕
52786|Fudge rocky road|石板街软糖
53024|Rogaliki (croissants-biscuits polonais)|波兰牛角小饼
53118|Rømmegrøt – bouillie norvégienne à la crème aigre|挪威酸奶油粥
53545|Ropa vieja|古巴手撕牛肉
53315|Chou rouge braisé au romarin et kabanos|迷迭香焖红甘蓝配波兰香肠
53020|Rosół (bouillon de poulet polonais)|波兰鸡汤
53052|Roti john|罗蒂约翰蛋肉三明治
53388|Purée aux haricots plats (snijbonen stamppot)|荷兰扁豆土豆泥
53308|Pain de seigle|黑麦面包
52960|Salade saumon et avocat|三文鱼牛油果沙拉
52962|Œufs Bénédicte au saumon et œufs de saumon|三文鱼班尼迪克蛋
53234|Soupe de nouilles au saumon|三文鱼汤面
53248|Wraps saumon et nouilles|三文鱼面条卷
52823|Risotto saumon et crevettes|三文鱼鲜虾烩饭
53233|Calamars sel et poivre|椒盐鱿鱼
53511|Bœuf salé aux haricots|咸牛肉炖豆
53171|Tortilla à la morue|鳕鱼西班牙蛋饼
52833|Cheesecake au caramel salé|咸焦糖芝士蛋糕
52936|Morue salée et ackee|阿基果炒咸鱼
53498|Samlar kari – curry rouge khmer|高棉红咖喱
53503|Samlar machu kreung – ragoût aigre cambodgien|柬埔寨酸汤
53337|Tarte aux amélanches (Saskatoon)|萨斯卡通莓派
53443|Saté|沙爹串
53577|Salade de choucroute et poisson|酸菜鱼沙拉
53296|Pierogi à la choucroute|酸菜波兰饺子
53314|Pierogi à la choucroute (variante)|酸菜波兰饺子（另一做法）
53247|Bar au gingembre grésillé, piment et oignons nouveaux|姜葱辣椒浇汁鲈鱼
52836|Fideuà aux fruits de mer|海鲜细面饭
53167|Riz aux fruits de mer|海鲜饭
53054|Seri muka (kuih au riz gluant et pandan)|班兰糯米糕
53378|Salade de concombre au sésame|芝麻拌黄瓜
53470|Seswaa (bœuf effiloché du Botswana)|博茨瓦纳手撕牛肉
53215|Chakchouka|北非番茄炖蛋
52963|Chakchouka (variante)|北非番茄炖蛋（另一做法）
53219|Chakchouka à la feta|菲达奶酪番茄炖蛋
53028|Shawarma|沙威玛
53226|Pain à shawarma|沙威玛饼
53217|Wrap de shawarma au paleron rôti|烤牛肩肉沙威玛卷
53409|Shendetlie (gâteau au miel et aux noix)|阿尔巴尼亚蜂蜜坚果蛋糕
53491|Salade chopska|保加利亚肖普斯卡沙拉
52953|Ho fun sautés aux crevettes|虾仁炒河粉
53375|Crevettes aux pois gourmands|荷兰豆炒虾仁
53374|Aubergines du Sichuan|鱼香茄子
53371|Haricots kilomètre sautés à la sichuanaise|干煸豆角
53369|Tofu soyeux sauce soja-sésame|麻酱淋嫩豆腐
53484|Salade cœurs de palmier et tomates|棕榈心番茄沙拉
53368|Nouilles de Singapour aux crevettes|星洲炒米粉
52994|Côtes de porc aux pommes à la poêle, patates douces et courgettes rôties|苹果煎猪排配烤红薯和西葫芦
53395|Slagroomtaart (gâteau à la crème néerlandais)|荷兰鲜奶油蛋糕
53023|Śledź w oleju (harengs polonais à l’huile)|波兰油浸鲱鱼
53432|Poitrine de porc cubano aux épices de Wadadli, cuite lentement|慢炖瓦达德利香料古巴五花肉
53260|Agneau rôti lentement à la cannelle, fenouil et agrumes|肉桂茴香柑橘慢烤羊肉
53302|Jambon rôti lentement au citron, ail et sauge|柠檬蒜香鼠尾草慢烤火腿
53259|Purée d’aubergine fumée|烟熏茄子泥
52964|Kedgeree au haddock fumé|烟熏黑线鳕咖喱饭
53264|Brochettes de poulet fumées|烟熏鸡肉串
52784|Chili de lentilles fumé à la courge|南瓜烟熏扁豆辣酱
53479|Salsa fumée tomate-poivron|烟熏番茄甜椒莎莎酱
52981|Snert (soupe néerlandaise aux pois cassés)|荷兰豌豆汤
52992|Pains de viande laqués au soja, purée au wasabi et carottes rôties|酱油烤肉饼配芥末土豆泥和烤胡萝卜
52982|Spaghetti à la carbonara|卡邦尼意面
52770|Spaghetti bolognaise|肉酱意面
53177|Spaghetti aux saveurs espagnoles|西班牙风味意面
53181|Haricots à l’espagnole, poulet et chorizo|西班牙鸡肉辣肠炖豆
53164|Poulet à l’espagnole|西班牙风味鸡
53155|Tourte au poulet à l’espagnole|西班牙鸡肉派
53163|Boules espagnoles figue-amande|西班牙无花果杏仁球
53183|Boulettes espagnoles aux palourdes, chorizo et calamars|蛤蜊辣肠鱿鱼西班牙肉丸
53184|Riz aux crevettes à l’espagnole en cocotte|西班牙鲜虾一锅饭
53182|Riz aux fruits de mer à l’espagnole|西班牙海鲜饭
53176|Pain à la tomate et jamón serrano|番茄面包配塞拉诺火腿
52872|Tortilla espagnole|西班牙土豆蛋饼
53175|Épaule d’agneau mijotée et haricots à l’espagnole|西班牙慢炖羊肩配豆子
53105|Poulet barbecue fumé et épicé|香料烟熏烤鸡
53142|Tortilla épicée|香辣蛋饼
52771|Penne all’arrabbiata|香辣番茄笔管面
52797|Salade de pommes de terre épicée d’Afrique du Nord|北非香辣土豆沙拉
53209|Nouilles thaïes épicées aux crevettes|泰式香辣虾面
52849|Cannellonis épinards-ricotta|菠菜乳清干酪意式面卷
52925|Soupe aux pois cassés|豌豆汤
52886|Spotted dick (pudding aux raisins)|英式葡萄干布丁
53040|Empanadas crevettes et oignons nouveaux|葱香鲜虾馅饼
52866|Linguine à la courge|南瓜扁意面
53102|Salade calamars, pois chiches et chorizo|鱿鱼鹰嘴豆辣肠沙拉
52980|Stamppot|荷兰蔬菜土豆泥
53229|Salade de nouilles vietnamienne au bœuf|越南牛肉凉拌米线
52881|Tourte steak et rognons|牛排腰子派
52935|Steak Diane|戴安娜牛排
53110|Poulet laqué|黏糖鸡
52883|Sticky toffee pudding|太妃糖布丁
52793|Sticky toffee pudding ultime|终极太妃糖布丁
53201|Poulet sauté au piment et basilic|辣椒罗勒炒鸡
52817|Aubergines à la poêle, harissa, pois chiches et yaourt au cumin|哈里萨鹰嘴豆孜然酸奶煎茄子
53082|Fraises Romanoff|罗曼诺夫草莓
53005|Tarte fraise-rhubarbe|草莓大黄派
53550|Tarte aux fraises|草莓挞
53067|Poivrons farcis au quinoa et haricots noirs|藜麦黑豆酿甜椒
53435|Feuilles de vigne farcies|酿葡萄叶
53008|Tomates farcies à l’agneau|羊肉酿番茄
53558|Coupelles de plantain farcies|酿芭蕉杯
52931|Tarte au sucre|糖派
53130|Suksessterte (gâteau norvégien aux amandes « succès »)|挪威杏仁“成功蛋糕”
53113|Sukuma wiki (chou kale sauté)|肯尼亚炒羽衣甘蓝
53187|Šúľance s makom (gnocchis au pavot)|罂粟籽土豆面条
52911|Soupe au pistou d’été|夏日香蒜蔬菜汤
52889|Summer pudding|夏日布丁
53065|Sushis|寿司
53376|Poulet aigre-doux|糖醋鸡
52949|Porc aigre-doux|糖醋里脊
53275|Salade de patates douces|红薯沙拉
53089|Pain syrien|叙利亚面包
53095|Riz syrien à la viande|叙利亚肉饭
53093|Spaghetti syriens|叙利亚意面
52950|Bœuf du Sichuan|川味牛肉
53447|Tafelspitz (bœuf bouilli viennois)|维也纳清炖牛肉
52869|Lentilles au tahini|芝麻酱扁豆
53287|Tajine de poulet aux carottes et patates douces|胡萝卜红薯鸡肉塔吉锅
53119|Skoleboller (brioches norvégiennes)|挪威学校面包
53535|Tamal de maïzena|玉米淀粉塔玛尔
53026|Ta’amiya (falafels égyptiens)|埃及蚕豆炸丸子
52806|Poulet tandoori|唐杜里烤鸡
53312|Coleslaw acidulé|酸爽卷心菜沙拉
53246|Salade acidulée carotte, chou et oignon|酸爽胡萝卜卷心菜洋葱沙拉
52909|Tarte Tatin|反烤苹果挞
53404|Tavë kosi (agneau au four au yaourt)|阿尔巴尼亚酸奶烤羊肉
53405|Tavë me presh (gratin de poireaux sans viande)|阿尔巴尼亚素韭葱焗菜
53448|Tendir çöreyi (pain au four tandoor)|馕坑烤饼
52772|Gratin de poulet teriyaki|照烧鸡肉焗饭
53199|Sauté de bœuf thaï|泰式炒牛肉
53206|Galettes de poulet thaïes, sauce chili douce|泰式鸡肉饼配甜辣酱
53208|Bouillon thaï coco et légumes|泰式椰汁蔬菜汤
53195|Soupe de nouilles thaïe au curry|泰式咖喱汤面
53212|Pilons de poulet à la thaïe|泰式鸡腿
53198|Riz sauté thaï aux crevettes et petits pois|泰式虾仁豌豆炒饭
53214|Soupe verte thaïe au poulet|泰式绿咖喱鸡汤
52814|Curry vert thaï|泰式绿咖喱
53197|Curry thaï porc et cacahuètes|泰式花生猪肉咖喱
53205|Curry thaï aux crevettes|泰式咖喱虾
53210|Soupe thaïe au potiron|泰式南瓜汤
53203|Salade thaïe de nouilles de riz|泰式米粉沙拉
53213|Bouillon de poisson à la thaïe et légumes verts|泰式青菜鱼汤
53202|Poisson vapeur à la thaïe|泰式清蒸鱼
52882|Hachis aux trois poissons|三鱼派
52912|Soufflés aux trois fromages|三芝士舒芙蕾
52929|Timbits (beignets ronds)|甜甜圈球
53444|Knödel tyroliens|蒂罗尔面包团子
52822|Toad in the hole (saucisses en pâte à Yorkshire)|约克郡布丁烤香肠
53240|Sauté de tofu, légumes verts et noix de cajou|腰果青菜炒豆腐
53207|Tom kha gai (soupe coco au poulet)|泰式椰汁鸡汤
53196|Soupe tom yum aux crevettes (aigre-piquante)|冬阴功虾汤
53194|Soupe tom yum aux crevettes|冬阴功汤
53032|Porc tonkatsu|日式炸猪排
53415|Torrijas (pain perdu espagnol)|西班牙法式吐司
53165|Torrijas au xérès|雪利酒西班牙法式吐司
53318|Torta de fiambre (sandwich-gâteau uruguayen)|乌拉圭冷肉三明治蛋糕
53075|Tortang talong (omelette d’aubergine)|菲律宾茄子煎蛋
52926|Tourtière|加拿大肉派
53057|Goulash croate traditionnel|传统克罗地亚炖牛肉
53391|Tarte au riz néerlandaise (rijstevlaai)|荷兰米布丁挞
52892|Tarte à la mélasse (treacle tart)|糖浆挞
53416|Trinxat (pommes de terre, chou et lard)|卷心菜土豆培根饼
52975|Briks au thon et à l’œuf|金枪鱼鸡蛋布里克
52852|Salade niçoise au thon|尼斯金枪鱼沙拉
52972|Soupe tunisienne à l’agneau|突尼斯羊肉汤
52970|Gâteau tunisien à l’orange|突尼斯橙子蛋糕
53249|Bánh mì à la dinde|火鸡越南法棍
52845|Pain de viande à la dinde|火鸡肉饼
53251|Lahmacun turc|土耳其薄饼披萨
53263|Pilaf d’agneau turc|土耳其羊肉抓饭
53252|Riz turc aux vermicelles|土耳其粉丝米饭
53270|Agneau à la turque|土耳其风味羊肉
53114|Ugali – semoule de maïs kényane|肯尼亚玉米糊
53321|Alfajores à la vanille|香草阿尔法霍雷斯
53250|Bánh mì vegan|纯素越南法棍
52794|Gâteau au chocolat vegan|纯素巧克力蛋糕
52775|Lasagnes vegan|纯素千层面
53000|Hachis parmentier végétarien|素食牧羊人派
52863|Cocotte végétarienne|素食砂锅
52867|Chili végétarien|素食辣豆酱
53222|Chakchouka végétarienne|素食番茄炖蛋
52838|Ragù de canard vénitien|威尼斯鸭肉酱
53325|Arepas vénézuéliennes|委内瑞拉玉米饼
53327|Poulet au coco vénézuélien|委内瑞拉椰子鸡
53326|Sancocho vénézuélien|委内瑞拉炖汤
53328|Bœuf effiloché vénézuélien|委内瑞拉手撕牛肉
53332|Chaussons vénézuéliens|委内瑞拉馅饼
53228|Truite au caramel vietnamienne|越南焦糖鳟鱼
53232|Salade de poulet vietnamienne|越南鸡肉沙拉
52828|Porc grillé vietnamien (bún thịt nướng)|越南烤肉米粉
53231|Souris d’agneau vietnamiennes aux patates douces|越南红薯炖羊腿
53237|Salade de porc vietnamienne|越南猪肉沙拉
53243|Rouleaux vietnamiens aux crevettes et légumes en spirale|越南鲜虾蔬菜卷
53241|Papillotes de légumes vietnamiennes|越南蔬菜卷
53235|Porc au caramel à la vietnamienne|越南焦糖猪肉
53236|Fondue vietnamienne aux légumes|越南素火锅
53062|Gužvara (roulé aux noix)|核桃卷
53271|Gâteau noix, dattes et miel|核桃椰枣蜂蜜蛋糕
53106|Salade tiède d’asperges rôties|温热烤芦笋沙拉
52917|Crème brûlée au chocolat blanc|白巧克力焦糖布丁
52948|Wontons|馄饨
52871|Yaki udon|日式炒乌冬
53225|Lahsa yéménite (chakchouka de luxe)|也门番茄炖蛋
53097|Yorkshire puddings|约克郡布丁
53294|Zapiekanki (baguettes gratinées polonaises)|波兰烤法棍
53394|Zeeuwse bolussen (brioches roulées de Zélande)|泽兰肉桂卷
53189|Zemiakové placky (galettes de pommes de terre slovaques)|斯洛伐克土豆饼
`;

const RECIPE_NAMES = {};
RECIPE_NAMES_RAW.trim().split('\n').forEach(line => {
  const [id, fr, zh] = line.split('|');
  RECIPE_NAMES[id] = { fr, zh };
});
