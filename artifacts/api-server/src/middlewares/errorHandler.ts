import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(err.message);
  const status = (err as any).status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
}
