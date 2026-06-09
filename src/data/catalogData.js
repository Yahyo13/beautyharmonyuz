import { brands } from "./siteContent";

export const catalogApiUrl = "https://696f7b76a06046ce6186da88.mockapi.io/Api";

export const catalogFallbackSource = {
  name: "Dr.Sante catalog",
  noteRu:
    "Карточки Dr.Sante собраны из брендового каталога. API подключен как основной источник: когда в MockAPI появятся товары, сайт загрузит их автоматически.",
  noteUz:
    "Dr.Sante kartochkalari brend katalogidan yig'ildi. API asosiy manba sifatida ulangan: MockAPI ichida tovarlar paydo bo'lsa, sayt ularni avtomatik yuklaydi.",
};

const uzumShopUrl = "https://uzum.uz/uz/shop/beautyh";
const imageBase = `${import.meta.env.BASE_URL}products/dr-sante/`;

export const catalogCategories = [
  { value: "all", label: "Все категории" },
  { value: "shampoo", label: "Шампуни" },
  { value: "hair-care", label: "Уход за волосами" },
  { value: "creams", label: "Кремы" },
  { value: "face-care", label: "Уход за лицом" },
  { value: "body-care", label: "Уход за телом" },
  { value: "shower-gels", label: "Гели для душа" },
  { value: "bath", label: "Ванна и мыло" },
  { value: "hand-care", label: "Уход за руками" },
  { value: "intimate-hygiene", label: "Интимная гигиена" },
  { value: "depilation", label: "Депиляция" },
  { value: "lip-care", label: "Уход за губами" },
  { value: "oral-care", label: "Уход за полостью рта" },
  { value: "household", label: "Бытовая химия" },
];

const categoryLabels = {
  ru: Object.fromEntries(catalogCategories.map((item) => [item.value, item.label])),
  uz: {
    all: "Barcha kategoriyalar",
    shampoo: "Shampunlar",
    "hair-care": "Soch parvarishi",
    creams: "Kremlar",
    "face-care": "Yuz parvarishi",
    "body-care": "Tana parvarishi",
    "shower-gels": "Dush gellari",
    bath: "Vanna va sovun",
    "hand-care": "Qo'l parvarishi",
    "intimate-hygiene": "Intim gigiyena",
    depilation: "Depilyatsiya",
    "lip-care": "Lab parvarishi",
    "oral-care": "Og'iz bo'shlig'i parvarishi",
    household: "Maishiy kimyo",
  },
};

const productTypes = {
  shampoo: {
    ru: "Шампунь",
    uz: "Shampun",
    category: "shampoo",
    purposeRu: "Очищение волос и кожи головы.",
    purposeUz: "Soch va bosh terisini tozalash.",
  },
  balm: {
    ru: "Бальзам",
    uz: "Balzam",
    category: "hair-care",
    purposeRu: "Смягчение, восстановление и уход по длине волос.",
    purposeUz: "Soch uzunligini yumshatish, tiklash va parvarish qilish.",
  },
  conditioner: {
    ru: "Бальзам-кондиционер",
    uz: "Balzam-konditsioner",
    category: "hair-care",
    purposeRu: "Легкое расчесывание, гладкость и защита волос.",
    purposeUz: "Sochni oson tarash, silliqlik va himoya.",
  },
  spray: {
    ru: "Спрей для волос",
    uz: "Soch spreyi",
    category: "hair-care",
    purposeRu: "Несмываемый уход, укрепление и защита волос.",
    purposeUz: "Yuvilmaydigan parvarish, mustahkamlash va himoya.",
  },
  liquidSilk: {
    ru: "Жидкий шелк",
    uz: "Suyuq ipak",
    category: "hair-care",
    purposeRu: "Блеск, шелковистость и уход за кончиками.",
    purposeUz: "Yaltiroq ko'rinish, ipakdek silliqlik va uchlar parvarishi.",
  },
  mask: {
    ru: "Маска для волос",
    uz: "Soch niqobi",
    category: "hair-care",
    purposeRu: "Интенсивное питание и восстановление волос.",
    purposeUz: "Sochni intensiv oziqlantirish va tiklash.",
  },
  oil: {
    ru: "Масло",
    uz: "Moy",
    category: "hair-care",
    purposeRu: "Питание кожи головы, укрепление и блеск.",
    purposeUz: "Bosh terisini oziqlantirish, mustahkamlash va jilolash.",
  },
  serum: {
    ru: "Сыворотка",
    uz: "Zardob",
    category: "hair-care",
    purposeRu: "Концентрированный уход для волос или кожи головы.",
    purposeUz: "Soch yoki bosh terisi uchun konsentrlangan parvarish.",
  },
  fluid: {
    ru: "Флюид",
    uz: "Flyuid",
    category: "hair-care",
    purposeRu: "Сглаживание, блеск и защита поврежденных участков.",
    purposeUz: "Silliqlash, jilolash va zararlangan qismlarni himoya qilish.",
  },
  micellarWater: {
    ru: "Мицеллярная вода",
    uz: "Mitsellyar suv",
    category: "face-care",
    purposeRu: "Очищение кожи лица и снятие макияжа.",
    purposeUz: "Yuz terisini tozalash va makiyajni yechish.",
  },
  cleansingFoam: {
    ru: "Пенка для умывания",
    uz: "Yuvinish ko'pigi",
    category: "face-care",
    purposeRu: "Мягкое очищение кожи лица.",
    purposeUz: "Yuz terisini yumshoq tozalash.",
  },
  faceGel: {
    ru: "Гель для умывания",
    uz: "Yuvinish geli",
    category: "face-care",
    purposeRu: "Очищение и свежесть кожи лица.",
    purposeUz: "Yuz terisini tozalash va tetiklik berish.",
  },
  toner: {
    ru: "Тоник",
    uz: "Tonik",
    category: "face-care",
    purposeRu: "Тонизирование, свежесть и подготовка кожи к уходу.",
    purposeUz: "Terini tonusga keltirish va keyingi parvarishga tayyorlash.",
  },
  peeling: {
    ru: "Гель-пилинг",
    uz: "Gel-piling",
    category: "face-care",
    purposeRu: "Деликатное обновление кожи.",
    purposeUz: "Terini nozik yangilash.",
  },
  scrubMask: {
    ru: "Маска-скраб",
    uz: "Niqob-skrab",
    category: "face-care",
    purposeRu: "Очищение пор и матирование.",
    purposeUz: "Teshikchalarni tozalash va matlashtirish.",
  },
  faceCream: {
    ru: "Крем для лица",
    uz: "Yuz kremi",
    category: "face-care",
    purposeRu: "Ежедневный уход, увлажнение и комфорт кожи.",
    purposeUz: "Kundalik parvarish, namlantirish va teri qulayligi.",
  },
  nightCream: {
    ru: "Ночной крем для лица",
    uz: "Tungi yuz kremi",
    category: "face-care",
    purposeRu: "Ночной уход и восстановление кожи.",
    purposeUz: "Tungi parvarish va terini tiklash.",
  },
  dayCream: {
    ru: "Дневной крем для лица",
    uz: "Kunduzgi yuz kremi",
    category: "face-care",
    purposeRu: "Дневной уход, увлажнение и защита кожи.",
    purposeUz: "Kunduzgi parvarish, namlantirish va himoya.",
  },
  eyeCream: {
    ru: "Крем вокруг глаз",
    uz: "Ko'z atrofi kremi",
    category: "face-care",
    purposeRu: "Увлажнение и уход за зоной вокруг глаз.",
    purposeUz: "Ko'z atrofi hududini namlantirish va parvarish qilish.",
  },
  lipBalm: {
    ru: "Бальзам для губ",
    uz: "Lab balzami",
    category: "lip-care",
    purposeRu: "Защита, питание и увлажнение губ.",
    purposeUz: "Lablarni himoya qilish, oziqlantirish va namlantirish.",
  },
  handCream: {
    ru: "Крем для рук",
    uz: "Qo'l kremi",
    category: "hand-care",
    purposeRu: "Питание, смягчение и защита кожи рук.",
    purposeUz: "Qo'l terisini oziqlantirish, yumshatish va himoya qilish.",
  },
  intimateGel: {
    ru: "Гель для интимной гигиены",
    uz: "Intim gigiyena geli",
    category: "intimate-hygiene",
    purposeRu: "Деликатное очищение и ощущение свежести.",
    purposeUz: "Nozik tozalash va tetiklik hissi.",
  },
  intimateMilk: {
    ru: "Молочко для интимной гигиены",
    uz: "Intim gigiyena sutachasi",
    category: "intimate-hygiene",
    purposeRu: "Мягкий уход для чувствительной интимной зоны.",
    purposeUz: "Sezgir intim hudud uchun yumshoq parvarish.",
  },
  footCreamGel: {
    ru: "Крем-гель для ног",
    uz: "Oyoq uchun krem-gel",
    category: "creams",
    purposeRu: "Свежесть, тонус и уход за кожей ног.",
    purposeUz: "Oyoq terisi uchun tetiklik, tonus va parvarish.",
  },
  footCream: {
    ru: "Крем для ног",
    uz: "Oyoq kremi",
    category: "creams",
    purposeRu: "Питание и смягчение сухой кожи ног.",
    purposeUz: "Quruq oyoq terisini oziqlantirish va yumshatish.",
  },
};

