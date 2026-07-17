import { getFirestoreClient, hasFirebaseConfig } from "./firebaseCatalogApi";

const localSupportStorageKey = "beauty-harmony-local-support-threads";

export function hasSupportConfig() {
  return hasFirebaseConfig();
}

function normalizeText(value = "") {
  return String(value || "").trim();
}

function normalizeThread(document) {
  const data = document.data ? document.data() : document;
  return {
    id: document.id || data.id || "",
    ...data,
    topic: data.topic === "orders" ? "orders" : "questions",
    messages: Array.isArray(data.messages) ? data.messages : [],
    unreadByAdmin: Number(data.unreadByAdmin) || 0,
    unreadByCustomer: Number(data.unreadByCustomer) || 0,
  };
}

function normalizeTopic(topic = "questions") {
  return topic === "orders" ? "orders" : "questions";
}

function getSupportThreadId(customerUser, topic = "questions") {
  const cleanTopic = normalizeTopic(topic);
  return cleanTopic === "orders" ? `${customerUser.uid}-orders` : customerUser.uid;
}

function readLocalSupportThreads() {
  if (typeof localStorage === "undefined") return {};

  try {
    return JSON.parse(localStorage.getItem(localSupportStorageKey) || "{}") || {};
  } catch {
    return {};
  }
}

function writeLocalSupportThreads(threads) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(localSupportStorageKey, JSON.stringify(threads || {}));
}

function getLocalSupportThread(customerUser, customerProfile, topic = "questions") {
  if (!customerUser?.uid) return null;

  const cleanTopic = normalizeTopic(topic);
  const threadId = getSupportThreadId(customerUser, cleanTopic);
  const threads = readLocalSupportThreads();
  const savedThread = threads[threadId];

  if (savedThread) return normalizeThread(savedThread);

  const createdAtIso = new Date().toISOString();
  const thread = {
    id: threadId,
    customerUid: customerUser.uid,
    customerEmail: customerUser.email || "",
    customerName: normalizeText(`${customerProfile?.firstName || ""} ${customerProfile?.lastName || ""}`) || customerUser.email || "",
    topic: cleanTopic,
    status: "open",
    messages: [],
    unreadByAdmin: 0,
    unreadByCustomer: 0,
    createdAtIso,
    updatedAtIso: createdAtIso,
    isLocalFallback: true,
  };

  threads[threadId] = thread;
  writeLocalSupportThreads(threads);
  return thread;
}

function saveLocalSupportThread(thread) {
  const threads = readLocalSupportThreads();
  threads[thread.id] = { ...thread, isLocalFallback: true };
  writeLocalSupportThreads(threads);
  return threads[thread.id];
}

function buildMessage(text, author, authorName) {
  const createdAtIso = new Date().toISOString();
  return {
    id: `${createdAtIso}-${Math.random().toString(16).slice(2)}`,
    author,
    authorName,
    text: normalizeText(text),
    createdAtIso,
  };
}

export async function getCustomerSupportThread(customerUser, customerProfile, topic = "questions") {
  if (!customerUser?.uid) return null;

  const client = await getFirestoreClient();
  if (!client) return getLocalSupportThread(customerUser, customerProfile, topic);

  try {
    const { db, firestoreApi } = client;
    const cleanTopic = normalizeTopic(topic);
    const threadRef = firestoreApi.doc(db, "supportThreads", getSupportThreadId(customerUser, cleanTopic));
    const snapshot = await firestoreApi.getDoc(threadRef);

    if (snapshot.exists()) return normalizeThread({ id: snapshot.id, ...snapshot.data() });

    const createdAtIso = new Date().toISOString();
    const payload = {
      id: getSupportThreadId(customerUser, cleanTopic),
      customerUid: customerUser.uid,
      customerEmail: customerUser.email || "",
      customerName: normalizeText(`${customerProfile?.firstName || ""} ${customerProfile?.lastName || ""}`) || customerUser.email || "",
      topic: cleanTopic,
      status: "open",
      messages: [],
      unreadByAdmin: 0,
      unreadByCustomer: 0,
      createdAtIso,
      updatedAtIso: createdAtIso,
      createdAt: firestoreApi.serverTimestamp(),
      updatedAt: firestoreApi.serverTimestamp(),
    };

    await firestoreApi.setDoc(threadRef, payload, { merge: true });
    return payload;
  } catch (error) {
    console.warn("[Support] Firestore thread unavailable:", error);
    return getLocalSupportThread(customerUser, customerProfile, topic);
  }
}

