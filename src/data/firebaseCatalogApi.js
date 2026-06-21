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