const productLines = {
  "Aloe Vera": {
    ru: "Aloe Vera",
    uz: "Aloe Vera",
    descriptionRu: "Серия с соком алоэ вера, кератином и растительными церамидами для увлажнения и восстановления поврежденных волос.",
    descriptionUz: "Aloe vera sharbati, keratin va o'simlik seramidlari asosidagi seriya zararlangan sochni namlantirish va tiklashga qaratilgan.",
  },
  "Anti Hair Loss": {
    ru: "Anti Hair Loss",
    uz: "Anti Hair Loss",
    descriptionRu: "Серия против выпадения волос с TRICHOGEN COMPLEX, экстрактом маки перуанской, протеинами люпина и маслом сача инчи.",
    descriptionUz: "TRICHOGEN COMPLEX, Peru makasi ekstrakti, lyupin proteinlari va sacha inchi moyi bilan soch to'kilishiga qarshi seriya.",
  },
  "Argan Hair": {
    ru: "Argan Hair",
    uz: "Argan Hair",
    descriptionRu: "Линия с аргановым маслом и кератином для гладкости, эластичности и восстановления структуры волос.",
    descriptionUz: "Argan moyi va keratinli yo'nalish soch tuzilishini tiklash, silliqlik va elastiklik uchun.",
  },
  "Coconut Hair": {
    ru: "Coconut Hair",
    uz: "Coconut Hair",
    descriptionRu: "Кокосовая линия для увлажнения, блеска и ухода за сухими или ослабленными волосами.",
    descriptionUz: "Kokosli yo'nalish quruq yoki zaiflashgan sochni namlantirish, jilolash va parvarish qilish uchun.",
  },
  Keratin: {
    ru: "Keratin",
    uz: "Keratin",
    descriptionRu: "Кератиновая серия для восстановления структуры волос, блеска и защиты поврежденных участков.",
    descriptionUz: "Keratinli seriya soch tuzilmasini tiklash, jilolash va zararlangan qismlarni himoya qilish uchun.",
  },
  "Репейная серия": {
    ru: "Репейная серия",
    uz: "Qariqiz seriyasi",
    descriptionRu: "Средства с экстрактом лопуха, инулином и растительным комплексом для укрепления волос и ухода за кожей головы.",
    descriptionUz: "Qariqiz ekstrakti, inulin va o'simlik kompleksi asosidagi vositalar sochni mustahkamlash va bosh terisi parvarishi uchun.",
  },
  "Hyaluron Hair": {
    ru: "Hyaluron Hair",
    uz: "Hyaluron Hair",
    descriptionRu: "Линия глубокого увлажнения с гиалуроновой кислотой для мягкости, блеска и послушности волос.",
    descriptionUz: "Gialuron kislotali chuqur namlantirish yo'nalishi soch yumshoqligi, jilosi va tartibli ko'rinishi uchun.",
  },
  "Collagen Hair": {
    ru: "Collagen Hair",
    uz: "Collagen Hair",
    descriptionRu: "Коллагеновая серия Volume Boost для объема, плотности и ухода за тонкими волосами.",
    descriptionUz: "Volume Boost kollagenli seriyasi yupqa sochga hajm, zichlik va parvarish berish uchun.",
  },
  "Cucumber Balance Control": {
    ru: "Cucumber Balance Control",
    uz: "Cucumber Balance Control",
    descriptionRu: "Огуречная серия для комбинированной и жирной кожи: очищение, свежесть, матирование и контроль блеска.",
    descriptionUz: "Aralash va yog'li teri uchun bodringli seriya: tozalash, tetiklik, matlashtirish va yog'li yaltirashni nazorat qilish.",
  },
  "Vitamin C": {
    ru: "Vitamin C",
    uz: "Vitamin C",
    descriptionRu: "Серия Healthy Skin Glow с витамином C для свежести, сияния и ухода за тусклой кожей.",
    descriptionUz: "Vitamin C asosidagi Healthy Skin Glow seriyasi teriga tetiklik, yorqinlik va parvarish beradi.",
  },
  "Cica + Zinc + AHA": {
    ru: "Cica + Zinc + AHA",
    uz: "Cica + Zinc + AHA",
    descriptionRu: "Sebocontrol-линия с cica, цинком и AHA для нормализации кожи, матирования и ухода за проблемными зонами.",
    descriptionUz: "Cica, rux va AHA bilan Sebocontrol yo'nalishi terini me'yorlash, matlashtirish va muammoli hududlarni parvarish qilish uchun.",
  },
  "Hyaluron + Aloe": {
    ru: "Hyaluron + Aloe",
    uz: "Hyaluron + Aloe",
    descriptionRu: "Гиалурон и алоэ помогают поддерживать увлажнение, мягкость и комфорт кожи.",
    descriptionUz: "Gialuron va aloe terining namligi, yumshoqligi va qulayligini qo'llab-quvvatlaydi.",
  },
  "Peptide + Niacinamide": {
    ru: "Peptide + Niacinamide 10%",
    uz: "Peptide + Niacinamide 10%",
    descriptionRu: "Ультралифтинг-линия с пептидом и ниацинамидом для ухода против тусклости и признаков усталости.",
    descriptionUz: "Peptid va niatsinamidli ultralifting yo'nalishi xiralik va charchoq belgilariga qarshi parvarish uchun.",
  },
  "Simply Clean 0%": {
    ru: "Simply Clean 0%",
    uz: "Simply Clean 0%",
    descriptionRu: "Гипоаллергенная серия 0% для проблемной кожи, без SLES, SLS, силиконов, парабенов, красителей и пропиленгликоля.",
    descriptionUz: "Muammoli teri uchun 0% gipoallergen seriyasi: SLES, SLS, silikon, paraben, bo'yoq va propilenglikolsiz.",
  },
  "Lip Balm": {
    ru: "Lip Balm",
    uz: "Lip Balm",
    descriptionRu: "Бальзамы для губ с натуральными маслами для питания, восстановления и защиты нежной кожи губ.",
    descriptionUz: "Tabiiy moyli lab balzamlari lab terisini oziqlantirish, tiklash va himoya qilish uchun.",
  },
  "Natural Therapy": {
    ru: "Natural Therapy",
    uz: "Natural Therapy",
    descriptionRu: "Кремы для рук с натуральными маслами: аргана, кокос, ши и другие питательные компоненты.",
    descriptionUz: "Argan, kokos, shi va boshqa oziqlantiruvchi komponentlarga ega qo'l kremlari.",
  },
  "Femme Intime": {
    ru: "Femme Intime",
    uz: "Femme Intime",
    descriptionRu: "Деликатная интимная гигиена с мягкими моющими компонентами, молочной кислотой и растительными экстрактами.",
    descriptionUz: "Yumshoq yuvuvchi komponentlar, sut kislotasi va o'simlik ekstraktlari bilan nozik intim gigiyena.",
  },
  "0% Soft": {
    ru: "0% Soft",
    uz: "0% Soft",
    descriptionRu: "Кремы для рук 0% с безглицериновой системой увлажнения и питательными компонентами.",
    descriptionUz: "Glitserinsiz namlantirish tizimi va oziqlantiruvchi komponentlarga ega 0% qo'l kremlari.",
  },
  "Foot Care": {
    ru: "Foot Care",
    uz: "Foot Care",
    descriptionRu: "Серия для комплексного ухода за кожей ног: свежесть, тонус, питание и смягчение.",
    descriptionUz: "Oyoq terisini kompleks parvarish qilish: tetiklik, tonus, oziqlantirish va yumshatish.",
  },
};

