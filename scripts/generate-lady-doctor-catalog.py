from __future__ import annotations

import json
import re
import unicodedata
from io import BytesIO
from pathlib import Path

import fitz
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
TELEGRAM = Path.home() / "Downloads" / "Telegram Desktop"
UZUM_URL = "https://uzum.uz/uz/shop/beautyh"

LADY_PDF = next(path for path in TELEGRAM.glob("*.pdf") if "Lady-Caramel (2)" in path.name)
DOCTOR_PDF = next(path for path in TELEGRAM.glob("*.pdf") if "FINAL" in path.name and "Dr_Sante" not in path.name)

LADY_IMAGE_DIR = ROOT / "public" / "products" / "lady-caramel-clean"
DOCTOR_IMAGE_DIR = ROOT / "public" / "products" / "the-doctor-clean"

CATEGORY_LABELS = {
    "shampoo": "Шампуни",
    "hair-care": "Уход за волосами",
    "creams": "Кремы",
    "face-care": "Уход за лицом",
    "body-care": "Уход за телом",
    "bath": "Ванна и мыло",
    "hand-care": "Уход за руками",
    "intimate-hygiene": "Интимная гигиена",
    "depilation": "Депиляция",
    "lip-care": "Уход за губами",
    "oral-care": "Уход за полостью рта",
    "foot-care": "Уход за ногами",
    "wellness": "Лечебно-профилактические средства",
    "essential-oils": "Эфирные масла",
}

CATEGORY_PURPOSE = {
    "shampoo": "Очищение волос и кожи головы.",
    "hair-care": "Уход за волосами и кожей головы.",
    "creams": "Кремовый уход для кожи.",
    "face-care": "Ежедневный уход за кожей лица.",
    "body-care": "Уход за кожей тела.",
    "bath": "Средства для ванны и очищения.",
    "hand-care": "Уход за кожей рук и ногтями.",
    "intimate-hygiene": "Деликатная интимная гигиена.",
    "depilation": "Домашняя депиляция и уход после процедуры.",
    "lip-care": "Питание и защита губ.",
    "oral-care": "Уход за полостью рта.",
    "foot-care": "Уход за кожей ног.",
    "wellness": "Наружный профилактический уход.",
    "essential-oils": "Ароматерапия и обогащение косметических средств.",
}

TRANSLIT = str.maketrans(
    {
        "а": "a",
        "б": "b",
        "в": "v",
        "г": "g",
        "д": "d",
        "е": "e",
        "ё": "e",
        "ж": "zh",
        "з": "z",
        "и": "i",
        "й": "y",
        "к": "k",
        "л": "l",
        "м": "m",
        "н": "n",
        "о": "o",
        "п": "p",
        "р": "r",
        "с": "s",
        "т": "t",
        "у": "u",
        "ф": "f",
        "х": "h",
        "ц": "c",
        "ч": "ch",
        "ш": "sh",
        "щ": "sch",
        "ъ": "",
        "ы": "y",
        "ь": "",
        "э": "e",
        "ю": "yu",
        "я": "ya",
    }
)


def slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text).lower().translate(TRANSLIT)
    return (re.sub(r"[^a-z0-9]+", "-", normalized).strip("-") or "product")[:80]


