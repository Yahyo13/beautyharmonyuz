import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Beaker,
  Building2,
  CheckCircle2,
  Factory,
  FlaskConical,
  Globe2,
  Handshake,
  HeartHandshake,
  Leaf,
  Lock,
  LogOut,
  Menu,
  PackageCheck,
  Palette,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Store,
  Tags,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import {
  createPartnerRequest,
  deletePartnerRequest,
  fetchPartnerRequests,
  formatUzbekPhoneNumber,
  getAdminSession,
  isValidUzbekPhoneNumber,
  loginAdmin,
  logoutAdmin,
  partnerRequestTypes,
} from "./data/partnerRequestsApi";
import { uzumCatalogProductsRaw } from "./data/uzumCatalogProducts.generated";

const uzumShopUrl = "https://uzum.uz/uz/shop/beautyh";
const heroImageUrl = `${import.meta.env.BASE_URL}beauty-harmony-hero.png`;
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
const languageOptions = [
  { value: "ru", label: "RU" },
  { value: "uz", label: "UZ" },
];

const LocaleContext = React.createContext({
  language: "ru",
  setLanguage: () => {},
  t: {},
});

function useLocale() {
  return React.useContext(LocaleContext);
}

const ui = {
  ru: {
    nav: { home: "Главная", catalog: "Каталог", brands: "Бренды", b2b: "B2B" },
    menu: { open: "Открыть меню", close: "Закрыть меню" },
    language: "Язык сайта",
    uzumMarket: "Uzum Market",
    common: {
      allBrands: "Все бренды",
      productsInUzum: "Товары в Uzum",
      b2bRequest: "Заявка B2B",
      openShop: "Открыть магазин",
      viewBrands: "Смотреть бренды",
      openCatalog: "Открыть каталог",
      buy: "Купить",
      brand: "Бренд",
      purpose: "Назначение",
      normalPrice: "Обычная цена",
      aboutBrand: "О бренде",
      source: "Источник",
      openSource: "Открыть источник",
      marketplace: "Маркетплейс",
      goToUzum: "Перейти в Uzum Market",
      toHome: "На главную",
    },
    home: {
      eyebrow: "Импорт косметики, ухода и household-брендов",
      title: "Beauty Harmony",
      intro:
        "Шесть брендов для понятной витрины: Dr.Sante, Fresh Juice, The Doctor, Green Pharmacy, Lady Caramel и Mister Dez. Каждый бренд раскрыт отдельно: производитель, год, категории, сильные стороны и ссылки на источники.",
      catalogCta: "Каталог товаров",
      brandsCta: "Смотреть бренды",
      b2bCta: "B2B партнерство",
      statBrands: "брендов в каталоге",
      statCountries: "страны у Elfa Group",
      statUzum: "готовая страница магазина",
      assortmentLabel: "Понятный ассортимент",
      assortmentTitle: "От фруктового body-care до бытовой химии",
      assortmentText:
        "Сайт работает как мини-каталог: на главной виден общий портфель, а внутри каждой карточки есть отдельная страница с фактами, стилем бренда и подробным описанием. Green Pharmacy выглядит натурально, Fresh Juice - ярко и фруктово, Lady Caramel - карамельно и гладко, Mister Dez - чисто и технологично.",
      clarityLabel: "Как читать каталог",
      clarityTitle: "Каждый бренд закрывает свою задачу",
      naturalTitle: "Натуральный уход",
      naturalText: "Green Pharmacy и The Doctor подходят для покупателей, которым важны растительные компоненты и доверие.",
      emotionTitle: "Эмоция и цвет",
      emotionText: "Fresh Juice и Dr.Sante дают яркую косметическую полку: ароматы, текстуры, тренды и быстрый выбор.",
      practicalTitle: "Практичная категория",
      practicalText: "Lady Caramel добавляет депиляцию, а Mister Dez расширяет предложение товарами для чистого дома.",
      producersLabel: "Производители",
      producersTitle: "Elfa Group и ЕвроТек: кто стоит за брендами",
      producersText:
        "Elfa Group - международная косметическая компания с 6 фабриками в Украине, Польше и Словакии. На официальном сайте указаны 26 лет на рынке, 63 страны, 23 бренда и 3000 инновационных формул. Mister Dez относится к ООО «ЕвроТек», российскому производителю бытовой химии и косметики с историей с 2012 года.",
    },
    catalogPreview: {
      label: "Товары из Uzum",
      title: "Каталог с поиском, категориями и сортировкой по цене",
      text:
        "В отдельной странице собраны карточки Beauty Harmony: цена, фото, бренд, назначение и кнопка покупки, которая ведет прямо в Uzum Market.",
    },
    brandsPage: {
      label: "Бренды",
      title: "Кликните на бренд и откройте его страницу",
      text: "На карточках показаны ключевые цифры, производитель и главная категория.",
      more: "Подробнее о бренде",
    },
    catalog: {
      eyebrow: "Каталог Beauty Harmony в Uzum Market",
      title: "Каталог товаров",
      intro:
        "Товары с реальными ссылками, фото и ценами из магазина Beauty Harmony: шампуни, кремы, уход за лицом, депиляция, гели для душа, интимная гигиена и бытовая химия.",
      products: "товара в витрине",
      minPrice: "самая низкая цена",
      categories: "категорий для фильтра",
      searchPlaceholder: "Поиск по названию, бренду или назначению",
      searchLabel: "Поиск товаров",
      category: "Категория",
      sort: "Сортировка",
      defaultSort: "Как в Uzum",
      priceAsc: "Цена: от меньшей к большей",
      priceDesc: "Цена: от большей к меньшей",
      byName: "По названию",
      reset: "Сброс",
      found: "Найденные товары",
      emptyTitle: "Ничего не найдено",
      emptyText: "Попробуйте изменить запрос или выбрать другую категорию.",
      clearFilters: "Очистить фильтры",
      sourceNote:
        "Цены, изображения и ссылки взяты со страниц магазина Beauty Harmony в Uzum Market 24 мая 2026. Основной прайс - обычная цена, цена Uzum-karta показана отдельно.",
    },
    brandPage: {
      essence: "Суть бренда",
      passport: "Паспорт бренда",
      manufacturer: "Производитель",
      country: "Страна бренда",
      start: "Год / старт",
      data: "Данные",
      categories: "Категории",
      sellTitle: "Что можно продавать под этим брендом",
      facts: "Важные факты",
      timeline: "Годы и развитие",
      sourceTitle: "Факты взяты из официальной страницы",
      moreLabel: "Еще бренды",
      moreTitle: "Посмотреть другие страницы",
    },
    b2b: {
      eyebrow: "Отдельная страница партнерства",
      title: "B2B сотрудничество",
      intro:
        "Оставьте заявку на поставки, опт, запуск брендов в магазине, аптеке, маркетплейсе или региональной сети. Форма отделена от главной, чтобы сайт сначала знакомил с брендами, а потом вел к заявке.",
      retail: "Для розницы",
      retailText: "Подбор брендов под формат магазина: уход, депиляция, натуральная косметика, household.",
      wholesale: "Для опта",
      wholesaleText: "Можно указать интересующие бренды, город, объем и формат продаж.",
      marketplace: "Для маркетплейсов",
      marketplaceText: "Категории легко разнести по карточкам: шампуни, кремы, депиляция, бытовая химия.",
      company: "Компания",
      companyPlaceholder: "OOO / магазин",
      name: "Имя",
      namePlaceholder: "Как к вам обращаться",
      phone: "Телефон",
      phonePlaceholder: "+998 ...",
      city: "Город",
      cityPlaceholder: "Ташкент, Самарканд...",
      formatLabel: "Формат сотрудничества",
      brands: "Интересующие бренды",
      brandsPlaceholder: "Например: Fresh Juice, Lady Caramel",
      comment: "Комментарий",
      commentPlaceholder: "Формат продажи, примерный объем, какие категории интересуют",
      submit: "Отправить заявку",
      status: "Заявка отправлена. Мы сохранили ее в общей базе партнерских заявок.",
      successTitle: "Заявка успешно отправлена",
      successText: "Ожидайте, скоро с вами свяжутся.",
      successClose: "Понятно",
      emptyValue: "Не указано",
      formats: ["Оптовая Закупка", "Маркетплейс", "Розничная Сеть", "Дистрибуция"],
    },
    market: {
      title: "Товары Beauty Harmony в Uzum Market",
      text: "Кнопка ведет на страницу магазина Beauty Harmony, где покупатель может посмотреть карточки товаров.",
    },
    footer: {
      text: "Каталог брендов, страницы производителей и отдельная форма B2B-заявки.",
    },
    notFound: {
      title: "Страница не найдена",
      text: "Вернитесь на главную, откройте каталог товаров или страницу брендов.",
    },
  },
  uz: {
    nav: { home: "Asosiy", catalog: "Katalog", brands: "Brendlar", b2b: "B2B" },
    menu: { open: "Menyuni ochish", close: "Menyuni yopish" },
    language: "Sayt tili",
    uzumMarket: "Uzum Market",
    common: {
      allBrands: "Barcha brendlar",
      productsInUzum: "Uzumdagi tovarlar",
      b2bRequest: "B2B ariza",
      openShop: "Do'konni ochish",
      viewBrands: "Brendlarni ko'rish",
      openCatalog: "Katalogni ochish",
      buy: "Sotib olish",
      brand: "Brend",
      purpose: "Mo'ljallanishi",
      normalPrice: "Oddiy narx",
      aboutBrand: "Brend haqida",
      source: "Manba",
      openSource: "Manbani ochish",
      marketplace: "Marketpleys",
      goToUzum: "Uzum Marketga o'tish",
      toHome: "Asosiy sahifaga",
    },
    home: {
      eyebrow: "Kosmetika, parvarish va household brendlar importi",
      title: "Beauty Harmony",
      intro:
        "Tushunarli vitrina uchun oltita brend: Dr.Sante, Fresh Juice, The Doctor, Green Pharmacy, Lady Caramel va Mister Dez. Har bir brend alohida ochilgan: ishlab chiqaruvchi, yil, kategoriyalar, afzalliklar va manbalarga havolalar.",
      catalogCta: "Tovarlar katalogi",
      brandsCta: "Brendlarni ko'rish",
      b2bCta: "B2B hamkorlik",
      statBrands: "katalogdagi brendlar",
      statCountries: "Elfa Group mamlakatlari",
      statUzum: "tayyor do'kon sahifasi",
      assortmentLabel: "Tushunarli assortiment",
      assortmentTitle: "Mevali body-care'dan maishiy kimyogacha",
      assortmentText:
        "Sayt mini-katalog kabi ishlaydi: asosiy sahifada umumiy portfel ko'rinadi, har bir kartochkada esa faktlar, brend uslubi va batafsil tavsif berilgan alohida sahifa bor. Green Pharmacy tabiiy, Fresh Juice yorqin va mevali, Lady Caramel yumshoq depilyatsiya, Mister Dez esa tozalik va texnologiya kayfiyatida.",
      clarityLabel: "Katalogni qanday o'qish kerak",
      clarityTitle: "Har bir brend o'z vazifasini yopadi",
      naturalTitle: "Tabiiy parvarish",
      naturalText: "Green Pharmacy va The Doctor o'simlik komponentlari va ishonchni qadrlaydigan xaridorlar uchun mos.",
      emotionTitle: "Hissiyot va rang",
      emotionText: "Fresh Juice va Dr.Sante kosmetika polkasiga aromatlar, teksturalar, trendlar va tez tanlov olib kiradi.",
      practicalTitle: "Amaliy kategoriya",
      practicalText: "Lady Caramel depilyatsiyani qo'shadi, Mister Dez esa taklifni uy tozaligi tovarlari bilan kengaytiradi.",
      producersLabel: "Ishlab chiqaruvchilar",
      producersTitle: "Elfa Group va EuroTek: brendlar ortida kim turibdi",
      producersText:
        "Elfa Group - Ukraina, Polsha va Slovakiyada 6 ta fabrikaga ega xalqaro kosmetika kompaniyasi. Rasmiy saytda bozorda 26 yil, 63 mamlakat, 23 brend va 3000 innovatsion formula ko'rsatilgan. Mister Dez esa 2012 yildan beri faoliyat yuritayotgan Rossiyaning maishiy kimyo va kosmetika ishlab chiqaruvchisi EuroTek kompaniyasiga tegishli.",
    },
    catalogPreview: {
      label: "Uzumdagi tovarlar",
      title: "Qidiruv, kategoriya va narx bo'yicha saralashga ega katalog",
      text:
        "Alohida sahifada Beauty Harmony tovar kartochkalari jamlangan: narx, rasm, brend, mo'ljallanishi va bevosita Uzum Marketga olib boradigan sotib olish tugmasi.",
    },
    brandsPage: {
      label: "Brendlar",
      title: "Brendni bosing va uning sahifasini oching",
      text: "Kartochkalarda asosiy raqamlar, ishlab chiqaruvchi va bosh kategoriya ko'rsatilgan.",
      more: "Brend haqida batafsil",
    },
    catalog: {
      eyebrow: "Uzum Marketdagi Beauty Harmony katalogi",
      title: "Tovarlar katalogi",
      intro:
        "Beauty Harmony do'konidan haqiqiy havola, rasm va narxlarga ega tovarlar: shampunlar, kremlar, yuz parvarishi, depilyatsiya, dush gellari, intim gigiyena va maishiy kimyo.",
      products: "vitrinadagi tovarlar",
      minPrice: "eng past narx",
      categories: "filtr kategoriyalari",
      searchPlaceholder: "Nom, brend yoki vazifa bo'yicha qidirish",
      searchLabel: "Tovarlarni qidirish",
      category: "Kategoriya",
      sort: "Saralash",
      defaultSort: "Uzumdagi tartib",
      priceAsc: "Narx: arzonidan qimmatiga",
      priceDesc: "Narx: qimmatidan arzoniga",
      byName: "Nom bo'yicha",
      reset: "Tozalash",
      found: "Topilgan tovarlar",
      emptyTitle: "Hech narsa topilmadi",
      emptyText: "So'rovni o'zgartiring yoki boshqa kategoriya tanlang.",
      clearFilters: "Filtrlarni tozalash",
      sourceNote:
        "Narxlar, rasmlar va havolalar Beauty Harmony'ning Uzum Market sahifalaridan 2026-yil 24-mayda olingan. Asosiy narx oddiy narx, Uzum-karta narxi alohida ko'rsatilgan.",
    },
    brandPage: {
      essence: "Brend mohiyati",
      passport: "Brend pasporti",
      manufacturer: "Ishlab chiqaruvchi",
      country: "Brend mamlakati",
      start: "Yil / start",
      data: "Ma'lumotlar",
      categories: "Kategoriyalar",
      sellTitle: "Bu brend ostida nimalarni sotish mumkin",
      facts: "Muhim faktlar",
      timeline: "Yillar va rivojlanish",
      sourceTitle: "Faktlar rasmiy sahifadan olingan",
      moreLabel: "Yana brendlar",
      moreTitle: "Boshqa sahifalarni ko'rish",
    },
    b2b: {
      eyebrow: "Hamkorlik uchun alohida sahifa",
      title: "B2B hamkorlik",
      intro:
        "Yetkazib berish, ulgurji savdo, brendlarni do'kon, dorixona, marketpleys yoki hududiy tarmoqqa chiqarish uchun ariza qoldiring. Forma asosiy sahifadan ajratilgan: sayt avval brendlar bilan tanishtiradi, keyin arizaga olib boradi.",
      retail: "Chakana savdo uchun",
      retailText: "Do'kon formatiga mos brend tanlovi: parvarish, depilyatsiya, tabiiy kosmetika, household.",
      wholesale: "Ulgurji savdo uchun",
      wholesaleText: "Qiziqtirgan brendlar, shahar, hajm va savdo formatini ko'rsatish mumkin.",
      marketplace: "Marketpleyslar uchun",
      marketplaceText: "Kategoriyalarni kartochkalarga ajratish oson: shampunlar, kremlar, depilyatsiya, maishiy kimyo.",
      company: "Kompaniya",
      companyPlaceholder: "MChJ / do'kon",
      name: "Ism",
      namePlaceholder: "Sizga qanday murojaat qilamiz",
      phone: "Telefon",
      phonePlaceholder: "+998 ...",
      city: "Shahar",
      cityPlaceholder: "Toshkent, Samarqand...",
      formatLabel: "Hamkorlik formati",
      brands: "Qiziqtirgan brendlar",
      brandsPlaceholder: "Masalan: Fresh Juice, Lady Caramel",
      comment: "Izoh",
      commentPlaceholder: "Savdo formati, taxminiy hajm, qaysi kategoriyalar qiziq",
      submit: "Ariza yuborish",
      status: "Ariza yuborildi. U hamkorlik arizalarining umumiy bazasida saqlandi.",
      successTitle: "Ariza muvaffaqiyatli yuborildi",
      successText: "Kutib turing, tez orada siz bilan bog'lanamiz.",
      successClose: "Tushunarli",
      emptyValue: "Ko'rsatilmagan",
      formats: ["Ulgurji xarid", "Marketpleys", "Chakana tarmoq", "Distribyutsiya"],
    },
    market: {
      title: "Beauty Harmony tovarlari Uzum Marketda",
      text: "Tugma Beauty Harmony do'koni sahifasiga olib boradi, u yerda xaridor tovar kartochkalarini ko'rishi mumkin.",
    },
    footer: {
      text: "Brendlar katalogi, ishlab chiqaruvchi sahifalari va alohida B2B ariza formasi.",
    },
    notFound: {
      title: "Sahifa topilmadi",
      text: "Asosiy sahifaga qayting, tovarlar katalogini yoki brendlar sahifasini oching.",
    },
  },
};

