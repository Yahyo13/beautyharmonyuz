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

let firestoreDb = null;
let firestoreApi = null;

async function getFirestoreDb() {
  if (!hasFirebaseConfig()) return null;
  if (!firestoreDb) {
    const [{ initializeApp }, firestoreModule] = await Promise.all([import("firebase/app"), import("firebase/firestore")]);
    const app = initializeApp(firebaseConfig);
    firestoreApi = firestoreModule;
    firestoreDb = firestoreModule.getFirestore(app);
  }
  return firestoreDb;
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