def clean_text(text: str) -> str:
    text = text.replace("\u00ad", "")
    text = re.sub(r"-\s+", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text.replace(" ,", ",").replace(" .", ".")


def prepare_dirs() -> None:
    for folder in (LADY_IMAGE_DIR, DOCTOR_IMAGE_DIR):
        folder.mkdir(parents=True, exist_ok=True)
        for old_file in folder.glob("*.webp"):
            old_file.unlink()


def save_webp(image: Image.Image, path: Path, max_size: int = 760) -> None:
    image = ImageOps.exif_transpose(image)
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA")

    image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (max(image.width, 320), max(image.height, 320)), (255, 255, 255, 0))
    offset = ((canvas.width - image.width) // 2, (canvas.height - image.height) // 2)
    if image.mode == "RGBA":
        canvas.alpha_composite(image, offset)
    else:
        canvas.paste(image, offset)
    canvas.save(path, "WEBP", quality=78, method=5)


LADY_SPECS = [
    {
        "page": 0,
        "crop": (43, 520, 216, 802),
        "slug": "body-wax-strips-argan-16",
        "name": "Воск для депиляции тела Lady Caramel Аргана, 16 шт",
        "category": "depilation",
        "volume": "16 шт",
        "barcode": "4823015939730",
        "purpose": "Восковые полоски для депиляции тела.",
        "description": "Значительно снижает жесткость отрастающих волосков. Кожа остается гладкой и шелковистой. Мягко прилегающая эластичная основа воска позволяет полоскам идеально приспособиться к формам тела. Содержит масло марокканской арганы.",
    },
    {
        "page": 0,
        "crop": (274, 520, 446, 802),
        "slug": "body-wax-strips-vanilla-16",
        "name": "Воск для депиляции тела Lady Caramel Ванильный, 16 шт",
        "category": "depilation",
        "volume": "16 шт",
        "barcode": "4823015920219",
        "purpose": "Восковые полоски для депиляции тела.",
        "description": "Эффективно удаляет волосы, кожа остается гладкой и шелковистой. Мягко прилегающая основа воска повторяет формы тела. Содержит экстракт ванили с антистрессовыми и успокаивающими свойствами.",
    },
    {
        "page": 0,
        "crop": (486, 520, 657, 802),
        "slug": "body-wax-strips-strawberry-16",
        "name": "Воск для депиляции тела Lady Caramel Клубничный, 16 шт",
        "category": "depilation",
        "volume": "16 шт",
        "barcode": "4823015920189",
        "purpose": "Восковые полоски для депиляции тела.",
        "description": "Значительно снижает жесткость отрастающих волосков. Кожа остается гладкой и шелковистой, а мягкая основа воска плотно прилегает к коже. Содержит экстракт клубники, который помогает сохранить кожу гладкой и эластичной.",
    },
    {
        "page": 0,
        "crop": (704, 520, 874, 802),
        "slug": "body-wax-strips-green-tea-16",
        "name": "Воск для депиляции тела Lady Caramel Зеленый чай, 16 шт",
        "category": "depilation",
        "volume": "16 шт",
        "barcode": "4823015923210",
        "purpose": "Восковые полоски для депиляции тела.",
        "description": "Кожа остается гладкой и шелковистой. Эластичная основа воска позволяет полоскам идеально приспособиться к формам тела. Экстракт зеленого чая обладает антиоксидантными свойствами, тонизирует, устраняет покраснение и успокаивает кожу.",
    },
    {
        "page": 0,
        "crop": (52, 918, 212, 1192),
        "slug": "bikini-wax-strips-vanilla-12",
        "name": "Воск для депиляции зоны бикини Lady Caramel Ванильный, 12 шт",
        "category": "depilation",
        "volume": "12 шт",
        "barcode": "4823015923203",
        "purpose": "Восковые полоски для зоны бикини.",
        "description": "Позаботится о чистоте и гладкости кожи в самых чувствительных местах. Эластичная основа воска позволяет полоскам идеально прилегать к коже, повторяя формы тела. Содержит экстракт ванили с антистрессовыми и успокаивающими свойствами.",
    },
    {
        "page": 0,
        "crop": (290, 922, 445, 1195),
        "slug": "face-wax-strips-argan-12",
        "name": "Воск для депиляции лица Lady Caramel Аргана, 12 шт",
        "category": "depilation",
        "volume": "12 шт",
        "barcode": "4823015939723",
        "purpose": "Восковые полоски для лица.",
        "description": "Мягко прилегающая основа воска позволяет полоскам идеально приспособиться к формам лица. Применение воска задерживает рост новых волос, снижает жесткость отрастающих волосков и увеличивает период между эпиляциями. Содержит масло марокканской арганы.",
    },
    {
        "page": 0,
        "crop": (503, 918, 660, 1195),
        "slug": "face-wax-strips-vanilla-12",
        "name": "Воск для депиляции лица Lady Caramel Ванильный, 12 шт",
        "category": "depilation",
        "volume": "12 шт",
        "barcode": "4823015920196",
        "purpose": "Восковые полоски для лица.",
        "description": "Для чувствительной кожи. Мягко прилегающая основа воска повторяет формы лица, а кожа надолго остается гладкой и нежной. Содержит экстракт ванили с антистрессовыми и успокаивающими свойствами.",
    },
    {
        "page": 1,
        "crop": (62, 94, 188, 348),
        "slug": "depilatory-cream-bikini-underarms-100",
        "name": "Крем для депиляции Lady Caramel для зоны бикини и подмышек, 100 мл",
        "category": "depilation",
        "volume": "100 мл",
        "barcode": "4823015920257",
        "purpose": "Деликатная кремовая депиляция зоны бикини и подмышек.",
        "description": "Крем предназначен для чувствительных участков кожи с маслами какао и карите. Позволяет нежно провести депиляцию в области бикини и подмышек. После депиляции кожа надолго остается мягкой и гладкой.",
    },
    {
        "page": 1,
        "crop": (335, 94, 471, 348),
        "slug": "depilatory-cream-shower-economy-100",
        "name": "Крем для депиляции Lady Caramel в душе экономит время на 100%, 100 мл",
        "category": "depilation",
        "volume": "100 мл",
        "barcode": "4823015919947",
        "purpose": "Крем для депиляции во время душа.",
        "description": "Инновационное средство экономит время, отведенное для избавления от нежелательных волос. Вы принимаете душ, а крем работает. Содержит масла марокканской арганы и виноградных косточек.",
    },
    {
        "page": 1,
        "crop": (675, 122, 816, 360),
        "slug": "face-depilatory-cream-moisturizing-50",
        "name": "Крем для депиляции лица Lady Caramel увлажняющий, 50 мл",
        "category": "depilation",
        "volume": "50 мл",
        "barcode": "4823015935688",
        "purpose": "Крем для деликатной депиляции лица.",
        "description": "Быстро и деликатно удаляет нежелательные волосы на лице. После процедуры кожа выглядит идеально гладкой и нежной. Содержит масла марокканской арганы и миндаля, экстракт ванили.",
    },
    {
        "page": 1,
        "crop": (63, 468, 188, 728),
        "slug": "depilatory-cream-sensitive-ingrown-100",
        "name": "Крем для депиляции Lady Caramel для чувствительной кожи против врастания волос, 100 мл",
        "category": "depilation",
        "volume": "100 мл",
        "barcode": "4823015920271",
        "purpose": "Крем для чувствительной кожи и профилактики врастания волос.",
        "description": "Деликатно удаляет волосы. Папаин в составе способствует предупреждению врастания волос. Содержит масла марокканской арганы, какао, карите и авокадо. Успокаивает раздражение и покраснение.",
    },
    {
        "page": 1,
        "crop": (335, 468, 471, 728),
        "slug": "depilatory-cream-strong-100-result-100",
        "name": "Крем для депиляции Lady Caramel 100% удаление волос, 100 мл",
        "category": "depilation",
        "volume": "100 мл",
        "barcode": "4823015920264",
        "purpose": "Сильнодействующий крем для депиляции.",
        "description": "Удаляет даже короткие волоски на 100% и придает коже шелковистость. Новые волоски вырастают с мягкими округлыми краями. Содержит масла марокканской арганы, какао, авокадо и ухаживающие компоненты.",
    },
    {
        "page": 1,
        "crop": (58, 883, 194, 1198),
        "slug": "depilatory-cream-universal-12in1-200",
        "name": "Крем для депиляции Lady Caramel 12 в 1 универсальный, 200 мл",
        "category": "depilation",
        "volume": "200 мл",
        "barcode": "4823015934018",
        "purpose": "Универсальный крем для депиляции.",
        "description": "Легко удаляет волосы, мягко воздействует и не повреждает кожу. Формула с маслом марокканской арганы и ши, экстрактами мяты и корня нарцисса, витамином E и мочевиной помогает сделать депиляцию комфортной.",
    },
    {
        "page": 1,
        "crop": (486, 884, 688, 1204),
        "slug": "post-depilatory-cream-moisturizing-150",
        "name": "Крем после депиляции Lady Caramel увлажняющий, 150 мл",
        "category": "depilation",
        "volume": "150 мл",
        "barcode": "4823015920233",
        "purpose": "Уход после депиляции.",
        "description": "Последующий уход, экспресс-средство, завершающее процедуру депиляции. Успокаивает кожу, устраняет сухость и шелушение, помогает замедлить рост волос. Содержит масла марокканской арганы, карите, риса, экстракты морских водорослей и нарцисса, пантенол и папаин.",
    },
]


def build_lady_products() -> list[dict]:
    pdf = fitz.open(LADY_PDF)
    products: list[dict] = []
    for index, spec in enumerate(LADY_SPECS, 1):
        rect = fitz.Rect(*(value / 1.6 for value in spec["crop"]))
        pix = pdf[spec["page"]].get_pixmap(matrix=fitz.Matrix(3, 3), clip=rect, alpha=False)
        image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        product_id = f"lady-caramel-{spec['slug']}"
        save_webp(image, LADY_IMAGE_DIR / f"{product_id}.webp", max_size=800)
        products.append(
            {
                "id": product_id,
                "sku": f"LC-{index:03d}",
                "brand": "Lady Caramel",
                "brandSlug": "lady-caramel",
                "line": "Depilation",
                "lineRu": "Depilation",
                "lineUz": "Depilation",
                "category": spec["category"],
                "categoryLabel": CATEGORY_LABELS[spec["category"]],
                "name": spec["name"],
                "nameRu": spec["name"],
                "nameUz": spec["name"],
                "titleRu": spec["name"],
                "titleUz": spec["name"],
                "descriptionRu": spec["description"],
                "descriptionUz": spec["description"],
                "purpose": spec["purpose"],
                "purposeRu": spec["purpose"],
                "purposeUz": spec["purpose"],
                "volume": spec["volume"],
                "barcode": spec["barcode"],
                "source": "каталог_Lady-Caramel (2).pdf",
                "href": UZUM_URL,
                "image": f"products/lady-caramel-clean/{product_id}.webp",
                "uzumImage": "",
                "price": None,
                "uzumCardPrice": None,
                "sortOrder": 500 + index,
            }
        )
    return products


DOCTOR_SKIP_BOXES = {
    (0, 435, 636),
    (1, 445, 233),
    (3, 484, 110),
    (3, 445, 360),
    (9, 433, 704),
    (10, 429, 323),
}

DOCTOR_MANUAL_TITLES = {
    (0, 63, 405): "Шампунь The Doctor Тройная сила, 1000 мл",
    (0, 244, 406): "Шампунь The Doctor Укрепляющий, 1000 мл",
    (0, 426, 403): "Шампунь The Doctor Блеск и сила, 1000 мл",
    (0, 64, 644): "Шампунь The Doctor Стимулирующий, 1000 мл",
    (0, 245, 643): "Шампунь The Doctor Кефирный, 1000 мл",
    (1, 73, 85): "Бальзам-маска The Doctor Тройная сила, 500 мл",
    (1, 248, 86): "Бальзам-маска The Doctor Укрепляющая, 500 мл",
    (1, 431, 84): "Бальзам-маска The Doctor Блеск и сила, 500 мл",
    (1, 72, 254): "Бальзам-маска The Doctor Стимулирующая, 500 мл",
    (1, 249, 254): "Бальзам-маска The Doctor Кефирная, 500 мл",
    (1, 71, 493): "Репейное масло The Doctor против выпадения волос, 100 мл",
    (1, 214, 494): "Репейное масло The Doctor с красным перцем, 100 мл",
    (1, 343, 494): "Репейное масло The Doctor с чайным деревом и розмарином, 100 мл",
    (1, 479, 494): "Репейное масло The Doctor с луково-чесночным комплексом, 100 мл",
    (2, 67, 91): "Интимное жидкое мыло The Doctor Освежающее, 200 мл",
    (2, 65, 351): "Интимное жидкое мыло The Doctor Нежный уход, 200 мл",
    (2, 62, 603): "Интимное жидкое мыло The Doctor Успокаивающее, 200 мл",
}

DOCTOR_DESC_HINT = {
    "Шампунь": "Средство для бережного очищения волос и кожи головы с растительными компонентами.",
    "Бальзам-маска": "Средство для ухода за длиной волос, укрепления и восстановления после мытья.",
    "Репейное масло": "Масло для укрепления волос и ухода за кожей головы.",
}


def page_category(page_index: int, y: int) -> str:
    page = page_index + 1
    if page == 1:
        return "shampoo"
    if page == 2:
        return "hair-care"
    if page == 3:
        return "intimate-hygiene"
    if page in (4, 5):
        return "face-care" if y < 620 else "wellness"
    if page == 6:
        return "creams"
    if page == 7:
        return "oral-care" if y < 470 else "lip-care"
    if page == 8:
        return "creams" if y > 610 else "hand-care"
    if page == 9:
        return "foot-care" if y > 600 else "hand-care"
    if page == 10:
        return "bath"
    if page == 11:
        return "wellness"
    if page == 12:
        return "essential-oils"
    return "body-care"


def infer_volume(page_index: int, y: int) -> str:
    page = page_index + 1
    if page == 1:
        return "1000 мл"
    if page == 2:
        return "500 мл" if y < 430 else "100 мл"
    if page == 3:
        return "200 мл"
    if page == 4:
        return "42 мл" if y < 610 else "75 мл"
    if page == 5:
        return "30 мл"
    if page == 6:
        return "250 мл"
    if page == 7:
        return "300 мл" if y < 470 else "3,6 г"
    if page == 8:
        return "42 мл" if y < 610 else "250 мл"
    if page == 9:
        return "42 мл" if y < 400 else "250 мл"
    if page == 10:
        return "500 г"
    if page == 11:
        return "75 мл" if y > 560 else "42 мл"
    if page == 12:
        return "10 мл"
    return ""


def text_blocks(page_dict: dict) -> list[dict]:
    blocks: list[dict] = []
    for block in page_dict["blocks"]:
        if block.get("type") != 0:
            continue
        text = " ".join(span["text"] for line in block.get("lines", []) for span in line.get("spans", []))
        text = clean_text(text)
        lowered = text.lower()
        if len(text) < 24 or text.isdigit():
            continue
        if "общий каталог" in lowered or lowered.startswith("w -") or " w - " in lowered:
            continue
        if lowered.startswith(("30 мл", "42 мл", "75 мл", "100 мл", "200 мл", "250 мл", "300 мл", "500 мл", "1000 мл", "10 мл")):
            continue
        if text.upper() in {"УХОД ЗА ВОЛОСАМИ", "УХОД ЗА ЛИЦОМ", "МЫЛО"}:
            continue
        blocks.append({"bbox": block["bbox"], "text": text})
    return blocks


def nearest_barcode(blocks: list[dict], cx: float, cy: float) -> str:
    best: tuple[float, str] | None = None
    for block in blocks:
        matches = re.findall(r"\b\d{13}\b", block["text"])
        if not matches:
            continue
        x0, y0, x1, y1 = block["bbox"]
        score = abs(((x0 + x1) / 2) - cx) + abs(((y0 + y1) / 2) - cy)
        if best is None or score < best[0]:
            best = (score, matches[0])
    return best[1] if best else ""


def associate_text(blocks: list[dict], bbox: tuple[float, float, float, float]) -> str:
    x0, y0, x1, y1 = bbox
    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
    best: tuple[float, str] | None = None
    for block in blocks:
        text = block["text"]
        if len(text) < 35 or " w - " in text.lower():
            continue
        tx0, ty0, tx1, ty1 = block["bbox"]
        tcx = (tx0 + tx1) / 2
        tcy = (ty0 + ty1) / 2
        relation = 0
        if ty0 >= y0 - 15 and ty0 <= y1 + 85 and abs(tcx - cx) < 150:
            relation -= 140
        if tx0 >= x0 - 10 and tx0 <= x1 + 175 and abs(tcy - cy) < 135:
            relation -= 90
        if ty0 >= y1 - 20 and abs(tcx - cx) < 110:
            relation -= 120
        score = relation + abs(tcx - cx) * 1.05 + abs(tcy - cy) * 0.85
        if best is None or score < best[0]:
            best = (score, text)
    return best[1] if best else ""


def trim_image(image: Image.Image) -> Image.Image:
    if image.mode != "RGBA":
        image = image.convert("RGBA")
    bbox = image.getbbox()
    return image.crop(bbox) if bbox else image


def make_title(description: str, category: str, volume: str, number: int) -> str:
    description = clean_text(re.sub(r"\b\d{13}\b", "", description))
    base = " ".join(description.split()[:7]).strip(" ,.;:") or f"позиция {number}"
    if base.lower().startswith(("содержит", "применяется", "эффективно", "используется", "полезно")):
        base = f"позиция {number}"
    prefixes = {
        "shampoo": "Шампунь The Doctor",
        "hair-care": "Средство для волос The Doctor",
        "intimate-hygiene": "Интимное жидкое мыло The Doctor",
        "face-care": "Крем для лица The Doctor",
        "creams": "Крем The Doctor",
        "oral-care": "Средство для полости рта The Doctor",
        "lip-care": "Бальзам для губ The Doctor",
        "hand-care": "Крем для рук The Doctor",
        "foot-care": "Средство для ног The Doctor",
        "bath": "Соль для ванн The Doctor",
        "wellness": "Лечебно-профилактическое средство The Doctor",
        "essential-oils": "Эфирное масло The Doctor",
    }
    return f"{prefixes.get(category, 'Средство The Doctor')} {base}, {volume}".replace(" ,", ",")


def build_doctor_products() -> list[dict]:
    pdf = fitz.open(DOCTOR_PDF)
    products: list[dict] = []
    for page_index, page in enumerate(pdf):
        page_dict = page.get_text("dict")
        blocks = text_blocks(page_dict)
        for block in page_dict["blocks"]:
            if block.get("type") != 1:
                continue
            x0, y0, x1, y1 = block["bbox"]
            width = x1 - x0
            height = y1 - y0
            rx = round(x0)
            ry = round(y0)
            if not (18 <= width <= 230 and 35 <= height <= 300):
                continue
            if (page_index, rx, ry) in DOCTOR_SKIP_BOXES:
                continue
            if width < 22 or height < 60:
                continue

            category = page_category(page_index, ry)
            volume = infer_volume(page_index, ry)
            description = associate_text(blocks, (x0, y0, x1, y1))
            description = re.sub(r"\b\d{13}\b", "", description).strip() or CATEGORY_PURPOSE[category]
            key = (page_index, rx, ry)
            if key in DOCTOR_MANUAL_TITLES:
                name = DOCTOR_MANUAL_TITLES[key]
                if len(description) < 50 or description.startswith("Домашний доктор"):
                    description = next((value for marker, value in DOCTOR_DESC_HINT.items() if name.startswith(marker)), CATEGORY_PURPOSE[category])
            else:
                name = make_title(description, category, volume, len(products) + 1)

            base_id = f"the-doctor-{slugify(name)}"
            product_id = base_id
            counter = 2
            while any(product["id"] == product_id for product in products):
                product_id = f"{base_id}-{counter}"
                counter += 1

            try:
                image = trim_image(Image.open(BytesIO(block["image"])))
            except Exception:
                pix = page.get_pixmap(matrix=fitz.Matrix(3, 3), clip=fitz.Rect(x0, y0, x1, y1), alpha=True)
                image = Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)
            save_webp(image, DOCTOR_IMAGE_DIR / f"{product_id}.webp")

            barcode = nearest_barcode(blocks, (x0 + x1) / 2, (y0 + y1) / 2)
            products.append(
                {
                    "id": product_id,
                    "sku": f"TD-{len(products) + 1:03d}",
                    "brand": "The Doctor",
                    "brandSlug": "the-doctor",
                    "line": "Домашний доктор",
                    "lineRu": "Домашний доктор",
                    "lineUz": "Uy tabibi",
                    "category": category,
                    "categoryLabel": CATEGORY_LABELS[category],
                    "name": name,
                    "nameRu": name,
                    "nameUz": name,
                    "titleRu": name,
                    "titleUz": name,
                    "descriptionRu": description,
                    "descriptionUz": description,
                    "purpose": CATEGORY_PURPOSE[category],
                    "purposeRu": CATEGORY_PURPOSE[category],
                    "purposeUz": CATEGORY_PURPOSE[category],
                    "volume": volume,
                    "barcode": barcode,
                    "source": "Домашний доктор общий — FINAL — копия.pdf",
                    "href": UZUM_URL,
                    "image": f"products/the-doctor-clean/{product_id}.webp",
                    "uzumImage": "",
                    "price": None,
                    "uzumCardPrice": None,
                    "sortOrder": 650 + len(products),
                }
            )
    return products


def write_generated(path: Path, export_name: str, source: str, image_folder: str, products: list[dict]) -> None:
    content = (
        f'// Generated from "{source}".\n'
        f"// Product images are stored in public/products/{image_folder}/.\n\n"
        f"export const {export_name} = "
        + json.dumps(products, ensure_ascii=False, indent=2)
        + ";\n"
    )
    path.write_text(content, encoding="utf-8")


def main() -> None:
    prepare_dirs()
    lady_products = build_lady_products()
    doctor_products = build_doctor_products()
    write_generated(
        ROOT / "src" / "data" / "ladyCaramelCatalog.generated.js",
        "ladyCaramelCatalogProducts",
        "каталог_Lady-Caramel (2).pdf",
        "lady-caramel-clean",
        lady_products,
    )
    write_generated(
        ROOT / "src" / "data" / "theDoctorCatalog.generated.js",
        "theDoctorCatalogProducts",
        "Домашний доктор общий — FINAL — копия.pdf",
        "the-doctor-clean",
        doctor_products,
    )
    print(json.dumps({"lady": len(lady_products), "doctor": len(doctor_products)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
