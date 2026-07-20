import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ─── JWT Secret ─────────────────────────────────────────────────────────────
// SECURITY: JWT_SECRET MUST be set in production via environment variable.
// A strong secret (32+ random chars) should be generated and kept secret.
// Example: openssl rand -hex 32
const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      // Hard fail in production — never use a fallback secret in prod
      throw new Error("FATAL: JWT_SECRET environment variable is required in production.");
    }
    // Development-only fallback — logs a prominent warning
    console.warn(
      "\x1b[33m[SECURITY WARNING]\x1b[0m JWT_SECRET is not set. " +
      "Using insecure development fallback. Set JWT_SECRET in production!"
    );
    return "bayt-al-fann-dev-secret-DO-NOT-USE-IN-PRODUCTION";
  }
  return secret;
})();

export interface AuthRequest extends Request {
  adminId?: number;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  // Guard against empty token strings
  if (!token || token.length === 0) {
    res.status(401).json({ error: "Unauthorized: no token provided" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { adminId: number };
    req.adminId = payload.adminId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function generateToken(adminId: number): string {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: "7d" });
}