const brands = [
  {
    slug: "dr-sante",
    name: "Dr.Sante",
    localName: "Dr. Sante",
    country: "Украина",
    manufacturer: "Elfa Group",
    established: "ориентир: около 2009",
    market: "17 лет на рынке",
    sourceNote: "официальная страница указывает 17 лет, 31 страну и 257 популярных формул",
    categories: ["уход за волосами", "уход за лицом", "кремы", "маски", "сыворотки"],
    accent: "#ff5d75",
    accent2: "#5bc8ff",
    accent3: "#ffe76a",
    theme: "theme-sante",
    mood: "современный уход, тренды, салонный эффект дома",
    visualWords: ["Hyaluron", "Cannabis Hair", "Anti-frizz"],
    intro:
      "Dr.Sante - марка современного ухода, которая делает ставку на трендовые текстуры, понятные серии и решения для волос, лица и ежедневной красоты.",
    detail:
      "Бренд исследует мировые тренды, формы и текстуры. В ассортименте есть программы для увлажнения, восстановления волос, anti-frizz ухода и facial-care. На странице бренда Elfa отмечены сбалансированные формулы, внимание к безопасности и выпуск vegan hair-серии Cannabis Hair в 2020 году, а также Hyaluron Mezzo Pro в 2021 году.",
    buyerText:
      "Хорошо работает на полке, где покупатель ищет заметный результат: восстановление волос, увлажнение, гладкость, уходовые маски и понятные серии под конкретную проблему.",
    stats: [
      ["17", "лет на рынке"],
      ["31", "страна"],
      ["257", "формул"],
    ],
    facts: [
      "Многие продукты бренда позиционируются как бережные к естественному балансу кожи.",
      "В линейках встречаются средства для волос, лица и комплексного ухода.",
      "Бренд не строится вокруг одного продукта: это широкий уходовый портфель.",
    ],
    timeline: [
      ["около 2009", "старт бренда по расчету от 17 лет на рынке"],
      ["2020", "появление vegan hair-серии Cannabis Hair"],
      ["2021", "запуск Hyaluron Mezzo Pro для ухода за лицом"],
    ],
    source: "https://elfagroup.com/brands/dr-sante/",
  },
  {
    slug: "fresh-juice",
    name: "Fresh Juice",
    localName: "Fresh Juice",
    country: "Украина",
    manufacturer: "Elfa Group",
    established: "ориентир: около 2013",
    market: "13 лет на рынке",
    sourceNote: "официальная страница указывает 13 лет, 30 стран и 100 рецептур",
    categories: ["кремы", "скрабы", "гели для душа", "body-care", "фруктовые ароматы"],
    accent: "#ff7a1a",
    accent2: "#ffdd3d",
    accent3: "#ff4b8f",
    theme: "theme-juice",
    mood: "сочные фрукты, яркие цвета, ароматный body-care",
    visualWords: ["Mango", "Papaya", "Tiramisu"],
    intro:
      "Fresh Juice - яркий body-care на основе масел, фруктовых экстрактов и десертных ароматов. Это бренд про эмоцию, цвет и удовольствие от ежедневного ухода.",
    detail:
      "Официальное описание называет Fresh Juice фруктовым угощением для кожи: экзотические фрукты, сочные цвета, кремовые текстуры, растительные экстракты и масла. Помимо фруктовых ароматов, в линейке есть десертные направления: шоколад, марципан, тирамису.",
    buyerText:
      "Подходит для витрины, где важна импульсная покупка: аромат, яркая упаковка, подарок, уход для тела и быстрый выбор без сложной консультации.",
    stats: [
      ["13", "лет на рынке"],
      ["30", "стран"],
      ["100", "рецептур"],
    ],
    facts: [
      "Ассортимент легко объяснять через аромат: манго, папайя, шоколад, марципан, тирамису.",
      "Бренд воспринимается как яркая летняя полка круглый год.",
      "Ключевые категории - уход за телом, кремовые текстуры, скрабы и гели.",
    ],
    timeline: [
      ["около 2013", "старт бренда по расчету от 13 лет на рынке"],
      ["сейчас", "30 стран присутствия и 100 рецептур по данным бренда"],
    ],
    source: "https://pl.elfagroup.com/brands/fresh-juice/",
  },
  {
    slug: "the-doctor",
    name: "The Doctor",
    localName: "The Doctor / Домашний Доктор",
    country: "Украина",
    manufacturer: "Elfa Group",
    established: "ориентир: около 2013",
    market: "13 лет на рынке",
    sourceNote: "официальная страница указывает 13 лет, 25 стран и 206 формул",
    categories: ["семейный уход", "кремы", "очищение", "профилактический уход", "растительные компоненты"],
    accent: "#2087ff",
    accent2: "#60e6c5",
    accent3: "#e9f6ff",
    theme: "theme-doctor",
    mood: "аптечная чистота, семейный уход, доверие",
    visualWords: ["Family", "GMP", "Care"],
    intro:
      "The Doctor - медицинско-профилактический уход для всей семьи: понятные формулы, натуральные ингредиенты и доступная ежедневная косметика.",
    detail:
      "Бренд описывается как косметика для ежедневной заботы о здоровье семьи. В официальном тексте выделены натуральные ингредиенты, уход и очищение, GMP-производство, строгий контроль качества, европейское сырье и разумная цена.",
    buyerText:
      "Хорошо подходит для аптек, семейных магазинов и полок, где покупатель хочет не декоративный эффект, а понятный, практичный и доступный уход.",
    stats: [
      ["13", "лет на рынке"],
      ["25", "стран"],
      ["206", "формул"],
    ],
    facts: [
      "Фокус - уход для разных поколений и ежедневная профилактика.",
      "Официальная страница указывает производство на фабрике, соответствующей GMP.",
      "Позиционирование строится вокруг эффективности, цены и семейного доверия.",
    ],
    timeline: [
      ["около 2013", "старт бренда по расчету от 13 лет на рынке"],
      ["2022", "в истории Elfa отмечена премьера Doctor Health & Care"],
    ],
    source: "https://pl.elfagroup.com/brands/the-doctor/",
  },
  {
    slug: "green-pharmacy",
    name: "Green Pharmacy",
    localName: "Green Pharmacy / Зеленая Аптека",
    country: "Украина",
    manufacturer: "Elfa Group",
    established: "2003",
    market: "более 15 лет на рынке",
    sourceNote: "история Elfa указывает запуск Green Pharmacy в 2003 году",
    categories: ["травы", "растительные экстракты", "органические масла", "уход за телом", "уход за волосами"],
    accent: "#35b86b",
    accent2: "#c6ef5e",
    accent3: "#f0ffe8",
    theme: "theme-green",
    mood: "растительные компоненты, травы, спокойный натуральный уход",
    visualWords: ["Herbs", "Oils", "Extracts"],
    intro:
      "Green Pharmacy - травяной и аптечно-натуральный уход: растительные экстракты, органические масла и фармацевтический подход в одной понятной концепции.",
    detail:
      "Elfa описывает бренд как сочетание пользы растений и современных фармацевтических ингредиентов. В формулах указано более 300 компонентов: органические масла и растительные экстракты. Продукты экспортируются в 49 стран, а производство находится в Польше, Словакии и Украине.",
    buyerText:
      "Это бренд для покупателя, который выбирает натуральный образ продукта: травы, масла, мягкие ароматы, семейный уход и доверие к аптечной эстетике.",
    stats: [
      ["2003", "запуск бренда"],
      ["49", "стран экспорта"],
      ["300+", "ингредиентов"],
    ],
    facts: [
      "В истории Elfa Group запуск Green Pharmacy указан в 2003 году.",
      "Формулы соединяют растительные и фармацевтические компоненты.",
      "Производство ведется в Польше, Словакии и Украине.",
    ],
    timeline: [
      ["2003", "запуск Green Pharmacy"],
      ["2008", "Elfa начала экспорт собственных продуктов"],
      ["2024", "в истории Elfa отмечено обновление Green Pharmacy"],
    ],
    source: "https://elfagroup.com/brands/green-pharmacy/",
  },
  {
    slug: "lady-caramel",
    name: "Lady Caramel",
    localName: "Lady Caramel",
    country: "Украина",
    manufacturer: "Elfa Group",
    established: "ориентир: около 2015",
    market: "11 лет на рынке",
    sourceNote: "официальная страница указывает 11 лет, 16 стран и 2 000 000 единиц за сезон",
    categories: ["депиляция", "восковые полоски", "кремы", "уход до и после", "аргановое масло"],
    accent: "#d97942",
    accent2: "#ffb7c8",
    accent3: "#fff0dc",
    theme: "theme-caramel",
    mood: "карамельные оттенки, гладкая кожа, домашняя депиляция",
    visualWords: ["Wax", "Argan Oil", "Smooth"],
    intro:
      "Lady Caramel - бренд средств для домашнего удаления волос: воски, кремы, полоски, уход до и после депиляции.",
    detail:
      "Официальная страница называет Lady Caramel продуктами для удаления нежелательных волос N1 на Украине. В ассортименте - воски и кремы для разных типов кожи, восковые полоски, теплые воски, кремовая депиляция, воск-карандаш и специальные полоски для моделирования бровей. Указаны испанские воски, формула NO RUBBING WAX и кремы с 100% марокканским аргановым маслом.",
    buyerText:
      "Отдельно усиливает полку ухода: это не шампунь и не крем для рук, а четкая категория депиляции с понятным покупательским запросом.",
    stats: [
      ["11", "лет на рынке"],
      ["16", "стран"],
      ["2 млн", "шт. за сезон"],
    ],
    facts: [
      "Восковые полоски готовы к использованию без ручного разогрева.",
      "Средства рассчитаны на разные зоны тела и типы кожи.",
      "Линейка включает уход перед процедурой и после нее.",
    ],
    timeline: [
      ["около 2015", "старт бренда по расчету от 11 лет на рынке"],
      ["сейчас", "16 стран и 2 млн единиц за сезон по данным бренда"],
    ],
    source: "https://pl.elfagroup.com/brands/lady-caramel/",
  },
  {
    slug: "mister-dez",
    name: "Mister Dez",
    localName: "Mister DEZ",
    country: "Россия",
    manufacturer: "ООО «ЕвроТек»",
    established: "2014 для Mister DEZ Eco-Cleaning",
    market: "компания основана 3 декабря 2012",
    sourceNote: "ЕвроТек указывает основание 03.12.2012, запуск Mister DEZ Eco-Cleaning в 2014",
    categories: ["бытовая химия", "средства для ПММ", "уборка", "professional", "auto professional"],
    accent: "#7438ff",
    accent2: "#23c8ff",
    accent3: "#f3f0ff",
    theme: "theme-dez",
    mood: "чистота, household, сильная бытовая химия",
    visualWords: ["Clean", "Eco", "Pro"],
    intro:
      "Mister Dez - household-направление от российского производителя «ЕвроТек»: уборка, посуда, посудомоечные машины, professional-линейки и автохимия.",
    detail:
      "ООО «ЕвроТек» основано 3 декабря 2012 года. В истории компании указаны запуск Mister DEZ Eco-Cleaning в 2014 году, запуск средств Mister DEZ для посудомоечных машин в 2016 году, развитие Dream Nature в 2017 году и новые линии Mister DEZ ECO, PROFESSIONAL и AUTO PROFESSIONAL в 2025 году.",
    buyerText:
      "Нужен для расширения предложения за пределы косметики: покупатель видит рядом уход за собой и товары для чистого дома.",
    stats: [
      ["2012", "основана компания"],
      ["65 000", "тонн в год"],
      ["270+", "сотрудников"],
    ],
    facts: [
      "У ЕвроТек два производственных кластера: Ленинградская область и Солнечногорск.",
      "Производственная мощность указана как 65 000 тонн в год.",
      "Компания развивает бытовую химию, косметику и товары под СТМ.",
    ],
    timeline: [
      ["2012", "основание ООО «ЕвроТек»"],
      ["2014", "запуск Mister DEZ Eco-Cleaning"],
      ["2016", "средства Mister DEZ для посудомоечных машин"],
      ["2025", "Mister DEZ AUTO PROFESSIONAL, ECO и PROFESSIONAL"],
    ],
    source: "https://evropro.com/o-kompanii/",
  },
];

