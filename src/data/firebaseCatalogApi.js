const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function hasFirebaseConfig() {
  return Object.values(firebaseConfig).every(Boolean);
}

let firebaseApp = null;
let firestoreDb = null;
let firestoreApi = null;
let firebaseAuth = null;
let firebaseAuthApi = null;

export { hasFirebaseConfig };

export async function getFirebaseApp() {
  if (!hasFirebaseConfig()) return null;
  if (!firebaseApp) {
    const { getApp, getApps, initializeApp } = await import("firebase/app");
    firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return firebaseApp;
}

async function getFirestoreDb() {
  if (!hasFirebaseConfig()) return null;
  if (!firestoreDb) {
    const [app, firestoreModule] = await Promise.all([getFirebaseApp(), import("firebase/firestore")]);
    firestoreApi = firestoreModule;
    firestoreDb = firestoreModule.getFirestore(app);
  }
  return firestoreDb;
}

export async function getFirestoreClient() {
  const db = await getFirestoreDb();
  return db ? { db, firestoreApi } : null;
}

export async function getFirebaseAuthClient() {
  if (!hasFirebaseConfig()) return null;
  if (!firebaseAuth) {
    const [app, authModule] = await Promise.all([getFirebaseApp(), import("firebase/auth")]);
    firebaseAuthApi = authModule;
    firebaseAuth = authModule.getAuth(app);
  }
  return { auth: firebaseAuth, authApi: firebaseAuthApi };
}

export async function fetchFirebaseCatalogProducts() {
  const db = await getFirestoreDb();
  if (!db) return [];

  const { collection, getDocs, orderBy, query } = firestoreApi;
  const productsRef = collection(db, "products");
  let snapshot;

  try {
    snapshot = await getDocs(query(productsRef, orderBy("sortOrder", "asc")));
  } catch {
    snapshot = await getDocs(productsRef);
  }

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

function normalizeAdminNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : null;
  if (!value) return null;
  const parsed = Number(String(value).replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function normalizeAdminText(value = "") {
  return String(value || "").trim();
}

function createProductDocumentId(product) {
  const source = product.id || product.sku || product.nameRu || product.name || product.nameUz || `product-${Date.now()}`;
  const slug = String(source)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

  return slug || `product-${Date.now()}`;
}

export async function saveFirebaseCatalogProduct(product) {
  const db = await getFirestoreDb();
  if (!db) throw new Error("FIREBASE_NOT_CONFIGURED");

  const productId = createProductDocumentId(product);
  const payload = {
    id: productId,
    name: normalizeAdminText(product.name || product.nameRu),
    nameRu: normalizeAdminText(product.nameRu || product.name),
    nameUz: normalizeAdminText(product.nameUz || product.nameRu || product.name),
    brand: normalizeAdminText(product.brand),
    brandSlug: normalizeAdminText(product.brandSlug),
    category: normalizeAdminText(product.category),
    volume: normalizeAdminText(product.volume),
    purposeRu: normalizeAdminText(product.purposeRu),
    purposeUz: normalizeAdminText(product.purposeUz),
    descriptionRu: normalizeAdminText(product.descriptionRu),
    descriptionUz: normalizeAdminText(product.descriptionUz),
    image: normalizeAdminText(product.image),
    href: normalizeAdminText(product.href),
    price: normalizeAdminNumber(product.price),
    uzumCardPrice: normalizeAdminNumber(product.uzumCardPrice),
    sortOrder: Number.parseInt(product.sortOrder, 10) || 9999,
    isVisible: product.isVisible !== false,
    isDeleted: false,
    updatedAtIso: new Date().toISOString(),
    updatedAt: firestoreApi.serverTimestamp(),
  };

  await firestoreApi.setDoc(firestoreApi.doc(db, "products", productId), payload, { merge: true });
  return payload;
}

export async function deleteFirebaseCatalogProduct(productId) {
  const db = await getFirestoreDb();
  if (!db) throw new Error("FIREBASE_NOT_CONFIGURED");

  const cleanProductId = normalizeAdminText(productId);
  if (!cleanProductId) throw new Error("PRODUCT_ID_REQUIRED");

  await firestoreApi.setDoc(
    firestoreApi.doc(db, "products", cleanProductId),
    {
      id: cleanProductId,
      isVisible: false,
      isDeleted: true,
      deletedAtIso: new Date().toISOString(),
      updatedAt: firestoreApi.serverTimestamp(),
    },
    { merge: true }
  );
  return { id: cleanProductId };
}
