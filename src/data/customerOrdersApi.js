import { getFirestoreClient, hasFirebaseConfig } from "./firebaseCatalogApi";

export const orderStatuses = [
  { value: "new", labelRu: "Новый", labelUz: "Yangi" },
  { value: "processing", labelRu: "В обработке", labelUz: "Jarayonda" },
  { value: "packed", labelRu: "Собирается", labelUz: "Yig'ilmoqda" },
  { value: "delivered", labelRu: "Доставлен", labelUz: "Yetkazildi" },
  { value: "cancelled", labelRu: "Отменён", labelUz: "Bekor qilingan" },
];

export function hasOrdersConfig() {
  return hasFirebaseConfig();
}

export function getOrderStatusLabel(status, language = "ru") {
  const found = orderStatuses.find((item) => item.value === status) || orderStatuses[0];
  return language === "uz" ? found.labelUz : found.labelRu;
}

function normalizeText(value = "") {
  return String(value || "").trim();
}

function normalizeNumber(value) {
  const parsed = Number(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function normalizeOrderItems(items = []) {
  return items
    .map((item) => {
      const product = item.product || {};
      const quantity = Math.max(1, Number.parseInt(item.quantity, 10) || 1);
      const price = normalizeNumber(product.price);

      return {
        productId: product.id || item.productId || "",
        titleRu: product.nameRu || product.name || product.uzumTitle || "",
        titleUz: product.nameUz || product.nameRu || product.name || product.uzumTitle || "",
        brand: product.brand || "",
        brandSlug: product.brandSlug || "",
        category: product.category || "",
        volume: product.volume || "",
        image: product.image || "",
        href: product.href || "",
        price,
        quantity,
        subtotal: price * quantity,
      };
    })
    .filter((item) => item.productId);
}

function normalizeOrder(document) {
  const data = document.data ? document.data() : document;
  return {
    id: document.id || data.id || "",
    ...data,
    items: Array.isArray(data.items) ? data.items : [],
    total: normalizeNumber(data.total),
    status: data.status || "new",
  };
}

export async function createCustomerOrder({ customerUser, customerProfile, form, items, total, language = "ru" }) {
  const client = await getFirestoreClient();
  if (!client) throw new Error("FIREBASE_NOT_CONFIGURED");

  const { db, firestoreApi } = client;
  const orderItems = normalizeOrderItems(items);
  if (orderItems.length === 0) throw new Error("ORDER_EMPTY");

  const createdAtIso = new Date().toISOString();
  const customerName = normalizeText(form.name) || normalizeText(`${customerProfile?.firstName || ""} ${customerProfile?.lastName || ""}`);
  const payload = {
    status: "new",
    customerUid: customerUser?.uid || "",
    customerEmail: customerUser?.email || customerProfile?.email || "",
    customerName,
    phoneNumber: normalizeText(form.phoneNumber),
    city: normalizeText(form.city),
    address: normalizeText(form.address),
    comment: normalizeText(form.comment),
    language,
    items: orderItems,
    itemCount: orderItems.reduce((sum, item) => sum + item.quantity, 0),
    total: normalizeNumber(total) || orderItems.reduce((sum, item) => sum + item.subtotal, 0),
    createdAtIso,
    updatedAtIso: createdAtIso,
    createdAt: firestoreApi.serverTimestamp(),
    updatedAt: firestoreApi.serverTimestamp(),
  };

  const orderRef = await firestoreApi.addDoc(firestoreApi.collection(db, "orders"), payload);
  return { id: orderRef.id, ...payload };
}

export async function fetchCustomerOrders() {
  const client = await getFirestoreClient();
  if (!client) return [];

  const { db, firestoreApi } = client;
  const ordersRef = firestoreApi.collection(db, "orders");
  let snapshot;

  try {
    snapshot = await firestoreApi.getDocs(firestoreApi.query(ordersRef, firestoreApi.orderBy("createdAtIso", "desc")));
  } catch {
    snapshot = await firestoreApi.getDocs(ordersRef);
  }

  return snapshot.docs
    .map(normalizeOrder)
    .sort((left, right) => new Date(right.createdAtIso || 0).getTime() - new Date(left.createdAtIso || 0).getTime());
}

export async function updateCustomerOrderStatus(orderId, status) {
  const nextStatus = orderStatuses.some((item) => item.value === status) ? status : "new";
  const client = await getFirestoreClient();
  if (!client) throw new Error("FIREBASE_NOT_CONFIGURED");

  const { db, firestoreApi } = client;
  const updatedAtIso = new Date().toISOString();

  await firestoreApi.setDoc(
    firestoreApi.doc(db, "orders", orderId),
    {
      status: nextStatus,
      updatedAtIso,
      statusUpdatedAt: firestoreApi.serverTimestamp(),
      updatedAt: firestoreApi.serverTimestamp(),
    },
    { merge: true }
  );

  return { id: orderId, status: nextStatus, updatedAtIso };
}
