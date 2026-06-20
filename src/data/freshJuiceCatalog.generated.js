// Generated from "каталог_FJ_2020_prew (2).pdf".
// Product images are stored in public/products/fresh-juice-clean/.

const uzumShopUrl = "https://uzum.uz/uz/shop/beautyh";
const sourceName = "Fresh Juice PDF catalog 2020";

const categoryLabels = {
  "body-care": "Уход за телом",
  bath: "Ванна и мыло",
  "lip-care": "Уход за губами",
  "shower-gels": "Гели для душа",
};

const purposes = {
  "body-care": {
    ru: "Уход за телом, комфорт кожи и яркий фруктовый аромат.",
    uz: "Tana parvarishi, teri qulayligi va yorqin mevali aromat.",
  },
  bath: {
    ru: "Ванна, мыло или расслабляющий домашний уход.",
    uz: "Vanna, sovun yoki uyda dam beruvchi parvarish.",
  },
  "lip-care": {
    ru: "Защита и увлажнение губ.",
    uz: "Lablarni himoya qilish va namlantirish.",
  },
  "shower-gels": {
    ru: "Деликатное очищение тела в душе.",
    uz: "Dushda tanani nozik tozalash.",
  },
};

const descriptions = {
  bodyPeeling:
    "Благодаря скрабирующим частицам из пудры кокосового ореха, пилинг для тела Fresh Juice нежно массажирует кожу, очищая ее от ороговевших клеток. После применения пилинга увлажненная и идеально мягкая кожа подготовлена к последующим процедурам.",
  sugarScrub: "Сахарный скраб отлично скрабирует и способствует обновлению кожи, придает гладкость и упругость.",
  bodyButter:
    "Тающее крем-масло эффективно ухаживает даже за самой сухой кожей, питает и смягчает ее. Тает на коже, мгновенно впитывается: никакой пленки, только нежная шелковистая кожа.",
  lipBalm:
    "Гигиеническая помада Fresh Juice в индивидуальной упаковке помогает защитить губы от сухости, дарит фруктовый аромат и комфортный ежедневный уход.",

  mistWinterCherry:
    "Освежающий мист для тела с ароматом зимней вишни и маслом ши. Увлажняет кожу, смягчает и дарит легкий ягодный аромат, подходит для ежедневного использования.",
  mistYuzuMandarin:
    "Освежающая вода с искрящимся ароматом спелого мандарина и экзотического юзу обладает выраженным увлажняющим эффектом. Она мгновенно впитывается, устраняя ощущение сухости и стянутости, и оставляет на теле легкий, тонизирующий шлейф.",
  mistRoyalPapaya:
    "Легкая вода с приятным освежающим эффектом невесомо ложится на тело, оставляя после себя сочный и бодрящий аромат спелой папайи. Мист мгновенно устраняет ощущение сухости и стянутости, даря коже комфорт и активный заряд энергии на продолжительное время.",
  mistTropicalMangoLemon:
    "Освежающая вода нежно ухаживает за телом, смягчая кожу и поддерживая ее оптимальный уровень увлажненности. С каждым распылением кожа получает порцию приятной прохлады и яркий, сочный аромат сладкого манго с легкой цитрусовой кислинкой лимона.",
  mistRhubarbCranberries:
    "Освежающая вода обладает выраженным увлажняющим эффектом. Она мгновенно устраняет чувство сухости и стянутости, невесомо ложится на тело и оставляет после себя интригующий, слегка терпкий кисло-сладкий аромат хрустящего ревеня и спелой клюквы.",
  mistPassionFruitTiare:
    "Вода с приятным освежающим эффектом невесомо ложится на тело, оставляя после себя притягательный и сладковатый аромат сочной маракуйи и распустившегося цветка тиаре. Мист мгновенно убирает ощущение сухости, даря коже комфорт, увлажнение и легкий заряд энергии на весь день.",

  bathSaltWinterCherry:
    "Растворяясь в теплой воде, кристаллики соли наполняют ванную комнату сочным, согревающим ароматом спелой вишни. Принятие такой ванны помогает снять физическую усталость, расслабить мышцы после тяжелого дня и восстановить эмоциональное равновесие.",
  bathSaltTropicalMangoLemon:
    "Кристаллики соли быстро растворяются в воде, наполняя пространство ванной комнаты ярким, экзотическим ароматом сладкого манго и освежающего лимона. Принятие такой ванны отлично тонизирует, помогает снять накопившуюся усталость и дарит мощный заряд позитивных эмоций на весь день.",
  bathSaltRoyalPapaya:
    "Растворяясь в теплой воде, кристаллы соли наполняют пространство ванной комнаты обволакивающим, сладким ароматом спелой папайи. Принятие такой ванны способствует глубокому расслаблению, помогает снять мышечное напряжение после активного дня и восстановить внутреннюю гармонию.",
  bathSaltPassionFruitTiare:
    "Растворяясь в теплой воде, кристаллики соли раскрывают пленительный, сладковатый аромат экзотической маракуйи и нежных цветов тиаре. Принятие такой ванны помогает быстро снять накопившийся за день стресс, расслабить уставшие мышцы и подарить себе моменты истинного наслаждения.",
  bathSaltRhubarbCranberries:
    "Погружение в теплую воду с бодрящим кисло-сладким ароматом ревеня и клюквы моментально снимает усталость и заряжает энергией на весь день. Натуральное аргановое масло в составе заботится о твоей коже прямо во время купания: смягчает жесткую воду, глубоко питает и защищает от пересыхания.",
  bathSaltYuzuMandarin:
    "Натуральное масло жожоба в составе бережно ухаживает за кожей прямо во время купания: смягчает жесткую воду, глубоко увлажняет и предотвращает чувство стянутости после ванны.",

  bathSaltFoamBananaMelon: "Экстракты банана и дыни, масло монои увлажняют и смягчают кожу.",
  bathSaltFoamSicilianOrangeClementine:
    "Масло манго увлажняет и смягчает кожу, экстракты цитрусовых эффективны при целлюлите.",
  bathSaltFoamAvocadoCherimoya:
    "Кристаллы натуральной морской соли Мертвого моря оказывают восстанавливающее и тонизирующее действие на кожу, масло авокадо придает упругость.",
  bathSaltFoamLitchiRambutan:
    "Масло жожоба и экстракты экзотических фруктов личи и рамбутана смягчают и питают кожу.",

  bathFoamTiramisu:
    "Молочные протеины увлажняют и активно смягчают кожу. Шоколад - источник гормонов счастья - поднимет настроение и придаст энергии. Экстракты какао и кофе способствуют свежести и упругости кожи.",
  bathFoamPeachSouffle:
    "Протеины молока увлажняют кожу, придают ей шелковистость. Экстракт персика насыщает ее полезными микроэлементами.",
  bathFoamBananaMangoMousse:
    "Экстракт банана тонизирует, придает ощущение свежести. Экстракт манго питает кожу, успокаивает раздражения, прекрасно увлажняет.",
  bathFoamTangerineSicilianOrange:
    "Экстракт тангерина и эфирное масло апельсина придают коже эластичность, приятную гладкость.",

  creamGelThaiMelonWhiteLemon:
    "Масла лимона и жожоба, экстракт дыни и витаминный комплекс питают и увлажняют кожу, дарят ей гладкость и бархатистость.",
  creamGelCoconutVanilla:
    "Крем-гель для душа перенесет вас на экзотические острова, наполненные сладкими ароматами кокоса и ванили. Нежный крем-гель с кремовой текстурой мягко очищает кожу, не пересушивая ее.",
  creamGelChocolateStrawberry:
    "Масло макадамии, экстракты какао и клубники, витаминный комплекс повышают эластичность и шелковистость, активно питают кожу.",
  creamGelPassionFruitMagnolia:
    "Деликатно очищает и ухаживает за кожей. Нежная пена дарит притягательный тропический аромат маракуйи и магнолии, обеспечивая увлажнение, мягкость и комфорт на весь день.",

  showerGelTiramisu:
    "Молочные протеины, экстракты кофе и какао, витаминный комплекс придают вашей коже шелковую мягкость, дарят ей незабываемый аромат.",
  showerGelPassionFruitMagnolia:
    "Масло карите, экстракты маракуйи и магнолии, витаминный комплекс позволяют коже обрести упругость, мягкость, здоровый вид.",
  showerGelDragonFruitMacadamia:
    "Масло макадамии, экстракт драконового фрукта и витаминный комплекс делают кожу гладкой и эластичной, дарят ей приятный аромат.",
  showerGelThaiMelonWhiteLemon:
    "Масла лимона и жожоба, экстракт дыни и витаминный комплекс питают и увлажняют кожу, дарят ей гладкость и бархатистость.",
  showerGelLemongrassVanilla:
    "Экстракт ванили, масло лемонграсса и витаминный комплекс тонизируют кожу, делают ее шелковистой.",
  showerGelCaramelPear:
    "Масло макадамии, экстракт груши и витаминный комплекс делают кожу гладкой и мягкой в течение всего дня, дарят ей восхитительный аромат.",
  showerGelTangerineAwapuhi:
    "Масло камелии, экстракты мандарина и имбиря, витаминный комплекс восстанавливают упругость и шелковистость кожи, придают ощущение свежести.",
  showerGelAvocadoRiceMilk:
    "Экстракт авокадо, рисовое молочко и витаминный комплекс интенсивно увлажняют кожу, придают ей нежность и шелковистость.",

  showerGelPassionFruitTiare473:
    "Сочная маракуйя переплетается с мягким цветочным ароматом тиаре, создавая чувственный, но легкий ароматный образ. Масло макадамии интенсивно увлажняет кожу, придавая ей мягкость и естественный свет.",
  showerGelRoyalPapaya473:
    "Экстракт папаи освежает, тонизирует и наполняет кожу естественным сиянием. Масло карите интенсивно увлажняет, питает и смягчает кожу.",
  showerGelYuzuMandarin473:
    "Аромат юдзу и мандарина поднимает настроение, а масло жожоба мягко очищает кожу, сохраняя ее естественную мягкость и баланс. Ежедневная доза позитива освежает, тонизирует и дарит подлинное ощущение легкости.",
  showerGelRhubarbCranberries473:
    "Аргановое масло мягко очищает, увлажняет и дарит коже шелковистую гладкость. Нежная пена превращает привычный душ в момент удовольствия и обновления. Свежесть и баланс в каждом касании.",
  showerGelTropicalMangoLemon473:
    "Этот тропический коктейль сочетает сладкий аромат спелого манго с легкой цитрусовой прохладой лимона. Формула с аргановым маслом нежно очищает, увлажняет и дарит коже шелковистую мягкость.",
  showerGelWinterCherry473:
    "Масло карите питает и смягчает кожу, делая ее нежной и эластичной. Прикосновение ароматной роскоши, оставляющей шлейф незабываемых впечатлений.",

  soapPassionFruitTiare:
    "Масло макадамии питает и смягчает кожу, делая ее нежной и гладкой. Экзотический аромат маракуйи и тиаре дарит свежесть и легкость на весь день.",
  soapWinterCherry:
    "Масло карите питает и смягчает кожу, помогая сохранить ее гладкость и комфорт. Нежный аромат зимней вишни дарит ощущение свежести и уюта на весь день.",
  soapTropicalMangoLemon:
    "Аргановое масло питает и увлажняет кожу, делая ее мягкой и гладкой. Свежий аромат манго и лимона дарит ощущение чистоты и бодрости на весь день.",
  soapRoyalPapaya:
    "Масло ши питает и смягчает кожу, помогая сохранить ее гладкость и комфорт. Нежный аромат папайи дарит свежесть и приятное ощущение ухода на весь день.",
  soapYuzuMandarin:
    "Масло жожоба увлажняет и смягчает кожу, помогая сохранить ее гладкость и комфорт. Цитрусовый аромат мандарина и юдзу дарит свежесть и легкость на весь день.",
  soapRhubarbCranberries:
    "Аргановое масло питает и увлажняет кожу, делая ее мягкой и гладкой. Свежий аромат ревеня и клюквы дарит ощущение чистоты и легкости на весь день.",

  creamSoapMangoCarambola:
    "Масло камелии питает и смягчает кожу, делая ее гладкой и нежной. Тропический аромат манго и карамболы дарит свежесть и легкость на весь день.",
  creamSoapPassionFruitCamellia:
    "Мыло не только бережно очищает, но и обеспечивает коже невероятную шелковистость и гладкость. После использования не остается чувства стянутости - только мягкость, увлажнение и приятный фруктово-цветочный аромат.",
  creamSoapStrawberryGuava:
    "Рисовые протеины помогают бережно ухаживать за кожей, делая ее мягкой и гладкой. Сладкий аромат клубники и гуавы дарит свежесть и приятное ощущение чистоты на весь день.",
  creamSoapPapaya:
    "Масло авокадо питает и смягчает кожу, помогая сохранить ее гладкость и комфорт. Нежный аромат папайи дарит ощущение свежести и ухода на весь день.",
};

