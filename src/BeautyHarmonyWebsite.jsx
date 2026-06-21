import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Handshake,
  Heart,
  HeartHandshake,
  Instagram,
  Leaf,
  Lock,
  LogOut,
  Mail,
  Menu,
  Minus,
  Moon,
  PackageCheck,
  PackagePlus,
  Palette,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Store,
  Sun,
  Tags,
  Trash2,
  Truck,
  UserCheck,
  UserRound,
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
  catalogApiUrl,
  catalogCategories,
  catalogFallbackSource,
  catalogProducts,
  extractApiProducts,
  fallbackCatalogProducts,
  formatPrice,
  getCategoryLabel,
  getProductBrand,
  getProductDescription,
  getProductPurpose,
  getProductTheme,
  getProductTitle,
  getProductVolume,
  isVisibleCatalogProduct,
  normalizeCatalogProduct,
} from "./data/catalogData";
import { fetchFirebaseCatalogProducts, saveFirebaseCatalogProduct } from "./data/firebaseCatalogApi";
import {
  createCustomerOrder,
  fetchCustomerOrders,
  getOrderStatusLabel,
  orderStatuses,
  updateCustomerOrderStatus,
} from "./data/customerOrdersApi";
import {
  completeCustomerEmailLinkSignIn,
  getCustomerProfile,
  hasCustomerAuthConfig,
  isCustomerEmailSignInLink,
  isCustomerEmailValid,
  isCustomerProfileComplete,
  saveCustomerCollections,
  saveCustomerProfile,
  sendCustomerEmailLink,
  signOutCustomer,
  subscribeCustomerAuth,
} from "./data/customerAccountApi";
import { useHashRoute, useRevealAnimation } from "./hooks/usePageEffects";

/*
  BeautyHarmonyWebsite.jsx - главный файл сайта.

  Что здесь лежит:
  1. Общие настройки сайта: картинки, логотип, ключ капчи.
  2. Общие маленькие компоненты: кнопка, капча, шапка сайта.
  3. Блоки брендов и каталога.
  4. Страницы: главная, каталог, бренд, B2B, админка, 404.
  5. Роутер внизу файла: решает, какую страницу показать по адресу #/...

  Большие данные не здесь:
  - src/data/siteContent.js: тексты сайта, переводы, бренды.
  - src/data/catalogData.js: товары, категории, логика каталога.
  - src/data/partnerRequestsApi.js: запросы B2B и админки к API.
*/

// Общие настройки и env-переменные.
const heroImageUrl = `${import.meta.env.BASE_URL}beauty-harmony-hero.png`;
const logoUrl = `${import.meta.env.BASE_URL}beauty-harmony-logo.png`;
const instagramUrl = "https://www.instagram.com/dr.sante_uz/";
const telegramBotUrl = "https://t.me/beautyharmonyuz_bot";
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
const defaultPartnerBrands = "Dr.Sante, Fresh Juice, Green Pharmacy";
const favoritesStorageKey = "beauty-harmony-favorites";
const cartStorageKey = "beauty-harmony-cart";

function readStoredArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function cleanFavoriteIds(value) {
  return [...new Set((Array.isArray(value) ? value : []).map(String).filter(Boolean))];
}

function cleanCartItems(value) {
  if (!Array.isArray(value)) return [];
  const byProductId = new Map();

  value.forEach((item) => {
    const productId = String(item?.productId || item?.id || "").trim();
    if (!productId) return;
    const quantity = Math.max(1, Math.min(99, Number.parseInt(item.quantity, 10) || 1));
    byProductId.set(productId, Math.min(99, (byProductId.get(productId) || 0) + quantity));
  });

  return [...byProductId].map(([productId, quantity]) => ({ productId, quantity }));
}

function mergeCartItems(...groups) {
  return cleanCartItems(groups.flatMap((group) => (Array.isArray(group) ? group : [])));
}

function getCartCount(cartItems) {
  return cleanCartItems(cartItems).reduce((total, item) => total + item.quantity, 0);
}

