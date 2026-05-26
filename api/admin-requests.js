import { fetchJson, readAdminSession, requiredEnv, sendJson } from "./_security.js";

export default async function handler(request, response) {
  if (!["GET", "DELETE"].includes(request.method)) {
    return sendJson(response, 405, { message: "Method not allowed" });
  }

  if (!readAdminSession(request)) {
    return sendJson(response, 401, { message: "Unauthorized" });
  }

  try {
    if (request.method === "DELETE") {
      const url = new URL(request.url || "/", `http://${request.headers.host}`);
      const id = url.searchParams.get("id");

      if (!id) {
        return sendJson(response, 400, { message: "Request id is required" });
      }

      await fetchJson(`${requiredEnv("PARTNER_REQUESTS_API_URL")}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      return sendJson(response, 200, { ok: true, id });
    }

    const requests = await fetchJson(requiredEnv("PARTNER_REQUESTS_API_URL"));
    const sortedRequests = Array.isArray(requests)
      ? [...requests].sort((left, right) => {
          const leftTime = new Date(left.createdAt || 0).getTime();
          const rightTime = new Date(right.createdAt || 0).getTime();
          return rightTime - leftTime;
        })
      : [];

    return sendJson(response, 200, sortedRequests);
  } catch (error) {
    return sendJson(response, 500, { message: error.message || "Partner requests were not loaded" });
  }
}
