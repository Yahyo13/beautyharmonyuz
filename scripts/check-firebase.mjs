import { readFileSync } from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.split("=")[0].trim(), l.split("=").slice(1).join("=").trim()])
);

console.log("Firebase Project:", env.VITE_FIREBASE_PROJECT_ID || "NOT SET");

if (!env.VITE_FIREBASE_API_KEY) {
  console.error("ERROR: Firebase env vars not found in .env.local");
  process.exit(1);
}

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);

try {
  const snap = await getDocs(collection(db, "products"));
  console.log("\n=== Firestore 'products' collection ===");
  console.log("Total documents:", snap.size);

  if (snap.size === 0) {
    console.log("\n❌ Collection is EMPTY — need to upload data!");
  } else {
    const first = snap.docs[0];
    const data = first.data();
    console.log("\n✅ First document:");
    console.log("  ID:", first.id);
    console.log("  Keys:", Object.keys(data).join(", "));
    console.log("  name:", data.name);
    console.log("  nameRu:", data.nameRu);
    console.log("  sortOrder:", data.sortOrder);
    console.log("  image:", data.image);
  }
} catch (e) {
  console.error("\n❌ Firestore ERROR:", e.code, e.message);
  if (e.code === "permission-denied") {
    console.log("\n⚠️  Check Firestore Security Rules — public read may be disabled!");
  }
}
