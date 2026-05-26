import { fetchJson, readJsonBody, requiredEnv, sendJson, validatePartnerRequest } from "./_security.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { message: "Method not allowed" });
  }

  try {
    const body = await readJsonBody(request);
    const validation = validatePartnerRequest(body);

    if (!validation.ok) {
      return sendJson(response, 400, { message: validation.message });
    }

    const savedRequest = await fetchJson(requiredEnv("PARTNER_REQUESTS_API_URL"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.request),
    });

    return sendJson(response, 201, savedRequest);
  } catch (error) {
    return sendJson(response, 500, { message: error.message || "Partner request was not saved" });
  }
}