function getCustomerDisplayName(profile) {
  return profile?.displayName || `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();
}

// Контекст языка. Через него любой компонент получает language и t.
const LocaleContext = React.createContext({
  language: "ru",
  setLanguage: () => { },
  t: {},
});

const AppearanceContext = React.createContext({
  colorMode: "light",
  setColorMode: () => { },
});

const FavoritesContext = React.createContext({
  favoriteIds: [],
  isFavorite: () => false,
  toggleFavorite: () => { },
});

const CartContext = React.createContext({
  cartItems: [],
  cartCount: 0,
  addToCart: () => { },
  removeFromCart: () => { },
  updateCartQuantity: () => { },
  clearCart: () => { },
});

const CustomerContext = React.createContext({
  customerUser: null,
  customerProfile: null,
  isCustomerReady: false,
  isCustomerLoading: false,
  customerError: "",
  sendCustomerSignInLink: async () => null,
  updateCustomerProfile: async () => null,
  logoutCustomer: async () => {},
});

function useLocale() {
  return React.useContext(LocaleContext);
}

function useAppearance() {
  return React.useContext(AppearanceContext);
}

function useFavorites() {
  return React.useContext(FavoritesContext);
}

function useCart() {
  return React.useContext(CartContext);
}

function useCustomer() {
  return React.useContext(CustomerContext);
}

// Общая кнопка сайта. Используется как <a>, если передан href, и как <button> без href.
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

// Cloudflare Turnstile. Компонент получает token и отдаёт его B2B-форме через onVerify.
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

// === Каркас сайта ===
// Шапка, меню, переключатель языка и место, куда подставляется текущая страница.
function Shell({ route, children }) {
  const { language, setLanguage, t } = useLocale();
  const { colorMode, setColorMode } = useAppearance();
  const { favoriteIds } = useFavorites();
  const { cartCount } = useCart();
  const { customerUser, customerProfile, isCustomerReady } = useCustomer();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCustomerPanelOpen, setIsCustomerPanelOpen] = useState(false);
  const isDarkMode = colorMode === "dark";
  const customerName = getCustomerDisplayName(customerProfile);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [route]);

  useEffect(() => {
    if (isCustomerReady && customerUser && customerProfile && !isCustomerProfileComplete(customerProfile)) {
      setIsCustomerPanelOpen(true);
    }
  }, [customerProfile, customerUser, isCustomerReady]);

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
          <img className="brand-mark__logo" src={logoUrl} alt="Beauty Harmony" />
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
          <a className={route === "/about" ? "is-active" : ""} href="#/about" onClick={closeMenu}>
            {t.nav.about}
          </a>
          <a className={`nav-favorites-link${route === "/favorites" ? " is-active" : ""}`} href="#/favorites" onClick={closeMenu}>
            <Heart size={16} aria-hidden="true" />
            <span>{t.nav.favorites}</span>
            {favoriteIds.length > 0 && <b>{favoriteIds.length}</b>}
          </a>
          <a className={route === "/b2b" ? "is-active" : ""} href="#/b2b" onClick={closeMenu}>
            {t.nav.b2b}
          </a>
        </div>

        <label className="language-select" aria-label={t.language}>
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languageOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          className={`theme-toggle${isDarkMode ? " is-dark" : ""}`}
          type="button"
          aria-label={isDarkMode ? t.theme.switchToLight : t.theme.switchToDark}
          title={isDarkMode ? t.theme.switchToLight : t.theme.switchToDark}
          onClick={() => setColorMode(isDarkMode ? "light" : "dark")}
        >
          <span className="theme-toggle__icon" aria-hidden="true">
            <Moon className="theme-toggle__moon" size={18} />
            <Sun className="theme-toggle__sun" size={18} />
          </span>
        </button>

        <a className="cart-top-button" href="#/cart" aria-label={t.cart.open} onClick={closeMenu}>
          <ShoppingCart size={18} aria-hidden="true" />
          {cartCount > 0 && <b>{cartCount}</b>}
        </a>

        <button className="profile-top-button" type="button" onClick={() => setIsCustomerPanelOpen(true)}>
          <UserRound size={17} aria-hidden="true" />
          <span>{customerUser ? customerName || t.common.profile : t.common.signIn}</span>
        </button>

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
      <CookieNotice />
      <CustomerPanel isOpen={isCustomerPanelOpen} onClose={() => setIsCustomerPanelOpen(false)} />
    </main>
  );
}

function CookieNotice() {
  const { t } = useLocale();
  const [isVisible, setIsVisible] = useState(() => localStorage.getItem("beauty-harmony-cookies-ok") !== "yes");

  const acceptCookies = () => {
    localStorage.setItem("beauty-harmony-cookies-ok", "yes");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className="cookie-notice" aria-live="polite">
      <div>
        <strong>{t.cookies.title}</strong>
        <p>{t.cookies.text}</p>
      </div>
      <button type="button" onClick={acceptCookies}>
        {t.cookies.accept}
      </button>
    </aside>
  );
}

function getCustomerAuthErrorMessage(error, language) {
  const code = String(error?.code || "").trim();
  const message = String(error?.message || "").trim();
  const details = code || message;

  if (language === "uz") {
    if (details.includes("FIREBASE_NOT_CONFIGURED")) return "Firebase sozlamalari saytga ulanmagan.";
    if (details.includes("INVALID_EMAIL") || details.includes("invalid-email")) return "Email manzil noto'g'ri yozilgan.";
    if (details.includes("EMAIL_LINK_EMAIL_MISSING")) return "Havola boshqa brauzerda ochilgan. Qayta email kiriting va yangi havola oling.";
    if (details.includes("EMAIL_LINK_MISSING")) return "Kirish havolasi topilmadi yoki eskirgan.";
    if (details.includes("expired-action-code") || details.includes("invalid-action-code")) return "Email havola eskirgan. Yangi havola oling.";
    if (details.includes("too-many-requests")) return "Juda ko'p urinish bo'ldi. Keyinroq urinib ko'ring.";
    if (details.includes("unauthorized-domain") || details.includes("app-not-authorized")) return "Bu domen Firebase Auth Authorized domains ro'yxatiga qo'shilmagan.";
    if (details.includes("operation-not-allowed")) return "Firebase ichida Email link sign-in yoqilmagan. Authentication > Sign-in method > Email/Password ichida Email link ni yoqing.";
    if (details.includes("network-request-failed")) return "Internet bilan ulanishda muammo bor.";
    return `Kirish amalga oshmadi. Firebase kodi: ${details || "noma'lum"}`;
  }

  if (details.includes("FIREBASE_NOT_CONFIGURED")) return "Firebase-настройки не подключены к сайту.";
  if (details.includes("INVALID_EMAIL") || details.includes("invalid-email")) return "Email указан в неверном формате.";
  if (details.includes("EMAIL_LINK_EMAIL_MISSING")) return "Ссылка открыта в другом браузере. Введите email заново и получите новую ссылку.";
  if (details.includes("EMAIL_LINK_MISSING")) return "Ссылка для входа не найдена или устарела.";
  if (details.includes("expired-action-code") || details.includes("invalid-action-code")) return "Email-ссылка устарела. Получите новую ссылку.";
  if (details.includes("too-many-requests")) return "Слишком много попыток. Попробуйте позже.";
  if (details.includes("unauthorized-domain") || details.includes("app-not-authorized")) return "Этот домен не добавлен в Firebase Auth Authorized domains.";
  if (details.includes("operation-not-allowed")) return "В Firebase не включен Email link sign-in. Откройте Authentication > Sign-in method > Email/Password и включите Email link.";
  if (details.includes("network-request-failed")) return "Проблема с интернет-соединением.";
  return `Не удалось войти. Код Firebase: ${details || "неизвестно"}`;
}

function CustomerPanel({ isOpen, onClose }) {
  const { language, t } = useLocale();
  const {
    customerUser,
    customerProfile,
    isCustomerReady,
    isCustomerLoading,
    sendCustomerSignInLink,
    updateCustomerProfile,
    logoutCustomer,
  } = useCustomer();
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [step, setStep] = useState("email");
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");
  const isProfileComplete = isCustomerProfileComplete(customerProfile);

  useEffect(() => {
    if (!isOpen) return;

    setErrorText("");
    setStatusText("");
    if (customerUser) {
      setStep(isProfileComplete ? "profile" : "details");
      setEmailAddress(customerUser.email || customerProfile?.email || "");
      setFirstName(customerProfile?.firstName || "");
      setLastName(customerProfile?.lastName || "");
    } else {
      setStep("email");
      setFirstName("");
      setLastName("");
    }
  }, [customerProfile, customerUser, isOpen, isProfileComplete]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isCustomerLoading) onClose();
  };

  async function handleSendLink(event) {
    event.preventDefault();
    setErrorText("");
    setStatusText("");

    if (!hasCustomerAuthConfig()) {
      setErrorText(t.auth.authUnavailable);
      return;
    }

    if (!isCustomerEmailValid(emailAddress)) {
      setErrorText(t.auth.invalidEmail);
      return;
    }

    try {
      await sendCustomerSignInLink(emailAddress, language);
      setStatusText(t.auth.linkSent);
    } catch (error) {
      setErrorText(getCustomerAuthErrorMessage(error, language));
    }
  }

  async function handleSaveProfile(event) {
    event.preventDefault();
    setErrorText("");
    setStatusText("");

    if (!firstName.trim() || !lastName.trim()) {
      setErrorText(t.auth.requiredName);
      return;
    }

    try {
      await updateCustomerProfile({ firstName, lastName });
      setStatusText(t.auth.oldUserText);
      setStep("profile");
    } catch (error) {
      setErrorText(getCustomerAuthErrorMessage(error, language));
    }
  }

  async function handleLogout() {
    setErrorText("");
    try {
      await logoutCustomer();
      setStep("email");
      setStatusText("");
      setEmailAddress("");
    } catch (error) {
      setErrorText(getCustomerAuthErrorMessage(error, language));
    }
  }

  return (
    <div className="customer-modal" role="dialog" aria-modal="true" aria-labelledby="customer-modal-title">
      <button className="customer-modal__backdrop" type="button" aria-label={t.auth.close} onClick={handleClose} />
      <article className="customer-modal__card">
        <button className="customer-modal__close" type="button" aria-label={t.auth.close} onClick={handleClose}>
          <X size={18} aria-hidden="true" />
        </button>

        <div className="customer-modal__icon">
          {customerUser ? <UserCheck size={27} aria-hidden="true" /> : <Mail size={27} aria-hidden="true" />}
        </div>
        <h2 id="customer-modal-title">{customerUser ? t.auth.profileTitle : t.auth.title}</h2>
        <p>{customerUser ? t.auth.oldUserText : t.auth.emailNotice}</p>

        {!isCustomerReady && <p className="form-status">{language === "uz" ? "Profil tekshirilmoqda..." : "Проверяем профиль..."}</p>}

        {!customerUser && step === "email" && (
          <form className="customer-form" onSubmit={handleSendLink}>
            <label>
              {t.auth.email}
              <input
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                placeholder={t.auth.emailPlaceholder}
                inputMode="email"
                autoComplete="email"
                required
              />
            </label>
            <AppButton type="submit" icon={Send} disabled={isCustomerLoading}>
              {isCustomerLoading ? t.auth.sending : t.auth.sendLink}
            </AppButton>
          </form>
        )}

        {false && (
          <form className="customer-form" onSubmit={handleConfirmCode}>
            <label>
              {t.auth.code}
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder={t.auth.codePlaceholder}
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            </label>
            <AppButton type="submit" icon={ShieldCheck} disabled={isCustomerLoading}>
              {isCustomerLoading ? t.auth.confirming : t.auth.confirmCode}
            </AppButton>
            <button className="text-button" type="button" onClick={() => setStep("phone")} disabled={isCustomerLoading}>
              {language === "uz" ? "Raqamni o'zgartirish" : "Изменить номер"}
            </button>
          </form>
        )}

        {customerUser && (step === "details" || step === "profile") && (
          <form className="customer-form" onSubmit={handleSaveProfile}>
            <div className="customer-profile-card">
              <span>{t.auth.signedInAs}</span>
              <strong>{customerUser.email || customerProfile?.email || emailAddress}</strong>
            </div>
            <div className="customer-form__grid">
              <label>
                {t.auth.firstName}
                <input value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" required />
              </label>
              <label>
                {t.auth.lastName}
                <input value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" required />
              </label>
            </div>
            <AppButton type="submit" icon={CheckCircle2} disabled={isCustomerLoading}>
              {isCustomerLoading ? t.auth.saving : t.auth.saveProfile}
            </AppButton>
            <button className="text-button danger" type="button" onClick={handleLogout} disabled={isCustomerLoading}>
              <LogOut size={16} aria-hidden="true" />
              {t.common.signOut}
            </button>
          </form>
        )}

        {statusText && <p className="form-status">{statusText}</p>}
        {errorText && <p className="form-status is-error">{errorText}</p>}
      </article>
    </div>
  );
}

// === Визуальная карточка бренда ===
// Небольшой декоративный mockup товара, который показывается на главной и страницах брендов.
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

// Карточка бренда в списке брендов.
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

// === Главная страница ===
// Первый экран, преимущества, превью каталога, бренды и B2B-блок.
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
              <strong>{brands.length}</strong>
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

// Короткое превью каталога на главной странице.
function CatalogPreview() {
  const { language, t } = useLocale();
  const previewProducts = [
    "dr-sante-keratin-shampoo-250",
    "dr-sante-burdock-oil-100",
    "dr-sante-peptide-day-50",
    "dr-sante-hand-coconut-75",
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
            {product.price && <b>{formatPrice(product.price, language)}</b>}
          </a>
        ))}
      </div>
    </section>
  );
}

// Страница/секция со всеми брендами.
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

// === Каталог ===
// Поиск, фильтр по категориям, сортировка и список товаров.
function normalizeCatalogMergeText(value = "") {
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
}

function getCatalogImageFileName(value = "") {
  const cleanValue = String(value).split("?")[0].split("#")[0];
  return normalizeCatalogMergeText(cleanValue.split("/").pop() || cleanValue);
}

function getCatalogTitleKeys(product) {
  return [product.nameRu, product.titleRu, product.name, product.title, product.uzumTitle]
    .map(normalizeCatalogMergeText)
    .filter(Boolean);
}

function addCatalogIndexEntry(map, key, index, product) {
  if (!key) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push({ index, product });
}

function takeUnusedCatalogMatch(map, keys, usedApiIndexes) {
  for (const key of keys) {
    const candidates = map.get(key) || [];
    const match = candidates.find((candidate) => !usedApiIndexes.has(candidate.index));
    if (match) return match;
  }
  return null;
}

function mergeCatalogProducts(apiProducts, localProducts) {
  if (apiProducts.length === 0) return localProducts;

  const byTitle = new Map();
  const byImage = new Map();
  const byBarcode = new Map();
  const byId = new Map();

  apiProducts.forEach((product, index) => {
    getCatalogTitleKeys(product).forEach((key) => addCatalogIndexEntry(byTitle, key, index, product));
    addCatalogIndexEntry(byImage, getCatalogImageFileName(product.image), index, product);
    addCatalogIndexEntry(byBarcode, normalizeCatalogMergeText(product.barcode), index, product);
    addCatalogIndexEntry(byId, normalizeCatalogMergeText(product.id), index, product);
  });

  const usedApiIndexes = new Set();
  const localIds = new Set(localProducts.map((product) => normalizeCatalogMergeText(product.id)).filter(Boolean));
  const localBarcodes = new Set(localProducts.map((product) => normalizeCatalogMergeText(product.barcode)).filter(Boolean));

  const mergedLocalProducts = localProducts.map((localProduct) => {
    const match =
      takeUnusedCatalogMatch(byTitle, getCatalogTitleKeys(localProduct), usedApiIndexes) ||
      takeUnusedCatalogMatch(byImage, [getCatalogImageFileName(localProduct.image)], usedApiIndexes) ||
      takeUnusedCatalogMatch(byBarcode, [normalizeCatalogMergeText(localProduct.barcode)], usedApiIndexes) ||
      takeUnusedCatalogMatch(byId, [normalizeCatalogMergeText(localProduct.id)], usedApiIndexes);

    if (!match) return localProduct;

    usedApiIndexes.add(match.index);
    const apiProduct = match.product;
    return {
      ...localProduct,
      ...apiProduct,
      href: apiProduct.href || localProduct.href,
      price: apiProduct.price ?? localProduct.price,
      uzumCardPrice: apiProduct.uzumCardPrice ?? localProduct.uzumCardPrice,
      image: apiProduct.image || localProduct.image,
    };
  });

  const extraApiProducts = apiProducts.filter((product, index) => {
    if (usedApiIndexes.has(index)) return false;
    const idKey = normalizeCatalogMergeText(product.id);
    const barcodeKey = normalizeCatalogMergeText(product.barcode);
    return !localIds.has(idKey) && !(barcodeKey && localBarcodes.has(barcodeKey));
  });

  return [...mergedLocalProducts, ...extraApiProducts];
}

async function loadCatalogFromMockApi() {
  const response = await fetch(catalogApiUrl, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Catalog API responded ${response.status}`);
  const payload = await response.json();
  return extractApiProducts(payload)
    .map(normalizeCatalogProduct)
    .filter((product) => (product.nameRu || product.name) && isVisibleCatalogProduct(product));
}

