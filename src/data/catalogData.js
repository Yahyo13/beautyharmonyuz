import { brands, getBrandCopy } from "./siteContent";
import { uzumCatalogProductsRaw } from "./uzumCatalogProducts.generated";

// Product enrichment, catalog filters, prices, and generated Uzum product data.

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

const productPurposes = {
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

export function getCategoryLabel(value, language) {
  return categoryLabels[language]?.[value] || categoryLabels.ru[value] || value;
}

export function getProductDescription(product, language) {
  const brand = getBrandCopy(getProductBrand(product) || { name: product.brand }, language);
  const description = getCategoryDescription(product.category, language);
  const suffix =
    language === "uz"
      ? "Kartochka Uzum Marketdagi aniq tovarga olib boradi."
      : "Карточка ведет на конкретный товар в Uzum Market.";
  return `${brand.name}: ${description}. ${suffix}`;
}

const curatedCatalogProducts = [
  {
    id: "doctor-balm-mask-triple-power",
    name: "Бальзам-маска против выпадения волос «Тройная сила», Домашний Доктор, 500 мл",
    uzumTitle: "Soch to‘kilishiga qarshi balzam-niqob, Uchlik kuchi, Uy tabibi, 500 ml",
    brand: "The Doctor / Домашний Доктор",
    brandSlug: "the-doctor",
    category: "hair-care",
    categoryLabel: "Уход за волосами",
    price: 60864,
    image: "https://images.uzum.uz/d5psrp34eu2jdglfvph0/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/soch-tokilishiga-qarshi-183367?skuId=271806",
    volume: "500 мл",
    purpose: "Для ослабленных волос и ухода после мытья.",
    description: "Маска-бальзам для укрепляющего ухода: помогает волосам выглядеть более мягкими, плотными и ухоженными.",
  },
  {
    id: "doctor-burdock-red-pepper-oil",
    name: "Репейное масло с красным перцем для роста волос, Домашний Доктор, 100 мл",
    uzumTitle: "Qizil qalampirli repey moyi, soch o‘sishini tezlashtiradi, Домашний Доктор, 100 ml",
    brand: "The Doctor / Домашний Доктор",
    brandSlug: "the-doctor",
    category: "hair-care",
    categoryLabel: "Уход за волосами",
    price: 41040,
    image: "https://images.uzum.uz/crpu17uvip07shn64d80/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/qizil-qalampirli-repey-183339?skuId=271777",
    volume: "100 мл",
    purpose: "Для прикорневого ухода и визуального укрепления волос.",
    description: "Масло для волос с репейной основой и красным перцем в формате интенсивного домашнего ухода.",
  },
  {
    id: "doctor-mumiyo-honey-shampoo",
    name: "Шампунь с алтайским мумиё и медом, Домашний Доктор, 1000 мл",
    uzumTitle: "Shampun soch uchun, oltoy mumiyosi va asali, rag'batlantiruvchi, Домашний Доктор, 1000 ml",
    brand: "The Doctor / Домашний Доктор",
    brandSlug: "the-doctor",
    category: "shampoo",
    categoryLabel: "Шампуни",
    price: 71078,
    image: "https://images.uzum.uz/cqu44nfiraat934p7a6g/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/shampun-soch-uchun-183342?skuId=271780",
    volume: "1000 мл",
    purpose: "Для регулярного очищения волос и кожи головы.",
    description: "Большой семейный шампунь с медом и мумиё для ежедневного ухода за волосами.",
  },
  {
    id: "doctor-bodyaga-forte-gel",
    name: "Гель для лица и тела Bodyaga-forte, Домашний Доктор, 75 мл",
    uzumTitle: "Yuz va tana uchun gel ''Bodyaga-forte'', Uy shifokori, 75 ml",
    brand: "The Doctor / Домашний Доктор",
    brandSlug: "the-doctor",
    category: "face-care",
    categoryLabel: "Уход за лицом",
    price: 41155,
    image: "https://images.uzum.uz/d5rj1smj76og35gkpvvg/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/yuz-va-tana-183453?skuId=271892",
    volume: "75 мл",
    purpose: "Для локального ухода за кожей лица и тела.",
    description: "Компактный гель для точечного ухода, который удобно держать дома или брать с собой.",
  },
  {
    id: "doctor-triple-power-shampoo",
    name: "Шампунь против выпадения волос «Тройная сила», Домашний Доктор, 1000 мл",
    uzumTitle: "Shampun soch to'kilishiga qarshi, Uch quvvat, Домашний Доктор, 1000 ml",
    brand: "The Doctor / Домашний Доктор",
    brandSlug: "the-doctor",
    category: "shampoo",
    categoryLabel: "Шампуни",
    price: 71078,
    image: "https://images.uzum.uz/d5sfbvuj76og35gl71p0/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/shampun-soch-tokilishiga-270738?skuId=412848",
    volume: "1000 мл",
    purpose: "Для очищения ослабленных волос.",
    description: "Литровый шампунь из линии «Тройная сила» для семейного ухода и экономичного расхода.",
  },
  {
    id: "dr-sante-keratin-shampoo",
    name: "Шампунь Dr.Sante Keratin: кератин, аргинин, коллаген, 250 мл",
    uzumTitle: "Shampun Dr.Sante keratin, arginin, kollagen, 250 ml",
    brand: "Dr.Sante",
    brandSlug: "dr-sante",
    category: "shampoo",
    categoryLabel: "Шампуни",
    price: 43622,
    image: "https://images.uzum.uz/d7d163c3obpufnhb5bog/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/shampun-drsante-keratin-110842?skuId=162632",
    volume: "250 мл",
    purpose: "Для гладкости, ухода за длиной и визуального восстановления волос.",
    description: "Шампунь Dr.Sante с кератином, аргинином и коллагеном для аккуратной ежедневной рутины.",
  },
  {
    id: "doctor-burdock-oil",
    name: "Репейное масло против выпадения волос, Домашний Доктор, 100 мл",
    uzumTitle: "Burdok yog'i, soch to'kilishiga qarshi, Домашний Доктор, 100 ml",
    brand: "The Doctor / Домашний Доктор",
    brandSlug: "the-doctor",
    category: "hair-care",
    categoryLabel: "Уход за волосами",
    price: 44544,
    image: "https://images.uzum.uz/d5p0ngej76og35gjstg0/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/burdok-yogi-soch-372004?skuId=647906",
    volume: "100 мл",
    purpose: "Для масляного ухода за волосами и кожей головы.",
    description: "Классический формат репейного масла для домашнего ухода за волосами.",
  },
  {
    id: "green-pharmacy-tea-tree-intimate-soap",
    name: "Интимное мыло «Чайное дерево», Зеленая Аптека, 370 мл",
    uzumTitle: "Intim sovun gigiena uchun, Choy daraxti, Зеленая Аптека, 370 ml",
    brand: "Green Pharmacy / Зеленая Аптека",
    brandSlug: "green-pharmacy",
    category: "intimate-hygiene",
    categoryLabel: "Интимная гигиена",
    price: 46986,
    image: "https://images.uzum.uz/d5psvumj76og35gk7mkg/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/intim-sovun-gigiena-183468?skuId=271905",
    volume: "370 мл",
    purpose: "Для ежедневной деликатной гигиены.",
    description: "Средство Green Pharmacy с чайным деревом в спокойной травяной эстетике бренда.",
  },
  {
    id: "doctor-calendula-cream",
    name: "Питательный крем с календулой, Домашний Доктор, 42 мл",
    uzumTitle: "Krem Домашний Доктор Dorivor kalendula, oziqlantiruvchi, 42 ml",
    brand: "The Doctor / Домашний Доктор",
    brandSlug: "the-doctor",
    category: "creams",
    categoryLabel: "Кремы",
    price: 22483,
    image: "https://images.uzum.uz/cevrv2qvtie1lhbgm9i0/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/krem-domashnij-doktor-183315?skuId=271749",
    volume: "42 мл",
    purpose: "Для питания и смягчения сухих участков кожи.",
    description: "Небольшой крем с календулой для повседневного семейного ухода.",
  },
  {
    id: "green-pharmacy-aloe-flax-face-gel",
    name: "Мягкий гель для умывания с алоэ и маслом льна, Зеленая Аптека, 270 мл",
    uzumTitle: "Yuvinish uchun mayin gel Зеленая Аптека, aloe va zig'ir yog'i, 270 ml",
    brand: "Green Pharmacy / Зеленая Аптека",
    brandSlug: "green-pharmacy",
    category: "face-care",
    categoryLabel: "Уход за лицом",
    price: 44544,
    image: "https://images.uzum.uz/d6nrbv8s9rf3ubr0ro2g/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/yuvinish-uchun-mayin-270637?skuId=412664",
    volume: "270 мл",
    purpose: "Для мягкого очищения лица.",
    description: "Гель для умывания с алоэ и льняным маслом для ежедневного очищения без лишней агрессии.",
  },
  {
    id: "doctor-beer-yeast-olive-shampoo",
    name: "Шампунь с пивными дрожжами и оливковым маслом, Домашний Доктор, 1000 мл",
    uzumTitle: "Shampun soch uchun, pivo xamirturushi va zaytun moyi, Домашний Доктор, 1000 ml",
    brand: "The Doctor / Домашний Доктор",
    brandSlug: "the-doctor",
    category: "shampoo",
    categoryLabel: "Шампуни",
    price: 71078,
    image: "https://images.uzum.uz/crqgnjchug2lhicoho8g/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/shampun-soch-uchun-183399?skuId=271838",
    volume: "1000 мл",
    purpose: "Для очищения и смягчения волос.",
    description: "Большой шампунь с пивными дрожжами и оливковым маслом для семейного использования.",
  },
  {
    id: "elfa-pharm-lip-balm-blue",
    name: "Гигиеническая помада для защиты и увлажнения губ, 3.6 г, оттенок Blue",
    uzumTitle: "Gigiyenik lab pomadasi, lablar uchun himoya va namlantiruvchi parvarish, 3.6 g",
    brand: "Elfa Pharm",
    brandSlug: "elfa-pharm",
    category: "lip-care",
    categoryLabel: "Уход за губами",
    price: 25920,
    image: "https://images.uzum.uz/d88otnk9g1ktqmlp0c00/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/gigiyenik-lab-pomadasi-moviy---127-2843886?skuId=10393953",
    volume: "3.6 г",
    purpose: "Для защиты и увлажняющего ухода за губами.",
    description: "Компактная гигиеническая помада для повседневного ухода в сумке, кармане или на кассе.",
  },
  {
    id: "elfa-pharm-lip-balm-green",
    name: "Гигиеническая помада для защиты и увлажнения губ, 3.6 г, оттенок Green",
    uzumTitle: "Gigiyenik lab pomadasi, lablar uchun himoya va namlantiruvchi parvarish, 3.6 g",
    brand: "Elfa Pharm",
    brandSlug: "elfa-pharm",
    category: "lip-care",
    categoryLabel: "Уход за губами",
    price: 25920,
    image: "https://images.uzum.uz/d88p6h3sv8vo2t0gtv3g/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/gigiyenik-lab-pomadasi-yashil---120-2843886?skuId=10393955",
    volume: "3.6 г",
    purpose: "Для ежедневной защиты губ от сухости.",
    description: "Небольшой бальзам-помада с понятным назначением: увлажнение, комфорт и защита.",
  },
  {
    id: "elfa-pharm-lip-balm-turquoise",
    name: "Гигиеническая помада для защиты и увлажнения губ, 3.6 г, оттенок Turquoise",
    uzumTitle: "Gigiyenik lab pomadasi, lablar uchun himoya va namlantiruvchi parvarish, 3.6 g",
    brand: "Elfa Pharm",
    brandSlug: "elfa-pharm",
    category: "lip-care",
    categoryLabel: "Уход за губами",
    price: 25920,
    image: "https://images.uzum.uz/d88p7drsv8vo2t0gtvpg/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/gigiyenik-lab-pomadasi-toʻq-firuza---276-2843886?skuId=10393956",
    volume: "3.6 г",
    purpose: "Для увлажнения губ в течение дня.",
    description: "Карманный формат ухода за губами с яркой упаковкой для быстрой покупки.",
  },
  {
    id: "elfa-pharm-lip-balm-dark-blue",
    name: "Гигиеническая помада для защиты и увлажнения губ, 3.6 г, оттенок Dark Blue",
    uzumTitle: "Gigiyenik lab pomadasi, lablar uchun himoya va namlantiruvchi parvarish, 3.6 g",
    brand: "Elfa Pharm",
    brandSlug: "elfa-pharm",
    category: "lip-care",
    categoryLabel: "Уход за губами",
    price: 25920,
    image: "https://images.uzum.uz/d88p5gs9g1ktqmlp0htg/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/gigiyenik-lab-pomadasi-koʻk---125-2843886?skuId=10393954",
    volume: "3.6 г",
    purpose: "Для базового ухода и защиты губ.",
    description: "Гигиеническая помада в маленьком формате, который хорошо работает как товар ежедневного спроса.",
  },
  {
    id: "doctor-retinol-face-cream",
    name: "Интенсивный антивозрастной крем для лица с ретинолом, Домашний Доктор, 30 мл",
    uzumTitle: "Krem yuz uchun, intensiv qarishga qarshi, Ретинол, Домашний Доктор, 30 ml",
    brand: "The Doctor / Домашний Доктор",
    brandSlug: "the-doctor",
    category: "creams",
    categoryLabel: "Кремы",
    price: 32630,
    image: "https://images.uzum.uz/d7jlaa21146ojv9gfs80/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/krem-yuz-uchun-183459?skuId=271898",
    volume: "30 мл",
    purpose: "Для ухода за возрастной кожей лица.",
    description: "Крем с ретинолом в небольшом тюбике для вечерней или курсовой уходовой рутины.",
  },
  {
    id: "fresh-juice-passion-fruit-shower-cream",
    name: "Крем-гель для душа Fresh Juice Passion Fruit & Magnolia, 400 мл",
    uzumTitle: "Dush uchun kremli gel Fresh Juice ''Passion fruit & magnolia'', 400 ml",
    brand: "Fresh Juice",
    brandSlug: "fresh-juice",
    category: "shower-gels",
    categoryLabel: "Гели для душа",
    price: 33849,
    image: "https://images.uzum.uz/d5qtt07iub393sdd6c00/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/dush-uchun-kremli-270716?skuId=412775",
    volume: "400 мл",
    purpose: "Для ароматного очищения тела в душе.",
    description: "Сочный крем-гель Fresh Juice с ароматом маракуйи и магнолии для яркой body-care полки.",
  },
  {
    id: "doctor-collagen-lifting-cream",
    name: "Лифтинг-крем для лица с коллагеном, Домашний Доктор, 30 мл",
    uzumTitle: "Yuz uchun lifting kremi Домашний Доктор kollagenli, 30 ml",
    brand: "The Doctor / Домашний Доктор",
    brandSlug: "the-doctor",
    category: "creams",
    categoryLabel: "Кремы",
    price: 27187,
    image: "https://images.uzum.uz/d85fj0rsv8vo2t0fk9o0/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/yuz-uchun-lifting-183489?skuId=271935",
    volume: "30 мл",
    purpose: "Для ухода за кожей лица и поддержания ощущения упругости.",
    description: "Крем с коллагеном для понятного антивозрастного ухода в доступном формате.",
  },
  {
    id: "lady-caramel-sensitive-depilation-cream",
    name: "Крем для депиляции тела Lady Caramel для чувствительной кожи, 100 мл",
    uzumTitle: "Depilatsiya uchun tana kremi Lady Caramel, sezgir teri uchun, 100 ml",
    brand: "Lady Caramel",
    brandSlug: "lady-caramel",
    category: "depilation",
    categoryLabel: "Депиляция",
    price: 38877,
    image: "https://images.uzum.uz/d5r5j0mj76og35gkmf8g/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/depilatsiya-uchun-tana-183316?skuId=271750",
    volume: "100 мл",
    purpose: "Для домашней депиляции чувствительной кожи.",
    description: "Крем Lady Caramel в мягкой карамельной эстетике бренда для аккуратной процедуры дома.",
  },
  {
    id: "dr-sante-cucumber-micellar-water",
    name: "Мицеллярная вода Dr.Sante Cucumber Balance Control, 200 мл",
    uzumTitle: "Dr.Sante Yuz uchun micellar suvi Cucumber Balance Control, 200 ml",
    brand: "Dr.Sante",
    brandSlug: "dr-sante",
    category: "face-care",
    categoryLabel: "Уход за лицом",
    price: 39628,
    image: "https://images.uzum.uz/d6nqur21146th72u29lg/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/drsante-yuz-uchun-949118?skuId=2616503",
    volume: "200 мл",
    purpose: "Для очищения лица и снятия макияжа.",
    description: "Мицеллярная вода с огуречной концепцией Balance Control для свежего ежедневного очищения.",
  },
  {
    id: "fresh-juice-lemongrass-vanilla-shower-gel",
    name: "Гель для душа Fresh Juice Lemongrass & Vanilla, 500 мл",
    uzumTitle: "Dush jeli, yangi sharbat, limon o'ti va vanil, 500 ml",
    brand: "Fresh Juice",
    brandSlug: "fresh-juice",
    category: "shower-gels",
    categoryLabel: "Гели для душа",
    price: 54220,
    image: "https://images.uzum.uz/d5qtufniub393sdd6cpg/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/dush-jeli-yangi-459311?skuId=872062",
    volume: "500 мл",
    purpose: "Для ежедневного душа и ароматного ухода за телом.",
    description: "Яркий гель Fresh Juice с лимонной травой и ванилью для бодрой, сочной полки.",
  },
  {
    id: "mister-dez-professional-bleach",
    name: "Mister Dez Professional: отбеливатель и пятновыводитель, 1000 мл",
    uzumTitle: "Mister Dez PROFESSIONAL oqartiruvchi dog'larni yo'qotuvchi yorqinligini tiklovchi, 1000 ml",
    brand: "Mister Dez",
    brandSlug: "mister-dez",
    category: "household",
    categoryLabel: "Бытовая химия",
    price: 25058,
    image: "https://images.uzum.uz/d5iivfrs2tab83sbhs5g/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/mister-dez-professional-918372?skuId=2461964",
    volume: "1000 мл",
    purpose: "Для стирки, удаления пятен и восстановления белизны тканей.",
    description: "Household-позиция Mister Dez, которая расширяет каталог за пределы косметики и ухода.",
  },
  {
    id: "green-pharmacy-green-tea-ginkgo-face-gel",
    name: "Мягкий гель для умывания «Зеленый чай и гинкго билоба», Зеленая Аптека, 270 мл",
    uzumTitle: "Yuvinish uchun mayin gel, Yashil choy va Ginkgo biloba, Zelenaia Apteka, 270 ml",
    brand: "Green Pharmacy / Зеленая Аптека",
    brandSlug: "green-pharmacy",
    category: "face-care",
    categoryLabel: "Уход за лицом",
    price: 44544,
    image: "https://images.uzum.uz/d6nrlu21146th72u2okg/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/yuvinish-uchun-mayin-270638?skuId=412665",
    volume: "270 мл",
    purpose: "Для мягкого умывания и ежедневного очищения лица.",
    description: "Травяной гель Green Pharmacy с зеленым чаем и гинкго билоба для спокойного ухода за лицом.",
  },
  {
    id: "green-pharmacy-olive-face-cream",
    name: "Питательно-восстанавливающий крем для лица «Оливковый», Зеленая Аптека, 200 мл",
    uzumTitle: "Yuz uchun krem Zaytunli, oziqlantiruvchi va tiklovchi, Зеленая Аптека, 200 ml",
    brand: "Green Pharmacy / Зеленая Аптека",
    brandSlug: "green-pharmacy",
    category: "creams",
    categoryLabel: "Кремы",
    price: 44697,
    image: "https://images.uzum.uz/d6nrv3tsp2tohdbdo0g0/t_product_540_high.jpg",
    href: "https://uzum.uz/uz/product/yuz-uchun-krem-183310?skuId=271744",
    volume: "200 мл",
    purpose: "Для питания, смягчения и универсального ухода за кожей.",
    description: "Крем Green Pharmacy с оливковой концепцией в большом формате для лица, рук или тела.",
  },
];

const curatedRussianNamesByHref = new Map(curatedCatalogProducts.map((product) => [product.href, product.name]));
export const catalogProducts = uzumCatalogProductsRaw.map(enrichCatalogProduct);

export const productSourceNote =
  "Цены, изображения и ссылки взяты со страниц магазина Beauty Harmony в Uzum Market 24 мая 2026. Основной прайс - обычная цена, цена Uzum-karta показана отдельно.";

export function getProductBrand(product) {
  return brands.find((brand) => brand.slug === product.brandSlug);
}

export function getProductTheme(product) {
  return getProductBrand(product)?.theme || "theme-pharm";
}

export function formatPrice(price, language = "ru") {
  if (!price) return language === "uz" ? "Narx Uzumda" : "Цена в Uzum";
  return `${new Intl.NumberFormat(language === "uz" ? "uz-UZ" : "ru-RU").format(price)} ${language === "uz" ? "so'm" : "сум"}`;
}

function enrichCatalogProduct(product) {
  const brand = inferProductBrand(product);
  const category = inferProductCategory(product);
  const volume = inferProductVolume(product.title);

  return {
    ...product,
    name: product.title,
    nameRu: getRussianProductName(product, brand, category.value, volume),
    uzumTitle: product.title,
    brand: brand.name,
    brandSlug: brand.slug,
    category: category.value,
    categoryLabel: category.label,
    volume,
    purpose: inferProductPurpose(category.value),
    description: `${brand.name}: ${category.description}. Карточка ведет на конкретный товар в Uzum Market.`,
  };
}

export function getProductTitle(product, language) {
  return language === "uz" ? product.name : product.nameRu || product.name;
}

function getRussianProductName(product, brand, category, volume) {
  const curatedName = curatedRussianNamesByHref.get(product.href);
  if (curatedName) return curatedName;

  const brandName = getRussianBrandName(brand);
  const baseByCategory = {
    shampoo: `Шампунь ${brandName}`,
    "hair-care": `Средство для ухода за волосами ${brandName}`,
    creams: `Крем ${brandName}`,
    "face-care": `Средство для ухода за лицом ${brandName}`,
    "body-care": `Средство для ухода за телом ${brandName}`,
    "shower-gels": `Гель для душа ${brandName}`,
    bath: `Средство для ванны ${brandName}`,
    "hand-care": `Крем для рук ${brandName}`,
    "intimate-hygiene": `Средство для интимной гигиены ${brandName}`,
    depilation: `Средство для депиляции ${brandName}`,
    "lip-care": `Гигиеническая помада ${brandName}`,
    "oral-care": `Эликсир для полости рта ${brandName}`,
    household: `Средство бытовой химии ${brandName}`,
  };

  const line = getRussianProductLine(product.title);
  const normalizedVolume = volume && volume !== "уточнить в Uzum" ? volume : "";
  const titleParts = [baseByCategory[category] || `Товар ${brandName}`];

  if (line) titleParts.push(line);
  if (normalizedVolume) titleParts.push(normalizedVolume);

  return titleParts.join(", ");
}

function getRussianBrandName(brand) {
  if (brand.slug === "the-doctor") return "Домашний Доктор";
  if (brand.slug === "green-pharmacy") return "Зеленая Аптека";
  return brand.name;
}

function getRussianProductLine(title) {
  const text = title.toLowerCase();
  const lines = [
    [/uchlik kuchi|uch quvvat|triple power/, "«Тройная сила»"],
    [/oltoy mumiyosi|mumiyosi/, "с алтайским мумиё"],
    [/qizil qalampir|qalampirli|red pepper/, "с красным перцем"],
    [/dorivor kalendula|kalendula/, "с календулой"],
    [/aloe vera|aloe/, "с алоэ"],
    [/zig'ir|zig‘ir|flax/, "с маслом льна"],
    [/pivo xamirturushi|beer yeast/, "с пивными дрожжами"],
    [/zaytun|olive/, "с оливковым маслом"],
    [/keratin/, "Keratin"],
    [/anti hair loss|soch to['‘’]?kilishiga qarshi|tokilishiga qarshi/, "Anti Hair Loss"],
    [/hyaluron|gialuron/, "Hyaluron"],
    [/cucumber/, "Cucumber Balance Control"],
    [/coconut hair|coconut/, "Coconut Hair"],
    [/argan/, "с аргановым маслом"],
    [/bodyaga/, "Bodyaga-forte"],
    [/retinol/, "с ретинолом"],
    [/kollagen|collagen/, "с коллагеном"],
    [/jenshen|ginseng/, "с женьшенем"],
    [/ilon zahari|snake/, "с пептидами змеиного яда"],
    [/echki suti|goat/, "с козьим молоком"],
    [/shalfey|sage/, "с шалфеем"],
    [/yashil choy|green tea/, "зеленый чай и гинкго билоба"],
    [/bug'doy|bug‘doy/, "с зародышами пшеницы"],
    [/choy daraxti|tea tree/, "чайное дерево"],
    [/passion fruit|marakuyya/, "Passion Fruit"],
    [/magnolia/, "Magnolia"],
    [/limon o'ti|limon o‘ti|lemongrass/, "лемонграсс и ваниль"],
    [/vanil|vanilla/, "ваниль"],
    [/banana.*melon|banana & melon/, "Banana & Melon"],
    [/tiramisu/, "Tiramisu"],
    [/mandarin/, "Mandarin"],
    [/dragon fruit|macadamia/, "Dragon Fruit & Macadamia"],
    [/mango|karambola/, "Mango & Karambola"],
    [/qulupnay|strawberry/, "клубника"],
    [/guava/, "Guava"],
    [/lychee|litchi|rambutan/, "Lychee & Rambutan"],
    [/apelsin|orange/, "апельсин"],
    [/guarana/, "Guarana"],
    [/qarag'ay|qaragay|pine/, "хвоя"],
    [/romashka|chamomile/, "ромашка"],
    [/kekik|thyme/, "тимьян"],
    [/vanil/, "Vanil"],
    [/professional/, "Professional"],
    [/eco-cleaning|eko-cleaning/, "Eco-Cleaning"],
    [/oqartiruvchi|kislorodli/, "отбеливающее"],
    [/dog|dog'|dog‘/, "пятновыводитель"],
  ];

  const found = lines.filter(([pattern]) => pattern.test(text)).map(([, label]) => label);
  return [...new Set(found)].slice(0, 3).join(", ");
}

function inferProductBrand(product) {
  const text = `${product.title} ${product.id}`.toLowerCase();
  const rules = [
    [/dr\.?\s*sante|drsante/, { name: "Dr.Sante", slug: "dr-sante" }],
    [/fresh juice|yangi sharbat|fresh-juice/, { name: "Fresh Juice", slug: "fresh-juice" }],
    [/lady caramel|lady-caramel/, { name: "Lady Caramel", slug: "lady-caramel" }],
    [/mister\s*dez|mister-dez/, { name: "Mister Dez", slug: "mister-dez" }],
    [/зеленая аптека|zelenaya apteka|zelenaia apteka|yashil choy/, { name: "Green Pharmacy / Зеленая Аптека", slug: "green-pharmacy" }],
    [/домашний доктор|domashniy doktor|uy shifokori|uy tabibi|domashnij|uy doktori/, { name: "The Doctor / Домашний Доктор", slug: "the-doctor" }],
  ];

  return rules.find(([pattern]) => pattern.test(text))?.[1] || { name: "Elfa Pharm", slug: "elfa-pharm" };
}

function inferProductCategory(product) {
  const text = `${product.title} ${product.id}`.toLowerCase();
  const rules = [
    [/mister\s*dez|santexnika|tozalovchi|oqartiruvchi|kirlar|yuvish vositasi|dog'/, "household"],
    [/depil|epil|epily|epilatsiya|epilyatsiya|lady caramel.*mum|mum lady caramel|issiq mum|wax/, "depilation"],
    [/intim/, "intimate-hygiene"],
    [/lab pomadasi|lablar/, "lip-care"],
    [/og'iz|ogiz|eliksir|chayish/, "oral-care"],
    [/shampun|shampoo/, "shampoo"],
    [/balzam|niqob|maska|soch|moy|flyuid|sprey|keratin|anti hair loss|argan|coconut hair/, "hair-care"],
    [/dush|shower|krem-gel|kremli gel/, "shower-gels"],
    [/hammom|vanna|ko'pik|tuz|sovun|suyuq sovun|krem-sovun/, "bath"],
    [/qo'l|qol|tirnoq|hand/, "hand-care"],
    [/yuz|tonik|micellar|cucumber|yuvinish|ko'pik/, "face-care"],
    [/tana|body|krem-yog|body butter/, "body-care"],
    [/krem|cream/, "creams"],
  ];

  const value = rules.find(([pattern]) => pattern.test(text))?.[1] || "body-care";
  const option = catalogCategories.find((item) => item.value === value) || catalogCategories[0];

  return {
    value: option.value,
    label: option.label,
    description: getCategoryDescription(option.value),
  };
}

function getCategoryDescription(category, language = "ru") {
  return categoryDescriptions[language]?.[category] || categoryDescriptions.ru[category] || "товар ежедневного ухода";
}

export function inferProductPurpose(category, language = "ru") {
  return productPurposes[language]?.[category] || productPurposes.ru[category] || "Ежедневный уход.";
}

function inferProductVolume(title) {
  const match = title.match(/(\d+(?:[.,]\d+)?)\s*(ml|мл|litr|литр|л|g|г|гр|dona|дона|ta|шт|salfetka)/i);
  if (!match) return "уточнить в Uzum";
  return `${match[1].replace(".", ",")} ${match[2]}`;
}