const productSpecs = [
  ["aloe-conditioner-200", "Aloe Vera", "conditioner", "интенсивное восстановление", "intensiv tiklash", "200 мл", "4823015937057", "p01_01_2531_649x1440.jpg"],
  ["aloe-spray-strength-150", "Aloe Vera", "spray", "против выпадения волос", "soch to'kilishiga qarshi", "150 мл", "4823015923142", "p01_02_2532_331x1440.jpg"],
  ["aloe-spray-combing-150", "Aloe Vera", "spray", "легкое расчесывание", "oson tarash", "150 мл", "4823015914102", "p01_03_2533_331x1440.jpg"],
  ["aloe-shampoo-250", "Aloe Vera", "shampoo", "очищение и восстановление", "tozalash va tiklash", "250 мл", "4823015937033", "p01_04_2534_381x1440.jpg"],
  ["aloe-liquid-silk-30", "Aloe Vera", "liquidSilk", "блеск и шелковистость", "jilo va ipakdek silliqlik", "30 мл", "4823015935343", "p01_05_2535_757x1500.jpg"],
  ["aloe-mask-300", "Aloe Vera", "mask", "увлажнение и восстановление", "namlantirish va tiklash", "300 мл", "4823015937040", "p01_06_2536_924x1440.jpg"],
  ["aloe-mask-1000", "Aloe Vera", "mask", "профессиональный формат", "professional format", "1000 мл", "4823015935350", "p01_07_2537_892x957.jpg"],
  ["aloe-shampoo-1000", "Aloe Vera", "shampoo", "салонный объем", "salon hajmi", "1000 мл", "4823015923135", "p01_08_2538_667x1556.jpg"],

  ["anti-hair-loss-oil-100", "Anti Hair Loss", "oil", "стимулирует рост волос", "soch o'sishini rag'batlantiradi", "100 мл", "4823015936647", "p02_01_4683_2048x2048.jpg"],
  ["anti-hair-loss-balm-150", "Anti Hair Loss", "balm", "укрепление и восстановление", "mustahkamlash va tiklash", "150 мл", "4823015936609", "p02_02_4684_899x1984.jpg"],
  ["anti-hair-loss-mask-300", "Anti Hair Loss", "mask", "укрепление и защита", "mustahkamlash va himoya", "300 мл", "4823015936623", "p02_03_4685_1280x2013.jpg"],
  ["anti-hair-loss-mask-1000", "Anti Hair Loss", "mask", "профессиональный объем", "professional hajm", "1000 мл", "4823015936630", "p02_04_4686_1900x2048.jpg"],
  ["anti-hair-loss-spray-150", "Anti Hair Loss", "spray", "укрепляет и стимулирует рост", "mustahkamlaydi va o'sishni rag'batlantiradi", "150 мл", "4823015936616", "p02_05_4687_458x2048.jpg"],
  ["anti-hair-loss-shampoo-250", "Anti Hair Loss", "shampoo", "бережное очищение", "ehtiyotkor tozalash", "250 мл", "4823015936593", "p02_06_4688_515x2048.jpg"],
  ["anti-hair-loss-shampoo-1000", "Anti Hair Loss", "shampoo", "салонный формат", "salon formati", "1000 мл", "4823015936654", "p02_07_4689_836x2048.jpg"],

  ["argan-shampoo-250", "Argan Hair", "shampoo", "очищение и увлажнение", "tozalash va namlantirish", "250 мл", "4823015933080", "p03_02_2302_366x1367.jpg"],
  ["argan-mask-1000", "Argan Hair", "mask", "восстановление", "tiklash", "1000 мл", "4823015935336", "p03_03_2303_857x1328.jpg"],
  ["argan-shampoo-1000", "Argan Hair", "shampoo", "профессиональный формат", "professional format", "1000 мл", "4823015933103", "p03_04_2304_571x1418.jpg"],

  ["coconut-shampoo-250", "Coconut Hair", "shampoo", "мягкое очищение", "yumshoq tozalash", "250 мл", "4823015938269", "p04_01_2190_523x1950.jpg"],
  ["coconut-shampoo-400", "Coconut Hair", "shampoo", "блеск и шелковистость", "jilo va ipakdek silliqlik", "400 мл", "4823015944048", "p04_02_2191_536x1970.jpg"],
  ["coconut-shampoo-1000", "Coconut Hair", "shampoo", "салонный объем", "salon hajmi", "1000 мл", "4823015938276", "p04_03_2192_756x1893.jpg"],
  ["coconut-mask-1000", "Coconut Hair", "mask", "восстановление и блеск", "tiklash va jilo", "1000 мл", "4823015938245", "p04_04_2193_1247x1958.jpg"],
  ["coconut-conditioner-200", "Coconut Hair", "conditioner", "эластичность и уход", "elastiklik va parvarish", "200 мл", "4823015938290", "p04_05_2194_954x1994.jpg"],

  ["keratin-shampoo-250", "Keratin", "shampoo", "восстановление структуры", "tuzilmani tiklash", "250 мл", "4823015935466", "p05_01_4700_383x1440.jpg"],
  ["keratin-conditioner-200", "Keratin", "conditioner", "разглаживание и защита", "silliqlash va himoya", "200 мл", "4823015935503", "p05_02_4701_646x1440.jpg"],
  ["keratin-shampoo-1000", "Keratin", "shampoo", "профессиональный объем", "professional hajm", "1000 мл", "4823015935497", "p05_03_4702_569x1440.jpg"],
  ["keratin-shampoo-400", "Keratin", "shampoo", "ежедневный уход", "kundalik parvarish", "400 мл", "4823015944031", "p05_04_4703_384x1440.jpg"],
  ["keratin-mask-300", "Keratin", "mask", "интенсивный уход", "intensiv parvarish", "300 мл", "4823015935442", "p05_06_4704_1054x1161.jpg"],
  ["keratin-mask-1000", "Keratin", "mask", "салонный формат", "salon formati", "1000 мл", "4823015935459", "p05_07_4705_938x1440.jpg"],
  ["keratin-spray-150", "Keratin", "spray", "термозащита и блеск", "termo himoya va jilo", "150 мл", "4823015935473", "p05_08_4706_327x1440.jpg"],
  ["keratin-serum-50", "Keratin", "fluid", "блеск и восстановление", "jilo va tiklash", "50 мл", "4823015935480", "p05_10_4707_469x1440.jpg"],

  ["burdock-oil-100", "Репейная серия", "oil", "стимулирует рост волос", "soch o'sishini rag'batlantiradi", "100 мл", "4823015933004", "generated-burdock-oil-100.jpg"],
  ["burdock-balm-concentrate-200", "Репейная серия", "balm", "укрепление волос", "sochni mustahkamlash", "200 мл", "4823015933035", "p06_02_3462_920x2008.jpg"],
  ["burdock-mask-300", "Репейная серия", "mask", "против выпадения волос", "soch to'kilishiga qarshi", "300 мл", "4823015933011", "p06_03_3463_1813x1970.jpg"],
  ["burdock-serum-150", "Репейная серия", "serum", "активный уход за корнями", "ildizlar uchun faol parvarish", "150 мл", "4823015933028", "generated-burdock-serum-150.jpg"],
  ["burdock-shampoo-1000", "Репейная серия", "shampoo", "укрепляющее очищение", "mustahkamlovchi tozalash", "1000 мл", "4823015932984", "generated-burdock-shampoo-1000.jpg"],

  ["hyaluron-mask-1000", "Hyaluron Hair", "mask", "глубокое увлажнение", "chuqur namlantirish", "1000 мл", "", "p07_02_4262_3000x3256.jpg"],
  ["hyaluron-conditioner-200", "Hyaluron Hair", "conditioner", "мягкость и восстановление", "yumshoqlik va tiklash", "200 мл", "", "p07_03_4263_1824x4000.jpg"],
  ["hyaluron-shampoo-250", "Hyaluron Hair", "shampoo", "глубокое увлажнение", "chuqur namlantirish", "250 мл", "", "p07_04_4264_1072x4000.jpg"],

  ["collagen-mask-1000", "Collagen Hair", "mask", "объем и плотность", "hajm va zichlik", "1000 мл", "", "p08_01_4720_1080x1160.jpg"],
  ["collagen-conditioner-200", "Collagen Hair", "conditioner", "volume boost", "volume boost", "200 мл", "", "p08_02_4721_878x1920.jpg"],
  ["collagen-shampoo-250", "Collagen Hair", "shampoo", "volume boost", "volume boost", "250 мл", "", "p08_03_4722_516x1920.jpg"],

  ["cucumber-micellar-water-200", "Cucumber Balance Control", "micellarWater", "очищение и свежесть", "tozalash va tetiklik", "200 мл", "4823015930058", "p09_01_4618_584x1920.jpg"],
  ["cucumber-cleansing-foam-150", "Cucumber Balance Control", "cleansingFoam", "мягкое очищение", "yumshoq tozalash", "150 мл", "4823015917400", "p09_02_4670_548x1920.jpg"],
  ["cucumber-mask-scrub-150", "Cucumber Balance Control", "scrubMask", "очищение пор", "teshikchalarni tozalash", "150 мл", "4823015917424", "p09_03_4620_768x1920.jpg"],
  ["cucumber-milk-200", "Cucumber Balance Control", "faceCream", "нормализующее молочко", "me'yorlovchi sutacha", "200 мл", "4823015917417", "p09_04_4671_578x1920.jpg"],
  ["cucumber-toner-200", "Cucumber Balance Control", "toner", "антибактериальный уход", "antibakterial parvarish", "200 мл", "4823015917394", "p09_05_4622_580x1920.jpg"],
  ["cucumber-peeling-75", "Cucumber Balance Control", "peeling", "мягкое обновление", "yumshoq yangilash", "75 мл", "4823015917769", "p09_06_4623_626x1920.jpg"],
  ["cucumber-face-cream-50", "Cucumber Balance Control", "faceCream", "матирующий уход", "matlashtiruvchi parvarish", "50 мл", "4823015917431", "p10_03_4678_1080x612.jpg"],

  ["vitamin-c-cleansing-foam-150", "Vitamin C", "cleansingFoam", "сияние и очищение", "yorqinlik va tozalash", "150 мл", "4823015941979", "p11_01_4650_407x1440.jpg"],
  ["vitamin-c-face-gel-200", "Vitamin C", "faceGel", "ежедневное очищение", "kundalik tozalash", "200 мл", "4823015940576", "p11_02_4651_479x1440.jpg"],
  ["vitamin-c-night-50", "Vitamin C", "nightCream", "ночное восстановление", "tungi tiklash", "50 мл", "4823015940569", "p11_05_4654_1080x1081.jpg"],
  ["vitamin-c-day-50", "Vitamin C", "dayCream", "дневное увлажнение SPF 15", "SPF 15 kunduzgi namlantirish", "50 мл", "4823015945496", "p11_06_4655_1066x1060.jpg"],

  ["cica-day-cream-50", "Cica + Zinc + AHA", "dayCream", "матирующий дневной уход", "matlashtiruvchi kunduzgi parvarish", "50 мл", "4823015946875", "p12_01_4997_1049x1038.jpg"],
  ["cica-night-50", "Cica + Zinc + AHA", "nightCream", "ночной ребаланс", "tungi rebalance", "50 мл", "4823015946882", "p12_03_5008_1080x1072.jpg"],
  ["hyaluron-aloe-night-50", "Hyaluron + Aloe", "nightCream", "активный ночной уход", "faol tungi parvarish", "50 мл", "4823015946738", "p12_05_5151_2000x1184.jpg"],
  ["hyaluron-aloe-day-50", "Hyaluron + Aloe", "dayCream", "активный дневной уход", "faol kunduzgi parvarish", "50 мл", "4823015946745", "p12_06_5152_2000x1184.jpg"],

  ["peptide-night-50", "Peptide + Niacinamide", "nightCream", "активный ночной крем", "faol tungi krem", "50 мл", "4823015946806", "generated-peptide-night-50.jpg"],
  ["peptide-day-50", "Peptide + Niacinamide", "dayCream", "активный дневной крем", "faol kunduzgi krem", "50 мл", "4823015946813", "generated-peptide-day-50.jpg"],

  ["simply-clean-cream-75", "Simply Clean 0%", "faceCream", "успокаивающий уход", "tinchlantiruvchi parvarish", "75 мл", "", "p14_03_5724_1468x2000.jpg"],
  ["simply-clean-foam-small-150", "Simply Clean 0%", "cleansingFoam", "ежедневная свежесть", "kundalik tetiklik", "150 мл", "4823015939242", "p14_04_5725_567x2000.jpg"],

  ["lip-balm-argan-3-6", "Lip Balm", "lipBalm", "аргановое масло, восстановление", "argan moyi, tiklash", "3,6 г", "8588006038019", "p15_02_5924_1350x2000.jpg"],
  ["lip-balm-coconut-3-6", "Lip Balm", "lipBalm", "кокосовое масло, увлажнение", "kokos moyi, namlantirish", "3,6 г", "8588006038033", "p15_03_5913_1371x2000.jpg"],
  ["lip-balm-shea-3-6", "Lip Balm", "lipBalm", "масло ши, питание", "shi moyi, oziqlantirish", "3,6 г", "8588006038026", "p15_04_5914_1330x2000.jpg"],

  ["hand-argan-75", "Natural Therapy", "handCream", "масло арганы, восстановление", "argan moyi, tiklash", "75 мл", "4823015914270", "p16_02_6049_708x2000.jpg"],
  ["hand-argan-30", "Natural Therapy", "handCream", "масло арганы, компактный формат", "argan moyi, ixcham format", "30 мл", "4823015925689", "p16_03_6050_600x800.jpg"],
  ["hand-coconut-30", "Natural Therapy", "handCream", "масло кокоса, глубокое увлажнение", "kokos moyi, chuqur namlantirish", "30 мл", "4823015925634", "generated-hand-coconut-30.jpg"],
  ["hand-coconut-75", "Natural Therapy", "handCream", "масло кокоса, глубокое увлажнение", "kokos moyi, chuqur namlantirish", "75 мл", "4823015914324", "generated-hand-coconut-75.jpg"],
  ["hand-shea-75", "Natural Therapy", "handCream", "масло ши, питание и защита", "shi moyi, oziqlantirish va himoya", "75 мл", "4823015914300", "p16_06_6062_736x2000.jpg"],
  ["hand-shea-30", "Natural Therapy", "handCream", "масло ши, компактный формат", "shi moyi, ixcham format", "30 мл", "4823015928127", "p16_07_6063_840x2000.jpg"],

  ["femme-intime-gel-230", "Femme Intime", "intimateGel", "нежный уход", "nozik parvarish", "230 мл", "4823015922916", "p17_03_6156_3000x2607.jpg"],
  ["femme-intime-milk-230", "Femme Intime", "intimateMilk", "мягкое прикосновение", "yumshoq teginish", "230 мл", "4823015922923", "p17_04_6157_3000x2598.jpg"],

  ["zero-soft-hand-90", "0% Soft", "handCream", "интенсивное увлажнение", "intensiv namlantirish", "90 мл", "4823015933448", "p18_05_6309_893x2684.jpg"],
  ["foot-cream-gel-90", "Foot Care", "footCreamGel", "тонизирующий уход", "tonus beruvchi parvarish", "90 мл", "4823015930454", "p19_03_6322_888x2638.jpg"],
];

