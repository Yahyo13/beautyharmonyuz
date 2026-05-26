import { createExpiredSessionCookie, sendJson } from "./_security.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { message: "Method not allowed" });
  }

  response.setHeader("Set-Cookie", createExpiredSessionCookie());
  return sendJson(response, 200, { ok: true });
}
