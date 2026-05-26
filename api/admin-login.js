import { createSessionCookie, fetchJson, readJsonBody, requiredEnv, sendJson, verifyPassword } from "./_security.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { message: "Method not allowed" });
  }

  try {
    const { login = "", password = "" } = await readJsonBody(request);
    const normalizedLogin = String(login).trim().toLowerCase();

    if (!normalizedLogin || !password) {
      return sendJson(response, 400, { message: "Login and password are required" });
    }

    const admins = await fetchJson(requiredEnv("ADMIN_API_URL"));
    const admin = Array.isArray(admins)
      ? admins.find((item) => item.active !== false && String(item.login || "").trim().toLowerCase() === normalizedLogin)
      : null;

    if (!admin || !verifyPassword(String(password), admin)) {
      return sendJson(response, 401, { message: "Invalid login or password" });
    }

    response.setHeader("Set-Cookie", createSessionCookie(admin));
    return sendJson(response, 200, {
      user: {
        login: admin.login,
        name: admin.name || admin.login,
        role: admin.role || "admin",
      },
    });
  } catch (error) {
    return sendJson(response, 500, { message: error.message || "Admin login failed" });
  }
}