const uzumProductOverrides = {
  "dr-sante-aloe-conditioner-200": {
    uzumTitle: "Soch uchun balzam konsentrat Dr.Sante Aloe Vera, 200 ml",
    href: "https://uzum.uz/uz/product/soch-uchun-balzam-183432?skuId=271871",
    image: "https://images.uzum.uz/d5rj3gmj76og35gkq0og/t_product_540_high.jpg",
  },
  "dr-sante-anti-hair-loss-oil-100": {
    uzumTitle: "Dr.Sante Anti Hair Loss moyi soch o'sishini faollashtiradi va ildizlarni mustahkamlaydi, 100 ml",
    href: "https://uzum.uz/uz/product/drsante-anti-hair-949229?skuId=2617034",
    image: "https://images.uzum.uz/d88mhqbsv8vo2t0gsa10/t_product_540_high.jpg",
  },
  "dr-sante-anti-hair-loss-balm-150": {
    uzumTitle: "Soch uchun balzam, soch to'kilishiga qarshi, Anti Hair Loss, Dr.Sante, 200 ml",
    href: "https://uzum.uz/uz/product/soch-uchun-balzam-183487?skuId=271933",
    image: "https://images.uzum.uz/cf024jivtie1lhbgn950/t_product_540_high.jpg",
  },
  "dr-sante-anti-hair-loss-mask-300": {
    uzumTitle: "Niqob Dr.Sante Anti Hair Loss, 300 ml",
    href: "https://uzum.uz/uz/product/niqob-drsante-anti-hair-loss-300-183505?skuId=271949",
    image: "https://images.uzum.uz/d88mgfi1146tv072etcg/t_product_540_high.jpg",
  },
  "dr-sante-anti-hair-loss-mask-1000": {
    uzumTitle: "Dr. Sante Soch to'kilishiga qarshi soch niqobi, 1000 ml",
    href: "https://uzum.uz/uz/product/dr-sante-soch-949346?skuId=2617241",
    image: "https://images.uzum.uz/d88miaa1146tv072eub0/t_product_540_high.jpg",
  },
  "dr-sante-anti-hair-loss-spray-150": {
    uzumTitle: "Dr. Sante Anti Hair Loss o'sishni faollashtirish uchun soch spreyi, 150 ml",
    href: "https://uzum.uz/uz/product/dr-sante-anti-949219?skuId=2621786",
    image: "https://images.uzum.uz/d88mgursv8vo2t0gs9e0/t_product_540_high.jpg",
  },
  "dr-sante-anti-hair-loss-shampoo-250": {
    uzumTitle: "Soch to'kilishiga qarshi shampun, Anti Hair Loss, Dr.Sante, 250 ml",
    href: "https://uzum.uz/uz/product/soch-tokilishiga-qarshi-183475?skuId=271921",
    image: "https://images.uzum.uz/d88mg2s9g1ktqmlourv0/t_product_540_high.jpg",
  },
  "dr-sante-anti-hair-loss-shampoo-1000": {
    uzumTitle: "Shampun Dr.Sante Anti Hair Loss, soch to'kilishiga qarshi, 1000 ml",
    href: "https://uzum.uz/uz/product/shampun-drsante-anti-432800?skuId=797863",
    image: "https://images.uzum.uz/d88lv4s9g1ktqmlouing/t_product_540_high.jpg",
  },
  "dr-sante-argan-shampoo-250": {
    uzumTitle: "Sochlar uchun shampun Dr.Sante Argan, 250 ml",
    href: "https://uzum.uz/uz/product/sochlar-uchun-shampun-drsante-argan-250-270763?skuId=412873",
    image: "https://images.uzum.uz/d6qkt6os9rf3ubr24dmg/t_product_540_high.jpg",
  },
  "dr-sante-coconut-shampoo-250": {
    uzumTitle: "Quruq va mo'rt sochlar uchun shampun DR.SANTE Coconut Hair, 250 ml",
    href: "https://uzum.uz/uz/product/quruq-va-mort-949182?skuId=2616664",
    image: "https://images.uzum.uz/d6qju8i1146th72va9e0/t_product_540_high.jpg",
  },
  "dr-sante-keratin-shampoo-250": {
    uzumTitle: "Shampun Dr.Sante keratin, arginin, kollagen, 250 ml",
    href: "https://uzum.uz/uz/product/shampun-drsante-keratin-110842?skuId=162632",
    image: "https://images.uzum.uz/d7d163c3obpufnhb5bog/t_product_540_high.jpg",
  },
  "dr-sante-keratin-conditioner-200": {
    uzumTitle: "Keratin balzam sochlar uchun, Dr.Sante, 200 ml",
    href: "https://uzum.uz/uz/product/keratin-balzam-sochlar-uchun-drsante-200-110115?skuId=161924",
    image: "https://images.uzum.uz/d5mvc5qi5abomerp2te0/t_product_540_high.jpg",
  },
  "dr-sante-keratin-shampoo-1000": {
    uzumTitle: "Nursiz va mo'rt sochlar uchun shampun, Keratin, Dr.Sante, 1000 ml",
    href: "https://uzum.uz/uz/product/nursiz-va-mort-183351?skuId=271789",
    image: "https://images.uzum.uz/d7ae18rsv8vlb6mmioeg/t_product_540_high.jpg",
  },
  "dr-sante-keratin-shampoo-400": {
    uzumTitle: "Soch uchun shampun Dr. Sante Keratin, 400 ml",
    href: "https://uzum.uz/uz/product/soch-uchun-shampun-dr-sante-keratin-1011630?skuId=2999178",
    image: "https://images.uzum.uz/d5kc2k52lln7rsu1mnc0/t_product_540_high.jpg",
  },
  "dr-sante-keratin-mask-300": {
    uzumTitle: "Keratin xira va mo'rt sochlar uchun niqob Dr.Sante, 300 ml",
    href: "https://uzum.uz/uz/product/keratin-xira-va-110387?skuId=162188",
    image: "https://images.uzum.uz/d5mvbb6j76og35gj2e8g/t_product_540_high.jpg",
  },
  "dr-sante-keratin-mask-1000": {
    uzumTitle: "Dr.Sante Keratin, xira va mo'rt sochlar uchun niqob, 1000 ml",
    href: "https://uzum.uz/uz/product/drsante-keratin-xira-183325?skuId=271760",
    image: "https://images.uzum.uz/d6ja9k21146th72s8cp0/t_product_540_high.jpg",
  },
  "dr-sante-keratin-serum-50": {
    uzumTitle: "Bo'lingan soch uchlari uchun flyuid Dr.Sante Keratin, 50 ml",
    href: "https://uzum.uz/uz/product/bolingan-soch-uchlari-1180540?skuId=3642439",
    image: "https://images.uzum.uz/d5k9s152lln7rsu1lc30/t_product_540_high.jpg",
  },
  "dr-sante-burdock-balm-concentrate-200": {
    uzumTitle: "Sochlar uchun balzam-konsentrat Dr.Sante, tokilishiga qarshi, 200 ml",
    href: "https://uzum.uz/uz/product/sochlar-uchun-balzamkonsentrat-183382?skuId=271821",
    image: "https://images.uzum.uz/cf1ojagv1htd23akrikg/t_product_540_high.jpg",
  },
  "dr-sante-cucumber-micellar-water-200": {
    uzumTitle: "Dr.Sante Yuz uchun micellar suvi Cucumber Balance Control, 200 ml",
    href: "https://uzum.uz/uz/product/drsante-yuz-uchun-949118?skuId=2616503",
    image: "https://images.uzum.uz/d6nqur21146th72u29lg/t_product_540_high.jpg",
  },
  "dr-sante-cucumber-cleansing-foam-150": {
    uzumTitle: "Yuvish uchun tozalovchi ko'pik Cucumber Balance Control Dr. Sante, 150 ml",
    href: "https://uzum.uz/uz/product/yuvish-uchun-tozalovchi-949070?skuId=2616462",
    image: "https://images.uzum.uz/d6qk6a8s9rf3ubr23sp0/t_product_540_high.jpg",
  },
  "dr-sante-cucumber-toner-200": {
    uzumTitle: "Dr. Sante tonik Cucumber, antibakterial, 200 ml",
    href: "https://uzum.uz/uz/product/dr-sante-tonik-cucumber-antibakterial-200-949136?skuId=2616551",
    image: "https://images.uzum.uz/d6qkid21146th72vaos0/t_product_540_high.jpg",
  },
  "dr-sante-cucumber-face-gel-200": {
    uzumTitle: "Yuzni tozalash uchun gel, Cucumber Balance Control, Dr.Sante, 200 ml",
    href: "https://uzum.uz/uz/product/yuzni-tozalash-uchun-183385?skuId=271824",
    image: "https://images.uzum.uz/d5rj9gj4eu2jdglgi4k0/t_product_540_high.jpg",
  },
  "dr-sante-hand-argan-30": {
    uzumTitle: "Qo'l kremi argan yog'i bilan Dr.Sante, 30 ml",
    href: "https://uzum.uz/uz/product/qol-kremi-argan-yogi-bilan-drsante-183421?skuId=271860",
    image: "https://images.uzum.uz/d6qlepos9rf3ubr24oi0/t_product_540_high.jpg",
  },
  "dr-sante-hand-shea-30": {
    uzumTitle: "Qo'l uchun krem Dr.Sante Shi yog'i bilan, 30 ml",
    href: "https://uzum.uz/uz/product/qol-uchun-krem-drsante-shi-yogi-110761?skuId=162552",
    image: "https://images.uzum.uz/cdnj858v1htd23ai0230/t_product_540_high.jpg",
  },
};

