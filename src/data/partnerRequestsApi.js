export const partnerRequestTypes = ["Оптовая Закупка", "Маркетплейс", "Розничная Сеть", "Дистрибуция"];
export const partnerRequestStatuses = [
  { value: "review", labelRu: "На рассмотрении", labelUz: "Ko'rib chiqilmoqda" },
  { value: "accepted", labelRu: "Принята", labelUz: "Qabul qilindi" },
  { value: "rejected", labelRu: "Отклонена", labelUz: "Rad etildi" },
];

const localizedTypeMap = new Map([
  ["Оптовая Закупка", "Оптовая Закупка"],
  ["Оптовая закупка", "Оптовая Закупка"],
  ["Маркетплейс", "Маркетплейс"],
  ["Розничная Сеть", "Розничная Сеть"],
  ["Розничная сеть", "Розничная Сеть"],
  ["Дистрибуция", "Дистрибуция"],
  ["Ulgurji xarid", "Оптовая Закупка"],
  ["Marketpleys", "Маркетплейс"],
  ["Chakana tarmoq", "Розничная Сеть"],
  ["Distribyutsiya", "Дистрибуция"],
]);

export function mapPartnerRequestType(value) {
  return localizedTypeMap.get(value) || value || partnerRequestTypes[0];
}

export function getPartnerRequestStatusLabel(status, language = "ru") {
  const found = partnerRequestStatuses.find((item) => item.value === status) || partnerRequestStatuses[0];
  return language === "uz" ? found.labelUz : found.labelRu;
}

export function formatUzbekPhoneNumber(value) {
  const digits = value.replace(/\D/g, "");
  let localDigits = digits.startsWith("998") ? digits.slice(3) : digits;
  localDigits = localDigits.replace(/^0+/, "").slice(0, 9);

  const parts = [];
  if (localDigits.length > 0) parts.push(localDigits.slice(0, 2));
  if (localDigits.length > 2) parts.push(localDigits.slice(2, 5));
  if (localDigits.length > 5) parts.push(localDigits.slice(5, 7));
  if (localDigits.length > 7) parts.push(localDigits.slice(7, 9));

  return `+998${parts.length ? ` ${parts.join(" ")}` : ""}`;
}

export function isValidUzbekPhoneNumber(value) {
  return /^998\d{9}$/.test(value.replace(/\D/g, ""));
}

export function normalizePartnerRequest(form) {
  return {
    name: form.name.trim(),
    phoneNumber: formatUzbekPhoneNumber(form.phoneNumber),
    city: form.city.trim(),
    company: form.company.trim(),
    type: mapPartnerRequestType(form.type),
    brands: form.brands.trim(),
    comment: form.comment.trim(),
    turnstileToken: form.turnstileToken || "",
    createdAt: new Date().toISOString(),
  };
}

export async function createPartnerRequest(form) {
  const response = await fetch("/api/partner-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(normalizePartnerRequest(form)),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || "Partner request was not saved");
    error.code = payload.code;
    throw error;
  }

  return payload;
}

export async function fetchPartnerRequests() {
  const response = await fetch("/api/admin-requests", {
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error("Partner requests were not loaded");
  }

  const requests = await response.json();
  if (!Array.isArray(requests)) return [];

  return [...requests].sort((left, right) => {
    const leftTime = new Date(left.createdAt || 0).getTime();
    const rightTime = new Date(right.createdAt || 0).getTime();
    return rightTime - leftTime;
  });
}

export async function deletePartnerRequest(id) {
  const response = await fetch(`/api/admin-requests?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "same-origin",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Partner request was not deleted");
  }

  return payload;
}

export async function updatePartnerRequestStatus(id, status) {
  const response = await fetch(`/api/admin-requests?id=${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ status }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Partner request status was not updated");
  }

  return payload;
}

export async function loginAdmin(credentials) {
  const response = await fetch("/api/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(credentials),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Admin login failed");
  }

  return payload.user;
}

export async function logoutAdmin() {
  await fetch("/api/admin-logout", {
    method: "POST",
    credentials: "same-origin",
  });
}

export async function getAdminSession() {
  const response = await fetch("/api/admin-session", {
    credentials: "same-origin",
  });

  if (!response.ok) return null;

  const payload = await response.json().catch(() => ({}));
  return payload.authenticated ? payload.user : null;
}
