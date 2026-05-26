import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const root = join(fileURLToPath(new URL("..", import.meta.url)), "dist");
const port = Number(process.env.PORT || 4173);
const apiHandlers = new Map([
  ["/api/admin-login", () => import("../api/admin-login.js")],
  ["/api/admin-logout", () => import("../api/admin-logout.js")],
  ["/api/admin-requests", () => import("../api/admin-requests.js")],
  ["/api/admin-session", () => import("../api/admin-session.js")],
  ["/api/partner-requests", () => import("../api/partner-requests.js")],
]);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function loadLocalEnv() {
  const envPath = join(projectRoot, ".env.local");
  if (!existsSync(envPath)) return;

  const content = await readFile(envPath, "utf8");
  content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .forEach((line) => {
      const [key, ...valueParts] = line.split("=");
      process.env[key.trim()] ||= valueParts.join("=").trim();
    });
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  if (apiHandlers.has(url.pathname)) {
    try {
      const module = await apiHandlers.get(url.pathname)();
      return module.default(request, response);
    } catch (error) {
      response.writeHead(500, { "Content-Type": types[".json"] });
      response.end(JSON.stringify({ message: error.message || "API handler failed" }));
      return undefined;
    }
  }

  const cleanPath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, cleanPath === "/" ? "index.html" : cleanPath);

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": types[extname(filePath)] || "application/octet-stream",
    });
    response.end(file);
  } catch {
    const fallback = await readFile(join(root, "index.html"));
    response.writeHead(200, { "Content-Type": types[".html"] });
    response.end(fallback);
  }
});

await loadLocalEnv();

server.listen(port, "127.0.0.1", () => {
  console.log(`Beauty Harmony site is running at http://127.0.0.1:${port}`);
});