function buildProduct(spec, index) {
  const [id, lineKey, typeKey, effectRu, effectUz, volume, barcode, image] = spec;
  const type = productTypes[typeKey];
  const line = productLines[lineKey];
  const productId = `dr-sante-${id}`;
  const uzumOverride = uzumProductOverrides[productId] || {};
  const titleRu = `${type.ru} Dr.Sante ${line.ru}, ${effectRu}, ${volume}`;
  const titleUz = `${type.uz} Dr.Sante ${line.uz}, ${effectUz}, ${volume}`;

  return {
    id: productId,
    sku: `DRS-${String(index + 1).padStart(3, "0")}`,
    brand: "Dr.Sante",
    brandSlug: "dr-sante",
    line: line.ru,
    lineUz: line.uz,
    category: type.category,
    categoryLabel: categoryLabels.ru[type.category] || "Каталог",
    name: titleRu,
    nameRu: titleRu,
    nameUz: titleUz,
    title: titleRu,
    uzumTitle: uzumOverride.uzumTitle || titleRu,
    descriptionRu: `${line.descriptionRu} Акцент карточки: ${effectRu}.`,
    descriptionUz: `${line.descriptionUz} Kartochka aksenti: ${effectUz}.`,
    purpose: type.purposeRu,
    purposeRu: type.purposeRu,
    purposeUz: type.purposeUz,
    volume,
    barcode,
    source: catalogFallbackSource.name,
    href: uzumOverride.href || uzumShopUrl,
    image: uzumOverride.image || `${imageBase}${image}`,
    price: null,
    uzumCardPrice: null,
  };
}

