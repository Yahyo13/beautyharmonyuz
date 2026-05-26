import {
  fetchJson,
  getClientIp,
  getCurrentMonthKey,
  hasReachedMonthlyRequestLimit,
  hashClientIp,
  monthlyPartnerRequestLimit,
  readJsonBody,
  requiredEnv,
  sendJson,
  validatePartnerRequest,
  verifyTurnstileToken,
} from "./_security.js";

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

    const clientIp = getClientIp(request);
    const captchaIsValid = await verifyTurnstileToken(body.turnstileToken, clientIp);

    if (!captchaIsValid) {
      return sendJson(response, 400, { code: "TURNSTILE_FAILED", message: "Captcha verification failed" });
    }

    const ipHash = hashClientIp(clientIp);
    const monthKey = getCurrentMonthKey();
    const existingRequests = await fetchJson(requiredEnv("PARTNER_REQUESTS_API_URL"));

    if (hasReachedMonthlyRequestLimit(existingRequests, ipHash, monthKey)) {
      return sendJson(response, 429, {
        code: "MONTHLY_LIMIT_REACHED",
        message: `Monthly request limit reached: ${monthlyPartnerRequestLimit}`,
      });
    }

    const savedRequest = await fetchJson(requiredEnv("PARTNER_REQUESTS_API_URL"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validation.request,
        ipHash,
        monthKey,
      }),
    });

    return sendJson(response, 201, savedRequest);
  } catch (error) {
    return sendJson(response, 500, { message: error.message || "Partner request was not saved" });
  }
}
