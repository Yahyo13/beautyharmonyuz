import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
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
import {
  brands,
  elfaFacts,
  getBrandCopy,
  languageOptions,
  sources,
  ui,
  uzumShopUrl,
} from "./data/siteContent";
import {
  catalogCategories,
  catalogProducts,
  formatPrice,
  getCategoryLabel,
  getProductBrand,
  getProductDescription,
  getProductTheme,
  getProductTitle,
  inferProductPurpose,
} from "./data/catalogData";
import { useHashRoute, useRevealAnimation } from "./hooks/usePageEffects";

const heroImageUrl = `${import.meta.env.BASE_URL}beauty-harmony-hero.png`;
const logoUrl = `${import.meta.env.BASE_URL}BH_Logo.png`;
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

const LocaleContext = React.createContext({
  language: "ru",
  setLanguage: () => {},
  t: {},
});

function useLocale() {
  return React.useContext(LocaleContext);
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
          <span><img src={logoUrl} alt="" /></span>
          <strong>Beauty Harmony</strong>
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
  const [requestPendingDelete, setRequestPendingDelete] = useState(null);

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

  useEffect(() => {
    if (!requestPendingDelete || deletingRequestId) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setRequestPendingDelete(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deletingRequestId, requestPendingDelete]);

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
    setRequestPendingDelete(null);
  };

  const openDeleteModal = (request) => {
    if (!request.id || deletingRequestId) return;
    setRequestPendingDelete(request);
  };

  const closeDeleteModal = () => {
    if (!deletingRequestId) setRequestPendingDelete(null);
  };

  const confirmDeleteRequest = async () => {
    if (!requestPendingDelete?.id || deletingRequestId) return;

    setDeletingRequestId(requestPendingDelete.id);
    setLoadStatus("");

    try {
      await deletePartnerRequest(requestPendingDelete.id);
      setRequests((current) => current.filter((item) => item.id !== requestPendingDelete.id));
      setRequestPendingDelete(null);
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
          <h2>Вход в админ панель</h2>
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
                    onClick={() => openDeleteModal(request)}
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

      {requestPendingDelete && (
        <div className="admin-delete-modal" role="dialog" aria-modal="true" aria-labelledby="admin-delete-title">
          <button
            className="admin-delete-modal__backdrop"
            type="button"
            aria-label="Отмена"
            onClick={closeDeleteModal}
            disabled={Boolean(deletingRequestId)}
          />
          <article className="admin-delete-modal__card">
            <button
              className="admin-delete-modal__close"
              type="button"
              aria-label="Отмена"
              onClick={closeDeleteModal}
              disabled={Boolean(deletingRequestId)}
            >
              <X size={18} aria-hidden="true" />
            </button>
            <div className="admin-delete-modal__icon">
              <Trash2 size={28} aria-hidden="true" />
            </div>
            <h2 id="admin-delete-title">Подтвердить удаление</h2>
            <p>
              Вы точно хотите удалить заявку
              {" "}
              <strong>{getRequestField(requestPendingDelete, ["name"]) || `#${requestPendingDelete.id}`}</strong>
              ? Это действие нельзя отменить.
            </p>
            <dl>
              <div>
                <dt>Телефон</dt>
                <dd>{getRequestField(requestPendingDelete, ["phoneNumber", "phone", "phone number"]) || "Не указан"}</dd>
              </div>
              <div>
                <dt>Компания</dt>
                <dd>{getRequestField(requestPendingDelete, ["company"]) || "Не указана"}</dd>
              </div>
            </dl>
            <div className="admin-delete-modal__actions">
              <button className="admin-delete-modal__cancel" type="button" onClick={closeDeleteModal} disabled={Boolean(deletingRequestId)}>
                Отмена
              </button>
              <button className="admin-delete-modal__confirm" type="button" onClick={confirmDeleteRequest} disabled={Boolean(deletingRequestId)}>
                {deletingRequestId ? "Удаляем..." : "Подтвердить"}
              </button>
            </div>
          </article>
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