export const localCatalogProducts = productSpecs.map(buildProduct);

export const catalogProducts = localCatalogProducts;

const categoryDescriptions = {
  ru: {
    shampoo: "шампунь для регулярного очищения волос и кожи головы",
    "hair-care": "средство для ухода за волосами, длиной или кожей головы",
    creams: "кремовый уход для лица, рук, тела или локальных зон",
    "face-care": "уход для очищения, тонизирования или ежедневной рутины лица",
    "body-care": "уход за телом с акцентом на комфорт кожи и аромат",
    "shower-gels": "средство для душа и ароматного очищения тела",
    bath: "товар для ванны, мыла или расслабляющего ухода",
    "hand-care": "уход за руками, ногтями или сухими участками кожи",
    "intimate-hygiene": "деликатная ежедневная гигиена",
    depilation: "товар для депиляции или ухода после процедуры",
    "lip-care": "компактный уход для защиты и увлажнения губ",
    "oral-care": "средство для ухода за полостью рта",
    household: "товар для чистоты дома, стирки или уборки",
  },
  uz: {
    shampoo: "soch va bosh terisini muntazam tozalash uchun shampun",
    "hair-care": "soch uzunligi yoki bosh terisi uchun parvarish vositasi",
    creams: "yuz, qo'l, tana yoki lokal zonalar uchun krem parvarishi",
    "face-care": "yuzni tozalash, tonizatsiya qilish yoki kundalik parvarish",
    "body-care": "teri qulayligi va aromatga urg'u berilgan tana parvarishi",
    "shower-gels": "dush va xushbo'y tana tozaligi uchun vosita",
    bath: "vanna, sovun yoki uyda dam olish parvarishi uchun tovar",
    "hand-care": "qo'l, tirnoq yoki quruq teri qismlari uchun parvarish",
    "intimate-hygiene": "nozik kundalik gigiyena",
    depilation: "depilyatsiya yoki protseduradan keyingi parvarish tovari",
    "lip-care": "lablarni himoya qilish va namlantirish uchun kompakt parvarish",
    "oral-care": "og'iz bo'shlig'i parvarishi uchun vosita",
    household: "uy tozaligi, kir yuvish yoki yig'ishtirish uchun tovar",
  },
};

