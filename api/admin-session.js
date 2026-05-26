import { readAdminSession, sendJson } from "./_security.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return sendJson(response, 405, { message: "Method not allowed" });
  }

  const session = readAdminSession(request);
  if (!session) {
    return sendJson(response, 401, { authenticated: false });
  }

  return sendJson(response, 200, {
    authenticated: true,
    user: {
      login: session.login,
      name: session.name,
      role: session.role,
    },
  });
}