async function loadBestCatalogProducts() {
  try {
    const firebaseProducts = await fetchFirebaseCatalogProducts();
    const normalizedFirebaseProducts = firebaseProducts
      .map(normalizeCatalogProduct)
      .filter((product) => (product.nameRu || product.name) && isVisibleCatalogProduct(product));

    if (normalizedFirebaseProducts.length > 0) {
      return {
        products: mergeCatalogProducts(normalizedFirebaseProducts, fallbackCatalogProducts),
        source: "firebase",
      };
    }
  } catch (firebaseError) {
    console.warn("[Catalog] Firebase failed:", firebaseError?.code, firebaseError?.message);
  }

  try {
    const apiProducts = await loadCatalogFromMockApi();

    if (apiProducts.length > 0) {
      return {
        products: mergeCatalogProducts(apiProducts, fallbackCatalogProducts),
        source: "api",
      };
    }
  } catch (apiError) {
    console.warn("[Catalog] MockAPI failed:", apiError?.message);
  }

  return {
    products: fallbackCatalogProducts,
    source: "fallback",
  };
}

function CatalogPage() {
  const { language, t } = useLocale();
  const [catalogProducts, setCatalogProducts] = useState(fallbackCatalogProducts);
  const [catalogSource, setCatalogSource] = useState("fallback");
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    let isMounted = true;

    loadBestCatalogProducts().then(({ products, source }) => {
      if (!isMounted) return;
      setCatalogProducts(products);
      setCatalogSource(source);
    }).finally(() => {
      if (isMounted) setIsLoadingCatalog(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const productCountByBrand = useMemo(() => {
    return catalogProducts.reduce(
      (accumulator, product) => {
        const key = product.brandSlug || "unknown";
        accumulator[key] = (accumulator[key] || 0) + 1;
        accumulator.all += 1;
        return accumulator;
      },
      { all: 0 }
    );
  }, [catalogProducts]);

  const brandOptions = useMemo(() => {
    const options = new Map();

    catalogProducts.forEach((product) => {
      const key = product.brandSlug || "unknown";
      if (options.has(key)) return;
      const brand = getProductBrand(product);
      const label = brand ? getBrandCopy(brand, language).localName : product.brand || key;
      options.set(key, label);
    });

    return [...options.entries()].map(([value, label]) => ({ value, label }));
  }, [catalogProducts, language]);

  const productCountByCategory = useMemo(() => {
    return catalogProducts.reduce(
      (accumulator, product) => {
        accumulator[product.category] = (accumulator[product.category] || 0) + 1;
        accumulator.all += 1;
        return accumulator;
      },
      { all: 0 }
    );
  }, [catalogProducts]);

  const minCatalogPrice = useMemo(() => {
    const prices = catalogProducts.map((product) => product.price).filter(Boolean);
    return prices.length > 0 ? Math.min(...prices) : null;
  }, [catalogProducts]);

  const activeCategoryCount = useMemo(() => {
    return Object.keys(productCountByCategory).filter((key) => key !== "all" && productCountByCategory[key] > 0).length;
  }, [productCountByCategory]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const results = catalogProducts.filter((product) => {
      const matchesBrand = brandFilter === "all" || product.brandSlug === brandFilter;
      const matchesCategory = category === "all" || product.category === category;
      const searchableText = [
        product.name,
        product.nameRu,
        product.nameUz,
        product.uzumTitle,
        product.brand,
        product.line,
        product.lineUz,
        product.barcode,
        product.categoryLabel,
        getCategoryLabel(product.category, language),
        getProductPurpose(product, language),
        getProductDescription(product, language),
      ]
        .join(" ")
        .toLowerCase();

      return matchesBrand && matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });

    return [...results].sort((left, right) => {
      if (sort === "price-asc") return (left.price || Number.MAX_SAFE_INTEGER) - (right.price || Number.MAX_SAFE_INTEGER);
      if (sort === "price-desc") return (right.price || 0) - (left.price || 0);
      if (sort === "name") return getProductTitle(left, language).localeCompare(getProductTitle(right, language), language === "uz" ? "uz" : "ru");
      return catalogProducts.findIndex((product) => product.id === left.id) - catalogProducts.findIndex((product) => product.id === right.id);
    });
  }, [brandFilter, catalogProducts, category, query, sort, language]);

  const resetFilters = () => {
    setQuery("");
    setBrandFilter("all");
    setCategory("all");
    setSort("default");
  };

  const hasFilters = query || brandFilter !== "all" || category !== "all" || sort !== "default";
  const sourceNote =
    catalogSource === "firebase"
      ? language === "uz"
        ? "Katalog Firebase Firestore bazasidan yuklandi."
        : "Каталог загружен из Firebase Firestore."
      : catalogSource === "api"
      ? t.catalog.sourceNote
      : language === "uz"
        ? catalogFallbackSource.noteUz
        : catalogFallbackSource.noteRu;

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
            <strong>{formatPrice(minCatalogPrice, language)}</strong>
            <span>{t.catalog.minPrice}</span>
          </div>
          <div>
            <strong>{activeCategoryCount}</strong>
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
            {t.common.brand}
            <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
              <option value="all">
                {t.common.allBrands} ({productCountByBrand.all || 0})
              </option>
              {brandOptions.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label} ({productCountByBrand[item.value] || 0})
                </option>
              ))}
            </select>
          </label>

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
              {isLoadingCatalog ? (language === "uz" ? "API tekshirilmoqda" : "Проверяем API") : `${filteredProducts.length} ${language === "uz" ? "/" : "из"} ${catalogProducts.length}`}
            </span>
            <h2>{t.catalog.found}</h2>
          </div>
          <p>{sourceNote}</p>
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