const specs = [
  ["body-peeling-litchi-ginger-200", "Пилинг для тела", "tana pilingi", "Litchi & Ginger", "Личи и Имбирь", "200 мл", "body-care", "bodyPeeling", "Body Peeling"],
  ["body-peeling-orange-cinnamon-200", "Пилинг для тела", "tana pilingi", "Orange & Cinnamon", "Апельсин и Корица", "200 мл", "body-care", "bodyPeeling", "Body Peeling"],
  ["body-peeling-passion-fruit-brown-sugar-200", "Пилинг для тела", "tana pilingi", "Passion Fruit & Brown Sugar", "Маракуйя и Коричневый сахар", "200 мл", "body-care", "bodyPeeling", "Body Peeling"],

  ["sugar-scrub-passion-fruit-macadamia-225", "Сахарный скраб для тела", "tana uchun shakarli skrab", "Passion Fruit & Macadamia", "Маракуйя и макадамия", "225 мл", "body-care", "sugarScrub", "Sugar Body Scrub"],
  ["sugar-scrub-chocolate-marzipan-225", "Сахарный скраб для тела", "tana uchun shakarli skrab", "Chocolate & Marzipan", "Шоколад и Марципан", "225 мл", "body-care", "sugarScrub", "Sugar Body Scrub"],
  ["sugar-scrub-orange-mango-225", "Сахарный скраб для тела", "tana uchun shakarli skrab", "Orange & Mango", "Апельсин и Манго", "225 мл", "body-care", "sugarScrub", "Sugar Body Scrub"],
  ["body-butter-passion-fruit-macadamia-225", "Крем-масло для тела", "tana uchun krem-moy", "Passion Fruit & Macadamia", "Маракуйя и макадамия", "225 мл", "body-care", "bodyButter", "Body Butter"],
  ["body-butter-chocolate-marzipan-225", "Крем-масло для тела", "tana uchun krem-moy", "Chocolate & Marzipan", "Шоколад и Марципан", "225 мл", "body-care", "bodyButter", "Body Butter"],
  ["body-butter-orange-mango-225", "Крем-масло для тела", "tana uchun krem-moy", "Orange & Mango", "Апельсин и Манго", "225 мл", "body-care", "bodyButter", "Body Butter"],

  ["sugar-scrub-winter-cherry-200", "Сахарный скраб для тела", "tana uchun shakarli skrab", "Winter Cherry", "Зимняя вишня", "200 мл", "body-care", "sugarScrub", "Sugar Body Scrub"],
  ["sugar-scrub-tropical-mango-lemon-200", "Сахарный скраб для тела", "tana uchun shakarli skrab", "Tropical Mango & Lemon", "Тропическое манго и Лимон", "200 мл", "body-care", "sugarScrub", "Sugar Body Scrub"],
  ["sugar-scrub-passion-fruit-tiare-200", "Сахарный скраб для тела", "tana uchun shakarli skrab", "Passion Fruit & Tiare", "Маракуйя и Тиаре", "200 мл", "body-care", "sugarScrub", "Sugar Body Scrub"],
  ["sugar-scrub-rhubarb-cranberries-200", "Сахарный скраб для тела", "tana uchun shakarli skrab", "Rhubarb & Cranberries", "Ревень и Клюква", "200 мл", "body-care", "sugarScrub", "Sugar Body Scrub"],
  ["sugar-scrub-royal-papaya-200", "Сахарный скраб для тела", "tana uchun shakarli skrab", "Royal Papaya", "Королевская папайя", "200 мл", "body-care", "sugarScrub", "Sugar Body Scrub"],
  ["sugar-scrub-yuzu-mandarin-200", "Сахарный скраб для тела", "tana uchun shakarli skrab", "Yuzu & Mandarin", "Юзу и Мандарин", "200 мл", "body-care", "sugarScrub", "Sugar Body Scrub"],

  ["body-butter-passion-fruit-tiare-200", "Крем-масло для тела", "tana uchun krem-moy", "Passion Fruit & Tiare", "Маракуйя и Тиаре", "200 мл", "body-care", "bodyButter", "Body Butter"],
  ["body-butter-tropical-mango-lemon-200", "Крем-масло для тела", "tana uchun krem-moy", "Tropical Mango & Lemon", "Тропическое манго и Лимон", "200 мл", "body-care", "bodyButter", "Body Butter"],
  ["body-butter-winter-cherry-200", "Крем-масло для тела", "tana uchun krem-moy", "Winter Cherry", "Зимняя вишня", "200 мл", "body-care", "bodyButter", "Body Butter"],
  ["body-butter-rhubarb-cranberries-200", "Крем-масло для тела", "tana uchun krem-moy", "Rhubarb & Cranberries", "Ревень и Клюква", "200 мл", "body-care", "bodyButter", "Body Butter"],
  ["body-butter-royal-papaya-200", "Крем-масло для тела", "tana uchun krem-moy", "Royal Papaya", "Королевская папайя", "200 мл", "body-care", "bodyButter", "Body Butter"],
  ["body-butter-yuzu-mandarin-200", "Крем-масло для тела", "tana uchun krem-moy", "Yuzu & Mandarin", "Юзу и Мандарин", "200 мл", "body-care", "bodyButter", "Body Butter"],

  ["body-mist-winter-cherry-150", "Мист для лица и тела", "yuz va tana misti", "Winter Cherry", "Зимняя вишня", "150 мл", "body-care", "mistWinterCherry", "Body Mist"],
  ["body-mist-yuzu-mandarin-150", "Мист для лица и тела", "yuz va tana misti", "Yuzu Mandarin", "Юзу мандарин", "150 мл", "body-care", "mistYuzuMandarin", "Body Mist"],
  ["body-mist-royal-papaya-150", "Мист для лица и тела", "yuz va tana misti", "Royal Papaya", "Королевская папайя", "150 мл", "body-care", "mistRoyalPapaya", "Body Mist"],
  ["body-mist-tropical-mango-lemon-150", "Мист для лица и тела", "yuz va tana misti", "Tropical Mango & Lemon", "Тропическое манго и Лимон", "150 мл", "body-care", "mistTropicalMangoLemon", "Body Mist"],
  ["body-mist-rhubarb-cranberries-150", "Мист для лица и тела", "yuz va tana misti", "Rhubarb & Cranberries", "Ревень и клюква", "150 мл", "body-care", "mistRhubarbCranberries", "Body Mist"],
  ["body-mist-passion-fruit-tiare-150", "Мист для лица и тела", "yuz va tana misti", "Passion Fruit & Tiare", "Маракуйя и цветок Тиаре", "150 мл", "body-care", "mistPassionFruitTiare", "Body Mist"],

  ["bath-salt-winter-cherry-700", "Соль для ванн", "vanna tuzi", "Winter Cherry", "Зимняя вишня", "700 г", "bath", "bathSaltWinterCherry", "Bath Salt"],
  ["bath-salt-tropical-mango-lemon-700", "Соль для ванн", "vanna tuzi", "Tropical Mango & Lemon", "Тропическое манго и Лимон", "700 г", "bath", "bathSaltTropicalMangoLemon", "Bath Salt"],
  ["bath-salt-royal-papaya-700", "Соль для ванн", "vanna tuzi", "Royal Papaya", "Королевская папайя", "700 г", "bath", "bathSaltRoyalPapaya", "Bath Salt"],
  ["bath-salt-passion-fruit-tiare-700", "Соль для ванн", "vanna tuzi", "Passion Fruit & Tiare", "Маракуйя и Тиаре", "700 г", "bath", "bathSaltPassionFruitTiare", "Bath Salt"],
  ["bath-salt-rhubarb-cranberries-700", "Соль для ванн", "vanna tuzi", "Rhubarb & Cranberries", "Ревень и Клюква", "700 г", "bath", "bathSaltRhubarbCranberries", "Bath Salt"],
  ["bath-salt-yuzu-mandarin-700", "Соль для ванн", "vanna tuzi", "Yuzu & Mandarin", "Юзу и Мандарин", "700 г", "bath", "bathSaltYuzuMandarin", "Bath Salt"],

  ["lip-balm-tropical-mango-lemon-3-6", "Гигиеническая помада", "lab balzami", "Tropical Mango & Lemon", "Тропическое манго и Лимон", "3,6 г", "lip-care", "lipBalm", "Lip Balm"],
  ["lip-balm-winter-cherry-3-6", "Гигиеническая помада", "lab balzami", "Winter Cherry", "Зимняя вишня", "3,6 г", "lip-care", "lipBalm", "Lip Balm"],
  ["lip-balm-passion-fruit-tiare-3-6", "Гигиеническая помада", "lab balzami", "Passion Fruit & Tiare", "Маракуйя и Тиаре", "3,6 г", "lip-care", "lipBalm", "Lip Balm"],
  ["lip-balm-royal-papaya-3-6", "Гигиеническая помада", "lab balzami", "Royal Papaya", "Королевская папайя", "3,6 г", "lip-care", "lipBalm", "Lip Balm"],
  ["lip-balm-yuzu-mandarin-3-6", "Гигиеническая помада", "lab balzami", "Yuzu & Mandarin", "Юзу и Мандарин", "3,6 г", "lip-care", "lipBalm", "Lip Balm"],
  ["lip-balm-rhubarb-cranberries-3-6", "Гигиеническая помада", "lab balzami", "Rhubarb & Cranberries", "Ревень и Клюква", "3,6 г", "lip-care", "lipBalm", "Lip Balm"],

  ["bath-salt-foam-litchi-rambutan-500", "Соль для ванн с пеной", "ko'pikli vanna tuzi", "Litchi & Rambutan", "Личи и Рамбутан", "500 г", "bath", "bathSaltFoamLitchiRambutan", "Bath Salt Foam"],
  ["bath-salt-foam-banana-melon-500", "Соль для ванн с пеной", "ko'pikli vanna tuzi", "Banana & Melon", "Банан и Дыня", "500 г", "bath", "bathSaltFoamBananaMelon", "Bath Salt Foam"],
  ["bath-salt-foam-sicilian-orange-clementine-500", "Соль для ванн с пеной", "ko'pikli vanna tuzi", "Sicilian Orange & Clementine", "Сицилийский апельсин и Клементин", "500 г", "bath", "bathSaltFoamSicilianOrangeClementine", "Bath Salt Foam"],
  ["bath-salt-foam-avocado-cherimoya-500", "Соль для ванн с пеной", "ko'pikli vanna tuzi", "Avocado & Cherimoya", "Авокадо и Черимоя", "500 г", "bath", "bathSaltFoamAvocadoCherimoya", "Bath Salt Foam"],

  ["bath-foam-tiramisu-1000", "Пена для ванн", "vanna ko'pigi", "Tiramisu", "Тирамису", "1000 мл", "bath", "bathFoamTiramisu", "Bath Foam"],
  ["bath-foam-peach-souffle-1000", "Пена для ванн", "vanna ko'pigi", "Peach Souffle", "Персиковое суфле", "1000 мл", "bath", "bathFoamPeachSouffle", "Bath Foam"],
  ["bath-foam-banana-mango-mousse-1000", "Пена для ванн", "vanna ko'pigi", "Banana & Mango Mousse", "Бананово-манговый мусс", "1000 мл", "bath", "bathFoamBananaMangoMousse", "Bath Foam"],
  ["bath-foam-tangerine-sicilian-orange-1000", "Пена для ванн", "vanna ko'pigi", "Tangerine & Sicilian Orange", "Тангерин и сицилийский апельсин", "1000 мл", "bath", "bathFoamTangerineSicilianOrange", "Bath Foam"],

  ["cream-shower-gel-thai-melon-white-lemon-400", "Крем-гель для душа", "dush uchun krem-gel", "Thai Melon & White Lemon", "Тайская дыня и Белый лимон", "400 мл", "shower-gels", "creamGelThaiMelonWhiteLemon", "Creamy Shower Gel"],
  ["cream-shower-gel-coconut-vanilla-400", "Крем-гель для душа", "dush uchun krem-gel", "Coconut & Vanilla", "Кокос и ваниль", "400 мл", "shower-gels", "creamGelCoconutVanilla", "Creamy Shower Gel"],
  ["cream-shower-gel-chocolate-strawberry-300", "Крем-гель для душа", "dush uchun krem-gel", "Chocolate & Strawberry", "Шоколад и Клубника", "300 мл", "shower-gels", "creamGelChocolateStrawberry", "Creamy Shower Gel"],
  ["cream-shower-gel-passion-fruit-magnolia-300", "Крем-гель для душа", "dush uchun krem-gel", "Passion Fruit & Magnolia", "Маракуйя и магнолия", "300 мл", "shower-gels", "creamGelPassionFruitMagnolia", "Creamy Shower Gel"],

  ["shower-gel-tiramisu-500", "Гель для душа", "dush geli", "Tiramisu", "Тирамису", "500 мл", "shower-gels", "showerGelTiramisu", "Shower Gel"],
  ["shower-gel-passion-fruit-magnolia-500", "Гель для душа", "dush geli", "Passion Fruit & Magnolia", "Маракуйя и Магнолия", "500 мл", "shower-gels", "showerGelPassionFruitMagnolia", "Shower Gel"],
  ["shower-gel-dragon-fruit-macadamia-500", "Гель для душа", "dush geli", "Dragon Fruit & Macadamia", "Драконов фрукт и Макадамия", "500 мл", "shower-gels", "showerGelDragonFruitMacadamia", "Shower Gel"],
  ["shower-gel-thai-melon-white-lemon-500", "Гель для душа", "dush geli", "Thai Melon & White Lemon", "Тайская дыня и Белый лимон", "500 мл", "shower-gels", "showerGelThaiMelonWhiteLemon", "Shower Gel"],
  ["shower-gel-lemongrass-vanilla-500", "Гель для душа", "dush geli", "Lemongrass & Vanilla", "Лемонграсс и Ваниль", "500 мл", "shower-gels", "showerGelLemongrassVanilla", "Shower Gel"],
  ["shower-gel-caramel-pear-500", "Гель для душа", "dush geli", "Caramel Pear", "Карамельная груша", "500 мл", "shower-gels", "showerGelCaramelPear", "Shower Gel"],
  ["shower-gel-tangerine-awapuhi-500", "Гель для душа", "dush geli", "Tangerine & Awapuhi", "Тангерин и Авапухи", "500 мл", "shower-gels", "showerGelTangerineAwapuhi", "Shower Gel"],
  ["shower-gel-avocado-rice-milk-500", "Гель для душа", "dush geli", "Avocado & Rice Milk", "Авокадо и Рисовое молочко", "500 мл", "shower-gels", "showerGelAvocadoRiceMilk", "Shower Gel"],

  ["shower-gel-winter-cherry-473", "Гель для душа", "dush geli", "Winter Cherry", "Зимняя вишня", "473 мл", "shower-gels", "showerGelWinterCherry473", "Shower Gel"],
  ["shower-gel-passion-fruit-tiare-473", "Гель для душа", "dush geli", "Passion Fruit & Tiare", "Маракуйя и Тиаре", "473 мл", "shower-gels", "showerGelPassionFruitTiare473", "Shower Gel"],
  ["shower-gel-tropical-mango-lemon-473", "Гель для душа", "dush geli", "Tropical Mango & Lemon", "Тропический манго и лимон", "473 мл", "shower-gels", "showerGelTropicalMangoLemon473", "Shower Gel"],
  ["shower-gel-royal-papaya-473", "Гель для душа", "dush geli", "Royal Papaya", "Королевская папайя", "473 мл", "shower-gels", "showerGelRoyalPapaya473", "Shower Gel"],
  ["shower-gel-yuzu-mandarin-473", "Гель для душа", "dush geli", "Yuzu & Mandarin", "Мандарин и юдзу", "473 мл", "shower-gels", "showerGelYuzuMandarin473", "Shower Gel"],
  ["shower-gel-rhubarb-cranberries-473", "Гель для душа", "dush geli", "Rhubarb & Cranberries", "Ревень и клюква", "473 мл", "shower-gels", "showerGelRhubarbCranberries473", "Shower Gel"],

  ["liquid-soap-passion-fruit-tiare-460", "Жидкое мыло", "suyuq sovun", "Passion Fruit & Tiare", "Маракуйя и Тиаре", "460 мл", "bath", "soapPassionFruitTiare", "Liquid Soap"],
  ["liquid-soap-winter-cherry-460", "Жидкое мыло", "suyuq sovun", "Winter Cherry", "Зимняя вишня", "460 мл", "bath", "soapWinterCherry", "Liquid Soap"],
  ["liquid-soap-tropical-mango-lemon-460", "Жидкое мыло", "suyuq sovun", "Tropical Mango & Lemon", "Тропический манго и лимон", "460 мл", "bath", "soapTropicalMangoLemon", "Liquid Soap"],
  ["liquid-soap-royal-papaya-460", "Жидкое мыло", "suyuq sovun", "Royal Papaya", "Королевская папайя", "460 мл", "bath", "soapRoyalPapaya", "Liquid Soap"],
  ["liquid-soap-yuzu-mandarin-460", "Жидкое мыло", "suyuq sovun", "Yuzu & Mandarin", "Мандарин и юдзу", "460 мл", "bath", "soapYuzuMandarin", "Liquid Soap"],
  ["liquid-soap-rhubarb-cranberries-460", "Жидкое мыло", "suyuq sovun", "Rhubarb & Cranberries", "Ревень и клюква", "460 мл", "bath", "soapRhubarbCranberries", "Liquid Soap"],

  ["cream-soap-mango-carambola-1000", "Крем-мыло", "krem-sovun", "Mango & Carambola", "Манго и карамбола", "1000 мл", "bath", "creamSoapMangoCarambola", "Cream Soap"],
  ["cream-soap-passion-fruit-camellia-1000", "Крем-мыло", "krem-sovun", "Passion Fruit & Camellia", "Маракуйя и Камелия", "1000 мл", "bath", "creamSoapPassionFruitCamellia", "Cream Soap"],
  ["cream-soap-strawberry-guava-1000", "Крем-мыло", "krem-sovun", "Strawberry & Guava", "Клубника и гуава", "1000 мл", "bath", "creamSoapStrawberryGuava", "Cream Soap"],
  ["cream-soap-papaya-1000", "Крем-мыло", "krem-sovun", "Papaya", "Папайя", "1000 мл", "bath", "creamSoapPapaya", "Cream Soap"],
];

