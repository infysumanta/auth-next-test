import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";

import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import { compress } from "hono/compress";
import { secureHeaders } from "hono/secure-headers";
import { cache } from "hono/cache";

import { getUserSession, handleLogin, handleLogout } from "./_handler/auth";
import { sessionMiddleware } from "./_middleware/session";

const PROXY_BASE_URL = "https://dummyjson.com";

const app = new Hono();

// Security headers middleware
app.use(
  "*",
  secureHeaders({
    strictTransportSecurity: "max-age=31536000; includeSubDomains",
    xFrameOptions: "DENY",
    xContentTypeOptions: "nosniff",
    referrerPolicy: "strict-origin-when-cross-origin",
  }),
);

// Cache control middleware
app.use(
  "*",
  cache({
    cacheName: "proxy-cache",
    cacheControl: "public, max-age=60, stale-while-revalidate=300",
  }),
);

// Logger middleware for request/response logging
app.use("*", logger());

// CORS middleware
app.use(
  "*",
  cors({
    origin: "*", // In production, replace with specific origins
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Refresh-Token"],
    exposeHeaders: ["X-Response-Time"],
    maxAge: 600,
    credentials: true,
  }),
);

// Timing middleware to track response times
app.use("*", timing());

// Compression middleware for response payload
app.use("*", compress());

// Middleware to inject auth headers from session
app.use("*", sessionMiddleware);

// Error handling and logging middleware
app.use("*", async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Proxy error:", {
      error,
      method: c.req.method,
      path: c.req.path,
      query: Object.fromEntries(new URL(c.req.url).searchParams),
      timestamp: new Date().toISOString(),
    });
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Auth routes
app.post("/api/auth/login", handleLogin);
app.post("/api/auth/logout", handleLogout);
app.get("/api/auth/session", getUserSession);

// Generic handler for all other routes
app.all("*", async (c) => {
  const url = new URL(c.req.url);
  const proxyPath = url.pathname.replace("/api/", "");
  const targetUrl = `${PROXY_BASE_URL}/${proxyPath}`;

  c.res.headers.set("X-Proxy-Path", proxyPath);

  try {
    console.log(`Proxying ${c.req.method} request to: ${targetUrl}`);
    const response = await fetch(targetUrl, {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: ["GET", "HEAD"].includes(c.req.method) ? undefined : c.req.raw.body,
    });

    const data = await response.json();
    const status = response.status as 200 | 201 | 400 | 401 | 403 | 404 | 500;
    c.res.headers.set("X-Proxy-Status", status.toString());

    return c.json(data, { status });
  } catch {
    throw new HTTPException(500, {
      message: `Failed to ${c.req.method.toLowerCase()} data`,
    });
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const HEAD = handle(app);
export const OPTIONS = handle(app);