const brandTranslations = {
  uz: {
    "dr-sante": {
      country: "Ukraina",
      established: "taxminan 2009",
      market: "17 yil bozorda",
      sourceNote: "rasmiy sahifada 17 yil, 31 mamlakat va 257 ta mashhur formula ko'rsatilgan",
      categories: ["soch parvarishi", "yuz parvarishi", "kremlar", "niqoblar", "serumlar"],
      mood: "zamonaviy parvarish, trendlar, uyda salon effekti",
      intro: "Dr.Sante - zamonaviy parvarish brendi: trend teksturalar, tushunarli seriyalar va soch, yuz hamda kundalik go'zallik uchun yechimlar.",
      detail: "Brend global trendlar, formatlar va teksturalarni kuzatadi. Assortimentda namlantirish, sochni tiklash, anti-frizz parvarish va facial-care yo'nalishlari bor.",
      buyerText: "Xaridor aniq natija izlaydigan polkada yaxshi ishlaydi: sochni tiklash, namlantirish, silliqlik va muayyan muammo uchun tushunarli seriyalar.",
      stats: [["17", "yil bozorda"], ["31", "mamlakat"], ["257", "formula"]],
      facts: ["Mahsulotlar terining tabiiy balansiga ehtiyotkor yondashuv sifatida pozitsiyalanadi.", "Liniyalarda soch, yuz va kompleks parvarish vositalari bor.", "Bu bitta mahsulot emas, keng parvarish portfeli."],
      timeline: [["taxminan 2009", "brend starti"], ["2020", "Cannabis Hair vegan hair-seriyasi"], ["2021", "Hyaluron Mezzo Pro ishga tushdi"]],
    },
    "fresh-juice": {
      country: "Ukraina",
      established: "taxminan 2013",
      market: "13 yil bozorda",
      sourceNote: "rasmiy sahifada 13 yil, 30 mamlakat va 100 retseptura ko'rsatilgan",
      categories: ["kremlar", "skrablar", "dush gellari", "body-care", "mevali aromatlar"],
      mood: "sersuv mevalar, yorqin ranglar, xushbo'y body-care",
      intro: "Fresh Juice - moylar, meva ekstraktlari va desert aromatlariga asoslangan yorqin body-care brendi.",
      detail: "Rasmiy tavsif Fresh Juice'ni teri uchun mevali sovg'a deb ta'riflaydi: ekzotik mevalar, sersuv ranglar, krem teksturalar, o'simlik ekstraktlari va moylar.",
      buyerText: "Impuls xarid muhim bo'lgan vitrina uchun mos: aromat, yorqin qadoq, sovg'a, tana parvarishi va tez tanlov.",
      stats: [["13", "yil bozorda"], ["30", "mamlakat"], ["100", "retseptura"]],
      facts: ["Assortimentni aromatlar orqali tushuntirish oson.", "Brend yil bo'yi yorqin yozgi polka kabi qabul qilinadi.", "Asosiy kategoriyalar - tana parvarishi, skrablar va gellar."],
      timeline: [["taxminan 2013", "brend starti"], ["hozir", "30 mamlakat va 100 retseptura"]],
    },
    "the-doctor": {
      localName: "The Doctor / Uy Shifokori",
      country: "Ukraina",
      established: "taxminan 2013",
      market: "13 yil bozorda",
      sourceNote: "rasmiy sahifada 13 yil, 25 mamlakat va 206 formula ko'rsatilgan",
      categories: ["oilaviy parvarish", "kremlar", "tozalash", "profilaktik parvarish", "o'simlik komponentlari"],
      mood: "dorixona tozaligi, oilaviy parvarish, ishonch",
      intro: "The Doctor - butun oila uchun tibbiy-profilaktik parvarish: tushunarli formulalar, tabiiy ingredientlar va hamyonbop kosmetika.",
      detail: "Brend oila salomatligiga kundalik g'amxo'rlik kosmetikasi sifatida ta'riflanadi: tabiiy ingredientlar, GMP-ishlab chiqarish va qat'iy sifat nazorati.",
      buyerText: "Dorixonalar va oilaviy do'konlar uchun yaxshi: xaridor tushunarli, amaliy va hamyonbop parvarish izlaydi.",
      stats: [["13", "yil bozorda"], ["25", "mamlakat"], ["206", "formula"]],
      facts: ["Fokus - turli avlodlar uchun parvarish va kundalik profilaktika.", "Rasmiy sahifada GMP talablariga mos ishlab chiqarish ko'rsatilgan.", "Pozitsiyalash samaradorlik, narx va oilaviy ishonchga qurilgan."],
      timeline: [["taxminan 2013", "brend starti"], ["2022", "Doctor Health & Care premyerasi"]],
    },
    "green-pharmacy": {
      localName: "Green Pharmacy / Yashil Apteka",
      country: "Ukraina",
      market: "15 yildan ortiq bozorda",
      sourceNote: "Elfa tarixida Green Pharmacy 2003-yilda ishga tushgani ko'rsatilgan",
      categories: ["giyohlar", "o'simlik ekstraktlari", "organik moylar", "tana parvarishi", "soch parvarishi"],
      mood: "o'simlik komponentlari, giyohlar, sokin tabiiy parvarish",
      intro: "Green Pharmacy - giyohli va dorixona-tabiiy parvarish: o'simlik ekstraktlari, organik moylar va farmatsevtik yondashuv.",
      detail: "Elfa brendni o'simliklar foydasi va zamonaviy farmatsevtik ingredientlar uyg'unligi sifatida ta'riflaydi. Formulalarda 300 dan ortiq komponent ko'rsatilgan.",
      buyerText: "Tabiiy mahsulot obrazini tanlaydigan xaridor uchun: giyohlar, moylar, yumshoq aromatlar va dorixona estetikasiga ishonch.",
      stats: [["2003", "brend starti"], ["49", "eksport mamlakati"], ["300+", "ingredient"]],
      facts: ["Green Pharmacy starti 2003-yil deb ko'rsatilgan.", "Formulalar o'simlik va farmatsevtik komponentlarni birlashtiradi.", "Ishlab chiqarish Polsha, Slovakiya va Ukrainada olib boriladi."],
      timeline: [["2003", "Green Pharmacy starti"], ["2008", "Elfa eksportni boshladi"], ["2024", "Green Pharmacy yangilanishi"]],
    },
    "lady-caramel": {
      country: "Ukraina",
      established: "taxminan 2015",
      market: "11 yil bozorda",
      sourceNote: "rasmiy sahifada 11 yil, 16 mamlakat va mavsumda 2 000 000 dona ko'rsatilgan",
      categories: ["depilyatsiya", "mumli chiziqlar", "kremlar", "oldin va keyin parvarish", "argan moyi"],
      mood: "karamel ranglari, silliq teri, uy sharoitida depilyatsiya",
      intro: "Lady Caramel - uy sharoitida tuklarni olib tashlash vositalari: mumlar, kremlar, chiziqlar va depilyatsiyadan keyingi parvarish.",
      detail: "Rasmiy sahifa Lady Caramel'ni Ukrainada keraksiz tuklarni olib tashlash vositalari bo'yicha N1 deb ataydi. Assortimentda turli teri turlari uchun mum va kremlar bor.",
      buyerText: "Parvarish polkasini alohida kuchaytiradi: aniq xaridor talabi bor depilyatsiya kategoriyasi.",
      stats: [["11", "yil bozorda"], ["16", "mamlakat"], ["2 mln", "mavsumda dona"]],
      facts: ["Mumli chiziqlar qo'lda qizdirishsiz foydalanishga tayyor.", "Vositalar turli zona va teri turlariga mo'ljallangan.", "Liniya protseduradan oldin va keyingi parvarishni o'z ichiga oladi."],
      timeline: [["taxminan 2015", "brend starti"], ["hozir", "16 mamlakat va mavsumda 2 mln dona"]],
    },
    "mister-dez": {
      country: "Rossiya",
      manufacturer: "EuroTek MChJ",
      established: "Mister DEZ Eco-Cleaning uchun 2014",
      market: "kompaniya 2012-yil 3-dekabrda tashkil etilgan",
      sourceNote: "EuroTek 03.12.2012 tashkil topgani va Mister DEZ Eco-Cleaning 2014-yilda ishga tushganini ko'rsatadi",
      categories: ["maishiy kimyo", "idish yuvish mashinasi vositalari", "tozalash", "professional", "auto professional"],
      mood: "tozalik, household, kuchli maishiy kimyo",
      intro: "Mister Dez - Rossiyaning EuroTek ishlab chiqaruvchisidan household yo'nalishi: tozalash, idish-tovoq, professional liniyalar va avtokimyo.",
      detail: "EuroTek MChJ 2012-yil 3-dekabrda tashkil etilgan. Kompaniya tarixida Mister DEZ Eco-Cleaning, PROFESSIONAL va AUTO PROFESSIONAL liniyalari ko'rsatilgan.",
      buyerText: "Kosmetikadan tashqariga chiqish uchun kerak: xaridor o'ziga parvarish va toza uy uchun tovarlarni yonma-yon ko'radi.",
      stats: [["2012", "kompaniya tashkil topgan"], ["65 000", "tonna yiliga"], ["270+", "xodim"]],
      facts: ["EuroTek'ning ikkita ishlab chiqarish klasteri bor.", "Ishlab chiqarish quvvati yiliga 65 000 tonna deb ko'rsatilgan.", "Kompaniya maishiy kimyo, kosmetika va STM mahsulotlarini rivojlantiradi."],
      timeline: [["2012", "EuroTek MChJ tashkil topdi"], ["2014", "Mister DEZ Eco-Cleaning ishga tushdi"], ["2016", "idish yuvish mashinalari uchun vositalar"], ["2025", "AUTO PROFESSIONAL, ECO va PROFESSIONAL"]],
    },
  },
};