function formatUzVolume(volume) {
  return volume.replace("мл", "ml").replace("г", "g");
}

function makeProduct(spec, index) {
  const [slug, typeRu, typeUz, aromaEn, aromaRu, volume, category, descriptionKey, line] = spec;
  const productId = `fresh-juice-${slug}`;
  const titleRu = `${typeRu} Fresh Juice «${aromaRu}», ${volume}`;

  return {
    id: productId,
    sku: `FJ-${String(index + 1).padStart(3, "0")}`,
    brand: "Fresh Juice",
    brandSlug: "fresh-juice",
    line,
    lineUz: line,
    category,
    categoryLabel: categoryLabels[category],
    name: titleRu,
    nameRu: titleRu,
    nameUz: `Fresh Juice «${aromaRu}» ${typeUz}, ${formatUzVolume(volume)}`,
    title: titleRu,
    uzumTitle: titleRu,
    descriptionRu: descriptions[descriptionKey],
    descriptionUz: descriptions[descriptionKey],
    purpose: purposes[category].ru,
    purposeRu: purposes[category].ru,
    purposeUz: purposes[category].uz,
    volume,
    barcode: "",
    source: sourceName,
    href: uzumShopUrl,
    image: `products/fresh-juice-clean/${productId}.webp`,
    uzumImage: "",
    price: null,
    uzumCardPrice: null,
    aroma: aromaEn,
  };
}

export const freshJuiceCatalogProducts = specs.map(makeProduct);
