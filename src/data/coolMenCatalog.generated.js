// Generated from "coolmen.pdf".
// Product images are stored in public/products/cool-men-clean/.

const uzumShopUrl = "https://uzum.uz/uz/shop/beautyh";
const sourceName = "Cool Men PDF catalog";

const products = [
  {
    slug: "ultrasensitive-3in1-500",
    nameRu: "Шампунь-гель Cool Men Ultrasensitive 3 в 1, 500 мл",
    nameUz: "Cool Men Ultrasensitive 3 in 1 shampun-gel, 500 ml",
    lineRu: "Ultrasensitive",
    lineUz: "Ultrasensitive",
    descriptionRu:
      "Серия Ultrasensitive создана для мужчин с чувствительной кожей. Регулярное использование помогает укрепить защитный барьер кожи и сделать ее более устойчивой к внешним воздействиям. Формула содержит насыщенный витаминный комплекс, экстракт ромашки, сок алоэ вера и аллантоин: компоненты увлажняют, смягчают кожу, снимают раздражение и помогают при мелких порезах.",
    descriptionUz:
      "Ultrasensitive seriyasi sezgir teriga ega erkaklar uchun yaratilgan. Formula vitamin kompleksi, romashka ekstrakti, aloe vera sharbati va allantoin bilan terini namlaydi, yumshatadi va tashqi ta'sirlarga chidamliroq qilishga yordam beradi.",
    purposeRu: "Ежедневное очищение волос, тела и лица для чувствительной мужской кожи.",
    purposeUz: "Sezgir erkak terisi uchun soch, tana va yuzni kundalik tozalash.",
  },
  {
    slug: "ultramint-3in1-500",
    nameRu: "Шампунь-гель Cool Men Ultramint 3 в 1, 500 мл",
    nameUz: "Cool Men Ultramint 3 in 1 shampun-gel, 500 ml",
    lineRu: "Ultramint",
    lineUz: "Ultramint",
    descriptionRu:
      "Серия Ultramint разработана для мужчин, которые ценят ощущение свежести и бодрости. Миндальное масло, сок алоэ вера и ментол помогают обеспечить тщательное очищение, длительный комфорт и приятный охлаждающий эффект после тяжелого дня.",
    descriptionUz:
      "Ultramint seriyasi tetiklik va bardamlik hissini qadrlaydigan erkaklar uchun. Bodom moyi, aloe vera sharbati va mentol terini tozalash, qulaylik va yoqimli sovituvchi effekt berishga yordam beradi.",
    purposeRu: "Очищение волос, тела и лица с прохладным мятным эффектом.",
    purposeUz: "Soch, tana va yuzni salqin yalpiz effekti bilan tozalash.",
  },
  {
    slug: "ultraenergy-3in1-500",
    nameRu: "Шампунь-гель Cool Men Ultraenergy 3 в 1, 500 мл",
    nameUz: "Cool Men Ultraenergy 3 in 1 shampun-gel, 500 ml",
    lineRu: "Ultraenergy",
    lineUz: "Ultraenergy",
    descriptionRu:
      "Серия Ultraenergy помогает зарядиться энергией, бодростью и хорошим настроением. Средства бережно заботятся о коже, защищают ее от раздражений и сохраняют естественную влагу. В рецептуре указаны кофеин, экстракт гуараны, ментол, аллантоин и растительные экстракты; серия подходит активному образу жизни.",
    descriptionUz:
      "Ultraenergy seriyasi energiya va tetiklik hissini beradi. Kofein, guarana ekstrakti, mentol, allantoin va o'simlik ekstraktlari terini quritmasdan parvarish qilishga yordam beradi.",
    purposeRu: "Тонизирующее очищение волос, тела и лица после активного дня.",
    purposeUz: "Faol kundan keyin soch, tana va yuzni tetiklantirib tozalash.",
  },
];

export const coolMenCatalogProducts = products.map((product, index) => {
  const id = `cool-men-${product.slug}`;

  return {
    id,
    name: product.nameRu,
    titleRu: product.nameRu,
    titleUz: product.nameUz,
    nameRu: product.nameRu,
    nameUz: product.nameUz,
    brand: "Cool Men",
    brandSlug: "cool-men",
    line: product.lineRu,
    lineRu: product.lineRu,
    lineUz: product.lineUz,
    category: "shower-gels",
    categoryLabel: "Гели для душа",
    volume: "500 мл",
    purpose: product.purposeRu,
    purposeRu: product.purposeRu,
    purposeUz: product.purposeUz,
    description: product.descriptionRu,
    descriptionRu: product.descriptionRu,
    descriptionUz: product.descriptionUz,
    href: uzumShopUrl,
    image: `products/cool-men-clean/${id}.png`,
    price: null,
    uzumCardPrice: null,
    source: sourceName,
    sortOrder: 300 + index,
  };
});
