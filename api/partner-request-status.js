import { fetchJson, formatUzbekPhoneNumber, isValidUzbekPhoneNumber, readJsonBody, requiredEnv, sendJson } from "./_security.js";

function normalizePhoneKey(value) {
  return String(value || "").replace(/\D/g, "");
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { message: "Method not allowed" });
  }

  try {
    const body = await readJsonBody(request);
    const phoneNumber = formatUzbekPhoneNumber(body.phoneNumber);

    if (!isValidUzbekPhoneNumber(phoneNumber)) {
      return sendJson(response, 400, { message: "Valid phone number is required" });
    }

    const phoneKey = normalizePhoneKey(phoneNumber);
    const requests = await fetchJson(requiredEnv("PARTNER_REQUESTS_API_URL"));
    const matches = Array.isArray(requests)
      ? requests
          .filter((item) => normalizePhoneKey(item.phoneNumber || item.phone || item["phone number"]) === phoneKey)
          .sort((left, right) => new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime())
          .slice(0, 6)
          .map((item) => ({
            id: item.id || "",
            company: item.company || "",
            type: item.type || item.format || "",
            status: item.status || "review",
            createdAt: item.createdAt || "",
            updatedAt: item.updatedAt || "",
          }))
      : [];

    return sendJson(response, 200, { phoneNumber, requests: matches });
  } catch (error) {
    return sendJson(response, 500, { message: error.message || "Partner request status was not loaded" });
  }
}
