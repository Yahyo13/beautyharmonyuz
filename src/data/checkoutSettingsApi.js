import { getFirestoreClient, hasFirebaseConfig } from "./firebaseCatalogApi";

export const defaultCheckoutSettings = {
  deliveryPrice: 0,
  serviceFee: 0,
};

export function hasCheckoutSettingsConfig() {
  return hasFirebaseConfig();
}

function normalizeText(value = "") {
  return String(value || "").trim();
}

function normalizeNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) && value > 0 ? Math.round(value) : 0;
  const parsed = Number(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 0;
}

function normalizeDateValue(value = "") {
  return normalizeText(value).slice(0, 10);
}

function createPromoCodeId(code) {
  const cleanCode = normalizeText(code).toUpperCase();
  return cleanCode
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `promo-${Date.now()}`;
}

function normalizeCheckoutSettings(data = {}) {
  return {
    deliveryPrice: normalizeNumber(data.deliveryPrice),
    serviceFee: normalizeNumber(data.serviceFee),
    updatedAtIso: data.updatedAtIso || "",
  };
}

export function normalizePromoCode(document) {
  const data = document?.data ? document.data() : document || {};
  const discountType = data.discountType === "percent" ? "percent" : "amount";

  return {
    id: document?.id || data.id || createPromoCodeId(data.code),
    code: normalizeText(data.code).toUpperCase(),
    discountType,
    discountValue: normalizeNumber(data.discountValue),
    maxActivations: normalizeNumber(data.maxActivations),
    usedCount: normalizeNumber(data.usedCount),
    startsAt: normalizeDateValue(data.startsAt),
    endsAt: normalizeDateValue(data.endsAt),
    isActive: data.isActive !== false,
    createdAtIso: data.createdAtIso || "",
    updatedAtIso: data.updatedAtIso || "",
  };
}

export function calculatePromoDiscount(promo, subtotal) {
  const cleanSubtotal = normalizeNumber(subtotal);
  if (!promo || cleanSubtotal <= 0) return 0;

  const discount = promo.discountType === "percent"
    ? Math.round((cleanSubtotal * Math.min(100, normalizeNumber(promo.discountValue))) / 100)
    : normalizeNumber(promo.discountValue);

  return Math.min(cleanSubtotal, Math.max(0, discount));
}

export function isPromoCodeAvailable(promo, now = new Date()) {
  if (!promo?.code || promo.isActive === false) return false;
  if (promo.maxActivations > 0 && promo.usedCount >= promo.maxActivations) return false;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (promo.startsAt && new Date(`${promo.startsAt}T00:00:00`).getTime() > today) return false;
  if (promo.endsAt && new Date(`${promo.endsAt}T23:59:59`).getTime() < now.getTime()) return false;

  return true;
}

export async function fetchCheckoutSettings() {
  const client = await getFirestoreClient();
  if (!client) return defaultCheckoutSettings;

  const { db, firestoreApi } = client;
  const snapshot = await firestoreApi.getDoc(firestoreApi.doc(db, "settings", "checkout"));
  return snapshot.exists() ? normalizeCheckoutSettings(snapshot.data()) : defaultCheckoutSettings;
}

export async function saveCheckoutSettings(settings) {
  const client = await getFirestoreClient();
  if (!client) throw new Error("FIREBASE_NOT_CONFIGURED");

  const { db, firestoreApi } = client;
  const payload = {
    deliveryPrice: normalizeNumber(settings.deliveryPrice),
    serviceFee: normalizeNumber(settings.serviceFee),
    updatedAtIso: new Date().toISOString(),
    updatedAt: firestoreApi.serverTimestamp(),
  };

  await firestoreApi.setDoc(firestoreApi.doc(db, "settings", "checkout"), payload, { merge: true });
  return payload;
}

export async function fetchPromoCodes() {
  const client = await getFirestoreClient();
  if (!client) return [];

  const { db, firestoreApi } = client;
  const promoCodesRef = firestoreApi.collection(db, "promoCodes");
  let snapshot;

  try {
    snapshot = await firestoreApi.getDocs(firestoreApi.query(promoCodesRef, firestoreApi.orderBy("createdAtIso", "desc")));
  } catch {
    snapshot = await firestoreApi.getDocs(promoCodesRef);
  }

  return snapshot.docs
    .map(normalizePromoCode)
    .sort((left, right) => new Date(right.createdAtIso || 0).getTime() - new Date(left.createdAtIso || 0).getTime());
}

export async function savePromoCode(promoCode) {
  const client = await getFirestoreClient();
  if (!client) throw new Error("FIREBASE_NOT_CONFIGURED");

  const { db, firestoreApi } = client;
  const code = normalizeText(promoCode.code).toUpperCase();
  if (!code) throw new Error("PROMO_CODE_REQUIRED");

  const createdAtIso = promoCode.createdAtIso || new Date().toISOString();
  const promoId = promoCode.id || createPromoCodeId(code);
  const payload = {
    id: promoId,
    code,
    discountType: promoCode.discountType === "percent" ? "percent" : "amount",
    discountValue: normalizeNumber(promoCode.discountValue),
    maxActivations: normalizeNumber(promoCode.maxActivations),
    usedCount: normalizeNumber(promoCode.usedCount),
    startsAt: normalizeDateValue(promoCode.startsAt),
    endsAt: normalizeDateValue(promoCode.endsAt),
    isActive: promoCode.isActive !== false,
    createdAtIso,
    updatedAtIso: new Date().toISOString(),
    updatedAt: firestoreApi.serverTimestamp(),
  };

  if (!promoCode.createdAtIso) {
    payload.createdAt = firestoreApi.serverTimestamp();
  }

  await firestoreApi.setDoc(firestoreApi.doc(db, "promoCodes", promoId), payload, { merge: true });
  return normalizePromoCode(payload);
}

export async function togglePromoCodeStatus(promoId, isActive) {
  const client = await getFirestoreClient();
  if (!client) throw new Error("FIREBASE_NOT_CONFIGURED");

  const { db, firestoreApi } = client;
  const payload = {
    isActive: Boolean(isActive),
    updatedAtIso: new Date().toISOString(),
    updatedAt: firestoreApi.serverTimestamp(),
  };

  await firestoreApi.setDoc(firestoreApi.doc(db, "promoCodes", promoId), payload, { merge: true });
  return { id: promoId, ...payload };
}

export async function validatePromoCode(code, subtotal) {
  const cleanCode = normalizeText(code).toUpperCase();
  if (!cleanCode) throw new Error("PROMO_CODE_EMPTY");

  const promoCodes = await fetchPromoCodes();
  const promo = promoCodes.find((item) => item.code === cleanCode);
  if (!promo || !isPromoCodeAvailable(promo)) throw new Error("PROMO_CODE_INVALID");

  const discount = calculatePromoDiscount(promo, subtotal);
  if (discount <= 0) throw new Error("PROMO_CODE_NO_DISCOUNT");

  return { promo, discount };
}

export async function markPromoCodeUsed(promoId) {
  if (!promoId) return null;

  const client = await getFirestoreClient();
  if (!client) throw new Error("FIREBASE_NOT_CONFIGURED");

  const { db, firestoreApi } = client;
  const updatedAtIso = new Date().toISOString();
  await firestoreApi.setDoc(
    firestoreApi.doc(db, "promoCodes", promoId),
    {
      usedCount: firestoreApi.increment(1),
      updatedAtIso,
      updatedAt: firestoreApi.serverTimestamp(),
    },
    { merge: true }
  );

  return { id: promoId, updatedAtIso };
}
