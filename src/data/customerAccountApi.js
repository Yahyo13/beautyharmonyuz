import { getFirebaseAuthClient, getFirestoreClient, hasFirebaseConfig } from "./firebaseCatalogApi";

let customerRecaptchaVerifier = null;

export function hasCustomerAuthConfig() {
  return hasFirebaseConfig();
}

export function normalizeCustomerPhone(phoneNumber = "") {
  const digits = String(phoneNumber).replace(/\D/g, "");
  let localDigits = digits.startsWith("998") ? digits.slice(3) : digits;
  localDigits = localDigits.replace(/^0+/, "").slice(0, 9);
  return localDigits.length === 9 ? `+998${localDigits}` : String(phoneNumber).trim();
}

export function isCustomerProfileComplete(profile) {
  return Boolean(profile?.firstName?.trim() && profile?.lastName?.trim());
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
    phoneNumber: data.phoneNumber || user.phoneNumber || "",
    firstName,
    lastName,
    displayName,
    favoriteIds: cleanFavoriteIds(data.favoriteIds),
    cartItems: cleanCartItems(data.cartItems),
  };
}

function createRecaptchaVerifier(authApi, auth, containerId, language) {
  const parameters = {
    size: "invisible",
    hl: language === "uz" ? "uz" : "ru",
  };

  try {
    return new authApi.RecaptchaVerifier(auth, containerId, parameters);
  } catch {
    return new authApi.RecaptchaVerifier(containerId, parameters, auth);
  }
}

export async function subscribeCustomerAuth(callback) {
  const client = await getFirebaseAuthClient();
  if (!client) {
    callback(null);
    return () => {};
  }

  return client.authApi.onAuthStateChanged(client.auth, callback);
}

export async function sendCustomerPhoneCode(phoneNumber, recaptchaContainerId, language = "ru") {
  const client = await getFirebaseAuthClient();
  if (!client) throw new Error("FIREBASE_NOT_CONFIGURED");

  const { auth, authApi } = client;
  auth.languageCode = language === "uz" ? "uz" : "ru";

  if (customerRecaptchaVerifier) {
    customerRecaptchaVerifier.clear();
    customerRecaptchaVerifier = null;
  }

  customerRecaptchaVerifier = createRecaptchaVerifier(authApi, auth, recaptchaContainerId, language);
  return authApi.signInWithPhoneNumber(auth, normalizeCustomerPhone(phoneNumber), customerRecaptchaVerifier);
}

export async function confirmCustomerPhoneCode(confirmationResult, code) {
  if (!confirmationResult) throw new Error("CONFIRMATION_MISSING");
  return confirmationResult.confirm(String(code || "").trim());
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

  return normalizeCustomerProfile(user, snapshot.data());
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