function FavoriteButton({ productId, className = "" }) {
  const { t } = useLocale();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const favorite = isFavorite(productId);
  const label = favorite ? t.common.removeFavorite : t.common.addFavorite;

  useEffect(() => {
    if (!isAnimating) return undefined;
    const timeoutId = window.setTimeout(() => setIsAnimating(false), 900);
    return () => window.clearTimeout(timeoutId);
  }, [isAnimating]);

  function handleFavoriteClick(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(productId);
    setIsAnimating(false);
    window.requestAnimationFrame(() => setIsAnimating(true));
  }

  return (
    <button
      className={`favorite-button${favorite ? " is-favorite" : ""}${isAnimating ? " is-animating" : ""}${className ? ` ${className}` : ""}`}
      type="button"
      aria-label={label}
      aria-pressed={favorite}
      title={label}
      onClick={handleFavoriteClick}
    >
      <span className="favorite-button__logo" aria-hidden="true">
        <small>LTD</small>
        <b>BH</b>
      </span>
      <Heart className="favorite-button__heart" size={19} aria-hidden="true" />
    </button>
  );
}

function AddToCartButton({ product }) {
  const { t } = useLocale();
  const { cartItems, addToCart } = useCart();
  const isInCart = cartItems.some((item) => item.productId === product.id);

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product.id);
  }

  return (
    <AppButton onClick={handleAddToCart} icon={ShoppingCart}>
      {isInCart ? t.cart.added : t.cart.add}
    </AppButton>
  );
}

