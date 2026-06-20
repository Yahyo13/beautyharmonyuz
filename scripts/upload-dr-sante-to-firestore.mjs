import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, writeBatch } from "firebase/firestore";
import { localCatalogProducts } from "../src/data/catalogData.js";

function loadLocalEnv() {
  const envPath = new URL("../.env.local", import.meta.url);
  let content = "";

  try {
    content = awaitFile(envPath);
  } catch {
    return;
  }

  content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .forEach((line) => {
      const separatorIndex = line.indexOf("=");
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    });
}

function awaitFile(url) {
  return new TextDecoder().decode(readFileSync(url));
}

async function main() {
  loadLocalEnv();

  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };

  const missingKeys = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(`Missing Firebase config keys: ${missingKeys.join(", ")}`);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const batch = writeBatch(db);
  const productIds = new Set(localCatalogProducts.map((product) => product.id));
  const currentSnapshot = await getDocs(collection(db, "products"));

  localCatalogProducts.forEach((product, index) => {
    const documentRef = doc(db, "products", product.id);
    batch.set(documentRef, {
      ...product,
      sortOrder: index + 1,
      updatedAt: new Date().toISOString(),
    });
  });

  currentSnapshot.forEach((snapshot) => {
    if (productIds.has(snapshot.id)) return;
    batch.delete(snapshot.ref);
  });

  await batch.commit();
  console.log(`Uploaded ${localCatalogProducts.length} catalog products to Firestore products collection.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
