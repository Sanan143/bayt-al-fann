import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// ─── Allowed Origins ────────────────────────────────────────────────────────
// Set ALLOWED_ORIGINS as a comma-separated list in your environment.
// Falls back to localhost for development only.
const rawOrigins = process.env.ALLOWED_ORIGINS || "http://localhost:5174,http://localhost:3000";
const ALLOWED_ORIGINS = rawOrigins.split(",").map((o) => o.trim());

// ─── Simple In-Memory Rate Limiter ──────────────────────────────────────────
// Limits each IP to MAX_REQUESTS per WINDOW_MS milliseconds.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 120;            // 120 req/min per IP (general)
const AUTH_MAX_REQUESTS = 10;        // 10 req/min per IP (auth routes)

interface RateLimitEntry { count: number; resetAt: number; }
const rateLimitStore = new Map<string, RateLimitEntry>();

function createRateLimiter(maxRequests: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip ?? "unknown";
    const now = Date.now();
    const entry = rateLimitStore.get(ip);

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
      return next();
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return;
    }
    next();
  };
}

export function createApp() {
  const app = express();

  // ── Security Headers ──────────────────────────────────────────────────────
  // Applied before all routes to ensure every response is hardened.
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    // HSTS: only enable if you serve over HTTPS in production
    if (process.env.NODE_ENV === "production") {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
  });

  // ── CORS ─────────────────────────────────────────────────────────────────
  // Only allow explicitly listed origins; reject others with a 403-style CORS block.
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow server-to-server requests (no origin) and whitelisted origins
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // ── Body Parsing ─────────────────────────────────────────────────────────
  // Limit payload size to 5MB to prevent DoS via oversized bodies.
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));

  // ── General Rate Limit ───────────────────────────────────────────────────
  app.use(createRateLimiter(MAX_REQUESTS));

  // ── Auth Rate Limit (stricter) ───────────────────────────────────────────
  app.use("/api/auth/login", createRateLimiter(AUTH_MAX_REQUESTS));

  // ── Routes ───────────────────────────────────────────────────────────────
  app.use("/api", router);

  // ── Error Handler ────────────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}