function getBrandCopy(brand, language) {
  return language === "uz" ? { ...brand, ...(brandTranslations.uz[brand.slug] || {}) } : brand;
}

const elfaFacts = [
  ["26", "лет на рынке Elfa Group"],
  ["63", "страны вокруг мира"],
  ["23", "косметических бренда"],
  ["3000", "инновационных формул"],
];

const sources = [
  ["Uzum Beauty Harmony", uzumShopUrl],
  ["Elfa Group", "https://elfagroup.com/"],
  ["История Elfa Group", "https://pl.elfagroup.com/elfa-group/"],
  ["Dr.Sante", "https://elfagroup.com/brands/dr-sante/"],
  ["Fresh Juice", "https://pl.elfagroup.com/brands/fresh-juice/"],
  ["The Doctor", "https://pl.elfagroup.com/brands/the-doctor/"],
  ["Green Pharmacy", "https://elfagroup.com/brands/green-pharmacy/"],
  ["Lady Caramel", "https://pl.elfagroup.com/brands/lady-caramel/"],
  ["ЕвроТек", "https://evropro.com/o-kompanii/"],
];

const catalogCategories = [
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

function getCategoryLabel(value, language) {
  return categoryLabels[language]?.[value] || categoryLabels.ru[value] || value;
}

function getProductDescription(product, language) {
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
const catalogProducts = uzumCatalogProductsRaw.map(enrichCatalogProduct);

const productSourceNote =
  "Цены, изображения и ссылки взяты со страниц магазина Beauty Harmony в Uzum Market 24 мая 2026. Основной прайс - обычная цена, цена Uzum-karta показана отдельно.";

function getProductBrand(product) {
  return brands.find((brand) => brand.slug === product.brandSlug);
}

function getProductTheme(product) {
  return getProductBrand(product)?.theme || "theme-pharm";
}

function formatPrice(price, language = "ru") {
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

function getProductTitle(product, language) {
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

function inferProductPurpose(category, language = "ru") {
  return productPurposes[language]?.[category] || productPurposes.ru[category] || "Ежедневный уход.";
}

function inferProductVolume(title) {
  const match = title.match(/(\d+(?:[.,]\d+)?)\s*(ml|мл|litr|литр|л|g|г|гр|dona|дона|ta|шт|salfetka)/i);
  if (!match) return "уточнить в Uzum";
  return `${match[1].replace(".", ",")} ${match[2]}`;
}

function useHashRoute() {
  const normalizeRoute = (value) => {
    const route = value || "/";
    return route.startsWith("/") ? route : `/${route}`;
  };

  const getRoute = () => {
    const hashRoute = window.location.hash.replace(/^#/, "");
    if (hashRoute) return normalizeRoute(hashRoute);

    return normalizeRoute(window.location.pathname.replace(/\/$/, "") || "/");
  };

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return route;
}

function useRevealAnimation(route) {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [route]);
}

function AppButton({ href, children, variant = "primary", icon: Icon, type = "button", onClick, disabled = false }) {
  const className = `app-button ${variant}`;

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a className={className} href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined}>
        {Icon && <Icon size={18} aria-hidden="true" />}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick} disabled={disabled}>
      {Icon && <Icon size={18} aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}

function TurnstileWidget({ language, onVerify, onExpire, onError }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (!turnstileSiteKey) return undefined;

    let scriptElement = document.querySelector("[data-turnstile-script='true']");
    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile || widgetIdRef.current !== null) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: turnstileSiteKey,
        theme: "light",
        action: "b2b-request",
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": onError,
      });
    };

    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      scriptElement.async = true;
      scriptElement.defer = true;
      scriptElement.dataset.turnstileScript = "true";
      document.head.appendChild(scriptElement);
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      scriptElement.addEventListener("load", renderWidget);
    }

    return () => {
      isMounted = false;
      scriptElement?.removeEventListener("load", renderWidget);

      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = null;
    };
  }, [onError, onExpire, onVerify]);

  if (!turnstileSiteKey) {
    return (
      <p className="captcha-note is-error">
        {language === "uz"
          ? "Saytda captcha sozlanmagan. Administrator Vercel sozlamalariga Turnstile kalitini qo'shishi kerak."
          : "Капча не настроена. Администратору нужно добавить Turnstile ключ в Vercel."}
      </p>
    );
  }

  return (
    <div className="turnstile-box">
      <div ref={containerRef} />
    </div>
  );
}

