import { getFirebaseAuthClient, getFirestoreClient, hasFirebaseConfig } from "./firebaseCatalogApi";

const customerEmailLinkStorageKey = "beauty-harmony-email-for-sign-in";

export function hasCustomerAuthConfig() {
  return hasFirebaseConfig();
}

export function normalizeCustomerEmail(email = "") {
  return String(email).trim().toLowerCase();
}

export function isCustomerEmailValid(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeCustomerEmail(email));
}

export function isCustomerProfileComplete(profile) {
  return Boolean(profile?.firstName?.trim() && profile?.lastName?.trim());
}

function getEmailLinkContinueUrl() {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}`;
}

function rememberEmailForLink(email) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(customerEmailLinkStorageKey, normalizeCustomerEmail(email));
}

function getRememberedEmailForLink() {
  if (typeof localStorage === "undefined") return "";
  return normalizeCustomerEmail(localStorage.getItem(customerEmailLinkStorageKey) || "");
}

function forgetEmailForLink() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(customerEmailLinkStorageKey);
}

function cleanFavoriteIds(value) {
  return Array.isArray(value) ? [...new Set(value.map(String).filter(Boolean))] : [];
}

function cleanCartItems(value) {
  if (!Array.isArray(value)) return [];

  const byProductId = new Map();
  value.forEach((item) => {
    const productId = String(item?.productId || item?.id || "").trim();
    if (!productId) return;

    const quantity = Math.max(1, Math.min(99, Number.parseInt(item.quantity, 10) || 1));
    const current = byProductId.get(productId) || 0;
    byProductId.set(productId, Math.min(99, current + quantity));
  });

  return [...byProductId].map(([productId, quantity]) => ({ productId, quantity }));
}

function normalizeCustomerProfile(user, data = {}) {
  const firstName = String(data.firstName || "").trim();
  const lastName = String(data.lastName || "").trim();
  const displayName = String(data.displayName || `${firstName} ${lastName}`.trim()).trim();

  return {
    uid: user.uid,
    email: data.email || user.email || "",
    phoneNumber: data.phoneNumber || user.phoneNumber || "",
    firstName,
    lastName,
    displayName,
    favoriteIds: cleanFavoriteIds(data.favoriteIds),
    cartItems: cleanCartItems(data.cartItems),
  };
}

export async function subscribeCustomerAuth(callback) {
  const client = await getFirebaseAuthClient();
  if (!client) {
    callback(null);
    return () => {};
  }

  return client.authApi.onAuthStateChanged(client.auth, callback);
}

export async function isCustomerEmailSignInLink() {
  const client = await getFirebaseAuthClient();
  if (!client || typeof window === "undefined") return false;
  return client.authApi.isSignInWithEmailLink(client.auth, window.location.href);
}

export async function sendCustomerEmailLink(email, language = "ru") {
  const normalizedEmail = normalizeCustomerEmail(email);
  if (!isCustomerEmailValid(normalizedEmail)) throw new Error("INVALID_EMAIL");

  const client = await getFirebaseAuthClient();
  if (!client) throw new Error("FIREBASE_NOT_CONFIGURED");

  const { auth, authApi } = client;
  auth.languageCode = language === "uz" ? "uz" : "ru";

  await authApi.sendSignInLinkToEmail(auth, normalizedEmail, {
    url: getEmailLinkContinueUrl(),
    handleCodeInApp: true,
  });

  rememberEmailForLink(normalizedEmail);
  return { email: normalizedEmail };
}

export async function completeCustomerEmailLinkSignIn(email) {
  const client = await getFirebaseAuthClient();
  if (!client) throw new Error("FIREBASE_NOT_CONFIGURED");
  if (typeof window === "undefined") throw new Error("EMAIL_LINK_MISSING");

  const { auth, authApi } = client;
  const link = window.location.href;

  if (!authApi.isSignInWithEmailLink(auth, link)) {
    throw new Error("EMAIL_LINK_MISSING");
  }

  const normalizedEmail = normalizeCustomerEmail(email || getRememberedEmailForLink());
  if (!isCustomerEmailValid(normalizedEmail)) {
    throw new Error("EMAIL_LINK_EMAIL_MISSING");
  }

  const result = await authApi.signInWithEmailLink(auth, normalizedEmail, link);
  forgetEmailForLink();
  return result;
}

export async function signOutCustomer() {
  const client = await getFirebaseAuthClient();
  if (!client) return;
  await client.authApi.signOut(client.auth);
}

export async function getCustomerProfile(user) {
  if (!user?.uid) return null;

  const client = await getFirestoreClient();
  if (!client) return normalizeCustomerProfile(user);

  const { db, firestoreApi } = client;
  const profileRef = firestoreApi.doc(db, "users", user.uid);
  const snapshot = await firestoreApi.getDoc(profileRef);

  if (!snapshot.exists()) {
    const createdProfile = normalizeCustomerProfile(user);
    await firestoreApi.setDoc(
      profileRef,
      {
        uid: user.uid,
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        firstName: "",
        lastName: "",
        displayName: "",
        favoriteIds: [],
        cartItems: [],
        createdAt: firestoreApi.serverTimestamp(),
        updatedAt: firestoreApi.serverTimestamp(),
      },
      { merge: true }
    );
    return createdProfile;
  }

  const data = snapshot.data();
  const nextProfile = normalizeCustomerProfile(user, data);

  if (user.email && data.email !== user.email) {
    await firestoreApi.setDoc(profileRef, { email: user.email, updatedAt: firestoreApi.serverTimestamp() }, { merge: true });
  }

  return nextProfile;
}

export async function saveCustomerProfile(user, profilePatch) {
  if (!user?.uid) throw new Error("USER_MISSING");

  const client = await getFirestoreClient();
  const firstName = String(profilePatch.firstName || "").trim();
  const lastName = String(profilePatch.lastName || "").trim();
  const displayName = `${firstName} ${lastName}`.trim();
  const cleanPatch = {
    firstName,
    lastName,
    displayName,
    email: user.email || profilePatch.email || "",
    phoneNumber: user.phoneNumber || profilePatch.phoneNumber || "",
  };

  if (!client) return normalizeCustomerProfile(user, cleanPatch);

  const { db, firestoreApi } = client;
  await firestoreApi.setDoc(
    firestoreApi.doc(db, "users", user.uid),
    {
      uid: user.uid,
      ...cleanPatch,
      updatedAt: firestoreApi.serverTimestamp(),
    },
    { merge: true }
  );

  return normalizeCustomerProfile(user, cleanPatch);
}

export async function saveCustomerCollections(userId, { favoriteIds = [], cartItems = [] }) {
  if (!userId) return;

  const client = await getFirestoreClient();
  if (!client) return;

  const { db, firestoreApi } = client;
  await firestoreApi.setDoc(
    firestoreApi.doc(db, "users", userId),
    {
      favoriteIds: cleanFavoriteIds(favoriteIds),
      cartItems: cleanCartItems(cartItems),
      updatedAt: firestoreApi.serverTimestamp(),
    },
    { merge: true }
  );
}
