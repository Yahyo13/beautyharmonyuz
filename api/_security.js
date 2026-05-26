import { createHash, createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

export const sessionCookieName = "bh_admin_session";
export const partnerRequestTypes = ["Оптовая Закупка", "Маркетплейс", "Розничная Сеть", "Дистрибуция"];

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

export function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

export async function readJsonBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body || "{}");

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

export function safeCompare(left, right) {
  const leftHash = createHash("sha256").update(String(left)).digest();
  const rightHash = createHash("sha256").update(String(right)).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function formatUzbekPhoneNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");
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
  return /^998\d{9}$/.test(String(value || "").replace(/\D/g, ""));
}

export function mapPartnerRequestType(value) {
  return localizedTypeMap.get(value) || value || partnerRequestTypes[0];
}

export function normalizePartnerRequest(form) {
  return {
    id: `b2b-${Date.now()}-${randomBytes(3).toString("hex")}`,
    name: String(form.name || "").trim(),
    phoneNumber: formatUzbekPhoneNumber(form.phoneNumber),
    city: String(form.city || "").trim(),
    company: String(form.company || "").trim(),
    type: mapPartnerRequestType(form.type),
    brands: String(form.brands || "").trim(),
    comment: String(form.comment || "").trim(),
    createdAt: new Date().toISOString(),
  };
}

export function validatePartnerRequest(form) {
  const request = normalizePartnerRequest(form);

  if (!request.name || !request.city || !request.company || !request.type) {
    return { ok: false, message: "Required fields are missing" };
  }

  if (!isValidUzbekPhoneNumber(request.phoneNumber)) {
    return { ok: false, message: "Phone number must include +998 and 9 local digits" };
  }

  return { ok: true, request };
}

export function hashPassword(password) {
  const iterations = 210000;
  const salt = randomBytes(16).toString("base64url");
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("base64url");
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

export function verifyPassword(password, admin) {
  if (admin.passwordHash) {
    const [algorithm, iterations, salt, expectedHash] = String(admin.passwordHash).split("$");
    if (algorithm !== "pbkdf2" || !iterations || !salt || !expectedHash) return false;

    const actualHash = pbkdf2Sync(password, salt, Number(iterations), 32, "sha256").toString("base64url");
    return safeCompare(actualHash, expectedHash);
  }

  return Boolean(admin.password) && safeCompare(password, admin.password);
}

function getCookie(request, name) {
  const header = request.headers.cookie || "";
  const cookies = Object.fromEntries(
    header
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [key, ...value] = item.split("=");
        return [key, decodeURIComponent(value.join("="))];
      })
  );

  return cookies[name] || "";
}

function signPayload(payload) {
  return createHmac("sha256", requiredEnv("ADMIN_SESSION_SECRET")).update(payload).digest("base64url");
}

export function createSessionCookie(admin) {
  const payload = Buffer.from(
    JSON.stringify({
      login: admin.login,
      name: admin.name || admin.login,
      role: admin.role || "admin",
      exp: Date.now() + 1000 * 60 * 60 * 8,
    })
  ).toString("base64url");
  const value = `${payload}.${signPayload(payload)}`;

  return `${sessionCookieName}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=28800`;
}

export function createExpiredSessionCookie() {
  return `${sessionCookieName}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function readAdminSession(request) {
  const cookie = getCookie(request, sessionCookieName);
  const [payload, signature] = cookie.split(".");
  if (!payload || !signature || !safeCompare(signature, signPayload(payload))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session.exp || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with ${response.status}`);
  }

  return payload;
}