const categoryPurposes = {
  ru: {
    shampoo: "Очищение волос и кожи головы.",
    "hair-care": "Уход за волосами, смягчение, укрепляющая или восстанавливающая рутина.",
    creams: "Питание, смягчение и ежедневный уход за кожей.",
    "face-care": "Очищение, тонизирование или уход за кожей лица.",
    "body-care": "Уход за телом, комфорт кожи и приятный аромат.",
    "shower-gels": "Очищение тела в душе.",
    bath: "Ванна, мыло или расслабляющий домашний уход.",
    "hand-care": "Уход за руками и ногтями.",
    "intimate-hygiene": "Деликатная ежедневная гигиена.",
    depilation: "Депиляция и уход до или после процедуры.",
    "lip-care": "Защита и увлажнение губ.",
    "oral-care": "Полоскание и уход за полостью рта.",
    household: "Уборка, стирка или удаление пятен.",
  },
  uz: {
    shampoo: "Soch va bosh terisini tozalash.",
    "hair-care": "Soch parvarishi, yumshatish, mustahkamlash yoki tiklovchi rutina.",
    creams: "Terini oziqlantirish, yumshatish va kundalik parvarish.",
    "face-care": "Yuz terisini tozalash, tonizatsiya qilish yoki parvarish.",
    "body-care": "Tana parvarishi, teri qulayligi va yoqimli aromat.",
    "shower-gels": "Dushda tanani tozalash.",
    bath: "Vanna, sovun yoki uyda dam beruvchi parvarish.",
    "hand-care": "Qo'l va tirnoq parvarishi.",
    "intimate-hygiene": "Nozik kundalik gigiyena.",
    depilation: "Depilyatsiya va protseduradan oldin yoki keyingi parvarish.",
    "lip-care": "Lablarni himoya qilish va namlantirish.",
    "oral-care": "Og'iz bo'shlig'ini chayish va parvarish.",
    household: "Tozalash, kir yuvish yoki dog'larni ketkazish.",
  },
};

