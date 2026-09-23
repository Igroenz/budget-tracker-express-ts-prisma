import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logging.js";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - startTime}ms`);
  });
  next();
}