export async function sendCustomerSupportMessage({ customerUser, customerProfile, text, topic = "questions" }) {
  if (!customerUser?.uid) throw new Error("USER_MISSING");
  if (!normalizeText(text)) throw new Error("MESSAGE_EMPTY");

  const client = await getFirestoreClient();
  const saveLocalMessage = async () => {
    const cleanTopic = normalizeTopic(topic);
    const thread = getLocalSupportThread(customerUser, customerProfile, cleanTopic) || {};
    const message = buildMessage(text, "customer", thread.customerName || customerUser.email || "Customer");
    const messages = [...(thread.messages || []), message].slice(-120);
    return saveLocalSupportThread({
      ...thread,
      messages,
      unreadByAdmin: (Number(thread.unreadByAdmin) || 0) + 1,
      unreadByCustomer: 0,
      updatedAtIso: message.createdAtIso,
    });
  };

  if (!client) return saveLocalMessage();

  try {
    const { db, firestoreApi } = client;
    const cleanTopic = normalizeTopic(topic);
    const threadRef = firestoreApi.doc(db, "supportThreads", getSupportThreadId(customerUser, cleanTopic));
    const thread = (await getCustomerSupportThread(customerUser, customerProfile, cleanTopic)) || {};
    const message = buildMessage(text, "customer", thread.customerName || customerUser.email || "Customer");
    const messages = [...(thread.messages || []), message].slice(-120);

    await firestoreApi.setDoc(
      threadRef,
      {
        customerUid: customerUser.uid,
        customerEmail: customerUser.email || "",
        customerName: normalizeText(`${customerProfile?.firstName || ""} ${customerProfile?.lastName || ""}`) || customerUser.email || "",
        topic: cleanTopic,
        status: "open",
        messages,
        unreadByAdmin: (Number(thread.unreadByAdmin) || 0) + 1,
        unreadByCustomer: 0,
        updatedAtIso: message.createdAtIso,
        updatedAt: firestoreApi.serverTimestamp(),
      },
      { merge: true }
    );

    return { ...thread, messages, unreadByAdmin: (Number(thread.unreadByAdmin) || 0) + 1, updatedAtIso: message.createdAtIso };
  } catch (error) {
    console.warn("[Support] Firestore message save failed:", error);
    return saveLocalMessage();
  }
}

export async function fetchSupportThreads() {
  const client = await getFirestoreClient();
  if (!client) return [];

  const { db, firestoreApi } = client;
  const threadsRef = firestoreApi.collection(db, "supportThreads");
  let snapshot;

  try {
    snapshot = await firestoreApi.getDocs(firestoreApi.query(threadsRef, firestoreApi.orderBy("updatedAtIso", "desc")));
  } catch {
    snapshot = await firestoreApi.getDocs(threadsRef);
  }

  return snapshot.docs
    .map(normalizeThread)
    .sort((left, right) => new Date(right.updatedAtIso || 0).getTime() - new Date(left.updatedAtIso || 0).getTime());
}

export async function sendAdminSupportMessage({ threadId, text, adminName = "Beauty Harmony" }) {
  if (!threadId) throw new Error("THREAD_MISSING");
  if (!normalizeText(text)) throw new Error("MESSAGE_EMPTY");

  const client = await getFirestoreClient();
  if (!client) throw new Error("FIREBASE_NOT_CONFIGURED");

  const { db, firestoreApi } = client;
  const threadRef = firestoreApi.doc(db, "supportThreads", threadId);
  const snapshot = await firestoreApi.getDoc(threadRef);
  const thread = snapshot.exists() ? normalizeThread({ id: snapshot.id, ...snapshot.data() }) : { messages: [] };
  const message = buildMessage(text, "admin", adminName);
  const messages = [...(thread.messages || []), message].slice(-120);

  await firestoreApi.setDoc(
    threadRef,
    {
      messages,
      status: "open",
      unreadByAdmin: 0,
      unreadByCustomer: (Number(thread.unreadByCustomer) || 0) + 1,
      updatedAtIso: message.createdAtIso,
      updatedAt: firestoreApi.serverTimestamp(),
    },
    { merge: true }
  );

  return { ...thread, id: threadId, messages, unreadByCustomer: (Number(thread.unreadByCustomer) || 0) + 1, updatedAtIso: message.createdAtIso };
}