export function getCategoryLabel(value, language = "ru") {
  return categoryLabels[language]?.[value] || categoryLabels.ru[value] || value;
}

function getCategoryDescription(category, language = "ru") {
  return categoryDescriptions[language]?.[category] || categoryDescriptions.ru[category] || "товар ежедневного ухода";
}

function getLocalizedProductField(product, field, language) {
  const localizedKey = `${field}${language === "uz" ? "Uz" : "Ru"}`;
  const fallbackKey = `${field}${language === "uz" ? "Ru" : "Uz"}`;
  return product[localizedKey] || product[field] || product[fallbackKey] || "";
}

function formatProductUnits(text, language) {
  if (!text || language !== "uz") return text;
  return String(text).replace(/(\d+(?:[,.]\d+)?)\s*мл/g, "$1 ml").replace(/(\d+(?:[,.]\d+)?)\s*г/g, "$1 g");
}

export function getProductBrand(product) {
  return brands.find((brand) => brand.slug === product.brandSlug);
}

export function getProductTheme(product) {
  return getProductBrand(product)?.theme || "theme-sante";
}

export function getProductTitle(product, language = "ru") {
  const title = language === "uz" ? product.nameUz || product.titleUz : product.nameRu || product.titleRu;
  return formatProductUnits(title || product.name || product.title || product.uzumTitle || "", language);
}

export function getProductDescription(product, language = "ru") {
  const customDescription = getLocalizedProductField(product, "description", language);
  if (customDescription) return formatProductUnits(customDescription, language);

  const brand = getProductBrand(product);
  const brandName = brand?.name || product.brand || "Dr.Sante";
  const description = getCategoryDescription(product.category, language);
  const suffix =
    language === "uz"
      ? "Kartochka Uzum Marketdagi aniq tovarga olib boradi."
      : "Карточка ведет на конкретный товар в Uzum Market.";
  return formatProductUnits(`${brandName}: ${description}. ${suffix}`, language);
}

export function getProductPurpose(product, language = "ru") {
  return formatProductUnits(getLocalizedProductField(product, "purpose", language) || inferProductPurpose(product.category, language), language);
}

export function getProductVolume(product, language = "ru") {
  return formatProductUnits(product.volume || inferProductVolume(getProductTitle(product, "ru")), language);
}

export function inferProductPurpose(category, language = "ru") {
  return categoryPurposes[language]?.[category] || categoryPurposes.ru[category] || "Ежедневный уход.";
}

export function formatPrice(price, language = "ru") {
  if (!price) return language === "uz" ? "Narx Uzumda" : "Цена в Uzum";
  return `${new Intl.NumberFormat(language === "uz" ? "uz-UZ" : "ru-RU").format(price)} ${language === "uz" ? "so'm" : "сум"}`;
}

function normalizePrice(value) {
  if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : null;
  if (!value) return null;
  const parsed = Number(String(value).replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function normalizeImageUrl(image) {
  if (!image) return `${import.meta.env.BASE_URL}beauty-harmony-hero.png`;
  if (/^(https?:|data:|\/|\.\/)/i.test(image)) return image;
  return `${import.meta.env.BASE_URL}${String(image).replace(/^\/+/, "")}`;
}

function inferProductBrand(product) {
  const text = `${product.title || ""} ${product.name || ""} ${product.id || ""}`.toLowerCase();
  const found = brands.find((brand) => text.includes(brand.slug) || text.includes(brand.name.toLowerCase()));
  return found ? { name: found.name, slug: found.slug } : { name: "Dr.Sante", slug: "dr-sante" };
}

function inferProductCategory(product) {
  const text = `${product.title || ""} ${product.name || ""} ${product.id || ""}`.toLowerCase();
  const rules = [
    [/intim/, "intimate-hygiene"],
    [/lab|lip|губ|pomada/, "lip-care"],
    [/shampun|shampoo|шампун/, "shampoo"],
    [/balzam|niqob|maska|маска|soch|hair|moy|oil|flyuid|fluid|sprey|spray|serum|сыворот/, "hair-care"],
    [/dush|shower|душ/, "shower-gels"],
    [/hammom|vanna|bath|soap|sovun|мыло/, "bath"],
    [/qo'l|qol|hand|рук/, "hand-care"],
    [/yuz|face|tonik|toner|micellar|gel|foam|лиц/, "face-care"],
    [/tana|body|тела/, "body-care"],
    [/krem|cream|крем/, "creams"],
  ];
  const value = rules.find(([pattern]) => pattern.test(text))?.[1] || "body-care";
  return { value, label: getCategoryLabel(value, "ru") };
}

function inferProductVolume(title = "") {
  const match = String(title).match(/(\d+(?:[.,]\d+)?)\s*(ml|мл|litr|литр|л|g|г|гр|dona|дона|ta|шт)/i);
  if (!match) return "";
  return `${match[1].replace(".", ",")} ${match[2]}`;
}

export function normalizeCatalogProduct(product, index = 0) {
  const title = product.title || product.nameRu || product.name || product.uzumTitle || "";
  const brand = product.brandSlug ? { name: product.brand || "Dr.Sante", slug: product.brandSlug } : inferProductBrand({ ...product, title });
  const inferredCategory = product.category ? null : inferProductCategory({ ...product, title });
  const category = product.category || inferredCategory.value;

  return {
    ...product,
    id: product.id || `api-product-${index + 1}`,
    name: product.name || product.nameRu || title,
    nameRu: product.nameRu || product.titleRu || product.name || title,
    nameUz: product.nameUz || product.titleUz || product.name || title,
    uzumTitle: product.uzumTitle || title,
    brand: product.brand || brand.name,
    brandSlug: product.brandSlug || brand.slug,
    category,
    categoryLabel: product.categoryLabel || inferredCategory?.label || getCategoryLabel(category, "ru"),
    volume: product.volume || inferProductVolume(title),
    purpose: product.purpose || product.purposeRu || inferProductPurpose(category),
    description: product.description || product.descriptionRu || "",
    href: product.href || product.url || product.link || uzumShopUrl,
    image: normalizeImageUrl(product.image || product.imageUrl || product.photo),
    price: normalizePrice(product.price),
    uzumCardPrice: normalizePrice(product.uzumCardPrice || product.cardPrice),
  };
}

export function extractApiProducts(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload.value)) return payload.value;
  if (Array.isArray(payload.products)) return payload.products;
  if (Array.isArray(payload.items)) return payload.items;

  if (typeof payload.value === "string") {
    try {
      const parsed = JSON.parse(payload.value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  if (payload.id && (payload.name || payload.nameRu || payload.title)) return [payload];
  return [];
}

export const fallbackCatalogProducts = localCatalogProducts.map(normalizeCatalogProduct);