// Одна карточка товара внутри каталога.
function CatalogProductCard({ product }) {
  const { language, t } = useLocale();
  const [isFlipped, setIsFlipped] = useState(false);
  const brand = getProductBrand(product);
  const brandCopy = brand ? getBrandCopy(brand, language) : null;
  const productTitle = getProductTitle(product, language);
  const productDescription = getProductDescription(product, language);
  const productVolume = getProductVolume(product, language);
  const productBrand = brandCopy?.localName || product.brand;
  const flipHint = language === "uz" ? "Tavsifni ko'rish uchun bosing" : "Нажмите, чтобы увидеть описание";
  const backHint = language === "uz" ? "Kartaga qaytish uchun bosing" : "Нажмите, чтобы вернуться к карточке";

  function handleCardFlip(event) {
    if (event.target.closest("a, button, input, select, textarea")) return;
    setIsFlipped((current) => !current);
  }

  function handleCardKeyDown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("a, button, input, select, textarea")) return;
    event.preventDefault();
    setIsFlipped((current) => !current);
  }

  return (
    <article
      className={`product-card-site reveal is-visible ${isFlipped ? "is-flipped" : ""} ${getProductTheme(product)}`}
      onClick={handleCardFlip}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      aria-label={isFlipped ? backHint : flipHint}
    >
      <div className="product-card-site__inner">
        <div className="product-card-site__face product-card-site__face--front">
          <div className="product-card-site__image">
            <FavoriteButton productId={product.id} />
            <img src={product.image} alt={productTitle} loading="lazy" />
          </div>

          <div className="product-card-site__body">
            <div className="product-card-site__top">
              <span>{getCategoryLabel(product.category, language)}</span>
              <b>{productVolume}</b>
            </div>
            <h3>{productTitle}</h3>
            <div className="product-card-site__front-meta">
              <span>{productBrand}</span>
              <small>{flipHint}</small>
            </div>
          </div>

          <div className={`product-card-site__footer ${product.price ? "" : "no-price"}`}>
            {product.price && (
              <div>
                <span>{t.common.normalPrice}</span>
                <strong>{formatPrice(product.price, language)}</strong>
                {product.uzumCardPrice && product.uzumCardPrice < product.price && (
                  <em>Uzum karta: {formatPrice(product.uzumCardPrice, language)}</em>
                )}
              </div>
            )}
            <AddToCartButton product={product} />
          </div>
        </div>

        <div className="product-card-site__face product-card-site__face--back">
          <div className="product-card-site__body product-card-site__body--back">
            <div className="product-card-site__top">
              <span>{productBrand}</span>
              <b>{productVolume}</b>
            </div>
            <h3>{productTitle}</h3>
            <p className="product-card-site__description">{productDescription}</p>

            <dl className="product-card-site__details">
              <div>
                <dt>{t.common.brand}</dt>
                <dd>{productBrand}</dd>
              </div>
              <div>
                <dt>{t.common.purpose}</dt>
                <dd>{getProductPurpose(product, language)}</dd>
              </div>
            </dl>
          </div>

          <div className={`product-card-site__footer ${product.price ? "" : "no-price"}`}>
            {brand && (
              <a className="product-card-site__brand-link" href={`#/brand/${brand.slug}`}>
                {t.common.aboutBrand} <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}

// === Страница одного бренда ===
// Показывает описание бренда, факты, товары и похожие бренды.
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

function AboutCompanyPage() {
  const { language, t } = useLocale();
  const featuredBrands = brands.slice(0, 4).map((brand) => getBrandCopy(brand, language));

  return (
    <article className="about-company-page">
      <header className="about-company-hero reveal is-visible">
        <div>
          <span className="eyebrow">
            <Building2 size={17} aria-hidden="true" />
            {t.about.eyebrow}
          </span>
          <h1>{t.about.title}</h1>
          <p>{t.about.intro}</p>
          <div className="hero-actions">
            <AppButton href="#/catalog" icon={ShoppingBag}>
              {t.common.openCatalog}
            </AppButton>
            <AppButton href="#/b2b" variant="secondary" icon={Handshake}>
              {t.common.b2bRequest}
            </AppButton>
          </div>
        </div>

        <div className="about-company-hero__visual" aria-hidden="true">
          {featuredBrands.map((brand) => (
            <span className={brand.theme} key={brand.slug}>
              {brand.name}
            </span>
          ))}
        </div>
      </header>

      <section className="about-company-stats reveal">
        {t.about.stats.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="about-company-grid reveal">
        <article className="about-company-main">
          <span>{t.about.missionLabel}</span>
          <h2>{t.about.missionTitle}</h2>
          <p>{t.about.missionText}</p>
          <ul>
            {t.about.values.map((value) => (
              <li key={value}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </article>

        <aside className="about-company-side">
          <article>
            <Palette size={22} aria-hidden="true" />
            <h3>{t.about.portfolioTitle}</h3>
            <p>{t.about.portfolioText}</p>
          </article>
          <article>
            <PackageCheck size={22} aria-hidden="true" />
            <h3>{t.about.logisticsTitle}</h3>
            <p>{t.about.logisticsText}</p>
          </article>
        </aside>
      </section>

      <section className="about-company-brands reveal">
        <div className="section-heading compact">
          <span>{t.common.allBrands}</span>
          <h2>{t.home.assortmentTitle}</h2>
        </div>
        <div className="about-brand-strip">
          {featuredBrands.map((brand) => (
            <a className={`about-brand-chip ${brand.theme}`} href={`#/brand/${brand.slug}`} key={brand.slug}>
              <strong>{brand.name}</strong>
              <span>{brand.mood}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}

function FavoritesPage() {
  const { language, t } = useLocale();
  const { favoriteIds } = useFavorites();
  const [catalogProducts, setCatalogProducts] = useState(fallbackCatalogProducts);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadBestCatalogProducts().then(({ products }) => {
      if (isMounted) setCatalogProducts(products);
    }).finally(() => {
      if (isMounted) setIsLoadingCatalog(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const favoriteProducts = useMemo(() => {
    const productById = new Map(catalogProducts.map((product) => [product.id, product]));
    return favoriteIds.map((id) => productById.get(id)).filter(Boolean);
  }, [catalogProducts, favoriteIds]);

  return (
    <>
      <header className="favorites-hero">
        <div className="favorites-hero__copy reveal is-visible">
          <span className="eyebrow">
            <Heart size={17} aria-hidden="true" />
            {t.favorites.eyebrow}
          </span>
          <h1>{t.favorites.title}</h1>
          <div className="hero-actions">
            <AppButton href="#/catalog" icon={ShoppingBag}>
              {t.favorites.openCatalog}
            </AppButton>
          </div>
        </div>

        <div className="favorites-hero__stats reveal is-visible">
          <strong>{favoriteProducts.length}</strong>
          <span>{isLoadingCatalog ? t.favorites.loading : t.favorites.count}</span>
        </div>
      </header>

      <section className="favorites-page">
        {favoriteProducts.length > 0 ? (
          <div className="product-grid">
            {favoriteProducts.map((product) => (
              <CatalogProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty reveal is-visible">
            <Heart size={34} aria-hidden="true" />
            <h2>{t.favorites.emptyTitle}</h2>
            <p>{t.favorites.emptyText}</p>
            <AppButton href="#/catalog" icon={ShoppingBag}>
              {t.favorites.openCatalog}
            </AppButton>
          </div>
        )}
      </section>
    </>
  );
}

function CartPage() {
  const { language, t } = useLocale();
  const { customerUser, customerProfile } = useCustomer();
  const { cartItems, cartCount, removeFromCart, updateCartQuantity, clearCart } = useCart();
  const [catalogProducts, setCatalogProducts] = useState(fallbackCatalogProducts);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phoneNumber: "+998 ",
    city: "",
    address: "",
    comment: "",
  });
  const [checkoutStatus, setCheckoutStatus] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadBestCatalogProducts().then(({ products }) => {
      if (isMounted) setCatalogProducts(products);
    }).finally(() => {
      if (isMounted) setIsLoadingCatalog(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!customerProfile && !customerUser) return;

    setCheckoutForm((current) => ({
      ...current,
      name: current.name || getCustomerDisplayName(customerProfile),
    }));
  }, [customerProfile, customerUser]);

  const cartProducts = useMemo(() => {
    const productById = new Map(catalogProducts.map((product) => [product.id, product]));
    return cartItems
      .map((item) => ({ ...item, product: productById.get(item.productId) }))
      .filter((item) => item.product);
  }, [cartItems, catalogProducts]);

  const cartTotal = useMemo(() => {
    return cartProducts.reduce((total, item) => total + (Number(item.product.price) || 0) * item.quantity, 0);
  }, [cartProducts]);

  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;
    setCheckoutStatus("");
    setCheckoutError("");
    setCheckoutForm((current) => ({
      ...current,
      [name]: name === "phoneNumber" ? formatUzbekPhoneNumber(value) : value,
    }));
  };

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();
    setCheckoutStatus("");
    setCheckoutError("");

    if (!cartProducts.length) {
      setCheckoutError(language === "uz" ? "Savat bo'sh." : "Корзина пустая.");
      return;
    }

    if (!checkoutForm.name.trim()) {
      setCheckoutError(language === "uz" ? "Ismni kiriting." : "Введите имя.");
      return;
    }

    if (!isValidUzbekPhoneNumber(checkoutForm.phoneNumber)) {
      setCheckoutError(language === "uz" ? "+998 bilan to'liq telefon raqamini kiriting." : "Введите полный номер телефона с кодом +998.");
      return;
    }

    if (!checkoutForm.city.trim() || !checkoutForm.address.trim()) {
      setCheckoutError(language === "uz" ? "Shahar va manzilni kiriting." : "Введите город и адрес.");
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const order = await createCustomerOrder({
        customerUser,
        customerProfile,
        form: checkoutForm,
        items: cartProducts,
        total: cartTotal,
        language,
      });
      clearCart();
      setCheckoutStatus(
        language === "uz"
          ? `Buyurtma qabul qilindi: #${order.id.slice(0, 8)}.`
          : `Заказ принят: #${order.id.slice(0, 8)}.`
      );
      setCheckoutForm((current) => ({ ...current, comment: "" }));
    } catch (error) {
      console.warn("[Cart] order create failed:", error);
      setCheckoutError(
        language === "uz"
          ? "Buyurtmani saqlab bo'lmadi. Firebase sozlamalarini tekshiring."
          : "Не удалось сохранить заказ. Проверьте настройки Firebase."
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <>
      <header className="favorites-hero cart-hero">
        <div className="favorites-hero__copy reveal is-visible">
          <span className="eyebrow">
            <ShoppingCart size={17} aria-hidden="true" />
            {customerUser ? t.cart.savedAccount : t.cart.savedLocal}
          </span>
          <h1>{t.cart.title}</h1>
          <div className="hero-actions">
            <AppButton href="#/catalog" icon={ShoppingBag}>
              {t.favorites.openCatalog}
            </AppButton>
          </div>
        </div>

        <div className="favorites-hero__stats reveal is-visible">
          <strong>{cartCount}</strong>
          <span>{isLoadingCatalog ? t.favorites.loading : t.cart.count}</span>
        </div>
      </header>

      <section className="cart-page">
        {cartProducts.length > 0 ? (
          <>
            <div className="cart-list">
              {cartProducts.map(({ product, quantity }) => {
                const title = getProductTitle(product, language);
                const brand = getProductBrand(product);
                const brandCopy = brand ? getBrandCopy(brand, language) : null;

                return (
                  <article className="cart-item" key={product.id}>
                    <img src={product.image} alt={title} loading="lazy" />
                    <div>
                      <span>{brandCopy?.localName || product.brand}</span>
                      <h2>{title}</h2>
                      <p>{getProductPurpose(product, language)}</p>
                      <strong>{formatPrice(product.price, language)}</strong>
                    </div>
                    <div className="cart-quantity" aria-label={t.cart.quantity}>
                      <button type="button" onClick={() => updateCartQuantity(product.id, quantity - 1)}>
                        <Minus size={16} aria-hidden="true" />
                      </button>
                      <b>{quantity}</b>
                      <button type="button" onClick={() => updateCartQuantity(product.id, quantity + 1)}>
                        <Plus size={16} aria-hidden="true" />
                      </button>
                    </div>
                    <button className="cart-remove" type="button" onClick={() => removeFromCart(product.id)}>
                      <Trash2 size={17} aria-hidden="true" />
                      {t.cart.remove}
                    </button>
                  </article>
                );
              })}
            </div>

            <aside className="cart-summary-panel">
              <span>{t.cart.total}</span>
              <strong>{cartTotal ? formatPrice(cartTotal, language) : language === "uz" ? "Narx Uzumda" : "Цена в Uzum"}</strong>
              <p>{language === "uz" ? "Ma'lumotlarni kiriting, buyurtma admin paneldagi alohida bo'limga tushadi." : "Заполните данные, заказ попадёт в отдельную вкладку админки."}</p>

              <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
                <label>
                  {language === "uz" ? "Ism" : "Имя"}
                  <input name="name" value={checkoutForm.name} onChange={handleCheckoutChange} placeholder={language === "uz" ? "Ismingiz" : "Ваше имя"} required />
                </label>

                <label>
                  {language === "uz" ? "Telefon" : "Телефон"}
                  <input
                    name="phoneNumber"
                    value={checkoutForm.phoneNumber}
                    onChange={handleCheckoutChange}
                    placeholder="+998 90 123 45 67"
                    inputMode="tel"
                    required
                  />
                </label>

                <label>
                  {language === "uz" ? "Shahar" : "Город"}
                  <input name="city" value={checkoutForm.city} onChange={handleCheckoutChange} placeholder={language === "uz" ? "Toshkent" : "Ташкент"} required />
                </label>

                <label>
                  {language === "uz" ? "Manzil" : "Адрес"}
                  <input name="address" value={checkoutForm.address} onChange={handleCheckoutChange} placeholder={language === "uz" ? "Ko'cha, uy" : "Улица, дом"} required />
                </label>

                <label>
                  {language === "uz" ? "Izoh" : "Комментарий"}
                  <textarea
                    name="comment"
                    value={checkoutForm.comment}
                    onChange={handleCheckoutChange}
                    placeholder={language === "uz" ? "Yetkazish bo'yicha izoh" : "Комментарий к доставке"}
                    rows={3}
                  />
                </label>

                <AppButton type="submit" icon={ClipboardList} disabled={isSubmittingOrder}>
                  {isSubmittingOrder ? (language === "uz" ? "Yuborilmoqda..." : "Отправляем...") : language === "uz" ? "Buyurtma berish" : "Оформить заказ"}
                </AppButton>

                {checkoutStatus && <p className="form-status">{checkoutStatus}</p>}
                {checkoutError && <p className="form-status is-error">{checkoutError}</p>}
              </form>
            </aside>
          </>
        ) : (
          <div className="catalog-empty reveal is-visible">
            <ShoppingCart size={34} aria-hidden="true" />
            <h2>{t.cart.emptyTitle}</h2>
            <p>{t.cart.emptyText}</p>
            <AppButton href="#/catalog" icon={ShoppingBag}>
              {t.favorites.openCatalog}
            </AppButton>
          </div>
        )}
      </section>
    </>
  );
}

function getB2BSubmitErrorMessage(error, language) {
  if (language === "uz") {
    if (error.code === "MONTHLY_LIMIT_REACHED") return "Bu IP manzildan oyiga 3 ta ariza yuborish mumkin.";
    if (error.code === "TURNSTILE_FAILED") return "Captcha tekshiruvi o'tmadi. Qaytadan urinib ko'ring.";
    return "Arizani yuborib bo'lmadi. Internetni tekshiring yoki keyinroq urinib ko'ring.";
  }

  if (error.code === "MONTHLY_LIMIT_REACHED") return "С этого IP можно отправить только 3 заявки в месяц.";
  if (error.code === "TURNSTILE_FAILED") return "Проверка капчи не прошла. Попробуйте ещё раз.";
  return "Не удалось отправить заявку. Проверьте интернет или попробуйте позже.";
}

// === B2B-страница ===
// Форма для партнёров: проверяет телефон, капчу, отправляет заявку и показывает модалку успеха.
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
    brands: defaultPartnerBrands,
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
        brands: defaultPartnerBrands,
        comment: "",
      });
    } catch (error) {
      setStatus(getB2BSubmitErrorMessage(error, language));
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

// === Вспомогательные функции админки ===
// Старые и новые заявки могут иметь разные названия полей, поэтому берём первое найденное.
function getRequestField(request, keys) {
  return keys.map((key) => request?.[key]).find((value) => value !== undefined && value !== null && String(value).trim()) || "";
}

// Превращает дату из API в читаемый формат для таблицы заявок.
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

// === Админ-панель ===
// Логин, список B2B-заявок, поиск, фильтр и удаление заявок через подтверждение.
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

// Общий блок-ссылка на Uzum Market.
function createEmptyAdminProductForm() {
  return {
    id: "",
    nameRu: "",
    nameUz: "",
    brand: brands[0]?.name || "Dr.Sante",
    brandSlug: brands[0]?.slug || "dr-sante",
    category: catalogCategories.find((item) => item.value !== "all")?.value || "body-care",
    volume: "",
    price: "",
    uzumCardPrice: "",
    image: "",
    href: uzumShopUrl,
    purposeRu: "",
    purposeUz: "",
    descriptionRu: "",
    descriptionUz: "",
    sortOrder: "9999",
    isVisible: true,
  };
}

function productToAdminForm(product = {}) {
  return {
    ...createEmptyAdminProductForm(),
    id: product.id || "",
    nameRu: product.nameRu || product.name || "",
    nameUz: product.nameUz || product.nameRu || product.name || "",
    brand: product.brand || "",
    brandSlug: product.brandSlug || "",
    category: product.category || "body-care",
    volume: product.volume || "",
    price: product.price || "",
    uzumCardPrice: product.uzumCardPrice || "",
    image: product.image || "",
    href: product.href || uzumShopUrl,
    purposeRu: product.purposeRu || product.purpose || "",
    purposeUz: product.purposeUz || "",
    descriptionRu: product.descriptionRu || product.description || "",
    descriptionUz: product.descriptionUz || "",
    sortOrder: product.sortOrder || "9999",
    isVisible: product.isVisible !== false,
  };
}

function isLikelyPartnerRequest(request) {
  if (!request || typeof request !== "object") return false;
  if (Array.isArray(request.items) || request.productId || request.price || request.nameRu) return false;

  return Boolean(
    getRequestField(request, ["name"]) ||
      getRequestField(request, ["phoneNumber", "phone", "phone number"]) ||
      getRequestField(request, ["city"]) ||
      getRequestField(request, ["company"]) ||
      getRequestField(request, ["type", "format"]) ||
      getRequestField(request, ["brands"]) ||
      getRequestField(request, ["comment", "message"])
  );
}

function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [credentials, setCredentials] = useState({ login: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [loadStatus, setLoadStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [productForm, setProductForm] = useState(createEmptyAdminProductForm);
  const [editingProductId, setEditingProductId] = useState("");
  const [productStatus, setProductStatus] = useState("");

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

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setLoadStatus("");

    try {
      const [nextRequests, nextOrders, nextProducts] = await Promise.all([
        fetchPartnerRequests().catch(() => []),
        fetchCustomerOrders().catch(() => []),
        fetchFirebaseCatalogProducts().catch(() => []),
      ]);

      setRequests(nextRequests.filter(isLikelyPartnerRequest));
      setOrders(nextOrders);
      setAdminProducts(nextProducts.map(normalizeCatalogProduct));
    } catch (error) {
      console.warn("[Admin] dashboard load failed:", error);
      setLoadStatus("Не удалось загрузить данные. Проверьте Firebase/API и обновите страницу.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) loadDashboardData();
  }, [loadDashboardData, session]);

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
    setOrders([]);
    setAdminProducts([]);
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
      ].join(" ").toLowerCase();

      return matchesType && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [query, requests, typeFilter]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
      const searchableText = [
        order.id,
        order.customerName,
        order.customerEmail,
        order.phoneNumber,
        order.city,
        order.address,
        order.comment,
        ...(order.items || []).flatMap((item) => [item.titleRu, item.titleUz, item.brand]),
      ].join(" ").toLowerCase();

      return matchesStatus && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [orders, orderStatusFilter, query]);

  const filteredAdminProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return adminProducts;

    return adminProducts.filter((product) =>
      [
        product.id,
        product.nameRu,
        product.nameUz,
        product.brand,
        product.brandSlug,
        product.category,
        product.volume,
        product.descriptionRu,
      ].join(" ").toLowerCase().includes(normalizedQuery)
    );
  }, [adminProducts, query]);

  const types = useMemo(() => {
    const apiTypes = requests.map((request) => getRequestField(request, ["type", "format"])).filter(Boolean);
    return [...new Set([...partnerRequestTypes, ...apiTypes])];
  }, [requests]);

  const ordersTotal = useMemo(() => orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0), [orders]);

  const deleteRequest = async (request) => {
    if (!request?.id) return;
    if (!window.confirm(`Удалить заявку #${request.id}?`)) return;

    try {
      await deletePartnerRequest(request.id);
      setRequests((current) => current.filter((item) => item.id !== request.id));
    } catch {
      setLoadStatus("Не удалось удалить заявку.");
    }
  };

  const changeOrderStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    setLoadStatus("");

    try {
      const saved = await updateCustomerOrderStatus(orderId, status);
      setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, ...saved } : order)));
    } catch (error) {
      console.warn("[Admin] order status update failed:", error);
      setLoadStatus("Не удалось обновить статус заказа.");
    } finally {
      setUpdatingOrderId("");
    }
  };

  const handleProductFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProductStatus("");

    setProductForm((current) => {
      if (name === "brandSlug") {
        const brand = brands.find((item) => item.slug === value);
        return {
          ...current,
          brandSlug: value,
          brand: brand?.name || current.brand,
        };
      }

      return {
        ...current,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const startNewProduct = () => {
    setEditingProductId("");
    setProductForm(createEmptyAdminProductForm());
    setProductStatus("");
    setActiveTab("products");
  };

  const editProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm(productToAdminForm(product));
    setProductStatus("");
    setActiveTab("products");
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setSavingProduct(true);
    setProductStatus("");

    try {
      const savedProduct = await saveFirebaseCatalogProduct(productForm);
      const normalized = normalizeCatalogProduct(savedProduct);
      setAdminProducts((current) => {
        const exists = current.some((item) => item.id === normalized.id);
        return exists
          ? current.map((item) => (item.id === normalized.id ? normalized : item))
          : [normalized, ...current];
      });
      setEditingProductId(normalized.id);
      setProductForm(productToAdminForm(normalized));
      setProductStatus("Товар сохранён в Firebase.");
    } catch (error) {
      console.warn("[Admin] product save failed:", error);
      setProductStatus("Не удалось сохранить товар. Проверьте правила Firestore.");
    } finally {
      setSavingProduct(false);
    }
  };

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
          <h2>Вход в админ-панель</h2>
          <p>После входа доступны B2B заявки, заказы из корзины и управление товарами Firebase.</p>

          <label>
            Логин
            <input name="login" value={credentials.login} onChange={handleCredentialChange} autoComplete="username" required />
          </label>

          <label>
            Пароль
            <input name="password" type="password" value={credentials.password} onChange={handleCredentialChange} autoComplete="current-password" required />
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
          <h1>{activeTab === "orders" ? "Заказы" : activeTab === "products" ? "Товары" : "B2B заявки"}</h1>
          <p>B2B заявки, заказы из корзины и каталог товаров теперь разделены по вкладкам.</p>
        </div>

        <div className="admin-actions">
          <AppButton variant="secondary" icon={RefreshCw} onClick={loadDashboardData} disabled={isLoading}>
            {isLoading ? "Загрузка..." : "Обновить"}
          </AppButton>
          <AppButton variant="ghost" icon={LogOut} onClick={handleLogout}>
            Выйти
          </AppButton>
        </div>
      </header>

      <div className="admin-tabs" role="tablist" aria-label="Разделы админки">
        <button className={activeTab === "orders" ? "is-active" : ""} type="button" onClick={() => setActiveTab("orders")}>
          <ClipboardList size={17} aria-hidden="true" /> Заказы
        </button>
        <button className={activeTab === "requests" ? "is-active" : ""} type="button" onClick={() => setActiveTab("requests")}>
          <Handshake size={17} aria-hidden="true" /> B2B
        </button>
        <button className={activeTab === "products" ? "is-active" : ""} type="button" onClick={() => setActiveTab("products")}>
          <PackagePlus size={17} aria-hidden="true" /> Товары
        </button>
      </div>

      <div className="admin-stats">
        <div>
          <strong>{orders.length}</strong>
          <span>заказов</span>
        </div>
        <div>
          <strong>{ordersTotal ? formatPrice(ordersTotal, "ru") : "0 сум"}</strong>
          <span>сумма заказов</span>
        </div>
        <div>
          <strong>{adminProducts.length}</strong>
          <span>товаров в Firebase</span>
        </div>
      </div>

      <div className="admin-toolbar admin-toolbar--wide">
        <label>
          Поиск
          <span>
            <Search size={18} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Имя, телефон, товар, бренд или id" />
          </span>
        </label>

        {activeTab === "requests" && (
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
        )}

        {activeTab === "orders" && (
          <label>
            Статус
            <select value={orderStatusFilter} onChange={(event) => setOrderStatusFilter(event.target.value)}>
              <option value="all">Все статусы</option>
              {orderStatuses.map((status) => (
                <option value={status.value} key={status.value}>
                  {status.labelRu}
                </option>
              ))}
            </select>
          </label>
        )}

        {activeTab === "products" && (
          <button className="admin-new-product" type="button" onClick={startNewProduct}>
            <PackagePlus size={18} aria-hidden="true" />
            Новый товар
          </button>
        )}
      </div>

      {loadStatus && <p className="admin-error">{loadStatus}</p>}

      {activeTab === "orders" && (
        <div className="admin-request-grid admin-order-grid">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <article className="admin-request-card admin-order-card" key={order.id}>
                <div className="admin-request-card__top">
                  <span>#{order.id.slice(0, 8)}</span>
                  <strong>{getOrderStatusLabel(order.status, "ru")}</strong>
                </div>

                <h2>{order.customerName || "Покупатель без имени"}</h2>
                <dl>
                  <div>
                    <dt>Телефон</dt>
                    <dd>{order.phoneNumber || "Не указан"}</dd>
                  </div>
                  <div>
                    <dt>Сумма</dt>
                    <dd>{formatPrice(order.total, "ru")}</dd>
                  </div>
                  <div>
                    <dt>Город</dt>
                    <dd>{order.city || "Не указан"}</dd>
                  </div>
                  <div>
                    <dt>Адрес</dt>
                    <dd>{order.address || "Не указан"}</dd>
                  </div>
                </dl>

                <div className="admin-order-items">
                  {(order.items || []).map((item) => (
                    <div key={`${order.id}-${item.productId}`}>
                      <span>{item.quantity} x</span>
                      <p>{item.titleRu || item.titleUz || item.productId}</p>
                      <b>{formatPrice(item.subtotal, "ru")}</b>
                    </div>
                  ))}
                </div>

                {order.comment && <p>{order.comment}</p>}

                <div className="admin-request-card__footer">
                  <small>{formatRequestDate(order.createdAtIso)}</small>
                  <select
                    className="admin-status-select"
                    value={order.status || "new"}
                    onChange={(event) => changeOrderStatus(order.id, event.target.value)}
                    disabled={updatingOrderId === order.id}
                  >
                    {orderStatuses.map((status) => (
                      <option value={status.value} key={status.value}>
                        {status.labelRu}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            ))
          ) : (
            <div className="admin-empty">
              <ClipboardList size={32} aria-hidden="true" />
              <h2>Заказы не найдены</h2>
              <p>Когда покупатель оформит корзину, заказ появится здесь.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "requests" && (
        <div className="admin-request-grid">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => {
              const phoneNumber = getRequestField(request, ["phoneNumber", "phone", "phone number"]);
              const comment = getRequestField(request, ["comment", "message"]);
              const requestType = getRequestField(request, ["type", "format"]);

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
                    <button className="admin-delete-button" type="button" onClick={() => deleteRequest(request)} disabled={!request.id}>
                      <Trash2 size={17} aria-hidden="true" />
                      <span>Удалить</span>
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="admin-empty">
              <Search size={32} aria-hidden="true" />
              <h2>B2B заявки не найдены</h2>
              <p>Товары из корзины здесь больше не отображаются.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <div className="admin-products-layout">
          <form className="admin-product-form" onSubmit={saveProduct}>
            <div className="admin-product-form__head">
              <span>{editingProductId ? "Редактирование товара" : "Новый товар"}</span>
              <strong>{editingProductId || "ID создастся автоматически"}</strong>
            </div>

            <label>
              ID товара
              <input name="id" value={productForm.id} onChange={handleProductFormChange} placeholder="dr-sante-new-product" />
            </label>

            <div className="admin-product-form__grid">
              <label>
                Название RU
                <input name="nameRu" value={productForm.nameRu} onChange={handleProductFormChange} required />
              </label>
              <label>
                Название UZ
                <input name="nameUz" value={productForm.nameUz} onChange={handleProductFormChange} />
              </label>
            </div>

            <div className="admin-product-form__grid">
              <label>
                Бренд
                <select name="brandSlug" value={productForm.brandSlug} onChange={handleProductFormChange}>
                  {brands.map((brand) => (
                    <option value={brand.slug} key={brand.slug}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Категория
                <select name="category" value={productForm.category} onChange={handleProductFormChange}>
                  {catalogCategories.filter((item) => item.value !== "all").map((item) => (
                    <option value={item.value} key={item.value}>
                      {getCategoryLabel(item.value, "ru")}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="admin-product-form__grid">
              <label>
                Объём
                <input name="volume" value={productForm.volume} onChange={handleProductFormChange} placeholder="250 мл" />
              </label>
              <label>
                Цена, сум
                <input name="price" value={productForm.price} onChange={handleProductFormChange} inputMode="numeric" placeholder="25000" />
              </label>
            </div>

            <label>
              Картинка
              <input name="image" value={productForm.image} onChange={handleProductFormChange} placeholder="products/dr-sante-clean/product.webp или https://..." />
            </label>

            <label>
              Ссылка
              <input name="href" value={productForm.href} onChange={handleProductFormChange} placeholder={uzumShopUrl} />
            </label>

            <label>
              Назначение RU
              <input name="purposeRu" value={productForm.purposeRu} onChange={handleProductFormChange} />
            </label>
            <label>
              Назначение UZ
              <input name="purposeUz" value={productForm.purposeUz} onChange={handleProductFormChange} />
            </label>

            <label>
              Описание RU
              <textarea name="descriptionRu" value={productForm.descriptionRu} onChange={handleProductFormChange} rows={4} />
            </label>
            <label>
              Описание UZ
              <textarea name="descriptionUz" value={productForm.descriptionUz} onChange={handleProductFormChange} rows={4} />
            </label>

            <div className="admin-product-form__grid">
              <label>
                Sort order
                <input name="sortOrder" value={productForm.sortOrder} onChange={handleProductFormChange} inputMode="numeric" />
              </label>
              <label className="admin-product-checkbox">
                <input name="isVisible" type="checkbox" checked={productForm.isVisible} onChange={handleProductFormChange} />
                Показывать на сайте
              </label>
            </div>

            <AppButton type="submit" icon={editingProductId ? Edit3 : PackagePlus} disabled={savingProduct}>
              {savingProduct ? "Сохраняем..." : editingProductId ? "Сохранить изменения" : "Добавить товар"}
            </AppButton>

            {productStatus && <p className={`form-status${productStatus.includes("Не удалось") ? " is-error" : ""}`}>{productStatus}</p>}
          </form>

          <div className="admin-products-list">
            {filteredAdminProducts.map((product) => (
              <article className="admin-product-row" key={product.id}>
                <img src={product.image} alt={getProductTitle(product, "ru")} loading="lazy" />
                <div>
                  <span>{product.brand}</span>
                  <h2>{getProductTitle(product, "ru")}</h2>
                  <p>{getCategoryLabel(product.category, "ru")} · {product.volume || "без объёма"} · {formatPrice(product.price, "ru")}</p>
                </div>
                <button type="button" onClick={() => editProduct(product)}>
                  <Edit3 size={16} aria-hidden="true" />
                  Изменить
                </button>
              </article>
            ))}
          </div>
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

// Подвал сайта.
function Footer() {
  const { language, t } = useLocale();

  return (
    <footer>
      <div>
        <strong>Beauty Harmony</strong>
        <p>{t.footer.text}</p>
      </div>
      <div className="footer-link-stack">
        <div className="social-links" aria-label="Beauty Harmony social links">
          <a className="social-link" href={instagramUrl} target="_blank" rel="noreferrer">
            <Instagram size={18} aria-hidden="true" />
            <span>
              <strong>Instagram</strong>
              <small>@dr.sante_uz</small>
            </span>
          </a>
          <a className="social-link" href={telegramBotUrl} target="_blank" rel="noreferrer">
            <Send size={18} aria-hidden="true" />
            <span>
              <strong>Telegram bot</strong>
              <small>@beautyharmonyuz_bot</small>
            </span>
          </a>
        </div>
        <div className="source-links">
          {sources.map(([label, href]) => (
            <a href={href} target="_blank" rel="noreferrer" key={href}>
              {language === "uz" && label === "История Elfa Group" ? "Elfa Group tarixi" : language === "uz" && label === "ЕвроТек" ? "EuroTek" : label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// Страница 404, если пользователь открыл неизвестный адрес.
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

// === Главный роутер сайта ===
// Смотрит на адрес после # и решает, какую страницу показать.
export function BeautyHarmonyWebsite() {
  const route = useHashRoute();
  const [language, setLanguage] = useState(() => localStorage.getItem("beauty-harmony-language") || "ru");
  const [colorMode, setColorMode] = useState(() => localStorage.getItem("beauty-harmony-theme") || "light");
  const [favoriteIds, setFavoriteIds] = useState(() => cleanFavoriteIds(readStoredArray(favoritesStorageKey)));
  const [cartItems, setCartItems] = useState(() => cleanCartItems(readStoredArray(cartStorageKey)));
  const [customerUser, setCustomerUser] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [isCustomerReady, setIsCustomerReady] = useState(!hasCustomerAuthConfig());
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState("");
  const [customerListsReadyUid, setCustomerListsReadyUid] = useState("");
  const saveCustomerCollectionsTimeoutRef = useRef(null);
  useRevealAnimation(route);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => {};
    let authChangeId = 0;

    subscribeCustomerAuth(async (user) => {
      const currentAuthChangeId = ++authChangeId;
      if (!isMounted) return;
      setIsCustomerLoading(true);
      setCustomerError("");

      if (!user) {
        setCustomerUser(null);
        setCustomerProfile(null);
        setCustomerListsReadyUid("");
        setIsCustomerReady(true);
        setIsCustomerLoading(false);
        return;
      }

      try {
        const profile = await getCustomerProfile(user);
        if (!isMounted || currentAuthChangeId !== authChangeId) return;
        setCustomerUser(user);
        setCustomerProfile(profile);
        setIsCustomerReady(true);
      } catch (error) {
        if (!isMounted || currentAuthChangeId !== authChangeId) return;
        console.warn("[Customer] profile load failed:", error);
        setCustomerUser(user);
        setCustomerProfile(null);
        setCustomerError(error?.message || "Profile load failed");
        setIsCustomerReady(true);
      } finally {
        if (isMounted && currentAuthChangeId === authChangeId) setIsCustomerLoading(false);
      }
    }).then((unsubscribeAuth) => {
      unsubscribe = unsubscribeAuth || (() => {});
    }).catch((error) => {
      console.warn("[Customer] auth subscription failed:", error);
      if (isMounted) {
        setCustomerError(error?.message || "Auth subscription failed");
        setIsCustomerReady(true);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function completeEmailLink() {
      if (!hasCustomerAuthConfig()) return;

      const hasEmailLink = await isCustomerEmailSignInLink().catch(() => false);
      if (!hasEmailLink || !isMounted) return;

      setIsCustomerLoading(true);
      setCustomerError("");

      try {
        const result = await completeCustomerEmailLinkSignIn();
        const profile = await getCustomerProfile(result.user);
        if (!isMounted) return;

        setCustomerUser(result.user);
        setCustomerProfile(profile);
        setIsCustomerReady(true);

        if (window.history?.replaceState) {
          window.history.replaceState({}, document.title, `${window.location.origin}${window.location.pathname}`);
        }
      } catch (error) {
        if (!isMounted) return;
        console.warn("[Customer] email link sign-in failed:", error);
        setCustomerError(error?.message || "Email link sign-in failed");
        setIsCustomerReady(true);
      } finally {
        if (isMounted) setIsCustomerLoading(false);
      }
    }

    completeEmailLink();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!customerUser?.uid || !customerProfile) return;
    if (customerListsReadyUid === customerUser.uid) return;

    setFavoriteIds((current) => cleanFavoriteIds([...current, ...(customerProfile.favoriteIds || [])]));
    setCartItems((current) => mergeCartItems(current, customerProfile.cartItems || []));
    setCustomerListsReadyUid(customerUser.uid);
  }, [customerListsReadyUid, customerProfile, customerUser]);

  useEffect(() => {
    localStorage.setItem("beauty-harmony-language", language);
    document.documentElement.lang = language === "uz" ? "uz" : "ru";
  }, [language]);

  useEffect(() => {
    const nextColorMode = colorMode === "dark" ? "dark" : "light";
    localStorage.setItem("beauty-harmony-theme", nextColorMode);
    document.documentElement.dataset.theme = nextColorMode;
  }, [colorMode]);

  useEffect(() => {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!customerUser?.uid || customerListsReadyUid !== customerUser.uid) return undefined;

    window.clearTimeout(saveCustomerCollectionsTimeoutRef.current);
    saveCustomerCollectionsTimeoutRef.current = window.setTimeout(() => {
      saveCustomerCollections(customerUser.uid, { favoriteIds, cartItems }).catch((error) => {
        console.warn("[Customer] collections sync failed:", error);
      });
    }, 650);

    return () => window.clearTimeout(saveCustomerCollectionsTimeoutRef.current);
  }, [cartItems, customerListsReadyUid, customerUser, favoriteIds]);

  const toggleFavorite = useCallback((productId) => {
    if (!productId) return;
    setFavoriteIds((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [productId, ...current];
      return cleanFavoriteIds(next);
    });
  }, []);

  const addToCart = useCallback((productId) => {
    if (!productId) return;
    setCartItems((current) => cleanCartItems([...current, { productId, quantity: 1 }]));
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId, quantity) => {
    setCartItems((current) => {
      const nextQuantity = Number.parseInt(quantity, 10) || 0;
      if (nextQuantity <= 0) return current.filter((item) => item.productId !== productId);

      const hasItem = current.some((item) => item.productId === productId);
      const next = hasItem
        ? current.map((item) => (item.productId === productId ? { ...item, quantity: Math.min(99, nextQuantity) } : item))
        : [...current, { productId, quantity: Math.min(99, nextQuantity) }];
      return cleanCartItems(next);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const sendCustomerSignInLink = useCallback(async (email, nextLanguage) => {
    setIsCustomerLoading(true);
    setCustomerError("");
    try {
      return await sendCustomerEmailLink(email, nextLanguage);
    } catch (error) {
      setCustomerError(error?.message || "Email link send failed");
      throw error;
    } finally {
      setIsCustomerLoading(false);
    }
  }, []);

  const updateCustomerProfile = useCallback(async (profilePatch) => {
    if (!customerUser) throw new Error("USER_MISSING");
    setIsCustomerLoading(true);
    setCustomerError("");
    try {
      const savedProfile = await saveCustomerProfile(customerUser, profilePatch);
      const nextProfile = {
        ...(customerProfile || {}),
        ...savedProfile,
        favoriteIds,
        cartItems,
      };
      setCustomerProfile(nextProfile);
      return nextProfile;
    } catch (error) {
      setCustomerError(error?.message || "Profile save failed");
      throw error;
    } finally {
      setIsCustomerLoading(false);
    }
  }, [cartItems, customerProfile, customerUser, favoriteIds]);

  const logoutCustomer = useCallback(async () => {
    setIsCustomerLoading(true);
    setCustomerError("");
    try {
      await signOutCustomer();
      setCustomerUser(null);
      setCustomerProfile(null);
      setCustomerListsReadyUid("");
    } catch (error) {
      setCustomerError(error?.message || "Logout failed");
      throw error;
    } finally {
      setIsCustomerLoading(false);
    }
  }, []);

  const content = useMemo(() => {
    if (route === "/" || route === "") return <HomePage />;
    if (route === "/catalog") return <CatalogPage />;
    if (route === "/brands") return <BrandsSection />;
    if (route === "/about") return <AboutCompanyPage />;
    if (route === "/favorites") return <FavoritesPage />;
    if (route === "/cart") return <CartPage />;
    if (route === "/b2b") return <B2BPage />;
    if (route === "/admin") return <AdminDashboard />;

    const brandMatch = route.match(/^\/brand\/(.+)$/);
    if (brandMatch) {
      const brand = brands.find((item) => item.slug === brandMatch[1]);
      return brand ? <BrandPage brand={brand} /> : <NotFoundPage />;
    }

    return <NotFoundPage />;
  }, [route]);

  const localeValue = useMemo(() => ({ language, setLanguage, t: ui[language] || ui.ru }), [language]);
  const appearanceValue = useMemo(() => ({ colorMode, setColorMode }), [colorMode]);
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const cartCount = useMemo(() => getCartCount(cartItems), [cartItems]);
  const favoritesValue = useMemo(
    () => ({
      favoriteIds,
      isFavorite: (productId) => favoriteSet.has(productId),
      toggleFavorite,
    }),
    [favoriteIds, favoriteSet, toggleFavorite]
  );
  const cartValue = useMemo(
    () => ({
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
    }),
    [addToCart, cartCount, cartItems, clearCart, removeFromCart, updateCartQuantity]
  );
  const customerValue = useMemo(
    () => ({
      customerUser,
      customerProfile,
      isCustomerReady,
      isCustomerLoading,
      customerError,
      sendCustomerSignInLink,
      updateCustomerProfile,
      logoutCustomer,
    }),
    [
      customerError,
      customerProfile,
      customerUser,
      isCustomerLoading,
      isCustomerReady,
      logoutCustomer,
      sendCustomerSignInLink,
      updateCustomerProfile,
    ]
  );

  return (
    <LocaleContext.Provider value={localeValue}>
      <AppearanceContext.Provider value={appearanceValue}>
        <CustomerContext.Provider value={customerValue}>
          <CartContext.Provider value={cartValue}>
            <FavoritesContext.Provider value={favoritesValue}>
              <Shell route={route}>{content}</Shell>
            </FavoritesContext.Provider>
          </CartContext.Provider>
        </CustomerContext.Provider>
      </AppearanceContext.Provider>
    </LocaleContext.Provider>
  );
}