function Shell({ route, children }) {
  const { language, setLanguage, t } = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [route]);

  const scrollToHomeTop = () => {
    setIsMenuOpen(false);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <main>
      <nav className="topbar">
        <a className="brand-mark" href="#/" aria-label="Beauty Harmony" onClick={scrollToHomeTop}>
          <span>BH</span>
          <strong>Beauty </strong>
        </a>

        <div className={`nav-links${isMenuOpen ? " is-open" : ""}`} id="site-nav">
          <a className={route === "/" ? "is-active" : ""} href="#/" onClick={scrollToHomeTop}>
            {t.nav.home}
          </a>
          <a className={route === "/catalog" ? "is-active" : ""} href="#/catalog" onClick={closeMenu}>
            {t.nav.catalog}
          </a>
          <a className={route === "/brands" || route.startsWith("/brand/") ? "is-active" : ""} href="#/brands" onClick={closeMenu}>
            {t.nav.brands}
          </a>
          <a className={route === "/b2b" ? "is-active" : ""} href="#/b2b" onClick={closeMenu}>
            {t.nav.b2b}
          </a>
        </div>

        <div className="language-toggle" role="group" aria-label={t.language}>
          {languageOptions.map((option) => (
            <button
              className={language === option.value ? "is-active" : ""}
              type="button"
              key={option.value}
              onClick={() => setLanguage(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <AppButton href={uzumShopUrl} variant="ghost" icon={ShoppingBag}>
          {t.uzumMarket}
        </AppButton>

        <button
          className="menu-toggle"
          type="button"
          aria-controls="site-nav"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? t.menu.close : t.menu.open}
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          {isMenuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </nav>

      {children}

      <Footer />
    </main>
  );
}

function ProductMockup({ brand, compact = false }) {
  const { language } = useLocale();
  const copy = getBrandCopy(brand, language);
  const words = compact ? copy.visualWords.slice(0, 2) : copy.visualWords;
  const className = `mock-scene ${copy.theme}${compact ? " mock-scene--compact" : ""}`;

  return (
    <div className={className}>
      <div className="mock-backdrop">
        {words.map((word, index) => (
          <span key={word} style={{ "--i": index }}>
            {word}
          </span>
        ))}
      </div>
      <div className="mock-products">
        <div className="mock-bottle tall">
          <span>{copy.name}</span>
        </div>
        <div className="mock-bottle tube">
          <span>{copy.categories[0]}</span>
        </div>
        <div className="mock-bottle jar">
          <span>{copy.categories[1]}</span>
        </div>
      </div>
    </div>
  );
}

function BrandCard({ brand }) {
  const { language, t } = useLocale();
  const copy = getBrandCopy(brand, language);

  return (
    <a className={`brand-card reveal ${copy.theme}`} href={`#/brand/${copy.slug}`}>
      <div className="brand-card__topline">
        <span>{copy.country}</span>
        <strong>{copy.market}</strong>
      </div>

      <div className="brand-card__body">
        <ProductMockup brand={copy} compact />
        <div>
          <h3>{copy.localName}</h3>
          <p className="brand-intro">{copy.intro}</p>
        </div>
      </div>

      <div className="brand-meta">
        <span>{copy.manufacturer}</span>
        <span>{copy.established}</span>
      </div>

      <div className="metric-row">
        {copy.stats.map(([value, label]) => (
          <span key={`${copy.slug}-${label}`}>
            <strong>{value}</strong> {label}
          </span>
        ))}
      </div>

      <div className="card-arrow">
        {t.brandsPage.more} <ArrowRight size={18} aria-hidden="true" />
      </div>
    </a>
  );
}

function HomePage() {
  const { language, t } = useLocale();
  const featured = brands.slice(0, 3).map((brand) => getBrandCopy(brand, language));

  return (
    <>
      <header className="hero" id="top">
        <img className="hero__image" src={heroImageUrl} alt="Яркая витрина косметики и средств ухода" />
        <div className="hero__scrim" />
        <div className="hero__content reveal is-visible">
          <span className="eyebrow">
            <Sparkles size={17} aria-hidden="true" />
            {t.home.eyebrow}
          </span>
          <h1>{t.home.title}</h1>
          <p>{t.home.intro}</p>
          <div className="hero-actions">
            <AppButton href="#/catalog" icon={ShoppingBag}>
              {t.home.catalogCta}
            </AppButton>
            <AppButton href="#/brands" icon={Palette}>
              {t.home.brandsCta}
            </AppButton>
            <AppButton href="#/b2b" variant="secondary" icon={Handshake}>
              {t.home.b2bCta}
            </AppButton>
          </div>
          <div className="hero-stats">
            <div>
              <strong>6</strong>
              <span>{t.home.statBrands}</span>
            </div>
            <div>
              <strong>63</strong>
              <span>{t.home.statCountries}</span>
            </div>
            <div>
              <strong>Uzum</strong>
              <span>{t.home.statUzum}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="intro-band reveal">
        <div>
          <span>{t.home.assortmentLabel}</span>
          <h2>{t.home.assortmentTitle}</h2>
        </div>
        <p>{t.home.assortmentText}</p>
      </section>

      <section className="quick-brands reveal">
        {featured.map((brand) => (
          <a className={`quick-brand ${brand.theme}`} href={`#/brand/${brand.slug}`} key={brand.slug}>
            <ProductMockup brand={brand} compact />
            <div>
              <span>{brand.mood}</span>
              <h3>{brand.name}</h3>
            </div>
          </a>
        ))}
      </section>

      <BrandsSection />

      <CatalogPreview />

      <section className="clarity-section reveal">
        <div className="section-heading">
          <span>{t.home.clarityLabel}</span>
          <h2>{t.home.clarityTitle}</h2>
        </div>

        <div className="clarity-grid">
          <article>
            <Leaf size={24} aria-hidden="true" />
            <h3>{t.home.naturalTitle}</h3>
            <p>{t.home.naturalText}</p>
          </article>
          <article>
            <Sparkles size={24} aria-hidden="true" />
            <h3>{t.home.emotionTitle}</h3>
            <p>{t.home.emotionText}</p>
          </article>
          <article>
            <ShieldCheck size={24} aria-hidden="true" />
            <h3>{t.home.practicalTitle}</h3>
            <p>{t.home.practicalText}</p>
          </article>
        </div>
      </section>

      <section className="producer-section reveal">
        <div className="producer-copy">
          <span>{t.home.producersLabel}</span>
          <h2>{t.home.producersTitle}</h2>
          <p>{t.home.producersText}</p>
        </div>
        <div className="producer-facts">
          {elfaFacts.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>
                {language === "uz"
                  ? ["Elfa Group bozorda", "dunyo mamlakatlari", "kosmetik brend", "innovatsion formula"][elfaFacts.findIndex((item) => item[1] === label)]
                  : label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <MarketCta />
    </>
  );
}

function CatalogPreview() {
  const { language, t } = useLocale();
  const previewProducts = [
    "shampun-drsante-keratin-110842",
    "dush-uchun-kremli-270716",
    "yuz-uchun-krem-183310",
    "depilatsiya-uchun-tana-183316",
  ]
    .map((id) => catalogProducts.find((product) => product.id === id))
    .filter(Boolean);

  return (
    <section className="catalog-preview reveal">
      <div className="catalog-preview__copy">
        <span>{t.catalogPreview.label}</span>
        <h2>{t.catalogPreview.title}</h2>
        <p>{t.catalogPreview.text}</p>
        <AppButton href="#/catalog" icon={ShoppingBag}>
          {t.common.openCatalog}
        </AppButton>
      </div>

      <div className="catalog-preview__grid">
        {previewProducts.map((product) => (
          <a className={`mini-product ${getProductTheme(product)}`} href={product.href} target="_blank" rel="noreferrer" key={product.id}>
            <img src={product.image} alt={getProductTitle(product, language)} loading="lazy" />
            <span>{getProductBrand(product) ? getBrandCopy(getProductBrand(product), language).localName : product.brand}</span>
            <strong>{getProductTitle(product, language)}</strong>
            <b>{formatPrice(product.price, language)}</b>
          </a>
        ))}
      </div>
    </section>
  );
}

function BrandsSection() {
  const { t } = useLocale();

  return (
    <section className="brands-page-section" id="brands">
      <div className="section-heading reveal">
        <span>{t.brandsPage.label}</span>
        <h2>{t.brandsPage.title}</h2>
        <p>{t.brandsPage.text}</p>
      </div>

      <div className="brand-grid">
        {brands.map((brand) => (
          <BrandCard brand={brand} key={brand.slug} />
        ))}
      </div>
    </section>
  );
}

function CatalogPage() {
  const { language, t } = useLocale();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const productCountByCategory = useMemo(() => {
    return catalogProducts.reduce(
      (accumulator, product) => {
        accumulator[product.category] = (accumulator[product.category] || 0) + 1;
        accumulator.all += 1;
        return accumulator;
      },
      { all: 0 }
    );
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const results = catalogProducts.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const searchableText = [
        product.name,
        product.nameRu,
        product.uzumTitle,
        product.brand,
        product.categoryLabel,
        getCategoryLabel(product.category, language),
        inferProductPurpose(product.category, language),
        getProductDescription(product, language),
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });

    return [...results].sort((left, right) => {
      if (sort === "price-asc") return left.price - right.price;
      if (sort === "price-desc") return right.price - left.price;
      if (sort === "name") return left.name.localeCompare(right.name, language === "uz" ? "uz" : "ru");
      return catalogProducts.findIndex((product) => product.id === left.id) - catalogProducts.findIndex((product) => product.id === right.id);
    });
  }, [category, query, sort, language]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSort("default");
  };

  const hasFilters = query || category !== "all" || sort !== "default";

  return (
    <>
      <header className="catalog-hero">
        <div className="catalog-hero__copy reveal is-visible">
          <span className="eyebrow">
            <Tags size={17} aria-hidden="true" />
            {t.catalog.eyebrow}
          </span>
          <h1>{t.catalog.title}</h1>
          <p>{t.catalog.intro}</p>
          <div className="hero-actions">
            <AppButton href={uzumShopUrl} icon={Store}>
              {t.common.openShop}
            </AppButton>
            <AppButton href="#/brands" variant="secondary" icon={Palette}>
              {t.common.viewBrands}
            </AppButton>
          </div>
        </div>

        <div className="catalog-hero__stats reveal is-visible">
          <div>
            <strong>{catalogProducts.length}</strong>
            <span>{t.catalog.products}</span>
          </div>
          <div>
            <strong>{formatPrice(Math.min(...catalogProducts.map((product) => product.price)), language)}</strong>
            <span>{t.catalog.minPrice}</span>
          </div>
          <div>
            <strong>{catalogCategories.length - 1}</strong>
            <span>{t.catalog.categories}</span>
          </div>
        </div>
      </header>

      <section className="catalog-page">
        <div className="catalog-toolbar reveal is-visible">
          <div className="catalog-search">
            <Search size={20} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.catalog.searchPlaceholder}
              aria-label={t.catalog.searchLabel}
            />
          </div>

          <label className="catalog-select">
            {t.catalog.category}
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {catalogCategories.map((item) => (
                <option value={item.value} key={item.value}>
                  {getCategoryLabel(item.value, language)} ({productCountByCategory[item.value] || 0})
                </option>
              ))}
            </select>
          </label>

          <label className="catalog-select">
            {t.catalog.sort}
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="default">{t.catalog.defaultSort}</option>
              <option value="price-asc">{t.catalog.priceAsc}</option>
              <option value="price-desc">{t.catalog.priceDesc}</option>
              <option value="name">{t.catalog.byName}</option>
            </select>
          </label>

          <button className="catalog-reset" type="button" onClick={resetFilters} disabled={!hasFilters}>
            <X size={18} aria-hidden="true" />
            {t.catalog.reset}
          </button>
        </div>

        <div className="catalog-summary reveal">
          <div>
            <span>
              {filteredProducts.length} {language === "uz" ? "/" : "из"} {catalogProducts.length}
            </span>
            <h2>{t.catalog.found}</h2>
          </div>
          <p>{t.catalog.sourceNote}</p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <CatalogProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty reveal">
            <SlidersHorizontal size={32} aria-hidden="true" />
            <h2>{t.catalog.emptyTitle}</h2>
            <p>{t.catalog.emptyText}</p>
            <AppButton onClick={resetFilters} icon={X}>
              {t.catalog.clearFilters}
            </AppButton>
          </div>
        )}
      </section>

      <MarketCta />
    </>
  );
}

function CatalogProductCard({ product }) {
  const { language, t } = useLocale();
  const brand = getProductBrand(product);
  const brandCopy = brand ? getBrandCopy(brand, language) : null;

  return (
    <article className={`product-card-site reveal ${getProductTheme(product)}`}>
      <a className="product-card-site__image" href={product.href} target="_blank" rel="noreferrer">
        <img src={product.image} alt={getProductTitle(product, language)} loading="lazy" />
      </a>

      <div className="product-card-site__body">
        <div className="product-card-site__top">
          <span>{getCategoryLabel(product.category, language)}</span>
          <b>{product.volume}</b>
        </div>
        <h3>{getProductTitle(product, language)}</h3>
        <p>{getProductDescription(product, language)}</p>

        <dl className="product-card-site__details">
          <div>
            <dt>{t.common.brand}</dt>
            <dd>{brandCopy?.localName || product.brand}</dd>
          </div>
          <div>
            <dt>{t.common.purpose}</dt>
            <dd>{inferProductPurpose(product.category, language)}</dd>
          </div>
        </dl>

        <small title={product.uzumTitle}>Uzum: {product.uzumTitle}</small>
      </div>

      <div className="product-card-site__footer">
        <div>
          <span>{t.common.normalPrice}</span>
          <strong>{formatPrice(product.price, language)}</strong>
          {product.uzumCardPrice && product.uzumCardPrice < product.price && (
            <em>Uzum karta: {formatPrice(product.uzumCardPrice, language)}</em>
          )}
        </div>
        <AppButton href={product.href} icon={ShoppingBag}>
          {t.common.buy}
        </AppButton>
      </div>

      {brand && (
        <a className="product-card-site__brand-link" href={`#/brand/${brand.slug}`}>
          {t.common.aboutBrand} <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      )}
    </article>
  );
}

function BrandPage({ brand }) {
  const { language, t } = useLocale();
  const copy = getBrandCopy(brand, language);
  const otherBrands = brands.filter((item) => item.slug !== brand.slug).slice(0, 3).map((item) => getBrandCopy(item, language));
  const brandAlias = copy.localName.includes(" / ") ? copy.localName.split(" / ")[1] : "";
  const brandTitle = copy.slug === "the-doctor" ? copy.name : copy.localName;

  return (
    <article className={`brand-detail ${copy.theme}`}>
      <header className="brand-hero">
        <div className="brand-hero__copy reveal is-visible">
          <a className="back-link" href="#/brands">
            <ArrowLeft size={18} aria-hidden="true" />
            {t.common.allBrands}
          </a>
          <span className="eyebrow">{copy.country} | {copy.manufacturer}</span>
          <h1>{brandTitle}</h1>
          {copy.slug === "the-doctor" && brandAlias && <strong className="brand-alias">{brandAlias}</strong>}
          <p>{copy.intro}</p>
          <div className="hero-actions">
            <AppButton href={uzumShopUrl} icon={ShoppingBag}>
              {t.common.productsInUzum}
            </AppButton>
            <AppButton href="#/b2b" variant="secondary" icon={HeartHandshake}>
              {t.common.b2bRequest}
            </AppButton>
          </div>
        </div>

        <div className="brand-hero__visual reveal is-visible">
          <ProductMockup brand={copy} />
        </div>
      </header>

      <section className="brand-facts reveal">
        {copy.stats.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="brand-story reveal">
        <div>
          <span>{t.brandPage.essence}</span>
          <h2>{copy.mood}</h2>
          <p>{copy.detail}</p>
          <p>{copy.buyerText}</p>
        </div>

        <aside>
          <h3>{t.brandPage.passport}</h3>
          <dl>
            <div>
              <dt>{t.brandPage.manufacturer}</dt>
              <dd>{copy.manufacturer}</dd>
            </div>
            <div>
              <dt>{t.brandPage.country}</dt>
              <dd>{copy.country}</dd>
            </div>
            <div>
              <dt>{t.brandPage.start}</dt>
              <dd>{copy.established}</dd>
            </div>
            <div>
              <dt>{t.brandPage.data}</dt>
              <dd>{copy.sourceNote}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="brand-categories reveal">
        <div className="section-heading compact">
          <span>{t.brandPage.categories}</span>
          <h2>{t.brandPage.sellTitle}</h2>
        </div>
        <div className="category-cloud">
          {copy.categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
      </section>

      <section className="brand-deep-grid reveal">
        <div className="info-panel">
          <h3>{t.brandPage.facts}</h3>
          <ul>
            {copy.facts.map((fact) => (
              <li key={fact}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="timeline-panel">
          <h3>{t.brandPage.timeline}</h3>
          <div className="timeline-list">
            {copy.timeline.map(([year, event]) => (
              <div key={`${year}-${event}`}>
                <strong>{year}</strong>
                <span>{event}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="source-panel reveal">
        <div>
          <span>{t.common.source}</span>
          <h2>{t.brandPage.sourceTitle}</h2>
        </div>
        <AppButton href={copy.source} variant="ghost" icon={ArrowUpRight}>
          {t.common.openSource}
        </AppButton>
      </section>

      <section className="related-brands reveal">
        <div className="section-heading compact">
          <span>{t.brandPage.moreLabel}</span>
          <h2>{t.brandPage.moreTitle}</h2>
        </div>
        <div className="related-grid">
          {otherBrands.map((item) => (
            <a className={`related-card ${item.theme}`} href={`#/brand/${item.slug}`} key={item.slug}>
              <span>{item.country}</span>
              <strong>{item.name}</strong>
              <small>{item.market}</small>
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}

function B2BPage() {
  const { language, t } = useLocale();
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [form, setForm] = useState({
    company: "",
    name: "",
    phoneNumber: "+998 ",
    city: "",
    type: t.b2b.formats[0],
    brands: "Dr.Sante, Fresh Juice, Green Pharmacy",
    comment: "",
  });

  const formats = t.b2b.formats;

  useEffect(() => {
    if (!formats.includes(form.type)) {
      setForm((current) => ({ ...current, type: formats[0] }));
    }
  }, [formats, form.type]);

  useEffect(() => {
    if (!submittedRequest) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSubmittedRequest(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submittedRequest]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "phoneNumber" ? formatUzbekPhoneNumber(value) : value,
    }));
  };

  const handleTurnstileVerify = useCallback((token) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken("");
    setStatus(language === "uz" ? "Captcha yuklanmadi. Sahifani yangilab ko'ring." : "Капча не загрузилась. Обновите страницу и попробуйте ещё раз.");
    setStatusType("error");
  }, [language]);

  const resetTurnstile = useCallback(() => {
    setTurnstileToken("");
    setCaptchaResetKey((current) => current + 1);
  }, []);

  const closeSuccessModal = useCallback(() => {
    setSubmittedRequest(null);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValidUzbekPhoneNumber(form.phoneNumber)) {
      setStatus(language === "uz" ? "Telefon raqamini +998 kodi bilan to'liq kiriting." : "Введите полный номер телефона с кодом +998.");
      setStatusType("error");
      return;
    }

    if (!turnstileToken) {
      setStatus(language === "uz" ? "Avval captcha tekshiruvidan o'ting." : "Сначала подтвердите, что вы человек.");
      setStatusType("error");
      return;
    }

    setIsSubmitting(true);
    setStatus(language === "uz" ? "Ariza yuborilmoqda..." : "Отправляем заявку...");
    setStatusType("success");

    try {
      const requestPreview = {
        company: form.company.trim(),
        name: form.name.trim(),
        phoneNumber: formatUzbekPhoneNumber(form.phoneNumber),
        city: form.city.trim(),
        type: form.type,
        brands: form.brands.trim(),
        comment: form.comment.trim(),
      };

      await createPartnerRequest({ ...form, turnstileToken });
      setStatus(t.b2b.status);
      setStatusType("success");
      setSubmittedRequest(requestPreview);
      resetTurnstile();
      setForm({
        company: "",
        name: "",
        phoneNumber: "+998 ",
        city: "",
        type: formats[0],
        brands: "Dr.Sante, Fresh Juice, Green Pharmacy",
        comment: "",
      });
    } catch (error) {
      setStatus(
        language === "uz"
          ? error.code === "MONTHLY_LIMIT_REACHED"
            ? "Bu IP manzildan oyiga 3 ta ariza yuborish mumkin."
            : error.code === "TURNSTILE_FAILED"
              ? "Captcha tekshiruvi o'tmadi. Qaytadan urinib ko'ring."
              : "Arizani yuborib bo'lmadi. Internetni tekshiring yoki keyinroq urinib ko'ring."
          : error.code === "MONTHLY_LIMIT_REACHED"
            ? "С этого IP можно отправить только 3 заявки в месяц."
            : error.code === "TURNSTILE_FAILED"
              ? "Проверка капчи не прошла. Попробуйте ещё раз."
              : "Не удалось отправить заявку. Проверьте интернет или попробуйте позже."
      );
      setStatusType("error");
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  const successFields = submittedRequest
    ? [
        { label: t.b2b.name, value: submittedRequest.name },
        { label: t.b2b.phone, value: submittedRequest.phoneNumber },
        { label: t.b2b.city, value: submittedRequest.city },
        { label: t.b2b.company, value: submittedRequest.company },
        { label: t.b2b.formatLabel, value: submittedRequest.type },
        { label: t.b2b.brands, value: submittedRequest.brands || t.b2b.emptyValue },
        { label: t.b2b.comment, value: submittedRequest.comment || t.b2b.emptyValue },
      ]
    : [];

  return (
    <>
      <header className="b2b-hero" style={{ "--b2b-bg": `url("${heroImageUrl}")` }}>
        <div className="reveal is-visible">
          <span className="eyebrow">
            <Handshake size={17} aria-hidden="true" />
            {t.b2b.eyebrow}
          </span>
          <h1>{t.b2b.title}</h1>
          <p>{t.b2b.intro}</p>
        </div>
      </header>

      <section className="b2b-content reveal">
        <div className="b2b-benefits">
          <article>
            <Store size={24} aria-hidden="true" />
            <h3>{t.b2b.retail}</h3>
            <p>{t.b2b.retailText}</p>
          </article>
          <article>
            <Truck size={24} aria-hidden="true" />
            <h3>{t.b2b.wholesale}</h3>
            <p>{t.b2b.wholesaleText}</p>
          </article>
          <article>
            <PackageCheck size={24} aria-hidden="true" />
            <h3>{t.b2b.marketplace}</h3>
            <p>{t.b2b.marketplaceText}</p>
          </article>
        </div>

        <form className="partner-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              {t.b2b.company}
              <input name="company" value={form.company} onChange={handleChange} placeholder={t.b2b.companyPlaceholder} required />
            </label>
            <label>
              {t.b2b.name}
              <input name="name" value={form.name} onChange={handleChange} placeholder={t.b2b.namePlaceholder} required />
            </label>
            <label>
              {t.b2b.phone}
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder={t.b2b.phonePlaceholder} required />
            </label>
            <label>
              {t.b2b.city}
              <input name="city" value={form.city} onChange={handleChange} placeholder={t.b2b.cityPlaceholder} required />
            </label>
          </div>

          <div className="format-options" role="group" aria-label={t.b2b.formatLabel}>
            {formats.map((format) => (
              <label key={format} className={form.type === format ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="type"
                  value={format}
                  checked={form.type === format}
                  onChange={handleChange}
                />
                {format}
              </label>
            ))}
          </div>

          <label>
            {t.b2b.brands}
            <input name="brands" value={form.brands} onChange={handleChange} placeholder={t.b2b.brandsPlaceholder} />
          </label>

          <label>
            {t.b2b.comment}
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              rows="4"
              placeholder={t.b2b.commentPlaceholder}
            />
          </label>

          <TurnstileWidget
            key={captchaResetKey}
            language={language}
            onVerify={handleTurnstileVerify}
            onExpire={handleTurnstileExpire}
            onError={handleTurnstileError}
          />

          <AppButton type="submit" icon={Send} disabled={isSubmitting}>
            {isSubmitting ? (language === "uz" ? "Yuborilmoqda..." : "Отправка...") : t.b2b.submit}
          </AppButton>

          {status && <p className={`form-status${statusType === "error" ? " is-error" : ""}`}>{status}</p>}
        </form>
      </section>

      {submittedRequest && (
        <div className="request-success-modal" role="dialog" aria-modal="true" aria-labelledby="request-success-title">
          <button className="request-success-modal__backdrop" type="button" aria-label={t.b2b.successClose} onClick={closeSuccessModal} />
          <article className="request-success-modal__card">
            <button className="request-success-modal__close" type="button" aria-label={t.b2b.successClose} onClick={closeSuccessModal}>
              <X size={18} aria-hidden="true" />
            </button>
            <div className="request-success-modal__icon">
              <CheckCircle2 size={30} aria-hidden="true" />
            </div>
            <h2 id="request-success-title">{t.b2b.successTitle}</h2>
            <p>{t.b2b.successText}</p>
            <dl>
              {successFields.map((field) => (
                <div key={field.label}>
                  <dt>{field.label}</dt>
                  <dd>{field.value}</dd>
                </div>
              ))}
            </dl>
            <AppButton type="button" icon={CheckCircle2} onClick={closeSuccessModal}>
              {t.b2b.successClose}
            </AppButton>
          </article>
        </div>
      )}
    </>
  );
}

function getRequestField(request, keys) {
  return keys.map((key) => request?.[key]).find((value) => value !== undefined && value !== null && String(value).trim()) || "";
}

function formatRequestDate(value) {
  if (!value) return "Дата не указана";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function AdminPage() {
  const [session, setSession] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [credentials, setCredentials] = useState({ login: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loadStatus, setLoadStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAdminSession()
      .then((user) => {
        if (isMounted) setSession(user);
      })
      .finally(() => {
        if (isMounted) setIsCheckingSession(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setLoadStatus("");

    try {
      setRequests(await fetchPartnerRequests());
    } catch {
      setLoadStatus("Не удалось загрузить заявки. Проверьте соединение или серверные настройки.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      loadRequests();
    }
  }, [loadRequests, session]);

  const handleCredentialChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const user = await loginAdmin(credentials);
      setSession(user);
      setCredentials({ login: "", password: "" });
    } catch {
      setLoginError("Неверный логин или пароль.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setSession(null);
    setRequests([]);
  };

  const handleDeleteRequest = async (request) => {
    if (!request.id || deletingRequestId) return;

    const requestName = getRequestField(request, ["name"]) || request.id;
    const confirmed = window.confirm(`Удалить заявку "${requestName}"?`);

    if (!confirmed) return;

    setDeletingRequestId(request.id);
    setLoadStatus("");

    try {
      await deletePartnerRequest(request.id);
      setRequests((current) => current.filter((item) => item.id !== request.id));
    } catch {
      setLoadStatus("Не удалось удалить заявку. Попробуйте обновить страницу.");
    } finally {
      setDeletingRequestId("");
    }
  };

  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return requests.filter((request) => {
      const requestType = getRequestField(request, ["type", "format"]);
      const matchesType = typeFilter === "all" || requestType === typeFilter;
      const searchableText = [
        request.id,
        getRequestField(request, ["name"]),
        getRequestField(request, ["phoneNumber", "phone", "phone number"]),
        getRequestField(request, ["city"]),
        getRequestField(request, ["company"]),
        requestType,
        getRequestField(request, ["brands"]),
        getRequestField(request, ["comment", "message"]),
      ]
        .join(" ")
        .toLowerCase();

      return matchesType && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [query, requests, typeFilter]);

  const types = useMemo(() => {
    const apiTypes = requests.map((request) => getRequestField(request, ["type", "format"])).filter(Boolean);
    return [...new Set([...partnerRequestTypes, ...apiTypes])];
  }, [requests]);

  if (isCheckingSession) {
    return (
      <section className="admin-login-page">
        <div className="admin-empty">
          <RefreshCw size={32} aria-hidden="true" />
          <h2>Проверяем сессию</h2>
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <span>
            <Lock size={18} aria-hidden="true" />
            Admin
          </span>
          <h1>Вход в админ панель</h1>
          <p>Введите логин и пароль, чтобы посмотреть B2B заявки партнеров.</p>

          <label>
            Логин
            <input name="login" value={credentials.login} onChange={handleCredentialChange} autoComplete="username" required />
          </label>

          <label>
            Пароль
            <input
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleCredentialChange}
              autoComplete="current-password"
              required
            />
          </label>

          <AppButton type="submit" icon={ShieldCheck} disabled={isLoggingIn}>
            {isLoggingIn ? "Проверяем..." : "Войти"}
          </AppButton>

          {loginError && <p className="admin-error">{loginError}</p>}
          <small>Вход проверяется на сервере, пароль не хранится в frontend-коде.</small>
        </form>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <header className="admin-header">
        <div>
          <span className="eyebrow">
            <ShieldCheck size={17} aria-hidden="true" />
            Admin
          </span>
          <h1>B2B заявки</h1>
          <p>Заявки загружаются через защищенный серверный endpoint. Список доступен только после входа.</p>
        </div>

        <div className="admin-actions">
          <AppButton variant="secondary" icon={RefreshCw} onClick={loadRequests} disabled={isLoading}>
            {isLoading ? "Загрузка..." : "Обновить"}
          </AppButton>
          <AppButton variant="ghost" icon={LogOut} onClick={handleLogout}>
            Выйти
          </AppButton>
        </div>
      </header>

      <div className="admin-stats">
        <div>
          <strong>{requests.length}</strong>
          <span>всего заявок</span>
        </div>
        <div>
          <strong>{filteredRequests.length}</strong>
          <span>показано сейчас</span>
        </div>
        <div>
          <strong>{session.name}</strong>
          <span>текущий админ</span>
        </div>
      </div>

      <div className="admin-toolbar">
        <label>
          Поиск
          <span>
            <Search size={18} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Имя, телефон, город, компания" />
          </span>
        </label>

        <label>
          Тип заявки
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">Все типы</option>
            {types.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loadStatus && <p className="admin-error">{loadStatus}</p>}

      {isLoading ? (
        <div className="admin-empty">
          <RefreshCw size={32} aria-hidden="true" />
          <h2>Загружаем заявки</h2>
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="admin-request-grid">
          {filteredRequests.map((request) => {
            const phoneNumber = getRequestField(request, ["phoneNumber", "phone", "phone number"]);
            const comment = getRequestField(request, ["comment", "message"]);
            const requestType = getRequestField(request, ["type", "format"]);
            const isDeleting = deletingRequestId === request.id;

            return (
              <article className="admin-request-card" key={request.id || `${request.name}-${request.createdAt}`}>
                <div className="admin-request-card__top">
                  <span>#{request.id || "без id"}</span>
                  <strong>{requestType || "Без типа"}</strong>
                </div>

                <h2>{getRequestField(request, ["name"]) || "Без имени"}</h2>

                <dl>
                  <div>
                    <dt>Телефон</dt>
                    <dd>{phoneNumber || "Не указан"}</dd>
                  </div>
                  <div>
                    <dt>Город</dt>
                    <dd>{getRequestField(request, ["city"]) || "Не указан"}</dd>
                  </div>
                  <div>
                    <dt>Компания</dt>
                    <dd>{getRequestField(request, ["company"]) || "Не указана"}</dd>
                  </div>
                  <div>
                    <dt>Бренды</dt>
                    <dd>{getRequestField(request, ["brands"]) || "Не указаны"}</dd>
                  </div>
                </dl>

                {comment && <p>{comment}</p>}
                <div className="admin-request-card__footer">
                  <small>{formatRequestDate(request.createdAt)}</small>
                  <button
                    className="admin-delete-button"
                    type="button"
                    onClick={() => handleDeleteRequest(request)}
                    disabled={!request.id || isDeleting}
                    title="Удалить заявку"
                  >
                    <Trash2 size={17} aria-hidden="true" />
                    <span>{isDeleting ? "Удаляем..." : "Удалить"}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="admin-empty">
          <Search size={32} aria-hidden="true" />
          <h2>Заявки не найдены</h2>
          <p>Попробуйте очистить поиск или обновить список.</p>
        </div>
      )}
    </section>
  );
}

function MarketCta() {
  const { t } = useLocale();

  return (
    <section className="market-cta reveal">
      <div>
        <span>{t.common.marketplace}</span>
        <h2>{t.market.title}</h2>
        <p>{t.market.text}</p>
      </div>
      <AppButton href={uzumShopUrl} icon={ShoppingBag}>
        {t.common.goToUzum}
      </AppButton>
    </section>
  );
}

function Footer() {
  const { language, t } = useLocale();

  return (
    <footer>
      <div>
        <strong>Beauty Harmony</strong>
        <p>{t.footer.text}</p>
      </div>
      <div className="source-links">
        {sources.map(([label, href]) => (
          <a href={href} target="_blank" rel="noreferrer" key={href}>
            {language === "uz" && label === "История Elfa Group" ? "Elfa Group tarixi" : language === "uz" && label === "ЕвроТек" ? "EuroTek" : label}
          </a>
        ))}
      </div>
    </footer>
  );
}

function NotFoundPage() {
  const { t } = useLocale();

  return (
    <section className="not-found">
      <h1>{t.notFound.title}</h1>
      <p>{t.notFound.text}</p>
      <AppButton href="#/" icon={ArrowLeft}>
        {t.common.toHome}
      </AppButton>
    </section>
  );
}

export function BeautyHarmonyWebsite() {
  const route = useHashRoute();
  const [language, setLanguage] = useState(() => localStorage.getItem("beauty-harmony-language") || "ru");
  useRevealAnimation(route);

  useEffect(() => {
    localStorage.setItem("beauty-harmony-language", language);
    document.documentElement.lang = language === "uz" ? "uz" : "ru";
  }, [language]);

  const content = useMemo(() => {
    if (route === "/" || route === "") return <HomePage />;
    if (route === "/catalog") return <CatalogPage />;
    if (route === "/brands") return <BrandsSection />;
    if (route === "/b2b") return <B2BPage />;
    if (route === "/admin") return <AdminPage />;

    const brandMatch = route.match(/^\/brand\/(.+)$/);
    if (brandMatch) {
      const brand = brands.find((item) => item.slug === brandMatch[1]);
      return brand ? <BrandPage brand={brand} /> : <NotFoundPage />;
    }

    return <NotFoundPage />;
  }, [route]);

  const localeValue = useMemo(() => ({ language, setLanguage, t: ui[language] || ui.ru }), [language]);

  return (
    <LocaleContext.Provider value={localeValue}>
      <Shell route={route}>{content}</Shell>
    </LocaleContext.Provider>
  );
}
